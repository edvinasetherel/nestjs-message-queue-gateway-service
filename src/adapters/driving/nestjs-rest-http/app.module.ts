import { DynamicModule, Module } from "@nestjs/common";
import { PublisherService } from "#app/services/publisher.service.js";

import { AppController } from "#adapters/driving/nestjs-rest-http/app.controller.js";
import { Dependencies } from "#adapters/startup/configurator.js";
import { SubscriberService } from "#app/services/subscriber.service.js";

@Module({})
export class AppModule
{
    static register({
        publisherService,
        subscriberService,
    }: Dependencies): DynamicModule
    {
        return {
            module: AppModule,
            controllers: [AppController],
            providers: [
                {
                    provide: PublisherService,
                    useValue: publisherService,
                },
                {
                    provide: SubscriberService,
                    useValue: subscriberService,
                },
            ],
        };
    }
}
