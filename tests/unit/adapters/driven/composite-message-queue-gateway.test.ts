import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryMessageQueueGateway } from "@/adapters/driven/in-memory-message-queue-gateway.js";
import { CompositeMessageQueueGateway } from "@/adapters/driven/composite-message-queue-gateway.js";
import InMemoryQueueProvider from "@/adapters/driven/in-memory-queue-provider.js";

describe("InMemoryMessageQueueGateway", () =>
{
    let queueGateway: CompositeMessageQueueGateway;
    let providers: InMemoryQueueProvider[];
    beforeEach(() =>
    {
        providers = [
            new InMemoryQueueProvider(),
            new InMemoryQueueProvider(),
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
