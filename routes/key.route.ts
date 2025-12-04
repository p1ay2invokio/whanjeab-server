import { Router } from "express";
import crypto from 'crypto'
import { auth } from "../middlewares/auth.middleware";
import { prisma } from "../prisma/appdatasource";
import { TokenType } from "../types/token";
import { limiter } from "../middlewares/ratelimit";


const app = Router()

app.get("/keygen", auth, limiter, async (req, res) => {


    const user: TokenType = res.locals.user

    let user_res = await prisma.user.findFirst({
        where: {
            id: user.user_id
        }
    })

    if (user_res?.keygen == null) {
        return res.status(400).send({ success: false, message: "User Not Found" })
    }

    await prisma.user.update({
        data: {
            keygen: user_res.keygen + 1
        },
        where: {
            id: user_res?.id
        }
    })

    let key = await crypto.randomBytes(16).toString('hex')

    let exist_key = await prisma.key.findFirst({
        where: {
            user_id: user_res.id
        }
    })

    if (exist_key) {
        await prisma.key.update({
            where: {
                id: exist_key.id
            },
            data: {
                key: key
            }
        })
    } else {
        await prisma.key.create({
            data: {
                user_id: user_res.id,
                key: key
            }
        })
    }

    res.status(200).send({ success: true, message: 'สร้าง key ใหม่สำเร็จ', key: key })
})


export default app