<template>
    <dialog-base :instance="instance" :title="'Tl API 이력 상세 정보'">
        <v-row>
            <v-col>
                <v-label>Tl 예약 번호</v-label>
                <v-text-field :value="item.travelRsvNos" label="" readonly></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-label>요청 시간</v-label>
                <v-text-field :value="item.createDatetime" label="" readonly></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-label>요청 메시지</v-label>
                <v-textarea no-resize rows="6" :value="item.requestBody" label="" readonly></v-textarea>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <v-label>응답 메시지</v-label>
                <v-textarea no-resize rows="6" :value="item.responseBody" label="" readonly></v-textarea>
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
  name: 'tlApiLogDialog',
  data () {
    return {
      progress: false,
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
  }
}
</script>
