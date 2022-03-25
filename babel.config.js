module.exports = {
    presets: [
        [
            '@vue/app',
            {
                modules: 'commonjs'
            }
        ]
    ],
    plugins: ['@babel/plugin-proposal-class-properties']
}
