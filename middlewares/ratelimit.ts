import {rateLimit} from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 5000,
    max: 1,
    message: {error: "Too many requests"},
    standardHeaders: true,
    legacyHeaders: true
})