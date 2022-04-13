<template>
    <v-container fluid>
        <v-form ref="form" lazy-validation autocomplete="off">
            <v-row class="elevation-2">
                <v-col cols="12" class="subtitle-1 font-weight-bold">
                    업체 이용정보
                </v-col>
                <v-col cols="3">
                    <v-label>업체 명</v-label>
                    <v-text-field v-if="isNew" v-model="form.companyName" label="" :rules="emptyRules" readonly @click="openPartner">
                        <template v-slot:append-outer>
                            <v-btn outlined color="info" @click="openPartner" tabindex="-1"><v-icon left>search</v-icon> 조회</v-btn>
                        </template>
                    </v-text-field>
                    <v-text-field v-else :value="form.companyName" label="" readonly hide-details></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-label>업무 구분</v-label>
                    <v-text-field :value="form.taskTypeCodeName" label="" readonly hide-details></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-label>업무 구분 이름</v-label>
                    <v-text-field :value="form.taskTypeName" label="" readonly hide-details></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-label>회원번호</v-label>
                    <v-text-field :value="form.memNo" label="" readonly hide-details></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-label>판매 채널</v-label>
                    <v-text-field :value="form.saleChnnlName" label="" readonly hide-details></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-label>대매사(대매사 코드)</v-label>
                    <v-text-field :value="form.agentCode ? form.agentCodeName + '  (' +form.agentCode+')' : '' " label="" readonly hide-details></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-label>이용 시작기간</v-label>
                    <v-text-field :value="form.useBgnYmd | date" label="" readonly append-icon="event_note" hide-details></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-label>이용 종료기간</v-label>
                    <v-text-field :value="form.useEndYmd | date" label="" readonly append-icon="event_note" hide-details></v-text-field>
                </v-col>
              <!--
                <v-col cols="3">
                    <v-label>관리자 번호</v-label>
                    <v-text-field :value="form.mgtNo" label="" readonly hide-details></v-text-field>
                </v-col>
                -->
              <v-col cols="3">
                <v-label>예치금 KEY</v-label>
                <v-text-field :value="form.depoKey" label="" readonly hide-details></v-text-field>
              </v-col>
                <v-col cols="3">
                    <v-label>예치금 적용여부</v-label>
                    <v-text-field :value="form.depoYn === 'Y'? '적용': form.depoYn === 'N'? '미적용': ''" label="" readonly hide-details></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-label>예치금 미적용사유</v-label>
                    <v-textarea :value="form.depoDesc" auto-grow rows="1" label="" readonly></v-textarea>
                </v-col>
            </v-row>
            <v-row class="elevation-2 mt-5">
                <v-col cols="12" class="subtitle-1 font-weight-bold">
                    업체 API 서비스 정보
                </v-col>
                <v-col cols="3">
                    <v-label>BUSINESS ID</v-label>
                    <v-text-field v-if="isNew" v-model="form.businessId" :rules="emptyRules" required>
                        <template v-slot:append-outer>
                            <v-btn outlined color="info" tabindex="-1" @click="createBusinessID">자동생성</v-btn>
                            <v-btn outlined color="primary" tabindex="-1" @click="checkBusinessID"><v-icon left>check</v-icon>중복체크</v-btn>
                        </template>
                    </v-text-field>
                    <v-text-field v-else v-model="form.businessId" :rules="emptyRules" required disabled></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-label>사용 여부</v-label>
                    <v-radio-group v-model="form.useYn" row :rules="emptyRules">
                        <v-radio label="사용" value="Y"></v-radio>
                        <v-radio label="미사용" value="N"></v-radio>
                    </v-radio-group>
                </v-col>
                <template v-if="!isNew">
                    <v-col cols="12" v-if="!isNew">
                        <v-label>인증토큰</v-label>
                        <v-textarea v-model="form.tokenKey" readonly rows="1" auto-grow  id="tokenArea">
                            <template v-slot:append-outer>
                                <v-btn color="primary" @click="copyToken"><v-icon left>folder_open</v-icon>복사</v-btn>
                                <v-btn color="accent" @click="createToken"><v-icon left>vpn_key</v-icon>토큰 재발행</v-btn>
                            </template>
                        </v-textarea>
                    </v-col>
                    <v-col cols="12">
                        <v-label>인증토큰 발급이력</v-label>
                        <v-simple-table class="bordered mt-5">
                            <thead>
                                <tr>
                                    <th class="text-center">발급번호</th>
                                    <th class="text-center">토큰 키</th>
                                    <th class="text-center">사용여부</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="term in form.tokenHistory" :key="term.hisSeq">
                                    <td class="text-center">{{term.hisSeq}}</td>
                                    <td :class="['text-center', term.tokenKey !== form.tokenKey ? 'strike' : '']">
                                      {{term.tokenKey}}
                                    </td>
                                    <td class="text-center">{{term.tokenKey === form.tokenKey ? '사용중' : '폐기'}}</td>
                                </tr>
                                <tr v-if="!form.tokenHistory || form.tokenHistory.length === 0">
                                    <td colspan="3" class="text-center">인증토큰 발급이력이 존재하지 않습니다.</td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                    </v-col>
                </template>
            </v-row>
        </v-form>
        <v-row v-if="writeAuth">
            <v-col cols="12" class="text-right">
                <v-btn v-if="isNew" color="info" rounded @click="submit"><v-icon left>arrow_forward</v-icon>다음 단계</v-btn>
                <v-btn v-else color="info" rounded @click="submit"><v-icon left>check</v-icon>수정</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import service from '@/api/modules/api/service.service'

