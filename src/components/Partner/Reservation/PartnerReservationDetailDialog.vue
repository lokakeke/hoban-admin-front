<template>
  <dialog-base :instance="instance">
      {{ this.selectStore }}
    <template v-slot:title>
      파트너 객실예약 {{isModify? '상세보기' : '신규 신청'}}
      <span v-if="isModify" class="ml-3 font-weight-bold">
        <span v-if="form.approveCode === 'A'" :class="form.cancelYn === 'Y'? 'warning--text': ''">
          {{' - ' + (form.cancelYn === 'Y' ? '취소 됨' : '신청 중')}}
        </span>
        <span v-else-if="form.approveCode">
          {{' - 처리완료 : ' + form.approveName}}
        </span>
      </span>
    </template>
    <template v-slot:buttons v-if="writeAuth && canSubmit">
      <v-btn dark text @click="cancel" v-if="isModify">
        <v-icon left>cancel</v-icon>신청취소
      </v-btn>
      <v-btn dark text @click="submit">
        <v-icon left>check</v-icon>{{isModify? '수정': '등록'}} (F4)
      </v-btn>
    </template>
    <v-form ref="form" lazy-validation autocomplete="off" v-if="isLoading">
      <v-row :dense="writable">
        <v-menu offset-y transition="slide-y" nudge-top="10" :disabled="!canSubmit">
          <template v-slot:activator="{ on }">
            <v-col cols="6">
              <v-row no-gutters>
                <v-col cols="6" v-on="on" :class="writable? 'pr-1': 'pr-3'">
                  <div class="font-weight-bold info--text body-1">회원번호</div>
                  <v-text-field :value="form.memberName" dense
                                :rules="emptyRules"
                                placeholder="회원번호를 선택 해주세요."
                                readonly
                                :hide-details="!writable"
                                :disabled="!canSubmit" />
                </v-col>
