import { z } from "zod";

type AssertStringOptions = {
    minLength?: number;
    maxLength?: number;
};

export class AssertionError
    extends Error
{
    constructor(message: string)
    {
        super(message);
        this.name = "AssertionError";
    }
}

export function assert_string(
    value: string,
    message: string,
    options: AssertStringOptions = {},
)
{
    let schema = z.string();
    if (options.minLength !== undefined)
    {
        schema = schema.min(options.minLength);
    }
    if (options.maxLength !== undefined)
    {
        schema = schema.max(options.maxLength);
    }

    const result = schema.safeParse(value);
    if (!result.success)
    {
        throw new AssertionError(message);
    }
}
