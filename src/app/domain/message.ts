import { assert_string } from "#utils/assertion.js";

export default class Message
{
    readonly content: string;
    constructor({
        content,
    })
    {
        assert_string(
            content,
            "content must be a non-empty string",
            {
                minLength: 1,
            },
        );
        this.content = content;
    }
}
