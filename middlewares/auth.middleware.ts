import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from 'jsonwebtoken'

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization?.split(" ")[1]

    if (token) {
        try {
            let decoded = await jwt.verify(token, 'play2xnxx') as JwtPayload

            res.locals.user = decoded

            next()
        } catch (err) {
            return res.status(400).send({ success: false, message: err })
        }
    } else {
        return res.status(401).send({ success: false, message: 'Token is missing!' })
    }
}