<template>
    <dialog-base :instance="instance" :title="'API 이력 상세 정보'">
        <v-row>
            <v-col>
                <v-label>TOKEN</v-label>
                <v-textarea no-resize rows="2" v-model="item.token"  readonly></v-textarea>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6">
                <v-label>URL</v-label>
                <v-text-field v-model="item.url"  readonly></v-text-field>
            </v-col>
            <v-col cols="6">
                <v-label>요청 일시</v-label>
                <v-text-field v-model="item.createDatetime"  readonly></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col sm="6" md="4">
                <v-label>Business Id</v-label>
                <v-text-field v-model="item.businessId"  readonly></v-text-field>
            </v-col>
            <v-col sm="6" md="4">
                <v-label>IP 주소</v-label>
                <v-text-field v-model="item.ip"  readonly></v-text-field>
            </v-col>
            <v-col sm="6" md="4">
                <v-label>METHOD</v-label>
                <v-text-field v-model="item.method"  readonly></v-text-field>
            </v-col>
            <v-col sm="6" md="4">
                <v-label>시스템 구분</v-label>
                <v-text-field v-model="item.systemDivision"  readonly></v-text-field>
            </v-col>
            <v-col sm="6" md="4">
                <v-label>서비스 구분</v-label>
                <v-text-field v-model="item.serviceDivision"  readonly></v-text-field>
            </v-col>
            <v-col sm="6" md="4">
                <v-label>결과 코드</v-label>
                <v-text-field v-model="item.resultCode"  readonly></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-label>결과 메시지</v-label>
                <v-text-field v-model="item.resultMsg"  readonly></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-card outlined>
                    <v-card-title class="pb-0 pt-2">
                        파라미터 목록
                    </v-card-title>
                    <v-textarea :value="JSON.stringify(item.params,undefined, 2)" rows="10" class="pt-0 pa-4" hide-details no-resize></v-textarea>
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
                <v-text-field v-model="resultItem.resultCode"  readonly></v-text-field>
            </v-col>
            <v-col sm="6" md="4">
                <v-label>호출 결과메시지</v-label>
                <v-text-field v-model="resultItem.resultMsg"  readonly></v-text-field>
            </v-col>
        </v-row>
        <template v-slot:actions>
            <v-btn outlined rounded color="primary" @click="close">닫기(ESC)</v-btn>
        </template>
    </dialog-base>
</template>

<script>
import apiLogService from '@/api/modules/api/apiLog.service'
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'HistoryDialog',
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
  created () {
    console.log('CRE')
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
        apiLogService.selectPostApiCallAgain(this.item.url, this.item.token, JSON.parse(this.item.params)).then(res => {
          this.resultItem.resultCode = res.data.resultCode
          this.resultItem.resultMsg = res.data.resultMsg
        })
      } else if (this.item.method === 'GET') {
        apiLogService.selectGetApiCallAgain(this.item.url, this.item.token, JSON.parse(this.item.params)).then(res => {
          this.resultItem.resultCode = res.data.resultCode
          this.resultItem.resultMsg = res.data.resultMsg
        })
      }
    }
  }
}
</script>
