"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = exports.prisma = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const user_1 = require("../validations/user");
const auth_services_1 = require("../services/auth_services");
const auth_services_2 = require("../services/auth_services");
exports.prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
exports.userRoute = router;
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body against userSignupSchema
        const validatedData = user_1.userSignupSchema.safeParse(req.body);
        if (!validatedData.success) {
            return res.status(400).json({
                message: "Validation error",
                error: validatedData.error
            });
        }
        // Destructure validated data
        const { fullName, email, password } = req.body;
        // Check if user already exists
        const existingUser = yield exports.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
            });
        }
        const hashedPassword = yield (0, auth_services_2.hashPassword)(password);
        // Create user in database
        const newUser = yield exports.prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword
            },
        });
        // Respond with success message or user data
        return res.status(201).json({ message: 'User created successfully', data: newUser });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
}));
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body against userLoginSchema
        const validateSignInData = user_1.userLoginSchema.safeParse(req.body);
        if (!validateSignInData.success) {
            return res.status(400).json({ message: "Validation error", error: validateSignInData.error });
        }
        const { email, password } = req.body;
        const isUserExits = yield exports.prisma.user.findUnique({
            where: { email },
        });
        if (!isUserExits) {
            return res.status(404).json({ message: 'User not found' });
        }
        const hashedPassword = isUserExits.password;
        const isPasswordValid = yield (0, auth_services_2.comparePassword)(password, hashedPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password', message: "Entered password did not match with your registered password password" });
        }
        const token = (0, auth_services_1.generateAuthToken)(isUserExits.id, isUserExits.email, isUserExits.fullName);
        return res.status(200).json({ message: 'User logged in successfully', data: token });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error });
    }
}));
//# sourceMappingURL=user.js.map