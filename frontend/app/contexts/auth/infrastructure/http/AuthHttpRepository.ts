import type { AuthCredentials, LoginResponse, SignupPayload } from "../../../types/auth"
import type { AuthRepository } from "../../domain/repositories/AuthRepository"

type RequestFn = <T>(url: string, options?: any) => Promise<T>

export class AuthHttpRepository implements AuthRepository {
    constructor(private readonly request: RequestFn) {}

    login(credentials: AuthCredentials): Promise<LoginResponse> {
        return this.request<LoginResponse>("/login", {
            method: "POST",
            body: {
                email: credentials.email,
                password: credentials.password
            }
        })
    }

    signup(payload: SignupPayload): Promise<void> {
        return this.request<void>("/signup", {
            method: "POST",
            body: payload
        })
    }
}
