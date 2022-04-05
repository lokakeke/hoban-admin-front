<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      영업장 기본정보
    </template>

    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-data-table :headers="headers"
                        :items="list"
                        :no-data-text="'검색 결과가 없습니다.'"
                        @click:row="selectItem($event)"
                        class="bordered pointer"
                        disable-pagination
                        hide-default-footer
          >
            <template v-slot:item.store="{item}">
              {{item.storeName}} ({{ item.storeCode }})
            </template>
            <template v-slot:item.todayRsvYn="{item}">
              {{ item.todayRsvYn === 'Y' ? '가능' : '불가능' }}
            </template>
            <template v-slot:item.useYn="{item}">
              {{ item.useYn === 'Y' ? '판매' : '판매중지' }}
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import roomTypeService from '@/api/modules/ota/roomType.service'

export default {
  extends: DialogBase,
  name: 'SelectionItemDialog',
  data: function () {
    return {
      list: [],
      headers: [
        { text: '영업장 명(코드)', value: 'store', align: 'center', sortable: false },
        { text: '판매 시작일자', value: 'saleBgnYmd', align: 'center', sortable: false },
        { text: '판매 종료일자', value: 'saleEndYmd', align: 'center', sortable: false },
        { text: '일별 최대객실 예약 가능 수', value: 'dailRsvLmt', align: 'center', sortable: false },
        { text: '월별 객실 조회 범위', value: 'rmInqDdCnt', align: 'center', sortable: false },
        { text: '객실 박수 범위', value: 'stayNights', align: 'center', sortable: false },
        { text: '객실 수 범위', value: 'rmCnt', align: 'center', sortable: false },
        { text: '당일예약 여부', value: 'todayRsvYn', align: 'center', sortable: false },
        { text: '당일예약 시간', value: 'todayRsvTime', align: 'center', sortable: false },
        { text: '블럭코드', value: 'rsvBlckCode', align: 'center', sortable: false },
        { text: '판매유무', value: 'useYn', align: 'center', sortable: false }
      ]
    }
  },
  mounted () {
    this.getRoomTypeList()
  },
  methods: {
    async getRoomTypeList () {
      try {
        const response = await roomTypeService.selectRegisteredStoreList(this.searchParam)
        const items = response.data

        for (const item of items) {
          item.saleBgnYmd = moment(item.saleBgnYmd).format('YYYY-MM-DD')
          item.saleEndYmd = moment(item.saleEndYmd).format('YYYY-MM-DD')
        }

        this.list = items === '' ? [] : items
      } catch {}
    },

    async selectItem (event) {
      try {
        await this.$dialog.confirm('해당 영업장 정보를 불러오시겠습니까?')
        this.close(event)
      } catch {
        console.log('불러오기 오류')
      }
    }
  }
}
</script>

<style scoped>

</style>
