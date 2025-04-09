import { mount, shallowMount } from "@vue/test-utils";
import { nextTick } from "vue";
import wysiwyg from "../components/wysiwyg.vue";

// Mock the imports that might cause issues in test environment
vi.mock('@vueuse/core', () => ({
    useCookies: () => ({
        get: vi.fn().mockReturnValue('{}'),
        set: vi.fn()
    })
}));

// Mock quill and related imports
vi.mock('quill', () => {
    return {
        default: class MockQuill {
            constructor() {
                this.root = { innerHTML: '' };
                this.clipboard = {
                    convert: vi.fn().mockReturnValue({})
                };
            }
            getModule() {
                return {
                    addHandler: vi.fn()
                };
            }
            getSelection() {
                return { index: 0, length: 0 };
            }
            getContents() {
                return { ops: [] };
            }
            getFormat() {
                return {};
            }
            insertEmbed() { }
            deleteText() { }
            formatText() { }
            static register() { }
            static import() {
                return {
                    create: () => ({}),
                    value: () => ({})
                };
            }
        }
    };
});

vi.mock('quill/dist/quill.snow.css', () => ({}));
vi.mock('@devdcodes9/quill-emojijs', () => ({
    default: {
        ToolbarEmoji: {},
        EmojiBlot: {}
    }
}));
vi.mock('@devdcodes9/quill-emojijs/dist/quill-emoji.css', () => ({}));
vi.mock('quill-html-edit-button', () => ({
    htmlEditButton: {}
}));

describe("wysiwyg", () => {
    test("is a Vue instance", () => {
        const wrapper = shallowMount(wysiwyg, {
            global: {
                stubs: {
                    MediaComponent: true
                }
            }
        });
        expect(wrapper.vm).toBeTruthy();
    });

    test("renders the component with correct structure", () => {
        const wrapper = shallowMount(wysiwyg, {
            global: {
                stubs: {
                    MediaComponent: true
                }
            }
        });
        expect(wrapper.find('.wyzywig-wrapper').exists()).toBe(true);
        expect(wrapper.find('.wyzywig-desc').exists()).toBe(true);
    });

    test("emits settingsUpdate when settings change", async () => {
        const wrapper = shallowMount(wysiwyg, {
            global: {
                stubs: {
                    MediaComponent: true
                }
            }
        });

        // Set the settings value
        await wrapper.setData({ settings: 'new content' });

        // Check if the event was emitted with correct value
        expect(wrapper.emitted('settingsUpdate')).toBeTruthy();
        expect(wrapper.emitted('settingsUpdate')[0]).toEqual(['new content']);
    });

    test("updates settings when html prop changes", async () => {
        const wrapper = shallowMount(wysiwyg, {
            props: {
                html: 'initial content'
            },
            global: {
                stubs: {
                    MediaComponent: true
                }
            }
        });

        expect(wrapper.vm.settings).toBe('initial content');

        // Update the html prop
        await wrapper.setProps({ html: 'updated content' });

        // Check if settings was updated
        expect(wrapper.vm.settings).toBe('updated content');
    });
});