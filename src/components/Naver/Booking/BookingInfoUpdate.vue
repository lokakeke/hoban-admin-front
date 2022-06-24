<template>
  <dialog-base :instance="instance" :title="`수정하기`">
    <template v-slot:buttons>
      <v-btn dark text @click="updateBooking()">
        <v-icon left>check</v-icon>
        수정
      </v-btn>
    </template>
    <v-form ref="form" v-if="form" lazy-validation>
      <v-card-text class="pa-0">
        <!-- 이름 수정-->
        <v-col cols="12" class="pt-2 pb-0 mb-3" v-if="instance.params.property === 'name'">
          <div class="mb-10 subtitle-1 font-weight-black primary--text">*성과 이름을 반드시 따로 기재해 주세요.</div>
          <v-text-field dense v-model.trim="form.lastName" counter="15" class="pb-3" placeholder="이용자 성을 입력해주세요."
            label="이용자 성" :rules="betweenLengthRules(1,15).concat(emptyRules)"></v-text-field>
          <v-text-field dense v-model.trim="form.firstName" counter="15" placeholder="이용자 이름을 입력해주세요."
            label="이용자 이름" :rules="betweenLengthRules(1,15).concat(emptyRules)"></v-text-field>
        </v-col>
        <!-- 전화번호 수정-->
        <v-col cols="12" class="pt-2 pb-0 mb-3" v-else-if="instance.params.property === 'phone'">
          <v-text-field dense v-model="form.phone" placeholder="전화번호를 입력해주세요."
            label="전화번호 수정" :rules="emptyRules" v-mask="['###-####-####', '###-###-####']"></v-text-field>
        </v-col>
        <!-- 메모 수정-->
        <v-col cols="12" class="pt-2 pb-0 mb-3" v-else-if="instance.params.property === 'memo'">
          <v-textarea outlined dense :rules="maxLengthRules(500)"
            v-if="instance.params.isDgns === 'dgns'"
            label="PMS 직원메모 수정" counter="500" v-model="form.memo" :value="form.memo"
            placeholder="내부 직원용으로 고객에게 보이지 않는 메모입니다. (최대 500자 입력가능)"
          ></v-textarea>
          <v-textarea outlined dense :rules="maxLengthRules(500)"
            v-if="instance.params.isDgns === 'naver'"
            label="네이버 직원메모 수정" counter="500" v-model="form.memo" :value="form.memo"
            placeholder="내부 직원용으로 고객에게 보이지 않는 메모입니다. (최대 500자 입력가능)"
          ></v-textarea>
        </v-col>
        <!-- 예약번호 수정-->
        <v-col cols="12" class="pt-2 pb-0 mb-3" v-if="instance.params.property === 'rsvNo'">
          <v-text-field class="pb-3" dense v-model.trim="form.rsvNo" placeholder="예약번호를 입력해주세요."
            label="예약번호 수정" v-mask="'###########'"></v-text-field>
          <v-text-field dense v-model.trim="form.keyRsvNo" placeholder="예약키를 입력해주세요."
            label="예약키 수정" v-mask="'###########'"></v-text-field>
        </v-col>
        <v-divider></v-divider>
        <v-row>
          <v-col class="text-right mt-3">
            <v-btn outlined rounded color="info" @click="updateBooking()">
              <v-icon>check</v-icon>수정
            </v-btn>
            <v-btn outlined rounded color="primary" @click="cancel()">
              <v-icon>close</v-icon>취소
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import service from '@/api/modules/naver/booking.service'

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
    updateBooking () {
      let updateParam = null
      /**
       * 수정하기
       */
      this.validForm(this.$refs.form).then(() => {
        this.$dialog.confirm('수정 하시겠습니까?')
          .then(() => {
            updateParam = this.form
            /**
             * dgns 수정
             */
            if (this.instance.params.isDgns === 'dgns') {
              service.updateDgnsBooking(updateParam).then(res => {
                this.$dialog.alert('수정되었습니다')
                this.close({ data: updateParam[this.instance.params.property] })
              }).catch(() => {
              })
            /**
             * naver 수정
             */
            } else if (this.instance.params.isDgns === 'naver') {
              service.updateNaverBooking(updateParam).then(res => {
                this.$dialog.alert('수정되었습니다')
                this.close({ data: updateParam[this.instance.params.property] })
              }).catch(() => {
              })
            } else {
              service.updateNaverBooking(updateParam).then(res => {
                this.$dialog.alert('수정되었습니다')
                this.close({ data: updateParam })
              }).catch(() => {
              })
            }
          })
      }).catch(() => {
      })
    },
    cancel () {
      this.close()
    }
  }
}
</script>
