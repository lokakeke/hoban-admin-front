<template>
  <v-row>
    <app-card :heading="'파트너 재고 상세할당'" col-classes="col-12">
      <v-form ref="form" lazy-validation autocomplete="off">
      <v-row align="end">
        <v-col cols="6" class="pt-0">
          <p class="pb-0 mb-0">국내 O.T.A 객실유형 관리중 영업장</p>
          <v-autocomplete
            v-model="form.storeCd"
            :items="storeList"
            item-value="storeCd"
            item-text="storeNm"
            placeholder="영업장을 선택해 주세요." />
        </v-col>
        <v-col cols="6" class="pt-0">
          <v-row no-gutters>
            <v-col cols="5">
              <p class="pb-0 mb-0 mt-1">기준 일자<small class="font-weight-bold info--text ml-2">( * 최대 30일 )</small></p>
              <date-range-picker
                v-model="form.selectDate"
                :min="minDate"
                :max="maxDate"
                format="YYYY-MM-DD"
                required />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" class="text-right pt-0">
          <v-btn outlined rounded color="primary" @click="viewInventory">
            <v-icon left>search</v-icon>
            전지역 객실 현황  (F2)
          </v-btn>
          <v-btn outlined rounded color="info" @click="search">
            <v-icon left>search</v-icon>
            검색 (F3)
          </v-btn>
        </v-col>
      </v-row>
      </v-form>
      <v-divider></v-divider>
      <p class="mb-2 info--text">* 파트너 재고관리 중인 영업장, 객실타입, 판매중 일자 의 재고만 예약 가능합니다.</p>
      <v-simple-table
        v-dragscroll="{target: '.v-data-table__wrapper'}"
        class="bordered"
        :class="list.length > 0 ? 'grab-row': ''"
        dense
        :fixed-header="list.length > 0"
        :height="list.length > 1 ? 550: 'auto'">
        <thead>
          <tr>
            <th class="text-center bottom-border">영업장</th>
            <th class="text-center bottom-border">객실유형</th>
            <th class="text-center bottom-border">객실유형명</th>
            <th class="text-center bottom-border" v-for="date of dateList" :key="date.date" :class="date.class">{{date.label}}</th>
          </tr>
        </thead>
        <tbody v-if="!list || list.length === 0">
          <tr>
            <td :colspan="3 + dateList.length" class="text-center py-2">데이터가 없습니다.</td>
          </tr>
        </tbody>
        <tbody v-else>
          <template v-for="(store, storeIndex) of list">
            <tr v-for="(rmType, index) of store.rmTypeList" :key="store.storeCd + '_' + rmType.rmTypeCd">
              <th v-if="index === 0" :rowspan="store.rmTypeList.length" class="text-center" :class="(storeIndex + 1) !== list.length? 'bottom-border' : ''">
                <span v-html="store.storeNm"></span>
                <div class="font-weight-bold">( {{store.storeCd}} )</div>
              </th>
              <td class="text-center" :class="(index + 1) === store.rmTypeList.length? 'bottom-border' : ''">{{rmType.rmTypeCd}}</td>
              <td class="text-center" :class="(index + 1) === store.rmTypeList.length? 'bottom-border' : ''">{{rmType.rmTypeNm}}</td>
              <!--<td class="text-right"></td>-->
              <td v-for="date of rmType.dateList" :key="store.storeCd + '_' + rmType.rmTypeCd + '_' + date.date" :class="(index + 1) === store.rmTypeList.length? 'bottom-border' : ''">
                <v-row justify="end" class="px-1" :class="[date.color + '--text', date.color === 'blue'? 'pointer': '']" @click="popDetailSet(date, store, rmType)">
                  {{date.value | price}}
                </v-row>
              </td>
            </tr>
          </template>
        </tbody>
      </v-simple-table>
      <div class="mt-5">
        <partner-inventory-detail-set-daily v-model="select" :partner-origin="partnerOrigin" @refresh="search(true)"></partner-inventory-detail-set-daily>
      </div>
    </app-card>
  </v-row>
</template>

<script>
import partnerInventoryRateService from '@/api/modules/partner/partnerInventoryRate.service'
import PartnerInventoryDetailSetDaily
  from 'Components/Partner/Inventory/PartnerInventoryDetailSet/PartnerInventoryDetailSetDaily.vue'
import storeService from 'Api/modules/system/store.service'
import blockService from 'Api/modules/common/block.service'

