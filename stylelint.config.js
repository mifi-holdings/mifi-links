export default {
    extends: ['stylelint-config-standard'],
    overrides: [
        {
            files: ['**/*.svelte'],
            customSyntax: 'postcss-html',
        },
    ],
    rules: {
        'no-descending-specificity': null,
    },
};
