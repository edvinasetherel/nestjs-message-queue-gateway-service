import { Logger } from "#app/ports/driven/logger.js";
import { ConsoleLogger } from "#adapters/driven/logger/console.js";

class AppLogger
{
    private static instance: AppLogger | null = null;
    private loggerProvider: Logger | null = null;

    private constructor() {}

    static getInstance(): AppLogger
    {
        if (!AppLogger.instance)
        {
            AppLogger.instance = new AppLogger();
        }
        return AppLogger.instance;
    }

    setLogger(loggerProvider: Logger): void
    {
        this.loggerProvider = loggerProvider;
    }

    getLogger(context: string): Logger
    {
        if (!this.loggerProvider)
        {
            return new ConsoleLogger(context, ConsoleLogger.getLogLevel());
        }
        return this.createContextLogger(context);
    }

    private createContextLogger(context: string): Logger
    {
        const baseLogger = this.loggerProvider!;

        return {
            debug: (message: string) => baseLogger.debug(message, context),
            info: (message: string) => baseLogger.info(message, context),
            warn: (message: string) => baseLogger.warn(message, context),
            error: (message: string, error?: unknown) => baseLogger.error(message, error, context),
        };
    }
}

export const appLogger = AppLogger.getInstance();

export function getLogger(context: string): Logger
{
    return appLogger.getLogger(context);
}
