import { vi } from 'vitest'

// Mock axios
vi.mock('axios', () => ({
    post: vi.fn(() => Promise.resolve({ response: { data: {} } })),
    put: vi.fn(() => Promise.resolve({ response: { data: {} } })),
    get: vi.fn(() => Promise.resolve({ response: { data: {} } })),
    delete: vi.fn(() => Promise.resolve({ response: { data: {} } })),
}))

// Mock global objects for Vue 3 components
vi.stubGlobal('mocks', {
    $cookies: {
        get: vi.fn(),
        set: vi.fn(),
        remove: vi.fn()
    },
    $t: vi.fn((key) => key),
    $i18n: {
        locale: 'en',
        t: vi.fn((key) => key),
        locales: ['en', 'fr'],
        setLocale: vi.fn()
    },
    $axios: {
        put: vi.fn(() => Promise.resolve({ data: {} })),
        post: vi.fn(() => Promise.resolve({ data: {} })),
        get: vi.fn(() => Promise.resolve({ data: {} })),
        delete: vi.fn(() => Promise.resolve({ data: {} })),
    },
    $route: {
        query: {},
        params: {}
    },
    $router: {
        push: vi.fn()
    },
    $toast: {
        show: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
        info: vi.fn()
    }
})

// Mock window object
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})

// Mock IntersectionObserver
class MockIntersectionObserver {
    constructor(callback) {
        this.callback = callback
    }
    observe() { return null }
    unobserve() { return null }
    disconnect() { return null }
}

window.IntersectionObserver = MockIntersectionObserver

// Mock ResizeObserver
class MockResizeObserver {
    constructor(callback) {
        this.callback = callback
    }
    observe() { return null }
    unobserve() { return null }
    disconnect() { return null }
}

window.ResizeObserver = MockResizeObserver

// Mock DOMParser
global.DOMParser = class {
    parseFromString() {
        return {
            body: {
                innerHTML: ''
            },
            querySelectorAll: () => []
        }
    }
}