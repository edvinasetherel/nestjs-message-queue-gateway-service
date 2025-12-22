export interface MessageQueueProvider
{
    publish(message: string, queueName: string): Promise<void>;
    subscribe(handler: (message: string) => Promise<void>, queueName: string): Promise<void>;
    close(): Promise<void>;
    isClosed: boolean;
    readonly queueName: string;
}
