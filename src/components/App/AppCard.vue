<template>
  <div :class="[fillHeight? 'fill-height': '', colClasses]">
    <div class="app-card" :class="[customClasses]" :ref="uuid + '_card'">
      <template v-if="!!heading || !!$slots['heading']">
        <div class="app-card-title pb-0" id="app-card-title">
          <template v-if="!!heading">
            <div class="title font-weight-bold">{{ heading }}</div>
          </template>
          <template v-else-if="!!$slots['heading']">
            <slot name="heading"></slot>
          </template>
        </div>
      </template>
      <div :id="uuid + '_app-card-items'" v-show="!!$slots['items']">
        <div class="text-right px-5" :class="[itemClasses]">
          <slot name="items"></slot>
        </div>
      </div>
      <vue-perfect-scrollbar :style="style">
        <div class="app-card-content" :class="[contentClasses]">
          <slot></slot>
        </div>
      </vue-perfect-scrollbar>
      <div :id="uuid + '_app-card-actions'" v-show="!!$slots['action']">
        <div class="app-card-action py-3">
          <slot name="action"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ResizeObserver as Polyfill } from '@juggle/resize-observer'
import StringUtil from '@/utils/string.util'

export default {
  props: {
    heading: String,
    colClasses: String,
    contentClasses: String,
    customClasses: String,
    itemClasses: String,
    fillHeight: Boolean,
    maxHeight: Number,
    minHeight: {
      type: Number,
      default () {
        return 250
      }
    },
    autoHeight: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  name: 'AppCard',
  data () {
    return {
      itemsHeight: 0,
      actionsHeight: 0,
      observerItems: null,
      observerActions: null,
      uuid: ''
    }
  },
  created () {
    this.uuid = StringUtil.guid()
  },
  mounted () {
    this.observeSize()
  },
  computed: {
    ...mapGetters({
      window: 'settings/window'
    }),
    style () {
      /**
       * 1. max height 가 선언 되었을 경우 -> 지정된 height 로 스크롤
       * 2. auto height 가 true 일 경우 -> window height 를 기반으로 스크롤
       * 3. 아닐 경우 스크롤 생성 안함
       */
      if (this.maxHeight && this.maxHeight > 0) {
        return { height: this.maxHeight + 'px' }
      } else if (this.autoHeight && this.window.height) {
        let height = this.window.height
        // 본문 위 Position 높이 삭제
        if (this.$refs[this.uuid + '_card']) {
          height -= this.$refs[this.uuid + '_card'].getBoundingClientRect().top
        } else {
          // 본문 기본 패딩 삭제
          height -= (64 + 24)
        }
        // 본문 아래 패딩 삭제
        height -= (24 + 8)
        // 내부 사용중인 height
        const titleHeight = document.getElementById('app-card-title') ? document.getElementById('app-card-title').offsetHeight : 0
        height -= (titleHeight + this.itemsHeight + this.actionsHeight)
        if (height < this.minHeight) {
          height = this.minHeight
        }
        return { height: height + 'px' }
      } else {
        return { height: 'auto' }
      }
    }
  },
  methods: {
    observeSize () {
      const ResizeObserver = Polyfill
      // 아이템 영역 체크
      const observerItems = new ResizeObserver(entries => {
        entries.forEach(entry => {
          const { height } = entry.contentRect
          this.itemsHeight = height
        })
      })
      observerItems.observe(document.getElementById(this.uuid + '_app-card-items'))
      this.observerItems = observerItems
      // 액션 영역 체크
      const observerActions = new ResizeObserver(entries => {
        entries.forEach(entry => {
          const { height } = entry.contentRect
          this.actionsHeight = height
        })
      })
      observerActions.observe(document.getElementById(this.uuid + '_app-card-actions'))
      this.observerActions = observerActions
    }
  },
  beforeDestroy () {
    if (this.observerActions) {
      this.observerActions.disconnect()
    }
    if (this.observerItems) {
      this.observerItems.disconnect()
    }
  }
}
</script>
