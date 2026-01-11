import {
    CompositeMessageQueueGateway,
} from "#app/composite-message-queue-gateway.js";
import AlreadySubscribedError from "#app/services/already-subscribed-error.js";

export class SubscriberService
{
    private readonly activeSubscriptions = new Set<string>();
    private readonly pendingSubscriptions = new Set<string>();

    constructor(
        private readonly gateway: CompositeMessageQueueGateway,
    )
    {
    }

    async subscribe(queueName: string, handler: (message: string) => Promise<void>): Promise<void>
    {
        if (this.activeSubscriptions.has(queueName) || this.pendingSubscriptions.has(queueName))
        {
            throw new AlreadySubscribedError(queueName);
        }
        this.pendingSubscriptions.add(queueName);

        try
        {
            await this.gateway.subscribe(
                queueName,
                handler,
            );
            this.activeSubscriptions.add(queueName);
        }
        finally
        {
            this.pendingSubscriptions.delete(queueName);
        }
    }
}
