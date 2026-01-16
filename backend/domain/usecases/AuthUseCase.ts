import { UserRepositorySQLite } from "../../infra/repositories/UserRepositorySQLite"
import bcrypt from "bcryptjs"
import fastifyJwt from '@fastify/jwt'

export class AuthUseCase {
    constructor(private userRepo: UserRepositorySQLite) {}

    async signup(email: string, password: string) {
        const exists = await this.userRepo.findByEmail(email)
        if (exists) return { error: "User exists" }
        const hash = bcrypt.hashSync(password, 10)
        const user = await this.userRepo.save({ email, password: hash })
        return user
    }

    async login(fastifyJwt: any, email: string, password: string) {
        const user = await this.userRepo.findByEmail(email)
        if (!user || !bcrypt.compareSync(password, user.password))
            return { error: "Invalid credentials" }
        const token = fastifyJwt.sign({ id: user.id, email })
        return { token }
    }
}
