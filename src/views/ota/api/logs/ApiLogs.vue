<template>
    <v-row wrap>
        <app-card :heading="'API 이력 관리'" col-classes="col-12">
            <search-form :search-param.sync="searchParam" :search-list.sync="searchList" @search="search"></search-form>
            <v-data-table disable-pagination :no-data-text="'검색 결과가 없습니다.'" :headers="headers" :items="list" disable-sort hide-default-footer @click:row="open" class="click-row bordered">
                <template v-slot:item.url="{ item }">
                    {{ item.url }}
                </template>
            </v-data-table>
            <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
        </app-card>
    </v-row>
</template>

<script>
import service from '@/api/modules/api/apiLog.service'
import commonCodeService from '@/api/modules/system/commonCode.service'

export default {
  name: 'apiLogs',
  computed: {
    searchList () {
      let list = [
        {
          key: 'ip',
          label: 'IP 주소',
          type: 'text'
        },
        {
          key: 'systemDivision',
          label: '시스템 구분',
          type: 'code',
          commCode: 'TASK_TYPE',
          event: this.changeDivision
        },
        {
          key: 'serviceDivision',
          label: '서비스 구분',
          type: 'select',
          list: this.serviceList,
          listValue: 'commonCode',
          listText: 'commonCodeName'
        },
        {
          key: 'reqParams',
          label: '요청 파라미터',
          type: 'text'
        },
        {
          key: 'resultMsg',
          label: '결과 메세지',
          type: 'text'
        },
        {
          key: 'createDatetime',
          label: '요청 일시',
          type: 'dateRange',
          format: 'YYYY-MM-DD'
        },
        { key: 'includeSuccess', label: '성공(0000) 포함', type: 'boolean' }
      ]
      if (this.isPartner) {
        list = [{ key: 'businessId', label: 'Business Id / 파트너 명', type: 'business', required: true, cols: 4 }].concat(list)
      } else {
        list = [{ key: 'businessId', label: 'Business Id / 파트너 명', type: 'business', cols: 4 }].concat(list)
      }
      return list
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
          text: 'Business Id',
          value: 'businessId',
          align: 'center'
        },
        {
          text: '파트너명',
          value: 'partnerName',
          align: 'center'
        },
        {
          text: 'IP 주소',
          value: 'ip',
          align: 'center'
        },
        {
          text: '시스템 구분',
          value: 'systemDivision',
          align: 'center'
        },
        {
          text: '서비스 구분',
          value: 'serviceDivisionKr',
          align: 'center'
        },
        {
          text: '결과 코드',
          value: 'resultCode',
          align: 'center'
        },
        {
          text: '결과 메시지',
          value: 'resultMsg',
          align: 'center'
        },
        {
          text: '요청 일시',
          value: 'createDatetime',
          align: 'center'
        }
      ],
      serviceList: [],
      serviceListCopy: []
    }
  },
  mounted () {
    this.serviceDivisionList()
    this.search()
  },
  methods: {
    /**
     * 검색
     */
    async search () {
      const res = await service.selectApiHistoryList(this.searchParam)
      this.list = res.data.list
      this.searchParam.total = res.data.total
    },
    /**
     * 서비스 구분 목록 조회
     */
    async serviceDivisionList () {
      const res = await commonCodeService.selectServiceDivisionList('TASK_TYPE')
      this.serviceListCopy = res.data
      this.changeDivision()
    },
    /**
     * API 이력 조회 > API 이력 상세 조회
     * @param row
     */
    open (row) {
      console.log('open~')
      this.$store.dispatch('dialog/open', {
        componentPath: '/Api/Logs/HistoryDialog',
        params: {
          item: row
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 800
        }
      })
    },
    /**
     * 서비스 구분값 변경
     * @param value
     */
    changeDivision (value) {
      if (value !== undefined) {
        this.serviceList = this.serviceListCopy.filter(data => data.parentCommCode === value)
      } else {
        this.serviceList = []
      }
    }
  }
}
</script>
