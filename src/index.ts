import express from 'express'
import dotenv from 'dotenv'
import { userRoute } from './routes/user'
import { todoRoute } from './routes/todo'
dotenv.config()

export const app = express()
app.use(express.json())

app.use("/user", userRoute)
app.use("/todo", todoRoute)



app.listen('3000', () => console.log('Server running on port 3000'))





