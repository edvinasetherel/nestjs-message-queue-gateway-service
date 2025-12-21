import { beforeEach, describe, expect, it } from "vitest";
import InMemoryMessageQueueProvider from "#adapters/driven/message-queue-provider/in-memory.js";


describe("InMemoryQueueProvider", () =>
{
    let queueProvider: InMemoryMessageQueueProvider;
    beforeEach(() =>
    {
        queueProvider = new InMemoryMessageQueueProvider();
    });
    it("should allow to publish a message to the queue", async () =>
    {
        const message = "test";
        expect(
            queueProvider.queue.length == 0,
            "Queue expected to be empty before publishing",
        ).toBeTruthy();
        await queueProvider.publish(message);
        expect(
            queueProvider.queue.find((v) => v == message),
            "Message was published but not in the queue",
        ).toBeTruthy();
    });
});
