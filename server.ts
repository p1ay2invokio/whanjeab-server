import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import keyRoute from './routes/key.route'
import userRoute from './routes/user.route'

let env = dotenv.config().parsed

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', keyRoute, userRoute)

app.listen(env?.PORT, () => {
    console.log(`Server is running on port ${env?.PORT}`)
})