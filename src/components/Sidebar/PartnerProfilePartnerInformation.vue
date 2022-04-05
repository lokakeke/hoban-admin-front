<template>
  <v-card flat>
    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-row>
          <v-col cols="3">
            <v-label>파트너사 아이디</v-label>
            <v-text-field type="text" v-model="form.loginId" :rules="emptyRules" disabled></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>업체 명</v-label>
            <v-text-field type="text" v-model="form.ptnrName" :rules="emptyRules" disabled></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>추가 인증번호 (* 파트너 담당자 추가시 필요)</v-label>
            <v-text-field v-if="mainAuth" v-model="form.addCrtfNo" label="" readonly :rules="emptyRules">
              <template v-slot:append-outer>
                <v-btn outlined color="accent" @click="createAddCrtfNo">번호 생성</v-btn>
              </template>
            </v-text-field>
            <v-text-field v-else :value="addCrtfNo" readonly></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-label>관리자 성명</v-label>
            <v-text-field type="text" v-model="form.ceoName" :rules="emptyRules"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>관리자 연락처</v-label>
            <v-text-field type="text" v-model="form.capTelNo" v-mask="['###-####-####', '##-###-####', '##-####-####']" :rules="emptyRules.concat(phoneRegex)"></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="mainAuth">
          <v-col class="text-right">
            <v-btn rounded color="info" @click="submit"><v-icon left>check</v-icon>수정</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="pb-0">
            <span class="title">서비스 등록관리</span>
          </v-col>
          <v-col cols="12">
            <v-simple-table class="bordered click-row">
              <thead>
              <tr>
                <th class="text-center">업무 구분</th>
                <th class="text-center">업무 구분명</th>
                <th class="text-center">회원 번호</th>
                <th class="text-center">판매 채널</th>
                <th class="text-center">대매사</th>
                <th class="text-center">기간</th>
                <th class="text-center">관리자 번호</th>
                <th class="text-center">예치금 적용여부</th>
                <th class="text-center">예치금 미적용사유</th>
                <th class="text-center">효력여부</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(term, index) in form.terms" :key="index" @click="openDialog(term)">
                <td class="text-center">{{term.taskType | label(businessList, 'commCode', 'commCodeName')}}</td>
                <td class="text-center">{{term.taskTypeName}}</td>
                <td class="text-center">{{term.memNo}}</td>
                <td class="text-center">{{term.saleChnnl | label(saleChannelList, 'commCode', 'commCodeName')}}
                <td class="text-center">{{term.agentCodeName}}
                <td class="text-center">{{term.useBgnYmd | date}} ~ {{term.useEndYmd | date}}</td>
                <td class="text-center">{{term.mgtNo}}</td>
                <td class="text-center">{{term.depoYn === 'Y'? '적용': '미적용'}}</td>
                <td class="text-center">{{term.depoDesc | textTruncate}}</td>
                <td class="text-center">{{term.state}}</td>
              </tr>
              <tr v-if="!form.terms || form.terms.length === 0">
                <td colspan="10" class="text-center">API 이용 정보 데이터가 없습니다.</td>
              </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import commonCodeService from '@/api/modules/system/commonCode.service'
import service from '@/api/modules/partner/partner.service'
import adminAuthService from '@/api/modules/system/adminAuth.service'

export default {
  name: 'PartnerProfilePartnerInformation',
  props: {
    mainAuth: Boolean,
    partner: Object
  },
  data () {
    return {
      form: {},
      businessList: [],
      saleChannelList: []
    }
  },
  computed: {
    addCrtfNo () {
      if (this.form.addCrtfNo) {
        const length = this.form.addCrtfNo.length
        if (length > 3) {
          return this.form.addCrtfNo.substring(0, length - 3) + '***'
        } else {
          return this.form.addCrtfNo.substring(0, 1) + '**'
        }
      } else {
        return ''
      }
    }
  },
  mounted () {
    this.form = _.cloneDeep(this.partner)
    // 업무구분 코드 불러오기
    commonCodeService.selectCommonCode('TASK_TYPE').then(res => {
      this.businessList = res.data
    })
    // 판매채널 코드 불러오기
    commonCodeService.selectCommonCode('CHANNEL').then(res => {
      this.saleChannelList = res.data
    })
  },
  methods: {
    // 추가 인증번호 발급
    createAddCrtfNo () {
      this.$dialog.confirm('추가 인증번호를 생성 하시겠습니까?').then(() => {
        service.createAddCrtfNo().then(res => {
          this.form.addCrtfNo = res.data
        })
      })
    },
    openDialog (row) {
      const useForm = Object.assign({}, row)
      useForm.useBgnYmd = moment(useForm.useBgnYmd).format('YYYYMMDD')
      useForm.useEndYmd = moment(useForm.useEndYmd).format('YYYYMMDD')
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Partner//PartnerBasicAddDialog',
        params: {
          isNewData: false,
          useForm,
          businessList: this.businessList,
          saleChannelList: this.saleChannelList,
          readOnly: true
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 800
        }
      })
    },
    submit () {
      if (this.mainAuth) {
        this.validForm(this.$refs.form).then(() => {
          this.$dialog.confirm('업체 정보를 수정 하시겠습니까?').then(() => {
            adminAuthService.updateAccountProfile(this.form).then(res => {
              this.$dialog.alert('업체 정보가 수정되었습니다.').then(() => {
                this.$emit('change')
              })
            })
          })
        })
      } else {
        this.$dialog.alert('수정권한이 없습니다.')
      }
    }
  }
}
</script>
