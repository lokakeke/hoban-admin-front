<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      파트너 객실예약 상세
      <span class="ml-3 font-weight-bold">
        <span v-if="form.approveCode === 'A'" :class="form.cancelYn === 'Y'? 'warning--text': ''">
          {{' - ' + (form.cancelYn === 'Y' ? '취소 됨' : '신청 중')}}
        </span>
        <span v-else-if="form.approveCode">
          {{' - 처리완료 : ' + form.approveCodeName}}
        </span>
      </span>
    </template>
    <app-card heading="파트너 객실예약 신청 데이터" custom-classes="border" content-classes="pt-2">
      <v-row>
        <v-col cols="4" md="2">
          <div class="font-weight-bold info--text body-1">회원번호</div>
            <v-text-field :value="form.memberNo" dense readonly hide-details > {{ form.memberNo }}</v-text-field>
        </v-col>
<!-- FIXME           -->
        <v-col cols="4" md="2">
          <div class="font-weight-bold info--text body-1">대매사</div>
          <v-text-field :value="form.agentCodeName" dense readonly hide-details />
        </v-col>
        <v-col cols="4" md="2">
          <div class="font-weight-bold info--text body-1">이용자 명</div>
          <v-text-field :value="form.guestName" dense readonly hide-details />
        </v-col>
        <v-col cols="4" md="2">
          <div class="font-weight-bold info--text body-1">이용자 핸드폰번호</div>
          <v-text-field :value="form.guestTelNo" dense readonly hide-details />
        </v-col>
        <v-col cols="4" md="2">
          <div class="font-weight-bold info--text body-1">업체 주문번호</div>
          <v-text-field :value="form.partnerRsvNo" dense readonly hide-details />
        </v-col>
      </v-row>
      <v-row align="end">
        <v-col cols="4" md="2">
          <div class="font-weight-bold info--text body-1">파트너</div>
          <v-text-field :value="form.partnerName" dense readonly hide-details />
        </v-col>
        <v-col cols="4" md="2">
          <div class="font-weight-bold info--text body-1">파트너 블랙리스트 Y/N</div>
          <v-text-field :value="partner.blacklistYn" dense readonly hide-details />
        </v-col>
        <v-col cols="4" md="2">
          <div class="font-weight-bold info--text body-1">파트너 담당자</div>
          <v-text-field :value="form.managerName" dense readonly hide-details />
        </v-col>
        <v-col cols="4" md="2">
          <div class="font-weight-bold info--text body-1">영업장</div>
          <v-text-field :value="form.storeName" dense readonly hide-details />
        </v-col>
        <v-col cols="4" md="2">
          <div class="font-weight-bold info--text body-1">객실 타입</div>
          <v-text-field :value="form.roomTypeName" dense readonly hide-details />
        </v-col>
        <v-col cols="4" md="2" class="font-weight-bold success--text">
          <div>* 선택 영업장 최대 예약가능</div>
          <div>
            <span class="primary--text">박수 : </span><span class="red--text">{{partner.nights}}</span>
            <span class="primary--text"> / 객실 수 : </span><span class="red--text">{{partner.roomCount}}</span>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4" md="2">
          <div class="font-weight-bold info--text body-1">입실 일자</div>
          <v-text-field :value="form.checkInDate | date" dense readonly hide-details append-icon="today" />
        </v-col>
        <v-col cols="4" md="2">
          <div class="font-weight-bold info--text body-1">박수</div>
          <v-text-field :value="form.nights" dense readonly hide-details />
        </v-col>
        <v-col cols="4" md="2">
          <div class="font-weight-bold info--text body-1">객실 수</div>
          <v-text-field :value="form.roomCount" dense readonly hide-details />
        </v-col>
        <v-col cols="4" md="2">
          <div class="font-weight-bold info--text body-1">취소 여부</div>
          <v-text-field :value="form.cancelYn" dense readonly hide-details />
        </v-col>
      </v-row>
      <v-row v-if="form.approveCode === 'A'">
        <v-col cols="4">
          <v-toolbar color="white" flat dense>
            <!-- TODO PmsStockPrice 완성되면 작동하는지 확인 -->
            <v-toolbar-title>PMS 재고량</v-toolbar-title>
          </v-toolbar>
          <v-simple-table class="bordered">
            <thead>
            <tr>
              <th class="text-center">블럭</th>
              <th v-for="date of dateList" :key="date.value" class="text-center">{{date.label}}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(block, index) of blockList" :key="block.block + '_' + index">
              <td class="text-center font-weight-bold" style="background: #eeeeee">{{block.block}} 블럭</td>
              <td class="text-center" v-for="date of dateList" :key="date.value">{{block[date.value]}}</td>
            </tr>
            </tbody>
          </v-simple-table>
        </v-col>
        <v-col cols="8">
          <partner-reservation-holiday :storeCode="form.storeCode" :rmTypeCode="form.rmTypeCode" :checkInDate="form.checkInDate"></partner-reservation-holiday>
        </v-col>
      </v-row>
    </app-card>
    <div v-if="form.cancelYn === 'Y'"></div>
    <app-card heading="객실예약 신청내역 처리" custom-classes="border" content-classes="pt-2" class="pt-2" v-else-if="form.approveCode === 'A'">
      <v-form ref="replyForm" lazy-validation autocomplete="off">
        <v-row>
          <v-col cols="3">
            <div class="font-weight-bold info--text body-1">처리 상태</div>
            <v-radio-group v-model="replyForm.approveCode" row class="mt-2"
                           :rules="emptyRules" @change="changeAprlCode">
              <v-radio label="승인" value="B"></v-radio>
              <v-radio label="불가" value="C"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="3">
            <div class="font-weight-bold info--text body-1">예약 블럭</div>
            <v-radio-group v-model="replyForm.blockCode" row class="mt-2"
                           :rules="replyForm.approveCode === 'B'? emptyRules: undefined"
                           :disabled="replyForm.approveCode === 'C'">
              <v-radio :label="block.block + ' 블럭'" :value="block.block" v-for="(block, index) of blockList" :key="block + '_' + index"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="3">
            <div class="font-weight-bold info--text body-1">메모</div>
            <v-textarea v-model="replyForm.memo" outlined class="mt-2" hide-details rows="4" placeholder="메모사항을 입력해 주세요." />
          </v-col>
          <v-col cols="3">
            <div class="font-weight-bold info--text body-1">예약실패 메시지</div>
            <v-textarea v-model="replyForm.errorMsg" outlined class="mt-2" hide-details rows="4" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-right">
            <v-btn v-if="writeAuth" color="info" rounded :disabled="!canSubmit" @click="submit"><v-icon left>check</v-icon>처리</v-btn>
            <v-btn color="primary" rounded @click="close"><v-icon left>close</v-icon>닫기</v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="1">
            <v-btn v-if="writeAuth && form.preReqSeq" color="info" rounded @click="changeAppSeq(form.preReqSeq)"><v-icon left>arrow_back</v-icon>이전글</v-btn>
          </v-col>
          <v-col cols="10">
          </v-col>
          <v-col cols="1">
            <v-btn v-if="writeAuth && form.nextReqSeq" color="info" rounded @click="changeAppSeq(form.nextReqSeq)"><v-icon left>arrow_forward</v-icon>다음글</v-btn>
          </v-col>
        </v-row>

      </v-form>
    </app-card>

    <app-card heading="객실예약 신청내역 처리결과" custom-classes="border" content-classes="pt-2" class="pt-2" v-else>
      <v-row>
        <v-col cols="2">
          <div class="font-weight-bold info--text body-1">처리 상태</div>
          <v-text-field :value="form.approveName" dense readonly hide-details
                        :class="form.approveCode === 'B'? 'approval' : form.approveCode === 'C' ? 'restoration' : 'application'" />
        </v-col>
        <template v-if="form.approveCode === 'B'">
          <v-col cols="2">
            <div class="font-weight-bold info--text body-1">예약번호</div>
            <v-text-field :value="form.rsvSeq" dense readonly hide-details>
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
          <v-text-field :value="form.processDatetime" dense readonly hide-details />
        </v-col>
        <v-col cols="2">
          <div class="font-weight-bold info--text body-1">처리 담당자</div>
          <v-text-field :value="form.approveManagerName" dense readonly hide-details />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <div class="font-weight-bold info--text body-1">메모</div>
          <v-textarea :value="form.memo" class="mt-2" outlined hide-details readonly rows="4" />
        </v-col>
        <v-col cols="6">
          <div class="font-weight-bold info--text body-1">예약실패 메시지</div>
          <v-textarea :value="form.errorMsg" class="mt-2" outlined hide-details readonly rows="4" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="1">
          <v-btn v-if="writeAuth && form.preReqSeq" color="info" rounded @click="changeAppSeq(form.preReqSeq)"><v-icon left>arrow_back</v-icon>이전글</v-btn>
        </v-col>
        <v-col cols="10">
        </v-col>
        <v-col cols="1">
          <v-btn v-if="writeAuth && form.nextReqSeq" color="info" rounded @click="changeAppSeq(form.nextReqSeq)"><v-icon left>arrow_forward</v-icon>다음글</v-btn>
        </v-col>
      </v-row>
    </app-card>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import PartnerReservationHoliday from '@/components/Partner/Reservation/PartnerReservationHoliday.vue'
