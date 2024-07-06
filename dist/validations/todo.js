"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoUpdateSchema = exports.todoSchema = void 0;
const zod_1 = require("zod");
exports.todoSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, { message: 'Title must be at least 3 characters long' }).max(50, { message: 'Title must be less than 50 characters long' }).trim(),
    description: zod_1.z.string().trim().optional(),
    completed: zod_1.z.boolean().default(false)
});
exports.todoUpdateSchema = exports.todoSchema.pick({ completed: true });
//# sourceMappingURL=todo.js.map