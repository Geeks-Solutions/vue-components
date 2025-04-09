import { mount } from "@vue/test-utils";
import Inputs from "../components/Inputs.vue";

describe("Inputs", () => {
    test("is a Vue instance", () => {
        const wrapper = mount(Inputs);
        expect(wrapper.vm).toBeTruthy();
    });

    test("renders input with correct placeholder", () => {
        const placeholder = "Test Placeholder";
        const wrapper = mount(Inputs, {
            props: {
                placeholder
            }
        });
        const input = wrapper.find("input");
        expect(input.attributes("placeholder")).toBe(placeholder);
    });

    test("adds asterisk to placeholder when requiredInput is true", () => {
        const placeholder = "Test Placeholder";
        const wrapper = mount(Inputs, {
            props: {
                placeholder,
                requiredInput: true
            }
        });
        const input = wrapper.find("input");
        expect(input.attributes("placeholder")).toBe(placeholder + "*");
    });

    test("disables input when active is false", () => {
        const wrapper = mount(Inputs, {
            props: {
                active: false
            }
        });
        const input = wrapper.find("input");
        expect(input.attributes("disabled")).toBeDefined();
    });

    test("renders textarea when textArea prop is true", () => {
        const wrapper = mount(Inputs, {
            props: {
                textArea: true
            }
        });
        expect(wrapper.find("textarea").exists()).toBe(true);
        expect(wrapper.find("input").exists()).toBe(false);
    });

    test("emits input event when input value changes", async () => {
        const wrapper = mount(Inputs);
        const input = wrapper.find("input");
        await input.setValue("test value");
        expect(wrapper.emitted("input")).toBeTruthy();
        expect(wrapper.emitted("input")[0]).toEqual(["test value"]);
    });

    test("toggles password visibility when showPass is called", async () => {
        const wrapper = mount(Inputs, {
            props: {
                types: "password",
                eyeIconIcomoon: true
            }
        });

        // Initially password should be hidden
        let input = wrapper.find("input");
        expect(input.attributes("type")).toBe("password");

        // Find and click the eye icon
        const eyeIcon = wrapper.find("span[class*='icon-eye']");
        await eyeIcon.trigger("click");

        // Password should now be visible
        input = wrapper.find("input");
        expect(input.attributes("type")).toBe("text");
    });
});