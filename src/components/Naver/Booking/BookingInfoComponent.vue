<template>
    <v-sheet>
        <v-form lazy-validation class="pl-5 pr-5 pb-5" v-if="form">
            <v-row class="pa-2 pt-0">
                <!--실사용자-->
                <v-col cols="4" class="pt-0 pb-0">
                    <div class="text-right subtitle-1 pt-2">
                        <common-tooltip v-if="available" :type="'info'" :position="'top'"
                                        :text="'오른쪽에 위치한 아이콘을 누르면 수정가능합니다. PMS 정보만 수정되니 유의바랍니다.'" />
                        {{ isDgns ? "이용자" : "이용자(예약자)" }}
                    </div>
                </v-col>
                <v-col cols="6" class="pt-0 pb-0">
                    <v-text-field dense v-model.trim="form.name" counter="30" placeholder="실사용자를 입력해주세요."
                                  :rules="betweenLengthRules(1,30).concat(emptyRules)" readonly>
                        <v-icon v-if="available" slot="append" class="float-right ml-1" color="info"
                                @click="updatePopup('dgns', 'name')">edit
                        </v-icon>
                    </v-text-field>
                </v-col>
                <!-- 전화번호-->
                <v-col cols="4" class="pt-0 pb-0">
                    <div class="text-right subtitle-1 pt-2">
                        <common-tooltip v-if="available" :type="'info'" :position="'top'"
                                        :text="'오른쪽에 위치한 아이콘을 누르면 수정가능합니다. PMS 정보만 수정되니 유의바랍니다.'" />
                        전화번호
                    </div>
                </v-col>
                <v-col cols="6" class="pt-0 pb-0">
                    <v-text-field dense v-model="form.phone" placeholder="전화번호를 입력해주세요."
                                  :rules="emptyRules" v-mask="['###-####-####', '###-###-####']" readonly>
                        <v-icon v-if="available" slot="append" class="float-right ml-1" color="info"
                                @click="updatePopup('dgns', 'phone')">edit
                        </v-icon>
                    </v-text-field>
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
                <!-- 예약유형-->
                <v-col cols="4" class="pt-0 pb-0">
                    <div class="text-right subtitle-1 pt-2">
                        예약유형
                    </div>
                </v-col>
                <v-col cols="6" class="pt-0 pb-0">
                    <v-alert dense outlined type="error" class="mt-2 font-sm">
                        [네이버 예약 파트너센터] 에서 확인 / 관리하시기 바랍니다.
                    </v-alert>
                </v-col>
                <!-- 이메일-->
                <v-col cols="4" class="pt-0 pb-0">
                    <div class="text-right subtitle-1 pt-2">
                        이메일
                    </div>
                </v-col>
                <v-col cols="6" class="pt-0 pb-0">
                    <div class="text-left subtitle-1 pt-2 font-weight-bold">
                        {{ form.email ? form.email : "-" }}
                    </div>
                </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- 제목2-->
            <v-row>
                <v-col cols="12" class="pt-0 pb-0">
                    <div class="text-left title font-weight-bold pt-2">
                        예약내역
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <!-- 객실-->
                <v-col cols="4" class="pt-0 pb-0">
                    <div class="text-right subtitle-1 pt-2">
                        객실
                    </div>
                </v-col>
                <v-col cols="8" class="pt-0 pb-0">
                    <div class="text-left subtitle-1 pt-2 font-weight-bold">
                        {{ !isDgns ? form.dmItemName : form.rmTypeName + "(" + form.dmItemName + ")" }}
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
                        {{ form.startDate | dateSetPerDay(form.endDate, 1) }}일)
                    </div>
                </v-col>
                <!-- 수량-->
                <v-col cols="4" class="pt-0 pb-0">
                    <div class="text-right subtitle-1 pt-2">
                        수량
                    </div>
                </v-col>
                <v-col cols="6" class="pt-0 pb-0">
                    <div class="text-left subtitle-1 pt-2 font-weight-bold">
                        {{ form.count }}
                    </div>
                </v-col>
                <!-- 유입경로-->
                <v-col cols="4" class="pt-0 pb-0">
                    <div class="text-right subtitle-1 pt-2">
                        유입경로
                    </div>
                </v-col>
                <v-col cols="6" class="pt-0 pb-0">
                    <v-alert dense outlined type="error" class="mt-2 font-sm">
                        [네이버 예약 파트너센터] 에서 확인 / 관리하시기 바랍니다.
                    </v-alert>
                </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- 제목3-->
            <v-row>
                <v-col cols="12" class="pt-0 pb-0">
                    <div class="text-left title font-weight-bold pt-2">
                        {{ form.refundPrice > 0 && !isDgns ? "결제/환불정보" : "결제정보" }}
                    </div>
                </v-col>
                <!-- 금액-->
                <v-col cols="4" class="pt-0 pb-0">
                    <div class="text-right subtitle-1 pt-2">
                        금액
                    </div>
                </v-col>
                <v-col cols="6" class="pt-0 pb-0">
                    <div class="text-left subtitle-1 pt-2 font-weight-bold">
                        {{ form.price | price }}
                    </div>
                </v-col>
                <v-col cols="12" class="pt-0 pb-0" v-if="(form.status === 'noshow' || form.refundPrice) && !isDgns">
                    <v-row>
                        <!-- 환불금액-->
                        <v-col cols="4" class="pt-0 pb-0">
                            <div class="text-right subtitle-1 pt-2">
                                환불금액
                            </div>
                        </v-col>
                        <v-col cols="6" class="pt-0 pb-0">
                            <div class="text-left subtitle-1 pt-2 font-weight-bold">
                                {{ form.refundPrice | price }} ({{ form.refundRate }}%)
                            </div>
                        </v-col>
                        <!-- 취소수수료-->
                        <v-col cols="4" class="pt-0 pb-0">
                            <div class="text-right subtitle-1 pt-2">
                                취소수수료
                            </div>
                        </v-col>
                        <v-col cols="6" class="pt-0 pb-0">
                            <div class="text-left subtitle-1 pt-2 font-weight-bold red--text">
                                {{ form.price - form.refundPrice | price }}
                            </div>
                        </v-col>
                        <!-- 취소사유-->
                        <v-col cols="4" class="pt-0 pb-0" v-if="form.cancelledDesc">
                            <div class="text-right subtitle-1 pt-2">
                                취소사유
                            </div>
                        </v-col>
                        <v-col cols="6" class="pt-0 pb-0" v-if="form.cancelledDesc">
                            <div class="text-left subtitle-1 pt-2">
                                {{ form.cancelledDesc ? form.cancelledDesc : "(없음)" }}
                            </div>
                        </v-col>
                    </v-row>
                </v-col>
                <!-- 기타-->
                <v-col cols="4" class="pt-0 pb-0">
                    <div class="text-right subtitle-1 pt-2">
                        기타
                    </div>
                </v-col>
                <v-col cols="6" class="pt-0 pb-0">
                    <v-alert dense outlined type="error" class="mt-2 font-sm">
                        [네이버 예약 파트너센터] 에서 확인 / 관리하시기 바랍니다.
                    </v-alert>
                </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- 제목4-->
            <v-row>
                <v-col cols="12" class="pt-0 pb-0">
                    <div class="text-left title font-weight-bold pt-2">
                        예약확정 안내
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" class="text-left">
                    <v-alert dense outlined type="error" class="font-sm">
                        [예약번호 발송안내] <br>
                        영업일(월~금요일 9:00-18:00)기준 이후 구매하신 예약건은 익일 오전9시 이후 순차적으로 발송되오니 양해부탁드립니다.
                    </v-alert>
                </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- 제목5-->
            <v-row>
                <v-col cols="12" class="pt-0 pb-0">
                    <div class="text-left title font-weight-bold pt-2">
                        <common-tooltip :type="'info'" :position="'top'" :text="'오른쪽에 위치한 아이콘을 누르면 수정가능합니다.'" />
                        직원메모<span class="font-sm"> ({{ isDgns ? "PMS " : "네이버 " }}메모만 수정됩니다)</span>
                        <!-- PMS 메모 수정 주석 처리 -->
                        <!--<v-icon v-if="available" slot="append" class="float-right" color="info" @click="updatePopup('dgns', 'memo')">edit</v-icon>
                        <v-icon v-else-if="form.status !== 'noshow' && form.status !== 'cancelled' && form.status !== 'completed'"
                          slot="append" class="float-right" color="info" @click="updatePopup('naver', 'memo')">edit</v-icon>-->
                        <v-icon v-if="!isDgns"
                                slot="append" class="float-right" color="info" @click="updatePopup('naver', 'memo')">
                            edit
                        </v-icon>
                    </div>
                </v-col>
                <v-col cols="12" class="text-left pb-0">
                    <v-textarea outlined dense :rules="maxLengthRules(500)"
                                counter="500" v-model="form.memo" :value="form.memo" readonly
                                placeholder="내부 직원용으로 고객에게 보이지 않는 메모입니다. (최대 500자 입력가능)"
                    ></v-textarea>
                </v-col>
            </v-row>
        </v-form>
    </v-sheet>
