<template>
  <v-card flat>
    <v-card-text>
      <v-form ref="form" lazy-validation autocomplete="off">
        <v-row>
          <v-col cols="3">
            <v-label>아이디</v-label>
            <v-text-field type="text" v-model="form.loginId" :rules="emptyRules" :disabled="isModify" @change="form.loginId = trimAll($event)"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>업체 명</v-label>
            <v-text-field type="text" v-model="form.partnerName" :rules="emptyRules"></v-text-field>
          </v-col>
          <v-col v-if="isModify && (!isPartner || isSupervisor)" cols="3" align-self="center">
            <partner-password-reset :item="form"></partner-password-reset>
          </v-col>

          <v-col cols="3" align-self="center" v-if="!isPartner">
            <v-checkbox
              v-model="form.blacklistYn"
              label="블랙리스트 여부"
              false-value="N"
              true-value="Y"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row v-if="!isModify">
          <v-col cols="3">
            <v-label>비밀번호 생성</v-label>
            <v-radio-group v-model="form.tempPwYn" row :rules="emptyRules">
              <v-radio label="임시 비밀번호 생성" value="Y"></v-radio>
              <v-radio label="비밀번호 직접 입력" value="N"></v-radio>
            </v-radio-group>
          </v-col>
          <template v-if="form.tempPwYn === 'N'">
            <v-col cols="3">
              <v-label>
                비밀번호
                <v-btn icon small title="비밀번호 정책확인" color="info" @click="openPasswordPolicy">
                  <v-icon>info</v-icon>
                </v-btn>
              </v-label>
              <v-text-field type="password" v-model="form.newPw" :rules="emptyRules" single-line class="pt-0 mt-1"></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-label>비밀번호 확인</v-label>
              <v-text-field type="password" ref="pwConfirm" v-model="form.newPwConfirm" :rules="emptyRules.concat(newPasswordConfirmRule)"></v-text-field>
            </v-col>
          </template>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-label>추가 인증번호 (* 파트너 관리자 추가시 필요)</v-label>
            <v-text-field :value="!isPartner || isSupervisor ? form.addAuthNo : '**********'" readonly :rules="emptyRules">
              <template v-slot:append-outer v-if="!isPartner">
                <v-btn outlined color="accent" @click="createAddAuthNo">번호 생성</v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>관리자 성명</v-label>
            <v-text-field type="text" v-model="form.ceoName" :rules="emptyRules"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>관리자 연락처</v-label>
            <v-text-field type="text" v-model="form.partnerTelNo" v-mask="['###-####-####', '##-###-####', '##-####-####']" :rules="emptyRules.concat(phoneRegex)"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>메뉴 권한</v-label>
            <v-autocomplete v-model="form.menuAuthGroupId"
                            :items="menuAuthList"
                            item-value="menuAuthGroupId"
                            item-text="menuAuthGroupName"
                            :rules="emptyRules"
                            :disabled="isPartner"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="pb-0">
            <span class="title font-weight-bold">서비스 등록관리</span>
          </v-col>
          <v-col cols="12" class="pb-0" v-if="writeAuth">
            <v-row no-gutters align="end">
              <v-col cols="8" class="subtitle-1 info--text">
                * 객실/패키지의 경우 1개의 서비스만 등록가능합니다.
              </v-col>
              <v-col cols="4" class="text-right">
                <v-btn outlined rounded color="info" @click="modifyRow()">
                  <v-icon left>add</v-icon>추가
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-simple-table class="bordered click-row">
              <thead>
              <tr>
                <th class="text-center">업무 구분</th>
                <th class="text-center">업무 구분명</th>
                <th class="text-center">회원 번호</th>
                <th class="text-center">기간</th>
                <th class="text-center">예치금 Key</th>
                <th class="text-center">예치금</th>
                <th class="text-center">예치금 적용여부</th>
                <th class="text-center">예치금 미적용사유</th>
                <th class="text-center">효력여부</th>
                <th class="text-center" v-if="!isPartner">정산 적용여부</th>
                <th class="text-center" v-if="!isModify">삭제</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(term, index) in form.terms" :key="index" @click="modifyRow(term, index)">
                <td class="text-center">{{term.taskType | label(businessList, 'commonCode', 'commonCodeName')}}</td>
                <td class="text-center">{{term.taskTypeName}}</td>
                <td class="text-center">{{term.memberNo}}</td>
                <td class="text-center">{{term.useStartDate | date}} ~ {{term.useEndDate | date}}</td>
                <td class="text-center">{{term.depositKey}}</td>
                <td class="text-center">{{term.price | price}}원</td>
                <td class="text-center">{{term.depositYn === 'Y'? '적용': '미적용'}}</td>
                <td class="text-center">{{term.depositDesc | textTruncate}}</td>
                <td class="text-center">{{term.state}}</td>
                <td class="text-center" v-if="!isPartner">{{term.calcApplyYn}}</td>
                <th class="text-center" v-if="!isModify">
                  <v-btn small color="error" outlined @click.native.stop @click="removeTerms(index)"><v-icon left>remove</v-icon>삭제</v-btn>
                </th>
              </tr>
              <tr v-if="!form.terms || form.terms.length === 0">
                <td colspan="100%" class="text-center">API 이용 정보 데이터가 없습니다.</td>
              </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </v-row>
        <template v-if="!isModify">
          <v-row>
            <v-col cols="12" class="pb-0">
              <span class="title font-weight-bold">담당자</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-label>닉네임</v-label>
              <v-text-field v-model="managerForm.managerName" label="" :rules="emptyRules" clearable></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-label>휴대폰 번호</v-label>
              <v-text-field v-model="managerForm.telNo" v-mask="['###-####-####', '###-###-####']" label="" :rules="mobileRegex" clearable></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-label>이메일 주소</v-label>
              <v-text-field v-model="managerForm.email" label="" :rules="emailRegex" clearable></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-label>슈퍼바이저 권한</v-label>
              <v-checkbox v-model="managerForm.mainAuthYn" label="슈퍼바이저 권한" hide-details true-value="Y" false-value="N"></v-checkbox>
            </v-col>
            <v-col cols="4">
              <v-label>사용여부</v-label>
              <v-checkbox v-model="managerForm.useYn" label="사용여부" hide-details true-value="Y" false-value="N"></v-checkbox>
            </v-col>
            <v-col cols="4">
              <v-label>파트너 생성 시 알림톡 발송여부</v-label>
              <v-checkbox v-model="form.sendYn" label="발송여부" hide-details true-value="Y" false-value="N"></v-checkbox>
            </v-col>
          </v-row>
        </template>
        <v-row>
          <v-col class="text-right" v-if="writeAuth">
            <v-btn v-if="isModify" rounded color="info" @click="submit"><v-icon left>check</v-icon>수정</v-btn>
            <v-btn v-else rounded color="info" @click="create"><v-icon left>check</v-icon>등록</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import partnerAccountService from '@/api/modules/system/authentication/partner/partnerAccount.service'
