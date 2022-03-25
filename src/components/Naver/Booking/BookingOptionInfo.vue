<template>
  <dialog-base :instance="instance" :title="`옵션 상세보기`">
    <v-row wrap v-if="form">
      <v-col cols="12" class="pb-3">
        <v-data-table v-dragscroll="{target: '.v-data-table__wrapper'}"
          :no-data-text="emptyText" :headers="headers"
          :items="form" item-key="dmOptionId"
          hide-default-footer
          disable-pagination
          disable-sort
          class="bordered">
          <template v-slot:item.price="{item}">
            {{ item.price | price }}
          </template>
          <template v-slot:item.normalPrice="{item}">
            {{ item.normalPrice | price }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'BookingOptionInfo',
  components: {},
  data: () => ({
    /**
     * header
     */
    headers: [
      { text: '옵션명', value: 'name', align: 'center', sortable: false },
      { text: '예약가능최소수량', value: 'minBookingCount', align: 'center', sortable: false },
      { text: '예약가능최대수량', value: 'maxBookingCount', align: 'center', sortable: false },
      { text: '재고', value: 'stock', align: 'center', sortable: false },
      { text: '판매가', value: 'price', align: 'center', sortable: false },
      { text: '정가', value: 'normalPrice', align: 'center', sortable: false },
      { text: '노출여부', value: 'isImp', align: 'center', sortable: false },
      { text: '가격설명', value: 'priceDesc', align: 'center', sortable: false },
      { text: '노출순서', value: 'optionOrder', align: 'center', sortable: false },
      { text: '옵션설명', value: 'optionDesc', align: 'center', sortable: false },
      { text: '무료여부', value: 'isFree', align: 'center', sortable: false },
      { text: '운영기간시작일', value: 'startDate', align: 'center', sortable: false },
      { text: '운영기간종료일', value: 'endDate', align: 'center', sortable: false }
    ],
    /**
     * 변경할 요소
     */
    form: []
  }),
  computed: {
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{
        target: 'escape',
        action: this.close
      }]
    })
    this.form = this.instance.params.form
  },
  methods: {
  }
}
</script>
