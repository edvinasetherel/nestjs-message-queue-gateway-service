import { IMessageQueueProvider } from "./IMessageQueueProvider";

export class CompositeMessageQueueGateway
{
    constructor(
        private readonly providers: IMessageQueueProvider[],
    )
    {}

    async publish(message: string): Promise<void>
    {
        for (const provider of this.providers)
        {
            await provider.publish(message);
        }
    }
}
