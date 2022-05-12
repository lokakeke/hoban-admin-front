<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      파트너 담당자 {{isNew? '추가': '수정'}}
    </template>
    <v-form ref="form" lazy-validation autocomplete="off">
      <v-row>
        <v-col cols="4">
          <v-label>닉네임</v-label>
          <v-text-field v-model="form.managerName" label="" :rules="emptyRules" clearable></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-label>휴대폰 번호</v-label>
          <v-text-field v-model="form.telNo" v-mask="['###-####-####', '###-###-####']" label="" :rules="mobileRegex" clearable></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-label>이메일 주소</v-label>
          <v-text-field v-model="form.email" label="" :rules="emailRegex" clearable></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-label>슈퍼바이저 권한</v-label>
          <v-checkbox v-model="form.mainAuthYn" label="슈퍼바이저 권한" hide-details true-value="Y" false-value="N"></v-checkbox>
        </v-col>
        <v-col cols="4">
          <v-label>사용여부</v-label>
          <v-checkbox v-model="form.useYn" label="사용여부" hide-details true-value="Y" false-value="N"></v-checkbox>
        </v-col>
      </v-row>
    </v-form>
    <template v-slot:actions>
      <v-btn outlined rounded color="error" @click="deleteCharge" v-if="!isNew"><v-icon left>remove</v-icon>삭제</v-btn>
      <v-btn outlined rounded color="info" @click="apply"><v-icon left>check</v-icon>입력</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import partnerManagerService from '@/api/modules/partner/partnerManager.service'
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'PartnerAddChargeDialog',
  data () {
    return {
      isNew: false,
      form: {}
    }
  },
  mounted () {
    this.isNew = this.instance.params.isNew
    this.form = _.cloneDeep(this.instance.params.form)
  },
  methods: {
    async apply () {
      try {
        await this.validForm(this.$refs.form)
        if (!this.form.telNo && !this.form.email) {
          // 둘중에 하나는 필수
          this.$dialog.alert('휴대전화, 이메일 중 하나는 필수로 입력하여 주세요.')
          return
        }
        await this.$dialog.confirm(`담당자 정보를 ${this.isNew ? '입력' : '수정'} 하시겠습니까?`)
        if (this.isNew) {
          await partnerManagerService.insertPartnerManager(this.form)
        } else {
          await partnerManagerService.updatePartnerManager(this.form)
        }
        this.close({ search: true })
      } catch (e) {}
    },
    async deleteCharge () {
      try {
        await this.$dialog.confirm(`담당자(${this.form.managerName})를 삭제 하시겠습니까?`)
        await partnerManagerService.deletePartnerManager(this.form.partnerSeq, this.form.partnerManagerId)
        await this.$dialog.alert(`담당자(${this.form.managerName})를 삭제 하였습니다.`)
        this.close({ search: true })
      } catch (e) {}
    }
  }
}
</script>
