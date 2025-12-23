export interface MessageQueueProvider
{
    publish(message: string): Promise<void>;
    subscribe(handler: (message: string) => Promise<void>): Promise<void>;
    close(): Promise<void>;
    isClosed: boolean;
    readonly queueName: string;
}
