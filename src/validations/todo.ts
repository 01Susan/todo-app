import { z } from 'zod'



export const todoSchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters long' }).max(50, { message: 'Title must be less than 50 characters long' }).trim(),
    description: z.string().trim().optional(),
    completed: z.boolean().default(false)
})


export const todoUpdateSchema = todoSchema.pick({ completed: true })

export type todoType = z.infer<typeof todoSchema>
export type todoUpdateType = z.infer<typeof todoUpdateSchema>