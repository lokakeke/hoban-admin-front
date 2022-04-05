<template>
  <dialog-base title="검색조건" :instance="instance">
    <v-form ref="form">
      <v-row>
        <v-col>
          <v-text-field
            v-model="form.memNo"
            label="회원번호"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.memName"
            label="회원명"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.ciYmd"
            label="입실일자"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.roomNo"
            label="객실번호"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="form.accruedAmt"
            label="발생금액"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.rsvNo"
            label="예약번호"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="form.keyRsvNo"
            label="KEY예약번호"
          />
        </v-col>
        <v-col>
        </v-col>
      </v-row>
      <v-row>
        <v-col align-self="center" class="text-right pl-0">
          <v-btn outlined rounded color="green" @click="init">
           <v-icon left>refresh</v-icon>초기화(F4)
          </v-btn>
          <v-btn outlined rounded color="green" @click="save">
           <v-icon left>save</v-icon>저장(F10)
          </v-btn>
          <v-btn outlined rounded color="primary" @click="close">
           닫기(ESC)
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  name: 'SearchDialog',
  extends: DialogBase,
  data () {
    return {
      form: {
        memNo: '',
        memName: '',
        ciYmd: '',
        roomNo: '',
        accruedAmt: '',
        rsvNo: '',
        keyRsvNo: ''
      },
      orgForm: {
        memNo: '',
        memName: '',
        ciYmd: '',
        roomNo: '',
        accruedAmt: '',
        rsvNo: '',
        keyRsvNo: ''
      }
    }
  },
  mounted () {
    this.initInfo()
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [
        {
          target: 'F4',
          action: this.init
        },
        {
          target: 'F10',
          action: this.save
        }
      ]
    })
  },
  methods: {
    /**
     * 검색조건 > 저장
     */
    save () {
      this.close({ data: this.form })
    },
    /**
     * 검색조건 > 기본정보 초기화
     */
    initInfo () {
      this.form.memNo = this.instance.params.memNo
      this.form.memName = this.instance.params.memName
      this.form.ciYmd = this.instance.params.ciYmd
      this.form.roomNo = this.instance.params.roomNo
      this.form.accruedAmt = this.instance.params.accruedAmt
      this.form.rsvNo = this.instance.params.rsvNo
      this.form.keyRsvNo = this.instance.params.keyRsvNo
    },
    /**
     * 검색조건 > 초기화
     */
    init () {
      this.form = _.cloneDeep(this.orgForm)
    }
  }
}
</script>
