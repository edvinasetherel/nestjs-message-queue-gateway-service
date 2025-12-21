import { Result } from "#utils/result.js";
import { getEnumProperty, getRequiredStringProperty } from "#adapters/startup/properties/utils.js";
import PropertyValidationError from "#adapters/startup/properties/error.js";

interface RabbitMqProperties
{
    readonly type: "rabbitmq";
    readonly url: string;
    readonly queueNames: string[];
}

interface SqsProperties
{
    type: "sqs";
    queueUrl: string;
}

type ProviderProperties = RabbitMqProperties | SqsProperties;

type MessageQueueProperties = {
    isDummy: boolean;
    providers: ProviderProperties[];
};

export type AppProperties = {
    host: string;
    hostPort: string;
    messageQueue: MessageQueueProperties;
};

function getRabbitMqProperties(properties: NodeJS.Dict<string>): RabbitMqProperties | null
{
    const urlPropertyName = "MESSAGE_QUEUE_RABBITMQ_URL";
    const queueNamesPropertyName = "MESSAGE_QUEUE_RABBITMQ_QUEUES";
    const url = properties[urlPropertyName]?.trim();
    const queueNames = properties[queueNamesPropertyName]?.trim();
    if (url === undefined && queueNames === undefined)
    {
        return null;
    }
    if (!url)
    {
        throw new PropertyValidationError(`Property ${urlPropertyName} is required`);
    }
    if (!queueNames)
    {
        throw new PropertyValidationError(`Property ${queueNamesPropertyName} is required`);
    }
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
    const isDummy = getEnumProperty("MESSAGE_QUEUE_IS_DUMMY", properties, ["1", "0"]) === "1";
    if (isDummy)
    {
        return {
            isDummy,
            providers: [],
        };
    }
    const providers: ProviderProperties[] = [];
    const rabbitMqProperties = getRabbitMqProperties(properties);
    if (!rabbitMqProperties)
    {
        throw new PropertyValidationError("MESSAGE_QUEUE_RABBITMQ_URL and MESSAGE_QUEUE_RABBITMQ_QUEUES must be set");
    }
    providers.push(rabbitMqProperties);
    return {
        isDummy: false,
        providers: providers,
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
        });
    }
    catch (e)
    {
        return Result.failure(e);
    }
}
