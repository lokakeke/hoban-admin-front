import Vue from "vue"

export const EventBus = new Vue(
  {
    methods: {
      /**
             * Vue.prototype.$on의 wrapper function
             * 기존 $on은 동일한 이름의 event가 등록되어 있어도 중첩되지만,
             * 이 method는 동일한 이름의 event를 제거하고 등록한다.
             * @param name 이벤트 이름
             * @param listener 이벤트 리스너 함수
             */
      on (name, listener) {
        this.$off(name).$on(name, listener)
      },
      /**
             * Vue.prototype.$emit의 wrapper function
             * @param name 발생할 이벤트 이름
             * @param param 이벤트 리스너에 넘겨줄 인자값
             */
      emit (name, ...param) {
        this.$emit(name, ...param)
      }
    }
  }
)

export default EventBus
