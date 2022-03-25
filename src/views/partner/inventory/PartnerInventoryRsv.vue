<template>
  <v-row wrap>
    <app-card :heading="'파트너 재고예약 리스트'" col-classes="col-12">
      <search-form init-search :search-param.sync="searchParam" :search-list="searchList" @search="search" dense></search-form>
      <sticky-table
        :headers="headers"
        :items="list"
        :no-data-text="'검색 결과가 없습니다.'"
        :fixed-column-length="2"
        classes="grab-row"
        dense
      >
        <template v-slot:roomRsvNo="{ item }">
          <span v-if="item.roomRsvNo" @click="openRsv(item)" class="pointer blue--text">
            {{item.roomRsvNo}}
          </span>
          <span v-else>-</span>
        </template>
        <template v-slot:keyRsvNo="{ item }">
          <span v-if="item.keyRsvNo" @click="openRsv(item)" class="pointer blue--text">
            {{item.keyRsvNo}}
          </span>
          <span v-else>-</span>
        </template>
        <template v-slot:autoCancelYn="{ item }">
          <span :class="{ 'red--text': item.autoCancelYn === 'Y' }">{{item.autoCancelYnNm}}</span>
        </template>
        <template v-slot:sendStatusNm="{ item }">
          <span v-if="item.sendStatus === 'S'" @click="openRsv(item)" class="blue--text pointer">
            {{item.sendStatusNm}}
          </span>
          <v-tooltip v-else-if="item.sendStatus === 'E'" bottom z-index="1000">
            <template v-slot:activator="{ on }">
              <span class="red--text pointer" v-on="on">
                {{item.sendStatusNm}}
                <!--<v-icon small>help_outline</v-icon>-->
                <v-icon small>mdi-comment-question-outline</v-icon>
              </span>
            </template>
            <div v-html="item.errMsg"></div>
          </v-tooltip>
          <span v-else>{{item.sendStatusNm}}</span>
        </template>
      </sticky-table>
      <!--<v-data-table v-dragscroll="{target: '.v-data-table__wrapper'}"
                    dense :no-data-text="'검색 결과가 없습니다.'"
                    :headers="headers"
                    :items="list"
                    class="bordered" :class="list.length > 0 ? 'grab-row': ''"
                    disable-sort hide-default-footer disable-pagination>
        <template v-slot:item.roomRsvNo="{ item }">
          <span v-if="item.roomRsvNo" @click="openRsv(item)" class="pointer blue&#45;&#45;text">
            {{item.roomRsvNo}}
          </span>
          <span v-else>-</span>
        </template>
        <template v-slot:item.keyRsvNo="{ item }">
          <span v-if="item.keyRsvNo" @click="openRsv(item)" class="pointer blue&#45;&#45;text">
            {{item.keyRsvNo}}
          </span>
          <span v-else>-</span>
        </template>
        <template v-slot:item.autoCancelYn="{ item }">
          <span :class="{ 'red&#45;&#45;text': item.autoCancelYn === 'Y' }">{{item.autoCancelYnNm}}</span>
        </template>
        <template v-slot:item.sendStatusNm="{ item }">
          <span v-if="item.sendStatus === 'S'" class="pointer blue&#45;&#45;text" @click="openRsv(item)">
            {{item.sendStatusNm}}
          </span>
          <v-tooltip v-else-if="item.sendStatus === 'E'" bottom z-index="1000">
            <template v-slot:activator="{ on }">
              <span class="red&#45;&#45;text pointer" v-on="on">
                {{item.sendStatusNm}}
                &lt;!&ndash;<v-icon small>help_outline</v-icon>&ndash;&gt;
                <v-icon small>mdi-comment-question-outline</v-icon>
              </span>
            </template>
            <div v-html="item.errMsg"></div>
          </v-tooltip>
          <span v-else>{{item.sendStatusNm}}</span>
        </template>
      </v-data-table>-->
      <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
    </app-card>
  </v-row>
</template>

