export interface MessageQueueProvider
{
    publish(message: string): Promise<void>;
}
