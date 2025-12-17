export const MESSAGE_QUEUE_GATEWAY = Symbol("MessageQueueGateway");

export interface MessageQueueGateway
{
    publish(message: string): Promise<void>;
}
