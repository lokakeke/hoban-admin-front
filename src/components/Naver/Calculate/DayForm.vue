<template>
  <dialog-base :instance="instance" :title="`일정산 상세정보`">
    <v-card-text class="pa-0">
      <search-form
        class="search-form"
        init-search
        :search-param.sync="searchParam"
        :search-list="searchList"
        :is-exist="false" @search="search" excel @export="exportExcel('excelDtl')">
      </search-form>
      <v-row>
        <v-col>
          <v-data-table
            v-dragscroll="{target: '.v-data-table__wrapper'}"
            :no-data-text="emptyText" :headers="headers"
            :items="list" item-key="dayCalcDtlNo"
            hide-default-footer
            disable-pagination
            disable-sort
            :loading="isLoading"
            class="bordered">
            <template v-slot:item.calcStndDate="{item}">
              {{ item.calcStndDate | date }}
            </template>
            <template v-slot:item.payAmt="{item}">
              {{ item.payAmt | price }}
            </template>
            <template v-slot:item.payCmsn="{item}">
              {{ item.payCmsn | price }}
            </template>
            <template v-slot:item.totalCmsn="{item}">
              {{ item.totalCmsn | price }}
            </template>
            <template v-slot:item.saleIfCmsn="{item}">
              {{ item.saleIfCmsn | price }}
            </template>
            <template v-slot:item.netAmt="{item}">
              {{ item.netAmt | price }}
            </template>
            <template v-slot:item.taxAmt="{item}">
              {{ item.taxAmt | price }}
            </template>
            <template v-slot:item.rcpmnyAmt="{item}">
              {{ item.rcpmnyAmt | price }}
            </template>
            <template v-slot:item.ind>
              네이버
            </template>
            <template v-slot:item.storeDstbNo="{item}">
              {{ item.storeDstb ? item.storeDstb.split('/')[1] : '' }}
            </template>
            <template v-slot:item.storeDstb="{item}">
              {{ item.storeDstb ? item.storeDstb.split('/')[0] : '' }}
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
import excelMixin from "Mixins/excelMixin"
import DialogBase from "@/components/Dialog/DialogBase"
import service from "Api/modules/naver/calculateDay.service"

export default {
  extends: DialogBase,
  name: 'DayForm',
  mixins: [excelMixin],
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
        { text: '승인일자', value: 'calcStndDate', align: 'center' },
        { text: '결제금액', value: 'payAmt', align: 'center' },
        { text: '결제수수료', value: 'payCmsn', align: 'center' },
        { text: '매출연동수수료', value: 'saleIfCmsn', align: 'center' },
        { text: '총수수료', value: 'totalCmsn', align: 'center' },
        { text: '공급가액', value: 'netAmt', align: 'center' },
        { text: '세액', value: 'taxAmt', align: 'center' },
        { text: '입금액', value: 'rcpmnyAmt', align: 'center' },
        { text: '결제구분', value: 'paymentMethod', align: 'center' },
        { text: '구매자', value: 'purName', align: 'center' },
        { text: '사업장', value: 'storeName', align: 'center' },
        { text: '상품명', value: 'naverItemName', align: 'center' },
        { text: '정산일자', value: 'calcStndDate', align: 'center' },
        { text: '구분', value: 'ind', align: 'center' },
        { text: '순서', value: 'storeDstbNo', align: 'center' },
        { text: '사업장배분', value: 'storeDstb', align: 'center' },
        { text: '주문번호', value: 'bookingId', align: 'center' },
        { text: '거래상태', value: 'dealStatus', align: 'center' }
      ],
      isLoading: true,
      dealStatusList: [
        { text: '정산', value: '정산' },
        { text: '위약정산', value: '위약정산' }
      ]
    }
  },
  computed: {
    /**
     * 검색기능
     */
    searchList () {
      return [
        {
          key: 'useYmdDtl',
          type: 'date',
          label: '정산기준일',
          format: 'YYYYMMDD',
          defaultValue: this.instance.params.form.calcStndDate,
          cols: 3
        },
        { key: 'storeDstb', label: '사업장배분', type: 'text', cols: 3 },
        { key: 'bookingId', label: '주문번호', type: 'text', cols: 3 },
        { key: 'purName', label: '구매자', type: 'text', cols: 3 },
        { key: 'storeName', label: '사업장', type: 'text', cols: 4 },
        { key: 'naverItemName', label: '상품명', type: 'text', cols: 4 },
        { key: 'dealStatus', label: '거래상태', type: 'select', list: this.dealStatusList, cols: 4 }
      ]
    }
  },
  methods: {
    search () {
      this.searchParam.q.dayCalcMstNo = this.instance.params.form.dayCalcMstNo
      service.selectCalculateDayDtl(this.searchParam).then(res => {
        this.list = res.data
        this.searchParam.total = res.pagination.total
        // 로딩 stop
        this.isLoading = false
      })
    },
    /**
     * 엑셀 다운로드
     */
    exportExcel (value) {
      this.searchParam.q.dayCalcMstNo = this.instance.params.form.dayCalcMstNo
      this.searchParam.q.calcAprlYn = null // 개별 다운로드는 승인여부에 관계없으므로 null
      this.downLoadExcel(`/api/naver/calculate/${value}`, `(주) 소노호텔앤리조트_일정산${value === 'excelMst' ? '' : '_상세'}`, this.searchParam, '.csv')
    }
  }
}
</script>

<style>
  .v-data-table__wrapper {
    cursor : grab;
  }
  .v-data-table__wrapper:active {
    cursor : grabbing;
  }
</style>
