import { beforeEach, describe, it } from "vitest";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { INestApplication } from "@nestjs/common";
import { App } from "supertest/types.js";
import { AppController } from "@/adapters/driving/app.controller.js";
import { MessageQueueService } from "@/app/services/message-queue.service.js";
import { MESSAGE_QUEUE_GATEWAY } from "@/app/ports/driven/message-queue-gateway.js";
import { CompositeMessageQueueGateway } from "@/adapters/driven/composite-message-queue-gateway.js";
import InMemoryMessageQueueProvider from "@/adapters/driven/in-memory-message-queue-provider.js";

describe("When the application publishes a message", () =>
{
    let app: INestApplication<App>;

    beforeEach(async () =>
    {
        const moduleFixture = await Test.createTestingModule({
            controllers: [AppController],
            providers: [
                MessageQueueService,
                {
                    provide: MESSAGE_QUEUE_GATEWAY,
                    useValue: new CompositeMessageQueueGateway([
                        new InMemoryMessageQueueProvider(),
                    ]),
                },
            ],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });
    it("should deliver to a queue", () =>
    {
        const message = "Test";
        request(app.getHttpServer())
            .post("/message")
            .send(message)
            .expect(202);
    });
});
