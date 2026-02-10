import { UserRepositorySQLite } from "../../infra/repositories/UserRepositorySQLite"
import bcrypt from "bcryptjs"
import fastifyJwt from '@fastify/jwt'
import { bcryptRounds, passwordPepper } from "../../config.js"

export class AuthUseCase {
    constructor(private userRepo: UserRepositorySQLite) {}

    async signup(data: { email: string; password: string; firstName?: string; lastName?: string; displayName?: string }) {
        const email = (data.email || '').trim().toLowerCase()
        const password = data.password || ''
        const firstName = data.firstName?.trim() || ''
        const lastName = data.lastName?.trim() || ''
        const displayName = data.displayName?.trim() || `${firstName} ${lastName}`.trim()

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error("Email invalide")
        }

        if (password.length < 8 || password.length > 72 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
            throw new Error("Mot de passe trop faible")
        }

        if ((firstName && firstName.length > 60) || (lastName && lastName.length > 60) || (displayName && displayName.length > 80)) {
            throw new Error("Nom trop long")
        }

        const exists = await this.userRepo.findByEmail(email)
        if (exists) {
            throw new Error("User exists")
        }

        const passwordWithPepper = `${password}${passwordPepper}`
        const hash = await bcrypt.hash(passwordWithPepper, bcryptRounds)
        const user = await this.userRepo.save({
            email,
            password: hash,
            firstName: firstName || null,
            lastName: lastName || null,
            displayName: displayName || null
        })
        return user
    }

    async login(fastifyJwt: any, email: string, password: string) {
        const normalizedEmail = (email || '').trim().toLowerCase()
        if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            throw new Error("Invalid credentials")
        }
        if (!password) {
            throw new Error("Invalid credentials")
        }
        const user = await this.userRepo.findByEmail(normalizedEmail)
        if (!user) {
            throw new Error("Invalid credentials")
        }

        const withPepper = `${password}${passwordPepper}`
        const isValidPeppered = await bcrypt.compare(withPepper, user.password)
        if (!isValidPeppered) {
            const isValidLegacy = await bcrypt.compare(password, user.password)
            if (!isValidLegacy) {
                throw new Error("Invalid credentials")
            }
            if (passwordPepper) {
                const upgradedHash = await bcrypt.hash(withPepper, bcryptRounds)
                await this.userRepo.updatePassword(user.id, upgradedHash)
            }
        }

        const token = fastifyJwt.sign({
            sub: user.id.toString(),
            id: user.id.toString(),
            email: user.email,
            displayName: user.displayName || undefined
        })
        return { token }
    }
}
