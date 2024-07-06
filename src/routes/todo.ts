import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { todoSchema, todoType, todoUpdateSchema, todoUpdateType } from '../validations/todo';
import { errorResponse, successResponse } from '../validations/responseSchema';
import { auth } from '../middlewares/auth';
const prisma = new PrismaClient();
const route = Router();



route.use(auth);


route.get('/search', async (req, res) => {
    try {
        const { filter } = req.query;

        if (filter && typeof filter !== 'string') {
            return res.status(400).json({ message: 'Invalid filter parameter' });
        }

        let data;
        if (!filter) {
            data = await prisma.todo.findMany();
        } else {
            data = await prisma.todo.findMany({
                where: {
                    OR: [
                        {
                            title: {
                                contains: filter,
                                mode: 'insensitive'
                            }
                        },
                        {
                            description: {
                                contains: filter,
                                mode: 'insensitive'
                            }
                        }
                    ]
                }
            });
        }

        return res.status(200).json({ message: 'Search results', data });
    } catch (error: any) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

route.get('/', async (req: Request, res: Response) => {
    try {
        const userId = res.locals.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized', error: 'User ID not found' } as errorResponse);
        }

        const data = await prisma.todo.findMany({
            where: {
                user_id: userId,
            },
        });

        return res.status(200).json({ message: 'Todos fetched successfully', data } as successResponse);
    } catch (error: any) {
        return res.status(500).json({ message: 'Internal server error', error: error.message } as errorResponse);
    }
});

route.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = res.locals.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized', error: 'User ID not found' } as errorResponse);
        }

        const todo = await prisma.todo.findUnique({
            where: {
                id: parseInt(id, 10), // Ensure the ID is a number
            },
        });

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' } as errorResponse);
        }

        if (todo.user_id !== userId) {
            return res.status(403).json({ message: 'Forbidden: You are not allowed to access this todo' } as errorResponse);
        }

        return res.status(200).json({ message: 'Todo fetched successfully', data: todo } as successResponse);
    } catch (error: any) {
        return res.status(500).json({ message: 'Internal server error', error: error.message } as errorResponse);
    }
});

route.post('/', async (req, res) => {
    const validateData = todoSchema.safeParse(req.body as todoType);
    if (!validateData.success) {
        return res.status(400).json({ message: "Validation error", error: validateData.error } as errorResponse);
    }
    const { title, description } = req.body;
    const userId = res.locals.user.userId;
    const data = await prisma.todo.create({
        data: {
            title,
            description,
            user_id: userId
        }
    });
    return res.status(201).json({ message: 'Todo created successfully', data: data } as successResponse);
});

route.put('/:id', async (req, res) => {
    try {
        const validateData = todoUpdateSchema.safeParse(req.body as todoUpdateType);
        if (!validateData.success) {
            return res.status(400).json({ message: "Validation error", error: validateData.error } as errorResponse);
        }
        const { id } = req.params;
        const { completed } = req.body;

        const data = await prisma.todo.update({
            where: {
                id: parseInt(id, 10), // Ensure the ID is a number
            },
            data: {
                completed
            },
        });
        return res.status(200).json({ message: 'Todo updated successfully', data } as successResponse);
    } catch (error: any) {
        return res.status(500).json({ message: 'Internal server error', error: error.message } as errorResponse);
    }
});

route.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = res.locals.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized', error: 'User ID not found' } as errorResponse);
        }

        const todo = await prisma.todo.findUnique({
            where: {
                id: parseInt(id, 10),
            },
        });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' } as errorResponse);
        }
        const deletedTodo = await prisma.todo.delete({
            where: {
                id: parseInt(id, 10),
            },
        });
        return res.status(200).json({ message: 'Todo deleted successfully', data: deletedTodo } as successResponse);
    } catch (error: any) {
        return res.status(500).json({ message: 'Internal server error', error: error.message } as errorResponse);
    }
});



export { route as todoRoute }