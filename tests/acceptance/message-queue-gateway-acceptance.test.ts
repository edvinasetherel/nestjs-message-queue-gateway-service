import { describe, it } from "vitest";
import request from "supertest";
import { POST_MESSAGE_ENDPOINT_PATH } from "#adapters/driving/nestjs-rest-http/app.controller.js";

const BASE_URL = `http://${process.env.HOST}:${process.env.HOST_PORT}`;

describe("When the application publishes a message", () =>
{
    it.concurrent.each([
        { content: "Test" },
        { content: "Test 2" },
        { content: "Test 2" },
        { content: "Test 2" },
    ])("should deliver to a message to queue concurrently", async (message) =>
    {
        await request(BASE_URL)
            .post(POST_MESSAGE_ENDPOINT_PATH)
            .send(message)
            .set("Content-Type", "application/json")
            .expect(202);
    });

    it.concurrent.for([
        {},
        { content: "" },
        { content: 4 },
    ])("should fail to deliver to a queue if the message is malformed: Message(%s)", async (val) =>
    {
        await request(BASE_URL)
            .post(POST_MESSAGE_ENDPOINT_PATH)
            .send(val)
            .set("Content-Type", "application/json")
            .expect(400);
    });
});
