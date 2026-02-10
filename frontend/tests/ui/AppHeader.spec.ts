import { describe, it, expect, vi } from "vitest"
import { mount, flushPromises } from "@vue/test-utils"
import AppHeader from "../../app/components/layout/AppHeader.vue"

vi.mock("~/composables/useAuth", () => ({
    useAuth: () => ({
        logout: vi.fn()
    })
}))

vi.mock("~/composables/useApi", () => ({
    useApi: () => ({
        listRecipes: vi.fn(async () => [
            { id: "1", name: "Test", ingredients: [] },
            { id: "2", name: "Test 2", ingredients: [] }
        ])
    })
}))

vi.mock("#imports", () => ({
    useRoute: () => ({ path: "/" }),
    useRouter: () => ({ push: vi.fn() })
}))

describe("AppHeader", () => {
    it("shows recipe count badge", async () => {
        const wrapper = mount(AppHeader, {
            global: {
                stubs: {
                    NuxtLink: { template: "<a><slot /></a>" }
                }
            }
        })

        await flushPromises()
        expect(wrapper.text()).toContain("2")
    })
})
