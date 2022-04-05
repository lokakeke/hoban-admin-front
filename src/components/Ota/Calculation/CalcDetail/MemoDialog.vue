<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      메모
    </template>
    <v-container fluid class="pa-0">
      <v-row dense>
        <v-col>
          <v-editor v-model="calcItem.memo" />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col class="text-end">
          <v-btn outlined
                 rounded
                 color="info"
                 v-if="calcItem.lockYn !== 'Y' && writeAuth && !isPartner"
                 @click="saveMemo()"
          >적용
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import calculationService from '@/api/modules/ota/calculation.service'

export default {
  extends: DialogBase,
  name: 'MemoDialog',
  data: function () {
    return {
      calcItem: ''
    }
  },
  mounted () {
    this.calcItem = this.instance.params.calcItem
  },
  methods: {
    async saveMemo () {
      const response = await calculationService.modifyMonthCalcHistoryMemo(this.calcItem.calcSeq, this.calcItem.memo)
      const data = response.data

      if (data.resultCode !== '0000') {
        this.$dialog.alert(data.resultMsg)
      } else {
        this.$dialog.alert('저장되었습니다.')
      }
    }
  }
}
</script>

<style scoped>
</style>
