import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryMessageQueueGateway } from "#adapters/driven/in-memory-message-queue-gateway.js";

describe("InMemoryMessageQueueGateway", () =>
{
    let queueGateway: InMemoryMessageQueueGateway;
    beforeEach(() =>
    {
        queueGateway = new InMemoryMessageQueueGateway();
    });
    it("should allow to publish a message to the queue", async () =>
    {
        const message = "test";
        expect(
            queueGateway.queue.length == 0,
            "Queue expected to be empty before publishing",
        ).toBeTruthy();
        await queueGateway.publish(message);
        expect(
            queueGateway.queue.find((v) => v == message),
            "Message was published but not in the queue",
        ).toBeTruthy();
    });
});
