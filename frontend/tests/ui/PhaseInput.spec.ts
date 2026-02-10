import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import PhaseInput from "../../app/components/PhaseInput.vue"

describe("PhaseInput", () => {
    it("emits updated ingredients when adding", async () => {
        const wrapper = mount(PhaseInput, {
            props: {
                phase: "Phase A",
                ingredients: []
            }
        })

        await wrapper.find("button").trigger("click")
        const emitted = wrapper.emitted("update:ingredients")
        expect(emitted).toBeTruthy()
        expect(emitted?.[0]?.[0]?.length).toBe(1)
    })
})
