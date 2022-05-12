<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <v-icon left>add</v-icon>이용정보 {{isNewData? '추가': '상세/변경'}}
    </template>
    <v-form ref="form" lazy-validation autocomplete="off">
      <v-row>
        <v-col sm="6" md="4">
          <v-label>업무 구분</v-label>
          <v-autocomplete v-if="isNewData" v-model="useForm.taskType" clearable autocomplete="off" @change="changeTaskType"
                          :items="businessList" :item-value="'commonCode'" :item-text="'commonCodeName'" :rules="emptyRules"></v-autocomplete>
          <v-text-field v-else v-model="useForm.taskTypeCodeName" label="" :rules="emptyRules" disabled></v-text-field>
        </v-col>
        <v-col sm="6" md="4">
          <v-label>업무 구분명</v-label>
          <v-text-field v-model="useForm.taskTypeName" label="" :rules="emptyRules" clearable></v-text-field>
        </v-col>
        <v-col sm="6" md="4">
          <v-label>회원 번호</v-label>
          <v-text-field v-model="useForm.memberNo" label="" :clearable="isNewData" :disabled="!(isNewData && useForm.taskType === 'OTA_ROOM_API')"
                        :rules="useForm.taskType === 'OTA_ROOM_API'? emptyRules: undefined"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="6" md="3">
          <v-label>사용 시작일</v-label>
          <date-picker v-model="useForm.useStartDate" @change="changeContract" clearable required></date-picker>
        </v-col>
        <v-col sm="6" md="3">
          <v-label>사용 종료일</v-label>
          <date-picker v-model="useForm.useEndDate" :min="contractMinDate" :max="contractMaxDate" clearable required></date-picker>
        </v-col>
        <v-col sm="6" md="6">
          <v-label>예치금 키</v-label>
          <v-text-field
            :value="useForm.companyName"
            readonly
            @click="isNewData === false ? openDepositAccount() : null"
          >
            <template v-slot:append v-if="useForm.depositKey">
              ({{ useForm.depositKey }})
            </template>
            <template v-slot:append-outer>
              <v-btn outlined color="info" @click="openDepositAccount" tabindex="-1">
                <v-icon left>search</v-icon>조회
              </v-btn>
            </template>
          </v-text-field>
        </v-col>

        <v-col sm="6" md="4">
          <v-label>예치금 적용여부</v-label>
          <v-radio-group v-model="useForm.depositYn" row :rules="emptyRules">
            <v-radio label="적용" value="Y"></v-radio>
            <v-radio label="미적용" value="N"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col sm="12" md="8">
          <v-label>예치금 미적용 사유</v-label>
          <v-textarea v-model="useForm.depositDesc" :disabled="useForm.depositYn === 'Y'" clearable auto-grow rows="2"
                      :rules="useForm.depositYn === 'N'? emptyRules: undefined"></v-textarea>
        </v-col>
        <v-col sm="6" md="4" v-if="!isPartner">
          <v-label>정산 적용여부</v-label>
          <v-radio-group v-model="useForm.calcApplyYn" row :rules="emptyRules">
            <v-radio label="적용" value="Y"></v-radio>
            <v-radio label="미적용" value="N"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
    </v-form>
    <template v-slot:actions v-if="!readOnly">
      <v-btn v-if="writeAuth" outlined rounded color="info" @click="addData"><v-icon left>check</v-icon>적용</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DatePicker from '@/components/Date/DatePicker.vue'
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  components: { DatePicker },
  extends: DialogBase,
  name: 'PartnerBasicAddDialog',
  data () {
    return {
      useForm: Object,
      isNewData: Boolean,
      businessList: Array,
      readOnly: false
    }
  },
  computed: {
    contractMaxDate () {
      if (this.useForm.useStartDate) {
        return moment(this.useForm.useStartDate).add(2, 'years').format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    contractMinDate () {
      if (this.useForm.useStartDate) {
        return moment(this.useForm.useStartDate).format('YYYY-MM-DD')
      } else {
        return null
      }
    }
  },
  mounted () {
    this.isNewData = this.instance.params.isNewData
    this.useForm = this.instance.params.useForm
    this.businessList = this.instance.params.businessList
    if (this.instance.params.readOnly !== undefined) {
      this.readOnly = this.instance.params.readOnly
    }
  },
  methods: {
    changeContract () {
      // 계약 시작일을 지정하면 기본적으로 마지막 연도로 셋팅
      if (this.useForm.useStartDate && !this.useForm.useEndDate) {
        this.useForm.useEndDate = moment(this.useForm.useStartDate).endOf('year').format('YYYYMMDD')
      }
    },
    addData () {
      if (this.useForm.taskType === 'OTA_ROOM_API' && this.useForm.memberNo.length !== 8) {
        this.$dialog.alert('회원번호는 8자리로 입력해주시기 바랍니다.')
        return
      }
      this.validForm(this.$refs.form).then(() => {
        this.close({ data: _.cloneDeep(this.useForm) })
      })
    },
    changeTaskType () {
      if (this.useForm.taskType !== 'OTA_ROOM_API') {
        this.useForm.memberNo = ''
      }
    },
    /**
     * 예치금 계좌 선택 Dialog 열기
     */
    openDepositAccount () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/DepositAccountSearch',
        params: { partnerSeq: this.useForm.partnerSeq, taskType: this.useForm.taskType },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1200,
          closeCallback: params => {
            if (params && params.data) {
              this.$set(this.useForm, 'depositKey', params.data.depositKey)
            }
          }
        }
      })
    }
  }
}
</script>
