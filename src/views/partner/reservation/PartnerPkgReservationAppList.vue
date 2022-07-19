<template>
  <v-row wrap>
    <app-card :heading="'파트너 패키지예약 신청 리스트'" col-classes="col-12">
      <search-form init-search :search-param.sync="searchParam" :search-list="searchList" @search="search" dense id="partnerAppTable"></search-form>
      <v-data-table
        :no-data-text="emptyText"
        :headers="headers"
        :items="list"
        item-key="appSeq"
        :expanded.sync="expanded"
        single-expand
        disable-sort
        hide-default-footer
        disable-pagination
        class="click-row bordered"
        @click:row="expandRow"
      >
        <template v-slot:item.totAmt="{item}">
          {{item.totAmt | price}}원
        </template>
        <template v-slot:item.partnerName="{item}">
          {{item.partnerName}}/{{item.chrgName}}
        </template>
        <template v-slot:item.checkInDate="{item}">
          {{item.checkInDate | date}}
        </template>
        <template v-slot:item.guestName="{item}">
          <mask-name :text="item.guestName" />
        </template>
        <template v-slot:item.userTel="{item}">
          <mask-tel-number :text="item.guestTelNo" @search="viewTelNo(item)" />
        </template>
        <template v-slot:item.aprlName="{item}">
          <span :class="item.aprlCode === 'B' ? 'blue--text' : item.aprlCode === 'C' ? 'red--text': ''">{{item.aprlName}}</span>
        </template>
        <template v-slot:item.memo="{item}">
          <v-tooltip v-if="!!item.memo" top attach="#partnerAppTable">
            <template v-slot:activator="{ on }">
              <v-icon color="primary" v-on="on" size="21">mdi-note-outline</v-icon>
            </template>
            <span v-html="item.memo"></span>
          </v-tooltip>
        </template>
        <template v-slot:item.rsvNo="{item}">
          <v-row v-if="!!item.rsvNo" @click.stop="openReservation(item.keyRsvNo)" align="center">
            <v-btn small color="info" text block><v-icon small>search</v-icon>{{item.rsvNo}}</v-btn>
          </v-row>
        </template>
        <template v-slot:item.appSeq="{item}">
          <v-row v-if="!!item.appSeq" @click.stop="open(item)" align="center">
            <v-btn small color="info" text block><v-icon small>mdi-clipboard-text-outline</v-icon>{{item.appSeq}}</v-btn>
          </v-row>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <!-- 확장된 파트너 패키지예약 신청 상세 -->
          <td :colspan="headers.length">
            <partner-pkg-reservation-sub-list
              :appSeq="item.appSeq"
              :aprlName="item.aprlName"
              v-if="expanded.length > 0 && expanded[0].appSeq === item.appSeq"
              @refresh="search(true)"
            ></partner-pkg-reservation-sub-list>
          </td>
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
import MaskTelNumber from '@/components/Mask/MaskTelNumber.vue'
import MaskName from '@/components/Mask/MaskName.vue'
import storeService from '@/api/modules/system/store.service'
import partnerPkgReservationService from '@/api/modules/partner/partnerPkgReservation.service'
import PartnerPkgReservationSubList from '@/components/Partner/Reservation/PartnerPkgReservationSubList.vue'

