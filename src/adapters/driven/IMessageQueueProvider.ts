export interface IMessageQueueProvider
{
    publish(message: string): Promise<void>;
}
