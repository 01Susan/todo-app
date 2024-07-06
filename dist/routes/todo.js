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
exports.todoRoute = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const todo_1 = require("../validations/todo");
const auth_1 = require("../middlewares/auth");
const prisma = new client_1.PrismaClient();
const route = (0, express_1.Router)();
exports.todoRoute = route;
route.use(auth_1.auth);
route.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter } = req.query;
        if (filter && typeof filter !== 'string') {
            return res.status(400).json({ message: 'Invalid filter parameter' });
        }
        let data;
        if (!filter) {
            data = yield prisma.todo.findMany();
        }
        else {
            data = yield prisma.todo.findMany({
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
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}));
route.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized', error: 'User ID not found' });
        }
        const data = yield prisma.todo.findMany({
            where: {
                user_id: userId,
            },
        });
        return res.status(200).json({ message: 'Todos fetched successfully', data });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}));
route.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized', error: 'User ID not found' });
        }
        const todo = yield prisma.todo.findUnique({
            where: {
                id: parseInt(id, 10), // Ensure the ID is a number
            },
        });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        if (todo.user_id !== userId) {
            return res.status(403).json({ message: 'Forbidden: You are not allowed to access this todo' });
        }
        return res.status(200).json({ message: 'Todo fetched successfully', data: todo });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}));
route.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validateData = todo_1.todoSchema.safeParse(req.body);
    if (!validateData.success) {
        return res.status(400).json({ message: "Validation error", error: validateData.error });
    }
    const { title, description } = req.body;
    const userId = res.locals.user.userId;
    const data = yield prisma.todo.create({
        data: {
            title,
            description,
            user_id: userId
        }
    });
    return res.status(201).json({ message: 'Todo created successfully', data: data });
}));
route.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateData = todo_1.todoUpdateSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({ message: "Validation error", error: validateData.error });
        }
        const { id } = req.params;
        const { completed } = req.body;
        const data = yield prisma.todo.update({
            where: {
                id: parseInt(id, 10), // Ensure the ID is a number
            },
            data: {
                completed
            },
        });
        return res.status(200).json({ message: 'Todo updated successfully', data });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}));
route.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized', error: 'User ID not found' });
        }
        const todo = yield prisma.todo.findUnique({
            where: {
                id: parseInt(id, 10),
            },
        });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        const deletedTodo = yield prisma.todo.delete({
            where: {
                id: parseInt(id, 10),
            },
        });
        return res.status(200).json({ message: 'Todo deleted successfully', data: deletedTodo });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}));
//# sourceMappingURL=todo.js.map