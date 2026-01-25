import { Router } from "express";
import { prisma } from "../prisma/appdatasource";

const app = Router()

app.post("/order", async (req, res) => {
    let {
        id,
        customerId,
        productId,
        status,
        amount,
    } = req.body

    let created = await prisma.order.create({
        data: {
            id: id,
            customerId: customerId,
            productId: productId,
            status: status,
            amount: amount
        }
    })

    res.status(201).send({ success: true, message: 'Created Order Successfully!' })
})

export default app