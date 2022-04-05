<template>
  <dialog-base :instance="instance" :title="'예약 인증번호 확인'">
    <v-row>
      <v-col cols="12">
        <p class="font-weight-bold mt-2" style="font-size: large">인증번호: {{ authNo }}</p>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="enteredNo"
          placeholder="인증번호 4자리를 입력해주세요"
          outlined
          hide-details
        />
      </v-col>
      <v-col cols="12" class="text-right">
        <v-btn outlined rounded color="blue" @click="save">저장(F10)</v-btn>
      </v-col>
    </v-row>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'SimpleAuthPopup',
  data () {
    return {
      authNo: '', // 기존 인증번호 4자리
      enteredNo: '' //  입력받은 인증번호 4자리
    }
  },
  mounted () {
    this.authNo = _.cloneDeep(this.instance.params.authNo)
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
     * 인증번호 검증 및 예약/수정 실행
     */
    save () {
      if (this.enteredNo && /^[0-9]{4}$/.test(this.enteredNo)) {
        this.close({
          data: this.enteredNo
        })
      } else {
        this.$dialog.alert('인증번호는 4자리 숫자입니다.')
      }
    }
  }
}
</script>
