<template>
  <v-simple-table
    v-dragscroll="{target: '.v-data-table__wrapper'}"
    :no-data-text="noDataText"
    :headers="headers"
    :items="list"
    :dense="dense"
    :fixed-header="fixedHeader"
    :height="height !== undefined? height: 'auto'"
    :class="['sticky-table', 'bordered', classes]"
  >
    <thead>
      <tr>
        <th v-for="(header, colIndex) of headers" :key="header.value" :index="colIndex + 1" name="headers" :style="{ 'left' : colSize[colIndex] }"
            :class="['text-' + (header.align || 'center'), colIndex < fixedColumnLength ? 'sticky': '']">
          <span>{{header.text}}</span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, rowIndex) of list" :key="rowIndex">
        <td v-for="(header, colIndex) of headers" :key="header.value" :align="header.align"
            :class="{'sticky': colIndex < fixedColumnLength}" :style="{ 'left' : colSize[colIndex] }">
          <slot v-if="!!$scopedSlots[header.value]" :name="header.value" :item="item" />
          <span v-else>
            {{item[header.value]}}
          </span>
        </td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<script>
import { ResizeObserver as Polyfill } from '@juggle/resize-observer'

export default {
  name: 'StickyTable',
  props: {
    /**
     * 반복될 리스트 데이터
     */
    items: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    /**
     * 고정될 컬럼 갯수 : 왼쪽에서 부터 지정된 숫자까지만 고정된다.
     */
    fixedColumnLength: {
      type: Number,
      default () {
        return 0
      }
    },
    /**
     * 데이터가 없을 시 노출될 text
     */
    noDataText: {
      type: String,
      default () {
        return '검색 결과가 없습니다.'
      }
    },
    /**
     * 테이블 헤더 정보
     */
    headers: {
      type: Array,
      default () {
        return []
      }
    },
    /**
     * 테이블 dense 적용 여부
     */
    dense: {
      type: Boolean,
      default () {
        return false
      }
    },
    /**
     * 테이블 header 고정 여부
     */
    fixedHeader: {
      type: Boolean,
      default () {
        return false
      }
    },
    /**
     * 테이블 header 고정 시 고정될 테이블 높이
     */
    height: {
      type: Number,
      default () {
        return undefined
      }
    },
    classes: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      list: [],
      observerTable: null,
      colSize: [0]
    }
  },
  watch: {
    items (newValue) {
      this.list = newValue
    }
  },
  mounted () {
    // 테이블 resize observe
    this.observeSize()
  },
  methods: {
    /**
     * 테이블 column 이 resize 될 경우 resize 된 값을 고정 width 에 저장해 준다.
     */
    observeSize () {
      const ResizeObserver = Polyfill
      const headerCols = document.getElementsByName('headers')
      // 테이블 width 변경 체크
      const observerTable = new ResizeObserver(entries => {
        entries.forEach(entry => {
          const inlineSize = entry.borderBoxSize[0].inlineSize
          const index = parseInt(entry.target.getAttribute('index'))
          const prevSize = parseInt(this.colSize[index - 1] || '0')
          this.$set(this.colSize, index, (prevSize + inlineSize) + 'px')
        })
      })
      let index = 0
      for (const header of headerCols) {
        if (index < (this.fixedColumnLength - 1)) {
          observerTable.observe(header)
        }
        index++
      }
      this.observerTable = observerTable
    }
  },
  /**
   * component 제거 시 resize observer 제거
   */
  beforeDestroy () {
    if (this.observerTable) {
      this.observerTable.disconnect()
    }
  }
}
</script>
