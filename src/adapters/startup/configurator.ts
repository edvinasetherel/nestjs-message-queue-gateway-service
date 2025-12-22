import amqp from "amqplib";
import { Result } from "#utils/result.js";
import { MessageQueueService } from "#app/services/message-queue.service.js";
import { RabbitMqProvider } from "#adapters/driven/message-queue-provider/rabbit-mq.js";
import { MessageQueueProvider } from "#app/ports/driven/message-queue-provider.js";
import { CompositeMessageQueueGateway } from "#app/composite-message-queue-gateway.js";
import InMemoryMessageQueueProvider from "#adapters/driven/message-queue-provider/in-memory.js";
import { AppProperties, retrieveProperties } from "#adapters/startup/properties/properties.js";

export interface Dependencies
{
    messageQueueService: MessageQueueService;
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

async function buildMessageQueue(
    configuration: AppProperties,
): Promise<Result<CompositeMessageQueueGateway>>
{
    const providers: MessageQueueProvider[] = [];
    if (configuration.messageQueue.providers.length === 0)
    {
        return Result.success(new CompositeMessageQueueGateway([
            new InMemoryMessageQueueProvider(),
        ]));
    }
    for (const provider of configuration.messageQueue.providers)
    {
        if (provider.type === "rabbitmq")
        {
            const rabbitMqProvidersResult = await createRabbitMqProviders(
                provider.url,
                provider.queueNames,
            );
            if (rabbitMqProvidersResult.isFailure)
            {
                return Result.failure(rabbitMqProvidersResult.exceptionOrNull());
            }
            providers.push(...rabbitMqProvidersResult.getOrThrow());
        }
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
        messageQueueService: new MessageQueueService(
            messageQueueGatewayRes.getOrThrow(),
        ),
    });
}
