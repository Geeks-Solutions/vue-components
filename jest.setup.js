jest.mock('axios', () => ({
    post: jest.fn(() => Promise.resolve({response: { data: {  } }})),
    put: jest.fn(() => Promise.resolve({ response: { data: {  } } })),
    get: jest.fn(() => Promise.resolve({ response: { data: {  } } })),
    delete: jest.fn(() => Promise.resolve({ response: { data: {  } } })),
}));

// global.window.$nuxt = {
//     $cookies: {
//         get: jest.fn((key) => {
//             if (key === 'blogs-project-id') {
//                 return 'mocked-project-id'; // Return the mock value
//             }
//             return null;
//         }),
//     },
// };

global.mocks = {
    $cookies: {
        // get: jest.fn(() => '1'),
        get: jest.fn(),
        set: jest.fn(),
        remove: jest.fn()
    },
    // $t: jest.fn((key) => key),
    $t: jest.fn(),
    $i18n: jest.fn(),
    // $config: jest.fn(),
    $axios: {
        put: require('axios').put,
        post: require('axios').post,
        get: require('axios').get,
        delete: require('axios').delete,
    },
    $route: {
        query: jest.fn()
    },
    $router: {
        push: jest.fn()
    },
    $toast: { show: jest.fn() },
    // localePath: jest.fn(),
    $nuxt: {
        $emit: jest.fn()
    }
};