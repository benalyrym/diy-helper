import type { SignupPayload } from "../../../types/auth"
import type { AuthRepository } from "../../domain/repositories/AuthRepository"

export class RegisterUser {
    constructor(private readonly repository: AuthRepository) {}

    async execute(payload: SignupPayload): Promise<void> {
        await this.repository.signup(payload)
    }
}
