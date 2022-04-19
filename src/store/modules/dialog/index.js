import StringUtil from '@/utils/string.util'
import store from '@/store'

const dialogs = import.meta.glob('../../../components/**/*.vue')

const state = {
  /** 다이얼로그 인스턴스 */
  instances: [],
  /** 더블 클릭 방지 */
  isLoading: false
}

const getters = {
  /**
     * 가장 상위에 있는 다이얼로그 인스턴스
     * @param {Object} state
     */
  topInstance (state) {
    const length = state.instances.length
    if (length > 0) {
      return state.instances[length - 1]
    } else {
      return null
    }
  }
}

const actions = {
  /**
     * 다이얼로그 띄우기
     * @param {Object} context
     * @param {String} componentPath 다이얼로그 컴포넌트 경로 (ex: @/components/Example/ExampleDialog)
     * @param {Object} params 인자값
     * @param {Object} options 다이얼로그 옵션
     */
  open ({ commit, state }, { componentPath, params = {}, options = {} }) {
    if (!state.isLoading) {
      // 로딩 시작 - delay 1초
      commit('INIT_LOADING', true)
      // keypress 증가
      store.dispatch('keypress/increaseSequence')
      // 다이얼로그 인스턴스를 생성한다.
      const instance = {
        // FIXME 확인. 기존이랑 가져오는 스타일 다름.
        // component: () => import(`@/components${componentPath}`), // 다이얼로그 컴포넌트
        component: dialogs[`../../../components${componentPath}.vue`], // 다이얼로그 컴포넌트
        options: { // 다이얼로그 옵션
          ...options,
          uuid: StringUtil.guid(), // 다이얼로그 인스턴스 고유 ID
          visible: false // 다이얼로그 노출 여부
        },
        params // 다이얼로그에 필요한 인자값
      }
      commit('ADD_INSTANCE', instance)
      return instance
    }
  },
  /**
     * 다이얼로그 닫기
     * @param {Object} context
     * @param {Object} instance 다이얼로그 인스턴스
     */
  close ({ commit }, instance) {
    // keypress 감소
    store.dispatch('keypress/decreaseSequence')
    commit('REMOVE_INSTANCE', instance)
  },
  /**
     * 다이얼로그 모두 닫기
     * @param {Object} context
     */
  closeAll ({ commit }) {
    commit('REMOVE_ALL_INSTANCE')
  },

  initLoading ({ commit }) {
    commit('INIT_LOADING', false)
  }
}

const mutations = {
  /**
     * 다이얼로그 인스턴스 넣기
     * @param {Object} state
     * @param {Object} instance
     */
  ADD_INSTANCE (state, instance) {
    // 다이얼로그 인스턴스를 항상 목록 마지막에 넣는다
    state.instances.push(instance)
    // 다이얼로그 보이기 (애니메이션을 위한 설정)
    setTimeout(() => {
      instance.options.visible = true
    }, 200)
    // 화면 로딩 종료 - delay : 1초
    setTimeout(() => {
      state.isLoading = false
    }, 1000)
  },
  /**
     * 다이얼로그 인스턴스 제거
     * @param {Object} state
     * @param {Object} instance
     */
  REMOVE_INSTANCE (state, instance) {
    if (state.instances.length < 1) return false
    let targetIndex = -1
    state.instances.some((instanceItem, instanceIndex) => {
      // 고유 ID가 같은 인스턴스 삭제
      if (instance.options.uuid === instanceItem.options.uuid) {
        targetIndex = instanceIndex
        return true
      }
      return false
    })
    // 다이얼로그 감추기 (애니메이션을 위한 설정)
    state.instances[targetIndex].options.visible = false
    setTimeout(() => {
      // 다이얼로그 인스턴스를 목록에서 제거
      state.instances.splice(targetIndex, 1)
    }, 200)
  },
  /**
     * 다이얼로그 인스턴스 모두 삭제
     * @param {Object} state
     */
  REMOVE_ALL_INSTANCE (state) {
    state.instances = []
  },
  /**
     * 더블클릭 시 다이얼로그 뜨는것 방지 delay : 1초
     * @param {Object} state
     */
  INIT_LOADING (state, isLoading) {
    state.isLoading = isLoading
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
