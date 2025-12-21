
import { beforeEach, describe, expect, it } from "vitest";
import { CompositeMessageQueueGateway } from "#app/composite-message-queue-gateway.js";
import InMemoryMessageQueueProvider from "#adapters/driven/message-queue-provider/in-memory.js";

describe("InMemoryMessageQueueGateway", () =>
{
    let queueGateway: CompositeMessageQueueGateway;
    let providers: InMemoryMessageQueueProvider[];
    beforeEach(() =>
    {
        providers = [
            new InMemoryMessageQueueProvider(),
            new InMemoryMessageQueueProvider(),
        ];
        queueGateway = new CompositeMessageQueueGateway(providers);
    });
    it("should allow to publish a message to the queue", async () =>
    {
        const message = "test";
        providers.forEach((provider) =>
        {
            expect(
                provider.queue.length == 0,
                "Queue expected to be empty before publishing",
            ).toBeTruthy();
        });
        await queueGateway.publish(message);
        providers.forEach((provider) =>
        {
            expect(
                provider.queue.find((v) => v == message),
                "Message was published but not in the queue",
            ).toBeTruthy();
        });
    });
});
