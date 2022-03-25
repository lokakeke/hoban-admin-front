<template>
  <dialog-base :instance="instance" :title="`일정산 메모 ${instance.params.form.memo ? '수정' : '등록'} 하기`">
    <template v-slot:buttons>
      <v-btn dark text @click="updateDayForm">
        <v-icon left>check</v-icon>
        {{instance.params.form.memo ? '수정' : '등록'}}
      </v-btn>
    </template>
    <v-form ref="form" v-if="form" lazy-validation>
      <v-card-text class="pa-0">
        <!-- 메모 수정-->
        <v-col cols="12" class="pt-2 pb-0 mb-3">
          <v-textarea outlined dense :rules="maxLengthRules(300)"
            :label="`일정산 메모 ${instance.params.form.memo ? '수정' : '등록'}`" counter="300" v-model="form.memo" :value="form.memo"
            :placeholder="`일정산 메모를 ${instance.params.form.memo ? '수정' : '등록'}해 주세요. (최대 300자 입력가능)`"
          ></v-textarea>
        </v-col>
        <v-row>
          <v-col class="text-right mt-3">
            <v-btn outlined rounded color="info" @click="updateDayForm">
              <v-icon>check</v-icon>{{instance.params.form.memo ? '수정' : '등록'}}
            </v-btn>
            <v-btn outlined rounded color="primary" @click="close()">
              <v-icon>close</v-icon>취소
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import service from 'Api/modules/naver/calculateDay.service'

export default {
  extends: DialogBase,
  name: 'BookingInfoUpdate',
  components: {},
  data: () => ({
    /**
       * 변경할 요소
       */
    form: null
  }),
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{
        target: 'escape',
        action: this.close
      }]
    })
    this.form = _.cloneDeep(this.instance.params.form)
  },
  methods: {
    /**
     * 수정
     */
    updateDayForm () {
      this.validForm(this.$refs.form).then(() => {
        this.$dialog.confirm(`일정산 메모를 ${this.instance.params.form.memo ? '수정' : '추가'} 하시겠습니까?`).then(() => {
          let param = null
          service.updateCalculateDayMst(this.form).then(res => {
            this.$dialog.alert(`${this.instance.params.form.memo ? '수정' : '추가'} 되었습니다.`)
            param = this.form
            this.close({ data: param })
          })
        }).catch(() => {})
      }).catch(() => {})
    }
  }
}
</script>
