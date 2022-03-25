<template>
  <div class="mt-5 mb-7">
    <v-data-table
      :no-data-text="emptyText"
      :headers="headers"
      :items="list"
      disable-sort
      disable-pagination
      hide-default-footer
      :loading="isLoading"
      loading-text="조회 중입니다. 잠시만 기다려주세요..."
      class="elevation-5"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-chip x-small class="ml-1">{{aprlNm}}</v-chip>
            신청 리스트
          </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <!-- 패키지명 -->
      <template v-slot:item.pkgNm="{ item }">
        {{ item.pkgNm}} ({{ item.pkgNo }})
      </template>
      <!-- 판매기간 -->
      <template v-slot:item.saleBgnYmd="{ item }">
        {{ item.saleBgnYmd | date }} ~ {{ item.saleEndYmd | date }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import partnerPkgReservationService from 'Api/modules/partner/partnerPkgReservation.service'

export default {
  name: 'PartnerPkgReservationSubList',
  props: {
    /**
     * 요청번호
     */
    appSeq: {
      type: Number,
      required: true
    },
    /**
     * 신청상태
     */
    aprlNm: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      /**
       * 목록
       */
      list: [],
      headers: [
        { text: '예약번호(4자리)', value: 'rsvNo', align: 'center', sortable: false },
        { text: 'KEY예약번호(10자리)', value: 'keyRsvNo', align: 'center', sortable: false },
        { text: '패키지명', value: 'pkgNm', align: 'center', sortable: false },
        { text: '영업장명', value: 'storeNm', align: 'center', sortable: false },
        { text: '객실유형명', value: 'rmTypeNm', align: 'center', sortable: false },
        { text: '객실수', value: 'rmCnt', align: 'center', sortable: false },
        { text: '박수', value: 'nights', align: 'center', sortable: false },
        { text: '판매기간', value: 'saleBgnYmd', align: 'center', sortable: false },
        { text: '당일예약 가능여부', value: 'todayRsvYn', align: 'center', sortable: false }
      ],
      isLoading: true
    }
  },
  computed: {
    /**
     * 수수료 서비스 객체
     */
    // commissionService () {
    //   return require(`Api/modules/ota/commission${this.commissionType}.service`)
    //     .default
    // }
  },
  watch: {
    'appSeq' (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.selectPartnerPkgRsvApplyDataList()
      }
    }
  },
  created () {
    this.selectPartnerPkgRsvApplyDataList()
  },
  methods: {
    async selectPartnerPkgRsvApplyDataList () {
      try {
        if (this.appSeq) {
          // 패키지예약 정보 맵핑 (객실유형 포함)
          this.isLoading = true
          const res = await partnerPkgReservationService.selectPartnerPkgRsvApplyDataList(this.appSeq)
          this.list = res.data.pkgPutInList
          this.isLoading = false
        }
      } catch (e) {}
    }
  }
}
</script>
