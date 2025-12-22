import { beforeEach, describe, expect, it } from "vitest";
import InMemoryMessageQueueProvider from "#adapters/driven/message-queue-provider/in-memory.js";
import { createRandomMessage } from "#tests/utils.js";

describe("InMemoryQueueProvider", () =>
{
    let queueProvider: InMemoryMessageQueueProvider;
    beforeEach(() =>
    {
        queueProvider = new InMemoryMessageQueueProvider("Queue-0");
    });

    it("should allow to publish a message to the queue and receive it", async () =>
    {
        const message = createRandomMessage({
            queueName: queueProvider.queueName,
        });
        await queueProvider.subscribe(
            async (consumedMessage) =>
            {
                expect(
                    consumedMessage === message.content,
                    `Handler received wrong message. Expected: ${message.content} but found ${consumedMessage}`,
                ).toBeTruthy();
            },
        );
        await queueProvider.publish(message.content);
    });
});
