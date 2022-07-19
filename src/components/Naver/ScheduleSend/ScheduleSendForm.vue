<template>
  <dialog-base :instance="instance" :title="`전송이력 상세정보`">
    <template v-slot:buttons>
      <v-btn dark text @click="close()">
        <v-icon left>check</v-icon>
        확인
      </v-btn>
    </template>
    <v-card-text class="pa-0">
      <search-form
        init-search
        :search-param.sync="searchParam"
        :search-list="searchList"
        v-if="searchVal.itemIds.length > 0 && searchVal.sorts.length > 0 && searchVal.weekdays.length > 0"
        @search="search"></search-form>
      <v-row>
        <v-col cols="12" class="pb-0">
          <v-data-table
            v-dragscroll="{target: '.v-data-table__wrapper'}"
            :no-data-text="emptyText" :headers="headers"
            :items="list" item-key="sendDtlNo"
            hide-default-footer
            disable-pagination
            disable-sort
            class="bordered">
            <template v-slot:item.updDt="{item}">
              {{ item.updDt | dateSet }}
            </template>
            <template v-slot:item.isBusinessDay="{item}">
              {{ item.isBusinessDay === 'Y' ? '판매' : '휴무' }}
            </template>
            <template v-slot:item.stock="{item}">
              {{ item.stock | price }}
            </template>
            <template v-slot:item.remainStock="{item}">
              {{ item.remainStock | price }}
            </template>
            <template v-slot:item.price="{item}">
              {{ item.price | price }}
            </template>
            <template v-slot:item.packageYn="{item}">
              {{ item.packageYn === 'Y' ? '패키지' : '객실' }}
            </template>
            <template v-slot:item.crtId="{item}">
              {{ item.crtId || 'SYSTEM' }}
            </template>
            <template v-slot:item.crtDt="{item}">
              {{ item.crtDt | dateSet }}
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
import service from '@/api/modules/naver/scheduleSend.service'
import DialogBase from '@/components/Dialog/DialogBase.vue'
import itemService from '@/api/modules/naver/item.service'

export default {
  extends: DialogBase,
  name: 'ScheduleSendForm',
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
        { text: '순번', value: 'rnum', align: 'center', sortable: false },
        { text: '전송번호', value: 'sendNo', align: 'center', sortable: false },
        { text: '서비스ID', value: 'businessId', align: 'center', sortable: false },
        { text: '서비스명', value: 'serviceName', align: 'center', sortable: false },
        { text: '상품명', value: 'name', align: 'center', sortable: false },
        { text: '영업장코드', value: 'storeCode', align: 'center', sortable: false },
        { text: '객실타입코드', value: 'roomTypeCode', align: 'center', sortable: false },
        { text: '패키지여부', value: 'packageYn', align: 'center', sortable: false },
        { text: '회원번호/패키지번호', value: 'mid', align: 'center', sortable: false },
        { text: '블럭코드', value: 'blockCode', align: 'center', sortable: false },
        { text: '네이버상품ID', value: 'bizItemId', align: 'center', sortable: false },
        { text: '네이버스케줄ID', value: 'scheduleId', align: 'center', sortable: false },
        { text: '스케줄생성시작일', value: 'startDate', align: 'center', sortable: false },
        { text: '스케줄생성종료일', value: 'endDate', align: 'center', sortable: false },
        { text: '반복요일', value: 'weekdays', align: 'center', sortable: false },
        { text: '공휴일여부', value: 'isHoliday', align: 'center', sortable: false },
        { text: '판매여부', value: 'isBusinessDay', align: 'center', sortable: false },
        { text: '재고', value: 'stock', align: 'center', sortable: false },
        { text: '잔여재고', value: 'remainStock', align: 'center', sortable: false },
        { text: '가격', value: 'price', align: 'center', sortable: false },
        { text: '오늘의달할인률', value: 'todayDealRate', align: 'center', sortable: false },
        { text: '스케줄설명', value: 'scheduleDesc', align: 'center', sortable: false },
        { text: '관리자', value: 'crtId', align: 'center', sortable: false },
        { text: '전송날짜', value: 'crtDt', align: 'center', sortable: false }
      ],
      /**
       * 검색
       */
      searchVal: {
        sorts: [],
        weekdays: [],
        itemIds: []
      }
    }
  },
  computed: {
    /**
     * 검색기능
     */
    searchList () {
      return [
        { key: 'roomTypeCode', label: '객실타입코드', type: 'text', cols: 4 },
        { key: 'blockCode', label: '블럭코드', type: 'text', cols: 4 },
        { key: 'mid', label: '회원/패키지번호', type: 'text', cols: 4 },
        { key: 'sorts', label: '정렬', type: 'select', list: this.searchVal.sorts, listValue: 'value', listText: 'text', cols: 4 },
        { key: 'itemIds', label: '상품명', type: 'select', list: this.searchVal.itemIds, listValue: 'value', listText: 'text', cols: 4 },
        { key: 'weekdays', label: '반복요일', type: 'selectMulti', list: this.searchVal.weekdays, listValue: 'text', listText: 'text', cols: 4 }
      ]
    }
  },
  methods: {
    /**
     * 조회
     */
    search () {
      for (const key in this.searchParam.q) {
        if (key === 'weekdays') {
          this.searchParam.q[key] = _.join(this.searchParam.q[key], ',')
        }
      }
      service.selectScheduleSendDtlList(this.instance.params.form.sendNo, this.searchParam).then(res => {
        this.list = res.data
        this.searchParam.total = res.pagination.total
      })
    },
    /**
     * 검색기준 세팅
     */
    getSearchVal () {
      service.selectSearchList('dtl').then(response => {
        response.data.forEach(item => {
          this.searchVal[item.code].push(item)
        })
      })
      // 객실 검색요소
      const param = {
        storeId: this.instance.params.form.storeId,
        filterItem: 'Y',
        isImp: 'Y'
      }
      itemService.selectItemList(param).then(res => {
        const itemNameList = []
        res.data.forEach(e => {
          itemNameList.push({
            code: 'itemId',
            text: e.name,
            value: e.bizItemId
          })
        })
        this.searchVal.itemIds = itemNameList
      })
    }
  },
  mounted () {
    this.getSearchVal()
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
