<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    persistent
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable>
    <v-card tile>
      <v-card-title class="pa-0">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="close()">
            <v-icon>close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-title>금액 전송이력 상세</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="close()">Close</v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-container :style="{'min-width': masterData.sendStatus === 'R' ? '1500px' : ''}">
          <v-layout class="headline mb-2">
            <v-icon>business</v-icon>&nbsp;사업장 : {{ masterData.brcName }} [{{ masterData.brcNo }}]
            <v-spacer></v-spacer>
            <v-icon>business</v-icon>&nbsp;영업장 : {{ masterData.storeName }} [{{ masterData.storeCode }}]
          </v-layout>
          <v-layout class="headline mb-2">
            <v-icon medium>bed</v-icon>&nbsp;TL객실타입 : {{ masterData.tlRmTypeName || '---' }} [{{ masterData.tlNetRmTypeGroupCode }}]
            <v-spacer></v-spacer>
            <v-icon medium>bed</v-icon>&nbsp;객실타입 : {{ masterData.rmTypeName }} [{{ masterData.rmTypeCd }}]
          </v-layout>
          <v-layout class="headline mb-2">
            <v-icon>settings_input_antenna</v-icon>&nbsp;전송상태 : {{ masterData.sendStatusName }} (총 {{ masterData.sendDetailCnt }}개)
          </v-layout>
          <template v-if="dialog && sendNoMst && masterData.sendStatus">
            <send-price-detail-monthly v-if="masterData.sendStatus === 'R'" :dialog="dialog" :send-no="sendNoMst" :max-person-cnt="masterData.maxPersonCnt" @close="close" @refresh="refresh"></send-price-detail-monthly>
            <send-price-detail-list v-else :dialog="dialog" :send-no="sendNoMst"></send-price-detail-list>
          </template>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import sendPriceDetailList from './sendPriceDetailList.vue'
import sendPriceDetailMonthly from './sendPriceDetailMonthly.vue'
import sendPriceService from '@/api/modules/tl/sendPrice.service'

export default {
  components: { sendPriceDetailList, sendPriceDetailMonthly },
  props: ['dialog', 'formData', 'toastData'],
  name: 'sendPriceDetail',
  data () {
    return {
      masterData: {},
      sendNoMst: ''
    }
  },
  methods: {
    close () {
      this.$emit('update:dialog', false)
    },
    refresh () {
      this.$emit('refresh')
    },
    getMstData () {
      sendPriceService.selectMst(this.sendNoMst).then(res => {
        this.masterData = res.data
      })
    }
  },
  mounted () {
    this.sendNoMst = this.formData.sendNo || this.toastData.bindParam1 || ''
    this.getMstData()
  }
}
</script>
