<template>
    <dialog-base :instance="instance">
        <template v-slot:title>
            블럭 조회 - {{rowInfo.pkgNm}}
        </template>
        <v-simple-table class="bordered">
          <thead>
          <tr>
            <th class="text-center">블럭</th>
            <th v-for="date of dateList" :key="date.value" class="text-center">{{date.label}}</th>
          </tr>
          </thead>
          <tbody v-if="!blockList || blockList.length === 0">
            <tr>
              <td :colspan="1 +dateList.length" class="text-center py-2">데이터가 없습니다.</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="(block, index) of blockList" :key="block.block + '_' + index">
              <td class="text-center font-weight-bold" style="background: #eeeeee">{{block.block}} 블럭</td>
              <td class="text-center" v-for="date of dateList" :key="date.value">{{block[date.value]}}</td>
            </tr>
          </tbody>
        </v-simple-table>
    </dialog-base>
</template>
<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'AdminPkgReservationInventoryDialog',
  data () {
    return {
      ciYmd: null,
      rowInfo: {},
      dateList: [],
      list: [],
      blockList: []
    }
  },
  mounted () {
    this.rowInfo = this.instance.params.rowInfo
    this.ciYmd = this.instance.params.ciYmd
    this.selectBlockList()
  },
  methods: {
    /**
     * 블럭 조회
     */
    async selectBlockList () {
      // 날짜 리스트 셋팅
      const dateList = []
      const days = parseInt(this.rowInfo.nights)
      for (let index = 0; index < days; index++) {
        const value = moment(this.ciYmd).add(index, 'days')
        dateList.push({ label: value.format('YYYY[년] MM[월] DD[일]'), value: value.format('YYYYMMDD') })
      }
      this.dateList = dateList
      // dgns 블럭재고 셋팅 - 객실기본 블럭코드 + 104 블럭코드
      const blockData = this.rowInfo.blockList || []
      const blockList = []
      if (this.rowInfo.rsvBlckCd) {
        blockList.push(this.setBlockData(blockData, this.rowInfo.rsvBlckCd, dateList))
      }
      blockList.push(this.setBlockData(blockData, '104', dateList))
      this.blockList = blockList
    },
    /**
     * 블럭 재고량 데이터 처리
     * @param blockList dgns 재고리스트
     * @param blockCd 블럭코드
     * @param dateList 일자리스트
     */
    setBlockData (blockList, blockCd, dateList) {
      const row = { block: blockCd }
      for (const date of dateList) {
        const index = blockList.findIndex(data => data.rsvBlckCd === blockCd && data.ciYmd === date.value)
        if (index > -1) {
          row[date.value] = blockList[index].stockQty
        } else {
          row[date.value] = null
        }
      }
      return row
    }
  }
}
</script>
