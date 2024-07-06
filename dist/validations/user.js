"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginSchema = exports.userSignupSchema = void 0;
const zod_1 = require("zod");
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,100}$/;
exports.userSignupSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2, { message: 'Full name must be at least 2 characters long' }).max(50, { message: 'Full name must be less than 50 characters long' }).trim(),
    email: zod_1.z.string().email({ message: 'Invalid email address' }).trim(),
    password: zod_1.z.string()
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
exports.userLoginSchema = exports.userSignupSchema.pick({ email: true, password: true });
//# sourceMappingURL=user.js.map