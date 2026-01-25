import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import keyRoute from './routes/key.route'
import userRoute from './routes/user.route'
import lineRoute from './routes/line.route'
import googleRoute from './routes/google.route'
import slipVerifyRoute from './routes/slipverify.route'
import productRoute from './routes/product.route'
import orderRoute from './routes/order.route'
import os from 'os'
import dayjs from 'dayjs'
import { Server } from 'socket.io'
import http from 'http'
import { prisma } from './prisma/appdatasource'
import { auth } from './middlewares/auth.middleware'

let env = dotenv.config().parsed

const app = express()

app.use(cors())
app.use(express.json())

const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
})

app.use('/api', keyRoute, userRoute, lineRoute, googleRoute, slipVerifyRoute, productRoute, orderRoute)

app.get('/api/test', async (req, res) => {
    res.status(200).send({ uptime: os.uptime(), status: true })
})

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})