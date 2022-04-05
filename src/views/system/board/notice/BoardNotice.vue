<template>
  <v-row wrap>
    <app-card heading="공지사항 목록" col-classes="col-12">
      <search-form
        init-search
        :search-param.sync="searchParam"
        :search-list="searchList"
        @search="selectBoardNoticeList"
      ></search-form>
      <v-data-table
        :value="fixedList"
        :no-data-text="emptyText"
        :headers="headers"
        :items="[...fixedList, ...list]"
        item-key="rowSeq"
        hide-default-footer
        disable-pagination
        @click:row="openViewBoardNoticeDialog"
        class="click-row bordered"
      >
        <template v-slot:[`item.noticeSeq`]="{item}">
          <span v-if="item.emrgncYn === 'Y' || item.isFixed">
            <v-chip color="primary" v-if="item.isFixed">고정</v-chip>
            <v-chip class="white--text" color="red" v-if="item.emrgncYn === 'Y'">긴급</v-chip>
          </span>
          <span v-else>{{ item.noticeSeq }}</span>
        </template>
        <template v-slot:[`item.title`]="{item}">
          <span v-if="$options.filters.isDayDifferentCount(item.crtDt, 4)"><strong class="blue--text">{{ item.title }} </strong></span>
          <span v-else>{{ item.title }} </span>
          <v-chip color="red" v-if="$options.filters.isDayDifferentCount(item.crtDt, 4)" outlined small>New</v-chip>
        </template>
        <template v-slot:[`item.crtName`]="{item}">
          <mask-name :text="item.crtName" />
        </template>
        <template v-slot:[`item.crtDt`]="{item}">
          {{ item.crtDt | dateSet }}
        </template>
      </v-data-table>
      <div class="mt-3 text-right" v-if="writeAuth">
        <v-btn rounded color="info" @click="openCreateBoardNoticeDialog">
          <v-icon left>add</v-icon>공지사항 등록
        </v-btn>
      </div>
      <search-pagination
        v-model="searchParam"
        :total-visible="10"
        circle
        @change="selectBoardNoticeList"
      ></search-pagination>
    </app-card>
  </v-row>
</template>

<script>
import MaskName from '@/components/Mask/MaskName.vue'
import boardNoticeService from '@/api/modules/system/boardNotice.service'
import storeService from '@/api/modules/system/store.service'

export default {
  name: 'BoardNotice',
  components: {
    MaskName
  },
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      fixedList: [],
      list: [],
      headers: [
        {
          text: '공지순번',
          value: 'noticeSeq',
          align: 'center',
          sortable: false
        },
        {
          text: '공지유형',
          value: 'noticeTypeName',
          align: 'center',
          sortable: false
        },
        {
          text: '제목',
          value: 'title',
          align: 'center',
          sortable: false
        },
        {
          text: '조회수',
          value: 'inqCnt',
          align: 'center',
          sortable: false
        },
        {
          text: '등록자',
          value: 'crtName',
          align: 'center',
          sortable: false
        },
        {
          text: '등록일자',
          value: 'crtDt',
          align: 'center',
          sortable: false
        }
      ],
      storeList: [],
      noticeTypeList: []
    }
  },
  computed: {
    searchList () {
      const searchList = [
        { key: 'title', label: '제목', type: 'text' },
        { key: 'contents', label: '컨텐츠', type: 'text' },
        {
          key: 'emrgncYn',
          label: '긴급여부',
          type: 'select',
          list: [
            {
              text: '긴급',
              value: 'Y'
            },
            {
              text: '일반',
              value: 'N'
            }
          ]
        },
        {
          key: 'noticeTypeName',
          label: '공지유형',
          type: 'select',
          list: this.noticeTypeList,
          listValue: 'noticeTypeName',
          listText: 'noticeTypeName'
        },
        {
          key: 'storeCode',
          label: '영업장',
          type: 'select',
          list: this.storeList,
          listValue: 'storeCode',
          listText: 'storeName'
        },
        {
          key: 'crtDt',
          label: '등록일자',
          type: 'dateRange',
          format: 'YYYYMMDD'
        }
      ]
      if (this.isPartner === false) {
        searchList.push(
          ...[
            {
              key: 'ptnrNo',
              label: '파트너',
              type: 'partner'
            },
            {
              key: 'pstngBgnYmd',
              label: '게시시작일',
              type: 'dateRange',
              format: 'YYYYMMDD'
            },
            {
              key: 'pstngEndYmd',
              label: '게시종료일',
              type: 'dateRange',
              format: 'YYYYMMDD'
            },
            {
              key: 'useYn',
              label: '사용여부',
              type: 'boolean',
              trueValue: 'Y',
              falseValue: 'N',
              defaultValue: 'Y'
            },
            {
              key: 'popupYn',
              label: '팝업공지',
              type: 'boolean',
              trueValue: 'Y'
            }
          ]
        )
      }
      return searchList
    }
  },
  created () {
    this.selectStoreList()
    this.selectBoardNoticeTypeList()
  },
  methods: {
    /**
     * 게시판 > 공지사항 목록 조회
     */
    async selectBoardNoticeList () {
      await this.selectBoardNoticeFixedList()
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
     * 게시판 > 고정된 공지사항 목록 조회
     */
    async selectBoardNoticeFixedList () {
      const fixedList = []
      const res = await boardNoticeService.selectBoardNoticeFixedList()
      res.data.forEach(item => {
        item.rowSeq = item.noticeSeq + 'T'
        item.isFixed = true
        fixedList.push(item)
      })
      this.fixedList = fixedList
    },
    /**
     * 게시판 > 공지사항 유형 목록 조회
     */
    async selectBoardNoticeTypeList () {
      const res = await boardNoticeService.selectBoardNoticeTypeList()
      this.noticeTypeList = res.data
    },
    /**
     * 영업장 조회
     */
    async selectStoreList () {
      const res = await storeService.selectStoreSimpleList()
      this.storeList = res.data
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
    },
    /**
     * 게시판 > 공지사항 등록 팝업 열기
     */
    openCreateBoardNoticeDialog () {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Board/Notice/BoardNoticeDialog',
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
