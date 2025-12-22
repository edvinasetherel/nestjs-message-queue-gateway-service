import { DynamicModule, Module } from "@nestjs/common";
import { MessagePublisherService } from "#app/services/message-publisher.service.js";

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
                    provide: MessagePublisherService,
                    useValue: messageQueueService,
                },
            ],
        };
    }
}
