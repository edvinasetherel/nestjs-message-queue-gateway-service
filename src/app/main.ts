import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { AppModule } from "#app/app.module.js";

const logger = new Logger("Bootstrap");

async function bootstrap()
{
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || "localhost";
    await app.listen(port, host);
    logger.log(`Listening on http://${host}:${port}`);
}

bootstrap();
