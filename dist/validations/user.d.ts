import { z } from 'zod';
export declare const userSignupSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    password: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    fullName: string;
    email: string;
    password: string;
}, {
    fullName: string;
    email: string;
    password: string;
}>;
export type userSignupType = z.infer<typeof userSignupSchema>;
export declare const userLoginSchema: z.ZodObject<Pick<{
    fullName: z.ZodString;
    email: z.ZodString;
    password: z.ZodEffects<z.ZodString, string, string>;
}, "email" | "password">, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type userLoginType = z.infer<typeof userLoginSchema>;
