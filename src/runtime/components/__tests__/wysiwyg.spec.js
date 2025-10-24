// QuillEditor.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import QuillEditor from '../wysiwyg.vue'
import {createI18n} from "vue-i18n"; // Adjust path as needed

// Mock Quill and its dependencies
const mockQuillInstance = {
    root: { innerHTML: '<p><br></p>' },
    getSelection: vi.fn(() => ({ index: 0, length: 0 })),
    setSelection: vi.fn(),
    getContents: vi.fn(() => ({ ops: [] })),
    setContents: vi.fn(),
    insertEmbed: vi.fn(),
    getLeaf: vi.fn(() => [
        {
            parent: {
                domNode: {
                    href: 'https://google.com'
                }
            }
        },
        0
    ]),
    deleteText: vi.fn(),
    formatText: vi.fn(),
    getFormat: vi.fn(() => ({})),
    getLength: vi.fn(() => 1),
    getModule: vi.fn((module) => {
        if (module === 'toolbar') {
            return {
                addHandler: vi.fn()
            }
        }
        if (module === 'table') {
            return {
                insertTable: vi.fn()
            }
        }
        return {}
    }),
    on: vi.fn(),
    clipboard: {
        convert: vi.fn(() => ({ ops: [] })),
        dangerouslyPasteHTML: vi.fn()
    },
    scroll: {
        descendant: vi.fn(() => [null, 0])
    }
}

// Mock Quill constructor
const MockQuill = vi.fn(() => mockQuillInstance)
MockQuill.import = vi.fn((path) => {
    if (path === 'formats/image') {
        return class ImageBlot {
            static create = vi.fn()
            static value = vi.fn()
        }
    }
    if (path === 'blots/embed') {
        return class Embed {
            static create = vi.fn()
        }
    }
    if (path === 'blots/block/embed') {
        return class BlockEmbed {
            static create = vi.fn()
        }
    }
    if (path === 'attributors/style/size') {
        return { whitelist: [] }
    }
    if (path === 'formats/link') {
        return class LinkFormat {
            static create = vi.fn()
            static sanitize = vi.fn((value) => value)
        }
    }
    return {}
})
MockQuill.register = vi.fn()
MockQuill.sources = {
    USER: 'user',
    SILENT: 'silent'
}

// Mock dynamic imports
vi.mock('quill', () => ({
    default: MockQuill
}))

vi.mock('quill/dist/quill.snow.css', () => ({}))

vi.mock('@devdcodes9/quill-emojijs', () => ({
    default: {
        ToolbarEmoji: class ToolbarEmoji {},
        EmojiBlot: class EmojiBlot {}
    }
}))

vi.mock('@devdcodes9/quill-emojijs/dist/quill-emoji.css', () => ({}))

vi.mock('quill-table-ui', () => ({
    default: class TableUI {}
}))

vi.mock('quill-table-ui/dist/index.css', () => ({}))

// Mock Nuxt composables
vi.mock('#imports', () => ({
    ref: vi.fn((val) => ({ value: val })),
    useRoute: vi.fn(() => ({
        query: { id: 'test-id' }
    })),
    useCookie: vi.fn(() => ({ value: null })),
    onMounted: vi.fn((fn) => fn()),
    onBeforeUnmount: vi.fn(),
    watch: vi.fn(),
    nextTick: vi.fn(() => Promise.resolve())
}))

// Mock LazyGMediaComponent
const LazyGMediaComponent = {
    name: 'LazyGMediaComponent',
    template: '<div ref="sectionsMediaComponentRef" data-testid="media-component"></div>',
    methods: {
        openModal: vi.fn(),
        closeModal: vi.fn()
    }
}

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: {},
        fr: {}
    }
})

