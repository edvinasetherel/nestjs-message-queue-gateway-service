import { IMessageQueueGateway } from "../../ports/driven/IMessageQueueGateway";

export default class InMemoryQueueProvider implements IMessageQueueGateway
{
    private readonly queue: string[];
    constructor()
    {
        this.queue = [];
    }

    async publish(message: string): Promise<void>
    {
        this.queue.push(message);
    }
}
