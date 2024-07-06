"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponseSchema = exports.successResponseSchema = void 0;
const zod_1 = require("zod");
exports.successResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean().default(true),
    message: zod_1.z.string(),
    data: zod_1.z.any().optional()
});
exports.errorResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean().default(false),
    message: zod_1.z.string(),
    error: zod_1.z.any().optional()
});
//# sourceMappingURL=responseSchema.js.map