export default {
  name: 'PartnerInventoryDetailSet',
  components: { PartnerInventoryDetailSetDaily },
  data () {
    return {
      form: {
        storeCd: '',
        selectDate: [moment().format('YYYY-MM-DD'), moment().add(10, 'days').format('YYYY-MM-DD')],
        rsvBlckCd: '104', // 104 블럭 셋팅
        onlyPartnerRmType: 'Y' // 파트너 관리중인 영업장/객실만 셋팅하도록
      },
      list: [],
      storeList: [],
      dateList: [],
      partnerOrigin: [],
      minDate: moment().format('YYYY-MM-DD'),
      /**
       * 선택 데이터
       */
      select: null
    }
  },
  computed: {
    maxDate () {
      // 최대 일자 선택일 후 30일까지
      if (this.form.selectDate && this.form.selectDate[0]) {
        return moment(this.form.selectDate[0]).add(30, 'days').format('YYYY-MM-DD')
      } else {
        return undefined
      }
    }
  },
  async mounted () {
    // 영업장 조회
    const store = await storeService.selectPartnerInventoryStoreList()
    const storeAll = [{ storeCd: '', storeNm: '전체' }]
    this.storeList = storeAll.concat(store.data)
    // 전체 파트너 리스트 조회
    const res = await partnerInventoryRateService.selectPartnerInventoryRateList()
    this.partnerOrigin = res.data.managementList.concat(res.data.noneManagementList)
  },
  methods: {
    async search (isRefresh) {
      try {
        // form valid
        await this.validForm(this.$refs.form)
        await this.validDateRange(this.form.selectDate, '기준일자를 선택해 주세요.')
        // 조회
        const res = await blockService.selectBlockInventoryList(this.makeDateList())
        this.list = res.data
        if (isRefresh) {
          // 선택된 데이터 초기화
          this.select = null
        }
      } catch (e) {}
    },
    makeDateList () {
      const startDate = moment(this.form.selectDate[0])
      const endDate = moment(this.form.selectDate[1])
      const searchDay = endDate.diff(startDate, 'days') + 1
      const dateList = []
      for (let begin = 0; begin < searchDay; begin++) {
        const date = moment(startDate).add(begin, 'days')
        const day = date.day()
        dateList.push({ date: date.format('YYYY-MM-DD'), class: day === 0 ? 'red--text' : day === 6 ? 'blue--text' : 'black--text', label: date.format('MM/DD(ddd)') })
      }
      this.dateList = dateList
      return {
        q: {
          storeCd: this.form.storeCd,
          rsvBlckCd: this.form.rsvBlckCd,
          onlyPartnerRmType: this.form.onlyPartnerRmType,
          ciYmd: moment(startDate).format('YYYYMMDD'),
          searchDay
        }
      }
    },
    viewInventory () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/InventorySearch',
        params: {},
        options: {
          fullscreen: false,
          scrollable: true,
          width: 1200
        }
      })
    },
    popDetailSet (data, store, rmType) {
      if (data.value && !isNaN(data.value) && parseInt(data.value) > 0) {
        this.select = {
          storeCd: store.storeCd,
          storeNm: store.storeNm,
          rmTypeCd: rmType.rmTypeCd,
          rmTypeNm: rmType.rmTypeNm,
          stockQty: data.value,
          date: moment(data.date).format('YYYY-MM-DD'),
          rsvBlckCd: '104'
        }
        /* this.$store.dispatch('dialog/open', {
          componentPath: '/Partner/Inventory/PartnerInventoryDetailSet/PartnerInventoryDetailSetDailyDialog',
          params: {
            select: {
              storeCd: store.storeCd,
              storeNm: store.storeNm,
              rmTypeCd: rmType.rmTypeCd,
              rmTypeNm: rmType.rmTypeNm,
              stockQty: data.value,
              date: moment(data.date).format('YYYY-MM-DD'),
              rsvBlckCd: '104'
            },
            partnerOrigin: this.partnerOrigin
          },
          options: {
            fullscreen: false,
            scrollable: true,
            width: 1000,
            closeCallback: (params) => {
              if (params && params.search) {
                this.search()
              }
            }
          }
        }) */
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
    background-color: #fafafa;
  }
  td.bottom-border, th.bottom-border {
    border-bottom: #009688 solid 2px!important;
  }
</style>
