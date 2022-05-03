<template>
  <v-card flat>
    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-row>
          <v-col sm="6" md="3" cols="6">
            <v-label>닉네임</v-label>
            <v-text-field v-model="form.partnerManagerId" label="" :rules="emptyRules"></v-text-field>
          </v-col>
          <v-col sm="6" md="3" cols="6">
            <v-label>휴대폰 번호</v-label>
            <v-text-field v-model="form.telNo" v-mask="['###-####-####', '###-###-####']" label="" :rules="mobileRegex" :disabled="!!profile.telNo"></v-text-field>
          </v-col>
          <v-col sm="6" md="3" cols="6">
            <v-label>이메일 주소</v-label>
            <v-text-field v-model="form.email" label="" :rules="emailRegex" :disabled="!!profile.email"></v-text-field>
          </v-col>
        </v-row>
        <v-row justify="end">
          <v-btn outlined rounded color="info" @click="apply"><v-icon left>check</v-icon>수정</v-btn>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import partnerManagerService from '@/api/modules/partner/partnerManager.service'

export default {
  props: {
    mainAuth: Boolean,
    profile: Object
  },
  name: 'PartnerProfileBasicInformation',
  data () {
    return {
      form: {}
    }
  },
  mounted () {
    this.form = _.cloneDeep(this.profile)
  },
  methods: {
    apply () {
      this.validForm(this.$refs.form).then(() => {
        // 둘중에 하나는 필수
        if (!this.form.telNo && !this.form.email) {
          this.$dialog.alert('휴대전화, 이메일 중 하나는 필수로 입력하여 주세요.')
          return
        }
        partnerManagerService.updatePartnerManagerProfile(this.form).then(() => {
          this.$emit('change')
          this.$dialog.alert('기본정보가 변경 되었습니다.')
        })
      })
    }
  }
}
</script>
