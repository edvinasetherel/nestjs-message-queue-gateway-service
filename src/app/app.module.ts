import { Module } from "@nestjs/common";
import { AppController } from "@/adapters/driving/app.controller.js";
import { MessageQueueService } from "@/app/services/message-queue.service.js";

@Module({
    imports: [],
    controllers: [AppController],
    providers: [MessageQueueService],
})
export class AppModule {}
