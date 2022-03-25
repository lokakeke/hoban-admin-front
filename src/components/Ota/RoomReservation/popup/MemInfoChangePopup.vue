<template>
  <dialog-base :instance="instance" :title="'고객 정보 변경'">
    <v-form ref="form" lazy-validation autocomplete="off">
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="origin.chainRsvNo"
            label="업체예약번호"
            outlined
            hide-details
            dense
            disabled
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="origin.guestNm"
            label="이용자명"
            outlined
            hide-details
            dense
            disabled
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="origin.smsPhone"
            label="이용자연락처"
            outlined
            hide-details
            dense
            disabled
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="newInfo.chainRsvNo"
            label="업체예약번호"
            outlined
            hide-details
            dense
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="newInfo.guestLnm"
            label="이용자명"
            outlined
            hide-details
            dense
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="newInfo.smsPhone"
            label="이용자연락처"
            outlined
            hide-details
            dense
            v-mask="['###-####-####', '###-###-####']"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-right">
          <v-btn outlined rounded color="blue" @click="save">저장(F10)</v-btn>
          <v-btn outlined rounded color="primary" @click="close">닫기(ESC)</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'MemInfoChangePopup',
  data () {
    return {
      origin: {}, // 기존정보
      newInfo: {} // 새로운 정보
    }
  },
  mounted () {
    this.origin = _.cloneDeep(this.instance.params.origin)
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
    save () {
      this.close({ data: this.newInfo })
    }
  }
}
</script>
