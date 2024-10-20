export enum HttpCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

interface AppErrorArgs {
    name?: string;
    httpCode: HttpCode;
    description: string;
    feedback?: string;
}

export class AppError extends Error {
    public readonly name: string;
    public readonly httpCode: HttpCode;
    public readonly feedback?: string;

    constructor(args: AppErrorArgs) {
        super(args.description);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = args.name ?? "Error";
        this.httpCode = args.httpCode;
        this.feedback = args.feedback;

        Error.captureStackTrace(this);
    }
}
