import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { AppModule } from "#adapters/driving/nestjs-rest-http/app.module.js";
import { bootstrap } from "#adapters/startup/configurator.js";

const logger = new Logger("entrypoint");

async function entrypointBootstrap()
{
    const appLoadResult = await bootstrap();
    if (appLoadResult.isFailure)
    {
        throw new Error("App core failed to load", { cause: appLoadResult.exceptionOrNull() });
    }
    const app = await NestFactory.create(
        AppModule.register(
            appLoadResult.getOrThrow(),
        ),
    );
    const port = process.env.HOST_PORT!;
    const host = process.env.HOST!;
    await app.listen(port, host);
    logger.log(`Listening on http://${host}:${port}`);
}

await entrypointBootstrap();
