<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      판매일자 일괄등록
    </template>

    <v-container fluid>
      <v-form>
        <v-row>
          <v-col cols="6">
            <date-picker
                clearable
                format="YYYY-MM-DD"
                hide-details
                label="판매 시작일자"
                required
                v-model="saleStartDate" />
          </v-col>
          <v-col cols="6">
            <date-picker
                clearable
                format="YYYY-MM-DD"
                hide-details
                label="판매 종료일자"
                required
                v-model="saleEndDate" />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-right" cols="12">
            <v-btn @click="close" color="red" dark rounded>취소</v-btn>
            <v-btn @click="applyDate" color="info" rounded>적용</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'BatchRegisterForm',
  data: function () {
    return {
      saleStartDate: '',
      saleEndDate: ''
    }
  },
  methods: {
    applyDate () {
      this.close({
        saleStartDate: this.saleStartDate,
        saleEndDate: this.saleEndDate
      })
    }
  }
}
</script>

<style scoped>

</style>
