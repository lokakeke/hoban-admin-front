/**
 * App Entry File
 */
import 'babel-polyfill'
import Vue from 'vue'
import vuetify from './plugins/vuetify'
import VueBreadcrumbs from 'vue2-breadcrumbs'
import Nprogress from 'nprogress'
import VueI18n from 'vue-i18n'
import highCharts from 'highcharts'
import drillDown from 'highcharts/modules/drilldown'
import exporting from 'highcharts/modules/exporting'
import highChartsMore from 'highcharts/highcharts-more'
import highChartsVue from 'highcharts-vue'
import VuePolling from 'vue-polling'
import VuejsDialog from 'vuejs-dialog'
import 'vuejs-dialog/dist/vuejs-dialog.min.css'
import VueTheMask from 'vue-the-mask'
import App from './App'
import router from './router'
import store from './store'
import './lib/VuelyCss'
import '@mdi/font/css/materialdesignicons.min.css'
import messages from './lang'
import VCalendar from 'v-calendar'
import GlobalComponents from './globalComponents'
import GlobalMixin from './globalMixin'
import * as filters from './globalFilter'
import VCurrencyField from 'v-currency-field'
import VueDragscroll from 'vue-dragscroll'
import VueHtmlToPaper from 'vue-html-to-paper'
import VueTour from 'vue-tour'
import 'vue-tour/dist/vue-tour.css'
import VueClipboard from 'vue-clipboard2'

Vue.use(VCurrencyField, {
  locale: 'ko-KR',
  decimalLength: 0,
  defaultValue: null
})

moment.locale('ko')

Vue.config.productionTip = false

// navigation guards before each
router.beforeEach(async (to, from, next) => {
  // 모든 dialog 닫기
  await store.dispatch('dialog/closeAll')
  try {
    await store.dispatch('auth/check')
    /** 로그인이 되어있는 경우 **/
    // 메뉴 접근 권한 체크 후 진행
    const res = await store.dispatch('sidebar/checkMenus', to)
    if (res.success) {
      // 비밀번호 확인필요한 메뉴인지 체크
      if (to.meta.checkPassword === true) {
        await store.dispatch('auth/checkPassword', {
          passFunc: next,
          closeFunc: () => {
            // 이전 라우터가 있으면 라우팅 중지 / 아니면 메인으로 보낸다.
            if (from.name) {
              next(false)
              Nprogress.done()
            } else {
              next('/')
            }
          }
        })
      } else {
        next()
      }
    } else {
      next({ path: res.redirectPath })
      Vue.dialog.alert({
        title: res.title,
        body: res.message
      })
    }
  } catch (e) {
    /** 로그인이 안되어있는 경우 **/
    // 메뉴 접근권한 : 로그인 필요여부
    const checkAuth = to.meta.auth !== false
    if (checkAuth) {
      // redirect url 셋팅
      await store.dispatch('sidebar/setRedirectPath', to.path)
      // 파트너 로그인페이지에서 접근하였는지 판단
      next({ path: store.getters['sidebar/partnerLogin'] ? '/partnerLogin' : '/login' })
    } else {
      // 로그인 권한 필요없는 메뉴 이동 (ex: login)
      next()
    }
  }
})

// navigation guard after each
router.afterEach((to, from) => {
  Nprogress.done()
  setTimeout(() => {
    const contentWrapper = document.querySelector('.v-content__wrap')
    if (contentWrapper !== null) {
      contentWrapper.scrollTop = 0
    }
    const boxedLayout = document.querySelector('.app-boxed-layout .app-content')
    if (boxedLayout !== null) {
      boxedLayout.scrollTop = 0
    }
    const miniLayout = document.querySelector('.app-mini-layout .app-content')
    if (miniLayout !== null) {
      miniLayout.scrollTop = 0
    }
  }, 200)
})

highCharts.setOptions({
  lang: {
    thousandsSep: ','
  }
})
exporting(highCharts)
drillDown(highCharts)
highChartsMore(highCharts)
Vue.use(highChartsVue)

Vue.use(VCalendar, {
  componentPrefix: 'vc',
  screens: {
    sm: '600px ',
    md: '960px',
    lg: '1264px',
    xl: '1904px'
  }
})
Vue.use(VueBreadcrumbs)
Vue.use(GlobalComponents)
Vue.use(VuePolling)
Vue.use(VueTheMask)
Vue.use(VueDragscroll)
Vue.use(VueTour)
Vue.use(VueClipboard)

// Create VueI18n instance with options
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'ko', // set locale
  messages // set locale messages
})
Vue.use(VuejsDialog, {
  html: true,
  okText: '확인',
  cancelText: '취소'
})

Vue.mixin(GlobalMixin)
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// VueHtmlToPaper
const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    '/static/css/vueHtmlToPaper.css'
  ]
}
Vue.use(VueHtmlToPaper, options)

// Vue Upload Components (woojung)
// Vue.component('file-upload', require('vue-upload-component'))

/* eslint-disable no-new */
new Vue({
  store,
  i18n,
  router,
  vuetify,
  render: h => h(App),
  components: { App }
}).$mount('#app')
