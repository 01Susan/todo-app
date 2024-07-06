import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { userSignupSchema, userLoginSchema, userSignupType, userLoginType } from '../validations/user';
import { generateAuthToken } from '../services/auth_services';
import { hashPassword, comparePassword } from '../services/auth_services';
import { successResponse, errorResponse } from '../validations/responseSchema';

export const prisma = new PrismaClient();
const router = Router();


router.post('/signup', async (req, res) => {
    try {
        // Validate request body against userSignupSchema
        const validatedData = userSignupSchema.safeParse(req.body as userSignupType);
        if (!validatedData.success) {
            return res.status(400).json({
                message: "Validation error",
                error: validatedData.error
            } as errorResponse)
        }
        // Destructure validated data
        const { fullName, email, password } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
            } as errorResponse
            );
        }

        const hashedPassword = await hashPassword(password)

        // Create user in database
        const newUser = await prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword
            },
        });

        // Respond with success message or user data
        return res.status(201).json({ message: 'User created successfully', data: newUser } as successResponse);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error } as errorResponse);
    }
});


router.post('/signin', async (req, res) => {
    try {
        // Validate request body against userLoginSchema
        const validateSignInData = userLoginSchema.safeParse(req.body as userLoginType);
        if (!validateSignInData.success) {
            return res.status(400).json({ message: "Validation error", error: validateSignInData.error } as errorResponse);
        }
        const { email, password } = req.body;

        const isUserExits = await prisma.user.findUnique({
            where: { email },
        });
        if (!isUserExits) {
            return res.status(404).json({ message: 'User not found' } as errorResponse);
        }
        const hashedPassword = isUserExits.password;
        const isPasswordValid = await comparePassword(password, hashedPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password', message: "Entered password did not match with your registered password password" } as errorResponse);
        }

        const token = generateAuthToken(isUserExits.id, isUserExits.email, isUserExits.fullName);
        return res.status(200).json({ message: 'User logged in successfully', data: token } as successResponse);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error } as errorResponse);
    }
})


export { router as userRoute }