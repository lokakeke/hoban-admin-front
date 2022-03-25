<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <v-icon left>search</v-icon> 전지역 객실 현황
    </template>
    <search-form :search-param.sync="searchParam" :search-list="searchList" @search="search" disable-pagination>
      <template v-slot:buttons="{ data, emit }">
        <v-btn color="info" rounded outlined @click="changeYmd(true, data, emit)">
          <v-icon left>chevron_left</v-icon>이전 10일
        </v-btn>
        <v-btn color="info" rounded outlined @click="changeYmd(false, data, emit)">
          <v-icon left>chevron_right</v-icon>다음 10일
        </v-btn>
      </template>
    </search-form>
    <v-simple-table
        v-dragscroll="{target: '.v-data-table__wrapper'}"
        class="bordered"
        :class="list.length > 0 ? 'grab-row': ''"
        dense
        :fixed-header="list.length > 0"
        :height="list.length > 17 ? 550: 'auto'">
      <thead>
      <tr>
        <th class="text-center">영업장</th>
        <th class="text-center">영업장명</th>
        <th class="text-center">객실유형</th>
        <th class="text-center">객실유형명</th>
        <!--<th class="text-center">운영</th>-->
        <th class="text-center" v-for="date of dateList" :key="date.date" :class="date.class">{{date.label}}</th>
      </tr>
      </thead>
      <tbody v-if="!list || list.length === 0">
      <tr>
        <td :colspan="5 + dateList.length" class="text-center py-2">데이터가 없습니다.</td>
      </tr>
      </tbody>
      <tbody v-else>
      <template v-for="store of list">
        <tr v-for="(rmType, index) of store.rmTypeList" :key="store.storeCd + '_' + rmType.rmTypeCd">
          <th v-if="index === 0" :rowspan="store.rmTypeList.length" class="text-center">{{store.storeCd}}</th>
          <th v-if="index === 0" :rowspan="store.rmTypeList.length" class="text-center" v-html="store.storeNm"></th>
          <td class="text-center">{{rmType.rmTypeCd}}</td>
          <td class="text-center">{{rmType.rmTypeNm}}</td>
          <!--<td class="text-right"></td>-->
          <td class="text-right" v-for="date of rmType.dateList" :key="store.storeCd + '_' + rmType.rmTypeCd + '_' + date.date">{{date.value | price}}</td>
        </tr>
      </template>
      </tbody>
    </v-simple-table>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import storeService from 'Api/modules/system/store.service'
import blockService from 'Api/modules/common/block.service'
import roomService from 'Api/modules/ota/roomReservation.service'

export default {
  extends: DialogBase,
  name: 'InventorySearch',
  data () {
    return {
      searchParam: {
        q: {}
      },
      list: [],
      storeList: [],
      blockList: [],
      dateList: [],
      searchDay: 10
    }
  },
  computed: {
    searchList () {
      return [
        { key: 'ciYmd', label: '기준 일자 ( ~ 10일 )', type: 'date', required: true, cols: 3, defaultValue: moment().format('YYYYMMDD') },
        { key: 'storeCd', label: '영업장 ( 미선택 시 전체 영업장 )', type: 'select', list: this.storeList, listValue: 'storeCd', listText: 'storeNm', cols: 6 },
        { key: 'rsvBlckCd', label: '예약 블럭', type: 'select', list: this.blockList, listValue: 'rsvBlckCd', listText: 'label', required: true, cols: 3, defaultValue: '104' }
      ]
    }
  },
  mounted () {
    // 영업장 조회
    storeService.selectStoreSimpleList().then(res => {
      this.storeList = res.data
    })
    // 블럭 리스트 조회
    roomService.selectRsvBlockInfo({}).then(res => {
      for (const block of res.data) {
        block.label = block.rsvBlckCdNm + ' ( ' + block.rsvBlckCd + ' )'
      }
      this.blockList = res.data
    })
  },
  methods: {
    /**
     * 이전 / 다음 2주 데이터 조회
     * @param isPrev 이전/다음 여부
     * @param list searchForm list
     * @param emit searchForm emit
     */
    changeYmd (isPrev = true, list = [], emit = () => {}) {
      // 이전, 다음 2주 계산 후 emit
      const ciYmd = list.filter(data => data.key === 'ciYmd')[0].value
      let calculateYmd
      if (isPrev) {
        calculateYmd = moment(ciYmd).add(-10, 'days').format('YYYYMMDD')
      } else {
        calculateYmd = moment(ciYmd).add(+10, 'days').format('YYYYMMDD')
      }
      list.filter(data => data.key === 'ciYmd')[0].value = calculateYmd
      emit()
    },
    async search () {
      try {
        // 조회
        const res = await blockService.selectBlockInventoryList(this.searchParam)
        this.makeDateList()
        this.list = res.data
      } catch (e) {}
    },
    makeDateList () {
      if (this.searchParam.q.ciYmd) {
        const dateList = []
        for (let begin = 0; begin < this.searchDay; begin++) {
          const date = moment(this.searchParam.q.ciYmd).add(begin, 'days')
          const day = date.day()
          dateList.push({ date: date.format('YYYY-MM-DD'), class: day === 0 ? 'red--text' : day === 6 ? 'blue--text' : 'black--text', label: date.format('MM/DD(ddd)') })
        }
        this.dateList = dateList
      } else {
        this.dateList = []
      }
    }
  }
}
</script>

<style scoped>
  thead tr th {
    background-color: #EEEEEE!important;
    font-weight: 600;
  }
  tbody tr th {
    background-color: #FFFFFF;
  }
</style>
