import { UserRepositorySQLite } from "../../infra/repositories/UserRepositorySQLite"
import { AuthUseCase } from "../../domain/usecases/AuthUseCase"

export default async function (fastify) {
    const userRepo = new UserRepositorySQLite()
    const auth = new AuthUseCase(userRepo)

    fastify.post("/signup", async (req, reply) => {
        const { email, password } = req.body
        const r = await auth.signup(email, password)
        reply.send(r)
    })

    // routes/auth.ts ou équivalent
    fastify.post("/login", async (req, reply) => {
        const { email, password } = req.body

        // Vérifier l'utilisateur
        const user = await userRepo.findByEmail(email)
        if (!user) {
            return reply.code(401).send({ error: "Invalid credentials" })
        }

        // Vérifier le mot de passe (si tu en as)
        // const valid = await verifyPassword(password, user.password)
        // if (!valid) {...}

        console.log('👤 User object from DB:', user)
        console.log('👤 User ID:', user.id)

        // Générer le token
        const token = fastify.jwt.sign({
            id: user.id.toString(),  // Convertir en string si nécessaire
            email: user.email,
            // Ajoute d'autres champs si besoin
        })

        console.log('🔐 Token payload:', { id: user.id, email: user.email })

        return { token }
    })
}
