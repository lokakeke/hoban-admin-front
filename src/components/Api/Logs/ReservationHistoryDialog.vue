<template>
    <dialog-base :instance="instance" :title="'API 예약 이력 상세 정보'">
        <v-row>
            <v-col cols="6">
                <v-label>유입경로</v-label>
                <v-text-field v-model="item.path" label="" readonly></v-text-field>
            </v-col>
            <v-col cols="6">
                <v-label>IP 주소</v-label>
                <v-text-field v-model="item.ip" label="" readonly></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6">
                <v-label>요청 시간</v-label>
                <v-text-field v-model="item.requestDatetime" label="" readonly></v-text-field>
            </v-col>
            <v-col cols="6">
                <v-label>응답 시간</v-label>
                <v-text-field v-model="item.responseDatetime" label="" readonly></v-text-field>
            </v-col>
        </v-row>
            <v-row>
                <v-col cols="12">
                    <v-card outlined>
                        <v-card-title class="pb-0 pt-2">
                            요청 파라미터
                        </v-card-title>
                        <v-textarea :value="JSON.stringify(item.parameter, undefined, 2)" rows="10" class="pt-0 pa-4" hide-details readonly
                                    no-resize></v-textarea>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-card outlined>
                        <v-card-title class="pb-0 pt-2">
                            예약정보
                        </v-card-title>
                        <v-textarea :value="JSON.stringify(item.reservationModel,undefined,2)" rows="10" class="pt-0" hide-details readonly
                                    no-resize></v-textarea>
                    </v-card>
                </v-col>
            </v-row>
        <template v-slot:actions>
            <v-btn outlined rounded color="primary" @click="close">닫기(ESC)</v-btn>
        </template>
    </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'ReservationHistoryDialog',
  data () {
    return {
      progress: false,
      resultItem: {
        resultCode: '',
        resultMsg: ''
      },
      item: {}
    }
  },
  mounted () {
    this.item = this.instance.params.item
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [
        {
          target: 'escape',
          action: this.close
        }
      ]
    })
  },
  methods: {}
}
</script>
