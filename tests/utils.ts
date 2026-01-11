import Message from "#app/domain/message.js";

export function createListOfQueuesWithListOfRandomMessages(nOfQueues: number, nOfMessages: number): Message[][]
{
    return Array.from(
        {
            length: nOfQueues,
        },
        (_, queueIndex) =>
        {
            return Array.from(
                {
                    length: nOfMessages,
                },
                (_, messageIndex) => new Message({
                    queueName: `Queue-${queueIndex}`,
                    content: `Message-${messageIndex}`,
                }),
            );
        },
    );
}

type MessageFactoryOptions = {
    queueName?: string | null;
    content?: string | null;
    isPlain?: boolean;
};

export function createRandomMessage({
    queueName = null,
    content = null,
    isPlain = false,
}: MessageFactoryOptions = {})
{
    if (queueName === null)
    {
        queueName = `Queue-${crypto.randomUUID()}`;
    }
    if (content === null)
    {
        content = `Message-${crypto.randomUUID()}`;
    }

    const plainObj = {
        queueName: queueName,
        content: content,
    };

    return isPlain ? plainObj : new Message(plainObj);
}

type SubscribeFactoryOptions = {
    queueName?: string | null;
};

export function createSubscribeRequest({
    queueName = null,
}: SubscribeFactoryOptions = {})
{
    if (queueName === null)
    {
        queueName = `Queue-${crypto.randomUUID()}`;
    }

    return {
        queueName: queueName,
    };
}

export function createListOfSubscribeRequests(queues: string[])
{
    return queues.map((queueName) => createSubscribeRequest({
        queueName,
    }));
}
