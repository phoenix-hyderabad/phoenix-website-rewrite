export interface Access {
    allowed: string[];
    disallowed: string[];
}

export interface User {
    userId: string;
    email: string;
    operations: Access;
}
