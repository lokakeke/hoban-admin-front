<template>
  <app-card :heading="noticeTypeNm || '공지사항'" col-classes="col-6">
    <v-col cols="12" class="primary--text pa-0 pb-2 pl-1">
      총 {{searchParam.total}} 건 {{searchParam.page}} / {{pages}} 페이지
    </v-col>
    <v-data-table
      v-dragscroll="{target: '.v-data-table__wrapper'}"
      :no-data-text="'공지사항이 없습니다.'"
      :headers="headers"
      :items="list"
      item-key="rowSeq"
      hide-default-footer
      disable-pagination
      disable-sort
      dense
      @click:row="openViewBoardNoticeDialog"
      class="click-row"
    >
      <template v-slot:item.title="{item}">
        {{ item.title | textTruncate(20)}}
      </template>
      <template v-slot:item.crtNm="{item}">
        <mask-name :text="item.crtNm" auto-height />
      </template>
      <template v-slot:item.crtDt="{item}">
        {{ item.crtDt | date }}
      </template>
    </v-data-table>
    <search-pagination
      v-model="searchParam"
      :total-visible="10"
      circle
      @change="selectBoardNoticeList"
    ></search-pagination>
  </app-card>
</template>

<script>
import MaskName from 'Components/Mask/MaskName.vue'
import boardNoticeService from 'Api/modules/system/boardNotice.service'

export default {
  name: 'Notice',
  components: {
    MaskName
  },
  props: {
    noticeTypeNm: {
      type: String,
      default () {
        return ''
      }
    },
    useYn: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 5,
        total: 0
      },
      list: [],
      headers: [
        {
          text: '공지유형',
          value: 'noticeTypeNm',
          align: 'center'
        },
        {
          text: '제목',
          value: 'title',
          align: 'center'
        },
        {
          text: '등록자',
          value: 'crtNm',
          align: 'center'
        },
        {
          text: '등록일자',
          value: 'crtDt',
          align: 'center'
        }
      ]
    }
  },
  computed: {
    pages () {
      if (
        this.searchParam.size == null ||
        this.searchParam.total == null ||
        this.searchParam.total === 0
      ) {
        return 1
      }
      return Math.ceil(this.searchParam.total / this.searchParam.size)
    }
  },
  mounted () {
    this.selectBoardNoticeList()
  },
  methods: {
    /**
     * 게시판 > 공지사항 목록 조회
     */
    async selectBoardNoticeList () {
      // 공지유형 셋팅
      this.searchParam.q.noticeTypeNm = this.noticeTypeNm
      if (this.useYn) {
        this.searchParam.q.useYn = this.useYn
      }
      const res = await boardNoticeService.selectBoardNoticeList(
        this.searchParam
      )
      res.data.forEach(item => {
        item.rowSeq = item.noticeSeq
      })
      this.list = res.data
      this.searchParam.total = res.pagination.total
    },
    /**
     * 게시판 > 공지사항 조회 팝업 열기
     */
    openViewBoardNoticeDialog ({ noticeSeq }) {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Board/Notice/BoardNoticeViewDialog',
        params: {
          noticeSeq
        },
        options: {
          width: '900px',
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          closeCallback: () => {
            this.selectBoardNoticeList()
          }
        }
      })
    }
  }
}
</script>
