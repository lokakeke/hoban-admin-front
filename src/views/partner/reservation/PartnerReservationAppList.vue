<template>
  <v-row wrap>
    <app-card :heading="'파트너 객실예약 신청 리스트'" col-classes="col-12">
      <search-form init-search :search-param.sync="searchParam" :search-list="searchList" @search="search" dense></search-form>
      <v-data-table :no-data-text="emptyText" :headers="headers" :items="list" hide-default-footer disable-pagination disable-sort dense id="partnerAppTable"
                    v-dragscroll="{target: '.v-data-table__wrapper'}" class="click-row bordered ps__child--consume" @click:row="open($event)">
        <template v-slot:item.totAmt="{item}">
          {{item.totAmt | price}}원
        </template>
        <template v-slot:item.ptnrNm="{item}">
          {{item.ptnrNm}}/{{item.chrgNm}}
        </template>
        <template v-slot:item.ciYmd="{item}">
          {{item.ciYmd | date}}
        </template>
        <template v-slot:item.userName="{item}">
          <mask-name :text="item.userName" />
        </template>
        <template v-slot:item.userTel="{item}">
          <mask-tel-number :text="item.userTel" @search="viewTelNo(item)" />
        </template>
        <template v-slot:item.aprlNm="{item}">
          <span :class="item.aprlCd === 'B' ? 'blue--text' : item.aprlCd === 'C' ? 'red--text': ''">{{item.aprlNm}}</span>
        </template>
        <template v-slot:item.rsvNo="{item}">
          <v-row v-if="!!item.rsvNo" @click.stop="openReservation(item.keyRsvNo)" align="center">
            <v-btn small color="info" text block><v-icon small>search</v-icon>{{item.rsvNo}}</v-btn>
          </v-row>
        </template>
        <template v-slot:item.memo="{item}">
          <v-tooltip v-if="!!item.memo" top attach="#partnerAppTable">
            <template v-slot:activator="{ on }">
              <v-icon color="primary" v-on="on" size="21">mdi-note-outline</v-icon>
            </template>
            <span v-html="item.memo"></span>
          </v-tooltip>
        </template>
      </v-data-table>
      <v-row>
        <v-col cols="12" class="text-right pb-0" v-if="isPartner && writeAuth">
          <v-btn rounded color="info" @click="open()"><v-icon left>add</v-icon>신규 신청 (F2)</v-btn>
        </v-col>
      </v-row>
      <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
    </app-card>
  </v-row>
</template>

<script>
import storeService from 'Api/modules/system/store.service'
import partnerReservationService from 'Api/modules/partner/partnerReservation.service'
import MaskTelNumber from 'Components/Mask/MaskTelNumber.vue'
import MaskName from 'Components/Mask/MaskName.vue'

