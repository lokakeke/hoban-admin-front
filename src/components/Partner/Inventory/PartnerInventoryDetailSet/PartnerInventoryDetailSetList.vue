<template>
  <v-row>
    <v-col cols="6" class="pr-3">
      <v-row align="start" no-gutters>
        <v-col cols="5">
          <p class="mb-0 font-weight-bold title primary--text">* 예약블럭 기준정보</p>
        </v-col>
        <v-col cols="2">
          <v-checkbox v-model="available" label="재고있음" class="mt-0" hide-details></v-checkbox>
        </v-col>
        <v-col cols="5" class="pt-0 pb-1">
          <v-text-field v-model="keyword" hide-details single-line outlined small dense append-icon="mdi-magnify" label="Search" clearable autocomplete="off" />
        </v-col>
      </v-row>
      <v-simple-table dense fixed-header :height="600" class="bordered detail-table">
        <thead>
        <tr>
          <th class="text-center">영업장</th>
          <th class="text-center">영업장명</th>
          <th class="text-center">블럭</th>
          <th class="text-center">객실유형</th>
          <th class="text-center">기준일자</th>
          <th class="text-center px-1">잔여재고</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item of list" :key="item.storeCd + item.rmTypeCd + item.date"
            class="pointer" :class="checkSelect(item)" @click="show(item)">
          <td class="text-center">{{item.storeCd}}</td>
          <td class="text-left">{{item.storeNm | textTruncate(30)}}</td>
          <td class="text-center">{{item.rsvBlckCd}}</td>
          <td class="text-left">{{item.rmTypeNm | textTruncate(20)}} - <small>{{item.rmTypeCd}}</small></td>
          <td class="text-center">{{item.date}}</td>
          <td class="text-right pr-2" :class="item.color + '--text'">{{item.stockQty}}</td>
        </tr>
        <tr v-if="list.length === 0">
          <td colspan="6" class="text-center font-weight-bold" style="height: 50px">예약블럭 기준정보 데이터가 없습니다.</td>
        </tr>
        </tbody>
      </v-simple-table>
    </v-col>
    <v-col cols="6" class="pl-0">
      <partner-inventory-detail-set-daily v-model="select" :partner-origin="partnerOrigin" @refresh="search(true)"></partner-inventory-detail-set-daily>
    </v-col>
  </v-row>
</template>

<script>
import partnerInventoryDetailSetService from '@/api/modules/partner/partnerInventoryDetailSet.service'
import PartnerInventoryDetailSetDaily
  from 'Components/Partner/Inventory/PartnerInventoryDetailSet/PartnerInventoryDetailSetDaily.vue'

export default {
  components: { PartnerInventoryDetailSetDaily },
  props: {
    value: {
      type: Object,
      required: true
    },
    // 객실이용 파트너 비율리스트
    partnerOrigin: {
      type: Array,
      required: true
    }
  },
  name: 'PartnerInventoryDetailSetList',
  data () {
    return {
      /**
       * 검색결과 리스트
       */
      origin: [],
      /**
       * 선택 데이터
       */
      select: null,
      // 검색 키워드
      keyword: '',
      // 재고수 0 이상
      available: false
    }
  },
  computed: {
    list () {
      const keyword = (this.keyword || '').toLowerCase().replace(/\s/gi, '')
      return this.origin.filter(data =>
        (this.available ? data.stockQty > 0 : true) &&
        (
          (data.storeNm || '').toLowerCase().replace(/\s/gi, '').indexOf(keyword) > -1 ||
          (data.storeCd || '').toLowerCase().replace(/\s/gi, '').indexOf(keyword) > -1 ||
          (data.rmTypeNm || '').toLowerCase().replace(/\s/gi, '').indexOf(keyword) > -1 ||
          (data.rmTypeCd || '').toLowerCase().replace(/\s/gi, '').indexOf(keyword) > -1 ||
          (data.date || '').toLowerCase().replace(/\s/gi, '').indexOf(keyword) > -1
        )
      )
    }
  },
  async mounted () {
    // 리스트 검색
    await this.search()
  },
  methods: {
    async search (isRefresh) {
      try {
        const param = {
          storeCd: this.value.storeCd || null,
          startDate: this.value.selectDate[0],
          endDate: this.value.selectDate[1]
        }
        const res = await partnerInventoryDetailSetService.selectPartnerInventoryDetailSetList(param)
        this.origin = res.data
        if (isRefresh) {
          // 선택된 데이터 를 다시 맵핑해준다.
          this.show(this.origin.find(data => data.storeCd === this.select.storeCd &&
            data.rmTypeCd === this.select.rmTypeCd &&
            data.date === this.select.date
          ))
        }
      } catch (e) {}
    },
    /**
     * 블럭 데이터 선택
     * @param item 블럭 데이터
     */
    show (item) {
      this.select = item
    },
    /**
     * 선택된 데이터 back ground 색상 처리
     * @param item
     */
    checkSelect (item) {
      if (this.select && this.select.storeCd === item.storeCd && this.select.rmTypeCd === item.rmTypeCd && this.select.date === item.date) {
        return 'teal lighten-4'
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped>
.theme--light.v-data-table.v-data-table--fixed-header.detail-table thead th {
  background-color: #009688;
  color: #FFFFFF!important;
}
.detail-table td, .detail-table  th {
  padding-left: 3px!important;
  padding-right: 3px!important;
  font-size: 12px!important;
}
</style>
