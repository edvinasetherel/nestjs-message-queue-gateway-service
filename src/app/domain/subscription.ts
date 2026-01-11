import {
    assert_string,
} from "#utils/assertion.js";

export default class Subscription
{
    public readonly queueName: string;
    constructor({
        queueName,
    })
    {
        assert_string(
            queueName,
            "queueName must be a non-empty string",
            {
                minLength: 1,
            },
        );
        this.queueName = queueName;
    }
}
