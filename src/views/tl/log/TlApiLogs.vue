<template>
    <v-row wrap>
        <app-card :heading="'TL API 이력 관리'" col-classes="col-12">
            <search-form :search-param.sync="searchParam" :search-list.sync="searchList" @search="search"></search-form>
            <v-data-table disable-pagination :no-data-text="'검색 결과가 없습니다.'" :headers="headers" :items="list" disable-sort hide-default-footer @click:row="open($event)" class="click-row bordered">
                <template v-slot:item.travRsvNos="{ item }">
                    {{ item.travRsvNos.join(', ') | textTruncate(40) }}
                </template>
              <template v-slot:item.requestBody="{ item }">
                  {{ item.requestBody | textTruncate(70) }}
              </template>
              <template v-slot:item.responseBody="{ item }">
                  {{ item.responseBody | textTruncate(70) }}
              </template>
            </v-data-table>
            <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
        </app-card>
    </v-row>
</template>

<script>
import apiLogService from '@/api/modules/api/apiLog.service'

export default {
  name: 'tlApiLogs',
  computed: {
    searchList () {
      return [
        {
          key: 'travRsvNo',
          label: 'Tl 예약 번호',
          type: 'text'
        },
        {
          key: 'createDatetime',
          label: '요청 일시',
          type: 'dateRange',
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
        sort: '_id,DESC'
      },
      list: [],
      headers: [
        {
          text: 'Tl 예약 번호',
          value: 'travRsvNos',
          align: 'center'
        },
        {
          text: '요청 내용',
          value: 'requestBody',
          align: 'center'
        },
        {
          text: '응답 내용',
          value: 'responseBody',
          align: 'center'
        },
        {
          text: '요청 일시',
          value: 'createDatetime',
          align: 'center'
        }
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
      const res = await apiLogService.selectTlApiHistoryList(this.searchParam)
      this.list = res.data.list
      this.searchParam.total = res.data.total
    },
    /**
     * Naver API 이력 조회 > Naver API 이력 상세 조회
     * @param row
     */
    open (row) {
      console.log('OPENOPEN~')
      this.$store.dispatch('dialog/open', {
        componentPath: '/Tl/Log/TlApiLogDialog',
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
