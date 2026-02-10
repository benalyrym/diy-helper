import type { AuthCredentials, LoginResponse, SignupPayload } from "../../../types/auth"

export interface AuthRepository {
    login(credentials: AuthCredentials): Promise<LoginResponse>
    signup(payload: SignupPayload): Promise<void>
}
