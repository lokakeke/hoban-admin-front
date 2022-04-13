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
                          :items="businessList" :item-value="'commCode'" :item-text="'commCodeName'" :rules="emptyRules"></v-autocomplete>
          <v-text-field v-else v-model="useForm.taskTypeCodeName" label="" :rules="emptyRules" disabled></v-text-field>
        </v-col>
        <v-col sm="6" md="4">
          <v-label>업무 구분명</v-label>
          <v-text-field v-model="useForm.taskTypeName" label="" :rules="emptyRules" clearable></v-text-field>
        </v-col>
        <v-col sm="6" md="4">
          <v-label>회원 번호</v-label>
          <v-text-field v-model="useForm.memNo" label="" :clearable="isNewData" :disabled="!(isNewData && useForm.taskType === 'OTA_ROOM_API')"
                        :rules="useForm.taskType === 'OTA_ROOM_API'? emptyRules: undefined"></v-text-field>
        </v-col>
        <v-col sm="6" md="6">
          <v-label>판매 채널</v-label>
          <v-autocomplete v-model="useForm.saleChnnl" clearable autocomplete="off" :disabled="isPartner"
                          :items="saleChannelList" :item-value="'commCode'" :item-text="'commCodeName'" :rules="emptyRules"></v-autocomplete>
        </v-col>
        <v-col sm="6" md="6">
          <v-label>대매사</v-label>
          <v-text-field v-model="useForm.agentCodeName" label="" :rules="emptyRules" readonly @click="openAgent" :disabled="isPartner">
            <template v-slot:append v-if="useForm.agentCode">
              ({{useForm.agentCode}})
            </template>
            <template v-slot:append-outer v-if="!isPartner">
              <v-btn outlined color="info" @click="openAgent" tabindex="-1"><v-icon left>search</v-icon> 조회</v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="6" md="3">
          <v-label>사용 시작일</v-label>
          <date-picker v-model="useForm.useBgnYmd" @change="changeContract" clearable required></date-picker>
        </v-col>
        <v-col sm="6" md="3">
          <v-label>사용 종료일</v-label>
          <date-picker v-model="useForm.useEndYmd" :min="contractMinDate" :max="contractMaxDate" clearable required></date-picker>
        </v-col>
        <v-col sm="6" md="6">
          <v-label>예치금 키</v-label>
          <v-text-field
            :value="useForm.companyName"
            readonly
            @click="isNewData === false ? openDepositAccount() : null"
          >
            <template v-slot:append v-if="useForm.depoKey">
              ({{useForm.depoKey}})
            </template>
            <template v-slot:append-outer>
              <v-btn outlined color="info" @click="openDepositAccount" tabindex="-1">
                <v-icon left>search</v-icon>조회
              </v-btn>
            </template>
          </v-text-field>
        </v-col>

        <v-col sm="12" md="12">
          <v-label>이전 관리자 번호 (이전 예치금 차감용, 신규예치금KEY가 존재한다면 이전 예치금KEY는 자동으로 삭제 처리됩니다.)</v-label>
          <v-text-field v-model="useForm.mgtNo" label="" clearable></v-text-field>
        </v-col>

        <v-col sm="6" md="4">
          <v-label>예치금 적용여부</v-label>
          <v-radio-group v-model="useForm.depoYn" row :rules="emptyRules">
            <v-radio label="적용" value="Y"></v-radio>
            <v-radio label="미적용" value="N"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col sm="12" md="8">
          <v-label>예치금 미적용 사유</v-label>
          <v-textarea v-model="useForm.depoDesc" :disabled="useForm.depoYn === 'Y'" clearable auto-grow rows="2"
                      :rules="useForm.depoYn === 'N'? emptyRules: undefined"></v-textarea>
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
      saleChannelList: Array,
      readOnly: false
    }
  },
  computed: {
    contractMaxDate () {
      if (this.useForm.useBgnYmd) {
        return moment(this.useForm.useBgnYmd).add(2, 'years').format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    contractMinDate () {
      if (this.useForm.useBgnYmd) {
        return moment(this.useForm.useBgnYmd).format('YYYY-MM-DD')
      } else {
        return null
      }
    }
  },
  mounted () {
    this.isNewData = this.instance.params.isNewData
    this.useForm = this.instance.params.useForm
    this.businessList = this.instance.params.businessList
    this.saleChannelList = this.instance.params.saleChannelList
    if (this.instance.params.readOnly !== undefined) {
      this.readOnly = this.instance.params.readOnly
    }
  },
  methods: {
    openAgent () {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/AgentSearch',
        params: {},
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 800,
          closeCallback: (params) => {
            if (params && params.data) {
              this.useForm = Object.assign({}, this.useForm, params.data)
            }
          }
        }
      })
    },
    changeContract () {
      // 계약 시작일을 지정하면 기본적으로 마지막 연도로 셋팅
      if (this.useForm.useBgnYmd && !this.useForm.useEndYmd) {
        this.useForm.useEndYmd = moment(this.useForm.useBgnYmd).endOf('year').format('YYYYMMDD')
      }
    },
    addData () {
      if (this.useForm.taskType === 'OTA_ROOM_API' && this.useForm.memNo.length !== 8) {
        this.$dialog.alert('회원번호는 8자리로 입력해주시기 바랍니다.')
        return
      }
      this.validForm(this.$refs.form).then(() => {
        // 신규예치금키가 있다면 기존 예치금키는 삭제 처리 한다.
        if (this.useForm.depoKey) {
          this.useForm.mgtNo = ''
        }
        this.close({ data: _.cloneDeep(this.useForm) })
      })
    },
    changeTaskType () {
      if (this.useForm.taskType !== 'OTA_ROOM_API') {
        this.useForm.memNo = ''
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
              this.$set(this.useForm, 'depoKey', params.data.depoKey)
            }
          }
        }
      })
    }
  }
}
</script>
