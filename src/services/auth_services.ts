import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
const JWT_SECRET: string = process.env.JWT_SECRET_KEY as string;

export function generateAuthToken(userId: number, email: string, username: string): string {
    const user = {
        userId,
        email,
        username
    }
    console.log(user);
    console.log(JWT_SECRET);
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1d' });
    console.log(token);

    return token;
}

export const isValidAuthToken = async (token: string): Promise<any> => {
    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;
        // Check if user exists in the database
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) return false;
        return decoded
    } catch (error) {
        return false
    }
};


export async function hashPassword(password: string): Promise<string> {
    const salt: number = 10
    const plainPassoword = password;
    const hashedPassword = await bcrypt.hash(plainPassoword, salt) as string
    return hashedPassword;
}


export async function comparePassword(plainPassword: string, hashPassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(plainPassword, hashPassword)
    return isMatch;
}