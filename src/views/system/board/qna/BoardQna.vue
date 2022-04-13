<template>
  <v-row wrap>
    <app-card heading="Q&A" col-classes="col-12">
      <search-form
        init-search
        :search-param.sync="searchParam"
        :search-list="searchList"
        @search="selectBoardQuestionList"
      ></search-form>
      <v-data-table
        :no-data-text="emptyText"
        :headers="headers"
        :items="list"
        hide-default-footer
        disable-pagination
        @click:row="openViewBoardQuestionDialog"
        class="click-row bordered"
      >
        <template v-slot:item.answYn="{item}">
          <span class="info--text" v-if="item.answYn === 'Y'">답변완료</span>
          <span class="error--text" v-else>답변대기</span>
        </template>
        <template v-slot:item.ptnrChrgName="{item}">
          {{ item.ptnrChrgName || '?' }}
          <small class="grey--text mr-1">({{ item.companyName }})</small>
        </template>
        <template v-slot:item.crtDt="{item}">{{ item.crtDt | dateSet }}</template>
      </v-data-table>
      <div class="mt-3 text-right" v-if="writeAuth && isPartner">
        <v-btn rounded color="info" @click="openCreateBoardQuestionDialog">
          <v-icon left>add</v-icon>질문 등록
        </v-btn>
      </div>
      <search-pagination
        v-model="searchParam"
        :total-visible="10"
        circle
        @change="selectBoardQuestionList"
      ></search-pagination>
    </app-card>
  </v-row>
</template>

<script>
import boardQnaService from '@/api/modules/system/boardQna.service'

export default {
  name: 'BoardQna',
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
          text: '질문순번',
          value: 'qstnSeq',
          align: 'center',
          sortable: false
        },
        {
          text: '상태',
          value: 'answYn',
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
          text: '등록자명',
          value: 'ptnrChrgName',
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
        {
          key: 'answYn',
          label: '상태',
          type: 'select',
          list: [
            { text: '답변완료', value: 'Y' },
            { text: '답변대기', value: 'N' }
          ]
        },
        { key: 'title', label: '제목', type: 'text' },
        { key: 'contents', label: '컨텐츠', type: 'text' },
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
              key: 'partnerSeq',
              label: '파트너',
              type: 'partner'
            }
          ]
        )
      }
      return searchList
    }
  },
  methods: {
    /**
     * 게시판 > 공지사항 목록 조회
     */
    async selectBoardQuestionList () {
      const res = await boardQnaService.selectBoardQuestionList(
        this.searchParam
      )
      this.list = res.data
      this.searchParam.total = res.pagination.total
    },
    /**
     * 게시판 > 질문 조회 팝업 열기
     */
    openViewBoardQuestionDialog ({ qstnSeq }) {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Board/Qna/BoardQuestionViewDialog',
        params: {
          qstnSeq
        },
        options: {
          width: '900px',
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          closeCallback: () => {
            this.selectBoardQuestionList()
          }
        }
      })
    },
    /**
     * 게시판 > 질문 등록 팝업 열기
     */
    openCreateBoardQuestionDialog () {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Board/Qna/BoardQuestionDialog',
        options: {
          width: '900px',
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          closeCallback: () => {
            this.selectBoardQuestionList()
          }
        }
      })
    }
  }
}
</script>
