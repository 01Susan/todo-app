import { z } from 'zod'


const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,100}$/;


export const userSignupSchema = z.object({
    fullName: z.string().min(2, { message: 'Full name must be at least 2 characters long' }).max(50, { message: 'Full name must be less than 50 characters long' }).trim(),
    email: z.string().email({ message: 'Invalid email address' }).trim(),
    password: z.string()
        .min(8)
        .max(100)
        .trim()
        .regex(passwordRegex)
        .refine((value) => {
            if (!passwordRegex.test(value)) {
                return { message: 'Password must be between 8 and 100 characters and contain at least one number and one special character' };
            }
            return true;
        })
});

export type userSignupType = z.infer<typeof userSignupSchema>

export const userLoginSchema = userSignupSchema.pick({ email: true, password: true });
export type userLoginType = z.infer<typeof userLoginSchema>

