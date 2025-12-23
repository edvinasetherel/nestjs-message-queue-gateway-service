export default class AlreadySubscribedError extends Error
{
    constructor(queueName: string)
    {
        super(`Already subscribed to queue ${queueName}`);
        this.name = this.constructor.name;
    }
}
