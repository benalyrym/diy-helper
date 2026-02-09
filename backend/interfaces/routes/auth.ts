import { UserRepositorySQLite } from "../../infra/repositories/UserRepositorySQLite"
import { AuthUseCase } from "../../domain/usecases/AuthUseCase"

export default async function (fastify) {
    const userRepo = new UserRepositorySQLite()
    const auth = new AuthUseCase(userRepo)

    fastify.post("/signup", async (req, reply) => {
        try {
            const { email, password, firstName, lastName, displayName } = req.body || {}
            const user = await auth.signup({ email, password, firstName, lastName, displayName })
            return reply.code(201).send(user)
        } catch (err: any) {
            const message = err.message || "Signup failed"
            const status = message === "User exists" ? 409 : 400
            return reply.code(status).send({ error: message })
        }
    })

    fastify.post("/login", async (req, reply) => {
        try {
            const { email, password } = req.body || {}
            const result = await auth.login(fastify.jwt, email, password)
            return reply.send(result)
        } catch (err: any) {
            return reply.code(401).send({ error: "Invalid credentials" })
        }
    })
}
