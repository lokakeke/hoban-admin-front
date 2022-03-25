<template>
  <dialog-base :instance="instance" title="예약 취소">
    <v-form ref="form" lazy-validation autocomplete="off">
      <v-row>
        <v-col cols="12">
          <v-autocomplete v-model="newItem.cancelResnCd"
                          autocomplete="off"
                          :items="cancelResnList"
                          :item-value="'commCd'"
                          :item-text="'commCdNm'"
                          hide-details
                          label="취소코드"
                          :rules="emptyRules"
                          @change="modifyCancelDesc(newItem.cancelResnCd)"
          />
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="newItem.cancelResnDesc"
            label="취소사유"
            outlined
            hide-details
            dense
          />
        </v-col>
        <v-col cols="12" class="text-right">
          <v-btn outlined rounded color="blue" @click="save">저장(F10)</v-btn>
          <v-btn outlined rounded color="primary" @click="close">닫기(ESC)</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import commonService from 'Api/modules/system/commonCode.service'

export default {
  extends: DialogBase,
  name: 'ReservationCancelPopup',
  data () {
    return {
      cancelResnList: [], // 취소 사유 코드 목록
      newItem: {}
    }
  },
  mounted () {
    this.selectCancelTypeCdList()
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [
        {
          target: 'F10',
          action: this.save
        }
      ]
    })
  },
  methods: {
    /**
     * 취소 사유 코드 목록 조회
     */
    async selectCancelTypeCdList () {
      const res = await commonService.selectDGNSCommonCodeList('RSV0096')
      this.isPartner ? this.cancelResnList = [res.data[0]] : this.cancelResnList = res.data
    },
    /**
     * 취소 사유 코드 선택/변경시
     */
    modifyCancelDesc (info) {
      const cancel = this.cancelResnList.filter(data => data.commCd === info)
      this.newItem.cancelResnDesc = cancel[0].commCdNm
    },
    /**
     * 저장(취소실행)
     */
    save () {
      this.validForm(this.$refs.form).then(() => {
        if (!this.newItem.cancelResnCd) {
          this.$dialog.alert('취소 사유 코드값을 선택해 주세요.')
        } else {
          this.$dialog.confirm('예약을 취소하시겠습니까?').then(() =>
            this.close({
              data:
                {
                  cancelResnCd: this.newItem.cancelResnCd,
                  cancelResnDesc: this.newItem.cancelResnDesc
                }
            })
          )
        }
      })
    }
  }
}
</script>