</template>

<script>
import {mapGetters} from 'vuex'
import CommonTooltip from '@/components/Common/CommonTooltip.vue'

export default {
  name: 'BookingInfoComponent',
  components: {
    CommonTooltip
  },
  props: {
    /**
         * 예약자 정보
         */
    form: Object,
    /**
         * 초기화
         */
    search: Function,
    /**
         * 네이버 / dgns 구분
         */
    isDgns: Boolean
  },
  data: () => ({
    /**
         * 날짜 설정
         */
    usage: {}
  }),
  computed: {
    ...mapGetters({
      setStatus: 'naver/setStatus'
    }),
    available () {
      return this.isDgns && this.form.status !== 'noshow' && this.form.status !== 'cancelled' && this.form.status !== 'completed'
    }
  },
  methods: {
    /**
         * 업데이트 팝업
         */
    updatePopup (isDgns, property) {
      this.$nextTick(() => {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Naver/Booking/BookingInfoUpdate',
          params: {
            form: this.form,
            /**
                         * dgns / naver
                         */
            isDgns: isDgns,
            /**
                         * 프로퍼티 이름
                         */
            property: property,
            search: this.search,
            disabled: false
          },
          options: {
            fullscreen: false,
            scrollable: true,
            width: 700,
            /**
                         * 정보 갱신하기
                         */
            closeCallback: (params) => {
              if (params) {
                // 수정 사항이 있을 시만 reload
                this.$emit('reload')
              }
            }
          }
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
