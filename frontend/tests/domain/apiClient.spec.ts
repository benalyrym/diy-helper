import { describe, it, expect, vi } from "vitest"
import { createApiClient } from "../../app/utils/apiClient"

const makeError = (status: number) => ({
    response: { status }
})

describe("apiClient", () => {
    it("retries idempotent requests once", async () => {
        let calls = 0
        const fetcher = vi.fn(async () => {
            calls += 1
            if (calls === 1) {
                throw makeError(503)
            }
            return { ok: true }
        })

        const client = createApiClient({
            baseURL: "http://example.com",
            fetcher: fetcher as any
        })

        const res = await client.request<{ ok: boolean }>("/health", { retry: 1 })
        expect(res.ok).toBe(true)
        expect(calls).toBe(2)
    })

    it("does not retry non-idempotent requests", async () => {
        const fetcher = vi.fn(async () => {
            throw makeError(503)
        })

        const client = createApiClient({
            baseURL: "http://example.com",
            fetcher: fetcher as any
        })

        await expect(
            client.request("/login", { method: "POST", retry: 2 })
        ).rejects.toBeTruthy()
        expect(fetcher).toHaveBeenCalledTimes(1)
    })

    it("calls onUnauthorized handler on 401", async () => {
        const fetcher = vi.fn(async () => {
            throw makeError(401)
        })
        const onUnauthorized = vi.fn()

        const client = createApiClient({
            baseURL: "http://example.com",
            fetcher: fetcher as any
        })

        await expect(
            client.request("/me", { onUnauthorized })
        ).rejects.toBeTruthy()

        expect(onUnauthorized).toHaveBeenCalledTimes(1)
    })
})
