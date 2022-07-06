<template>
  <dialog-base :title="`예치금 계좌 ${modeText}`" :instance="instance">
    <template v-slot:buttons>
      <v-btn dark text @click="save()" v-if="writeAuth">
        <v-icon left>check</v-icon>저장
      </v-btn>
    </template>
    <v-form ref="form" lazy-validation v-if="form">
      <v-row>
        <v-col sm="6" md="4">
          <v-label>예치금KEY</v-label>
          <v-text-field v-model="form.depoKey" label readonly v-if="isNew === false"></v-text-field>
          <v-text-field value="(등록 시 자동생성)" label disabled hide-details v-else></v-text-field>
        </v-col>
        <v-col sm="3" md="2">
          <v-label>파트너명</v-label>
          <v-text-field
            :value="form.partnerName"
            label
            :rules="emptyRules"
            readonly
            @click="isPartner === false ? openPartner() : null"
            v-if="isNew === true"
          >
            <template v-slot:append-outer v-if="isPartner === false">
              <v-btn outlined color="info" @click="openPartner" tabindex="-1">
                <v-icon left>search</v-icon>조회
              </v-btn>
            </template>
          </v-text-field>
          <v-text-field :value="form.partnerName" label readonly hide-details v-else></v-text-field>
        </v-col>

        <v-col sm="3" md="2">
          <v-label>파트너 번호</v-label>
          <v-text-field :value="form.partnerSeq" label readonly hide-details></v-text-field>
        </v-col>

        <v-col sm="6" md="4">
          <v-label>금액</v-label>
          <v-text-field :value="form.amt | price" label prefix="￦" readonly v-if="isNew === false"></v-text-field>
          <v-text-field value="(등록 시 0 고정)" label disabled v-else></v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="isNew === false">
        <v-col sm="6" md="4">
          <v-label>증권-입금현황</v-label>
          <v-text-field class="red--text" color="red" :value="form.insuranceAmt | price" label prefix="￦" readonly></v-text-field>
        </v-col>
        <v-col sm="6" md="4">
          <v-label>기타-입금현황</v-label>
          <v-text-field class="red--text" color="red" :value="form.uninsuranceAmt | price" label prefix="￦" readonly></v-text-field>
        </v-col>
        <v-col sm="6" md="4">
          <v-label>출금현황</v-label>
          <v-text-field class="blue--text" color="blue" :value="form.accmltWithdrawAmt | price" label prefix="￦" readonly></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="12" md="2">
          <v-label>업무유형</v-label>
          <v-autocomplete
            v-model="form.taskType"
            :items="taskTypeList"
            item-value="commonCode"
            item-text="commonCodeName"
            :rules="emptyRules"
            autocomplete="off"
          ></v-autocomplete>
        </v-col>
        <v-col sm="12" md="6">
          <v-label>메모</v-label>
          <v-textarea auto-grow no-resize rows="1" v-model="form.memo"></v-textarea>
        </v-col>
        <v-col sm="12" md="3" offset-md="1">
          <v-label>사용여부</v-label>
          <v-radio-group v-model="form.useYn" row>
            <v-radio label="사용" value="Y"></v-radio>
            <v-radio label="미사용" value="N"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <template v-if="isNew === false">
        <hr class="mt-5 mb-5" />
        <v-row>
          <v-col cols="12">
            <v-label>파트너 기간 목록</v-label>
            <v-data-table
              :no-data-text="'파트너 기간 정보가 없습니다.'"
              :headers="headers"
              :items="form.ptnrTermList"
              disable-sort
              disable-pagination
              hide-default-footer
              class="bordered mt-3"
            >
              <template
                v-slot:item.useYmd="{item}"
              >{{item.useBgnYmd | date}} ~ {{item.useEndYmd | date}}</template>
            </v-data-table>
          </v-col>
        </v-row>
      </template>
      <v-row justify="end" class="mt-5">
        <v-btn outlined rounded color="orange" @click="resetForm()" v-if="writeAuth">
          <v-icon>refresh</v-icon>원래대로
        </v-btn>
        <v-btn outlined rounded color="info" @click="save()" v-if="writeAuth">
          <v-icon>check</v-icon>
          {{ modeText }}
        </v-btn>
        <v-btn outlined rounded color="primary" @click="close()">
          <v-icon>close</v-icon>닫기
        </v-btn>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import { mapGetters } from 'vuex'
import DialogBase from '@/components/Dialog/DialogBase.vue'
import depositAccountService from '@/api/modules/api/depositAccount.service'
import commonCodeService from '@/api/modules/system/commonCode.service'

const DEFAULT_FORM = {
  partnerName: null,
  partnerSeq: null,
  amt: 0,
  useYn: 'N'
}

export default {
  name: 'DepositAccountDialog',
  extends: DialogBase,
  data () {
    return {
      // 폼
      form: _.cloneDeep(DEFAULT_FORM),
      // 원본 폼
      orgForm: {},
      // 파트너 기간 헤더
      headers: [
        { text: '예치금 구분', value: 'taskTypeCodeName', align: 'center' },
        { text: '대매사', value: 'agentCodeName', align: 'center' },
        { text: '계약기간', value: 'useYmd', align: 'center' }
      ],
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
     * 등록 or 수정 텍스트
     */
    modeText () {
      return this.isNew === true ? '등록' : '수정'
    }
  },
  methods: {
    /**
     * 초기화
     */
    async init () {
      try {
        this.selectTaskTypeList()
        if (this.isNew === false) {
          const depositAccount = await this.select()
          this.form = _.cloneDeep(depositAccount)
        }
        if (this.isPartner === true) {
          // 파트너인 경우 파트너정보 주입
          this.form.partnerSeq = this.user.number
          this.form.partnerName = this.user.name
        }
        this.orgForm = _.cloneDeep(this.form)
      } catch (e) {
        console.error(e)
        this.$dialog.alert('오류가 발생하였습니다.')
        this.close()
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
     * 상세 조회
     */
    async select () {
      const res = await depositAccountService.selectDepositAccount(
        this.instance.params.item.depoKey
      )
      return res.data
    },
    /**
     * 파트너 선택 Dialog 열기
     */
    openPartner () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/PartnerSearch',
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1400,
          closeCallback: params => {
            if (params && params.data) {
              this.$set(this.form, 'partnerName', params.data.partnerName)
              this.$set(this.form, 'partnerSeq', params.data.partnerSeq)
            }
          }
        }
      })
    },
    /**
     * 저장
     */
    save () {
      this.validForm(this.$refs.form).then(() => {
        depositAccountService[
          `${this.isNew === true ? 'insert' : 'update'}DepositAccount`
        ](this.form).then(res => {
          this.$dialog.alert(`${this.modeText}이 완료되었습니다.<br/>파트너 등록관리 -> 서비스 등록관리 메뉴에서 예치금KEY를 매칭 시켜주셔야 됩니다.`)
          this.close()
        })
      })
    },
    /**
     * 입력폼 초기화
     */
    resetForm () {
      this.form = _.cloneDeep(this.orgForm)
    }
  }
}
</script>
