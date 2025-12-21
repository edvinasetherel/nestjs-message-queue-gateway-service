import { DynamicModule, Module } from "@nestjs/common";
import { MessageQueueService } from "#app/services/message-queue.service.js";

import { AppController } from "#adapters/driving/nestjs-rest-http/app.controller.js";
import { Dependencies } from "#adapters/startup/configurator.js";

@Module({})
export class AppModule
{
    static register({
        messageQueueService,
    }: Dependencies): DynamicModule
    {
        return {
            module: AppModule,
            controllers: [AppController],
            providers: [
                {
                    provide: MessageQueueService,
                    useValue: messageQueueService,
                },
            ],
        };
    }
}
