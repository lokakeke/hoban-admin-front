<template>
  <v-row wrap
    v-if="businessCodeList && selectItem &&
    searchVal.sorts.length > 0 &&
    searchVal.status.length > 0 &&
    searchVal.searchDgns.length > 0 &&
    searchVal.overBookingYn.length > 0 &&
    searchVal.dateStatus.length > 0 &&
    searchVal.memoStatus.length > 0"
  >
    <app-card :heading="'예약자 관리'" col-classes="col-12">
      <v-row>
        <v-col class="text-right pt-0 pb-0">
          <v-btn outlined rounded color="info" @click="print">
            <v-icon left>local_printshop</v-icon>인쇄
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="search-form">
        <v-col lg="4" md="4" sm="12">
          <div class="font-weight-bold subtitle-1 pa-1">서비스 선택</div>
          <v-autocomplete
            v-model="selectBusiness"
            :items="businessCodeList"
            item-value="dmStoreId"
            item-text="serviceName"
            @change="selectItemList"
            autocomplete="off"
            placeholder="서비스를 선택해 주세요."
            return-object dense hide-details
          >
            <v-icon slot="append" v-if="selectBusiness" @click="del()">close</v-icon>
          </v-autocomplete>
        </v-col>
        <v-col lg="8" md="8" sm="12">
          <div class="font-weight-bold subtitle-1 pa-1">상품 선택<span class="font-sm font-weight-light"> (상품명, 패키지번호, 회원번호로 검색 가능합니다.)</span></div>
          <v-autocomplete
            v-model="selectedItem"
            :items="selectItem"
            item-value="dmItemId"
            :item-text="setItemText"
            autocomplete="off"
            placeholder="상품을 선택해 주세요."
            clearable multiple chips dense deletable-chips small-chips return-object hide-details
            class="pt-1"
            no-data-text="데이터가 없습니다"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <search-form
        class="search-form"
        init-search
        :search-param.sync="searchParam"
        :search-list="searchList"
        @search="search" excel :is-exist="false" @export="exportExcel">
      </search-form>
      <v-row>
        <v-col cols="12" class="pb-0">
          <v-data-table id="printMe"
            v-dragscroll="{target: '.v-data-table__wrapper'}"
            :no-data-text="emptyText" :headers="headers"
            :items="list" item-key="bookingId"
            hide-default-footer
            disable-pagination
            disable-sort
            :loading="isLoading"
            loading-text="조회 중입니다. 잠시만 기다려주세요..."
            class="bordered">
            <template v-slot:item.status="{item}">
              <v-chip :style="{'background':getStatus (item.status, 'bgcolor'), 'color':getStatus (item.status, 'color')}">
                {{ getStatus (item.status, 'text') }}
              </v-chip>
            </template>
            <template v-slot:item.name="{item}">
              <div @click="open(item)" class="pointer pa-3 text-left font-weight-bold">
                {{ item.name }}
              </div>
            </template>
            <template v-slot:item.phone="{item}">
              <template v-if="item.phone">
                <mask-phone-number
                  :text="item.phone.length === 11 ?
                item.phone.substr(0, 3) + '-' + item.phone.substr(3, 4) + '-' + item.phone.substr(7, 4)
                : item.phone.substr(0, 3) + '-' + item.phone.substr(3, 3) + '-' + item.phone.substr(7, 4)"
                @selectPhone="selectPhone(item)"></mask-phone-number>
              </template>
            </template>
            <template v-slot:item.rsvNo="{item}">
              <span @click="edit(item)" class="pointer pa-0 text-center">
                <v-alert label outlined class="caption pa-0 pl-1 pr-1 mt-4 fixed-pricing">
                  {{ item.rsvNo ? item.rsvNo : '(없음)' }} / {{ item.keyRsvNo ? item.keyRsvNo : '(없음)' }}
                </v-alert>
              </span>
            </template>
            <template v-slot:item.usage="{item}">
              {{ item.startDate | dateSetForMonth(item.endDate) }}
            </template>
            <template v-slot:item.count="{item}">
              <v-sheet color="green lighten-3">{{ item.count }}</v-sheet>
            </template>
            <template v-slot:item.memo="{item}">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon :color="item.memo ? '#2DB400' : 'grey lighten-1'">comment</v-icon>
                  </v-btn>
                </template>
                <span style="display:block; max-width: 400px;">{{ item.memo ? item.memo : '(없음)' }}</span>
              </v-tooltip>
            </template>
            <template v-slot:item.requestMessage="{item}">
              {{ item.requestMessage ? item.requestMessage : '-' }}
            </template>
            <template v-slot:item.price="{item}">
              {{ item.price | price }}
            </template>
            <template v-slot:item.overBookingYn="{item}">
              <span class="font-sm font-weight-bold" :style="{'color':item.overBookingYn === 'Y' ? '#2DB400' : 'gray'}">
                {{ item.overBookingYn === 'Y' ? '오버부킹' : '부킹' }}</span>
            </template>
            <template v-slot:item.regDateTime="{item}">
              {{ item.regDateTime | dateSet }}
            </template>
            <template v-slot:item.confirmedDateTime="{item}">
              {{ item.confirmedDateTime | dateSet }}
            </template>
            <template v-slot:item.cancelledDateTime="{item}">
              {{ item.cancelledDateTime | dateSet }}
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <search-pagination
        v-model="searchParam"
        :total-visible="10" circle
        @change="search"
      ></search-pagination>
    </app-card>
  </v-row>
