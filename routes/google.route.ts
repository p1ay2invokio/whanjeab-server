import { Router } from "express";
import passport from "passport";
import { prisma } from "../prisma/appdatasource";
import jwt from 'jsonwebtoken'
import { User } from "@prisma/client";
import { client_url, is_dev, server_url } from "../config";

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${server_url}/api/auth/google/callback`
},
    async function (accessToken: any, refreshToken: any, profile: any, cb: any) {
        return cb(null, profile)
    }
));


const app = Router()

app.get("/auth/google", passport.authenticate('google', { scope: ['profile', 'email'], session: false }))

app.get("/auth/google/callback", passport.authenticate('google', { failureRedirect: '/login', session: false }), async (req, res) => {

    console.log(req.user)

    let user: User | any = req.user

    var token = ''

    if (!user) {
        return res.status(400).send({ success: false, message: "Google Login Failed" })
    }

    let exist = await prisma.user.findFirst({
        where: {
            email: user.emails[0].value
        }
    })

    if (!exist) {
        let created = await prisma.user.create({
            data: {
                email: user.emails[0].value,
                googleId: user.id,
                displayName: user.displayName,
                provider: user.provider,
                avatar: user.picture
            }
        })

        let create_token = jwt.sign({ user_id: created.id, role: created.role, email: created.email }, 'play2xnxx', { expiresIn: '24hrs' })

        token = create_token
    } else {
        await prisma.user.update({
            data: {
                googleId: user.id,
                displayName: user.displayName,
                provider: user.provider,
                avatar: user.picture
            },
            where: {
                id: exist.id
            }
        })

        let create_token = jwt.sign({ user_id: exist.id, role: exist.role, email: exist.email }, 'play2xnxx', { expiresIn: '24hrs' })

        token = create_token
    }

    res.redirect(`${client_url}/dashboard/${token}`)
})

export default app