<template>
    <dialog-base :instance="instance" :title="'API 이력 상세 정보'">
        <v-row>
            <v-col>
                <v-label>TOKEN</v-label>
                <v-textarea no-resize rows="2" v-model="item.token" label="" readonly></v-textarea>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6">
                <v-label>URL</v-label>
                <v-text-field v-model="item.url" label="" readonly></v-text-field>
            </v-col>
            <v-col cols="6">
                <v-label>요청 일시</v-label>
                <v-text-field v-model="item.crtDt" label="" readonly></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col sm="6" md="4">
                <v-label>Business Id</v-label>
                <v-text-field v-model="item.businessId" label="" readonly></v-text-field>
            </v-col>
            <v-col sm="6" md="4">
                <v-label>IP 주소</v-label>
                <v-text-field v-model="item.ip" label="" readonly></v-text-field>
            </v-col>
            <v-col sm="6" md="4">
                <v-label>METHOD</v-label>
                <v-text-field v-model="item.method" label="" readonly></v-text-field>
            </v-col>
            <v-col sm="6" md="4">
                <v-label>시스템 구분</v-label>
                <v-text-field v-model="item.systemDivision" label="" readonly></v-text-field>
            </v-col>
            <v-col sm="6" md="4">
                <v-label>서비스 구분</v-label>
                <v-text-field v-model="item.serviceDivision" label="" readonly></v-text-field>
            </v-col>
            <v-col sm="6" md="4">
                <v-label>결과 코드</v-label>
                <v-text-field v-model="item.resultCode" label="" readonly></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-label>결과 메시지</v-label>
                <v-text-field v-model="item.resultMsg" label="" readonly></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-card outlined>
                    <v-card-title class="pb-0 pt-2">
                        파라미터 목록
                    </v-card-title>
                    <v-textarea v-model="item.params" rows="10" class="pt-0" hide-details no-resize></v-textarea>
                </v-card>
            </v-col>
            <v-col v-if="!isPartner" cols="12" class="text-right">
                <v-btn outlined rounded @click="call" color="success">
                    <v-icon left>notification_important</v-icon>
                    호출
                </v-btn>
            </v-col>
        </v-row>
        <v-row v-if="progress">
            <v-col sm="6" md="4">
                <v-label>호출 결과코드</v-label>
                <v-text-field v-model="resultItem.resultCode" label="" readonly></v-text-field>
            </v-col>
            <v-col sm="6" md="4">
                <v-label>호출 결과메시지</v-label>
                <v-text-field v-model="resultItem.resultMsg" label="" readonly></v-text-field>
            </v-col>
        </v-row>
        <template v-slot:actions>
            <v-btn outlined rounded color="primary" @click="close">닫기(ESC)</v-btn>
        </template>
    </dialog-base>
</template>

<script>
import service from 'Api/modules/api/apiHistory.service'
import DialogBase from 'Components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'HistoryManagementDialog',
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
  methods: {
    call () {
      this.progress = true
      if (this.item.method === 'POST') {
        service.selectPostApiCallAgain(this.item.url, this.item.token, JSON.parse(this.item.params)).then(res => {
          this.resultItem.resultCode = res.data.resultCode
          this.resultItem.resultMsg = res.data.resultMsg
        })
      } else if (this.item.method === 'GET') {
        service.selectGetApiCallAgain(this.item.url, this.item.token, JSON.parse(this.item.params)).then(res => {
          this.resultItem.resultCode = res.data.resultCode
          this.resultItem.resultMsg = res.data.resultMsg
        })
      }
    }
  }
}
</script>