export default {
  props: { item: Object, isNew: Boolean, insertData: Object, search: Function },
  name: 'InformationTab',
  mounted () {
    if (this.isNew) {
      this.form = {
        businessId: '',
        partnerSeq: '',
        companyName: '',
        termSeq: '',
        agentCodeName: '',
        taskType: '',
        taskTypeCodeName: '',
        taskTypeName: '',
        memNo: '',
        saleChnnl: '',
        saleChnnlName: '',
        useBgnYmd: null,
        useEndYmd: null,
        depoYn: '',
        depoDesc: '',
        useYn: 'Y',
        tokenKey: '',
        tokenHistory: []
      }
      this.$refs.form.resetValidation()
    } else {
      service.selectServiceInformation(this.item.businessId).then(res => {
        this.form = res.data
      })
      // 아이디 중복체크 통과
      this.idCheck = true
    }
  },
  data () {
    return {
      form: {},
      idCheck: false
    }
  },
  methods: {
    openPartner () {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/PartnerTermSearch',
        params: {
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1400,
          closeCallback: (params) => {
            if (params && params.data) {
              this.form = Object.assign({}, this.form, params.data)
            }
          }
        }
      })
    },
    createToken () {
      this.$dialog.confirm('토큰 재발행 시 기존 토큰은 사용하실 수 없습니다.<br/>재발행을 진행하시겠습니까?').then(() => {
        service.createTokenKey(this.form.businessId).then(res => {
          this.form.tokenKey = res.data.tokenKey
          this.form.tokenHistory = res.data.tokenHistory
          this.$dialog.alert('토큰이 재발행 되었습니다. 기존 토큰은 사용하실 수 없습니다.')
        })
      })
    },
    createBusinessID () {
      if (this.form.partnerSeq) {
        service.createBusinessID(this.form.partnerSeq).then(res => {
          this.form.businessId = res.data
        })
      } else {
        this.$dialog.alert('업체를 선택하셔야 자동생성을 할 수 있습니다.')
      }
    },
    copyToken () {
      const element = document.querySelector('#tokenArea')
      element.select()
      document.execCommand('copy')
      window.getSelection().removeAllRanges()
      this.$dialog.alert('복사 되었습니다.')
    },
    checkBusinessID () {
      if (this.form.businessId) {
        service.checkBusinessID(this.form.businessId).then(res => {
          if (res.data) {
            this.$dialog.alert('이미 사용중인 아이디 입니다. 다른아이디를 입력해 주세요.')
            this.form.businessId = ''
            this.idCheck = false
          } else {
            this.$dialog.alert('사용가능한 아이디 입니다.')
            this.idCheck = true
          }
        })
      } else {
        this.$dialog.alert('아이디를 입력하여 주세요.')
      }
    },
    submit () {
      this.validForm(this.$refs.form).then(() => {
        if (!this.idCheck) {
          this.$dialog.alert('아아디 중복체크를 하셔야 진행 하실 수 있습니다.')
          return
        }
        if (this.isNew) {
          this.$emit('setPartner', this.form)
          this.$emit('update:insertData', Object.assign({}, this.insertData, { service: Object.assign({}, this.insertData.service, this.form) }))
        } else {
          this.$dialog.confirm('기본 정보를 수정 하시겠습니까?').then(() => {
            service.updateService(this.form).then(res => {
              this.$dialog.alert('정보를 수정하였습니다.')
              this.search()
            })
          })
        }
      })
    }
  }
}
</script>
