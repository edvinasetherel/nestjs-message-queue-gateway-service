import PropertyValidationError from "#adapters/startup/properties/error.js";

type PropertyOptions = (string | undefined)[];

export function getRequiredStringProperty(name: string, properties: NodeJS.Dict<string>): string
{
    const value = properties[name]?.trim();
    if (!value)
    {
        throw new PropertyValidationError(`Property ${name} is required`);
    }
    return value;
}

export function getEnumProperty(name: string, properties: NodeJS.Dict<string>, options: PropertyOptions)
{
    const value = properties[name]?.trim();
    if (options.includes(value))
    {
        return value;
    }
    throw new PropertyValidationError(`Property ${name} can only be one of [${options.join(",")}]`);
}
