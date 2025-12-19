import jwt from 'jsonwebtoken';
import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import { prisma } from "../prisma/appdatasource";
import { CloudflareVerify } from '../methods/cloudflareVerify';

const app = Router()

app.post("/login", async (req, res) => {

    const { email, password, CfToken } = req.body

    let CfRes = await CloudflareVerify(CfToken)

    if (!CfRes.success) {
        return res.status(400).send({ success: false, message: 'cloudflare ไม่ถูกยืนยัน!' })
    }

    let user = await prisma.user.findFirst({
        where: {
            email: email,
            password: password
        }
    })

    if (!user) {
        return res.status(400).send({ success: false, message: 'ไม่พบผู้ใช้นี้!' })
    }

    let gen_token = jwt.sign({ user_id: user.id, role: user.role, email: user.email }, 'play2xnxx', { expiresIn: '24hrs' })

    res.status(200).send({ success: true, token: gen_token, message: 'เข้าสู่ระบบสำเร็จ!' })
})

app.post("/signup", async (req, res) => {
    const { email, password, CfToken } = req.body

    let CfRes = await CloudflareVerify(CfToken)

    if (!CfRes.success) {
        return res.status(400).send({ success: false, message: 'cloudflare ไม่ถูกยืนยัน!' })
    }


    if (!email || !password) {
        return res.status(400).send({
            success: false,
            message: 'กรุณากรอกอีเมลและรหัสผ่าน!'
        })
    }

    let existingUser = await prisma.user.findFirst({
        where: { email: email }
    })

    console.log(existingUser)

    if (existingUser) {
        return res.status(400).send({
            success: false,
            message: 'อีเมลนี้ถูกใช้งานแล้ว'
        })
    }

    let newUser = await prisma.user.create({
        data: {
            email: email,
            password: password,
            role: 0,
            email_active: 0
        }
    })

    let gen_token = jwt.sign({ user_id: newUser.id, role: newUser.role, email: newUser.email }, 'play2xnxx', { expiresIn: '24hrs' })

    res.status(201).send({
        success: true,
        message: 'สร้างบัญชีสำเร็จ!',
        token: gen_token
    })
})

app.get("/user", auth, async (req, res) => {

    let user = res.locals.user

    let user_res = await prisma.user.findFirst({
        where: {
            id: user.user_id
        }
    })

    res.status(200).send(user_res)
})

// app.post('/po', auth, async(req, res)=>{

// })

app.get("/mykey", auth, async (req, res) => {

    let user = res.locals.user

    let my_key = await prisma.key.findFirst({
        where: {
            user_id: user.user_id
        }
    })


    res.status(200).send(my_key)
})

export default app