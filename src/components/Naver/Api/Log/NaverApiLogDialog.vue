<template>
    <dialog-base :instance="instance" :title="'NAVER API 이력 상세 정보'">
        <v-row>
            <v-col>
                <v-label>요청 URL명</v-label>
                <v-text-field :value="item.reqsUriName" label="" readonly></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-label>요청 URL</v-label>
                <v-text-field :value="item.reqsUri" label="" readonly></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-label>요청 QueryString</v-label>
                <v-text-field :value="item.reqsParams" label="" readonly></v-text-field>
<!--                <v-text-field :value="JSON.stringify(item.reqsParams, undefined, 2)" label="" readonly></v-text-field>-->
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-label>요청 헤더</v-label>
                <v-text-field :value="item.reqsHeader" label="" readonly></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-label>요청 메세지</v-label>
                <v-textarea no-resize rows="6" :value="item.reqsMsg" label="" readonly></v-textarea>
            </v-col>
        </v-row>
        <v-row>
            <v-col sm="6" md="4">
                <v-label>요청 타입</v-label>
                <v-text-field :value="item.reqsType" label="" readonly></v-text-field>
            </v-col>
            <v-col sm="6" md="4">
                <v-label>IP 주소</v-label>
                <v-text-field :value="item.createIp" label="" readonly></v-text-field>
            </v-col>
            <v-col sm="6" md="4">
                <v-label>등록 ID</v-label>
                <v-text-field class="pt-0 pa-4" :value="item.createId" label="" readonly></v-text-field>
            </v-col>
            <v-col sm="6" md="4">
                <v-label>응답 코드</v-label>
                <v-text-field class="pt-0 pa-4" :value="item.rspnsCode" label="" readonly></v-text-field>
            </v-col>
<!--            <v-col sm="6" md="4">-->
<!--                <v-label>등록 MAC</v-label>-->
<!--                <v-text-field :value="item.createMac" label="" readonly></v-text-field>-->
<!--            </v-col>-->
        </v-row>
        <v-row>
            <v-col>
                <v-label>응답 헤더</v-label>
                <v-text-field :value="item.rspnsHeader" label="" readonly></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-label>응답 메시지</v-label>
                <v-textarea class="pt-0 pa-4" no-resize rows="6" :value="item.rspnsMsg" label="" readonly></v-textarea>
<!--                <v-textarea class="pt-0 pa-4" no-resize rows="6" :value="JSON.stringify(item.rspnsMsg, undefined, 2)" label="" readonly></v-textarea>-->
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
  name: 'naverApiLogDialog',
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
