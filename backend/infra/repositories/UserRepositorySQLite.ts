import { db } from "../db"
import { v4 as uuidv4 } from "uuid"

export class UserRepositorySQLite {
    async save(data: any) {
        const id = uuidv4()
        db.prepare(
            "INSERT INTO users (id,email,password) VALUES (?,?,?)"
        ).run(id, data.email, data.password)
        return { id, email: data.email }
    }

    async findByEmail(email: string) {
        return db
            .prepare("SELECT * FROM users WHERE email=?")
            .get(email)
    }
}
