import axios from "axios"

export const CloudflareVerify = async (token: string) => {

    console.log(token)

    let cfRes = await axios.post("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        secret: process.env.TURNSTILE_SECRET,
        response: token
    })

    if (cfRes.data.success) {
        return { success: true, message: "cloudflare successfully!" }
    } else {
        return { success: false, message: cfRes.data["error-codes"][0] }
    }
}