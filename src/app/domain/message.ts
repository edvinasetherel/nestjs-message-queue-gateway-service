import {
    assert_string,
} from "#utils/assertion.js";

export default class Message
{
    public readonly content: string;
    public readonly queueName: string;
    constructor({
        content,
        queueName,
    })
    {
        assert_string(
            content,
            "content must be a non-empty string",
            {
                minLength: 1,
            },
        );
        assert_string(
            queueName,
            "queueName must be a non-empty string",
            {
                minLength: 1,
            },
        );
        this.content = content;
        this.queueName = queueName;
    }
}
