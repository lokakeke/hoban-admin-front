<template>
  <v-dialog
    :value="instance.options.visible"
    :activator="instance.options.activator"
    :attach="instance.options.attach"
    :content-class="instance.options.contentClass"
    :dark="instance.options.dark"
    :disabled="instance.options.disabled"
    :eager="instance.options.eager"
    :fullscreen="instance.options.fullscreen !== undefined ? instance.options.fullscreen : true"
    :hide-overlay="instance.options.hideOverlay"
    :internal-activator="instance.options.internalActivator"
    :light="instance.options.light"
    :max-width="instance.options.maxWidth"
    :no-click-animation="instance.options.noClickAnimation !== undefined ? instance.options.noClickAnimation : true"
    :open-on-hover="instance.options.openOnHover"
    :origin="instance.options.origin"
    :overlay-color="instance.options.overlayColor"
    :overlay-opacity="instance.options.overlayOpacity"
    :persistent="instance.options.persistent !== undefined ? instance.options.persistent : true"
    :retain-focus="instance.options.retainFocus !== undefined ? instance.options.retainFocus : false"
    :scrollable="instance.options.scrollable"
    :transition="instance.options.transition || 'dialog-bottom-transition'"
    :width="instance.options.width"
  >
    <v-card>
      <v-card-title class="pa-0" v-if="instance.options.hideToolBar !== true">
        <v-toolbar :dark="instance.options.light !== true" flat :color="instance.options.color || 'primary'" :dense="instance.options.fullscreen !== true">
          <v-toolbar-title>
            <v-row align="center" class="mx-0">
              <slot v-if="!!$slots['title']" name="title"></slot>
              <span v-else>{{ title }}</span>
            </v-row>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <slot name="buttons"></slot>
            <v-btn text :dark="instance.options.light !== true" @click="close()" title="닫기" v-if="!disabled">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-card-title>
      <v-card-text class="pa-0">
        <v-container fluid :class="[instance.options.dense === true? 'pa-0': '', instance.options.innerClass]">
          <slot></slot>
        </v-container>
      </v-card-text>
      <v-card-actions v-if="!!$slots['actions']">
        <v-col cols="12" class="text-right pa-0">
          <slot name="actions"></slot>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DialogBase',
  props: {
    /**
     * 다이얼로그 제목
     */
    title: {
      type: String,
      default () {
        return ''
      }
    },
    /**
     * 다이얼로그 인스턴스
     */
    instance: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      /**
       * 닫기버튼 유무
       */
      disabled: false
    }
  },
  created () {
    this.init()
    if (this.instance.params.disabled !== undefined && this.instance.params.disabled === true) {
      this.disabled = true
    }
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{ target: 'escape', action: this.close }]
    })
  },
  methods: {
    /**
     * 초기화 (override해서 사용)
     */
    init () {
      // RUN
    },
    /**
     * 다이얼로그 닫기(확인 클릭)
     * @param {Object} params 부모 컴포넌트에 넘겨줄 객체
     */
    close (params) {
      const callback = this.instance.options.closeCallback
      if (typeof callback === 'function') {
        callback(params)
      }
      this.$store.dispatch('dialog/close', this.instance)
    },
    /**
     * 다이얼로그 닫기(취소 클릭)
     * @param {Object} params 부모 컴포넌트에 넘겨줄 객체
     */
    dismiss (params) {
      const callback = this.instance.options.dismissCallback
      if (typeof callback === 'function') {
        callback(params)
      }
      this.$store.dispatch('dialog/close', this.instance)
    }
  }
}
</script>
