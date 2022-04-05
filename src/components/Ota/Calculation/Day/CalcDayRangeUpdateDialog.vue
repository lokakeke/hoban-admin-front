<template>
  <dialog-base :title="titleText" :instance="instance">
    <v-form ref="form" lazy-validation>
      <date-range-picker v-model="form.ciYmdRange" required></date-range-picker>
      <v-row justify="end">
        <v-col cols="12" class="text-center">
          <v-btn outlined rounded color="info" @click="save()">
            <v-icon>check</v-icon>저장
          </v-btn>
          <v-btn outlined rounded color="primary" @click="close()">
            <v-icon>close</v-icon>닫기
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  name: 'CalcDayRangeUpdateDialog',
  extends: DialogBase,
  data () {
    return {
      form: {
        ciYmdRange: ['', '']
      }
    }
  },
  computed: {
    titleText () {
      return `${this.instance.params.typeText} 기간 수정`
    }
  },
  methods: {
    /**
     * 초기화
     */
    init () {
      if (this.instance.params.ciYmdRange && this.instance.params.ciYmdRange.length === 2) {
        this.form.ciYmdRange = _.cloneDeep(this.instance.params.ciYmdRange)
      } else {
        this.close()
        this.$dialog.alert('정산 일자 기간을 수정 할 수 없습니다.')
      }
    },
    /**
     * 저장
     */
    save () {
      this.validForm(this.$refs.form).then(() => {
        this.close({
          ciYmdRange: this.form.ciYmdRange
        })
      })
    }
  }
}
</script>
