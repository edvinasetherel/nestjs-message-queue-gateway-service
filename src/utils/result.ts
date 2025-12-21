export class Result<T>
{
    private constructor(
        private readonly value?: T,
        private readonly error?: unknown,
    )
    {}

    static success<T>(value: T): Result<T>
    {
        return new Result(value, null);
    }

    static failure<T>(error: unknown): Result<T>
    {
        return new Result(null as T, error);
    }

    get isSuccess(): boolean
    {
        return this.error === null;
    }

    get isFailure(): boolean
    {
        return !this.isSuccess;
    }

    exceptionOrNull(): unknown | null
    {
        return this.isFailure ? this.error : null;
    }

    getOrThrow(): T
    {
        if (this.isFailure)
        {
            throw this.error;
        }
        return this.value as T;
    }

}
