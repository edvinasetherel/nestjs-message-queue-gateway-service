import {
    describe, it,
} from "vitest";
import request from "supertest";
import {
    POST_MESSAGE_ENDPOINT_PATH, POST_SUBSCRIBE_ENDPOINT_PATH,
} from "#adapters/driving/nestjs-rest-http/app.controller.js";

import {
    createListOfQueuesWithListOfRandomMessages,
    createRandomMessage,
    createSubscribeRequest,
    createListOfSubscribeRequests,
} from "#tests/utils.js";

const BASE_URL = `http://${process.env.HOST}:${process.env.HOST_PORT}`;

describe(
    "When the application publishes a message",
    () =>
    {
        it.concurrent.each(
            createListOfQueuesWithListOfRandomMessages(
                3,
                10,
            ),
        )(
            "should deliver a message to queue concurrently",
            async (message) =>
            {
                await request(BASE_URL)
                    .post(POST_MESSAGE_ENDPOINT_PATH)
                    .send(message)
                    .set(
                        "Content-Type",
                        "application/json",
                    )
                    .expect(202);
            },
        );

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
        ])(
            "should fail to deliver to a queue if the message is malformed: Message(%s)",
            async (val) =>
            {
                await request(BASE_URL)
                    .post(POST_MESSAGE_ENDPOINT_PATH)
                    .send(val)
                    .set(
                        "Content-Type",
                        "application/json",
                    )
                    .expect(400);
            },
        );

        it(
            "should fail to deliver to a queue if the queue name is unrecognized",
            async () =>
            {
                await request(BASE_URL)
                    .post(POST_MESSAGE_ENDPOINT_PATH)
                    .send(
                        createRandomMessage({
                            queueName: "SHOULD_FAIL_THE_REQUEST",
                        }),
                    )
                    .set(
                        "Content-Type",
                        "application/json",
                    )
                    .expect(404);
            },
        );
    },
);

describe(
    "When the application subscribes to queues",
    () =>
    {
        it.concurrent.each(
            createListOfSubscribeRequests(Array.from(
                {
                    length: 2,
                },
                (_, i) => `Queue-${i}`,
            )),
        )(
            "should successfully start listening to configured queues",
            async (subscribeRequest) =>
            {
                await request(BASE_URL)
                    .post(POST_SUBSCRIBE_ENDPOINT_PATH)
                    .send(subscribeRequest)
                    .set(
                        "Content-Type",
                        "application/json",
                    )
                    .expect(202);
            },
        );

        it.concurrent.for([
            {},
            {
                queueName: "",
            },
            {
                queueName: null,
            },
            {
                queueName: undefined,
            },
            {
                wrongField: "test",
            },
        ])(
            "should fail to subscribe if the request is malformed: SubscribeRequest(%s)",
            async (val) =>
            {
                await request(BASE_URL)
                    .post(POST_SUBSCRIBE_ENDPOINT_PATH)
                    .send(val)
                    .set(
                        "Content-Type",
                        "application/json",
                    )
                    .expect(400);
            },
        );

        it(
            "should fail to subscribe if the queue name is unrecognized",
            async () =>
            {
                await request(BASE_URL)
                    .post(POST_SUBSCRIBE_ENDPOINT_PATH)
                    .send(
                        createSubscribeRequest({
                            queueName: "NON_EXISTENT_QUEUE",
                        }),
                    )
                    .set(
                        "Content-Type",
                        "application/json",
                    )
                    .expect(404);
            },
        );

        it(
            "should fail to subscribe twice to the same queue",
            async () =>
            {
                const subscribeRequest = createSubscribeRequest({
                    queueName: "Queue-2",
                });

                await request(BASE_URL)
                    .post(POST_SUBSCRIBE_ENDPOINT_PATH)
                    .send(subscribeRequest)
                    .set(
                        "Content-Type",
                        "application/json",
                    )
                    .expect(202);

                await request(BASE_URL)
                    .post(POST_SUBSCRIBE_ENDPOINT_PATH)
                    .send(subscribeRequest)
                    .set(
                        "Content-Type",
                        "application/json",
                    )
                    .expect(400);
            },
        );
    },
);
