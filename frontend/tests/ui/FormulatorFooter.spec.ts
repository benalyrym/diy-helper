import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import Footer from "../../app/features/formulateur-cosmetique/components/ui/Footer.vue"

describe("Formulateur Footer", () => {
    it("renders current date", () => {
        const wrapper = mount(Footer, {
            props: { currentDate: "2026-02-10" }
        })

        expect(wrapper.text()).toContain("2026-02-10")
    })
})