import partnerMenuAuthGroupService from '@/api/modules/partner/partnerMenuAuthGroup.service'
import commonCodeService from '@/api/modules/system/commonCode.service'
import PartnerPasswordReset from '@/components/Partner/Management/PartnerPasswordReset.vue'
import partnerAuthService from '@/api/modules/system/authentication/partner/partnerAuth.service'

export default {
  components: { PartnerPasswordReset },
  name: 'PartnerBasicInformation',
  props: {
    partnerSeq: Number,
    isModify: Boolean,
    setInfo: Function,
    search: Function
  },
  computed: {
    newPasswordConfirmRule () {
      if (this.form.tempPwYn === 'N' && this.form.newPw !== this.form.newPwConfirm) {
        return ['새로운 비밀번호 확인값이 다릅니다.']
      } else {
        return []
      }
    }
  },
  data () {
    return {
      form: {
        loginId: '',
        newPw: '',
        tempPwYn: 'Y',
        partnerName: '',
        newPwConfirm: '',
        memberNo: '',
        ceoName: '',
        partnerTelNo: '',
        partnerNo: '',
        menuAuthGroupId: '',
        addAuthNo: '',
        blacklistYn: 'N',
        terms: [],
        sendYn: 'Y'
      },
      managerForm: {
        managerName: '',
        telNo: '',
        email: '',
        mainAuthYn: 'Y',
        useYn: 'Y'
      },
      businessList: [],
      menuAuthList: [],
      dataIndex: -1
    }
  },
  mounted () {
    // 업무구분 코드 불러오기
    commonCodeService.selectCommonCode('TASK_TYPE').then(res => {
      this.businessList = res.data
    })
    // 파트너사 메뉴권한 불러오기
    partnerMenuAuthGroupService.selectPartnerMenuAuthGroupListInUse().then(res => {
      this.menuAuthList = res.data
    })
    if (this.isModify) {
      this.getPartnerDetails()
    }
  },
  methods: {
    getPartnerDetails () {
      partnerAccountService.selectPartnerDetails(this.partnerSeq).then(res => {
        if (res.data.terms && res.data.terms.length > 0) {
          for (const row of res.data.terms) {
            this.checkStatus(row)
          }
        }
        this.form = res.data
      })
    },
    // 추가 인증번호 발급
    createAddAuthNo () {
      this.$dialog.confirm('추가 인증번호를 생성 하시겠습니까?').then(() => {
        partnerAuthService.createAddAuthNo().then(res => {
          this.form.addAuthNo = res.data
        })
      })
    },
    checkStatus (row) {
      // 계약 시작일
      const useStartDate = moment(row.useStartDate)
      // 계약 만료일
      const useEndDate = moment(row.useEndDate)
      // 오늘이 계약일 사이라면 활성 아니면 비활성
      if (moment() >= useStartDate && moment() <= useEndDate) {
        row.state = '활성'
        row.isAvailable = true
      } else {
        row.state = '비활성'
        row.isAvailable = false
      }
    },
    modifyRow (row, index) {
      let useForm = {
        partnerSeq: this.partnerSeq,
        termSeq: '',
        taskType: '',
        taskTypeName: '',
        memberNo: '',
        useStartDate: null,
        useEndDate: null,
        depositYn: '',
        depositDesc: '',
        calcApplyYn: 'Y'
      }
      this.dataIndex = -1
      if (row) {
        useForm = Object.assign({}, row)
        useForm.useStartDate = moment(useForm.useStartDate).format('YYYYMMDD')
        useForm.useEndDate = moment(useForm.useEndDate).format('YYYYMMDD')
        useForm.partnerName = this.form.partnerName
        this.dataIndex = index
      }
      // 추가된 로우인지 아닌지 판단한다.
      const isNewData = !(useForm.partnerSeq && useForm.termSeq)

      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Partner/Management/PartnerBasicAddDialog',
        params: {
          isNewData,
          useForm,
          businessList: this.businessList
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 800,
          closeCallback: (params) => {
            if (params && params.data) {
              this.checkStatus(params.data)
              if (this.dataIndex > -1) {
                this.$set(this.form.terms, this.dataIndex, params.data)
              } else {
                this.form.terms.push(Object.assign({}, params.data))
              }
            }
          }
        }
      })
    },
    checkTerms () {
      // 객실, 패키지는 유효한 데이터가 한개만 허용된다.
      const terms = this.form.terms || []
      // 객실 체크
      if (terms.filter(data => data.taskType === 'OTA_ROOM_API').length > 1) {
        this.$dialog.alert('OTA 객실 서비스는 1개까지만 입력 가능합니다.')
        return Promise.reject(new Error('OTA 객실 서비스는 1개까지만 입력 가능합니다.'))
      }
      // 패키지 체크
      if (terms.filter(data => data.taskType === 'OTA_PKG_API').length > 1) {
        this.$dialog.alert('OTA 패키지 서비스는 1개까지만 입력 가능합니다.')
        return Promise.reject(new Error('OTA 패키지 서비스는 1개까지만 입력 가능합니다.'))
      }
      return Promise.resolve()
    },
    async submit () {
      try {
        await this.validForm(this.$refs.form)
        await this.checkTerms()
        await this.$dialog.confirm('업체 정보를 수정 하시겠습니까?')
        await partnerAccountService.updatePartner(this.form)
        this.search()
        await this.$dialog.alert('업체 정보가 수정되었습니다.')
        this.getPartnerDetails()
      } catch (e) {}
    },
    async create () {
      try {
        await this.validForm(this.$refs.form)
        await this.checkTerms()
        if (this.form.newPw !== this.form.newPwConfirm) {
          await this.$dialog.alert('패스워드 확인값이 다릅니다.')
          this.form.newPwConfirm = null
          this.$refs.pwConfirm.focus()
        } else if (!this.form.terms || this.form.terms.length === 0) {
          await this.$dialog.alert('업체 API 이용정보를 한개이상 입력해 주세요.')
        } else if (!this.managerForm.telNo && !this.managerForm.email) {
          // 둘중에 하나는 필수
          await this.$dialog.alert('담당자 휴대전화, 이메일 중 하나는 필수로 입력하여 주세요.')
        } else {
          await this.$dialog.confirm('업체 정보를 등록 하시겠습니까?')
          // 전송 폼
          const form = _.cloneDeep(this.form)
          form.partnerManager = _.cloneDeep(this.managerForm)
          const res = await partnerAccountService.insertPartner(form)
          this.setInfo(true, res.data.partnerSeq, res.data.partnerName)
          this.search()
          // 재조회
          this.$nextTick(() => {
            this.$dialog.alert('업체 정보가 입력되었습니다.').then(() => {
              this.getPartnerDetails()
            })
          })
        }
      } catch (e) {}
    },
    openPasswordPolicy () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Session/PasswordPolicy',
        params: {},
        options: {
          fullscreen: false,
          scrollable: true,
          width: 700
        }
      })
    },
    removeTerms (index) {
      this.form.terms.splice(index, 1)
    }
  }
}
</script>
