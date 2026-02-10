export type AuthCredentials = {
    email: string
    password: string
}

export type SignupPayload = {
    email: string
    password: string
    firstName?: string
    lastName?: string
    displayName?: string
}

export type LoginResponse = {
    token: string
}
