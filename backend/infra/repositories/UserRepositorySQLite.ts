import { db } from "../db"
import { v4 as uuidv4 } from "uuid"

export class UserRepositorySQLite {
    async save(data: any) {
        const id = uuidv4()
        const createdAt = new Date().toISOString()
        db.prepare(
            "INSERT INTO users (id, email, password, firstName, lastName, displayName, createdAt) VALUES (?,?,?,?,?,?,?)"
        ).run(
            id,
            data.email,
            data.password,
            data.firstName || null,
            data.lastName || null,
            data.displayName || null,
            createdAt
        )
        return {
            id,
            email: data.email,
            firstName: data.firstName || null,
            lastName: data.lastName || null,
            displayName: data.displayName || null,
            createdAt
        }
    }

    async findByEmail(email: string) {
        const normalized = (email || '').trim().toLowerCase()
        return db
            .prepare("SELECT * FROM users WHERE email=?")
            .get(normalized)
    }

    async updatePassword(userId: string, password: string) {
        db.prepare(
            "UPDATE users SET password = ? WHERE id = ?"
        ).run(password, userId)
    }
}
