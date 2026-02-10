import type { AuthCredentials, LoginResponse, SignupPayload } from "../../types/auth"

type RequestFn = <T>(url: string, options?: any) => Promise<T>

export const createAuthApi = (request: RequestFn) => {
    const login = (credentials: AuthCredentials) =>
        request<LoginResponse>("/login", {
            method: "POST",
            body: {
                email: credentials.email,
                password: credentials.password
            }
        })

    const signup = (payload: SignupPayload) =>
        request("/signup", {
            method: "POST",
            body: payload
        })

    return {
        login,
        signup
    }
}
