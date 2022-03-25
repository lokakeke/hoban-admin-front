import Full from 'Container/Full.vue'

const Main = () => import('Views/common/Main.vue')
const OtaMain = () => import('Views/system/main/OtaMain.vue')
const SocialMain = () => import('Views/system/main/SocialMain.vue')

export default {
  path: '/main',
  name: 'main',
  component: Full,
  redirect: '/main',
  meta: {
    breadcrumb: 'Main'
  },
  children: [
    {
      path: '',
      component: Main,
      name: 'mainPage',
      meta: {
        requiresAuth: false,
        title: '메인페이지',
        breadcrumb: 'Main'
      }
    },
    {
      path: 'otaMain',
      component: OtaMain,
      name: 'otaMain',
      meta: {
        title: 'O.T.A 메인',
        breadcrumb: 'O.T.A Main'
      }
    },
    {
      path: 'socialMain',
      component: SocialMain,
      name: 'socialMain',
      meta: {
        title: 'Social 메인',
        breadcrumb: 'Social Main'
      }
    }
  ]
}