<script>
import partnerInventoryRsvService from '@/api/modules/partner/partnerInventoryRsv.service'
import storeService from '@/api/modules/system/store.service'
import commonService from 'Api/modules/system/commonCode.service'
import StickyTable from 'Components/Common/StickyTable.vue'

export default {
  name: 'PartnerInventoryRsv',
  components: { StickyTable },
  computed: {
    searchList () {
      return [
        { key: 'storeCd', label: '영업장', type: 'select', list: this.storeList, listValue: 'storeCd', listText: 'storeNm', cols: 4 },
        { key: 'rmTypeCd', label: '객실 유형', type: 'select', list: this.rmTypeList, listValue: 'rmTypeCd', listText: 'rmTypeNm', cols: 4 },
        { key: 'ptnrNo', label: '파트너', type: 'partner', cols: 4 },
        { key: 'memNo', label: '회원 번호', type: 'text', cols: 3 },
        { key: 'sendType', label: '전송 타입', type: 'code', commCd: 'OTA0002', cols: 3 },
        { key: 'sendStatus', label: '전송 상태', type: 'code', commCd: 'OTA0001', cols: 3 },
        { key: 'rsvStatus', label: '예약 상태', type: 'select', list: this.rmStatusList, listValue: 'commCd', listText: 'commCdNm', cols: 3 },
        { key: 'crtDt', label: '입력 일자', type: 'date', format: 'YYYYMMDD', cols: 3 },
        { key: 'ciYmd', label: '기준 일자', type: 'dateRange', format: 'YYYYMMDD', startField: 'ciBgnYmd', endField: 'ciEndYmd', cols: 3 },
        { key: 'autoCancelYn', label: '자동취소 건', type: 'boolean', trueValue: 'Y', falseValue: 'N', cols: 3 }
      ]
    }
  },
  data () {
    return {
      storeList: [],
      rmTypeList: [],
      rmStatusList: [],
      searchParam: {
        q: {},
        page: 1,
        size: 20,
        total: 0
      },
      list: [],
      headers: [
        { text: '예약번호(4)', value: 'roomRsvNo', align: 'center' },
        { text: '예약번호', value: 'keyRsvNo', align: 'center' },
        { text: '전송상태', value: 'sendStatusNm', align: 'center' },
        { text: '예약상태', value: 'rsvStatus', align: 'center' },
        { text: '객실 수', value: 'rmCnt', align: 'center' },
        { text: '파트너', value: 'ptnrNm', align: 'center' },
        { text: '영업장', value: 'storeNm', align: 'center' },
        { text: '객실타입', value: 'rmTypeNm', align: 'center' },
        { text: '기준일자', value: 'ciYmdDate', align: 'center' },
        { text: '회원번호', value: 'memNo', align: 'center' },
        { text: '대매사', value: 'agentNm', align: 'center' },
        { text: '전송타입', value: 'sendTypeNm', align: 'center' },
        { text: '입력일자', value: 'crtDate', align: 'center' },
        { text: '자동취소', value: 'autoCancelYn', align: 'center' }
      ]
    }
  },
  async mounted () {
    try {
      const store = await storeService.selectStoreSimpleList()
      this.storeList = store.data
      const rmType = await storeService.selectRmTypeSimpleList()
      this.rmTypeList = rmType.data
      const rmStatus = await commonService.selectDGNSCommonCodeList('RSV0093')
      this.rmStatusList = rmStatus.data
    } catch (e) {}
  },
  methods: {
    async search () {
      try {
        const res = await partnerInventoryRsvService.selectPartnerInventoryRsvList(this.searchParam)
        this.list = res.data
        this.searchParam.total = res.pagination.total
      } catch (e) {}
    },
    openRsv (item) {
      if (item.keyRsvNo) {
        this.$store.dispatch('dialog/open', {
          componentPath: '/SearchDialog/ReservationSearch',
          params: {
            keyRsvNo: item.keyRsvNo
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
}
</script>
