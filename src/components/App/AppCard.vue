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
      <perfect-scrollbar :style="style">
        <div class="app-card-content" :class="[contentClasses]">
          <slot></slot>
        </div>
      </perfect-scrollbar>
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
      default() {
        return 250
      }
    },
    autoHeight: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  name: 'AppCard',
  data() {
    return {
      itemsHeight: 0,
      actionsHeight: 0,
      observerItems: null,
      observerActions: null,
      uuid: ''
    }
  },
  created() {
    this.uuid = StringUtil.guid()
  },
  mounted() {
    this.observeSize()
  },
  computed: {
    ...mapGetters({
      window: 'settings/window'
    }),
    style() {
      /**
       * 1. max height ??? ?????? ????????? ?????? -> ????????? height ??? ?????????
       * 2. auto height ??? true ??? ?????? -> window height ??? ???????????? ?????????
       * 3. ?????? ?????? ????????? ?????? ??????
       */
      if (this.maxHeight && this.maxHeight > 0) {
        return { height: this.maxHeight + 'px' }
      } else if (this.autoHeight && this.window.height) {
        let height = this.window.height
        // ?????? ??? Position ?????? ??????
        if (this.$refs[this.uuid + '_card']) {
          height -= this.$refs[this.uuid + '_card'].getBoundingClientRect().top
        } else {
          // ?????? ?????? ?????? ??????
          height -= (64 + 24)
        }
        // ?????? ?????? ?????? ??????
        height -= (24 + 8)
        // ?????? ???????????? height
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
    observeSize() {
      const ResizeObserver = Polyfill
      // ????????? ?????? ??????
      const observerItems = new ResizeObserver(entries => {
        entries.forEach(entry => {
          const { height } = entry.contentRect
          this.itemsHeight = height
        })
      })
      observerItems.observe(document.getElementById(this.uuid + '_app-card-items'))
      this.observerItems = observerItems
      // ?????? ?????? ??????
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
  beforeDestroy() {
    if (this.observerActions) {
      this.observerActions.disconnect()
    }
    if (this.observerItems) {
      this.observerItems.disconnect()
    }
  }
}
</script>

<style>
</style>
