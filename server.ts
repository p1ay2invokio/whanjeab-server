import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import keyRoute from './routes/key.route'
import userRoute from './routes/user.route'
import lineRoute from './routes/line.route'
import googleRoute from './routes/google.route'
import slipVerifyRoute from './routes/slipverify.route'
import productRoute from './routes/product.route'
import os from 'os'
import dayjs from 'dayjs'

let env = dotenv.config().parsed

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', keyRoute, userRoute, lineRoute, googleRoute, slipVerifyRoute, productRoute)

app.get('/api/test', async (req, res) => {
    res.status(200).send({ uptime: os.uptime(), status: true })
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})