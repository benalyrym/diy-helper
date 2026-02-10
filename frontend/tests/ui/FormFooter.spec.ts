import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import FormFooter from "../../app/components/formulateur-cosmetique/ui/Footer.vue"

describe("FormFooter", () => {
    it("renders disclaimer and metadata", () => {
        const wrapper = mount(FormFooter, {
            props: {
                currentDate: "01/01/2025",
            },
        })

        const footer = wrapper.find("footer")
        expect(footer.classes()).toContain("mt-12")
        expect(wrapper.text()).toContain("Avertissement important")
        expect(wrapper.text()).toContain("01/01/2025")
    })
})