export default {
  name: 'PartnerPkgReservationAppList',
  components: { MaskTelNumber, MaskName, PartnerPkgReservationSubList },
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
        { text: '요청업체/직원명', value: 'partnerName', align: 'center' },
        { text: '신청일', value: 'crtDt', align: 'center' },
        { text: '신청건수', value: 'rsvRmCount', align: 'center' },
        { text: '입실일', value: 'checkInDate', align: 'center' },
        { text: '이용자명', value: 'guestName', align: 'center' },
        { text: '핸드폰', value: 'guestTelNo', align: 'center' },
        { text: '상태', value: 'aprlName', align: 'center' }
      ],
      /**
       * 확장된 파트너 패키지예약 신청 상세
       */
      expanded: []
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
          { key: 'localCode', label: '지역', type: 'select', list: this.localList, listValue: 'localCode', listText: 'lcalName', cols: 2, event: this.changeLcal },
          { key: 'storeCode', label: '영업장', type: 'select', list: this.storeList, listValue: 'storeCode', listText: 'storeName', cols: 2, event: this.changeStore },
          { key: 'roomTypeCode', label: '객실 유형', type: 'select', list: this.rmTypeList, listValue: 'roomTypeCode', listText: 'rmTypeName', cols: 4 },
          { key: 'checkInDate', label: '입실 일자', type: 'dateRange', format: 'YYYYMMDD', startField: 'ciBgnYmd', endField: 'ciEndYmd', cols: 4 },
          { key: 'aprlCode', label: '승인 상태', type: 'code', commonCode: 'OTA0003', cols: 2 },
          { key: 'guestName', label: '이용자', type: 'text', cols: 2 },
          { key: 'guestTelNo', label: '휴대폰번호', type: 'text', cols: 2 },
          { key: 'rsvNo', label: '예약번호', type: 'text', cols: 2 },
          { key: 'appSeq', label: '요청번호', type: 'text', cols: 2 },
          { key: 'comRsvNo', label: '업체주문번호', type: 'text', cols: 2 }
        ]
      } else {
        return [
          { key: 'localCode', label: '지역', type: 'select', list: this.localList, listValue: 'localCode', listText: 'lcalName', cols: 2, event: this.changeLcal },
          { key: 'storeCode', label: '영업장', type: 'select', list: this.storeList, listValue: 'storeCode', listText: 'storeName', cols: 2, event: this.changeStore },
          { key: 'roomTypeCode', label: '객실 유형', type: 'select', list: this.rmTypeList, listValue: 'roomTypeCode', listText: 'rmTypeName', cols: 4 },
          { key: 'partnerSeq', label: '파트너', type: 'partner', cols: 2 },
          { key: 'checkInDate', label: '입실 일자', type: 'dateRange', format: 'YYYYMMDD', startField: 'ciBgnYmd', endField: 'ciEndYmd', cols: 2 },
          { key: 'aprlCode', label: '승인 상태', type: 'code', commonCode: 'OTA0003', cols: 2 },
          { key: 'guestName', label: '이용자', type: 'text', cols: 2 },
          { key: 'guestTelNo', label: '휴대폰번호', type: 'text', cols: 2 },
          { key: 'rsvNo', label: '예약번호', type: 'text', cols: 2 },
          { key: 'appSeq', label: '요청번호', type: 'text', cols: 2 },
          { key: 'comRsvNo', label: '업체주문번호', type: 'text', cols: 2 }
        ]
      }
    }
  },
  async mounted () {
    try {
      this.selectLcalCodeAllList()
      await this.$store.dispatch('keypress/addKeyEventList', {
        eventList: [{ target: 'F2', action: this.open, writeAuth: true }]
      })
    } catch (e) {}
  },
  methods: {
    /**
     * 검색
     */
    async search (isRefresh) {
      try {
        if (isRefresh !== true) { // 단순 새로고침
          this.expanded = [] // 행 확장 초기화
        }
        const res = await partnerPkgReservationService.selectPartnerPkgReservationApplyList(this.searchParam)
        this.list = res.data
        this.searchParam.total = res.pagination.total
      } catch (e) {}
    },
    async viewTelNo (item) {
      const res = await partnerPkgReservationService.selectPartnerPkgReservationApply(item.appSeq)
      item.guestTelNo = res.data.data.guestTelNo
    },
    /**
     * 지역 선택 이벤트
     * @param localCode 선택 지역코드
     */
    changeLcal (localCode) {
      const index = this.localList.findIndex(data => data.lcalCd === lcalCd)
      if (index > -1 && this.localList[index].storeList) {
        this.storeList = this.localList[index].storeList
        this.rmTypeList = []
      }
    },
    /**
     * 영업장 선택 이벤트
     * @param storeCode 선택 영업장코드
     */
    changeStore (storeCode) {
      const index = this.storeList.findIndex(data => data.storeCode === storeCode)
      if (index > -1 && this.storeList[index].rmTypeList) {
        this.rmTypeList = this.storeList[index].rmTypeList
      }
    },
    /**
     * 상세보기
     * @param row 게시물 정보
     */
    open (row) {
      // 파트너 / 관리자 분기
      let componentPath = ''
      if (this.isPartner) {
        componentPath = '/Partner/Reservation/PartnerPkgReservationDetailDialog'
      } else {
        // 관리자는 신규가 없다
        if (!row) {
          return
        }
        componentPath = '/Partner/Reservation/AdminPkgReservationConfirmDialog'
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
            keyRsvNo: keyRsvNo,
            isPkg: true
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
    },
    /**
     * 행 확장
     */
    expandRow (item, body) {
      body.expand(!body.isExpanded)
    }
  }
}
</script>
