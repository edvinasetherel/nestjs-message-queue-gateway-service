import { describe, it } from "vitest";
import request from "supertest";
import { POST_MESSAGE_ENDPOINT_PATH } from "#adapters/driving/app.controller.js";

const BASE_URL = "http://localhost:3000";

describe("When the application publishes a message", () =>
{
    it("should deliver to a queue", async () =>
    {
        const message = {
            content: "Test",
        };
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
