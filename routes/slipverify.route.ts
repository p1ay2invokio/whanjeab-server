import axios from "axios";
import { Router } from "express";
import { limiter, limitSlip } from "../middlewares/ratelimit";
import dayjs from "dayjs";
import { auth } from "../middlewares/auth.middleware";
import multer from 'multer'
import { prisma } from "../prisma/appdatasource";
import FormData from "form-data";

const app = Router()

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        cb(null, true)
    }
})


app.post('/slip_verify', auth, limitSlip, upload.single("slip"), async (req, res) => {

    //@ts-ignore
    let slip = req.file
    let { product_id } = req.body

    let user = res.locals.user

    // console.log(user)

    if (!slip) {
        return res.status(400).send({ success: false, message: "slip not found" })
    }

    if (!product_id) {
        return res.status(400).send({ success: false, message: "slip verify error" })
    }

    const form = new FormData()

    form.append("files", slip.buffer, {
        filename: slip.originalname || "slip.jpg",
        contentType: slip.mimetype || "image/jpeg",
        knownLength: slip.size,
    });

    let res_verify = await axios.post(`https://api.slipok.com/api/line/apikey/39175`, form, {
        headers: {
            ...form.getHeaders(),
            "x-authorization": "SLIPOK1YYWHIG"
        }
    }).then((res) => {
        return res.data.data
    })


    console.log(res_verify)

    if (res_verify.success) {
        let differ = dayjs().diff(res_verify.transTimestamp, "minutes")


        console.log("differ : ", differ)

        if (differ > 10) {
            console.log("สลิปเกินระยะเวลาที่กำหนด!")
            return res.status(400).send({ success: false, message: "สลิปเกินระยะเวลาที่กำหนด!" })
        } else {

            let productData = await prisma.product.findFirst({
                where: {
                    id: Number(product_id)
                }
            })

            if (res_verify.amount == productData?.price && res_verify.receiver.displayName == "play2store" && res_verify.receiver.name == "PLAY2STORE") {
                let userData: any = await prisma.user.findFirst({
                    where: {
                        id: user.user_id
                    }
                })

                let updatedUserQuota = await prisma.user.update({
                    where: {
                        id: userData?.id,
                    },
                    data: {
                        request_max: Number(productData?.quota)
                    }
                })

                res.status(204).send({ success: true, message: "สั่งซื้อสำเร็จ!" })
            } else {
                res.status(400).send({ success: false, message: "สลิปปลอม!" })
            }
        }
    } else {
        res.status(400).send({ success: false, message: "สลิปปลอม!" })
    }




})

export default app