<template>
    <dialog-base :instance="instance" :title="'NAVER API 이력 상세 정보'">
        <v-row>
            <v-col>
                <v-label>요청 URL명</v-label>
                <v-text-field v-model="item.reqsUriName" label="" readonly></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-label>요청 URL</v-label>
                <v-text-field v-model="item.reqsUri" label="" readonly></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-label>요청 QueryString</v-label>
                <v-text-field v-model="item.reqsParams" label="" readonly></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-label>요청 헤더</v-label>
                <v-text-field v-model="item.reqsHeader" label="" readonly></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-label>요청 메세지</v-label>
                <v-textarea no-resize rows="6" v-model="item.reqsMsg" label="" readonly></v-textarea>
            </v-col>
        </v-row>
        <v-row>
            <v-col sm="6" md="4">
                <v-label>요청 타입</v-label>
                <v-text-field v-model="item.reqsType" label="" readonly></v-text-field>
            </v-col>
            <v-col sm="6" md="4">
                <v-label>IP 주소</v-label>
                <v-text-field v-model="item.crtIp" label="" readonly></v-text-field>
            </v-col>
            <v-col sm="6" md="4">
                <v-label>등록 ID</v-label>
                <v-text-field v-model="item.crtId" label="" readonly></v-text-field>
            </v-col>
            <v-col sm="6" md="4">
                <v-label>응답 코드</v-label>
                <v-text-field v-model="item.rspnsCode" label="" readonly></v-text-field>
            </v-col>
            <v-col sm="6" md="4">
                <v-label>등록 MAC</v-label>
                <v-text-field v-model="item.crtMac" label="" readonly></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-label>응답 헤더</v-label>
                <v-text-field v-model="item.rspnsHeader" label="" readonly></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-label>응답 메시지</v-label>
                <v-textarea no-resize rows="6" v-model="item.rspnsMsg" label="" readonly></v-textarea>
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
  name: 'NaverHistoryDialog',
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
