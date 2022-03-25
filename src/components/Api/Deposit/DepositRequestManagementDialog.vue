<template>
  <dialog-base :title="`예치금 신청 ${modeText}`" :instance="instance">
    <template v-slot:buttons>
      <v-btn dark text @click="save" v-if="isApproved === false && writeAuth">
        <v-icon left>check</v-icon>저장
      </v-btn>
    </template>
    <v-form ref="form" lazy-validation v-if="form">
      <v-row>
        <v-col cols="3">
          <v-label>신청순번</v-label>
          <v-text-field v-model="form.appSeq" label readonly v-if="isNew === false"></v-text-field>
          <v-text-field value="(등록 시 자동생성)" label disabled hide-details v-else></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-label>예치금KEY</v-label>
          <v-text-field
            :value="form.depoKey"
            label
            :rules="emptyRules"
            readonly
            @click="isApproved === false ? openDepositAccount() : null"
          >
            <template v-slot:append-outer v-if="isApproved === false">
              <v-btn outlined color="info" @click="openDepositAccount" tabindex="-1">
                <v-icon left>search</v-icon>조회
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="3">
          <v-label>입금구분</v-label>
          <v-autocomplete
            v-model="form.rcpmnyAcct"
            :items="rcpmnyAcctList"
            item-value="commCd"
            item-text="commCdNm"
            :rules="emptyRules"
            autocomplete="off"
            :readonly="isApproved"
          ></v-autocomplete>
        </v-col>
        <v-col cols="3" v-if="form.rcpmnyAcct === 'B'">
          <v-label>
            보험 보증기간
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
              </template>
              <span>보증기간 만료시 자동으로 금액이 차감됩니다.</span>
            </v-tooltip>
          </v-label>
          <date-range-picker v-model="form.gtnYmd" required :readonly="isApproved"></date-range-picker>
        </v-col>
      </v-row>
      <!-- 증권의 경우 증권 파일 업로드 필요 -->
      <template v-if="form.rcpmnyAcct === 'B'">
        <hr class="mt-5 mb-5" />
        <v-row>
          <v-col cols="12">
            <attach
              v-model="form.attachBag"
              ref-fld-cd="depositRequest"
              atfl-fld-val="insuDocu"
              extensions="gif,jpg,jpeg,png,pdf"
              accept="image/png, image/gif, image/jpeg, application/pdf"
              :limit="1"
              :rules="[
                v => (!v || (v.insuDocu || []).length !== 0) || '필수 입력항목입니다.'
              ]"
              label="증권 첨부파일"
              required
            ></attach>
          </v-col>
        </v-row>
      </template>
      <hr class="mt-5 mb-5" />
      <v-row>
        <v-col cols="3">
          <v-label>업무유형</v-label>
          <v-autocomplete
            v-model="form.taskType"
            :items="taskTypeList"
            item-value="commCd"
            item-text="commCdNm"
            :rules="emptyRules"
            autocomplete="off"
            :readonly="true"
          ></v-autocomplete>
        </v-col>
        <v-col cols="3">
          <v-label>금액 ￦ {{form.amt | price}}</v-label>
          <v-text-field v-model="form.amt" prefix="￦" :rules="emptyRules" :readonly="isApproved"></v-text-field>
        </v-col>
        <!-- <v-col cols="3">
          <v-label>입금은행</v-label>
          <v-text-field v-model="form.rcpmnyBank" :rules="emptyRules" :readonly="isApproved"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-label>입금계좌번호</v-label>
          <v-text-field v-model="form.rcpmnyAcnoNo" :rules="emptyRules" :readonly="isApproved"></v-text-field>
        </v-col>-->
        <v-col cols="3">
          <v-label>입금예정일</v-label>
          <date-picker v-model="form.rcpmnyPlanYmd" required :readonly="isApproved"></date-picker>
        </v-col>
        <v-col cols="3">
          <v-label>입금내용(고양,캄제주 입금건은 표기)</v-label>
          <v-text-field v-model="form.rcpmnyNm" :rules="emptyRules" :readonly="isApproved"></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-label>기타 요청사항</v-label>
          <v-textarea auto-grow no-resize rows="1" v-model="form.reqsMemo" :readonly="isApproved"></v-textarea>
        </v-col>
      </v-row>
      <template v-if="isNew === false">
        <hr class="mt-5 mb-5" />
        <v-row>
          <v-col cols="3">
            <v-label>승인상태</v-label>
            <v-text-field :value="form.aprlNm" readonly></v-text-field>
          </v-col>
          <template v-if="isApproved">
            <v-col cols="3">
              <v-label>처리일시</v-label>
              <v-text-field :value="form.procDt | dateSet" readonly></v-text-field>
            </v-col>
          </template>
        </v-row>
        <v-row v-if="form.aprlCd === 'C'">
          <v-col cols="12">
            <v-label>반려사유</v-label>
            <v-textarea no-resize auto-grow rows="1" v-model="form.memo" readonly></v-textarea>
          </v-col>
        </v-row>
      </template>
      <v-row justify="end" class="mt-5">
        <v-col cols="6">
          <v-btn
            outlined
            rounded
            color="info"
            @click="approval()"
            v-if="isNew === false && isApproved === false && isPartner === false && writeAuth"
          >
            <v-icon>check</v-icon>승인/반려
          </v-btn>
        </v-col>
        <v-col cols="6" class="text-right">
          <v-btn
            outlined
            rounded
            color="orange"
            @click="resetForm()"
            v-if="isApproved === false && writeAuth"
          >
            <v-icon>refresh</v-icon>원래대로
          </v-btn>
          <v-btn
            outlined
            rounded
            color="info"
            @click="save()"
            v-if="isApproved === false && writeAuth"
          >
            <v-icon>check</v-icon>
            {{ modeText }}
          </v-btn>
          <v-btn outlined rounded color="primary" @click="close()">
            <v-icon>close</v-icon>닫기
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import { mapGetters } from 'vuex'
import DialogBase from 'Components/Dialog/DialogBase.vue'
import depositRequestService from 'Api/modules/api/depositRequest.service'
import commonCodeService from 'Api/modules/system/commonCode.service'

