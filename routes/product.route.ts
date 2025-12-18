import { Router } from "express";
import { prisma } from "../prisma/appdatasource";

const app = Router()

app.get("/product", async (req, res) => {
    let products = await prisma.product.findMany({
        orderBy: {
            id: 'asc'
        }
    })

    res.status(200).send(products)
})

export default app