const config = {
    stories: [
        "../stories/*.stories.@(js|jsx|mjs|ts|tsx)",
    ],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
    ],
    framework: {
        name: "@storybook-vue/nuxt",
        options: {},
    },
    docs: {
        autodocs: "tag",
    },
};
export default config;