export default {
  components: { MaskTelNumber, MaskName },
  name: 'PartnerReservationAppList',
  data () {
    return {
      storeList: [],
      rmTypeList: [],
      localList: [],
      searchParam: {
        q: {},
        page: 1,
        size: 20,
        total: 0
      },
      list: [],
      headers: [
        { text: '요청번호', value: 'appSeq', align: 'center' },
        { text: '예약번호', value: 'rsvNo', align: 'center' },
        { text: '객실료', value: 'totAmt', align: 'center' },
        { text: '메모', value: 'memo', align: 'center' },
        { text: '요청업체/직원명', value: 'ptnrNm', align: 'center' },
        { text: '신청일', value: 'crtDt', align: 'center' },
        { text: '회원번호', value: 'memNm', align: 'center' },
        { text: '영업장', value: 'storeNm', align: 'center' },
        { text: '객실유형', value: 'rmTypeNm', align: 'center' },
        { text: '입실일', value: 'ciYmd', align: 'center' },
        { text: '박수', value: 'nights', align: 'center' },
        { text: '객실수', value: 'rmCnt', align: 'center' },
        { text: '이용자명', value: 'userName', align: 'center' },
        { text: '핸드폰', value: 'userTel', align: 'center' },
        { text: '상태', value: 'aprlNm', align: 'center' }
      ]
    }
  },
  computed: {
    /**
     * 검색 조건
     */
    searchList () {
      // 파트너 여부에 따라 다르다.
      if (this.isPartner) {
        return [
          { key: 'lcalCd', label: '지역', type: 'select', list: this.localList, listValue: 'lcalCd', listText: 'lcalNm', cols: 2, event: this.changeLcal },
          { key: 'storeCd', label: '영업장', type: 'select', list: this.storeList, listValue: 'storeCd', listText: 'storeNm', cols: 2, event: this.changeStore },
          { key: 'rmTypeCd', label: '객실 유형', type: 'select', list: this.rmTypeList, listValue: 'rmTypeCd', listText: 'rmTypeNm', cols: 4 },
          { key: 'ciYmd', label: '입실 일자', type: 'dateRange', format: 'YYYYMMDD', startField: 'ciBgnYmd', endField: 'ciEndYmd', cols: 4 },
          { key: 'aprlCd', label: '승인 상태', type: 'code', commCd: 'OTA0003', cols: 2 },
          { key: 'userName', label: '이용자', type: 'text', cols: 2 },
          { key: 'rsvNo', label: '예약번호', type: 'text', cols: 2 },
          { key: 'appSeq', label: '요청번호', type: 'text', cols: 2 }
        ]
      } else {
        return [
          { key: 'lcalCd', label: '지역', type: 'select', list: this.localList, listValue: 'lcalCd', listText: 'lcalNm', cols: 2, event: this.changeLcal },
          { key: 'storeCd', label: '영업장', type: 'select', list: this.storeList, listValue: 'storeCd', listText: 'storeNm', cols: 2, event: this.changeStore },
          { key: 'rmTypeCd', label: '객실 유형', type: 'select', list: this.rmTypeList, listValue: 'rmTypeCd', listText: 'rmTypeNm', cols: 4 },
          { key: 'ptnrNo', label: '파트너', type: 'partner', cols: 4 },
          { key: 'ciYmd', label: '입실 일자', type: 'dateRange', format: 'YYYYMMDD', startField: 'ciBgnYmd', endField: 'ciEndYmd', cols: 2 },
          { key: 'aprlCd', label: '승인 상태', type: 'code', commCd: 'OTA0003', cols: 2 },
          { key: 'userName', label: '이용자', type: 'text', cols: 2 },
          { key: 'rsvNo', label: '예약번호', type: 'text', cols: 2 },
          { key: 'appSeq', label: '요청번호', type: 'text', cols: 2 }
        ]
      }
    }
  },
  async mounted () {
    try {
      this.selectLcalCdAllList()
      await this.$store.dispatch('keypress/addKeyEventList', {
        eventList: [{ target: 'F2', action: this.open, writeAuth: true }]
      })
    } catch (e) {}
  },
  methods: {
    /**
     * 검색
     */
    async search () {
      try {
        const res = await partnerReservationService.selectPartnerReservationApplyList(this.searchParam)
        this.list = res.data
        this.searchParam.total = res.pagination.total
      } catch (e) {}
    },
    /**
     * 지역 선택 이벤트
     * @param lcalCd 선택 지역코드
     */
    changeLcal (lcalCd) {
      const index = this.localList.findIndex(data => data.lcalCd === lcalCd)
      if (index > -1 && this.localList[index].storeList) {
        this.storeList = this.localList[index].storeList
        this.rmTypeList = []
      }
    },
    /**
     * 영업장 선택 이벤트
     * @param storeCd 선택 영업장코드
     */
    changeStore (storeCd) {
      const index = this.storeList.findIndex(data => data.storeCd === storeCd)
      if (index > -1 && this.storeList[index].rmTypeList) {
        this.rmTypeList = this.storeList[index].rmTypeList
      }
    },
    async viewTelNo (item) {
      const res = await partnerReservationService.selectPartnerReservationApply(item.appSeq)
      item.userTel = res.data.data.userTel
    },
    /**
     * 상세보기
     * @param row 게시물 정보
     */
    open (row) {
      // 파트너 / 관리자 분기
      let componentPath = ''
      if (this.isPartner) {
        componentPath = '/Partner/Reservation/PartnerReservationDetailDialog'
      } else {
        // 관리자는 신규가 없다
        if (!row) {
          return
        }
        componentPath = '/Partner/Reservation/AdminReservationConfirmDialog'
      }
      this.$store.dispatch('dialog/open', {
        componentPath,
        params: {
          isModify: !!row,
          param: row || {}
        },
        options: {
          fullscreen: true,
          scrollable: true,
          closeCallback: (params) => {
            if (params && params.change) {
              this.search()
            }
          }
        }
      })
    },
    /**
     * 예약내역 팝업창 호출
     * @param keyRsvNo 예약 번호
     */
    openReservation (keyRsvNo) {
      if (keyRsvNo) {
        this.$store.dispatch('dialog/open', {
          componentPath: '/SearchDialog/ReservationSearch',
          params: {
            keyRsvNo: keyRsvNo
          },
          options: {
            fullscreen: false,
            scrollable: true,
            width: 800
          }
        })
      }
    },
    /**
     * 지역코드/명 정보 호출
     */
    async selectLcalCdAllList () {
      const lcal = await storeService.selectLcalCdAllList()
      this.localList = lcal.data
    }
  }
}
</script>
