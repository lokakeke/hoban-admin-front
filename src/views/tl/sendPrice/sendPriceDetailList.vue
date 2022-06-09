<template>
  <div>
    <search-form ref="SearchForm" :search-param.sync="searchParam" :search-list.sync="searchList" @search="search"></search-form>
    <v-data-table disable-pagination
                  disable-sort
                  hide-default-footer
                  :no-data-text="'데이터가 없습니다.'" :headers="headers" item-key="sendDetailNo"
                  :items="list" class="condensed bordered">
      <template v-slot:item="props">
        <template v-for="(priceInfo, index) in props.item.sendPricePersonDetailList">
          <tr :class="props.item.sendStatus === '9' ? 'red lighten-2': ''">
            <td v-if="index === 0" :rowspan="props.item.sendPricePersonDetailList.length" class="text-xs-center">{{ getYmdToDateFormat(props.item.stndYmd) }}</td>
            <td v-if="index === 0" :rowspan="props.item.sendPricePersonDetailList.length" class="text-xs-center">{{ props.item.sendStatusName }}</td>
            <td v-if="index === 0" :rowspan="props.item.sendPricePersonDetailList.length" class="text-xs-center">{{ props.item.planGroupName }} ( {{ props.item.planGroupCode }} )</td>
            <td v-if="index === 0" :rowspan="props.item.sendPricePersonDetailList.length" class="text-xs-center">{{ props.item.sellStatus === '1' ? '판매' : (props.item.sellStatus === '2' ? '중지' : '판매상태 변경 안함') }}</td>
            <td class="text-xs-center">{{ priceInfo.personCount }} 명</td>
            <td class="text-xs-center">{{ getPriceValue(priceInfo.sendPrice) }}</td>
            <td class="text-xs-center">{{ getPriceValue(priceInfo.roomPrice) }}</td>
            <td class="text-xs-center">{{ getPriceValue(priceInfo.breakfastPrice) }}</td>
            <td v-if="index === 0" :rowspan="props.item.sendPricePersonDetailList.length" class="text-xs-center">{{ dateSet(props.item.createDatetime) }}</td>
            <td v-if="index === 0" :rowspan="props.item.sendPricePersonDetailList.length" class="text-xs-center">{{ props.item.errorCd }}</td>
            <td v-if="index === 0" :rowspan="props.item.sendPricePersonDetailList.length" class="text-xs-center">{{ props.item.errorMsg }}</td>
          </tr>
        </template>
      </template>
    </v-data-table>
    <!-- 페이징 -->
    <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
  </div>
</template>

<script>
import sendPriceService from '@/api/modules/tl/sendPrice.service'
import moment from 'moment'

export default {
  props: ['dialog', 'sendNo'],
  name: 'sendPriceDetailList',
  data() {
    return {
      expand: false,
      reset: false,
      form: {},
      list: [],
      searchParam: {
        q: {},
        page: 1,
        size: 20,
        total: 0
      },
      headers: [
        { text: '기준일', value: 'stndYmd', align: 'center' },
        { text: '전송상태', value: 'sendStatus', align: 'center' },
        { text: '플랜그룹명', value: 'planGroupName', align: 'center' },
        { text: '판매상태', value: 'sellStatus', align: 'center' },
        { text: '인원', value: 'personCount', align: 'center' },
        { text: '전송금액', value: 'sendPrice', align: 'center' },
        { text: '객실요금', value: 'roomPrice', align: 'center' },
        { text: '조식금액', value: 'breakfastPrice', align: 'center' },
        { text: '등록일', value: 'createDatetime', align: 'center' },
        { text: '에러 코드', value: 'errorCd', align: 'center' },
        { text: '에러 메시지', value: 'errorMsg', align: 'center' }
      ],
      sendStatusList: [
        { status: 'R', statusName: '전송대기' },
        { status: 'S', statusName: '전송성공' },
        { status: 'F', statusName: '전송실패' }
      ]
    }
  },
  watch: {
    dialog: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.selectDetail(this.sendNo, this.searchParam)
        } else if (this.$refs.SearchForm) {
          this.resetSearchParam()
        }
      }
    }
  },
  computed: {
    searchList() {
      return [
        {
          key: 'sendStatus',
          label: '전송 상태',
          type: 'select',
          list: this.sendStatusList,
          listValue: 'status',
          listText: 'statusName'
        },
        { key: 'stndYmd', label: '기준일', type: 'date', format: 'YYYYMMDD' }
      ]
    }
  },
  methods: {
    selectDetail(sendNo, searchParam) {
      this.form = {}
      this.list = []
      sendPriceService.selectDetail(sendNo, searchParam).then(res => {
        this.form = res.data
        this.list = res.data
        this.searchParam.total = res.pagination.total
      })
    },
    resetSearchParam() {
      this.reset = true
      this.$refs.SearchForm.emit(true)
      this.reset = false
    },
    search() {
      if (!this.reset) {
        this.selectDetail(this.sendNo, this.searchParam)
      }
    },
    getYmdToDateFormat(ymd) {
      return moment(ymd, 'YYYYMMDD').locale('ko').format('YYYY-MM-DD(dd)')
    },
    dateSet(value, currFormat = moment.defaultFormat, format = 'YYYY.MM.DD HH:mm:ss') {
      if (!value) {
        return '-'
      } else if (!moment(value, currFormat).isValid()) {
        return '날짜 형식이 맞지 않습니다.'
      }
      return moment(value, currFormat).format(format)
    },
    getPriceValue(value) {
      return this.$options.filters.price(value)
    }
  }
}
</script>
