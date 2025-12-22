export default class UnrecognizedQueueError extends Error
{
    constructor(queueName: string)
    {
        const message = `Cannot publish message to queue ${queueName}. Queue unrecognized`;
        super(message);
        this.name = this.constructor.name;
    }
}
