<template>
  <dialog-base :instance="instance" :title="'매출조정 매핑'">
    <v-card-text class="pa-0">
      <search-form
        class="search-form"
        init-search
        :search-param.sync="searchParam"
        :search-list="searchList"
        @search="search">
      </search-form>
      <v-row>
        <v-col>
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
            <template v-slot:item.add="{item}">
              <v-btn v-if="!item.calcStndMonth" class="mb-1" icon @click="addSaleAdjust(item)">
                <v-icon>add</v-icon>
              </v-btn>
              <v-btn v-else class="mb-1" icon @click="deleteSaleAdjust(item)">
                <v-icon>remove</v-icon>
              </v-btn>
            </template>
            <template v-slot:item.storeCd="{item}">
              {{ item.storeNm + ' (' + item.storeCd + ')' }}
            </template>
            <template v-slot:item.bookingId="{item}">
              {{ item.bookingId ? item.bookingId : '-' }}
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
          </v-data-table>
        </v-col>
      </v-row>
      <search-pagination
        v-model="searchParam"
        :total-visible="10" circle
        @change="search"
      ></search-pagination>
    </v-card-text>
  </dialog-base>
</template>

<script>
import DialogBase from "@/components/Dialog/DialogBase"
import saleAdjustService from "Api/modules/naver/calculateSaleAdjust.service"
import itemService from "Api/modules/naver/item.service"

export default {
  extends: DialogBase,
  name: 'SaleAdjustForm',
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
        { text: '선택', value: 'add', align: 'center', sortable: false },
        { text: '사업장명', value: 'storeCd', align: 'center', sortable: false },
        { text: '회원/패키지번호', value: 'mid', align: 'center', sortable: false },
        { text: '네이버예약ID', value: 'bookingId', align: 'center', sortable: false },
        { text: 'DGNS회원/예약자명', value: 'name', align: 'center', sortable: false },
        { text: 'DGNS/KEY예약번호', value: 'rsvNo', align: 'center', sortable: false },
        { text: 'DGNS상품명', value: 'dgnsItemName', align: 'center', sortable: false },
        { text: '패키지여부', value: 'pkgYn', align: 'center', sortable: false },
        { text: '매출조정금액', value: 'aftpayAmt', align: 'center', sortable: false },
        { text: '메모', value: 'memo', align: 'center', sortable: false }
      ],
      isLoading: true,
      storeList: [],
      pkgYnList: [
        { text: '패키지', value: 'Y' },
        { text: '룸온리', value: 'N' }
      ]
    }
  },
  computed: {
    /**
     * 검색기능
     */
    searchList () {
      return [
        { key: 'storeCd', label: '서비스', type: 'select', list: this.storeList, listValue: 'storeCd', listText: 'storeNm', cols: 6 },
        { key: 'mid', label: '회원번호/패키지번호', type: 'text', cols: 3 },
        { key: 'pkgYn', label: '패키지여부', type: 'select', list: this.pkgYnList, cols: 3 },
        { key: 'bookingId', label: '네이버예약ID', type: 'text', cols: 3 },
        { key: 'name', label: '예약자명', type: 'text', cols: 3 },
        { key: 'rsvNo', label: 'DGNS예약번호', type: 'text', cols: 3 },
        { key: 'keyRsvNo', label: 'DGNS예약키번호', type: 'text', cols: 3 },
        { key: 'dgnsItemName', label: 'DGNS상품명', type: 'text', cols: 6 }
      ]
    }
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{
        target: 'escape',
        action: this.close
      }]
    })
    /**
     * 사업장 리스트 조회
     */
    itemService.selectOnlyRoomList().then((response) => {
      const data = _.orderBy(response.data, 'storeCd')
      this.storeList = []
      data.map(obj => {
        this.storeList.push({
          storeNm: `${obj.storeNm} (${obj.storeCd})`,
          storeCd: obj.storeCd
        })
      })
    })
    this.search()
  },
  methods: {
    search () {
      this.searchParam.q.saleAdjustYn = 'N'
      this.searchParam.q.calcStndMonth = this.instance.params.calcStndMonth
      saleAdjustService.selectSaleAdjustList(this.searchParam).then(res => {
        this.list = res.data
        this.searchParam.total = res.pagination.total
        // 로딩 stop
        this.isLoading = false
      })
    },
    addSaleAdjust (item) {
      this.$dialog.confirm(`매출조정을 ${this.instance.params.calcStndMonth.substring(0, 4) + '-' + this.instance.params.calcStndMonth.substring(4, 6)}에 매핑 하시겠습니까?`).then(() => {
        item.calcStndMonth = this.instance.params.calcStndMonth
        item.mappingYn = 'Y'
        saleAdjustService.updateSaleAdjustMapping(item).then(res => {
          this.close({ search: true })
          const message = item.pkgYn === 'Y' ? '화면에서 확인 해주세요.' : '월정산 데이터 생성을 다시 해주세요.'
          this.$dialog.alert('매핑되었습니다. ' + message)
        })
      })
    },
    deleteSaleAdjust (item) {
      this.$dialog.confirm(`매출조정을 ${this.instance.params.calcStndMonth.substring(0, 4) + '-' + this.instance.params.calcStndMonth.substring(4, 6)}에 매핑 해제 하시겠습니까?`).then(() => {
        item.mappingYn = 'N'
        saleAdjustService.updateSaleAdjustMapping(item).then(res => {
          this.close({ search: true })
          const message = item.pkgYn === 'Y' ? '화면에서 확인 해주세요.' : '월정산 데이터 생성을 다시 해주세요.'
          this.$dialog.alert('매핑 해제 되었습니다. ' + message)
        })
      })
    }
  }
}
</script>
