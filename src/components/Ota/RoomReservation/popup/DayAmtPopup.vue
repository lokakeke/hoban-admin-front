<template>
  <dialog-base :instance="instance" :title="'일별 요금'">
    <v-data-table
      disable-pagination fixed-header dense :no-data-text="'검색 결과가 없습니다.'" :headers="headers" :items="dayAmtList" hide-default-footer class="click-row bordered">
      <template v-slot:item.creditPrice="{item}">{{item.creditPrice | price}}원</template>
      <template v-slot:item.salePrice="{item}">{{item.salePrice | price}}원</template>
    </v-data-table>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'DayAmtPopup',
  data () {
    return {
      headers: [
        {
          text: '날짜(요일)',
          value: 'date',
          align: 'center',
          sortable: false
        },
        {
          text: '입금금액',
          value: 'creditPrice',
          align: 'center',
          format: '###,###,###',
          sortable: false
        },
        {
          text: '판매금액',
          value: 'salePrice',
          align: 'center',
          format: '###,###,###',
          sortable: false
        }
      ],
      dayAmtList: [], // 가공된 일별요금 목록
      dayAmtListCopy: [], // 기존 일별요금 목록
      isBefore: true // 예약 전 조회인지 예약 후 조회인지 구분값
    }
  },
  mounted () {
    this.dayAmtListCopy = _.cloneDeep(this.instance.params.dayAmtList)
    this.isBefore = _.cloneDeep(this.instance.params.isBefore)
    this.roomCount = _.cloneDeep(this.instance.params.roomCount)
    this.setList()
  },
  methods: {
    /**
     * 일별요금 테이블 리스트 생성
     */
    setList () {
      for (const one of this.dayAmtListCopy) {
        const oneDay = {}
        if (one.checkInDate) { // 객실
          oneDay.date = moment(one.checkInDate).format('YYYY-MM-DD (ddd)')
          if (one.totalPrice) {
            oneDay.salePrice = this.isBefore ? one.totalPrice / this.roomCount : one.totalPrice // 판매가
          } else {
            oneDay.salePrice = this.isBefore ? one.salePrice / this.roomCount : one.salePrice // 판매가
          }
          oneDay.creditPrice = this.isBefore ? one.creditPrice / this.roomCount : one.creditPrice // 입금가
          this.dayAmtList.push(oneDay)
        } else { // 패키지
          oneDay.date = moment(one.saleYmd).format('YYYY-MM-DD (ddd)')
          oneDay.salePrice = one.salePrice // 판매가
          oneDay.creditPrice = one.creditPrice // 입금가
          this.dayAmtList.push(oneDay)
        }
      }
    }
  }
}
</script>
