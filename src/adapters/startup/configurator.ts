import amqp from "amqplib";
import { Result } from "#utils/result.js";
import { MessagePublisherService } from "#app/services/message-publisher.service.js";
import { RabbitMqProvider } from "#adapters/driven/message-queue-provider/rabbit-mq.js";
import { MessageQueueProvider } from "#app/ports/driven/message-queue-provider.js";
import { CompositeMessageQueueGateway } from "#app/composite-message-queue-gateway.js";
import InMemoryMessageQueueProvider from "#adapters/driven/message-queue-provider/in-memory.js";
import {
    AppProperties,
    AwsCredentials,
    retrieveProperties,
    SqsProperties,
} from "#adapters/startup/properties/properties.js";
import { CreateQueueCommand, GetQueueUrlCommand, QueueDoesNotExist, SQSClient } from "@aws-sdk/client-sqs";
import { SqsProvider } from "#adapters/driven/message-queue-provider/sqs.js";

export interface Dependencies
{
    messageQueueService: MessagePublisherService;
}

async function createRabbitMqChannelModel(
    connectionUrl: string,
): Promise<Result<amqp.ChannelModel>>
{
    let channelModel: amqp.ChannelModel;
    try
    {
        channelModel = await amqp.connect(connectionUrl);
    }
    catch (e)
    {
        return Result.failure(e);
    }
    return Result.success(channelModel);
}

async function createRabbitMqProvider(
    channelModel: amqp.ChannelModel,
    queueName: string,
): Promise<Result<RabbitMqProvider>>
{
    let channel: amqp.Channel;
    try
    {
        channel = await channelModel.createChannel();
    }
    catch (e)
    {
        return Result.failure(e);
    }
    try
    {
        await channel.assertQueue(queueName, { durable: true });
    }
    catch (e)
    {
        return Result.failure(e);
    }

    return Result.success(new RabbitMqProvider(
        channel,
        queueName,
    ));
}

async function createRabbitMqProviders(
    connectionUrl: string,
    queueNames: string[],
): Promise<Result<RabbitMqProvider[]>>
{
    const channelModelRes = await createRabbitMqChannelModel(connectionUrl);
    if (channelModelRes.isFailure)
    {
        return Result.failure(channelModelRes.exceptionOrNull());
    }
    const providers: RabbitMqProvider[] = [];
    const channelModel = channelModelRes.getOrThrow();
    for (const queueName of queueNames)
    {
        const providerRes = await createRabbitMqProvider(
            channelModel,
            queueName,
        );
        if (providerRes.isFailure)
        {
            return Result.failure(providerRes.exceptionOrNull());
        }
        providers.push(providerRes.getOrThrow());
    }
    return Result.success(providers);
}

async function createSqsProvider(
    client: SQSClient,
    queueName: string,
): Promise<Result<SqsProvider>>
{
    let queueUrl: string;
    try
    {
        const command = new GetQueueUrlCommand({ QueueName: queueName });
        const response = await client.send(command);
        queueUrl = response.QueueUrl!;
    }
    catch (err)
    {
        if (!(err instanceof QueueDoesNotExist))
        {
            return Result.failure(err);
        }
        try
        {
            console.log(`Queue ${queueName} does not exist, creating...`);
            const createCommand = new CreateQueueCommand({ QueueName: queueName });
            const createResponse = await client.send(createCommand);
            queueUrl = createResponse.QueueUrl!;
            console.log(`Queue ${queueName} created at ${queueUrl}`);
        }
        catch (createErr)
        {
            return Result.failure(createErr);
        }
    }
    return Result.success(new SqsProvider(
        client,
        queueUrl,
    ));
}

async function createSqsProviders(
    awsCredentials: AwsCredentials,
    sqsProperties: SqsProperties,
): Promise<Result<SqsProvider[]>>
{
    let client: SQSClient;
    try
    {
        client = new SQSClient({
            endpoint: sqsProperties.endpoint,
            region: sqsProperties.region,
            credentials: {
                accessKeyId: awsCredentials.accessKeyId,
                secretAccessKey: awsCredentials.secretAccessKey,
            },
        });
    }
    catch (e)
    {
        return Result.failure(e);
    }
    const providers: SqsProvider[] = [];
    for (const queueName of sqsProperties.queueNames)
    {
        const providerRes = await createSqsProvider(
            client,
            queueName,
        );
        if (providerRes.isFailure)
        {
            return Result.failure(providerRes.exceptionOrNull());
        }
        providers.push(providerRes.getOrThrow());
    }
    return Result.success(providers);
}

async function buildMessageQueue(
    configuration: AppProperties,
): Promise<Result<CompositeMessageQueueGateway>>
{
    const providers: MessageQueueProvider[] = [];
    if (configuration.messageQueue.providers.length === 0)
    {
        console.log("No message queue providers configured, using in-memory provider");
        return Result.success(new CompositeMessageQueueGateway([
            new InMemoryMessageQueueProvider("dummy"),
        ]));
    }
    for (const provider of configuration.messageQueue.providers)
    {
        let providerRes: Result<MessageQueueProvider[]>;
        switch (provider.type)
        {
            case "rabbitmq":
                providerRes = await createRabbitMqProviders(
                    provider.url,
                    provider.queueNames,
                );
                break;
            case "sqs":
                providerRes = await createSqsProviders(
                    configuration.awsCredentials,
                    provider,
                );
                break;
        }
        if (providerRes.isFailure)
        {
            return Result.failure(providerRes.exceptionOrNull());
        }
        providers.push(...providerRes.getOrThrow());
    }
    return Result.success(
        new CompositeMessageQueueGateway(providers),
    );
}

export async function bootstrap(): Promise<Result<Dependencies>>
{
    const configurationsRes = retrieveProperties(process.env);
    if (configurationsRes.isFailure)
    {
        return Result.failure(configurationsRes.exceptionOrNull());
    }
    const config = configurationsRes.getOrThrow();
    const messageQueueGatewayRes = await buildMessageQueue(
        config,
    );
    if (messageQueueGatewayRes.isFailure)
    {
        return Result.failure(messageQueueGatewayRes.exceptionOrNull());
    }

    return Result.success({
        messageQueueService: new MessagePublisherService(
            messageQueueGatewayRes.getOrThrow(),
        ),
    });
}
