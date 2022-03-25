<template>
  <div class="v-scroll-table-style">
    <div class="v-scroll-header">
      <div v-for="header of headers" :key="header.name"
           :class="['v-scroll-header-column', 'custom-flex-grow-' + (header.size || 1)]"
      >
        {{ header.name }}
      </div>
      <div class="v-scroll-header-column" :style="{width: initScrollSize + 'px'}"></div>
    </div>
    <template v-if="items.length === 0">
      <div class="v-scroll-row align-items-center justify-center">
        <div class="v-scroll-column custom-flex-grow-1 v-scroll-column-empty">
          {{ emptyText }}
        </div>
      </div>
    </template>
    <template v-else>
      <v-virtual-scroll
          :items="items"
          :item-height="itemHeight"
          :height="bodyHeight"
          :bench="bench"
          ref="virtual"
      >
        <template v-slot="{ item, index }">
          <div class="v-scroll-row"
               :class="colClass != null ? colClass(item): ''"
               :style="{ height: itemHeight + 'px' }"
          >
            <div v-for="header of headers" :key="header.value"
                 :class="['v-scroll-column', 'custom-flex-grow-' + (header.size || 1)]">
              <slot v-if="!!$scopedSlots[header.value]"
                    :name="header.value"
                    :item="item"
                    :index="index" />
              <span v-else>
              <template v-if="header.type === 'date'">{{ item[header.value] | date }}</template>
              <template v-else-if="header.type === 'price'">{{ item[header.value] | price }}</template>
              <template v-else-if="header.type === 'text'">
                <span :title="item[header.value]">{{ item[header.value] }}</span>
              </template>
              <template v-else-if="header.type === 'truncate'">
                <span :title="item[header.value]">{{ item[header.value] | textTruncate(header.textSize) }}</span>
              </template>
              <template v-else>{{ item[header.value] }}</template>
            </span>
            </div>
          </div>
        </template>
      </v-virtual-scroll>
    </template>
  </div>
</template>

<script>
export default {
  name: 'VirtualScrollTable',
  props: {
    headers: {
      type: Array,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    itemHeight: {
      type: Number,
      required: false,
      default: 50
    },
    bodyHeight: {
      type: Number,
      required: false,
      default: 500
    },
    bench: {
      type: Number,
      required: false,
      default: 10
    },
    colClass: {
      type: Function,
      default () {
        return null
      }
    }
  },
  data: function () {
    return {
      initScrollSize: 17
    }
  },
  mounted () {
    window.addEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize () {
      if (this.items && this.items.length > 0 && this.$refs.virtual) {
        this.initScrollSize = this.$refs.virtual.$el.offsetWidth - this.$refs.virtual.$el.clientWidth
      }
    }
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style lang="scss">
  .custom-flex-grow-1 {
    flex: 1.1 1 0%;
  }
  .custom-flex-grow-2 {
    flex: 2.1 1 0%;
  }
  .custom-flex-grow-3 {
    flex: 3.1 1 0%;
  }
  .custom-flex-grow-4 {
    flex: 4.1 1 0%;
  }
  .custom-flex-grow-5 {
    flex: 5.1 1 0%;
  }
  .custom-flex-grow-6 {
    flex: 6.1 1 0%;
  }
  .custom-flex-grow-7 {
    flex: 7.1 1 0%;
  }
  .custom-flex-grow-8 {
    flex: 8.1 1 0%;
  }
  .custom-flex-grow-9 {
    flex: 9.1 1 0%;
  }
  .custom-flex-grow-10 {
    flex: 10.4 1 0%;
  }
  .custom-flex-grow-16 {
    flex: 16.4 1 0%;
  }

  div.v-virtual-scroll {
    overflow-y: scroll;
  }

  div.v-scroll-table-style {
    display: flex;
    flex-direction: column;
    width: 100%;

    div.v-scroll-header {
      display: inline-flex;
      background-color: #EEEEEE;
      width: 100%;

      div.v-scroll-header-column {
        display: flex;
        justify-content: center;
        white-space: nowrap;
        font-weight: 900;
        height: 48px;
        align-items: center;
        padding-top: 4px;
        padding-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        white-space: nowrap;

        border-top: 1px solid rgba(0, 0, 0, 0.12);
        border-left: 1px solid rgba(0, 0, 0, 0.12);
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);

        &:last-child {
          border-left: none!important;
          border-right: 1px solid rgba(0, 0, 0, 0.12);
        }
      }
    }
    div.v-scroll-row {
      display: inline-flex;
      width: 100%;

      &:hover {
        background-color: #ECEFF1!important;
      }

      &.exception {
        background-color: #FFCDD2;
      }
      &.adjustment {
        background-color: #D7CCC8;
      }
      &.exclusion {
        background-color: #B2DFDB;
      }
      div.v-scroll-column {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 7px;
        padding-bottom: 7px;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        white-space: nowrap;

        border-left: 1px solid rgba(0, 0, 0, 0.12);
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      }

      div.v-scroll-column-empty {
        border-right: 1px solid rgba(0, 0, 0, 0.12);
      }

      div.v-scroll-column-edit:hover {
        box-shadow: 0 7px 8px -4px rgba(0,0,0,.2),0 13px 19px 2px rgba(0,0,0,.14),0 5px 24px 4px rgba(0,0,0,.12);
        padding: 5px;
      }
    }
  }
</style>
