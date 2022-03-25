<template>
  <dialog-base :instance="instance" :title="'일별 요금'">
    <v-data-table
      disable-pagination fixed-header dense :no-data-text="'검색 결과가 없습니다.'" :headers="headers" :items="dayAmtList" hide-default-footer class="click-row bordered">
      <template v-slot:item.rcpmnyAmt="{item}">{{item.rcpmnyAmt | price}}원</template>
      <template v-slot:item.saleAmt="{item}">{{item.saleAmt | price}}원</template>
    </v-data-table>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'

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
          value: 'rcpmnyAmt',
          align: 'center',
          format: '###,###,###',
          sortable: false
        },
        {
          text: '판매금액',
          value: 'saleAmt',
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
    this.rmCnt = _.cloneDeep(this.instance.params.rmCnt)
    this.setList()
  },
  methods: {
    /**
     * 일별요금 테이블 리스트 생성
     */
    setList () {
      for (const one of this.dayAmtListCopy) {
        const oneDay = {}
        if (one.ciYmd) { // 객실
          oneDay.date = moment(one.ciYmd).format('YYYY-MM-DD (ddd)')
          if (one.totAmt) {
            oneDay.saleAmt = this.isBefore ? one.totAmt / this.rmCnt : one.totAmt // 판매가
          } else {
            oneDay.saleAmt = this.isBefore ? one.saleAmt / this.rmCnt : one.saleAmt // 판매가
          }
          oneDay.rcpmnyAmt = this.isBefore ? one.rcpmnyAmt / this.rmCnt : one.rcpmnyAmt // 입금가
          this.dayAmtList.push(oneDay)
        } else { // 패키지
          oneDay.date = moment(one.saleYmd).format('YYYY-MM-DD (ddd)')
          oneDay.saleAmt = one.saleAmt // 판매가
          oneDay.rcpmnyAmt = one.rcpmnyAmt // 입금가
          this.dayAmtList.push(oneDay)
        }
      }
    }
  }
}
</script>
