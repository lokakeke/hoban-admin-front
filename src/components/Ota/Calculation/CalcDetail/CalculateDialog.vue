<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-row no-gutters dense>
        <v-col cols="12">
          <search-form :search-list="searchList"
                       :search-param.sync="searchParam"
                       init-search
                       v-show="isToggledSearchForm"
                       @search="search"
                       excel
                       @export="downloadExcel" />
        </v-col>
      </v-row>
      <v-row no-gutters dense>
        <v-col cols="3" offset="9" align-self="end">
          <v-text-field
              placeholder="검색 - 회원(패키지)명, 투숙객명, 영업장명, 예약번호"
              append-icon="search"
              v-model="searchKeyword"
          />
        </v-col>
      </v-row>
      <virtual-scroll-table
          :headers="calcHeaders"
          :items="filterCalcItems"
          :item-height="50"
          :body-height="300"
          :bench="8"
          :col-class="setColor"
      >
        <template v-slot:index="{ index }">{{ index + 1 }}</template>

        <template v-slot:selected="{ item }">
          <span v-if="item.calcRegYn === 'Y'" class="blue--text">포함됨</span>
          <v-btn v-else
                 icon
                 @click="changeTypeYn(item)"
          >
            <v-icon>{{ item.typeYn === 'Y' ? 'check_box': 'check_box_outline_blank' }}</v-icon>
          </v-btn>
        </template>

        <template v-slot:memNo="{ item }">
          {{ /* 패키지 정산인 경우 패키지번호 클릭 시, 쿠폰 이력 출력 */ }}
          <template v-if="calcHisItem.calcInd === '1' || calcHisItem.calcInd === '3'">
            <span class="text-decoration-underline pointer blue--text"
                  @click="showCouponUseStatus(item.keyRsvNo)"
            >
              {{ item.memNo }}
            </span>
          </template>
          <template v-else>
            <span>{{ item.memNo }}</span>
          </template>
        </template>

        <template v-slot:lcal="{ item }">
          <span :title="mergeTextNameCode(item.lcalName, item.lcalCd)">
            {{ mergeTextNameCd(item.lcalName, item.lcalCd) | textTruncate(12) }}
          </span>
        </template>

        <template v-slot:store="{ item }">
          <span :title="mergeTextNameCd(item.storeName, item.storeCd)">
            {{ mergeTextNameCd(item.storeName, item.storeCd) | textTruncate(12) }}
          </span>
        </template>

        <template v-slot:saleAdjustAmt="{ item, index }">
          <v-currency-field
              v-if="calcHisItem.lockYn !== 'Y' && writeAuth && !isPartner && index === editIndex.saleAdjustAmt"
              v-model="item.saleAdjustAmt"
              class="px-2"
              @change="setSaleAdjustAmt(item)"
          />
          <div v-else
               @click="editIndex.saleAdjustAmt = index"
               class="pointer px-2 red--text"
          >
            {{ item.saleAdjustAmt === '' || item.saleAdjustAmt === null ? '-' : item.saleAdjustAmt | price }}
          </div>
        </template>

        <template v-slot:aftpayAmt="{ item }">
          <span v-if="item.aftpayAmt === item.aftpayAmt + item.saleAdjustAmt || menu !== constant.ptnr">{{ item.aftpayAmt | price }}</span>
          <span v-else class="blue--text" :title="item.aftpayAmt | price">{{ item.aftpayAmt + item.saleAdjustAmt | price }}</span>
        </template>

        <template v-slot:diffAmt="{ item }">
          <span v-if="item.diffAmt != 0" class="font-weight-bold red--text">{{ item.diffAmt | price }}</span>
          <span v-else>{{ item.diffAmt | price }}</span>
        </template>

        <template v-slot:rsvNo="{ item }">
          {{ /* 예약번호 클릭 시, 예약정보 출력 */ }}
          <span :title="item.keyRsvNo"
                class="text-decoration-underline pointer blue--text"
                @click="showRsvInfo(item.keyRsvNo)"
          >
            {{ item.rsvNo }}
          </span>
        </template>

        <template v-slot:afterSaleAdjustAmt="{ item }">
          <span class="blue--text">{{ item.aftpayAmt + item.saleAdjustAmt | price }}</span>
        </template>

        <template v-slot:sonoAmt="{ item }">
          {{ item.aftpayAmt - item.tpneAmt | price }}
        </template>

        <template v-slot:rsvStatCd="{ item }">
          {{ showPenaltyRuleText(item) }} {{ showRsvStatText(item) }}
        </template>

        <template v-slot:memo="{ item, index }">
          <v-text-field
              v-if="calcHisItem.lockYn !== 'Y' && writeAuth && !isPartner && index === editIndex.memo"
              v-model="item.memo"
              dense
              hide-details
              @change="setMemo(item)"
              class="px-2"
          />

          <div v-else
               @click="editIndex.memo = index"
               class="pointer px-2"
               :title="item.memo">
            {{ item.memo === '' || item.memo === null ? '-' : item.memo }}
          </div>
        </template>
      </virtual-scroll-table>
    </v-col>

    <v-col cols="12">
      <v-row>
        <v-col cols="5" align-self="center">
          <v-list dense class="text-body-1">
            {{ /* 객실, 패키지 후불 금액 총 합계 출력 */ }}
            <v-list-item class="pa-0 font-weight-bold" v-if="calcHisItem.calcInd !== '2' && menu !== constant.ptnr">
              <v-list-item-content>예약금액 합계  :</v-list-item-content>
              <v-list-item-content class="align-end">
                {{ /* 파트너 탭에서는 매출조정금액이 반영 된 총 합계를 출력 */ }}
                {{ totPrice.rsvTotAmt | price }}
              </v-list-item-content>
              <v-list-item-content>후불금액 합계  :</v-list-item-content>
              <v-list-item-content class="align-end">
                {{ /* 파트너 탭에서는 매출조정금액이 반영 된 총 합계를 출력 */ }}
                {{ menu !== constant.ptnr ? totPrice.aftpayTotAmt : totPrice.adjustTotAmt | price }}
              </v-list-item-content>
              <v-list-item-content>차액 합계  :</v-list-item-content>
              <v-list-item-content class="align-end red--text">
                {{ /* 파트너 탭에서는 매출조정금액이 반영 된 총 합계를 출력 */ }}
                {{ menu !== constant.ptnr ? totPrice.rsvTotAmt - totPrice.aftpayTotAmt : totPrice.rsvTotAmt - totPrice.adjustTotAmt | price }}
              </v-list-item-content>
            </v-list-item>

            <v-list-item class="pa-0 font-weight-bold" v-if="calcHisItem.calcInd !== '2' && menu == constant.ptnr">
              <v-list-item-content>후불금액 합계  :</v-list-item-content>
              <v-list-item-content class="align-end">
                {{ /* 파트너 탭에서는 매출조정금액이 반영 된 총 합계를 출력 */ }}
                {{ menu !== constant.ptnr ? totPrice.aftpayTotAmt : totPrice.adjustTotAmt | price }}
              </v-list-item-content>
            </v-list-item>

            {{ /* 위약금 정산에서만 위약금 합계 출력 */ }}
            <v-list-item class="pa-0 font-weight-bold" v-if="calcHisItem.calcInd === '2'">
              <v-list-item-content>위약금 합계:</v-list-item-content>
              <v-list-item-content class="align-end">{{ totPrice.bkpmsTotAmt | price }}</v-list-item-content>
            </v-list-item>

            {{ /* TPNE 정산에서만 TPNE 합계 출력 */ }}
            <v-list-item class="pa-0 font-weight-bold" v-if="calcHisItem.calcInd === '3'">
              <v-list-item-content>TPNE 합계:</v-list-item-content>
              <v-list-item-content class="align-end">{{ totPrice.tpneTotAmt | price }}</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <template v-if="calcHisItem.lockYn !== 'Y' && writeAuth && !isPartner">
          <v-col class="text-end" cols="7">
            <template v-if="menu !== constant.add">
              <v-btn @click="changeType(constant.expt)"
                     class="orange--text text--lighten-2"
                     outlined
                     rounded
                     v-if="menu !== constant.expt"
              >
                <v-icon>add</v-icon> 예외
              </v-btn>
              {{ /* 위약금 정산일 경우 또는 매출조정 탭에 접근했을 경우에 해당 버튼 표시 안 함 */ }}
              <v-btn @click="changeType(constant.adjust)"
                     class="brown--text text--lighten-2"
                     outlined
                     rounded
                     v-if="calcHisItem.calcInd !== '2' && menu !== constant.adjust"
              >
                <v-icon>add</v-icon> 매출조정
              </v-btn>
              <v-btn @click="changeType(constant.excl)"
                     class="teal--text text--lighten-2"
                     outlined
                     rounded
                     v-if="menu !== constant.excl"
              >
                <v-icon>add</v-icon> 제외
              </v-btn>
              <v-btn @click="removeType()"
                     class="blue-grey--text text--lighten-2"
                     outlined
                     rounded
              >
                <v-icon>remove</v-icon> 분류취소
              </v-btn>
              <v-btn @click="removeCalc()"
                     class="red--text text--lighten-2"
                     outlined
                     rounded
                     v-if="menu === constant.excl"
              >
                <v-icon>clear</v-icon> 삭제
              </v-btn>
            </template>

            <template v-else>
              <v-menu open-on-click top offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      color="indigo"
                      outlined
                      rounded
                      v-bind="attrs"
                      v-on="on"
                  >
                    <v-icon>reply</v-icon> 이번 달 정산에 포함
                  </v-btn>
                </template>

                <v-list flat>
                  <v-list-item-group>
                    <v-list-item>
                      <v-list-item-title @click="include('A')">전체</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title @click="include('M')">관리자</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title @click="include('P')">파트너</v-list-item-title>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-menu>

              <v-btn @click="showPackageStatusInformation"
                     class="green--text text--lighten-2 ml-2"
                     outlined
                     rounded
                     v-if="calcHisItem.calcInd === '1'"
              >
                <v-icon>add</v-icon> 입금일자별 패키지 현황목록 조회
              </v-btn>
              <v-btn @click="add()"
                     class="brown--text text--lighten-2 ml-2"
                     outlined
                     rounded
              >
                <v-icon>add</v-icon> 정산 데이터 추가
              </v-btn>
            </template>
          </v-col>
        </template>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import calculationService from '@/api/modules/ota/calculation.service'
