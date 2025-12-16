import { beforeEach, describe, it } from "vitest";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { INestApplication } from "@nestjs/common";
import { App } from "supertest/types.js";
import { AppController } from "@/app.controller.js";
import { MessageQueueService } from "@/message-queue.service.js";
import { IMESSAGE_QUEUE_GATEWAY } from "@/ports/driven/IMessageQueueGateway.js";
import { InMemoryMessageQueueGateway } from "@/adapters/driven/InMemoryMessageQueueGateway.js";

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
                    provide: IMESSAGE_QUEUE_GATEWAY,
                    useClass: InMemoryMessageQueueGateway,
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
