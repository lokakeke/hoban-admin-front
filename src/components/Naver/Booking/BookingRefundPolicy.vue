<template>
  <dialog-base :instance="instance"
    :title="getStatus(instance.params.status, 'refund')">
    <template v-slot:buttons>
      <v-btn dark text @click="updateState()">
        <v-icon left>check</v-icon>
        {{ getStatus(instance.params.status, 'refund') }}
      </v-btn>
    </template>
    <v-form ref="form" v-if="form && panel && statusRadioSelected && status" lazy-validation>
      <v-card-text class="pa-2">
        <v-row class="mx-auto">
          <v-col cols="12" class="pa-0">
            <v-card class="pl-5 pr-5" style="box-shadow: none;">
              <v-list-item two-line>
                <v-list-item-avatar
                  size="80"
                  :style="{'background':getStatus(form.status, 'bgcolor'), 'color':getStatus(form.status, 'color')}"
                  class="font-weight-bold title"
                >{{ getStatus(form.status, 'text') }}</v-list-item-avatar>
                <v-list-item-content class="pa-0">
                  <v-card-text class="pa-0 pl-2">
                    <v-card-title class="font-weight-bold pa-0 ml-2">
                      {{ form.name }}
                    </v-card-title>
                  </v-card-text>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
          <v-divider></v-divider>
        </v-row>
        <v-row>
          <!-- 예약자-->
          <v-col cols="4" class="pt-0 pb-0">
            <div class="text-right subtitle-1 pt-2">
              예약자
            </div>
          </v-col>
          <v-col cols="6" class="pt-0 pb-0">
            <div class="text-left subtitle-1 pt-2 font-weight-bold">
              {{ form.name }}
            </div>
          </v-col>
          <!-- 예약번호-->
          <v-col cols="4" class="pt-0 pb-0">
            <div class="text-right subtitle-1 pt-2">
              예약번호
            </div>
          </v-col>
          <v-col cols="6" class="pt-0 pb-0">
            <div class="text-left subtitle-1 pt-2 font-weight-bold">
              {{ form.bookingId }}
            </div>
          </v-col>
          <!-- 객실-->
          <v-col cols="4" class="pt-0 pb-0">
            <div class="text-right subtitle-1 pt-2">
              객실
            </div>
          </v-col>
          <v-col cols="7" class="pt-0 pb-0">
            <div class="text-left subtitle-1 pt-2 font-weight-bold">
              {{ form.dmItemName }}
            </div>
          </v-col>
          <!-- 이용기간-->
          <v-col cols="4" class="pt-0 pb-0">
            <div class="text-right subtitle-1 pt-2">
              이용기간
            </div>
          </v-col>
          <v-col cols="7" class="pt-0 pb-0">
            <div class="text-left subtitle-1 pt-2 font-weight-bold" style="color:#448AFF;">
              {{ form.startDate | dateSetForMonth(form.endDate) }} <br>
              ({{ form.startDate | dateSetPerDay(form.endDate, 0) }}박
              {{ form.startDate | dateSetPerDay(form.endDate, 1)}}일)
            </div>
          </v-col>
          <!-- 수량-->
          <v-col cols="4" class="pt-0 pb-4">
            <div class="text-right subtitle-1 pt-2">
              수량
            </div>
          </v-col>
          <v-col cols="6" class="pt-0 pb-0">
            <div class="text-left subtitle-1 pt-2 font-weight-bold">
              {{ form.count }}
            </div>
          </v-col>
        </v-row>
        <!-------------------- 여기까지 공통----------------------->
        <!-- 환불기준 or 결제금액 변경-->
        <v-row>
          <v-col cols="12" class="pt-0 pb-0">
            <v-alert dense outlined type="success" class="mt-2 font-sm"
               v-if="status === 'completed'">
              이용완료 시 사용자에게 이용완료 알림이 발송됩니다.
            </v-alert>
            <v-alert dense outlined type="error" class="mt-2 font-sm"
               v-if="status === 'completed'">
              이용완료 시 부분환불 처리는 네이버 파트너센터에 반영이 되지 않습니다.<br />
              네이버 파트너센터에서 `이용완료 & 부분환불` 처리 후 수정 해주시기 바랍니다.<br />
              부분환불 금액이 있을 경우 네이버에 `이용완료` 도 반영되지 않습니다.
            </v-alert>
          </v-col>
          <v-col cols="12" class="pa-0 ma-0">
            <v-expansion-panels v-model="panel" :flat="true" multiple>
              <v-expansion-panel class="border-top-1">
                <v-expansion-panel-header class="pl-3">
                  <div class="text-left title font-weight-bold" style="color:#616161;">
                    {{ status === 'completed' ? '결제금액 변경' : '환불기준' }}
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-radio-group v-model="statusRadioSelected.value" column class="pa-0 ma-0" style="max-height: 250px;">
                    <v-row v-if="status === 'completed'">
                      <v-col cols="12" class="pt-8 pb-9">
                        <v-radio label="변경없음" value="NONE"></v-radio>
                      </v-col>
                    </v-row>
                    <v-row v-else>
                      <v-col cols="12" class="pt-0 pb-0">
                        <v-radio label="전액환불" value="ALL"></v-radio>
                      </v-col>
                      <v-col cols="12" class="pt-3 pb-0">
                        <v-radio label="동의된 환불기준" value="STANDARD"></v-radio>
                      </v-col>
                      <v-col cols="11" class="pt-2 pb-0 pl-4">
                        <v-text-field outlined dense
                        :value="'이용 ' + `${ statusRadioSelected.baseDay === 0 ? '당일 ' : statusRadioSelected.baseDay + '일 전까지 ' }`
                        + statusRadioSelected.rate + '% 환불'" readonly></v-text-field>
                      </v-col>
                      <v-col cols="1" class="pt-3 pl-0">
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on">
                              <v-icon color="grey lighten-1">info</v-icon>
                            </v-btn>
                          </template>
                          <span>
                            <li v-for="policy in policies" :key="policy.baseDay">
                              이용 {{ policy.baseDay === 0 ? '당일 ' : policy.baseDay + '일 전까지 ' }}<br>
                              <span class="pl-1 pr-1" style="background: #BA9F33;">결제금액의 {{ policy.rate }}% 환불</span>
                            </li>
                          </span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="4" class="pt-2 pb-0">
                        <v-radio label="결제금액" value="RATE"></v-radio>
                      </v-col>
                      <v-col cols="8" class="pt-0 pb-0">
                        <v-text-field v-model="statusRadioSelected.customRate"
                          outlined dense placeholder="정률" suffix="% 환불" v-mask="'########'"></v-text-field>
                      </v-col>
                      <v-col cols="4" class="pt-2 pb-0">
                        <v-radio label="결제금액" value="PRICE"></v-radio>
                      </v-col>
                      <v-col cols="8" class="pt-0 pb-0">
                        <v-currency-field v-model="statusRadioSelected.customPrice"
                          outlined dense placeholder="정액" suffix="원 환불" v-mask="'########'"></v-currency-field>
                      </v-col>
                    </v-row>
                  </v-radio-group>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <!-- 결제/환불정보-->
              <v-expansion-panel class="border-top-1 border-bottom-1">
                <v-expansion-panel-header class="pl-3">
                  <div class="text-left title font-weight-bold" style="color:#616161;">
                  결제/환불정보
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row>
                    <!-- 결제상태-->
                    <v-col cols="4" class="pt-0 pb-0">
                      <div class="text-right subtitle-1 pt-2">
                        결제상태
                      </div>
                    </v-col>
                    <v-col cols="6" class="pt-2 pb-0">
                      <v-chip label small>{{ getStatus (form.status, 'state') }}</v-chip>
                    </v-col>
                    <!-- 결제금액-->
                    <v-col cols="4" class="pt-0 pb-0">
                      <div class="text-right subtitle-1 pt-2">
                        결제금액
                      </div>
                    </v-col>
                    <v-col cols="6" class="pt-0 pb-0">
                      <div class="text-left subtitle-1 pt-2 font-weight-bold">
                        {{ form.price | price }}
                      </div>
                    </v-col>
                    <!-- 환불금액-->
                    <v-col cols="4" class="pt-0 pb-0">
                      <div class="text-right subtitle-1 pt-2">
                        환불금액
                      </div>
                    </v-col>
                    <v-col cols="6" class="pt-0 pb-0">
                      <div class="text-left subtitle-1 pt-2" style="color:red;">
                        <span>{{ refundVal.price | price }}</span>
                        <span>({{ Math.floor(refundVal.rate * 100) / 100 }}%)</span>
                      </div>
                    </v-col>
                    <!-- 취소수수료-->
                    <v-col cols="4" class="pt-0 pb-0">
                      <div class="text-right subtitle-1 pt-2">
                        취소수수료
                      </div>
                    </v-col>
                    <v-col cols="6" class="pt-0 pb-0">
                      <div class="text-left subtitle-1 pt-2" style="color:red;">
                        <span>{{ refundVal.fees | price }} 원</span>
                      </div>
                    </v-col>
                    <v-col cols="12" class="pt-0 pb-0">
                      <v-alert dense outlined type="success" class="mt-2 font-sm"
                      v-if="status === 'noshow' || status === 'cancelled'">
                        고객에게 취소수수료를 제외한 환불금액을 안내합니다.
                      </v-alert>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
        <!-- 노쇼 안내 or 관리자취소 사유-->
        <v-row v-if="instance.params.status !== 'completed'">
          <v-col cols="12" class="pt-1 pb-0">
            <div class="text-left title font-weight-bold pt-2">
              {{ instance.params.status === 'noshow' ? '노쇼 안내' : '관리자취소 사유' }}
            </div>
          </v-col>
          <v-col cols="12" class="text-left pb-0">
            <v-textarea outlined dense
              v-model="cancelledDesc"
              :placeholder="'고객에게 안내할 '
              + `${ status === 'noshow' ? '노쇼 문구' : '취소 사유' }`
              + '를 필수로 입력해 주세요(최대 500자)'"
              counter="500"
              :rules="betweenLengthRules(1,500)"
            ></v-textarea>
          </v-col>
          <v-col cols="12" class="pt-0 pb-0" v-if="instance.params.status !== 'completed'">
            <v-alert dense outlined type="success" class="mt-2 font-sm">
              {{ instance.params.status === 'noshow' ?
              '노쇼처리 시 작성된 노쇼 안내' : '예약취소 시 작성된 취소 사유' }}를
              포함해 사용자에게 알림이 발송됩니다.
            </v-alert>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-right mt-3 pt-5">
            <v-btn outlined rounded color="info" @click="updateState()">
              <v-icon>check</v-icon>{{ getStatus (instance.params.status, 'refund') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import service from '@/api/modules/naver/booking.service'
import { mapGetters } from 'vuex'

export default {
  extends: DialogBase,
  name: 'BookingRefundPolicy',
  components: {},
  data: () => ({
    /**
     * 환불상태
     */
    status: null,
    /**
     * 예약자 정보
     */
    form: null,
    /**
     * 환불정책 조회
     */
    policies: null,
    /**
     * standard 환불정책 조회
     */
    standard: null,
    /**
     * 환불기준, 결제금액변경 panel: [0, 1]이면 open, [2]이면 close
     */
    panel: null,
    /**
     * 선택된 상태값
     */
    statusRadioSelected: null,
    /**
     * 노쇼 안내, 취소 사유
     */
    cancelledDesc: null
  }),
  computed: {
    ...mapGetters({
      setStatus: 'naver/setStatus'
    }),
    /**
     * 환불가능 일수 조회를 위한 날짜 계산
     */
    refundPerDate () {
      return moment(this.form.startDate).diff(moment().format('YYYY-MM-DD'), 'days')
    },
    /**
     * 환불금액, 비율, 수수료 계산
     */
    radioSelected () {
      const value = {
        all: '100',
        standard: this.statusRadioSelected.rate, // standard일 땐 값이 여러 경우일 수 있으므로 변수를 넣음, 처음 화면 초기화(inits) 할때 값 지정
        none: '0'
      }
      return value
    },
    refundVal () { // <결제/환불정보>칸의 결제금액, 환불금액, 취소 수수료는 커스텀 될 수 있으므로 경우의 수를 나눔
      let refundVal = {}
      if (this.statusRadioSelected.value === 'RATE') { // 비율로 계산할 때
        refundVal = {
          price: this.form.price * (this.statusRadioSelected.customRate / 100),
          rate: (this.statusRadioSelected.customRate),
          fees: this.form.price - (this.form.price * (this.statusRadioSelected.customRate / 100))
        }
      } else if (this.statusRadioSelected.value === 'PRICE') { // 가격으로 계산할 때
        refundVal = {
          price: this.statusRadioSelected.customPrice,
          rate: (this.statusRadioSelected.customPrice / this.form.price * 100),
          fees: this.form.price - (this.statusRadioSelected.customPrice)
        }
      } else { // 그 비율이나 가격으로 커스텀 되지 않을 때(동의된 환불기준을 따를 때)
        refundVal = {
          price: this.form.price * (this.radioSelected[this.statusRadioSelected.value.toLowerCase()] / 100),
          rate: (this.radioSelected[this.statusRadioSelected.value.toLowerCase()]),
          fees: this.form.price - (this.form.price * (this.radioSelected[this.statusRadioSelected.value.toLowerCase()] / 100))
        }
      }
      return refundVal
    }
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{
        target: 'escape',
        action: this.close
      }]
    })
    this.inits() // 여러가지 수치들 초기화
    this.form = this.instance.params.form // 팝업을 열면서 전달받은 값 삽입(필요한 모든 정보를 담은 객체)
    this.status = this.instance.params.status // 팝업을 열면서 전달받은 환불기준 값 삽입(단순 구분용)
    this.instance.params.status === 'completed' ? this.panel = [2] : this.panel = [0, 1] // panel 구분용

    // 노쇼시 기본 문구 노출
    if (this.status === 'noshow') {
      this.cancelledDesc = '예약하신 시간에 방문하지 못해 취소되었습니다. 다시 뵙기를 기대하며 예약 후 방문이 어려우시면 사전에 취소 부탁드립니다.'
    }
  },
  methods: {
    getStatus (status, idx) {
      return !status ? '(없음)' : this.setStatus[status][idx]
    },
    /**
     * 리스트 조회
     */
    async inits () {
      try {
        const res = await service.selectBookingRefundPolicies(this.instance.params.form)
        this.standard = res.data.standard
        this.policies = res.data.policies
      } catch (e) {
        this.$dialog.confirm(e)
      }
      /**
       * radio button value 지정
       */
      // 조건에 따른 radio button을 활성화 시키도록 한다
      if (this.status === 'completed') {
        this.statusRadioSelected = {
          value: 'NONE',
          baseDay: 0,
          rate: 0,
          customRate: 0,
          customPrice: 0
        }
      } else if (this.status === 'noshow' || this.status === 'cancelled') {
        this.statusRadioSelected = {
          value: 'STANDARD',
          baseDay: this.standard.baseDay,
          rate: this.standard.rate,
          customRate: 0,
          customPrice: 0
        }
      } else {
        this.statusRadioSelected = {
          value: '',
          baseDay: 0,
          rate: 0,
          customRate: 0,
          customPrice: 0
        }
      }
    },
    /**
     * refundState 수정하기
     */
    updateState () {
      this.validForm(this.$refs.form).then(() => {
        if (this.refundVal.fees < 0) { // 취소 수수료 음수인 경우 방지
          this.$dialog.alert('결제 금액보다 환불 금액이 높을 수 없습니다.')
        } else {
          let message = this.getStatus(this.status, 'refund') + ' 처리 하시겠습니까?'
          if (this.status === 'completed' && (this.refundVal.price > 0 || this.refundVal.rate > 0)) {
            message = '이용완료 시 부분환불 처리는 네이버 파트너센터에 반영이 되지 않습니다.<br />' + message
          } else if (this.status === 'completed' && this.refundPerDate > 0) {
            message = '이용일이 도래하지 않았습니다. ' + message
          }
          this.$dialog.confirm(message).then(() => {
            let param = null
            if (this.status === 'noshow' || this.status === 'cancelled') {
              param = {
                businessId: this.form.businessId,
                bizItemId: this.form.bizItemId,
                bookingId: this.form.bookingId,
                status: this.status,
                dateTime: '',
                // 네이버 메모에 관리자 취소사유 추가
                memo: (!this.form.memo ? '' : this.form.memo + ' / ') + '(관리자취소사유[' + moment().format('YYYY-MM-DD') + ']): ' + this.cancelledDesc,
                cancelledDesc: this.cancelledDesc,
                cancelledBy: 'owner',
                cancelledDateTime: '',
                refundPrice: this.refundVal.price,
                refundRate: this.refundVal.rate,
                refundType: this.statusRadioSelected.value
              }
            } else if (this.status === 'completed') {
              param = {
                businessId: this.form.businessId,
                bizItemId: this.form.bizItemId,
                bookingId: this.form.bookingId,
                status: this.status,
                dateTime: '',
                completedDateTime: '',
                completedId: 'owner',
                refundPrice: this.refundVal.price,
                refundRate: this.refundVal.rate,
                refundType: this.statusRadioSelected.value === 'NONE' ? '' : this.statusRadioSelected.value
              }
            }
            service.updateBookingStates(param).then(res => {
              this.$dialog.alert(`${this.getStatus(this.status, 'refund')}` + ' 처리가 완료되었습니다')
              this.close({ data: param })
              this.instance.params.search()
            }).catch(() => { this.close() })
          }).catch(() => {})
        }
      }).catch(() => {})
    }
  }
}
</script>
