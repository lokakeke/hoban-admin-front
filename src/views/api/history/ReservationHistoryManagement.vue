<template>
    <v-row wrap>
      <app-card :heading="'API 예약 이력 관리'" col-classes="col-12">
          <search-form :search-param.sync="searchParam" :search-list.sync="searchList" @search="search"></search-form>
          <v-data-table disable-pagination :no-data-text="'검색 결과가 없습니다.'" :headers="headers"  :items="list" disable-sort hide-default-footer @click:row="open($event)" class="click-row bordered">
              <template v-slot:item.parameter="{ item }">
                {{ JSON.stringify(item.parameter) | textTruncate(50)}}
              </template>
              <template v-slot:item.reservationModel="{ item }">
                {{ JSON.stringify(item.reservationModel) | textTruncate(50) }}
              </template>
          </v-data-table>
          <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
      </app-card>
    </v-row>
</template>

<script>
import service from 'Api/modules/api/apiHistory.service'

export default {
  name: 'reservationHistoryManagement',
  computed: {
    searchList () {
      const list = [
        {
          key: 'ip',
          label: 'IP 주소',
          type: 'text'
        },
        {
          key: 'path',
          label: '유입경로',
          type: 'text'
        },
        {
          key: 'userName',
          label: '투숙자명',
          type: 'text'
        },
        {
          key: 'keyRsvNo',
          label: '예약KEY번호',
          type: 'text'
        },
        {
          key: 'comRsvNo',
          label: '업체주문번호',
          type: 'text'
        },
        {
          key: 'crtDt',
          label: '요청 일시',
          type: 'dateRange',
          format: 'YYYY-MM-DD'
        }
      ]
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
        sort: '_id'
      },
      list: [],
      headers: [
        {
          text: 'IP 주소',
          value: 'ip',
          align: 'center'
        },
        {
          text: '유입 경로',
          value: 'path',
          align: 'center'
        },
        {
          text: '요청 파라미터',
          value: 'parameter',
          align: 'center'
        },
        {
          text: '예약정보',
          value: 'reservationModel',
          align: 'center'
        },
        {
          text: '요청 일시',
          value: 'requestDt',
          align: 'center'
        }
      ],
      serviceList: [],
      serviceListCopy: []
    }
  },
  mounted () {
  },
  methods: {
    /**
     * 검색
     */
    async search () {
      const res = await service.selectReservationHistoryList(this.searchParam)
      this.list = res.data.list
      this.searchParam.total = res.data.total
    },
    /**
     * API 이력 조회 > API 이력 상세 조회
     * @param row
     */
    open (row) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Api/History/ReservationHistoryManagementDialog',
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

<style scoped>
.v-data-table {
}
</style>
