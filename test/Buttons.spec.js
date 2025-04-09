import { mount } from "@vue/test-utils";
import Buttons from "../components/Buttons.vue";

describe("Buttons", () => {
    test("is a Vue instance", () => {
        const wrapper = mount(Buttons);
        expect(wrapper.vm).toBeTruthy();
    });

    test("renders button with correct text", () => {
        const buttonText = "Test Button";
        const wrapper = mount(Buttons, {
            props: {
                buttonText
            }
        });
        expect(wrapper.text()).toContain(buttonText);
    });

    test("applies active style when active is true", () => {
        const buttonStyle = "bg-blue-500";
        const wrapper = mount(Buttons, {
            props: {
                active: true,
                buttonStyle
            }
        });
        const button = wrapper.find("button");
        expect(button.classes()).toContain(buttonStyle);
    });

    test("applies inactive style when active is false", () => {
        const inactiveButtonStyle = "bg-gray-500";
        const wrapper = mount(Buttons, {
            props: {
                active: false,
                inactiveButtonStyle
            }
        });
        const button = wrapper.find("button");
        expect(button.classes()).toContain(inactiveButtonStyle);
    });

    test("emits click event when button is clicked", async () => {
        const mockFn = vi.fn();
        const wrapper = mount(Buttons, {
            props: {
                submitFunction: mockFn
            }
        });
        await wrapper.find("button").trigger("click");
        expect(mockFn).toHaveBeenCalled();
    });
});