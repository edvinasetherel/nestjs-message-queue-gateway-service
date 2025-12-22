import { Result } from "#utils/result.js";
import { getEnumProperty, getRequiredStringProperty } from "#adapters/startup/properties/utils.js";
import PropertyValidationError from "#adapters/startup/properties/error.js";

export interface RabbitMqProperties
{
    readonly type: "rabbitmq";
    readonly url: string;
    readonly queueNames: string[];
}

export interface SqsProperties
{
    readonly type: "sqs";
    readonly endpoint: string;
    readonly region: string;
    readonly queueNames: string[];
}

export interface AwsCredentials
{
    readonly accessKeyId: string;
    readonly secretAccessKey: string;
}

type ProviderProperties = RabbitMqProperties | SqsProperties;

type MessageQueueProperties = {
    providers: ProviderProperties[];
};

export type AppProperties = {
    host: string;
    hostPort: string;
    messageQueue: MessageQueueProperties;
    awsCredentials: AwsCredentials;
};

function retrieveSqsProperties(properties: NodeJS.Dict<string>): SqsProperties | null
{
    const endpointPropertyName = "MESSAGE_QUEUE_SQS_ENDPOINT";
    const regionPropertyName = "MESSAGE_QUEUE_SQS_REGION";
    const queueNamesPropertyName = "MESSAGE_QUEUE_SQS_QUEUES";
    const endpoint = getRequiredStringProperty(endpointPropertyName, properties);
    const region = getRequiredStringProperty(regionPropertyName, properties);
    const queueNames = getRequiredStringProperty(queueNamesPropertyName, properties);

    const queueNamesArray = queueNames.split(",").map((queueName) => queueName.trim())
        .filter((queueName) => queueName);
    if (queueNamesArray.length === 0)
    {
        throw new PropertyValidationError(`Property ${queueNamesPropertyName} must contain at least one queue name comma separated`);
    }

    return {
        type: "sqs",
        endpoint,
        region,
        queueNames: queueNamesArray,
    };
}

function retrieveRabbitMqProperties(properties: NodeJS.Dict<string>): RabbitMqProperties | null
{
    const urlPropertyName = "MESSAGE_QUEUE_RABBITMQ_URL";
    const queueNamesPropertyName = "MESSAGE_QUEUE_RABBITMQ_QUEUES";
    const url = getRequiredStringProperty(urlPropertyName, properties);
    const queueNames = getRequiredStringProperty(queueNamesPropertyName, properties);
    const queueNamesArray = queueNames.split(",").map((queueName) => queueName.trim())
        .filter((queueName) => queueName);
    if (queueNamesArray.length === 0)
    {
        throw new PropertyValidationError(`Property ${queueNamesPropertyName} must contain at least one queue name comma separated`);
    }
    return {
        type: "rabbitmq",
        url,
        queueNames: queueNamesArray,
    };
}

function getMessageQueueProperties(properties: NodeJS.Dict<string>): MessageQueueProperties
{
    const isRabbitMqActive = getEnumProperty("MESSAGE_QUEUE_RABBITMQ_ACTIVE", properties, ["1", "0"]) === "1";
    const rabbitMqProperties = (isRabbitMqActive && retrieveRabbitMqProperties(properties)) || null;
    const isSqsActive = getEnumProperty("MESSAGE_QUEUE_SQS_ACTIVE", properties, ["1", "0"]) === "1";
    const sqsProperties = (isSqsActive && retrieveSqsProperties(properties)) || null;
    const providers = [rabbitMqProperties, sqsProperties].filter((provider) => provider !== null);
    return {
        providers: providers,
    };
}

function getAwsCredentials(properties: NodeJS.Dict<string>): AwsCredentials
{
    const accessKeyId = getRequiredStringProperty("AWS_ACCESS_KEY_ID", properties);
    const secretAccessKey = getRequiredStringProperty("AWS_SECRET_ACCESS_KEY", properties);
    return {
        accessKeyId,
        secretAccessKey,
    };
}

export function retrieveProperties(properties: NodeJS.Dict<string>): Result<AppProperties>
{
    try
    {
        return Result.success({
            host: getRequiredStringProperty("HOST", properties),
            hostPort: getRequiredStringProperty("HOST_PORT", properties),
            messageQueue: getMessageQueueProperties(properties),
            awsCredentials: getAwsCredentials(properties),
        });
    }
    catch (e)
    {
        return Result.failure(e);
    }
}
