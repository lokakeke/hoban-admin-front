<template>
  <dialog-base :title="instance.params.title" :instance="instance">
    <v-form ref="form" lazy-validation>
      <v-row>
        <v-col sm="6" md="4">
          <v-label>사용자 사번</v-label>
          <v-text-field v-model="form.adminBusinessNo" label="" :disabled="!isNew" :rules="emptyRules"></v-text-field>
        </v-col>
        <v-col sm="6" md="4">
          <v-label>로그인 ID</v-label>
          <v-text-field v-if="isNew" v-model="form.loginId" label="" :disabled="!isNew" :rules="emptyRules">
            <template v-slot:append-outer>
              <v-btn color="info" outlined @click="createId" :disabled="createLoginId">자동생성</v-btn>
            </template>
          </v-text-field>
          <v-text-field v-else v-model="form.loginId" label="" :rules="emptyRules" disabled></v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="isNew">
        <v-col cols="3">
          <v-label>비밀번호 생성</v-label>
          <v-radio-group v-model="form.tempPwYn" row :rules="emptyRules">
            <v-radio label="임시 비밀번호 생성" value="Y"></v-radio>
            <v-radio label="비밀번호 직접 입력" value="N"></v-radio>
          </v-radio-group>
        </v-col>
        <template v-if="form.tempPwYn === 'N'">
          <v-col cols="3">
            <v-label>
              비밀번호
              <v-btn icon small title="비밀번호 정책확인" color="info" @click="openPasswordPolicy">
                <v-icon>info</v-icon>
              </v-btn>
            </v-label>
            <v-text-field type="password" v-model="form.newPw" :rules="emptyRules" single-line class="pt-0 mt-1"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>비밀번호 확인</v-label>
            <v-text-field type="password" ref="pwConfirm" v-model="form.newPwConfirm" :rules="emptyRules.concat(newPasswordConfirmRule)"></v-text-field>
          </v-col>
        </template>
      </v-row>
      <v-row>
        <v-col sm="6" md="4">
          <v-label>사용자 이름</v-label>
          <v-text-field v-model="form.adminName" label="" :rules="emptyRules"></v-text-field>
        </v-col>
        <v-col sm="6" md="4">
          <v-label>휴대폰 번호</v-label>
          <v-text-field v-model="form.telNo" v-mask="['###-####-####', '###-###-####']" label="" :rules="mobileRegex.concat(emptyRules)"></v-text-field>
        </v-col>
        <v-col sm="6" md="4">
          <v-label>이메일 주소</v-label>
          <v-text-field v-model="form.email" label="" :rules="emailRegex.concat(emptyRules)"></v-text-field>
        </v-col>
        <v-col sm="6" md="4">
          <v-label>메뉴 그룹 권한</v-label>
          <v-autocomplete v-model="form.menuAuthGroupId"
                          :items="groupList"
                          :item-value="'menuAuthGroupId'"
                          :item-text="'menuAuthGroupName'"
                          placeholder="메뉴그룹 권한을 선택해 주세요."
                          :rules="emptyRules"></v-autocomplete>
        </v-col>
<!--        TODO 부서 연동
        <v-col sm="6" md="4">
          <v-label>부서</v-label>
          <v-autocomplete v-model="form.deptCode"
                          :items="deptList"
                          item-value="commonCode"
                          item-text="commonCodeName"
                          placeholder="부서를 선택해 주세요."
                          clearable></v-autocomplete>
        </v-col>-->
        <v-col sm="6" md="4">
          <v-label>사용 여부</v-label>
          <v-radio-group v-model="form.useYn" row :rules="emptyRules">
            <v-radio label="사용" value="Y"></v-radio>
            <v-radio label="미사용" value="N"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row justify="end" v-if="writeAuth">
        <v-btn outlined rounded color="orange" @click="refresh()"><v-icon>refresh</v-icon>원래대로</v-btn>
        <v-btn outlined rounded color="info" @click="submit()"><v-icon>check</v-icon>{{isNew? '추가': '수정'}}</v-btn>
        <v-btn outlined rounded color="primary" @click="close()"><v-icon>close</v-icon>닫기</v-btn>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import adminAccountService from '@/api/modules/system/authentication/admin/adminAccount.service'

export default {
  extends: DialogBase,
  name: 'AdminAccountForm',
  data () {
    return {
      groupList: [],
      formData: {},
      form: {},
      isNew: false,
      createLoginId: false,
      deptList: []
    }
  },
  computed: {
    newPasswordConfirmRule () {
      if (this.form.tempPwYn === 'N' && this.form.newPw !== this.form.newPwConfirm) {
        return ['새로운 비밀번호 확인값이 다릅니다.']
      } else {
        return []
      }
    }
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{ target: 'escape', action: this.close }]
    })
    this.formData = _.cloneDeep(this.instance.params.formData)
    this.form = this.instance.params.formData
    this.isNew = this.instance.params.isNew
    this.groupList = this.instance.params.groupList
    this.deptList = this.instance.params.deptList
  },
  methods: {
    submit () {
      this.validForm(this.$refs.form).then(() => {
        this.$dialog.confirm('사용자 정보를 ' + (this.isNew ? '추가' : '수정') + ' 하시겠습니까?').then(() => {
          if (this.isNew) {
            adminAccountService.insertAdminAccount(this.form).then(res => {
              this.$dialog.alert('저장되었습니다.')
              this.close({ change: true })
            })
          } else {
            adminAccountService.updateAdminAccount(this.form).then(res => {
              this.$dialog.alert('저장되었습니다.')
              this.close({ change: true })
            })
          }
        }).catch(() => {})
      })
    },
    refresh () {
      this.form = this.cloneDeep(this.formData)
    },
    async createId () {
      try {
        if (!this.createLoginId) {
          const res = await adminAccountService.createLoginId()
          this.$dialog.alert(`로그인 ID(${res.data})를 자동 생성 하였습니다.<br/>아이디는 계정 추가 전까지 수정가능합니다.`)
          this.form.loginId = res.data
          this.createLoginId = true
        }
      } catch (e) {}
    },
    openPasswordPolicy () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Session/PasswordPolicy',
        params: {},
        options: {
          fullscreen: false,
          scrollable: true,
          width: 700
        }
      })
    }
  }
}
</script>
