import { Logger as NestLogger } from "@nestjs/common";
import { Logger } from "#app/ports/driven/logger.js";

export class NestJsLogger
implements Logger
{
    private readonly nestLogger: NestLogger;

    constructor(context: string)
    {
        this.nestLogger = new NestLogger(context);
    }

    debug(message: string, context?: string): void
    {
        this.nestLogger.debug(message, context);
    }

    info(message: string, context?: string): void
    {
        this.nestLogger.log(message, context);
    }

    warn(message: string, context?: string): void
    {
        this.nestLogger.warn(message, context);
    }

    error(message: string, error?: unknown, context?: string): void
    {
        this.nestLogger.error(message, error instanceof Error ? error.stack : error, context);
    }
}
