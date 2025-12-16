import { Module } from "@nestjs/common";
import { AppController } from "@/app.controller.js";
import { MessageQueueService } from "@/message-queue.service.js";

@Module({
    imports: [],
    controllers: [AppController],
    providers: [MessageQueueService],
})
export class AppModule {}