const DEFAULT_FORM = {
  depoKey: '',
  rcpmnyAcct: '',
  rcpmnyBank: '',
  rcpmnyAcnoNo: '',
  rcpmnyPlanYmd: '',
  amt: 0,
  rcpmnyNm: '',
  gtnYmd: [],
  attachBag: {
    insuDocu: []
  }
}

export default {
  name: 'DepositRequestManagementDialog',
  extends: DialogBase,
  data () {
    return {
      // 폼
      form: _.cloneDeep(DEFAULT_FORM),
      // 원본 폼
      orgForm: {},
      // 입금계정 목록
      rcpmnyAcctList: [],
      // 업무유형 목록
      taskTypeList: []
    }
  },
  computed: {
    ...mapGetters({ user: 'auth/user' }),
    /**
     * 신규 등록 여부
     */
    isNew () {
      let isNew = true
      try {
        isNew = Boolean(this.instance.params.item.depoKey) === false
      } catch {}
      return isNew
    },
    /**
     * 등록 or 수정 or 조회 텍스트
     */
    modeText () {
      let modeText = '조회'
      if (this.isApproved === false) {
        modeText = this.isNew === true ? '등록' : '수정'
      }
      return modeText
    },
    /**
     * 승인/반려 or 신청 처리 여부
     */
    isApproved () {
      return this.isNew === false && this.form.aprlCd !== 'A'
    }
  },
  methods: {
    /**
     * 초기화
     */
    async init () {
      try {
        this.selectRcpmnyAcctList()
        this.selectTaskTypeList()
        if (this.isNew === false) {
          const depositRequest = await this.select()
          if (depositRequest.rcpmnyAcct === 'B') {
            depositRequest.gtnYmd = [
              depositRequest.gtnBgnYmd,
              depositRequest.gtnEndYmd
            ]
          }
          this.form = _.cloneDeep(depositRequest)
        }
        this.orgForm = _.cloneDeep(this.form)
      } catch (e) {
        console.error(e)
        this.$dialog.alert('오류가 발생하였습니다.')
        this.close()
      }
    },
    /**
     * 상세 조회
     */
    async select () {
      const res = await depositRequestService.selectDepositRequest(
        this.instance.params.item.appSeq
      )
      return Object.assign({}, DEFAULT_FORM, res.data)
    },
    /**
     * 예치금 계좌 선택 Dialog 열기
     */
    openDepositAccount () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/DepositAccountSearch',
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1200,
          closeCallback: params => {
            if (params && params.data) {
              this.$set(this.form, 'depoKey', params.data.depoKey)
              this.$set(this.form, 'taskType', params.data.taskType)
            }
          }
        }
      })
    },
    /**
     * 입금계정 목록 조회
     */
    async selectRcpmnyAcctList () {
      this.rcpmnyAcctList = []
      try {
        const response = await commonCodeService.selectCommonCode('COMM0004')
        if (this.isPartner) {
          this.rcpmnyAcctList.push(response.data[0])
          this.rcpmnyAcctList.push(response.data[1])
        } else {
          this.rcpmnyAcctList = response.data
        }
      } catch (e) {
        console.error(e)
      }
    },
    /**
     * 업무유형 목록 조회
     */
    async selectTaskTypeList () {
      this.taskTypeList = []
      try {
        const response = await commonCodeService.selectCommonCode('COMM0009')
        this.taskTypeList = response.data
      } catch (e) {
        console.error(e)
      }
    },
    /**
     * 저장
     */
    save () {
      this.validForm(this.$refs.form).then(() => {
        // 입금구분이 증권인 경우 증권 첨부파일이 존재해야함
        if (this.form.rcpmnyAcct === 'B') {
          this.form.gtnBgnYmd = this.form.gtnYmd[0]
          this.form.gtnEndYmd = this.form.gtnYmd[1]
        }
        depositRequestService[
          `${this.isNew === true ? 'insert' : 'update'}DepositRequest`
        ](this.form).then(res => {
          this.$dialog.alert(`${this.modeText}이 완료되었습니다.`)
          this.close()
        })
      })
    },
    /**
     * 입력폼 초기화
     */
    resetForm () {
      this.form = _.cloneDeep(this.orgForm)
    },
    /**
     * 승인/반려
     */
    approval () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Api/Deposit/DepositRequestApprovalDialog',
        params: {
          depositRequest: this.form
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 600,
          closeCallback: params => {
            this.init()
          }
        }
      })
    }
  }
}
</script>
