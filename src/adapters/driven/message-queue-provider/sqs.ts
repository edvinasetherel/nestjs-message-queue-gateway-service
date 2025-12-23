import { DeleteMessageCommand, ReceiveMessageCommand, SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { MessageQueueProvider } from "#app/ports/driven/message-queue-provider.js";
import ProviderError from "#adapters/driven/message-queue-provider/error.js";

export class SqsProvider
implements MessageQueueProvider
{
    private __client: SQSClient | null;
    private readonly __queueUrl: string;
    readonly queueName: string;

    constructor(
        client: SQSClient,
        queueUrl: string,
    )
    {
        this.__queueUrl = queueUrl;
        this.__client = client;
        this.queueName = this.__getQueueName(queueUrl);
    }

    private __getQueueName(queueUrl: string): string
    {
        const urlParts = queueUrl.split("/");
        return urlParts[urlParts.length - 1];
    }

    async subscribe(handler: (message: string) => Promise<void>): Promise<void>
    {
        if (this.isClosed)
        {
            throw new ProviderError(`The provider ${this} is closed. Cannot subscribe`);
        }

        const command = new ReceiveMessageCommand({
            QueueUrl: this.__queueUrl,
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 20,
            MessageAttributeNames: ["All"],
        });

        const response = await this.__client!.send(command);
        if (!response.Messages || response.Messages?.length <= 0)
        {
            return;
        }
        console.log(`Received ${response.Messages.length} message(s) from SQS queue: ${this.queueName}`);

        for (const message of response.Messages)
        {
            if (message.Body)
            {
                console.log(`Processing message from SQS:${this.queueName}: ${message.Body}`);
                await handler(message.Body);

                const deleteCommand = new DeleteMessageCommand({
                    QueueUrl: this.__queueUrl,
                    ReceiptHandle: message.ReceiptHandle!,
                });
                await this.__client!.send(deleteCommand);
                console.log(`Message deleted from SQS queue: ${this.queueName}`);
            }
        }
    }

    get isClosed()
    {
        return this.__client === null;
    }

    async publish(message: string): Promise<void>
    {
        if (this.isClosed)
        {
            throw new ProviderError(`The provider ${this} is closed. Cannot publish the message`);
        }

        console.log(`Publishing message ${message} to queue ${this.__queueUrl}`);

        const command = new SendMessageCommand({
            QueueUrl: this.__queueUrl,
            MessageBody: message,
        });

        await this.__client!.send(command);
    }

    async close(): Promise<void>
    {
        this.__client = null;
    }

    toString()
    {
        return `SqsProvider(IsClosed=${this.isClosed}, QueueUrl=${this.__queueUrl})`;
    }
}