import VirtualScrollTable from '@/components/Common/VirtualScrollTable.vue'
import excelMixin from '@/mixins/excelMixin'
import {mapGetters} from 'vuex'

export default {
  name: 'CalculateDialog',
  components: { VirtualScrollTable },
  mixins: [excelMixin],
  props: {
    calcHisItem: {
      type: Object,
      required: true
    },
    calcClass: {
      type: String,
      required: true
    },
    menu: {
      type: String,
      required: true
    },
    isToggledSearchForm: {
      type: Boolean,
      required: true
    }
  },
  data: function () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 100000,
        total: 0
      },
      calcItems: [],
      selectedItems: [],
      searchKeyword: '',

      editIndex: {
        saleAdjustAmt: -1,
        memo: -1
      },

      constant: {
        adm: 'ADM',
        ptnr: 'PTNR',
        add: 'ADD',
        expt: 'EXPT',
        adjust: 'ADJUST',
        excl: 'EXCL'
      },

      totPrice: {}
    }
  },
  created () {
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{ target: 'escape', action: this.closeEdit }]
    })
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    }),
    searchList () {
      const searchList = [
        { key: 'memNo', label: '회원번호', type: 'text' },
        { key: 'memName', label: '회원명', type: 'text' },
        { key: 'userName', label: '투숙객 명', type: 'text' },
        { key: 'lcalCd', label: '지역코드', type: 'text' },
        { key: 'lcalName', label: '지역명', type: 'text' },
        { key: 'storeCd', label: '영업장코드', type: 'text' },
        { key: 'storeName', label: '영업장명', type: 'text' },
        { key: 'comRsvNo', label: '업체주문번호', type: 'text' },
        { key: 'rmTypeName', label: '객실타입', type: 'text' },
        { key: 'keyRsvNo', label: 'KEY 예약번호', type: 'text' },
        { key: 'rsvNo', label: '예약번호', type: 'text' },
        { key: 'agentCd', label: 'Agent 코드', type: 'text' },
        { key: 'rcpmnyStatMemo', label: '입금현황 메모', type: 'text' },
        { key: 'memo', label: '메모', type: 'text' }
      ]

      // 파트너 계정일 경우 agentCd 검색창 제거
      if (this.isPartner) {
        const agentCdIndex = searchList.findIndex(data => data.key === 'agentCd')
        if (agentCdIndex > -1) searchList.splice(agentCdIndex, 1)
      }

      // 패키지일 경우 label 변경
      if (this.calcHisItem.calcInd === '1') {
        searchList.find(data => data.key === 'memNo').label = '패키지 번호'
        searchList.find(data => data.key === 'memName').label = '패키지 명'
      }

      // 관리자 계정이고, 전체(관리자) 탭일 경우
      // 차액이 0이 아닌 데이터를 찾는 checkbox 추가 (맨 끝에 배치)
      if (!this.isPartner && this.menu === this.constant.adm) {
        const diffAmt = { key: 'diffAmt', label: '차액이 있는 데이터 조회', type: 'boolean', trueValue: 'Y', falseValue: 'N', defaultValue: 'N' }
        searchList.splice(searchList.length + 1, 0, diffAmt)
        const addCalcYn = { key: 'addCalcYn', label: '추가 정산 여부 조회', type: 'boolean', trueValue: 'Y', falseValue: 'N', defaultValue: 'N' }
        searchList.splice(searchList.length + 1, 0, addCalcYn)
      }

      return searchList
    },
    calcHeaders () {
      const calcHeaders = [
        { name: 'No', value: 'index', size: 2 },
        { name: '회원번호', value: 'memNo', size: 3 },
        { name: '회원명', value: 'memName', size: 6, type: 'truncate', textSize: 15 },
        { name: '투숙객 명', value: 'userName', size: 4, type: 'truncate', textSize: 8 },
        { name: '입실일자', value: 'ciYmd', size: 3, type: 'date' },
        { name: '퇴실일자', value: 'coYmd', size: 3, type: 'date' },
        { name: '지역명', value: 'lcal', size: 4 },
        { name: '영업장', value: 'store', size: 5 },
        { name: '객실타입', value: 'rmTypeName', size: 5, type: 'truncate', textSize: 10 },
        { name: '예약금액', value: 'totAmt', size: 3, type: 'price' },
        { name: '후불금액', value: 'aftpayAmt', size: 3, type: 'price' },
        { name: '예약번호', value: 'rsvNo', size: 3 },
        { name: '입금현황 메모', value: 'rcpmnyStatMemo', size: 4, type: 'truncate', textSize: 8 },
        { name: '메모', value: 'memo', size: 4, type: 'truncate', textSize: 8 }
      ]

      // 권한에 따른 예외처리
      // 선택 checkBox 활성화 조건
      // 1. 쓰기권한, 2. 관리자, 3. 해당 정산이 최종완료가 되지 않은 상태
      if (this.calcHisItem.lockYn !== 'Y' && this.writeAuth && !this.isPartner) {
        const selected = { name: '선택', value: 'selected', size: 2 }
        const index = calcHeaders.findIndex(data => data.value === 'index')
        calcHeaders.splice(index + 1, 0, selected)
      }
      // 파트너 권한 - 입금현황메모(제거)
      if (this.isPartner) {
        const rcpmnyStatMemoIndex = calcHeaders.findIndex(data => data.value === 'rcpmnyStatMemo')
        if (rcpmnyStatMemoIndex > -1) calcHeaders.splice(rcpmnyStatMemoIndex, 1)
      }

      // 정산 유형에 따른 예외처리
      // 객실 - 객실번호(추가)
      if (this.calcHisItem.calcInd === '0') {
        const rmNo = { name: '객실번호', value: 'rmNo', size: 3 }
        const rmTypeNameIndex = calcHeaders.findIndex(data => data.value === 'rmTypeName')
        calcHeaders.splice(rmTypeNameIndex + 1, 0, rmNo)
      }
      // 패키지 - 파트너명(추가), 이름변경
      if (this.calcHisItem.calcInd === '1') {
        calcHeaders.find(data => data.value === 'memNo').name = '패키지 번호'
        calcHeaders.find(data => data.value === 'memName').name = '패키지 명'

        const partnerName = { name: '파트너명', value: 'partnerName', size: 4, type: 'truncate', textSize: 8 }
        const rsvNoIndex = calcHeaders.findIndex(data => data.value === 'rsvNo')
        calcHeaders.splice(rsvNoIndex + 1, 0, partnerName)
      }
      // 위약금 - 후불금액(제거), 예약일자(추가), 취소일자(추가), 예약상태(추가), 위약금(추가), 입금현황메모(제거)
      if (this.calcHisItem.calcInd === '2') {
        const aftpayAmt = calcHeaders.findIndex(data => data.value === 'aftpayAmt')
        if (aftpayAmt > -1) calcHeaders.splice(aftpayAmt, 1)

        const rsvDt = { name: '예약일자', value: 'rsvDt', size: 3, type: 'date' }
        const rsvNoIndex = calcHeaders.findIndex(data => data.value === 'rsvNo')
        calcHeaders.splice(rsvNoIndex + 1, 0, rsvDt)

        const cancelYmd = { name: '취소일자', value: 'cancelYmd', size: 3, type: 'date' }
        calcHeaders.splice(rsvNoIndex + 2, 0, cancelYmd)

        const rsvStatCd = { name: '상태', value: 'rsvStatCd', size: 4 }
        calcHeaders.splice(rsvNoIndex + 3, 0, rsvStatCd)

        const bkpmsAmt = { name: '위약금', value: 'bkpmsAmt', size: 3, type: 'price' }
        calcHeaders.splice(rsvNoIndex + 4, 0, bkpmsAmt)

        const rcpmnyStatMemoIndex = calcHeaders.findIndex(data => data.value === 'rcpmnyStatMemo')
        if (rcpmnyStatMemoIndex > -1) calcHeaders.splice(rcpmnyStatMemoIndex, 1)
      }
      // TPNE - 예약번호(제거), 금액 추가, TPNE 금액(추가)
      if (this.calcHisItem.calcInd === '3') {
        const rsvNo = calcHeaders.findIndex(data => data.value === 'rsvNo')
        if (rsvNo > -1) calcHeaders.splice(rsvNo, 1)

        const sonoAmt = { name: '소노 금액', value: 'sonoAmt', size: 3, type: 'price' }
        const aftpayAmtIndex = calcHeaders.findIndex(data => data.value === 'aftpayAmt')
        calcHeaders.splice(aftpayAmtIndex + 1, 0, sonoAmt)

        const tpneAmt = { name: 'TPNE 금액', value: 'tpneAmt', size: 3, type: 'price' }
        calcHeaders.splice(aftpayAmtIndex + 2, 0, tpneAmt)
      }

      // 정산 탭에 따른 예외처리
      // 전체(관리자) - 차액(추가)
      if (this.menu === this.constant.adm) {
        const diffAmt = { name: '차액', value: 'diffAmt', size: 2, type: 'price' }
        const aftpayAmtIndex = calcHeaders.findIndex(data => data.value === 'aftpayAmt')

        // 후불금액이 존재하는 경우에만 차액을 추가함.
        // ex) 위약금의 경우 후불금액 컬럼이 없음
        if (aftpayAmtIndex > -1) calcHeaders.splice(aftpayAmtIndex + 1, 0, diffAmt)
      }
      // 전체(파트너) - 입금현황메모(제거), 예약금액(제거)
      if (this.menu === this.constant.ptnr) {
        const rcpmnyStatMemoIndex = calcHeaders.findIndex(data => data.value === 'rcpmnyStatMemo')
        if (rcpmnyStatMemoIndex > -1) calcHeaders.splice(rcpmnyStatMemoIndex, 1)

        const totAmtIndex = calcHeaders.findIndex(data => data.value === 'totAmt')
        if (totAmtIndex > -1) calcHeaders.splice(totAmtIndex, 1)
      }
      // 매출조정 - 조정금액(추가), 조정후금액(추가)
      if (this.menu === this.constant.adjust) {
        // 예약금액 뒤에 조정금액, 조정후금액 컬럼 추가
        const saleAdjustAmt = { name: '조정금액', value: 'saleAdjustAmt', size: 3, type: 'price' }
        const totAmtIndex = calcHeaders.findIndex(data => data.value === 'totAmt')
        calcHeaders.splice(totAmtIndex + 1, 0, saleAdjustAmt)

        const afterSaleAdjustAmt = { name: '조정후금액', value: 'afterSaleAdjustAmt', size: 3, type: 'price' }
        const aftpayAmtIndex = calcHeaders.findIndex(data => data.value === 'aftpayAmt')
        calcHeaders.splice(aftpayAmtIndex + 1, 0, afterSaleAdjustAmt)
      }

      return calcHeaders
    },
    filterCalcItems () {
      const items = this.calcClass !== ''
        ? this.calcItems.filter(data => data.calcClass === this.calcClass)
        : this.calcItems.filter(data => data.calcClass !== this.constant.excl)

      if (this.searchKeyword) {
        return items.filter(data =>
          data.memName.indexOf(this.searchKeyword) > -1 ||
          data.userName.indexOf(this.searchKeyword) > -1 ||
          data.storeName.indexOf(this.searchKeyword) > -1 ||
          data.rsvNo.indexOf(this.searchKeyword) > -1
        )
      } else {
        return items
      }
    }
  },
  methods: {
    initSearch () {
      // 추가 정산 탭 전용 파라미터
      if (this.menu === this.constant.add) {
        this.searchParam.q.add = 'Y'
      }

      // 파트너 계정으로 접근 시, 파트너 번호 전달
      if (this.isPartner) {
        this.searchParam.q.partnerSeq = this.user.number
      } else {
        // 관리자 계정으로 접근 시, 관리자 탭과 파트너 탭 구분
        this.searchParam.q.showInd = this.menu === this.constant.ptnr ? 'P' : 'M'
      }

      this.searchParam.q.calcSeq = this.calcHisItem.calcSeq
      this.searchParam.q.calcClass = this.calcClass
    },
    async search () {
      this.initSearch()
      const response = await calculationService.retrieveMonthCalcDetail(this.calcHisItem.calcSeq, this.searchParam)
      const data = response.data

      if (data.resultCode === '0000') {
        data.resultList.forEach(data => { data.typeYn = 'N' })
        this.calcItems = data.resultList
        this.searchParam.total = response.pagination.total
      } else {
        this.calcItems = []
        this.searchParam.total = response.pagination.total
      }
      this.getCalcTotAmt()
    },
    async getCalcTotAmt () {
      this.initSearch()
      const response = await calculationService.retrieveMonthCalcTotAmt(this.calcHisItem.calcSeq, this.searchParam)
      const data = response.data

      if (data.resultCode !== '0000') {
        return this.$dialog.alert(data.resultMsg)
      }

      this.totPrice = data.resultData
    },
    async sendModifyCalcClass (filterItems, calcClass) {
      try {
        const keyRsvNoList = filterItems.map(data => data.keyRsvNo)
        const response = await calculationService.modifyDetailCalcClass(this.calcHisItem.calcSeq, keyRsvNoList, calcClass)
        const data = response.data

        if (data.resultCode !== '0000') {
          return this.$dialog.alert(data.resultMsg)
        }

        filterItems.map(data => {
          data.calcClass = calcClass
          data.typeYn = 'N'
        })
      } catch (e) {
        console.log('취소')
      }
    },
    async changeType (type) {
      const checkedItems = this.calcItems.filter(item => item.typeYn === 'Y')
      if (checkedItems.length === 0) return this.$dialog.alert('선택된 목록이 없습니다.')

      const msg = type === this.constant.expt
        ? '예외' : type === this.constant.adjust
          ? '매출조정' : type === this.constant.excl
            ? '제외' : ''
      if (msg === '') return this.$dialog.alert('잘못된 요청입니다.')

      try {
        await this.$dialog.confirm(`선택한 목록을 ${msg}로 분류하시겠습니까?`)
        this.sendModifyCalcClass(checkedItems, type)
      } catch (e) {
        console.log('취소')
      }
    },
    async removeType () {
      const checkedItems = this.calcItems.filter(item => item.typeYn === 'Y')
      if (checkedItems.length === 0) return this.$dialog.alert('선택된 목록이 없습니다.')

      try {
        await this.$dialog.confirm('선택한 목록을 분류취소 하시겠습니까?')
        this.sendModifyCalcClass(checkedItems, null)
      } catch (e) {
        console.log(e, '취소')
      }
    },
    mergeTextNameCd (name, code) {
      return `${name} (${code})`
    },
    async setMemo (item) {
      const isAdd = this.menu === this.constant.add ? 'Y' : 'N'
      const response = await calculationService.modifyDetailMemo(item, isAdd)
      const data = response.data

      if (data.resultCode !== '0000') {
        return this.$dialog.alert(data.resultMsg)
      }

      this.editIndex.memo = -1
    },
    async setSaleAdjustAmt (item) {
      const response = await calculationService.modifyDetailSaleAdjustAmt(item)
      const data = response.data

      if (data.resultCode !== '0000') {
        return this.$dialog.alert(data.resultMsg)
      }

      this.editIndex.saleAdjustAmt = -1
    },
    changeTypeYn (item) {
      item.typeYn = item.typeYn === 'Y' ? 'N' : 'Y'
    },
    closeEdit () {
      this.editIndex.saleAdjustAmt = -1
      this.editIndex.memo = -1
    },
    setColor (item) {
      let colorClass = ''

      // 전체 탭에서만 색상 표시
      if (this.menu === this.constant.adm) {
        colorClass = item.calcClass === this.constant.expt
          ? 'orange lighten-4' : item.calcClass === this.constant.adjust
            ? 'brown lighten-4' : item.calcClass === this.constant.excl
              ? 'teal lighten-4' : ''
      }

      return colorClass
    },
    downloadExcel () {
      this.initSearch()
      this.downLoadExcel(`/api/system/ota/calculation/detail/${this.calcHisItem.calcSeq}/excel`,
        'OTA 정산',
        this.searchParam,
        '.csv')
    },
    showPackageStatusInformation () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Calculation/CalcDetail/PackageStatusDialog',
        params: {
          calcSeq: this.calcHisItem.calcSeq
        },
        options: {
          fullscreen: true,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          dense: true,
          closeCallback: (params) => {
            if (params) {
              this.search()
            }
          }
        }
      })
    },
    async include (showInd) {
      const selectedData = this.calcItems.filter(item => item.typeYn === 'Y').map(item => item.keyRsvNo)

      if (selectedData.length === 0) {
        return this.$dialog.alert('선택한 항목이 없습니다.')
      }

      try {
        await this.$dialog.confirm('선택한 항목들을 이번 달 정산에 포함하시겠습니까?')
        const response = await calculationService.includeSelectedAddCalcDetailAsCalcDetail(this.calcHisItem.calcSeq, showInd, selectedData)
        const data = response.data

        if (data.resultCode !== '0000') {
          this.$dialog.alert(data.resultMsg)
        } else {
          this.$dialog.alert('포함되었습니다.')
        }
      } catch (e) {
        console.log(e)
      }
    },
    add () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Calculation/CalcDetail/CalculateAddDialog',
        params: {
          calcHisItem: this.calcHisItem
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          dense: true,
          width: '600',
          closeCallback: (params) => {
            if (params && params.keyRsvNo) {
              this.calcItems.push(params)
            }
          }
        }
      })
    },
    async removeCalc () {
      try {
        const checkedItems = this.calcItems.filter(item => item.typeYn === 'Y')
        if (checkedItems.length === 0) return this.$dialog.alert('선택된 목록이 없습니다.')

        await this.$dialog.confirm('선택한 항목들을 삭제하시겠습니까?')

        const keyRsvNoList = checkedItems.map(data => data.keyRsvNo)
        const response = await calculationService.removeMonthCalcDetails(this.calcHisItem.calcSeq, keyRsvNoList)
        const data = response.data

        if (data.resultCode !== '0000') {
          this.$dialog.alert(data.resultMsg)
        } else {
          this.$dialog.alert('삭제 되었습니다.')
          this.search()
        }
      } catch (e) {
        console.log('취소', e)
      }
    },
    showRsvStatText (item) {
      let text = '-'
      switch (item.rsvStatCd) {
        case 'CC':
          text = '취소'
          break
        case 'CI':
          text = '투숙'
          break
        case 'CO':
          text = '퇴실'
          break
        case 'NC':
          text = '노쇼해지'
          break
        case 'NS':
          text = '노쇼'
          break
        case 'RS':
          text = '예약'
          break
        default:
          break
      }

      return text
    },
    showPenaltyRuleText (item) {
      let text = ''
      switch (item.cancelDiffYmd) {
        case 6:
        case 5:
          text = '5 ~ 6일전'
          break
        case 4:
        case 3:
        case 2:
          text = '2 ~ 4일전'
          break
        case 1:
          text = '1일전'
          break
        case 0:
          text = '당일'
          break
        default:
          break
      }

      return text
    },
    showCouponUseStatus (keyRsvNo) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Calculation/CalcDetail/CouponStatusDialog',
        params: {
          keyRsvNo: keyRsvNo
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: false,
          scrollable: true,
          dense: true,
          width: '1200'
        }
      })
    },
    showRsvInfo (keyRsvNo) {
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
  }
}
</script>
