import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import FormulaHeader from "../../app/features/recipes/components/FormulaHeader.vue"

describe("FormulaHeader", () => {
    it("emits actions when buttons are clicked", async () => {
        const wrapper = mount(FormulaHeader, {
            props: {
                formula: { id: "1", name: "Test", updatedAt: new Date().toISOString(), ingredients: [] },
                isFormulaValid: true,
                showGeneratePDF: true,
                showPrint: true
            },
            global: {
                stubs: {
                    NuxtLink: { template: "<a><slot /></a>" }
                }
            }
        })

        await wrapper.findAll("button")[0].trigger("click")
        await wrapper.findAll("button")[1].trigger("click")

        expect(wrapper.emitted("generate-pdf")).toBeTruthy()
        expect(wrapper.emitted("toggle-print")).toBeTruthy()
    })
})