describe('QuillEditor Component', () => {
    let wrapper
    let mockProps

    beforeEach(() => {
        // Reset all mocks
        vi.clearAllMocks()

        mockProps = {
            html: '<p>Test content</p>',
            quillKey: 'test-key',
            editorOptions: {},
            sectionsWysiwygEditorOptions: {},
            authToken: 'test-token',
            sectionsUserId: 'user-123',
            projectIdProp: 'project-456',
            serverUrl: 'https://test.com',
            selectedMediaId: 'media-789',
            contentUsedKey: 'title',
            mediaTranslationPrefix: 'mediaT.',
            fontFamilies: ['Open Sans', 'Roboto', 'Poppins']
        }
    })

    describe('Component Initialization', () => {
        it('should render the component with correct structure', async () => {
            wrapper = shallowMount(QuillEditor, {
                props: mockProps,
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })

            expect(wrapper.find('.quill-editor.wyzywig').exists()).toBe(true)
            expect(wrapper.find('.wyzywig-desc').exists()).toBe(true)
        })

        it('should initialize with default props', () => {
            wrapper = shallowMount(QuillEditor, {
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })

            const vm = wrapper.vm
            expect(vm.html).toBe('')
            expect(vm.quillKey).toBe('quillKey')
            expect(vm.contentUsedKey).toBe('title')
        })

        it('should accept and use custom props', () => {
            wrapper = shallowMount(QuillEditor, {
                props: mockProps,
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })

            const vm = wrapper.vm
            expect(vm.html).toBe('<p>Test content</p>')
            expect(vm.quillKey).toBe('test-key')
            expect(vm.authToken).toBe('test-token')
            expect(vm.sectionsUserId).toBe('user-123')
            expect(vm.projectIdProp).toBe('project-456')
        })

        it('creates a style element with correct id and CSS for each font', () => {
            wrapper = shallowMount(QuillEditor, {
                props: mockProps,
                global: {
                    plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    },
                },
            })

            const result = wrapper.vm.setupFontFamilies()
            wrapper.vm.initEditorOptions()

            const style = document.getElementById('custom-quill-fonts')
            expect(style).toBeTruthy()
            expect(style.tagName).toBe('STYLE')

            // It should have generated CSS for each font
            expect(style.innerHTML).toContain('.ql-font-open_sans')
            expect(style.innerHTML).toContain('.ql-font-roboto')
            expect(style.innerHTML).toContain('.ql-font-poppins')

            // Should return normalized font names
            expect(result).toEqual(['open_sans', 'roboto', 'poppins'])

            expect(wrapper.vm.editorOptionsObject.modules.toolbar.container[2][0].font).toEqual(['open_sans', 'roboto', 'poppins'])
        })

        it('does not create duplicate style nodes if one already exists', () => {
            wrapper = shallowMount(QuillEditor, {
                props: mockProps,
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })

            // First call
            wrapper.vm.setupFontFamilies()
            // Second call (should not re-add)
            wrapper.vm.setupFontFamilies()

            const styles = document.querySelectorAll('#custom-quill-fonts')
            expect(styles.length).toBe(1)
        })
    })

    describe('Editor Options', () => {
        it('should use custom editor options when provided', async () => {
            const customOptions = {
                theme: 'snow',
                modules: {
                    toolbar: {
                        container: [['bold', 'italic']]
                    }
                }
            }

            wrapper = shallowMount(QuillEditor, {
                props: {
                    ...mockProps,
                    editorOptions: customOptions
                },
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })

            // Wait for component to initialize
            await flushPromises()

            // Check if MockQuill was called with custom options
            expect(MockQuill).toHaveBeenCalled()
        })

        it('should use sections editor options when editorOptions is empty', async () => {
            const sectionsOptions = {
                theme: 'snow',
                modules: {
                    toolbar: {
                        container: [['underline', 'strike']]
                    }
                }
            }

            wrapper = shallowMount(QuillEditor, {
                props: {
                    ...mockProps,
                    sectionsWysiwygEditorOptions: sectionsOptions,
                    editorOptions: {}
                },
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })

            await flushPromises()
            expect(MockQuill).toHaveBeenCalled()
        })

        it('should use default options when no custom options provided', async () => {
            wrapper = shallowMount(QuillEditor, {
                props: {
                    ...mockProps,
                    editorOptions: {},
                    sectionsWysiwygEditorOptions: {}
                },
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })

            await flushPromises()
            expect(MockQuill).toHaveBeenCalled()
        })
    })

    describe('Content Management', () => {
        beforeEach(async () => {
            wrapper = shallowMount(QuillEditor, {
                props: mockProps,
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })
            await flushPromises()
        })

        it('should update content when html prop changes', async () => {
            const newHtml = '<p>Updated content</p>'

            await wrapper.setProps({ html: newHtml })
            await flushPromises()

            // Check if the content was processed
            expect(wrapper.vm.settings).toBe(newHtml)
        })

        it('should emit settingsUpdate when content changes', async () => {
            const vm = wrapper.vm

            // Simulate content change
            vm.settings = '<p>New content</p>'
            await nextTick()

            // Check if the emit was called
            expect(wrapper.emitted('settingsUpdate')).toBeTruthy()
        })

    })

    describe('Media Handling', () => {
        beforeEach(async () => {
            wrapper = shallowMount(QuillEditor, {
                props: mockProps,
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })
            await flushPromises()
        })

        it('should handle media selection', async () => {
            const vm = wrapper.vm
            const mockMedia = {
                id: 'media-123',
                url: 'https://example.com/image.jpg',
                seo_tag: 'Test image',
                files: [{
                    filename: 'image.jpg',
                    url: 'https://example.com/image.jpg'
                }]
            }

            // Simulate media selection
            vm.handleEmittedMedia(mockMedia)

            expect(vm.selectedMedia).toEqual(mockMedia)
        })

        it('should insert media into editor when selectedMedia changes', async () => {
            const vm = wrapper.vm
            const mockMedia = {
                id: 'media-123',
                url: 'https://example.com/image.jpg',
                seo_tag: 'Test image',
                files: [{
                    filename: 'image.jpg',
                    url: 'https://example.com/image.jpg'
                }]
            }

            await nextTick()
            // Set up mock for insertEmbed
            mockQuillInstance.getSelection.mockReturnValue({ index: 0, length: 0 })
            mockQuillInstance.getLength.mockReturnValue(1)

            vm.selectedMedia = mockMedia
            await nextTick()

            expect(mockQuillInstance.insertEmbed).toHaveBeenCalledWith(
                0,
                'customImage',
                expect.objectContaining({
                    src: mockMedia.url,
                    'media-id': mockMedia.id,
                    alt: mockMedia.seo_tag,
                    loading: 'lazy'
                }),
                'user'
            )
        })

        it('should emit wysiwygMedia event when media is inserted', async () => {
            const vm = wrapper.vm
            const mockMedia = {
                id: 'media-123',
                url: 'https://example.com/image.jpg',
                seo_tag: 'Test image',
                files: [{
                    filename: 'image.jpg',
                    url: 'https://example.com/image.jpg'
                }]
            }

            vm.selectedMedia = mockMedia
            await nextTick()

            expect(wrapper.emitted('wysiwygMedia')).toBeTruthy()
            expect(wrapper.emitted('wysiwygMedia')[0][0]).toEqual(
                expect.objectContaining({
                    media_id: mockMedia.id,
                    url: mockMedia.url,
                    seo_tag: mockMedia.seo_tag
                })
            )
        })
    })

    describe('Format Management', () => {
        beforeEach(async () => {
            wrapper = shallowMount(QuillEditor, {
                props: mockProps,
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })
            await flushPromises()
        })

        it('should save format correctly', () => {
            const vm = wrapper.vm
            const mockFormat = { bold: true, italic: true }

            mockQuillInstance.getSelection.mockReturnValue({ index: 0, length: 5 })
            mockQuillInstance.getFormat.mockReturnValue(mockFormat)

            vm.saveFormat()

            // Check if cookie was set (mocked)
            expect(mockQuillInstance.getFormat).toHaveBeenCalledWith({ index: 0, length: 5 })
        })

        it('should apply saved format correctly', () => {
            const vm = wrapper.vm
            const mockFormat = { bold: true, color: '#ff0000' }

            // Mock saved format
            vm.sectionsQuillFormatCookie = { value: JSON.stringify(mockFormat) }
            mockQuillInstance.getSelection.mockReturnValue({ index: 0, length: 5 })

            vm.applyFormat()

            expect(mockQuillInstance.formatText).toHaveBeenCalledWith(
                0,
                5,
                {
                    "value": JSON.stringify(mockFormat)
                },
                'user'
            )
        })

        it('should handle invalid saved format gracefully', () => {
            const vm = wrapper.vm

            // Mock invalid format
            vm.sectionsQuillFormatCookie = { value: 'invalid-json' }
            mockQuillInstance.getSelection.mockReturnValue({ index: 0, length: 5 })

            expect(() => vm.applyFormat()).not.toThrow()
        })
    })

    describe('Utility Functions', () => {
        beforeEach(async () => {
            wrapper = shallowMount(QuillEditor, {
                props: mockProps,
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })
            await flushPromises()
        })

        it('should validate correctly', () => {
            const vm = wrapper.vm
            expect(vm.validate()).toBe(true)
        })

        it('should open media upload modal', () => {
            const vm = wrapper.vm
            const mediaComponentRef = {
                openModal: vi.fn()
            }
            vm.sectionsMediaComponentRef = mediaComponentRef

            vm.uploadFunction('media-123')

            expect(mediaComponentRef.openModal).toHaveBeenCalledWith('media-123', null)
        })

        it('should open media upload modal without mediaId', () => {
            const vm = wrapper.vm
            const mediaComponentRef = {
                openModal: vi.fn()
            }
            vm.sectionsMediaComponentRef = mediaComponentRef

            vm.uploadFunction()

            expect(mediaComponentRef.openModal).toHaveBeenCalledWith(null, null)
        })
    })

    describe('Event Emissions', () => {
        beforeEach(async () => {
            wrapper = shallowMount(QuillEditor, {
                props: mockProps,
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })
            await flushPromises()
        })

        it('should emit settingsUpdate when settings change', async () => {
            const vm = wrapper.vm

            vm.settings = '<p>Changed content</p>'
            await nextTick()

            expect(wrapper.emitted()).toHaveProperty('settingsUpdate')
        })

        it('should not emit settingsUpdate for initial empty state', async () => {
            wrapper = shallowMount(QuillEditor, {
                props: { ...mockProps, html: '' },
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })

            const vm = wrapper.vm
            vm.settings = ''
            await nextTick()

            // Should not emit for initial empty state
            expect(wrapper.emitted('settingsUpdate')).toBeFalsy()
        })

        it('should emit wysiwygMedia when media is handled', async () => {
            const vm = wrapper.vm
            const mockMedia = {
                id: 'media-123',
                url: 'https://example.com/image.jpg',
                seo_tag: 'Test image',
                files: [{ filename: 'image.jpg', url: 'https://example.com/image.jpg' }]
            }

            vm.selectedMedia = mockMedia
            await nextTick()

            expect(wrapper.emitted()).toHaveProperty('wysiwygMedia')
        })
    })

    describe('Fonts Array', () => {
        it('should have correct font sizes in fontsArray', async () => {
            wrapper = shallowMount(QuillEditor, {
                props: mockProps,
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })

            const vm = wrapper.vm
            expect(vm.fontsArray).toEqual([
                "0.25rem", "0.5rem", "0.75rem", false, "1.25rem", "1.5rem", "1.75rem", "2rem",
                "2.25rem", "2.5rem", "2.75rem", "3rem", "3.25rem", "3.5rem", "3.75rem", "4rem",
                "4.25rem", "4.5rem", "4.75rem", "5rem", "5.25rem", "5.5rem", "5.75rem", "6rem",
                "6.25rem", "6.5rem", "6.75rem", "7rem", "7.25rem", "7.5rem", "7.75rem", "8rem"
            ])
        })
    })

    describe('Error Handling', () => {
        it('should handle missing Quill instance gracefully', () => {
            wrapper = shallowMount(QuillEditor, {
                props: mockProps,
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })

            const vm = wrapper.vm

            // Test saveFormat without Quill instance
            vm.QuillEditorComponent = null
            expect(() => vm.saveFormat()).not.toThrow()

            // Test applyFormat without Quill instance
            expect(() => vm.applyFormat()).not.toThrow()
        })

    })

    describe('Media Content Management', () => {
        beforeEach(async () => {
            wrapper = shallowMount(QuillEditor, {
                props: mockProps,
                global: {plugins: [i18n],
                    components: {
                        LazyGMediaComponent,
                        ClientOnly: {
                            template: '<div><slot /></div>'
                        }
                    }
                }
            })
            await flushPromises()
        })

        it('Should preserve anchor link of a media when updating one', async () => {

            // Step 1: Set the settings value
            wrapper.vm.settings = '<p><a href="https://google.com" target="_blank"><img src="https://s3.amazonaws.com/eweevtestbucketprivate/sections%2Fsections_suchi4441851b50aa040d4b297e5e647ef2eaacb65a3eb576a4f51bf73b1a31bc98f11.png" media-id="685d49b710d4b50006a4f4ad" loading="lazy"></a></p>';

            // Verify initial settings value
            expect(wrapper.vm.settings).toContain('href="https://google.com"');
            expect(wrapper.vm.settings).toContain('<a');
            expect(wrapper.vm.settings).toContain('</a>');

            // Step 2: Trigger the watcher by setting selectedMedia
            wrapper.vm.selectedMedia = {
                id: '685d49b710d4b50006a4f4ad',
                url: 'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2Fsections_new_image.png',
                seo_tag: 'New Image',
                files: [{
                    filename: 'new_image.png',
                    url: 'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2Fsections_new_image.png'
                }],
                metadata: {
                    type: 'image'
                }
            };

            // Wait for watcher to execute
            await nextTick();
            await nextTick(); // Extra tick to ensure async operations complete

            // Step 3: Verify that settings still contains the anchor tag
            expect(wrapper.vm.settings).toContain('href="https://google.com"');
            expect(wrapper.vm.settings).toContain('<a');
            expect(wrapper.vm.settings).toContain('</a>');
            expect(wrapper.vm.settings).toContain('target="_blank"');
        })

        it('Should have correct index for content selection', async () => {

            // Step 1: Set the settings value
            wrapper.vm.settings = '<p><a href=\"https://google.com\" target=\"_blank\"><img src=\"https://s3.amazonaws.com/eweevtestbucketprivate/sections%2Fsections_suchi4441851b50aa040d4b297e5e647ef2eaacb65a3eb576a4f51bf73b1a31bc98f11.png\" media-id=\"685d49b710d4b50006a4f4ad\" media-type=\"image\" alt=\"\" loading=\"lazy\"></a></p><p><br></p><p><a href=\"https://fb.com\" target=\"_blank\"><img src=\"https://s3.amazonaws.com/eweevtestbucketprivate/sections%2F%E6%96%B0LOGO+5-31-1+%281%29cf4e44a2a0544a00a2890f885b5cbb76.png\" media-id=\"67bf37b7abf46d0007789ebc\" media-type=\"image\" alt=\"\" loading=\"lazy\"></a></p>';

            // Verify initial settings value
            expect(wrapper.vm.settings).toContain('href="https://google.com"');
            expect(wrapper.vm.settings).toContain('href="https://fb.com"');
            expect(wrapper.vm.settings).toContain('<a');
            expect(wrapper.vm.settings).toContain('</a>');

            // Step 2: Trigger the watcher by setting selectedMedia
            wrapper.vm.selectedMedia = {
                id: '685d49b710d4b50006a4f4ad',
                url: 'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2Fsections_new_image.png',
                seo_tag: 'New Image',
                files: [{
                    filename: 'new_image.png',
                    url: 'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2Fsections_new_image.png'
                }],
                metadata: {
                    type: 'image'
                }
            };

            // Wait for watcher to execute
            await nextTick();
            await nextTick(); // Extra tick to ensure async operations complete

            // Step 3: Verify that settings still contains the anchor tag
            expect(wrapper.vm.settings).toContain('href="https://google.com"');
            expect(wrapper.vm.settings).toContain('href="https://fb.com"');
            expect(wrapper.vm.settings).toContain('<a');
            expect(wrapper.vm.settings).toContain('</a>');
            expect(wrapper.vm.settings).toContain('target="_blank"');
        })

    })
})

