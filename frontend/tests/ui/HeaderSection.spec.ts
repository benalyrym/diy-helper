import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import HeaderSection from "../../app/components/formulateur-cosmetique/ui/HeaderSection.vue"

describe("HeaderSection", () => {
    it("renders the title and subtitle", () => {
        const wrapper = mount(HeaderSection, {
            props: {
                completionPercentage: 42,
                regulatoryStatus: { isValid: true },
                sections: [{ id: "base", name: "Base" }],
            },
        })

        expect(wrapper.find("h1").text()).toContain("Formulateur")
        expect(wrapper.text()).toContain("Règlement UE 1223/2009")
    })

    it("exposes the progress bar width", () => {
        const wrapper = mount(HeaderSection, {
            props: {
                completionPercentage: 60,
                regulatoryStatus: { isValid: false },
                sections: [],
            },
        })

        const bar = wrapper.find("[role='progressbar']")
        expect(bar.exists()).toBe(true)
        expect(bar.attributes("style")).toContain("width: 60%")
    })
})
