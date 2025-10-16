import { shallowMount, mount } from '@vue/test-utils'
import Schedule from '../Schedule.vue'
import Buttons from '@/components/Buttons.vue'

// Mock $t translation function
const mockT = (key) => key

// Mock utils
jest.mock('@/utils/constants', () => ({
    isoDateInFuture: jest.fn((date) => {
        // Consider future dates
        const d = new Date(date)
        return d > new Date()
    }),
    formatIsoDateTime: jest.fn((date) => `formatted-${date}`)
}))

describe('Schedule.vue', () => {
    let wrapper

    beforeEach(() => {
        wrapper = shallowMount(Schedule, {
            mocks: {
                $t: mockT
            },
            stubs: {
                Buttons: true
            },
            propsData: {
                withScheduledFor: true,
                scheduledPublication: ''
            }
        })
    })

    it('renders the alarm icon', () => {
        expect(wrapper.find('img').exists()).toBe(true)
    })

    it('toggles menu on alarm click', async () => {
        expect(wrapper.vm.showMenu).toBe(false)
        await wrapper.find('span').trigger('click')
        expect(wrapper.vm.showMenu).toBe(true)
    })
})
