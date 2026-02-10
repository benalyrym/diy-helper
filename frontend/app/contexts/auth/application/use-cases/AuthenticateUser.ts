import type { AuthCredentials, LoginResponse } from "../../../types/auth"
import type { AuthRepository } from "../../domain/repositories/AuthRepository"

export class AuthenticateUser {
    constructor(private readonly repository: AuthRepository) {}

    async execute(credentials: AuthCredentials): Promise<LoginResponse> {
        return this.repository.login(credentials)
    }
}
