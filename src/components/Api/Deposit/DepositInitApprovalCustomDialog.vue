<template>
  <dialog-base :title="`예치금 초기화 ${modeText} ${modeGubun !== null ? '('+modeGubun+')' : ''}`" :instance="instance">
    <v-form ref="form" lazy-validation v-if="form">
        <v-row>
          <v-col cols="3">
            <v-label>업무 유형</v-label>
            <v-text-field :value="form.taskType" readonly disabled></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>대상 파트너사</v-label>
            <v-text-field :value="targetPartner.ptnrNm" readonly disabled></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>객실 기준일자</v-label>
            <v-text-field :value="form.roomDt | date" readonly disabled></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>패키지 기준일자</v-label>
            <v-text-field :value="form.pkgDt | date" readonly disabled></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <h3 class="title font-weight-bold"> 적용/유지 대상 예치금 </h3>
          </v-col>
        </v-row>
        <v-sheet elevation="1">
          <v-data-table
            :headers="headerDepositRequest"
            :items="list"
            :no-data-text="'데이터가 없습니다.'"
            height="200"
            disable-pagination
            hide-default-footer
          >
            <!-- 금액 -->
            <template v-slot:[`item.amt`]="{item}">
              <strong>{{item.amt | price}}원</strong>
            </template>
          </v-data-table>
        </v-sheet>
        <v-row>
          <v-col cols="9">
            <h3 class="title font-weight-bold"> 예상 결과 </h3>
          </v-col>
          <v-col cols="3" class="text-right">
            <v-btn outlined rounded color="primary" @click="preView">
              <v-icon>search</v-icon> 미리보기
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-tooltip top z-index="1000">
              <template v-slot:activator="{ on }">
                <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
              </template>
              <span> 객실 기준일자(투숙일자) 기준으로 취소 건을 제외한 예약/투숙(노쇼포함) 건들의 합계
              </span>
            </v-tooltip>
            <v-label>객실료 합계</v-label>
            <v-text-field :value="anticipate.totRoomAmt | price" readonly disabled></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-tooltip top z-index="1000">
              <template v-slot:activator="{ on }">
                <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
              </template>
              <span> 패키지 기준일자(투숙일자) 기준으로 취소 건을 제외한 예약/투숙(노쇼포함) 건들의 합계
              </span>
            </v-tooltip>
            <v-label>패키지료 합계</v-label>
            <v-text-field :value="anticipate.getTotPkgAmt | price" readonly disabled></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-tooltip top z-index="1000">
              <template v-slot:activator="{ on }">
                <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
              </template>
              <span> 선택한 적용/유지 대상 예치금 합계
              </span>
            </v-tooltip>
            <v-label>적용/유지 대상 예치금 합계</v-label>
            <v-text-field :value="anticipate.totAmt | price" readonly disabled></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-tooltip top z-index="1000">
              <template v-slot:activator="{ on }">
                <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
              </template>
              <span> 적용/유지 대상 예치금 합계 - ( 객실료 합계 + 패키지료 합계 )
              </span>
            </v-tooltip>
            <v-label>예상 결과</v-label>
            <v-text-field :value="anticipate.anticipateAmt | price" readonly disabled></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-right">
            <v-btn outlined rounded color="info" @click="approve">
              <v-icon>check</v-icon> 적용
            </v-btn>
            <v-btn outlined rounded color="primary" @click="close">
              <v-icon>close</v-icon> 닫기
            </v-btn>
          </v-col>
        </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import { mapGetters } from 'vuex'
import DialogBase from 'Components/Dialog/DialogBase.vue'
import depositAccountService from 'Api/modules/api/depositAccount.service'

export default {
  props: {
    propForm: Object,
    propList: Array,
    propGubun: Object,
    propTargetPartner: Object
  },
  name: 'DepositInitApprovalDialog',
  extends: DialogBase,
  data () {
    return {
      form: Object,
      list: Array,
      isNew: true,
      gubun: '',
      targetPartner: Object,
      headerDepositRequest: [
        { text: '신청순번', value: 'appSeq', align: 'center' },
        { text: '입금구분', value: 'rcpmnyAcctNm', align: 'center' },
        { text: '금액', value: 'amt', align: 'center' },
        { text: '입금내용', value: 'rcpmnyNm', align: 'center' },
        { text: '등록일시', value: 'crtDt', align: 'center' },
        { text: '처리일시', value: 'procDt', align: 'center' }
      ],
      anticipate: Object
    }
  },
  mounted () {
    this.matchProps()
  },
  computed: {
    ...mapGetters({ user: 'auth/user' }),
    /**
     * 적용 or 결과 텍스트
     */
    modeText () {
      return this.isNew === true ? '선택 내역' : '결과'
    },
    /**
     * 적용 or 결과 텍스트
     */
    modeGubun () {
      return this.gubun
    }
  },
  methods: {
    /**
     * MATCH PROPS
     */
    matchProps () {
      this.form = this.instance.params.propForm
      this.list = this.instance.params.propList
      this.gubun = this.instance.params.propGubun
      this.targetPartner = this.instance.params.propTargetPartner
    },
    /**
     * 승인
     */
    async approve () {
      this.validForm(this.$refs.form)

      if (this.list.length < 1) {
        await this.$dialog.confirm('적용/유지 대상 예치금 목록이 없습니다.(전체 초기화) 계속 진행하시겠습니까?')
      }

      const paramList = {
        form: this.form,
        list: this.list,
        gubun: this.gubun,
        ptnrNo: this.targetPartner.ptnrNo,
        ptnrNm: this.targetPartner.ptnrNm,
        loginId: this.user.number
      }
      depositAccountService.updateScheduleDepositInitCustomList(paramList).then(res => {
        if (res.data.resultCode === '0000') {
          this.$dialog.alert('초기화 완료 시 "OTA 예치금 초기화" 알림이 옵니다.')
          this.close({ data: res.data })
        } else {
          this.$$dialog.alert('적용에 실패하였습니다. [' + res.data.resultMsg + ']')
        }
      })
    },
    /**
     * 미리 보기
     */
    preView () {
      this.anticipate = []

      const paramList = {
        form: this.form,
        list: this.list,
        gubun: this.gubun,
        ptnrNo: this.targetPartner.ptnrNo,
        loginId: this.user.number
      }

      depositAccountService.getDepositInitCustomPreView(paramList).then(res => {
        this.anticipate = res.data
      })
    }
  }
}
</script>
