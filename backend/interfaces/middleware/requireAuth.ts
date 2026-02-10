export const requireAuth = async (req: any, reply: any) => {
    try {
        await req.jwtVerify()
        const user = req.user as any

        if (user.sub && !user.id) {
            req.user = { ...user, id: user.sub }
        }
        if (user.userId && !user.id) {
            req.user = { ...user, id: user.userId }
        }
    } catch (err: any) {
        return reply.code(401).send({ error: "Unauthorized" })
    }
}
