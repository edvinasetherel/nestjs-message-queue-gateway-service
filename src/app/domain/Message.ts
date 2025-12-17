export type MessageParams = {
    id: string;
    type: string;
    payload: unknown;
    occurredAt: Date;
    metadata: Record<string, unknown>;
};

export default class Message
{
    readonly id: string;
    readonly type: string;
    readonly payload: unknown;
    readonly occurredAt: Date;
    readonly metadata: Record<string, unknown>;
    constructor({
        id,
        type,
        payload,
        occurredAt,
        metadata,
    }: MessageParams)
    {
        this.id = id;
        this.type = type;
        this.payload = payload;
        this.occurredAt = occurredAt;
        this.metadata = metadata;
    }
}
