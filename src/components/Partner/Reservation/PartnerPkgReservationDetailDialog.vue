<template>
    <dialog-base :instance="instance">
        <template v-slot:title>
            파트너 패키지예약 {{ isModify ? "상세보기" : "신규 신청" }}
            <span v-if="isModify" class="ml-3 font-weight-bold">
        <span v-if="form.aprlCode === 'A'" :class="form.cancelYn === 'Y'? 'warning--text': ''">
          {{ " - " + (form.cancelYn === "Y" ? "취소 됨" : "신청 중") }}
        </span>
        <span v-else-if="form.aprlCode">
          {{ " - 처리완료 : " + form.aprlName }}
        </span>
      </span>
        </template>
        <template v-slot:buttons v-if="writeAuth && canSubmit">
            <v-btn dark text @click="cancel" v-if="isModify">
                <v-icon left>cancel</v-icon>
                취소
            </v-btn>
            <v-btn dark text @click="submit">
                <v-icon left>check</v-icon>
                {{ isModify ? "수정" : "등록" }} (F4)
            </v-btn>
        </template>
        <v-form ref="form" lazy-validation autocomplete="off" v-if="isLoading">
            <v-row :dense="writable">
                <v-menu offset-y transition="slide-y" nudge-top="10" :disabled="!canSubmit">
                    <template v-slot:activator="{ on }">
                        <v-col cols="6" md="3">
                            <v-row no-gutters>
                                <v-col cols="12" v-on="on">
                                    <div class="font-weight-bold info--text body-1">대매사</div>
                                    <v-text-field :value="form.agentCodeName" dense
                                                  :rules="emptyRules"
                                                  placeholder="대매사를 선택 해주세요."
                                                  readonly
                                                  :hide-details="!writable" />
                                </v-col>
                            </v-row>
                        </v-col>
                    </template>
                    <v-list dense>
                        <v-list-item v-for="(info, index) of agentList" :key="index" class="border-bottom px-2"
                                     @click="selectAgent(info)">
                            <v-list-item-action class="mr-2">
                                <v-icon>{{ info.agentCode === form.agentCode ? "check_box" : "check_box_outline_blank" }}
                                </v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-row dense no-gutters align="center">
                                    <v-col cols="12" class="py-3">
                                        {{ info.agentCodeName }} ( {{ info.agentCode }} )
                                    </v-col>
                                </v-row>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item v-if="!agentList || agentList.length === 0">
                            <v-list-item-content class="font-weight-bold red--text"> * 이용가능한 패키지상품이 존재하지 않습니다.
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <v-col cols="6" md="3">
                    <div class="font-weight-bold info--text body-1">이용자 명</div>
                    <v-text-field v-model="form.userName" dense
                                  :rules="emptyRules"
                                  placeholder="이용자 명을 입력 해주세요."
                                  :hide-details="!writable"
                                  :readonly="!canSubmit" />
                </v-col>
                <v-col cols="6" md="3">
                    <div class="font-weight-bold info--text body-1">이용자 핸드폰번호</div>
                    <v-text-field v-model="form.userTel" dense
                                  v-mask="['###-####-####', '###-###-####']"
                                  :rules="emptyRules.concat(mobileRegex)"
                                  placeholder="이용자 연락처를 입력 해주세요."
                                  :hide-details="!writable"
                                  :readonly="!canSubmit" />
                </v-col>
                <v-col cols="6" md="3">
                    <div class="font-weight-bold info--text body-1">업체 주문번호</div>
                    <v-text-field v-model="form.comRsvNo" dense
                                  placeholder="업체 주문번호를 입력 해주세요."
                                  :hide-details="!writable"
                                  :readonly="!canSubmit" />
                </v-col>
            </v-row>
            <v-row>
                <v-col sm="12" md="12">
                    <v-row>
                        <v-col md="6">
                            <div class="font-weight-bold info--text body-1">패키지예약 신청 목록</div>
                        </v-col>
                        <v-col md="6" class="text-right">
                            <v-btn rounded outlined @click="pkgPutInList" color="info"
                                   v-if="form.aprlCode === '' || form.aprlCode === 'A'">
                                <v-icon small>add</v-icon>
                                추가
                            </v-btn>
                        </v-col>
                    </v-row>
                    <draggable v-if="form.pkgPutInList.length === 0">
                        <template>
                            <v-hover v-slot:default="{ hover }" :key="999">
                                <v-card raised
                                        :elevation="hover ? 5 : 1"
                                        style="cursor: move"
                                        class="mb-1">
                                    <v-card-text class="py-0">
                                        <v-row dense align="center">
                                            <v-menu
                                                offset-y
                                                transition="slide-y">
                                                <template v-slot:activator="{ on }">
                                                    <v-col cols="12">
                                                        <v-row dense>
                                                            <v-col cols="12" v-on="on" class="text-center"
                                                                   @click="pkgPutInList">
                                                                조회된 결과값이 없습니다.
                                                            </v-col>
                                                        </v-row>
                                                    </v-col>
                                                </template>
                                            </v-menu>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-hover>
                        </template>
                    </draggable>
                    <draggable v-else v-model="form.pkgPutInList">
                        <template v-for="(item, index) of form.pkgPutInList">
                            <v-hover v-slot:default="{ hover }" :key="index">
                                <v-card raised
                                        :elevation="hover ? 5 : 1"
                                        style="cursor: move"
                                        class="mb-1">
                                    <v-card-text class="py-0">
                                        <v-row dense align="center">
                                            <v-col cols="6" class="font-weight-black subtitle-1">
                                                {{ index + 1 }} - {{ item.pkgName }} ({{ item.pkgNo }})
                                            </v-col>
                                            <v-col cols="6" class="text-right">
                                                <v-btn v-if="writeAuth && canSubmit" small color="accent" rounded
                                                       outlined @click="searchHoliday(item)">
                                                    <v-icon small>search</v-icon>
                                                    휴일정보
                                                </v-btn>
                                                <v-btn v-if="writeAuth && canSubmit" small color="accent" rounded
                                                       outlined @click="remove(item)">
                                                    <v-icon small>remove</v-icon>
                                                    삭제
                                                </v-btn>
                                            </v-col>
                                            <v-menu
                                                offset-y
                                                transition="slide-y">
                                                <template v-slot:activator="{ on }">
                                                    <v-col cols="12">
                                                        <v-row dense>
                                                            <v-col cols="3">
                                                                <v-text-field
                                                                    v-model="item.storeName"
                                                                    v-on="on"
                                                                    :rules="emptyRules"
                                                                    readonly
                                                                    hide-details
                                                                    class="pt-2"
                                                                    label="영업장명"
                                                                    dense />
                                                            </v-col>
                                                            <v-col cols="3">
                                                                <v-text-field
                                                                    :value="item.rmTypeName"
                                                                    v-on="on"
                                                                    :rules="emptyRules"
                                                                    readonly
                                                                    hide-details
                                                                    class="pt-2"
                                                                    label="객실유형명"
                                                                    dense />
                                                            </v-col>
                                                            <v-col cols="3">
                                                                <v-text-field
                                                                    :value="item.rmCnt"
                                                                    v-on="on"
                                                                    :rules="emptyRules"
                                                                    readonly
                                                                    hide-details
                                                                    class="pt-2"
                                                                    label="객실수"
                                                                    dense />
                                                            </v-col>
                                                            <v-col cols="3">
                                                                <v-text-field
                                                                    :value="item.nights"
                                                                    v-on="on"
                                                                    :rules="emptyRules"
                                                                    readonly
                                                                    hide-details
                                                                    class="pt-2"
                                                                    label="박수"
                                                                    dense />
                                                            </v-col>
                                                            <v-col cols="3">
                                                                <v-text-field
                                                                    :value="item.saleBgnYmd+'~'+item.saleEndYmd"
                                                                    v-on="on"
                                                                    :rules="emptyRules"
                                                                    readonly
                                                                    hide-details
                                                                    class="pt-2"
                                                                    label="판매기간"
                                                                    dense />
                                                            </v-col>
                                                            <v-col cols="3">
                                                                <v-text-field
                                                                    :value="item.todayRsvYn ==='Y'? '가능 ('+item.todayRsvTime.substr(0,2)+':'+item.todayRsvTime.substr(2)+')' : '불가능'"
                                                                    v-on="on"
                                                                    :rules="emptyRules"
                                                                    readonly
                                                                    hide-details
                                                                    class="pt-2"
                                                                    label="당일예약 가능여부"
                                                                    dense />
                                                            </v-col>
                                                            <v-col cols="3">
                                                                <v-text-field
                                                                    :value="item.rsvBlckCode"
                                                                    v-on="on"
                                                                    :rules="emptyRules"
                                                                    readonly
                                                                    hide-details
                                                                    class="pt-2"
                                                                    label="예약블럭"
                                                                    dense />
                                                            </v-col>
                                                        </v-row>
                                                    </v-col>
                                                </template>
                                            </v-menu>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-hover>
                        </template>
                    </draggable>
                </v-col>
            </v-row>
            <v-row :dense="writable">
                <v-col cols="6" md="3">
                    <div class="font-weight-bold info--text body-1">입실 일자</div>
                    <date-picker v-model="form.ciYmd" dense
                                 format="YYYYMMDD"
                                 :min="minDate"
                                 :max="maxDate"
                                 :disabled="!canSubmit"
                                 :hide-details="!writable"
                                 required
                                 placeholder="입실일자를 선택 해주세요."
                                 clearable />
                </v-col>
                <template v-if="form.aprlCode === '' || form.aprlCode === 'A'">
                    <v-col cols="3" class="font-weight-bold success--text">
                        <div>* 패키지 휴일일자인 경우 전체 객실타입 신청이 불가능 합니다.</div>
                        <div>* 영업장 / 객실타입 휴일일자인 경우 해당 객실타입만 신청이 불가능 합니다.</div>
                        <div>* 휴일을 피해서 날짜를 설정해 주세요.</div>
                        <div>* 휴일은 패키지 예약 신청 목록 내 휴일 정보 선택 시 확인 가능합니다.</div>
                    </v-col>
                </template>
                <template v-if="isModify">
                    <v-col cols="3">
                        <div class="font-weight-bold info--text body-1">파트너</div>
                        <v-text-field v-model="form.companyName" dense
                                      :rules="emptyRules"
                                      placeholder="이용자 명을 입력 해주세요."
                                      :hide-details="!writable"
                                      disabled />
                    </v-col>
                    <v-col cols="3">
                        <div class="font-weight-bold info--text body-1">신청 파트너 담당자</div>
                        <v-text-field v-model="form.chrgName" dense
                                      :rules="emptyRules"
                                      placeholder="이용자 명을 입력 해주세요."
                                      :hide-details="!writable"
                                      disabled />
                    </v-col>
                </template>
            </v-row>

            <!-- 신규 / 신청 중인 상태일 경우 휴일 노출 -->
            <partner-pkg-reservation-holiday v-if="form.aprlCode === '' || form.aprlCode === 'A'"
                                             class="pt-3"
                                             :pkgNo="selectPkgInfo.pkgNo"
                                             :storeCode="selectPkgInfo.storeCode"
                                             :rmTypeCode="selectPkgInfo.rmTypeCode"
                                             :ciYmd="form.ciYmd">
            </partner-pkg-reservation-holiday>

            <!-- 관리자 처리 후 결과 노출 -->
            <app-card v-else heading="패키지예약 신청내역 처리결과" custom-classes="border" content-classes="pt-2" class="pt-2">
                <v-row>
                    <v-col cols="2">
                        <div class="font-weight-bold info--text body-1">처리 상태</div>
                        <v-text-field :value="form.aprlName" dense readonly hide-details />
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
                        <v-btn v-if="form.aprlCode === 'C'" color="info" rounded @click="reApply()">
                            <v-icon left>check</v-icon>
                            재신청
                        </v-btn>
                        <v-btn color="primary" rounded @click="close">
                            <v-icon left>close</v-icon>
                            닫기
                        </v-btn>
                    </v-col>
                </v-row>
            </app-card>
        </v-form>
        <template v-slot:actions v-if="form.aprlCode === '' || form.aprlCode === 'A'">
            <v-btn v-if="writeAuth && canSubmit && isModify" color="warning" rounded @click="cancel">
                <v-icon left>cancel</v-icon>
                취소
            </v-btn>
            <v-btn v-if="writeAuth && canSubmit" color="info" rounded @click="submit">
                <v-icon left>check</v-icon>
                {{ isModify ? "수정" : "등록" }} (F4)
            </v-btn>
            <v-btn color="primary" rounded @click="close">
                <v-icon left>close</v-icon>
                닫기
            </v-btn>
        </template>
    </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import partnerPkgReservationService from '@/api/modules/partner/partnerPkgReservation.service'
