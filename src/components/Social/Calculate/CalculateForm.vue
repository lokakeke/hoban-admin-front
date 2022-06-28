<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      {{steps[step-1].title}}
    </template>
    <v-stepper v-model="step">
      <v-stepper-header>
          <template v-for="items in steps">
              <v-stepper-step :key="items.stepIndex" :complete="step > items.stepIndex" :step="items.stepIndex" editable>
                  {{items.title}}
              </v-stepper-step>
              <v-divider v-if="items.stepIndex != (steps.length)" :key="items.component"></v-divider>
          </template>
      </v-stepper-header>
      <v-row>
          <v-col cols="12" class="pt-0">
              <v-card tile>
                  <div v-if="data.calcInd && data.partnerName">
                      <v-card-title>
                          정산 정보
                      </v-card-title>
                      <v-card-text class="subtitle-1">
                          <span class="mr-10">정산 구분 : <span class="font-weight-bold">{{data.calcInd === 'A' ? '월정산' : '딜정산'}}</span></span>
                          <span class="mr-10">업체 명 : <span class="font-weight-bold">{{data.partnerName}}</span></span>
                      </v-card-text>
                  </div>
              </v-card>
          </v-col>
      </v-row>

      <template>
        <v-stepper-items v-for="(item, index) in steps" :key="index">
            <v-stepper-content :step="item.stepIndex" class="pt-0">
                <v-card min-height="725">
                    <component
                            v-if="step == item.stepIndex"
                            :is="item.component"
                            :data="data"
                            :close="close"
                            class="pt-0"></component>
                </v-card>
            </v-stepper-content>
        </v-stepper-items>
      </template>
    </v-stepper>
  </dialog-base>
</template>

<script>
import CalculateSum from './CalculateSum'
import Invoice from './Invoice'
import InvoiceM from './InvoiceM'
import TicketBlackacre from './TicketBlackacre'
import TicketDist from './TicketDist'
import RoomDist from './RoomDist'
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  components: { CalculateSum, Invoice, InvoiceM, TicketBlackacre, TicketDist, RoomDist },
  name: 'CalculateForm',
  data () {
    return {
      data: {},
      step: 1
    }
  },
  computed: {
    steps () {
      if (this.isPartner) {
        return [
          { title: '총계', component: 'CalculateSum', stepIndex: 1 },
          { title: '인보이스', component: this.data.calcInd === 'A' ? 'InvoiceM' : 'Invoice', stepIndex: 2 },
          { title: '갑지', component: 'TicketBlackacre', stepIndex: 3 }
        ]
      } else {
        return [
          { title: '총계', component: 'CalculateSum', stepIndex: 1 },
          { title: '인보이스', component: this.data.calcInd === 'A' ? 'InvoiceM' : 'Invoice', stepIndex: 2 },
          { title: '갑지', component: 'TicketBlackacre', stepIndex: 3 },
          { title: '배분', component: this.data.rmYn === 'N' ? 'TicketDist' : 'RoomDist', stepIndex: 4 }
        ]
      }
    }
  },
  mounted () {
    this.data = this.instance.params.info
  },
  methods: {
  }
}
</script>

<style>
  .sum-row td {
    font-size: 13px;
    font-weight: bold;
  }
</style>
