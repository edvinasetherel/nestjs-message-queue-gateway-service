import { describe, it } from "vitest";
import request from "supertest";
import { POST_MESSAGE_ENDPOINT_PATH } from "#adapters/driving/nestjs-rest-http/app.controller.js";

import { createListOfQueuesWithListOfRandomMessages, createRandomMessage } from "#tests/utils.js";

const BASE_URL = `http://${process.env.HOST}:${process.env.HOST_PORT}`;

describe("When the application publishes a message", () =>
{
    it.concurrent.each(
        createListOfQueuesWithListOfRandomMessages(3, 10),
    )("should deliver to a message to queue concurrently", async (message) =>
    {
        await request(BASE_URL)
            .post(POST_MESSAGE_ENDPOINT_PATH)
            .send(message)
            .set("Content-Type", "application/json")
            .expect(202);
    });

    it.concurrent.for([
        {},
        createRandomMessage({
            queueName: "",
            content: "",
            isPlain: true,
        }),
        createRandomMessage({
            queueName: "4",
            content: "",
            isPlain: true,
        }),
        createRandomMessage({
            queueName: "",
            content: "4",
            isPlain: true,
        }),
    ])("should fail to deliver to a queue if the message is malformed: Message(%s)", async (val) =>
    {
        await request(BASE_URL)
            .post(POST_MESSAGE_ENDPOINT_PATH)
            .send(val)
            .set("Content-Type", "application/json")
            .expect(400);
    });

    it("should fail to deliver to a queue if the queue name is unrecognized", async () =>
    {
        await request(BASE_URL)
            .post(POST_MESSAGE_ENDPOINT_PATH)
            .send(
                createRandomMessage({
                    queueName: "SHOULD_FAIL_THE_REQUEST",
                }),
            )
            .set("Content-Type", "application/json")
            .expect(404);
    });
});
