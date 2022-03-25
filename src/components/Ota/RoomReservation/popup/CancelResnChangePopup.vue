<template>
  <dialog-base :instance="instance" title="취소 사유 변경">
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
        <v-col v-if="originInfo && originInfo.cancelResnDesc" cols="12">
          <v-textarea
            v-model="originInfo.cancelResnDesc"
            label="이전취소사유"
            readonly
            outlined
            hide-details
            dense
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
          <v-btn outlined rounded color="blue" @click="update">수정(F10)</v-btn>
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
  name: 'CancelResnChangePopup',
  data () {
    return {
      cancelResnList: [], // 취소 사유 코드 목록
      newItem: {},
      originInfo: {} // 기존 예약 정보(단일 건 변경시에만 값이 들어옴)
    }
  },
  mounted () {
    this.selectCancelTypeCdList()
    this.originInfo = _.cloneDeep(this.instance.params.originInfo)
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [
        {
          target: 'F10',
          action: this.update
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
     * 취소 사유 코드 선택/변경 시
     */
    modifyCancelDesc (info) {
      const cancel = this.cancelResnList.filter(data => data.commCd === info)
      this.newItem.cancelResnDesc = cancel[0].commCdNm
    },
    /**
     * 취소 사유 수정 실행
     */
    update () {
      this.validForm(this.$refs.form).then(() => {
        if (!this.newItem.cancelResnCd) {
          this.$dialog.alert('취소 코드값을 선택해 주세요.')
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
