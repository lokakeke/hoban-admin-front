<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      파트너 패키지예약 상세
      <span class="ml-3 font-weight-bold">
        <span v-if="form.aprlCode === 'A'" :class="form.cancelYn === 'Y'? 'warning--text': ''">
          {{' - ' + (form.cancelYn === 'Y' ? '취소 됨' : '신청 중')}}
        </span>
        <span v-else-if="form.aprlCode">
          {{' - 처리완료 : ' + form.aprlName}}
        </span>
      </span>
    </template>
    <app-card heading="파트너 패키지예약 신청 데이터" custom-classes="border" content-classes="pt-2">
      <v-row>
        <v-col cols="6" md="3">
          <div class="font-weight-bold info--text body-1">대매사</div>
          <v-text-field v-model="form.agentCodeName" dense readonly />
        </v-col>
        <v-col cols="6" md="3">
          <div class="font-weight-bold info--text body-1">이용자 명</div>
          <v-text-field v-model="form.userName" dense readonly />
        </v-col>
        <v-col cols="6" md="3">
          <div class="font-weight-bold info--text body-1">이용자 핸드폰번호</div>
          <v-text-field v-model="form.userTel" dense
                        v-mask="['###-####-####', '###-###-####']"
                        readonly />
        </v-col>
        <v-col cols="6" md="3">
          <div class="font-weight-bold info--text body-1">업체 주문번호</div>
          <v-text-field v-model="form.comRsvNo" dense readonly />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" md="3">
          <div class="font-weight-bold info--text body-1">입실일자</div>
          <v-text-field :value="form.ciYmd | date" dense readonly append-icon="today" />
        </v-col>
        <v-col cols="6" md="3">
          <div class="font-weight-bold info--text body-1">파트너</div>
          <v-text-field v-model="form.ptnrName" dense readonly />
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="12" md="12">
            <v-row>
              <v-col md="12">
                <div class="font-weight-bold info--text body-1">패키지예약 신청 목록</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col md="12">
                <v-data-table
                  :headers="headers"
                  :items="form.pkgPutInList"
                  v-model="replyForm.selectedList"
                  single-select
                  show-select
                  item-key="rmSeq"
                  disable-sort
                  disable-pagination
                  hide-default-footer
                  class="bordered click-row"
                >
                  <template v-slot:item.saleBgnYmd="{item}">
                    {{item.saleBgnYmd | date}} ~ {{item.saleEndYmd | date}}
                  </template>
                  <template v-slot:item.pkgName="{item}">
                    {{item.pkgName}} ({{item.pkgNo}})
                  </template>
                  <template v-slot:item.defaultBlck="{item}">
                    <span v-if="form.aprlCode === 'A'" class="pinter blue--text">
                      <v-chip :color="item.defaultBlck > 0 && item.specialBlck  > 0 ? 'gray' : 'primary'" @click="oepnBlckList(item)">
                        {{item.rsvBlckCode + ' : ' + (item.defaultBlck > 0 ? '부족' : '가능')
                        + ' / 104 : ' +  (item.specialBlck  > 0 ? '부족' : '가능') }}
                      </v-chip>
                    </span>
                    <span v-else>
                      <v-chip color="info">
                        {{item.rsvBlckCode + ' : ' + (item.defaultBlck > 0 ? '부족' : '가능')
                        + ' / 104 : ' +  (item.specialBlck  > 0 ? '부족' : '가능') }}
                      </v-chip>
                    </span>
                  </template>
                  <template v-slot:item.rsvBlckCode="{item}">
                    <v-radio-group v-if="form.aprlCode === 'A'" v-model="item.reserveBlckCode" row>
                      <v-radio :label="item.rsvBlckCode" :value="item.rsvBlckCode"></v-radio>
                      <v-radio label="104" value="104"></v-radio>
                    </v-radio-group>
                    <span v-else>
                      {{item.rsvBlckCode}}
                    </span>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
        </v-col>
      </v-row>
    </app-card>
    <div v-if="form.cancelYn === 'Y'"></div>
    <app-card heading="패키지예약 신청내역 처리" custom-classes="border" content-classes="pt-2" class="pt-2" v-else-if="form.aprlCode === 'A'">
      <v-form ref="replyForm" lazy-validation autocomplete="off">
        <v-row>
          <v-col cols="3">
            <div class="font-weight-bold info--text body-1">처리 상태</div>
            <v-radio-group v-model="replyForm.aprlCode" row class="mt-2"
                           :rules="emptyRules" @change="changeAprlCode">
              <v-radio label="승인" value="B"></v-radio>
              <v-radio label="불가" value="C"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="3">
            <div class="font-weight-bold info--text body-1">메모</div>
            <v-textarea v-model="replyForm.memo" outlined class="mt-2" hide-details rows="4" placeholder="메모사항을 입력해 주세요." />
          </v-col>
          <v-col cols="3">
            <div class="font-weight-bold info--text body-1">예약실패 메시지</div>
            <v-textarea v-model="replyForm.errMsg" outlined class="mt-2" hide-details rows="4" />
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
            <v-btn v-if="writeAuth && form.preAppSeq" color="info" rounded @click="changeAppSeq(form.preAppSeq)"><v-icon left>arrow_back</v-icon>이전글</v-btn>
          </v-col>
          <v-col cols="10">
          </v-col>
          <v-col cols="1">
            <v-btn v-if="writeAuth && form.nextAppSeq" color="info" rounded @click="changeAppSeq(form.nextAppSeq)"><v-icon left>arrow_forward</v-icon>다음글</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </app-card>

    <app-card heading="패키지예약 신청내역 처리결과" custom-classes="border" content-classes="pt-2" class="pt-2" v-else>
      <v-row>
        <v-col cols="2">
          <div class="font-weight-bold info--text body-1">처리 상태</div>
          <v-text-field :value="form.aprlName" dense readonly hide-details
                        :class="form.aprlCode === 'B'? 'approval' : form.aprlCode === 'C' ? 'restoration' : 'application'" />
        </v-col>
        <template v-if="form.aprlCode === 'B'">
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
        <v-col cols="2">
          <div class="font-weight-bold info--text body-1">처리 담당자</div>
          <v-text-field :value="form.aprlChrgName" dense readonly hide-details />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <div class="font-weight-bold info--text body-1">메모</div>
          <v-textarea :value="form.memo" class="mt-2" outlined hide-details readonly rows="4" />
        </v-col>
        <v-col cols="6">
          <div class="font-weight-bold info--text body-1">예약실패 메시지</div>
          <v-textarea :value="form.errMsg" class="mt-2" outlined hide-details readonly rows="4" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="1">
          <v-btn v-if="writeAuth && form.preAppSeq" color="info" rounded @click="changeAppSeq(form.preAppSeq)"><v-icon left>arrow_back</v-icon>이전글</v-btn>
        </v-col>
        <v-col cols="10">
        </v-col>
        <v-col cols="1">
          <v-btn v-if="writeAuth && form.nextAppSeq" color="info" rounded @click="changeAppSeq(form.nextAppSeq)"><v-icon left>arrow_forward</v-icon>다음글</v-btn>
        </v-col>
      </v-row>
    </app-card>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import partnerPkgReservationService from '@/api/modules/partner/partnerPkgReservation.service'

