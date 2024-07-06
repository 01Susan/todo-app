import { z } from 'zod'


export const successResponseSchema = z.object({
    success: z.boolean().default(true),
    message: z.string(),
    data: z.any().optional()
})


export const errorResponseSchema = z.object({
    success: z.boolean().default(false),
    message: z.string(),
    error: z.any().optional()
})


export type successResponse = z.infer<typeof successResponseSchema>
export type errorResponse = z.infer<typeof errorResponseSchema>