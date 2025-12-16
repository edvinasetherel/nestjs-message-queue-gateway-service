export const IMESSAGE_QUEUE_GATEWAY = Symbol("IMessageQueueGateway");

export interface IMessageQueueGateway
{
    publish(message: string): Promise<void>;
}
