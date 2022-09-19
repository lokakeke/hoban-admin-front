<template>
  <dialog-base :instance="instance" :title="'전체설정 변경'">
    <v-row no-gutters>
      <v-col cols="12">
        <v-list-item three-line class="height-auto px-0">
          <v-list-item-content class="pt-0">
            <v-row justify="space-between">
              <v-col cols="8" class="pb-0">
                <v-list-item-title class="headline fw-bold">
                  판매 여부
                </v-list-item-title>
              </v-col>
              <v-col cols="4" class="no-gutter pb-0">
                <v-card-actions>
                  <v-btn outlined text @click="changeAllInfo('SALE_YN', 'Y')">노출</v-btn>
                  <v-btn outlined text @click="changeAllInfo('SALE_YN', 'N')">미노출</v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
            <v-list-item-action-text>전체 판매여부를 한 번에 노출/미노출 할 수 있습니다.</v-list-item-action-text>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12">
        <v-list-item three-line class="height-auto px-0">
          <v-list-item-content class="pt-0">
            <v-row justify="space-between">
              <v-col cols="8" class="pb-0">
                <v-list-item-title class="headline fw-bold">
                  인원수 입력여부
                </v-list-item-title>
              </v-col>
              <v-col cols="4" class="no-gutter pb-0">
                <v-card-actions>
                  <v-btn outlined text @click="changeAllInfo('PERS_CNT_YN', 'Y')">노출</v-btn>
                  <v-btn outlined text @click="changeAllInfo('PERS_CNT_YN', 'N')">미노출</v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
            <v-list-item-action-text>전체 인원수 입력여부를 한 번에 노출/미노출 할 수 있습니다.</v-list-item-action-text>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12">
        <v-list-item three-line class="height-auto px-0">
          <v-list-item-content class="pt-0">
            <v-row justify="space-between">
              <v-col cols="8" class="pb-0">
                <v-list-item-title class="headline fw-bold">
                  수량 입력여부
                </v-list-item-title>
              </v-col>
              <v-col cols="4" class="no-gutter pb-0">
                <v-card-actions>
                  <v-btn outlined text @click="changeAllInfo('QTY_YN', 'Y')">노출</v-btn>
                  <v-btn outlined text @click="changeAllInfo('QTY_YN', 'N')">미노출</v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
            <v-list-item-action-text>전체 수량 입력여부를 한 번에 노출/미노출 할 수 있습니다.</v-list-item-action-text>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import facilityService from '@/api/modules/userSystem/facility.service'

export default {
  extends: DialogBase,
  name: 'FacilityChangeAllModal',
  components: {},
  data: function () {
    return {
      facilityList: []
    }
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{
        target: 'escape',
        action: this.close
      }]
    })
    this.facilityList = this.instance.params.list
  },
  methods: {
    // 전체 설정 변경
    changeAllInfo (columnType, changeYn) {
      let typeNm
      const typeYn = changeYn === 'Y' ? '노출' : '미노출'
      if (columnType === 'SALE_YN') {
        typeNm = '판매 여부'
      } else if (columnType === 'PERS_CNT_YN') {
        typeNm = '인원수 입력여부'
      } else if (columnType === 'QTY_YN') {
        typeNm = '수량 입력여부'
      }
      this.$dialog.confirm(`전체 ${typeNm}를 ${typeYn}하시겠습니까?`).then(() => {
        const param = { changeYn, columnType }
        facilityService.updateFacilityChangeAllInfo(param).then(() => {
          this.close({ reload: 'Y', type: 'success', text: `${typeNm}가 전체 [${typeYn}]로 변경 되었습니다.` })
        })
      })
    }
  }
}
</script>
<style scoped>
  .ghost {
    color: #FFFFFF;
    background: #e0e0e0;
  }
</style>