// Mock Quill - you'll need to adjust this based on your actual Quill setup
const mockQuill = {
    import: vi.fn(),
    register: vi.fn(),
    sources: { USER: 'user', SILENT: 'silent' }
}

// Mock your HTML module and blot classes here
// This is a simplified version - adjust based on your actual implementation
global.Quill = mockQuill

describe('Quill HTML Module Multi-Instance Tests', () => {
    let wrapper1, wrapper2
    let quillInstance1, quillInstance2
    let htmlModule1, htmlModule2

    beforeEach(async () => {
        // Create mock DOM elements for Quill containers
        const container1 = document.createElement('div')
        const container2 = document.createElement('div')
        container1.className = 'ql-container'
        container2.className = 'ql-container'
        document.body.appendChild(container1)
        document.body.appendChild(container2)

        // Mock Quill instances
        quillInstance1 = {
            container: container1,
            getSelection: vi.fn(() => ({ index: 0 })),
            getModule: vi.fn(() => ({ addHandler: vi.fn() })),
            insertEmbed: vi.fn(),
            setSelection: vi.fn(),
            scroll: {
                descendant: vi.fn(() => [null, 0])
            }
        }

        quillInstance2 = {
            container: container2,
            getSelection: vi.fn(() => ({ index: 0 })),
            getModule: vi.fn(() => ({ addHandler: vi.fn() })),
            insertEmbed: vi.fn(),
            setSelection: vi.fn(),
            scroll: {
                descendant: vi.fn(() => [null, 0])
            }
        }

        // Import your HTMLModule class here
        const HTMLModule = class HTMLModule {
            constructor(quill, opts) {
                this.quill = quill;
                this.options = opts || {};
                this.toolbar = quill.getModule('toolbar');
                this.currentEditingNode = null; // Track which node is being edited

                // Store reference to this module instance on the quill container
                const container = this.quill.container;
                container.__quill_html_module = this;

                if (this.toolbar) {
                    this.toolbar.addHandler('html', this.handleHTMLPlus.bind(this));
                }

                this.createHTMLEditor();
            }

            createHTMLEditor() {
                // Create instance-specific modal elements
                this.htmlModalElement = document.createElement('div');
                this.htmlModalElement.className = 'ql-html-editor-modal';

                const modalContent = document.createElement('div');
                modalContent.className = 'ql-html-editor-content';

                this.htmlEditorTextareaElement = document.createElement('textarea');
                this.htmlEditorTextareaElement.className = 'ql-html-editor-textarea';

                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'ql-html-editor-buttons';

                const saveButton = document.createElement('button');
                saveButton.textContent = 'Save';
                saveButton.className = 'ql-html-editor-save';

                const cancelButton = document.createElement('button');
                cancelButton.textContent = 'Cancel';
                cancelButton.className = 'ql-html-editor-cancel';

                const noteText = document.createElement('div');
                noteText.textContent = 'Use with cautions, when adding a new html content, make sure to wrap it with a <p></p> tag';
                noteText.className = 'ql-html-editor-noteText';

                buttonContainer.appendChild(saveButton);
                buttonContainer.appendChild(cancelButton);
                buttonContainer.appendChild(noteText);

                modalContent.appendChild(this.htmlEditorTextareaElement);
                modalContent.appendChild(buttonContainer);
                this.htmlModalElement.appendChild(modalContent);

                // Bind event handlers to this instance
                saveButton.addEventListener('click', () => this.saveHTMLPlus());
                cancelButton.addEventListener('click', () => this.hideHTMLEditor());

                this.htmlModalElement.addEventListener('click', (event) => {
                    if (event.target === this.htmlModalElement) {
                        this.hideHTMLEditor();
                    }
                });

                document.body.appendChild(this.htmlModalElement);
                this.htmlModalElement.style.display = 'none';
            }

            handleHTMLPlus() {
                const range = this.quill.getSelection(true);
                const [blot, offset] = this.quill.scroll.descendant(HTMLBlot, range.index);

                let currentHTML = '';
                if (blot !== null) {
                    currentHTML = blot.domNode.getAttribute('data-html') || '';
                    this.currentEditingNode = blot.domNode;
                } else {
                    this.currentEditingNode = null;
                }

                this.showHTMLEditor(currentHTML);
            }

            showHTMLEditor(html, editingNode = null) {
                this.htmlEditorTextareaElement.value = html;
                this.htmlModalElement.style.display = 'flex';

                // Set the current editing node if provided (from edit button click)
                if (editingNode) {
                    this.currentEditingNode = editingNode;
                }

                setTimeout(() => this.htmlEditorTextareaElement.focus(), 0);
            }

            hideHTMLEditor() {
                this.htmlModalElement.style.display = 'none';
                this.currentEditingNode = null;
            }

            saveHTMLPlus() {
                const userHTML = this.htmlEditorTextareaElement.value;

                if (userHTML === null || userHTML === '') {
                    this.hideHTMLEditor();
                    return;
                }

                if (this.currentEditingNode) {
                    // Update existing blot
                    this.currentEditingNode.setAttribute('data-html', userHTML);
                    const contentWrapper = this.currentEditingNode.querySelector('div');
                    if (contentWrapper) {
                        contentWrapper.innerHTML = userHTML;
                    }
                } else {
                    // Insert new blot
                    const range = this.quill.getSelection(true);
                    const insertIndex = range.index;
                    this.quill.insertEmbed(insertIndex, 'html', userHTML, Quill.sources.USER);

                    // Position cursor after the HTML block
                    this.quill.setSelection(insertIndex + 2, 0, Quill.sources.SILENT);
                }

                this.hideHTMLEditor();
            }

            // Cleanup method to remove modal when module is destroyed
            destroy() {
                if (this.htmlModalElement && this.htmlModalElement.parentNode) {
                    this.htmlModalElement.parentNode.removeChild(this.htmlModalElement);
                }

                // Remove reference from container
                const container = this.quill.container;
                if (container.__quill_html_module === this) {
                    delete container.__quill_html_module;
                }
            }
        }

        // Create instances
        htmlModule1 = new HTMLModule(quillInstance1, {})
        htmlModule2 = new HTMLModule(quillInstance2, {})
    })

    afterEach(() => {
        // Cleanup
        if (htmlModule1) htmlModule1.destroy()
        if (htmlModule2) htmlModule2.destroy()

        // Remove DOM elements
        const containers = document.querySelectorAll('.ql-container')
        containers.forEach(container => container.remove())

        // Clear all modals
        const modals = document.querySelectorAll('.ql-html-editor-modal')
        modals.forEach(modal => modal.remove())
    })

    it('should create separate modal instances for each Quill editor', () => {
        const modals = document.querySelectorAll('.ql-html-editor-modal')
        expect(modals).toHaveLength(2)

        // Each module should have its own modal element
        expect(htmlModule1.htmlModalElement).toBeDefined()
        expect(htmlModule2.htmlModalElement).toBeDefined()
        expect(htmlModule1.htmlModalElement).not.toBe(htmlModule2.htmlModalElement)
    })

    it('should store module references on their respective containers', () => {
        expect(quillInstance1.container.__quill_html_module).toBe(htmlModule1)
        expect(quillInstance2.container.__quill_html_module).toBe(htmlModule2)
        expect(quillInstance1.container.__quill_html_module).not.toBe(quillInstance2.container.__quill_html_module)
    })

    it('should show correct modal when showHTMLEditor is called on different instances', async () => {
        const testHTML1 = '<p>Test HTML 1</p>'
        const testHTML2 = '<p>Test HTML 2</p>'

        // Show editor for first instance
        htmlModule1.showHTMLEditor(testHTML1)
        await nextTick()

        expect(htmlModule1.htmlModalElement.style.display).toBe('flex')
        expect(htmlModule1.htmlEditorTextareaElement.value).toBe(testHTML1)
        expect(htmlModule2.htmlModalElement.style.display).toBe('none')

        // Hide first modal
        htmlModule1.hideHTMLEditor()
        await nextTick()

        // Show editor for second instance
        htmlModule2.showHTMLEditor(testHTML2)
        await nextTick()

        expect(htmlModule1.htmlModalElement.style.display).toBe('none')
        expect(htmlModule2.htmlModalElement.style.display).toBe('flex')
        expect(htmlModule2.htmlEditorTextareaElement.value).toBe(testHTML2)
    })

    it('should handle HTML editing independently for each instance', async () => {
        const testHTML1 = '<p>Instance 1 HTML</p>'
        const testHTML2 = '<p>Instance 2 HTML</p>'

        // Mock HTML nodes
        const mockNode1 = document.createElement('div')
        mockNode1.setAttribute('data-html', testHTML1)
        const contentWrapper1 = document.createElement('div')
        contentWrapper1.innerHTML = testHTML1
        mockNode1.appendChild(contentWrapper1)

        const mockNode2 = document.createElement('div')
        mockNode2.setAttribute('data-html', testHTML2)
        const contentWrapper2 = document.createElement('div')
        contentWrapper2.innerHTML = testHTML2
        mockNode2.appendChild(contentWrapper2)

        // Test editing on first instance
        htmlModule1.showHTMLEditor(testHTML1, mockNode1)
        htmlModule1.htmlEditorTextareaElement.value = '<p>Updated Instance 1</p>'
        htmlModule1.saveHTMLPlus()

        await nextTick()

        expect(mockNode1.getAttribute('data-html')).toBe('<p>Updated Instance 1</p>')
        expect(mockNode2.getAttribute('data-html')).toBe(testHTML2) // Should remain unchanged

        // Test editing on second instance
        htmlModule2.showHTMLEditor(testHTML2, mockNode2)
        htmlModule2.htmlEditorTextareaElement.value = '<p>Updated Instance 2</p>'
        htmlModule2.saveHTMLPlus()

        await nextTick()

        expect(mockNode2.getAttribute('data-html')).toBe('<p>Updated Instance 2</p>')
        expect(mockNode1.getAttribute('data-html')).toBe('<p>Updated Instance 1</p>') // Should remain unchanged
    })

    it('should track currentEditingNode independently for each instance', () => {
        const mockNode1 = document.createElement('div')
        const mockNode2 = document.createElement('div')

        // Set different editing nodes
        htmlModule1.currentEditingNode = mockNode1
        htmlModule2.currentEditingNode = mockNode2

        expect(htmlModule1.currentEditingNode).toBe(mockNode1)
        expect(htmlModule2.currentEditingNode).toBe(mockNode2)
        expect(htmlModule1.currentEditingNode).not.toBe(htmlModule2.currentEditingNode)
    })

    it('should insert new HTML blocks in the correct Quill instance', async () => {
        const testHTML = '<p>New HTML Block</p>'
        const range1 = { index: 5 }
        const range2 = { index: 10 }

        // Mock selections for different instances
        quillInstance1.getSelection.mockReturnValue(range1)
        quillInstance2.getSelection.mockReturnValue(range2)

        // Insert HTML in first instance
        htmlModule1.currentEditingNode = null // Ensure it's treated as new insertion
        htmlModule1.htmlEditorTextareaElement.value = testHTML
        htmlModule1.saveHTMLPlus()

        expect(quillInstance1.insertEmbed).toHaveBeenCalledWith(
            range1.index,
            'html',
            testHTML,
            mockQuill.sources.USER
        )
        expect(quillInstance2.insertEmbed).not.toHaveBeenCalled()

        // Reset mocks
        vi.clearAllMocks()

        // Insert HTML in second instance
        htmlModule2.currentEditingNode = null
        htmlModule2.htmlEditorTextareaElement.value = testHTML
        htmlModule2.saveHTMLPlus()

        expect(quillInstance2.insertEmbed).toHaveBeenCalledWith(
            range2.index,
            'html',
            testHTML,
            mockQuill.sources.USER
        )
        expect(quillInstance1.insertEmbed).not.toHaveBeenCalled()
    })

    it('should properly cleanup when destroy is called', () => {
        const modal1 = htmlModule1.htmlModalElement
        const modal2 = htmlModule2.htmlModalElement
        const container1 = quillInstance1.container
        const container2 = quillInstance2.container

        // Verify modals are in DOM
        expect(document.body.contains(modal1)).toBe(true)
        expect(document.body.contains(modal2)).toBe(true)

        // Destroy first module
        htmlModule1.destroy()

        // First modal should be removed, second should remain
        expect(document.body.contains(modal1)).toBe(false)
        expect(document.body.contains(modal2)).toBe(true)

        // Container reference should be removed
        expect(container1.__quill_html_module).toBeUndefined()
        expect(container2.__quill_html_module).toBe(htmlModule2)

        // Destroy second module
        htmlModule2.destroy()

        // Both modals should be removed
        expect(document.body.contains(modal2)).toBe(false)
        expect(container2.__quill_html_module).toBeUndefined()
    })

    it('should handle edit button clicks correctly for different instances', async () => {
        // Create mock HTML blots with edit buttons
        const createMockHTMLBlot = (htmlContent, container) => {
            const node = document.createElement('div')
            node.className = 'ql-custom-html'
            node.setAttribute('data-html', htmlContent)

            const contentWrapper = document.createElement('div')
            contentWrapper.innerHTML = htmlContent
            node.appendChild(contentWrapper)

            const editBtn = document.createElement('span')
            editBtn.className = 'html-edit-overlay'

            // Simulate the click handler logic
            editBtn.onclick = (e) => {
                e.preventDefault()
                e.stopPropagation()

                const quillContainer = container
                if (quillContainer && quillContainer.__quill_html_module) {
                    const htmlModule = quillContainer.__quill_html_module
                    const currentHTML = node.getAttribute('data-html') || ''
                    htmlModule.showHTMLEditor(currentHTML, node)
                }
            }

            node.appendChild(editBtn)
            container.appendChild(node)

            return { node, editBtn }
        }

        const { node: node1, editBtn: editBtn1 } = createMockHTMLBlot(
            '<p>HTML Block 1</p>',
            quillInstance1.container
        )
        const { node: node2, editBtn: editBtn2 } = createMockHTMLBlot(
            '<p>HTML Block 2</p>',
            quillInstance2.container
        )

        // Click edit button on first instance
        editBtn1.click()
        await nextTick()

        expect(htmlModule1.htmlModalElement.style.display).toBe('flex')
        expect(htmlModule1.htmlEditorTextareaElement.value).toBe('<p>HTML Block 1</p>')
        expect(htmlModule1.currentEditingNode).toBe(node1)
        expect(htmlModule2.htmlModalElement.style.display).toBe('none')

        htmlModule1.hideHTMLEditor()
        await nextTick()

        // Click edit button on second instance
        editBtn2.click()
        await nextTick()

        expect(htmlModule2.htmlModalElement.style.display).toBe('flex')
        expect(htmlModule2.htmlEditorTextareaElement.value).toBe('<p>HTML Block 2</p>')
        expect(htmlModule2.currentEditingNode).toBe(node2)
        expect(htmlModule1.htmlModalElement.style.display).toBe('none')
    })
})
