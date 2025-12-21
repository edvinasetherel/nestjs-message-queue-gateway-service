import { describe, expect, it } from "vitest";
import { getEnumProperty, getRequiredStringProperty } from "#adapters/startup/properties/utils.js";
import PropertyValidationError from "#adapters/startup/properties/error.js";

function assertProperty({
    value,
    expectedValue,
}: {
    value: unknown;
    expectedValue: unknown;
}): void
{
    expect(
        value === expectedValue,
        `Incorrect property value retrieved. Expected: \`${expectedValue}\` but found \`${value}\``,
    ).toBeTruthy();
}

describe("function getRequiredStringProperty", () =>
{
    it.each([
        { value: "1",
            expectedRetrievedValue: "1" },
        { value: " 1 ",
            expectedRetrievedValue: "1" },
        { value: "  ",
            expectedRetrievedValue: new PropertyValidationError("Property test is required") },
        { value: "",
            expectedRetrievedValue: new PropertyValidationError("Property test is required") },
    ])("should get test property with value $value as $expectedRetrievedValue",
        ({ value, expectedRetrievedValue }) =>
        {
            const key = "test";
            const map = {};
            map[key] = value;
            if (expectedRetrievedValue instanceof Error)
            {
                expect(() => getRequiredStringProperty(key, map)).toThrowError(expectedRetrievedValue);
                return;
            }
            assertProperty({
                value: getRequiredStringProperty(key, map),
                expectedValue: expectedRetrievedValue,
            });
        });
});

describe("function getEnumProperty", () =>
{
    it.each([
        { value: "1",
            expectedRetrievedValue: "1",
            options: ["1", "0"] },
        { value: " 1 ",
            expectedRetrievedValue: "1",
            options: ["1", "0"] },
        { value: " 0 ",
            expectedRetrievedValue: "0",
            options: ["1", "0"] },
        { value: "true",
            expectedRetrievedValue: "true",
            options: ["true", "false"] },
        { value: "falses",
            expectedRetrievedValue: new PropertyValidationError("Property test can only be one of [true,false]"),
            options: ["true", "false"] },
    ])(
        "should retrieve the property with value $value as $expectedRetrievedValue when options are $options",
        ({ value, expectedRetrievedValue, options }) =>
        {
            const key = "test";
            const map = {};
            map[key] = value;
            if (expectedRetrievedValue instanceof Error)
            {
                expect(() => getEnumProperty(key, map, options)).toThrowError(expectedRetrievedValue);
                return;
            }
            assertProperty({
                value: getEnumProperty(key, map, options),
                expectedValue: expectedRetrievedValue,
            });
        });
});