<!--                FIXME agent code 제휴사 코드를 관리함. 번호랑 매칭 호반에서 어떻게 관리되는지 몰라서 일단 사용하지 않는다.
                   <v-col cols="6" v-on="on" :class="writable? 'pl-1': 'pl-3'">
                  <div class="font-weight-bold info&#45;&#45;text body-1">대매사</div>
                  <v-text-field :value="form.agentCodeName" dense
                                :rules="emptyRules"
                                placeholder="대매사를 선택 해주세요."
                                readonly
                                :hide-details="!writable"
                                :disabled="!canSubmit" />
                </v-col>-->
              </v-row>
            </v-col>
          </template>
          <v-list dense>
            <v-list-item v-for="(info, index) of roomUseList" :key="index" class="border-bottom px-2" @click="selectInfo(info)">
              <v-list-item-action class="mr-2">
                <v-icon>{{info.memberNo === form.memberNo && info.agentCode === form.agentCode ? 'check_box': 'check_box_outline_blank'}}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-row dense no-gutters align="center">
                  <v-col cols="2" class="border-left pl-2">
                    회원번호
                  </v-col>
                  <v-col cols="4" class="border-left pl-2">
                    <p class="mb-1">{{info.memberName}}</p>
                    ( {{info.memberNo}} )
                  </v-col>
                  <v-col cols="2" class="border-left pl-2">대매사</v-col>
                  <v-col cols="4" class="border-left pl-2">
                    <p class="mb-1">{{info.agentCodeName}}</p>
                    ( {{info.agentCode}} )
                  </v-col>
                </v-row>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="!roomUseList || roomUseList.length === 0">
              <v-list-item-content class="font-weight-bold red--text"> * 이용가능한 객실상품이 존재하지 않습니다.</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-col cols="6" md="3">
          <div class="font-weight-bold info--text body-1">이용자 명</div>
          <v-text-field v-model="form.guestName" dense
                        :rules="emptyRules"
                        placeholder="이용자 명을 입력 해주세요."
                        :hide-details="!writable"
                        :disabled="!canSubmit" />
        </v-col>
        <v-col cols="6" md="3">
          <div class="font-weight-bold info--text body-1">이용자 핸드폰번호</div>
          <v-text-field v-model="form.guestTel" dense
                        v-mask="['###-####-####', '###-###-####']"
                        :rules="emptyRules.concat(mobileRegex)"
                        placeholder="이용자 연락처를 입력 해주세요."
                        :hide-details="!writable"
                        :disabled="!canSubmit" />
        </v-col>
      </v-row>
      <v-row :dense="writable">
        <v-col cols="6" md="3">
          <div class="font-weight-bold info--text body-1">영업장</div>
          <v-autocomplete v-model="form.storeCode" dense
                          :items="storeList"
                          item-value="storeCode"
                          :item-text="item => '(' + item.storeCode +')' + item.storeName"
                          :rules="emptyRules"
                          :disabled="!canSubmit"
                          :hide-details="!writable"
                          placeholder="영업장을 선택 해주세요."
                          @change="changeStore" />
        </v-col>
        <v-col cols="6" md="3">
          <div class="font-weight-bold info--text body-1">객실 타입</div>
          <v-autocomplete v-model="form.roomTypeCode" dense
                          :items="roomTypeList"
                          item-value="roomTypeCode"
                          :item-text="item => '(' + item.roomTypeCode +') ' + item.roomTypeName"
                          :disabled="!canSubmit"
                          :hide-details="!writable"
                          placeholder="객실타입을 선택 해주세요."
                          :rules="emptyRules" />
        </v-col>
        <template v-if="form.approveCode === '' || form.approveCode === 'A'">
          <v-col cols="3" class="font-weight-bold success--text">
            <div>* 선택하신 영업장 최대 예약가능 <span class="primary--text">박수 / 객실 수</span> 까지만 신청이 가능합니다.</div>
            <div v-if="form.storeCode">
              * 선택 영업장 최대 예약가능 <span class="primary--text">박수 : </span><span class="red--text">{{selectStore.nights}}</span>
              <span class="primary--text"> / 객실 수 : </span><span class="red--text">{{selectStore.roomCount}}</span>
            </div>
          </v-col>
          <v-col cols="3" class="font-weight-bold success--text">
            <div>* 영업장 휴일일자인 경우 전체 객실타입 신청이 불가능 합니다.</div>
            <div>* 객실타입 휴일일자인 경우 해당 객실타입만 신청이 불가능 합니다.</div>
            <div>* 휴일을 피해서 박수를 설정해 주세요.</div>
          </v-col>
        </template>
        <template v-if="isModify">
          <v-col cols="3">
            <div class="font-weight-bold info--text body-1">파트너</div>
            <v-text-field v-model="form.partnerName" dense
                          :rules="emptyRules"
                          placeholder="이용자 명을 입력 해주세요."
                          :hide-details="!writable"
                          disabled />
          </v-col>
          <v-col cols="3">
            <div class="font-weight-bold info--text body-1">신청 파트너 담당자</div>
            <v-text-field v-model="form.managerName" dense
                          :rules="emptyRules"
                          placeholder="이용자 명을 입력 해주세요."
                          :hide-details="!writable"
                          disabled />
          </v-col>
        </template>
      </v-row>
      <v-row :dense="writable">
        <v-col cols="6" md="3">
          <div class="font-weight-bold info--text body-1">입실 일자</div>
          <date-picker v-model="form.checkInYmd" dense
                       format="YYYYMMDD"
                       :min="minDate"
                       :disabled="!canSubmit"
                       :hide-details="!writable"
                       required
                       placeholder="입실일자를 선택 해주세요."
                       clearable />
        </v-col>
        <v-col cols="6" md="3">
          <div class="font-weight-bold info--text body-1">박수</div>
          <v-text-field v-model="form.nights" dense
                        type="number"
                        placeholder="박수를 입력 해주세요."
                        :rules="emptyRules.concat(numberRules)"
                        :disabled="!canSubmit"
                        :hide-details="!writable"/>
        </v-col>
        <v-col cols="6" md="3">
          <div class="font-weight-bold info--text body-1">객실 수</div>
          <v-text-field v-model="form.roomCount" dense
                        type="number"
                        placeholder="객실 수를 입력 해주세요."
                        :rules="emptyRules.concat(numberRules)"
                        :disabled="!canSubmit"
                        :hide-details="!writable"/>
        </v-col>
        <v-col cols="6" md="3">
          <div class="font-weight-bold info--text body-1">업체 주문번호</div>
          <v-text-field v-model="form.partnerRsvNo" dense
                        :placeholder="canSubmit? '업체 주문번호를 입력 해주세요.': ''"
                        :disabled="!canSubmit"
                        :hide-details="!writable"/>
        </v-col>
      </v-row>

      <!-- 신규 / 신청 중인 상태일 경우 휴일 노출 -->
      <partner-reservation-holiday v-if="form.approveCode === '' || form.approveCode === 'A'" :storeCode="form.storeCode" :roomTypeCode="form.roomTypeCode" :checkInYmd="form.checkInYmd"></partner-reservation-holiday>

      <!-- 관리자 처리 후 결과 노출 -->
      <app-card v-else heading="객실예약 신청내역 처리결과" custom-classes="border" content-classes="pt-2" class="pt-2">
        <v-row>
          <v-col cols="2">
            <div class="font-weight-bold info--text body-1">처리 상태</div>
            <v-text-field :value="form.approveName" dense readonly hide-details />
          </v-col>
          <template v-if="form.approveCode === 'B'">
            <v-col cols="2">
              <div class="font-weight-bold info--text body-1">예약번호</div>
              <v-text-field :value="form.rsvNo" dense readonly hide-details>
                <template v-slot:append-outer>
                  <v-btn icon small color="primary" @click="openReservation(form.keyRsvNo)">
                    <v-icon>search</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="2">
              <div class="font-weight-bold info--text body-1">KEY 예약번호</div>
              <v-text-field :value="form.keyRsvNo" dense readonly hide-details>
                <template v-slot:append-outer>
                  <v-btn icon small color="primary" @click="openReservation(form.keyRsvNo)">
                    <v-icon>search</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
          </template>
          <v-col cols="2">
            <div class="font-weight-bold info--text body-1">처리 일자</div>
            <v-text-field :value="form.procDt" dense readonly hide-details />
          </v-col>
          <!-- <v-col cols="2">
            <div class="font-weight-bold info--text body-1">처리 담당자</div>
            <v-text-field :value="form.aprlChrgName" dense readonly hide-details />
          </v-col> -->
        </v-row>
        <v-row align="end">
          <v-col cols="6">
            <div class="font-weight-bold info--text body-1">처리 메모</div>
            <v-textarea :value="form.memo" class="mt-3" hide-details readonly outlined rows="2" />
          </v-col>
          <v-col cols="6" class="text-right">
            <v-btn v-if="form.approveCode === 'C'" color="info" rounded @click="reApply()" ><v-icon left>check</v-icon>재신청</v-btn>
            <v-btn color="primary" rounded @click="close"><v-icon left>close</v-icon>닫기</v-btn>
          </v-col>
        </v-row>
      </app-card>
    </v-form>
    <template v-slot:actions v-if="form.approveCode === '' || form.approveCode === 'A'">
      <v-btn v-if="writeAuth && canSubmit && isModify" color="warning" rounded @click="cancel"><v-icon left>cancel</v-icon>신청취소</v-btn>
      <v-btn v-if="writeAuth && canSubmit" color="info" rounded @click="submit"><v-icon left>check</v-icon>{{isModify? '수정': '등록'}} (F4)</v-btn>
      <v-btn color="primary" rounded @click="close"><v-icon left>close</v-icon>닫기</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import storeService from '@/api/modules/system/store.service'
