<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      {{steps[step-1].title}}
    </template>
    <v-stepper v-model="step">
      <v-stepper-header>
          <template v-for="items in steps">
              <v-stepper-step :key="items.stepIndex" :complete="step > items.stepIndex" :step="items.stepIndex" :editable="complete">
                  {{items.title}}
              </v-stepper-step>
              <v-divider v-if="items.stepIndex != (steps.length)" :key="items.component"></v-divider>
          </template>
      </v-stepper-header>
      <v-row>
          <v-col cols="12" class="pt-0">
              <v-card tile>
                  <div v-if="data.ticketNo && data.ticketNm">
                      <v-card-title>
                          업체 정보
                      </v-card-title>
                      <v-card-text class="subtitle-1">
                          <span class="mr-10">우대번호 : <span class="font-weight-bold">{{data.ticketNo}}</span></span>
                          <span class="mr-10">우대번호 명 : <span class="font-weight-bold">{{data.ticketNm}}</span></span>
                          <span class="mr-10">판매 업체 명 : <span class="font-weight-bold">{{data.ptnrNm}}</span></span>
                      </v-card-text>
                  </div>
                  <div v-else>
                      <v-card-title class="subtitle-1">
                          우대번호를 등록해 주세요.
                      </v-card-title>
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
                            :data.sync="data"
                            :close="changeClose"
                            :complete.sync="complete"
                            class="pt-0"></component>
                </v-card>
            </v-stepper-content>
        </v-stepper-items>
      </template>
    </v-stepper>
  </dialog-base>
</template>

<script>
import TicketRegForm1 from './TicketRegForm1'
import TicketRegForm2 from './TicketRegForm2'
import TicketRegForm3 from './TicketRegForm3'
import TicketRegForm4 from './TicketRegForm4'
import TicketRegForm5 from './TicketRegForm5'
import DialogBase from 'Components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  components: { TicketRegForm1, TicketRegForm2, TicketRegForm3, TicketRegForm4, TicketRegForm5 },
  name: 'TicketRegForm',
  data () {
    return {
      search: Function,
      complete: false, // 1 page 등록 여부
      step: 1, // 우대번호 등록관리 step
      data: {}
    }
  },
  computed: {
    steps () {
      if (this.isPartner) {
        return [
          { title: '우대번호 정보등록', component: 'TicketRegForm1', stepIndex: 1 },
          { title: '업체상품 정보등록', component: 'TicketRegForm4', stepIndex: 2 }
        ]
      } else {
        return [
          { title: '우대번호 정보등록', component: 'TicketRegForm1', stepIndex: 1 },
          { title: '정산 정보 등록', component: 'TicketRegForm2', stepIndex: 2 },
          { title: '통계 정보 등록', component: 'TicketRegForm3', stepIndex: 3 },
          { title: '업체상품 정보등록', component: 'TicketRegForm4', stepIndex: 4 }
        ]
      }
    }
  },
  mounted () {
    this.complete = this.instance.params.complete
    this.search = this.instance.params.search
    if (this.complete) {
      // 수정
      this.data = {
        status: 'modify',
        ticketNo: this.instance.params.info.ticketNo,
        ticketNm: this.instance.params.info.ticketNm,
        ptnrNm: this.instance.params.info.ptnrNm,
        ptnrNo: this.instance.params.info.ptnrNo
      }
    } else {
      // 초기값
      this.data = {
        status: 'regist'
      }
    }
  },
  methods: {
    // 데이터 변경 후 리스트 재 조회
    changeClose () {
      this.search()
      this.close()
    }
  }
}
</script>
