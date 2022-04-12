/**
 * Settings Module
 */
import { headerFilters, languages, routerAnimations, sidebarBackgroundImages, sidebarFilters, themes } from './data'

import boardNoticeService from '@/api/modules/system/boardNotice.service'

const state = { // dark mode
  collapseSidebar: false, // mini sidevar
  rtlLayout: false, // rtl layout
  backgroundImage: false, // enable sidebar background image
  horizontalLayoutSidebar: false, // horizontal layout sidebar
  languages, // languages
  selectedLocale: languages[0], // selected locale
  sidebarBackgroundImages, // sidebar backgorund images
  selectedSidebarBgImage: sidebarBackgroundImages[0], // selected sidebar background image
  sidebarFilters, // sidebar filters
  sidebarSelectedFilter: sidebarFilters[1], // selected sidebar filter
  routerAnimations, // router animations
  selectedRouterAnimation: routerAnimations[0], // selected router animation
  themes, // themes
  selectedTheme: themes[0], // selected theme
  headerFilters, // header filters
  activeHeaderFilter: headerFilters[1], // selected header filter
  mobileSearchForm: false, // Is Mobile Search Form Open
  baseUrl: '/api', // axios 설정
  // baseUrl: 'http://reactify.theironnetwork.org/data/', // axios 설정
  timeout: 15000, // axios 설정
  loadingTime: 100,
  nowLoading: false,
  window: {
    height: 0,
    width: 0
  },
  /**
   * 메인화면 - 공지사항 팝업 자동노출 관련변수
   */
  popUpCheckDate: null
}

// getters
const getters = {
  collapseSidebar: state => {
    return state.collapseSidebar
  },
  boxLayout: state => {
    return state.boxLayout
  },
  rtlLayout: state => {
    return state.rtlLayout
  },
  backgroundImage: state => {
    return state.backgroundImage
  },
  selectedLocale: state => {
    return state.selectedLocale
  },
  languages: state => {
    return state.languages
  },
  sidebarBackgroundImages: state => {
    return state.sidebarBackgroundImages
  },
  selectedSidebarBgImage: state => {
    return state.selectedSidebarBgImage
  },
  sidebarFilters: state => {
    return state.sidebarFilters
  },
  sidebarSelectedFilter: state => {
    return state.sidebarSelectedFilter
  },
  selectedRouterAnimation: state => {
    return state.selectedRouterAnimation
  },
  routerAnimations: state => {
    return state.routerAnimations
  },
  themes: state => {
    return state.themes
  },
  selectedTheme: state => {
    return state.selectedTheme
  },
  headerFilters: state => {
    return state.headerFilters
  },
  activeHeaderFilter: state => {
    return state.activeHeaderFilter
  },
  horizontalLayoutSidebar: state => {
    return state.horizontalLayoutSidebar
  },
  mobileSearchForm: state => {
    return state.mobileSearchForm
  },
  baseUrl: state => {
    return state.baseUrl
  },
  loadingTime: state => {
    return state.loadingTime
  },
  nowLoading: state => {
    return state.nowLoading
  },
  window: state => {
    return state.window
  },
  popUpCheckDate (state) {
    return state.popUpCheckDate
  }
}

// actions
const actions = {
  collapseSidebar (context) {
    context.commit('collapseSidebarHandler')
  },
  boxLayout (context) {
    context.commit('boxLayoutHandler')
  },
  rtlLayout (context) {
    context.commit('rtlLayoutHandler')
  },
  backgroundImage (context) {
    context.commit('sidebarBgImageHandler')
  },
  changeLanguage (context, payload) {
    context.commit('changeLanguageHandler', payload)
  },
  changeBackgroundImage (context, payload) {
    context.commit('changeBackgroundImageHandler', payload)
  },
  changeSidebarFilter (context, payload) {
    context.commit('changeSidebarFilterHandler', payload)
  },
  changeRouterAnimation (context, payload) {
    context.commit('changeRouterAnimationHandler', payload)
  },
  changeTheme (context, payload) {
    context.commit('changeThemeHandler', payload)
  },
  changeHeaderFilter (context, payload) {
    context.commit('changeHeaderFilterHandler', payload)
  },
  setMiniSidebarLayout (context, payload) {
    context.commit('setMiniSidebarLayoutHandler', payload)
  },
  toggleHorizontalLayoutSidebar (context, payload) {
    context.commit('toggleHorizontalLayoutSidebarHandler', payload)
  },
  toggleSearchForm (context) {
    context.commit('toggleSearchFormHandler')
  },
  setNowLoading (context, value) {
    context.commit('setNowLoading', value)
  },
  setWindow (context, value) {
    context.commit('setWindow', value)
  },
  /**
   * 팝업 노출 체크
   * @param state
   * @return {boolean}
   */
  async checkPopUp ({ getters }) {
    let showPopUp = false
    const popUpCheckDate = getters.popUpCheckDate
    if (popUpCheckDate == null || !moment(popUpCheckDate).isValid()) {
      showPopUp = true
    } else {
      showPopUp = moment(popUpCheckDate).isBefore(moment(), 'day')
    }
    // 팝업이 보여야 할 상태일 경우 게시글이 있는지 체크 후 있을경우 Resolve 처리
    if (showPopUp) {
      const res = await boardNoticeService.selectBoardNoticePopUpList()
      const noticeList = res.data
      if (noticeList.length > 0) {
        return Promise.resolve(noticeList)
      }
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject()
  },
  setPopUpCheckDate (context) {
    context.commit('setPopUpCheckDate', moment())
  },
  resetPopUpCheckDate (context) {
    context.commit('setPopUpCheckDate', null)
  }
}

// mutations
const mutations = {
  collapseSidebarHandler (state) {
    state.collapseSidebar = !state.collapseSidebar
  },
  boxLayoutHandler (state) {
    state.boxLayout = !state.boxLayout
  },
  rtlLayoutHandler (state) {
    state.rtlLayout = !state.rtlLayout
  },
  sidebarBgImageHandler (state) {
    state.backgroundImage = !state.backgroundImage
  },
  changeLanguageHandler (state, language) {
    state.selectedLocale = language
    if (language.locale === 'he' || language.locale === 'ar') {
      state.rtlLayout = true
    } else {
      state.rtlLayout = false
    }
  },
  changeBackgroundImageHandler (state, image) {
    state.selectedSidebarBgImage = image
  },
  changeSidebarFilterHandler (state, filter) {
    state.sidebarSelectedFilter = filter
  },
  changeRouterAnimationHandler (state, animation) {
    state.selectedRouterAnimation = animation
  },
  changeThemeHandler (state, theme) {
    state.selectedTheme = theme
  },
  changeHeaderFilterHandler (state, filter) {
    state.activeHeaderFilter = filter
  },
  setMiniSidebarLayoutHandler (state, isSet) {
    state.collapseSidebar = isSet
  },
  toggleHorizontalLayoutSidebarHandler (state, value) {
    state.horizontalLayoutSidebar = value
  },
  toggleSearchFormHandler (state) {
    state.mobileSearchForm = !state.mobileSearchForm
  },
  setNowLoading (state, value) {
    state.nowLoading = value
  },
  setWindow (state, value) {
    state.window = {
      height: value.height || 0,
      width: value.width || 0
    }
  },
  setPopUpCheckDate (state, value) {
    state.popUpCheckDate = value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
