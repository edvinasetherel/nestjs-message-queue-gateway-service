import { Logger, LogLevel } from "#app/ports/driven/logger.js";

export class ConsoleLogger
implements Logger
{
    private minLevel: LogLevel;

    constructor(
        private readonly context: string,
        minLevel: LogLevel = LogLevel.INFO,
    )
    {
        this.minLevel = minLevel;
    }

    debug(message: string, context?: string): void
    {
        if (this.minLevel <= LogLevel.DEBUG)
        {
            console.log(`[DEBUG] [${context || this.context}] ${message}`);
        }
    }

    info(message: string, context?: string): void
    {
        if (this.minLevel <= LogLevel.INFO)
        {
            console.log(`[INFO] [${context || this.context}] ${message}`);
        }
    }

    warn(message: string, context?: string): void
    {
        if (this.minLevel <= LogLevel.WARN)
        {
            console.warn(`[WARN] [${context || this.context}] ${message}`);
        }
    }

    error(message: string, error?: unknown, context?: string): void
    {
        if (this.minLevel <= LogLevel.ERROR)
        {
            console.error(`[ERROR] [${context || this.context}] ${message}`, error || "");
        }
    }

    static getLogLevel(): LogLevel
    {
        const level = process.env.LOG_LEVEL?.toUpperCase();
        switch (level)
        {
            case "DEBUG": return LogLevel.DEBUG;
            case "INFO": return LogLevel.INFO;
            case "WARN": return LogLevel.WARN;
            case "ERROR": return LogLevel.ERROR;
            default: return LogLevel.INFO;
        }
    }
}
