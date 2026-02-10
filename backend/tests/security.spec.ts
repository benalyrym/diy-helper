import { describe, it, expect, beforeAll, afterAll } from "vitest"

let app: any

const createApp = async () => {
    process.env.DB_PATH = ":memory:"
    process.env.JWT_SECRET = "test-secret"
    process.env.CORS_ORIGIN = "http://localhost:3000"
    const { buildApp } = await import("../app.js")
    const instance = buildApp()
    await instance.ready()
    return instance
}

const signup = async (email: string, password: string) => {
    return app.inject({
        method: "POST",
        url: "/signup",
        payload: { email, password }
    })
}

const login = async (email: string, password: string) => {
    return app.inject({
        method: "POST",
        url: "/login",
        payload: { email, password }
    })
}

describe("backend security", () => {
    beforeAll(async () => {
        app = await createApp()
    })

    afterAll(async () => {
        await app.close()
    })

    it("blocks unauthenticated access", async () => {
        const res = await app.inject({
            method: "GET",
            url: "/recipes"
        })
        expect(res.statusCode).toBe(401)
    })

    it("allows signup/login and rejects invalid recipe payloads", async () => {
        const email = "test@example.com"
        const password = "Password123"
        const signupRes = await signup(email, password)
        expect(signupRes.statusCode).toBe(201)

        const loginRes = await login(email, password)
        expect(loginRes.statusCode).toBe(200)
        const token = JSON.parse(loginRes.body).token
        expect(token).toBeTruthy()

        const badRecipe = await app.inject({
            method: "POST",
            url: "/recipes",
            headers: { Authorization: `Bearer ${token}` },
            payload: { description: "no name" }
        })
        expect(badRecipe.statusCode).toBe(400)
    })

    it("enforces ownership on delete", async () => {
        const ownerEmail = "owner@example.com"
        const otherEmail = "other@example.com"
        const password = "Password123"

        await signup(ownerEmail, password)
        await signup(otherEmail, password)

        const ownerToken = JSON.parse((await login(ownerEmail, password)).body).token
        const otherToken = JSON.parse((await login(otherEmail, password)).body).token

        const created = await app.inject({
            method: "POST",
            url: "/recipes",
            headers: { Authorization: `Bearer ${ownerToken}` },
            payload: { name: "Secret recipe" }
        })
        expect(created.statusCode).toBe(201)
        const recipeId = JSON.parse(created.body).id

        const deleteOther = await app.inject({
            method: "DELETE",
            url: `/recipes/${recipeId}`,
            headers: { Authorization: `Bearer ${otherToken}` }
        })
        expect(deleteOther.statusCode).toBe(404)
    })

    it("rate limits login", async () => {
        const email = "rate@example.com"
        const password = "Password123"
        await signup(email, password)

        for (let i = 0; i < 5; i += 1) {
            await login(email, "WrongPass123")
        }
        const limited = await login(email, "WrongPass123")
        expect(limited.statusCode).toBe(429)
    })
})
