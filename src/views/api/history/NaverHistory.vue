<template>
    <v-row wrap>
        <app-card :heading="'NAVER API 이력 관리'" col-classes="col-12">
            <search-form :search-param.sync="searchParam" :search-list.sync="searchList" @search="search"></search-form>
            <v-data-table disable-pagination :no-data-text="'검색 결과가 없습니다.'" :headers="headers" :items="list" disable-sort hide-default-footer @click:row="open($event)" class="click-row bordered">
              <template v-slot:item.reqsUri="{ item }">
                  {{ item.reqsUri | textTruncate(70) }}
              </template>
              <template v-slot:item.url="{ item }">
                {{ item.url }}
              </template>
            </v-data-table>
            <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
        </app-card>
    </v-row>
</template>

<script>
import service from '@/api/modules/api/apiHistory.service'

export default {
  name: 'naverHistory',
  computed: {
    searchList () {
      return [
        {
          key: 'logType',
          label: '로그 타입',
          type: 'select',
          list: this.logTypeList,
          listValue: 'logType',
          listText: 'logType'
        },
        {
          key: 'reqsType',
          label: '요청 타입',
          type: 'select',
          list: this.reqsTypeList,
          listValue: 'reqsType',
          listText: 'reqsType'
        },
        {
          key: 'reqsUriName',
          label: '요청 URL명',
          type: 'text'
        },
        {
          key: 'reqsUri',
          label: 'URL',
          type: 'text'
        },
        {
          key: 'reqsParams',
          label: '요청 Params',
          type: 'text'
        },
        {
          key: 'rspnsCode',
          label: '응답 코드',
          type: 'text'
        },
        {
          key: 'crtDt',
          label: '요청 일시',
          type: 'date',
          format: 'YYYY-MM-DD'
        }
      ]
    }
  },
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0,
        sort: '_id'
      },
      list: [],
      headers: [
        {
          text: '로그 타입',
          value: 'logType',
          align: 'center'
        },
        {
          text: '요청 타입',
          value: 'reqsType',
          align: 'center'
        },
        {
          text: '요청 URL명',
          value: 'reqsUriName',
          align: 'center'
        },
        {
          text: 'URL',
          value: 'reqsUri',
          align: 'center'
        },
        {
          text: '요청 Params',
          value: 'reqsParams',
          align: 'center'
        },
        {
          text: '응답 코드',
          value: 'rspnsCode',
          align: 'center'
        },
        {
          text: '요청 일시',
          value: 'crtDt',
          align: 'center'
        }
      ],
      logTypeList: [
        { logType: 'inbound' },
        { logType: 'outbound' }
      ],
      reqsTypeList: [
        { reqsType: 'GET' },
        { reqsType: 'POST' },
        { reqsType: 'PATCH' },
        { reqsType: 'DELETE' }
      ]
    }
  },
  mounted () {
    this.search()
  },
  methods: {
    /**
     * 검색
     */
    async search () {
      const res = await service.selectNaverApiHistoryList(this.searchParam)
      this.list = res.data.list
      this.searchParam.total = res.data.total
    },
    /**
     * Naver API 이력 조회 > Naver API 이력 상세 조회
     * @param row
     */
    open (row) {
      this.$store.dispatch('dialog/open', {
        componentPath: '@/api/History/NaverHistoryDialog',
        params: {
          item: row
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 800
        }
      })
    }
  }
}
</script>
