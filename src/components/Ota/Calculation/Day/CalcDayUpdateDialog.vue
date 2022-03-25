<template>
  <dialog-base title="정산 일자 수정" :instance="instance">
    <v-form ref="form" lazy-validation v-if="calcDay.ciYmd">
      <h1 class="text-center">
        {{ calcDay.ciYmd | date}}
      </h1>
      <v-row class="pt-6 pb-6" justify="space-around">
        <v-switch
          v-model="calcDay.peakYn"
          color="orange"
          :label="calcDay.peakYn === 'Y' ? '성수기' : '비수기'"
          inset
          true-value="Y"
          false-value="N"
          class="mx-2"
        ></v-switch>
        <v-switch
          v-model="calcDay.wkendYn"
          color="red"
          :label="calcDay.wkendYn === 'Y' ? '주말' : '주중'"
          inset
          true-value="Y"
          false-value="N"
          class="mx-2"
        ></v-switch>
      </v-row>
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
import DialogBase from "@/components/Dialog/DialogBase"

export default {
  name: 'CalcDayUpdateDialog',
  extends: DialogBase,
  data () {
    return {
      calcDay: {
        ciYmd: null,
        peakYn: 'N',
        wkendYn: 'N'
      }
    }
  },
  computed: {
    /**
     * 수정 여부
     */
    isUpdate () {
      const calcDay = this.instance.params.calcDay
      return calcDay && calcDay.ciYmd
    }
  },
  methods: {
    /**
     * 초기화
     */
    init () {
      if (this.isUpdate) {
        this.calcDay = _.cloneDeep(this.instance.params.calcDay)
      }
    },
    /**
     * 저장
     */
    save () {
      this.close({
        calcDay: this.calcDay
      })
    }
  }
}
</script>
