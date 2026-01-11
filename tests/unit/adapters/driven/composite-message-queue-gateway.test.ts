import {
    beforeEach, describe, expect, it,
} from "vitest";
import {
    CompositeMessageQueueGateway,
} from "#app/composite-message-queue-gateway.js";
import InMemoryMessageQueueProvider from "#adapters/driven/message-queue-provider/in-memory.js";
import {
    createRandomMessage,
} from "#tests/utils.js";
import Message from "#app/domain/message.js";
import UnrecognizedQueueError from "#app/unrecognized-queue-error.js";

async function testPublish(message: Message, subscribeToQueue: string, queueGateway: CompositeMessageQueueGateway)
{
    await queueGateway.subscribe(
        subscribeToQueue,
        async (consumedMessage) =>
        {
            expect(
                consumedMessage === message.content,
                `Handler received wrong message. Expected: ${message.content} but found ${consumedMessage}`,
            ).toBeTruthy();
        },
    );
    await queueGateway.publish(
        message.content,
        subscribeToQueue,
    );
}

describe(
    "InMemoryMessageQueueGateway",
    () =>
    {
        describe(
            "given single provider",
            () =>
            {
                let queueGateway: CompositeMessageQueueGateway;
                let providers: InMemoryMessageQueueProvider[];
                const queueName = "Queue-Single";
                beforeEach(() =>
                {
                    providers = [
                        new InMemoryMessageQueueProvider(queueName),
                    ];
                    queueGateway = new CompositeMessageQueueGateway(providers);
                });
                it(
                    "should allow to publish a message to the queue and receive it",
                    async () =>
                    {
                        await testPublish(
                            createRandomMessage({
                                queueName: queueName,
                            }),
                            queueName,
                            queueGateway,
                        );
                    },
                );
                it(
                    "should fail to publish a message to the unrecognized queue",
                    async () =>
                    {
                        await expect(queueGateway.publish(
                            "test",
                            "UNRECOGNIZED_QUEUE",
                        )).rejects.toThrow(
                            UnrecognizedQueueError,
                        );
                    },
                );
            },
        );
        describe(
            "given multiple providers",
            () =>
            {
                let queueGateway: CompositeMessageQueueGateway;
                let providers: InMemoryMessageQueueProvider[];
                const queueNames = Array.from(
                    {
                        length: 2,
                    },
                    (_, index) => `Queue-${index}`,
                );
                beforeEach(() =>
                {
                    providers = [
                        new InMemoryMessageQueueProvider(queueNames[0]),
                        new InMemoryMessageQueueProvider(queueNames[1]),
                    ];
                    queueGateway = new CompositeMessageQueueGateway(providers);
                });
                it(
                    "should allow to publish a message to queues and receive them accordingly",
                    async () =>
                    {
                        for (const queueName of queueNames)
                        {
                            await testPublish(
                                createRandomMessage({
                                    queueName: queueName,
                                }),
                                queueName,
                                queueGateway,
                            );
                        }
                    },
                );
                it(
                    "should fail to publish a message to the unrecognized queue",
                    async () =>
                    {
                        await expect(queueGateway.publish(
                            "test",
                            "UNRECOGNIZED_QUEUE",
                        )).rejects.toThrow(
                            UnrecognizedQueueError,
                        );
                    },
                );
            },
        );
    },
);