</template>

<script>
import service from 'Api/modules/naver/booking.service'
import itemService from 'Api/modules/naver/item.service'

import { mapGetters } from 'vuex'
import excelMixin from 'Mixins/excelMixin'
import MaskPhoneNumber from 'Components/Mask/MaskPhoneNumber.vue'

export default {
  name: 'BookingManagement',
  mixins: [excelMixin],
  components: {
    MaskPhoneNumber
  },
  data: function () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      list: [],
      headers: [
        { text: '상태', value: 'status', align: 'center', sortable: false },
        { text: '예약자', value: 'name', align: 'center', sortable: false },
        { text: '전화번호', value: 'phone', align: 'center', sortable: false },
        { text: '예약번호', value: 'bookingId', align: 'center', sortable: false },
        { text: 'DGNS예약번호/키', value: 'rsvNo', align: 'center', sortable: false },
        { text: '이용기간', value: 'usage', align: 'center', sortable: false },
        { text: '서비스명', value: 'dmStoreName', align: 'center', sortable: false },
        { text: '상품명', value: 'dmItemName', align: 'center', sortable: false },
        { text: '수량', value: 'count', align: 'center', sortable: false },
        { text: '오버부킹여부', value: 'overBookingYn', align: 'center', sortable: false },
        { text: '네이버메모', value: 'memo', align: 'center', sortable: false },
        { text: '요청사항', value: 'requestMessage', align: 'center', sortable: false },
        { text: '결제금액', value: 'price', align: 'center', sortable: false },
        { text: '신청일시', value: 'regDateTime', align: 'center', sortable: false },
        { text: '확정일시', value: 'confirmedDateTime', align: 'center', sortable: false },
        { text: '취소일시', value: 'cancelledDateTime', align: 'center', sortable: false }
      ],
      /**
       * 검색
       */
      searchVal: {
        sorts: [],
        dateStatus: [],
        memoStatus: [],
        status: [],
        searchDgns: [],
        overBookingYn: []
      },
      /**
       * data
       */
      businessCodeList: null,
      selectBusiness: '',
      itemList: [],
      selectItem: null,
      selectedItem: [],
      isLoading: true
    }
  },
  computed: {
    /**
     * 검색기능
     */
    searchList () {
      return [
        { key: 'sorts', label: '정렬', type: 'select', list: this.searchVal.sorts, listValue: 'value', listText: 'text', cols: 2 },
        { key: 'desc', label: '내림차순', type: 'boolean', trueValue: 'Y', defaultValue: 'Y', cols: 2 },
        { key: 'dateStatus', label: '기간 선택 기준', type: 'select', list: this.searchVal.dateStatus, listValue: 'value', listText: 'text', defaultValue: 'startDate', cols: 3 },
        { key: 'useYmd', label: '기간 선택', type: 'dateRange', startField: 'useBgnYmd', endField: 'useEndYmd', format: 'YYYYMMDD', defaultValue: [moment().format('YYYYMMDD'), moment(new Date(moment().format('YYYY'), 12, 0)).format('YYYYMMDD')], cols: 5 },
        { key: 'bookingIds', label: '예약번호', type: 'text', cols: 4 },
        { key: 'name', label: '예약자', type: 'text', cols: 4 },
        { key: 'phone', label: '전화번호', type: 'text', cols: 4 },
        { key: 'memoStatus', label: '메모 여부', type: 'select', list: this.searchVal.memoStatus, listValue: 'value', listText: 'text', cols: 3 },
        { key: 'overBookingYn', label: '오버부킹 여부', type: 'select', list: this.searchVal.overBookingYn, listValue: 'value', listText: 'text', cols: 3 },
        { key: 'searchDgns', label: 'DGNS예약번호/키', type: 'select', list: this.searchVal.searchDgns, listValue: 'value', listText: 'text', cols: 3 },
        { key: 'status', label: '예약상태', type: 'selectMulti', list: this.searchVal.status, listValue: 'value', defaultValue: ['payCompleted'], listText: 'text', cols: 3 }
      ]
    },
    ...mapGetters({
      setStatus: 'naver/setStatus'
    })
  },
  methods: {
    print () {
      this.$htmlToPaper('printMe')
    },
    getStatus (status, idx) {
      return !status ? '(없음)' : this.setStatus[status][idx]
    },
    /**
     * 조회
     */
    search () {
      // 사업장 id 검색
      this.searchParam.q.dmStoreId = this.selectBusiness.dmStoreId
      // 상품 id 검색
      this.searchParam.q.dmItemIds = []
      this.selectedItem.forEach(item => {
        this.searchParam.q.dmItemIds.push(item.dmItemId)
      })
      this.searchParam.q.dmItemIds = _.join(this.searchParam.q.dmItemIds, ',')
      // status 검색
      const status = _.cloneDeep(this.searchParam.q.status)
      this.searchParam.q.status = _.join(this.searchParam.q.status, ',')
      service.selectBookingList(this.searchParam).then(res => {
        this.list = res.data
        this.searchParam.total = res.pagination.total
        // 로딩 stop
        this.isLoading = false
        // status 초기화
        this.searchParam.q.status = status
      })
    },
    del () {
      this.selectBusiness = ''
      this.getItemListAll()
    },
    /**
     * 상태, 정렬 검색요소 등 검색기준 세팅
     */
    async getSearchVal () {
      const searchList = await service.selectSearchList()
      searchList.data.forEach(item => {
        this.searchVal[item.code].push(item)
      })
    },
    /**
     * 서비스 리스트 불러오기
     */
    async getBusinessCodeList () {
      const selectBusinessCodeList = await itemService.selectBusinessCodeList()
      const list = [{ serviceName: '전체', dmStoreId: '' }]
      this.businessCodeList = list.concat(selectBusinessCodeList.data)
    },
    /**
     * 모든 상품 리스트 불러오기
     */
    async getItemListAll () {
      this.selectItem = []
      const param = {
        filterItem: 'Y',
        sorts: 'recent'
      }
      const selectItemList = await itemService.selectItemListAll(param)
      this.selectItem = selectItemList.data
    },
    /**
     * 선택된 서비스 리스트에 대한 상품 리스트 불러오기
     */
    selectItemList () {
      this.selectItem = []
      const param = {
        dmStoreId: this.selectBusiness.dmStoreId !== undefined ? this.selectBusiness.dmStoreId : null,
        filterItem: 'Y',
        sorts: 'recent'
      }
      itemService.selectItemList(param).then(res => {
        if (res.data && res.data.length > 0) {
          this.selectItem = _.sortBy(res.data, 'pkgYn', 'name').reverse()
          // 전체 상품을 가져오고
        } else {
          this.$dialog.alert('등록된 상품이 없습니다. 상품을 등록해주세요.')
        }
      })
    },
    setItemText (item) {
      return `${item.pkgYn === 'Y' ? '[패키지]' : '[객실]'} ${item.name} (${item.mid})`
    },
    /**
     * 상세정보 팝업 열기
     */
    open (item) {
      this.$nextTick(() => {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Naver/Booking/BookingManagementForm',
          params: {
            form: item,
            search: this.search
          },
          options: {
            fullscreen: false,
            scrollable: true
          }
        })
      })
    },
    /**
     * 예약번호 변경 팝업 열기
     */
    edit (item) {
      this.$nextTick(() => {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Naver/Booking/BookingInfoUpdate',
          params: {
            form: item,
            property: 'rsvNo'
          },
          options: {
            fullscreen: false,
            scrollable: true,
            width: 500,
            /**
             * 정보 갱신하기
             */
            closeCallback: (params) => {
              if (params) {
                // 수정 사항이 있을 시만 reload
                this.form = params.data
                this.search()
              }
            }
          }
        })
      })
    },
    /**
     * 엑셀 다운로드
     */
    exportExcel () {
      // 사업장 id 검색
      this.searchParam.q.dmStoreId = this.selectBusiness.dmStoreId
      // 상품 id 검색
      this.searchParam.q.dmItemIds = []
      this.selectedItem.forEach(item => {
        this.searchParam.q.dmItemIds.push(item.dmItemId)
      })
      this.searchParam.q.dmItemIds = _.join(this.searchParam.q.dmItemIds, ',')
      // status 검색
      this.searchParam.q.status = _.join(this.searchParam.q.status, ',')
      this.downLoadExcel('/api/naver/booking/excel', '(주) 소노호텔앤리조트_예약자관리', this.searchParam, '.csv')
    },
    selectPhone (booking) {
      service.selectBookingForPhone(booking.bookingId).then(res => {
        booking.phone = res.data
      })
    }
  },
  mounted () {
    this.getItemListAll()
    this.getBusinessCodeList()
    this.getSearchVal()
  }
}
</script>

<style>
#printMe .v-data-table__wrapper {
  cursor : grab;
}
#printMe .v-data-table__wrapper:active {
  cursor : grabbing;
}
.v-autocomplete:not(.v-input--is-disabled).v-select.v-text-field input {
  padding: 10px 0px 10px;
}
.search-form {
  position: sticky !important;
  position: -webkit-sticky !important;
  z-index: 10;
}
#printMe table > tbody > tr > td:nth-child(2),
#printMe table > thead > tr > th:nth-child(2) {
  position: sticky !important;
  position: -webkit-sticky !important;
  left: 0px;
  z-index: 9;
  background: #eee;
  border-right: 1px solid #888;
}
</style>
