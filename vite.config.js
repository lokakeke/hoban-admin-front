import path from 'path'
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import WindiCSS from 'vite-plugin-windicss'
import AutoImport from 'unplugin-auto-import/vite'

const config = defineConfig({
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}`,
      Api: `${path.resolve(__dirname, 'src/api/')}`,
      Components: `${path.resolve(__dirname, 'src/components')}`,
      Constants: `${path.resolve(__dirname, 'src/constants/')}`,
      Container: `${path.resolve(__dirname, 'src/container/')}`,
      Views: `${path.resolve(__dirname, 'src/views/')}`,
      Helpers: `${path.resolve(__dirname, 'src/helpers/')}`,
      Mixins: `${path.resolve(__dirname, 'src/mixins/')}`,
      Themes: `${path.resolve(__dirname, 'src/themes/')}`,
      Lib: `${path.resolve(__dirname, 'src/lib/')}`
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  build: {
    minify: true,
    commonjsOptions: {
      include: [/linked-dep/, /node_modules/]
    }
  },

  plugins: [createVuePlugin(), WindiCSS(),
    AutoImport({
      imports: [
        {
          lodash: ['_'],
          moment: [
            ['default', 'moment']
          ]
        }
      ],
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true
      },
      dts: true
    })
  ],

  server: {
    port: 8888,
    host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://localhost:9090',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  }
})

export default config