import partnerReservationService from '@/api/modules/partner/partnerReservation.service'
import PartnerReservationHoliday from '@/components/Partner/Reservation/PartnerReservationHoliday.vue'

export default {
  extends: DialogBase,
  components: { PartnerReservationHoliday },
  name: 'PartnerReservationDetailDialog',
  data () {
    return {
      isLoading: false,
      // 수정/신규 게시물 여부
      isModify: false,
      // 수정일시 넘겨받은 정보
      param: {},
      // 게시물 데이터
      form: {
        memberNo: '',
        memberName: '',
        agentCode: '',
        agentCodeName: '',
        guestName: '',
        guestTel: '',
        storeCode: '',
        roomTypeCode: '',
        checkInYmd: '',
        nights: '',
        roomCount: '',
        approveCode: ''
      },
      // 수정/신규 입력 가능 여부
      canSubmit: false,
      // 예약 최소 일자
      minDate: moment().format('YYYY-MM-DD'),
      storeList: [],
      roomTypeList: [],
      roomUseList: [],
      // 선택 영업장 박수, 객실수 제한정보
      selectStore: {
        roomCount: 0,
        nights: 0
      },
      // 신규/신청 상태인지 아닌지 처리
      writable: true
    }
  },
  async mounted () {
    try {
      // O.T.A 객실유형 관리중인 영업장 조회
      const store = await storeService.selectPartnerInventoryStoreList()
      this.storeList = store.data
      // 파라미터 셋팅
      this.isModify = this.instance.params.isModify
      this.param = this.instance.params.param
      // 로그인 사용자 파트너 의 객실이용정보 조회
      const roomInfo = await partnerReservationService.selectPartnerRoomUseInfo()
      this.roomUseList = roomInfo.data
      // 상세보기일 경우 데이터를 조회한다.
      if (this.isModify) {
        await this.search()
        this.isLoading = true
      } else {
        // 신규 일 경우 입력가능 여부 true
        this.canSubmit = true
        this.isLoading = true
        // 신규일 경우 회원번호 대매사를 첫번째 데이터로 맵핑해준다
        if (_.isArray(this.roomUseList) && this.roomUseList.length > 0) {
          this.selectInfo(this.roomUseList[0])
        }
      }
      await this.$store.dispatch('keypress/addKeyEventList', {
        eventList: [{ target: 'F4', action: this.submit, writeAuth: true }]
      })
    } catch (e) {}
  },
  methods: {
    /**
     * 데이터 조회
     */
    async search () {
      try {
        if (this.param.reqSeq) {
          const res = await partnerReservationService.selectPartnerReservationApply(this.param.reqSeq)
          this.form = res.data
          // 영업장 선택이벤트 실행
          this.changeStore(true)
          // 변경가능 셋팅
          this.canSubmit = res.data.canSubmit
          // 신청상태가 아니라면 writable false
          this.writable = res.data.approveCode === 'A'
        }
      } catch (e) {}
    },
    /**
     * 등록 / 수정
     */
    async submit () {
      try {
        if (!this.canSubmit) {
          return
        }
        await this.validForm(this.$refs.form)
        await this.$dialog.confirm(`객실예약 신청을 ${this.isModify ? '수정' : '등록'} 하시겠습니까?`)
        if (this.isModify) {
          if (!this.form.reqSeq) {
            this.$dialog.alert('신청 정보가 없습니다.')
            return
          }
          await partnerReservationService.updatePartnerReservationApply(this.form.reqSeq, this.form)
        } else {
          await partnerReservationService.insertPartnerReservationApply(this.form)
        }
        await this.$dialog.alert(`객실예약 신청을 ${this.isModify ? '수정' : '등록'} 하였습니다.`)
        this.close({ change: true })
      } catch (e) {}
    },
    /**
     * 영업장 변경 이벤트
     * @param init 초기진입 여부 : 초기진입일 경우 객실타입을 초기화 하지 않는다.
     */
    changeStore (init) {
      console.log('changechange!!')
      if (init !== true) {
        this.form.roomTypeCode = ''
      }
      if (this.form.storeCode) {
        const index = this.storeList.findIndex(data => data.storeCode === this.form.storeCode)
        if (index > -1) {
          if (this.storeList[index].roomTypeList) {
            this.roomTypeList = this.storeList[index].roomTypeList
          }
          this.selectStore.roomCount = this.storeList[index].roomCount || 0
          this.selectStore.nights = this.storeList[index].nights || 0
        }
      }
    },
    /**
     * 대매사, 회원번호 선택
     * @param info
     */
    selectInfo (info) {
      this.form.memberNo = info.memberNo
      this.form.memberName = info.memberName + ' ( ' + info.memberNo + ' )'
      this.form.agentCode = info.agentCode
      this.form.agentCodeName = info.agentCodeName + ' ( ' + info.agentCode + ' )'
    },
    /**
     * 예약내역 팝업창 호출
     * @param keyRsvNo 예약 번호
     */
    openReservation (keyRsvNo) {
      if (keyRsvNo) {
        this.$store.dispatch('dialog/open', {
          componentPath: '/SearchDialog/ReservationSearch',
          params: {
            keyRsvNo: keyRsvNo
          },
          options: {
            fullscreen: false,
            scrollable: true,
            width: 800
          }
        })
      }
    },
    /**
     * 신청취소
     */
    async cancel () {
      try {
        await this.$dialog.confirm('객실예약 신청취소를 진행 하시겠습니까?')
        await partnerReservationService.cancelPartnerReservation(this.form.reqSeq)
        this.$dialog.alert('객실예약 신청을 취소 하였습니다.')
        this.close({ change: true })
      } catch (e) {}
    },
    /**
     * 재신청
     */
    async reApply () {
      try {
        await this.$dialog.confirm('객실예약 재신청 진행 하시겠습니까?')
        await partnerReservationService.updatePartnerReApply(this.form.reqSeq)
        this.$dialog.alert('객실예약 재신청 하였습니다.')
        this.close({ change: true })
      } catch (e) {}
    }
  }
}
</script>