export default {
  extends: DialogBase,
  components: { },
  name: 'AdminPkgReservationConfirmDialog',
  data () {
    return {
      // 게시물 클릭 정보
      param: {},
      // 신청 정보 데이터
      form: {
        pkgNo: '',
        pkgName: '',
        agentCode: '',
        agnetCodeName: '',
        userName: '',
        userTel: '',
        storeCode: '',
        rmTypeCode: '',
        ciYmd: '',
        nights: '',
        rmCnt: '',
        rsvBlckCode: '',
        aprlCode: '',
        aprlName: '',
        aprlChrgName: '',
        memo: '',
        errMsg: '',
        rsvNo: '',
        keyRsvNo: '',
        procDt: '',
        pkgPutInList: [], // 패키지 신청 목록
        preAppSeq: '',
        nextAppSeq: ''
      },
      replyForm: {
        memo: '',
        errMsg: '',
        aprlCode: '',
        rsvBlckCode: '',
        selectedList: []
      },
      // 수정 가능 여부
      canSubmit: false,
      // 파트너 - 영업장 정보
      // dgns 재고 정보
      headers: []
    }
  },
  async mounted () {
    try {
      // 파라미터 셋팅
      this.param = this.instance.params.param
      // 헤더 셋팅
      this.headers = [
        { text: '선택', value: 'data-table-select', align: 'center' },
        { text: '잔여블럭여부', value: 'defaultBlck', align: 'center' },
        { text: '예약블럭', value: 'rsvBlckCode', align: 'center' },
        { text: '패키지명', value: 'pkgName', align: 'center' },
        { text: '영업장명', value: 'storeName', align: 'center' },
        { text: '객실유형명', value: 'rmTypeName', align: 'center' },
        { text: '객실수', value: 'rmCnt', align: 'center' },
        { text: '박수', value: 'nights', align: 'center' },
        { text: '판매기간', value: 'saleBgnYmd', align: 'center' },
        { text: '당일예약 가능여부', value: 'todayRsvYn', align: 'center' }
      ]
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
        if (this.param.appSeq) {
          const res = await partnerPkgReservationService.selectPartnerPkgRsvApplyDataList(this.param.appSeq)
          this.form = res.data
          if (res.data.aprlCode === 'B') {
            this.replyForm.selectedList = res.data.pkgPutInList.filter(data => data.rsvNo !== undefined)
          }
          this.canSubmit = res.data.canSubmit
        }
      } catch (e) {}
    },
    /**
     * 신청내역 처리
     */
    async submit () {
      try {
        if (!this.form.appSeq) {
          return
        }
        if (!this.canSubmit) {
          return
        }
        if (this.replyForm.selectedList.length < 1 && this.replyForm.aprlCode === 'B') {
          this.$dialog.alert('패키지예약 신청 목록을 선택해 주세요.')
          return
        }
        if (this.replyForm.selectedList.length > 0 && this.replyForm.aprlCode === 'B') {
          if (this.replyForm.selectedList[0].reserveBlckCode === undefined) {
            this.$dialog.alert('선택한 신청목록 내 예약블럭을 선택해 주세요.')
            return
          }
        }

        await this.validForm(this.$refs.replyForm)
        let confirmMsg = '패키지예약 신청을 처리 하시겠습니까?<br/>승인인 경우에도 예약실패 시 승인되지 않습니다.'
        // 재고 오버부킹 가능 여부 조회
        if (this.replyForm.aprlCode === 'B') {
          if (this.replyForm.selectedList[0].defaultBlck === undefined || this.replyForm.selectedList[0].specialBlck === undefined) {
            this.$dialog.alert('일시적 오류가 발생하였습니다.')
            return
          }

          if ((this.replyForm.selectedList[0].reserveBlckCode ===
                this.replyForm.selectedList[0].rsvBlckCode
            ? this.replyForm.selectedList[0].defaultBlck
            : this.replyForm.selectedList[0].specialBlck) > 0) {
            confirmMsg += '<br/><br/>신청 재고가 PMS 선택재고보다 많습니다.<br/>오버부킹이 가능한 관리자 이면 오버부킹 처리가 됩니다. 그래도 진행 하시겠습니까?'
          }
        }
        await this.$dialog.confirm(confirmMsg)
        const res = await partnerPkgReservationService.processPartnerPkgRsvApply(this.form.appSeq, this.replyForm)
        if (res.data.status === true) {
          await this.$dialog.alert('패키지예약 신청을 처리 하였습니다.')
          // this.close({ change: true })
          this.search()
        } else {
          await this.$dialog.alert(`패키지예약 신청 처리에 실패했습니다.<br/>오류내용: ${res.data.errMsg}`)
          this.replyForm.errMsg = res.data.errMsg
          if (!this.replyForm.memo) {
            this.replyForm.memo = res.data.errMsg
          }
        }
      } catch (e) {}
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
            keyRsvNo: keyRsvNo,
            isPkg: true
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
     * 처리상태 불가일 시 블럭코드 초기화
     */
    changeAprlCode () {
      if (this.replyForm.aprlCode === 'C') {
        this.replyForm.rsvBlckCode = ''
      }
    },
    changeAppSeq (changeAppSeq) {
      this.param.appSeq = changeAppSeq
      this.search()
    },
    /**
     * 블럭수 조회 팝업 열기
     */
    oepnBlckList (row) {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Partner/Reservation/AdminPkgReservationInventoryDialog',
        params: {
          rowInfo: row,
          ciYmd: this.form.ciYmd
        },
        options: {
          width: '900px',
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true
        }
      })
    }
  }
}
</script>
