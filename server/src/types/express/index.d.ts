export interface User {
    userId: string;
    email?: string;
}

declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}
