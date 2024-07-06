export declare function generateAuthToken(userId: number, email: string, username: string): string;
export declare const validateAuthToken: (token: string) => Promise<number | null>;
export declare function hashPassword(password: string): Promise<string>;
export declare function comparePassword(plainPassword: string, hashPassword: string): Promise<boolean>;
