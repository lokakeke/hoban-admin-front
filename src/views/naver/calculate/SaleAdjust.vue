<template>
  <v-row wrap>
    <app-card :heading="'매출조정 관리'" col-classes="col-12">
      <v-row>
        <v-col class="text-right pt-0 pb-0">
          <v-btn outlined rounded color="info" @click="openSaleAdjust">
            <v-icon left>mdi-plus</v-icon>매출조정 추가
          </v-btn>
        </v-col>
      </v-row>
      <search-form
        class="search-form"
        init-search
        :search-param.sync="searchParam"
        :search-list="searchList"
        @search="search">
      </search-form>
      <v-row>
        <v-col cols="12" class="pb-0">
          <v-data-table
            v-dragscroll="{target: '.v-data-table__wrapper'}"
            :no-data-text="emptyText" :headers="headers"
            :items="list" item-key="saleAdjustNo"
            hide-default-footer
            disable-pagination
            disable-sort
            :loading="isLoading"
            loading-text="조회 중입니다. 잠시만 기다려주세요..."
            class="bordered">
            <template v-slot:item.storeCode="{item}">
              <div @click="openSaleAdjust(item)" class="pointer font-weight-bold">
                <v-icon left>search</v-icon>{{ item.storeName + ' (' + item.storeCode + ')' }}
              </div>
            </template>
            <template v-slot:item.bookingId="{item}">
              {{ item.bookingId ? item.bookingId : '-' }}
            </template>
            <template v-slot:item.calcStndMonth="{item}">
              {{ item.calcStndMonth ? (item.calcStndMonth.substring(0, 4) + '-' + item.calcStndMonth.substring(4, 6)) : '(없음)' }}
            </template>
            <template v-slot:item.rsvNo="{item}">
              <span class="pointer pa-0 text-center">
                <v-alert label outlined class="caption pa-0 pl-1 pr-1 mt-4 fixed-pricing">
                  {{ item.rsvNo ? item.rsvNo : '(없음)' }} / {{ item.keyRsvNo ? item.keyRsvNo : '(없음)' }}
                </v-alert>
              </span>
            </template>
            <template v-slot:item.aftpayAmt="{item}">
              {{ item.aftpayAmt | price }}
            </template>
            <template v-slot:item.pkgYn="{item}">
              {{ item.pkgYn === 'Y' ? '패키지' : '룸온리' }}
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
            <template v-slot:item.delete="{item}">
              <v-btn v-if="!item.calcStndMonth" class="mb-1" icon @click="deleteSaleAdjust(item)">
                <v-icon>delete</v-icon>
              </v-btn>
            </template>
            <template v-slot:item.crtDt="{item}">
              {{item.crtDt | dateSet}}
            </template>
            <template v-slot:item.updDt="{item}">
              {{item.updDt | dateSet}}
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
import service from '@/api/modules/naver/calculateSaleAdjust.service'
import itemService from '@/api/modules/naver/item.service'

export default {
  name: 'SaleAdjust',
  components: {},
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
        { text: '정산기준월', value: 'calcStndMonth', align: 'center', sortable: false },
        { text: '사업장명', value: 'storeCode', align: 'center', sortable: false },
        { text: '회원/패키지번호', value: 'mid', align: 'center', sortable: false },
        { text: '네이버예약ID', value: 'bookingId', align: 'center', sortable: false },
        { text: 'PMS회원/예약자명', value: 'name', align: 'center', sortable: false },
        { text: 'PMS/KEY예약번호', value: 'rsvNo', align: 'center', sortable: false },
        { text: 'PMS상품명', value: 'dgnsItemName', align: 'center', sortable: false },
        { text: '패키지여부', value: 'pkgYn', align: 'center', sortable: false },
        { text: '매출조정금액', value: 'aftpayAmt', align: 'center', sortable: false },
        { text: '메모', value: 'memo', align: 'center', sortable: false },
        { text: '삭제', value: 'delete', align: 'center', sortable: false },
        { text: '등록일시', value: 'crtDt', align: 'center', sortable: false },
        { text: '수정일시', value: 'updDt', align: 'center', sortable: false }
      ],
      isLoading: true,
      storeList: [],
      pkgYnList: [
        { text: '패키지', value: 'Y' },
        { text: '룸온리', value: 'N' }
      ],
      saleAdjustYnList: [
        { text: '매핑', value: 'Y' },
        { text: '(없음)', value: 'N' }
      ]
    }
  },
  computed: {
    /**
     * 검색기능
     */
    searchList () {
      return [
        { key: 'storeCode', label: '서비스', type: 'select', list: this.storeList, listValue: 'storeCode', listText: 'storeName', cols: 6 },
        { key: 'mid', label: '회원번호/패키지번호', type: 'text', cols: 3 },
        { key: 'pkgYn', label: '패키지여부', type: 'select', list: this.pkgYnList, cols: 3 },
        { key: 'bookingId', label: '네이버예약ID', type: 'text', cols: 3 },
        { key: 'name', label: '예약자명', type: 'text', cols: 3 },
        { key: 'rsvNo', label: 'PMS예약번호', type: 'text', cols: 3 },
        { key: 'keyRsvNo', label: 'PMS예약키번호', type: 'text', cols: 3 },
        { key: 'dgnsItemName', label: 'PMS상품명', type: 'text', cols: 6 },
        { key: 'saleAdjustYn', label: '월정산매핑여부', type: 'select', list: this.saleAdjustYnList, cols: 3 }
      ]
    }
  },
  mounted () {
    /**
     * 사업장 리스트 조회
     */
    itemService.selectOnlyRoomList().then((response) => {
      const data = _.orderBy(response.data, 'storeCode')
      this.storeList = []
      data.map(obj => {
        this.storeList.push({
          storeName: `${obj.storeName} (${obj.storeCode})`,
          storeCode: obj.storeCode
        })
      })
    })
  },
  methods: {
    search () {
      service.selectSaleAdjustList(this.searchParam).then(res => {
        this.list = res.data
        this.searchParam.total = res.pagination.total
        // 로딩 stop
        this.isLoading = false
      })
    },
    /**
     * 매출조정 추가
     */
    openSaleAdjust (item) {
      this.$nextTick(() => {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Naver/Calculate/SaleAdjustForm',
          params: {
            form: item
          },
          options: {
            fullscreen: false,
            scrollable: true,
            width: 1000,
            closeCallback: (params) => {
              if (params && params.data) {
                this.search()
              }
            }
          }
        })
      })
    },
    /**
     * 매출조정 삭제
     */
    deleteSaleAdjust (item) {
      this.$dialog.confirm('삭제하시겠습니까?').then(() => {
        service.deleteSaleAdjust(item).then(res => {
          this.$dialog.alert('삭제되었습니다.').then(() => {
            this.search()
          })
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