import PartnerPkgReservationHoliday from '@/components/Partner/Reservation/PartnerPkgReservationHoliday.vue'

console.log('HI')
export default {
  extends: DialogBase,
  name: 'PartnerPkgReservationDetailDialog',
  components: { PartnerPkgReservationHoliday },
  data () {
    return {
      // 화면 로딩완료 여부
      isLoading: false,
      // 수정/신규 게시물 여부
      isModify: false,
      // 수정일시 넘겨받은 정보
      param: {},
      // 게시물 데이터
      form: {
        pkgNo: '',
        pkgName: '',
        agentCode: '',
        agentCodeName: '',
        userName: '',
        userTel: '',
        storeCode: '',
        rmTypeCode: '',
        ciYmd: '',
        nights: '',
        rmCnt: '',
        aprlCode: '',
        pkgPutInList: [] // 패키지 신청 목록
      },
      // 선택 패키지
      selectPkg: null,
      // 수정/신규 입력 가능 여부
      canSubmit: false,
      // 예약가능 패키지 리스트
      pkgList: [],
      // 예약가능 영업장 리스트
      storeList: [],
      // 예약가능 객실 리스트
      rmTypeList: [],
      // 예약가능 대매사 리스트
      agentList: [],
      // 신규/신청 상태인지 아닌지 처리
      writable: true,
      // 신청목록 수 제한 ( 5 개이상 퍼블리싱 깨짐현상 발생)
      pkgPutInListLimit: 3,
      // 휴일정보
      selectPkgInfo: {
        pkgNo: '',
        storeCode: '',
        rmTypeCode: ''
      }
    }
  },
  computed: {
    // 예약 최소 일자
    minDate () {
      // 오늘
      let today = moment()
      if (this.form.pkgPutInList && this.form.pkgPutInList.length > 0) {
        // 당일 예약가능 체크
        let minDate = today
        let todayRsvYn = 0

        for (const row of this.form.pkgPutInList) {
          if (row.todayRsvYn === 'Y') {
            if (row.todayRsvTime && parseInt(moment().format('HHmm')) > parseInt(row.todayRsvTime)) {
              // 가능예약시간이 초과하였을 경우 오늘 + 1
              todayRsvYn++
            }
          } else {
            // 불가능일 경우 오늘 + 1
            todayRsvYn++
          }
          // 예약 최소일자 구하기
          if (moment(row.saleBgnYmd) > moment(minDate)) {
            minDate = row.saleBgnYmd
          }
        }
        // 당일예약 가능여부
        if (todayRsvYn > 0) {
          today = today.add(1, 'days')
        }

        return (moment(minDate) > today ? moment(minDate) : today).format('YYYY-MM-DD')
      } else {
        return today.format('YYYY-MM-DD')
      }
    },
    // 예약 최대 일자
    maxDate () {
      if (this.form.pkgPutInList && this.form.pkgPutInList.length > 0) {
        let maxDate = moment('29991231')
        for (const row of this.form.pkgPutInList) {
          // 종료일자 중 최소일자 구하기
          if (moment(row.saleEndYmd) < moment(maxDate)) {
            maxDate = row.saleEndYmd
          }
        }
        return moment(maxDate).format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    // 패키지 신청 목록 헤더
    pkgPutInHeaders () {
      if (this.isPartner) {
        return [
          { text: '패키지 명', value: 'pkgName', align: 'center', sortable: false, width: '20%' },
          { text: '영업장명', value: 'storeName', align: 'center', sortable: false, width: '10%' },
          { text: '객실유형명', value: 'rmTypeName', align: 'center', sortable: false, width: '10%' },
          { text: '예약블럭', value: 'rsvBlckCode', align: 'center', sortable: false, width: '10%' },
          { text: '삭제', value: 'action', align: 'center', sortable: false, width: '10%' }
        ]
      } else {
        return [
          { text: '패키지 명', value: 'pkgName', align: 'center', sortable: false, width: '20%' },
          { text: '영업장명', value: 'storeName', align: 'center', sortable: false, width: '10%' },
          { text: '객실유형명', value: 'rmTypeName', align: 'center', sortable: false, width: '10%' },
          { text: '예약블럭', value: 'rsvBlckCode', align: 'center', sortable: false, width: '10%' }
        ]
      }
    }
  },
  async mounted () {
    try {
      // 파라미터 셋팅
      this.isModify = this.instance.params.isModify
      this.param = this.instance.params.param
      // 파트너 대매사 리스트 조회
      const agentInfo = await partnerPkgReservationService.selectPartnerPkgAgentList()
      this.agentList = agentInfo.data
      // 상세보기일 경우 데이터를 조회한다.
      if (this.isModify) {
        await this.search()
        this.isLoading = true
      } else {
        // 신규 일 경우 입력가능 여부 true
        this.canSubmit = true
        this.isLoading = true
        // 신규일 경우 대매사를 첫번째 데이터로 맵핑해준다
        if (_.isArray(this.agentList) && this.agentList.length > 0) {
          this.selectAgent(this.agentList[0])
        }
      }
      await this.$store.dispatch('keypress/addKeyEventList', {
        eventList: [{ target: 'F4', action: this.submit, writeAuth: true }]
      })
    } catch (e) {
    }
  },
  methods: {
    /**
         * 데이터 조회
         */
    async search () {
      try {
        if (this.param.appSeq) {
          // 패키지예약 정보 맵핑 (객실유형 포함)
          const res = await partnerPkgReservationService.selectPartnerPkgRsvApplyDataList(this.param.appSeq)
          this.form = res.data
          // 변경가능 셋팅
          this.canSubmit = res.data.canSubmit
          // 신청상태가 아니라면 writable false
          this.writable = res.data.aprlCode === 'A'
        }
      } catch (e) {
      }
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
        if (this.form.pkgPutInList.length === 0) {
          await this.$dialog.alert('패키지예약 신청 목록이 존재하지 않습니다.')
          return
        }
        await this.$dialog.confirm(`패키지예약 신청을 ${this.isModify ? '수정' : '등록'} 하시겠습니까?`)
        if (this.isModify) {
          if (!this.form.appSeq) {
            this.$dialog.alert('신청 정보가 없습니다.')
            return
          }
          await partnerPkgReservationService.updatePartnerPkgApply(this.form.appSeq, this.form)
          // await partnerPkgReservationService.updatePartnerPkgReservationApply(this.form.appSeq, this.form) // 추후 삭제 처리(20201130-구지훈 / 신규개발에 따른 사용정지)
        } else {
          await partnerPkgReservationService.insertPartnerPkgApply(this.form)
          // await partnerPkgReservationService.insertPartnerPkgReservationApply(this.form) // 추후 삭제 처리(20201124-구지훈 / 신규개발에 따른 사용정지)
        }
        await this.$dialog.alert(`패키지예약 신청을 ${this.isModify ? '수정' : '등록'} 하였습니다.`)
        this.close({ change: true })
      } catch (e) {
      }
    },
    /**
         * 대매사 선택
         * @param info
         */
    selectAgent (info) {
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
    // 신청취소
    async cancel () {
      try {
        await this.$dialog.confirm('패키지예약 신청취소를 진행 하시겠습니까?')
        await partnerPkgReservationService.cancelPartnerPkgReservation(this.form.appSeq)
        this.$dialog.alert('패키지예약 신청을 취소 하였습니다.')
        this.close({ change: true })
      } catch (e) {
      }
    },
    /**
         * 재신청
         */
    async reApply () {
      try {
        await this.$dialog.confirm('패키지예약 재신청 진행 하시겠습니까?')
        await partnerPkgReservationService.updatePartnerPkgReApply(this.form.appSeq)
        this.$dialog.alert('패키지예약 재신청 하였습니다.')
        this.close({ change: true })
      } catch (e) {
      }
    },
    /**
         * 휴일정보 파라미터 셋팅
         */
    searchHoliday (data) {
      if (this.selectPkgInfo.pkgNo === data.pkgNo) {
        return
      }
      this.selectPkgInfo.pkgNo = data.pkgNo
      this.selectPkgInfo.storeCode = data.storeCode
      this.selectPkgInfo.rmTypeCode = data.rmTypeCode
    },
    /**
         * 패키지 신청 목록 삭제
         */
    remove (data) {
      this.$dialog.confirm('패키지를 삭제하시겠습니까?').then(() => {
        this.form.pkgPutInList.splice(this.form.pkgPutInList.indexOf(data), 1)
      }).catch(() => {
      })
    },
    /**
         * 패키지예약 신청 등록 팝업
         */
    pkgPutInList () {
      // 패키지예약 신청목록 제한 체크
      if (this.form.pkgPutInList.length >= this.pkgPutInListLimit) {
        this.$dialog.alert('신청목록은 ' + this.pkgPutInListLimit + '개까지 등록 가능합니다.')
        return
      }
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/PartnerPkgPutInDialog',
        params: {
          partnerSeq: this.form.partnerSeq,
          aprlCode: this.form.aprlCode,
          pkgPutInList: this.form.pkgPutInList
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1200,
          closeCallback: (params) => {
            if (params && params.data) {
              // 신청 목록 추가
              this.form.pkgPutInList.push({
                pkgName: params.data.pkgName,
                pkgNo: params.data.pkgNo,
                storeName: params.data.storeName,
                storeCode: params.data.storeCode,
                rmTypeName: params.data.rmTypeName,
                rmTypeCode: params.data.rmTypeCode,
                rsvBlckCode: params.data.rsvBlckCode,
                saleBgnYmd: params.data.saleBgnYmd,
                saleEndYmd: params.data.saleEndYmd,
                todayRsvYn: params.data.todayRsvYn,
                todayRsvTime: params.data.todayRsvTime,
                rmCnt: params.data.rmCnt,
                nights: params.data.nights
              })
            }
          }
        }
      })
    }
  }
}
</script>
