import { Request, Response, NextFunction } from 'express';
import { isValidAuthToken } from '../services/auth_services';
import { errorResponse } from '../validations/responseSchema';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Please provide a valid token' } as errorResponse);
        }
        const user = await isValidAuthToken(token);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized to access' } as errorResponse);
        }
        res.locals.user = user;
        next();
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err } as errorResponse);
    }
};
