<template>
  <dialog-base :title="`예치금 초기화 ${modeText} ${modeGubun !== null ? '('+modeGubun+')' : ''}`" :instance="instance">
    <v-form ref="form" lazy-validation v-if="form">
        <v-row>
          <v-col cols="3">
            <v-label>업무 유형</v-label>
            <v-text-field :value="form.taskType" readonly disabled></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>객실 기준일자</v-label>
            <v-text-field :value="form.roomDt | date" readonly disabled></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>패키지 기준일자</v-label>
            <v-text-field :value="form.pkgDt | date" readonly disabled></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" v-if="list.length > 0">
            <v-label>대상 파트너</v-label>
            <div class="mt-2">
              <v-chip
                class="ma-1"
                v-for="ptnr in list"
                :key="ptnr.partnerSeq"
              >
                {{ptnr.companyName}}
              </v-chip>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-right">
            <v-btn outlined rounded color="info" @click="approve">
              <v-icon>check</v-icon> 적용
            </v-btn>
            <v-btn outlined rounded color="primary" @click="close">
              <v-icon>close</v-icon> 닫기
            </v-btn>
          </v-col>
        </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import { mapGetters } from 'vuex'
import DialogBase from '@/components/Dialog/DialogBase.vue'
import depositAccountService from '@/api/modules/api/depositAccount.service'

export default {
  props: { propForm: Object, propList: Array, propGubun: Object },
  name: 'DepositInitApprovalDialog',
  extends: DialogBase,
  data () {
    return {
      form: Object,
      list: Array,
      isNew: true,
      gubun: ''
    }
  },
  mounted () {
    this.matchProps()
  },
  computed: {
    ...mapGetters({ user: 'auth/user' }),
    /**
     * 적용 or 결과 텍스트
     */
    modeText () {
      return this.isNew === true ? '선택 내역' : '결과'
    },
    /**
     * 적용 or 결과 텍스트
     */
    modeGubun () {
      return this.gubun
    }
  },
  methods: {
    /**
     * MATCH PROPS
     */
    matchProps () {
      this.form = this.instance.params.propForm
      this.list = this.instance.params.propList
      this.gubun = this.instance.params.propGubun
    },
    /**
     * 승인
     */
    approve () {
      this.validForm(this.$refs.form).then(() => {
        if (this.list.length < 1) {
          this.$dialog.alert('대상 파트너 목록이 없습니다.')
          return
        }
        const paramList = {
          form: this.form,
          list: this.list,
          gubun: this.gubun,
          loginId: this.user.number
        }
        depositAccountService.updateScheduleDepositInitList(paramList).then(res => {
          if (res.data.resultCode === '0000') {
            this.$dialog.alert('초기화 완료 시 "OTA 예치금 초기화" 알림이 옵니다.')
            this.close({ data: res.data })
          } else {
            this.$$dialog.alert('적용에 실패하였습니다. [' + res.data.resultMsg + ']')
          }
        })
      })
    }
  }
}
</script>