import partnerReservationService from '@/api/modules/partner/partnerReservation.service'

export default {
  extends: DialogBase,
  components: { PartnerReservationHoliday },
  name: 'AdminReservationConfirmDialog',
  data () {
    return {
      // 게시물 클릭 정보
      param: {},
      // 신청 정보 데이터
      form: {
        memberNo: '',
        memberName: '',
        agentCode: '',
        agentCodeName: '',
        guestName: '',
        guestTelNo: '',
        storeCode: '',
        rmTypeCode: '',
        checkInDate: '',
        nights: '',
        roomCount: '',
        approveCode: '',
        approveName: '',
        approveManagerName: '',
        memo: '',
        errorMsg: '',
        rsvSeq: '',
        keyRsvNo: '',
        processDatetime: '',
        preReqSeq: '',
        nextReqSeq: ''
      },
      replyForm: {
        memo: '',
        errorMsg: '',
        approveCode: '',
        blockCode: ''
      },
      // 수정 가능 여부
      canSubmit: false,
      // 파트너 - 영업장 정보
      partner: {
        roomCount: 0,
        nights: 0,
        blacklistYn: '',
        blockCode: ''
      },
      // dgns 재고 정보
      dateList: [],
      blockList: []
    }
  },
  async mounted () {
    try {
      // 파라미터 셋팅
      this.param = this.instance.params.param
      // 데이터를 조회한다.
      this.search()
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
          const result = res.data
          // 예약 정보 데이터
          this.form = result.data
          // 파트너 정보
          this.partner = result.partner
          // 날짜 리스트 셋팅
          const dateList = []
          const days = parseInt(this.form.nights)
          for (let index = 0; index < days; index++) {
            const value = moment(this.form.checkInDate).add(index, 'days')
            dateList.push({ label: value.format('YYYY[년] MM[월] DD[일]'), value: value.format('YYYYMMDD') })
          }
          this.dateList = dateList
          // PMS 블럭재고 셋팅 - 객실기본 블럭코드 + 104 블럭코드
          const blockData = result.blockList || []
          const blockList = []
          if (this.partner.blockCode) {
            blockList.push(this.setBlockData(blockData, this.partner.blockCode, dateList))
          }
          blockList.push(this.setBlockData(blockData, '104', dateList))
          this.blockList = blockList
          // 변경가능 셋팅
          this.canSubmit = res.data.canSubmit
        }
      } catch (e) {}
    },
    /**
     * 신청내역 처리
     */
    async submit () {
      try {
        if (!this.form.reqSeq) {
          return
        }
        if (!this.canSubmit) {
          return
        }
        await this.validForm(this.$refs.replyForm)
        let confirmMsg = '객실예약 신청을 처리 하시겠습니까?<br/>승인인 경우에도 예약실패 시 승인되지 않습니다.'
        // 재고 오버부킹 가능 여부 조회
        if (this.replyForm.approveCode === 'B') {
          const index = this.blockList.findIndex(data => data.block === this.replyForm.blockCode)
          if (index > -1) {
            const blockInfo = this.blockList[index]
            const roomCount = parseInt(this.form.roomCount)
            for (const date of this.dateList) {
              const stockQty = blockInfo[date.value] || 0
              if (roomCount > stockQty) {
                confirmMsg += '<br/><br/>신청 재고가 PMS 선택재고보다 많습니다.<br/>오버부킹이 가능한 관리자 이면 오버부킹 처리가 됩니다. 그래도 진행 하시겠습니까?'
                break
              }
            }
          }
        }
        await this.$dialog.confirm(confirmMsg)
        const res = await partnerReservationService.processPartnerReservationApply(this.form.reqSeq, this.replyForm)
        if (res.data.status === true) {
          await this.$dialog.alert('객실예약 신청을 처리 하였습니다.')
          // this.close({ change: true })
          this.search()
        } else {
          await this.$dialog.alert(`객실예약 신청 처리에 실패했습니다.<br/>오류내용: ${res.data.errorMsg}`)
          this.replyForm.errorMsg = res.data.errorMsg
          if (!this.replyForm.memo) {
            this.replyForm.memo = res.data.errorMsg
          }
        }
      } catch (e) {}
    },
    /**
     * 블럭 재고량 데이터 처리
     * @param blockList dgns 재고리스트
     * @param blockCode 블럭코드
     * @param dateList 일자리스트
     */
    setBlockData (blockList, blockCode, dateList) {
      const row = { block: blockCode }
      for (const date of dateList) {
        const index = blockList.findIndex(data => data.blockCode === blockCode && data.checkInDate === date.value)
        if (index > -1) {
          row[date.value] = blockList[index].stockQty
        } else {
          row[date.value] = null
        }
      }
      return row
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
     * 처리상태 불가 일 시 블럭코드 초기화
     */
    changeAprlCode () {
      if (this.replyForm.approveCode === 'C') {
        this.replyForm.blockCode = ''
      }
    },
    changeAppSeq (changeAppSeq) {
      this.param.reqSeq = changeAppSeq
      this.search()
    }
  }
}
</script>

<style lang="scss">
  div.v-input {
    &.approval input {
      color: #2196F3;
      font-weight: bold;
    }
    &.restoration input {
      color: #F44336;
      font-weight: bold;
    }
    &.application input {
      font-weight: bold;
    }
  }
</style>
