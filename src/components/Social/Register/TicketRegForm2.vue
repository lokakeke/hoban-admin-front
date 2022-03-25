<template>
  <v-card-text>
    <v-form ref="form" lazy-validation>
      <v-container fluid>
        <v-row v-show="false">
          <v-col cols="12" class="text-right">
            <v-btn color="primary" @click="searchInfo()" rounded>정보 불러오기</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col sm="4" md="2">
            <v-label>정산 그룹번호</v-label>
            <v-text-field v-model="form.calcNo" label @keypress.enter="openSearchGroupForm" disabled></v-text-field>
          </v-col>
          <v-col align-self="center" sm="2" md="1" class="pl-0">
            <v-btn outlined color="info" @click="openSearchGroupForm" tabindex="-1" v-if="writeAuth"><!--정산 그룹번호 조회-->
              <v-icon left>search</v-icon> 조회
            </v-btn>
          </v-col>
          <v-col sm="6" md="3" class="pl-0">
            <v-label>정산구분</v-label>
            <v-select
              v-model="form.calcInd"
              :items="calcIndList"
              item-text="commCdNm"
              item-value="commCd"
            ></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col md="6" class="pt-0">
            <v-row justify="space-between">
              <v-col cols="6">
                <v-label>수수료율</v-label>
              </v-col>
              <v-col md="6" class="text-right">
                <v-btn rounded outlined @click="addCommission()" color="info" v-if="writeAuth">
                  <v-icon small>add</v-icon>추가
                </v-btn>
              </v-col>
            </v-row>
            <v-data-table
              :no-data-text="'데이터가 없습니다.'"
              :no-result-text="'데이터가 없습니다..'"
              :headers="headers"
              :items="form.cmsnList"
              hide-default-footer
              class="bordered"
            >
              <template v-slot:item.corpInd="{ item }">
                <span>{{item.corpInd | label(corpIndList, 'commCd', 'commCdNm')}} <span v-if="item.corpInd == 'D'">({{data.ptnrNm}})</span> </span>
              </template>
              <template v-slot:item.cmsnRate="{ item }">
                <span>{{item.cmsnRate}} %</span>
              </template>
              <template v-slot:item.action="{ item }">
                <v-btn small color="info" rounded outlined @click="addCommission(item)" v-if="writeAuth">
                  <v-icon small>check</v-icon>수정
                </v-btn>
                <v-btn small color="accent" rounded outlined @click="commissionRemove(item)" v-if="writeAuth">
                  <v-icon small>remove</v-icon>삭제
                </v-btn>
              </template>
              <template v-slot:body.append>
                <tr align="center" class="grey lighten-3">
                  <td class="font-weight-bold">합계</td>
                  <td class="font-weight-bold">{{commissionSum}} %</td>
                  <td v-if="!isPartner"></td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
          <v-col sm="12" md="6" class="pt-0">
            <v-row>
              <v-col md="6">
                <v-label>정산검수(사업장 담당자)</v-label>
              </v-col>
              <v-col md="6" class="text-right">
                <v-btn rounded outlined @click="empSearch" color="info" v-if="writeAuth">
                  <v-icon small>add</v-icon>추가
                </v-btn>
              </v-col>
            </v-row>
            <v-data-table
              :no-data-text="'데이터가 없습니다.'"
              :no-result-text="'데이터가 없습니다..'"
              :headers="empHeaders"
              :items="form.chrgList"
              hide-default-footer
              class="bordered"
            >
              <template v-slot:item.chrgType="{item}">
                <v-select v-model="item.chrgType" :items="chrgCodeList" item-text="commCdNm" item-value="commCd" :disabled="item.isNew === 'Y' ? false : true"></v-select>
              </template>
              <template v-slot:item.action="{ item }">
                <v-btn small color="accent" rounded outlined @click="accountEmpRemove(item)">
                  <v-icon small>remove</v-icon>삭제
                </v-btn>
              </template>
            </v-data-table>
          </v-col>
        </v-row>

        <v-row>
          <v-col md="1">
            <v-label>위약적용 여부</v-label>
          </v-col>
          <v-col md="2">
            <v-radio-group v-model="form.bkpmsYn" row class="mt-0" @change="checkBkpmsYn">
              <v-radio label="적용" value="Y"></v-radio>
              <v-radio label="미적용" value="N"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col sm="4" md="2" class="pl-2">
            <v-label>위약률</v-label>
            <v-text-field v-model="form.bkpmsRate" label suffix="%" :disabled="isDisabled" type="number" :rules="floatRule.concat(emptyRules, mountRules)"></v-text-field>
          </v-col>
          <v-col sm="4" md="2">
            <v-label>위약금 수수료율</v-label>
            <v-text-field v-model="form.bkpmsCmsnRate" label suffix="%" :disabled="isDisabled" type="number" :rules="floatRule.concat(emptyRules, mountRules)"></v-text-field>
          </v-col>
          <v-col sm="4" md="4">
            <v-label>미사용 수수료 계산식</v-label>
            <v-select
              v-model="form.uuseCalcWayInd"
              :items="calcWayList"
              item-text="commCdNm"
              item-value="commCd"
              :disabled="isDisabled"
            ></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col md="1">
            <v-label>배분 여부</v-label>
          </v-col>
          <v-col md="2">
            <v-radio-group v-model="form.dstbYn" row class="mt-0">
              <v-radio label="적용" value="Y"></v-radio>
              <v-radio label="미적용" value="N"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col sm="6" md="4" class="pl-2">
            <v-label>영업장</v-label>
            <v-select
              v-model="form.lcalCd"
              :items="lcalList"
              item-text="lcalNm"
              item-value="lcalCd"
              :disabled="form.dstbYn == 'N' ? false : true"
            ></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" class="text-right">
            <v-btn color="info" @click="submit()" rounded v-if="writeAuth">{{data.status === 'regist' ? '등록' : '수정'}}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card-text>
</template>

<script>
import ticketCalcService from 'Api/modules/social/ticketCalc.service'
import commonCodeService from 'Api/modules/system/commonCode.service'
import storeService from 'Api/modules/system/store.service'
import ticketSearchService from 'Api/modules/social/ticketSearch.service'

export default {
  props: { data: Object, close: Function, step: Function },
  name: 'TicketRegform2',
  data () {
    return {
      calcIndList: [], // 정산 구분
      lcalList: [], // 지역 목록
      calcWayList: [], // 미사용 수수료 계산식
      corpIndList: [], // 수수료율(법인구분 목록)
      chrgCodeList: [], // 정산검수 - 담당유형 공통코드
      form: {},
      initForm: {
        bkpmsYn: 'N', // 위약 적용 여부
        dstbYn: 'Y', // 배분 여부
        calcInd: 'A', // 정산 구분
        cmsnList: [], // 수수료율
        chrgList: [], // 정산검수(담장자 목록)
        bkpmsRate: '0', // 위약률
        bkpmsCmsnRate: '0', // 위약금 수수료율
        uuseCalcWayInd: '' // 미사용 수수료 계산식
      },
      // 위약율, 위약금 수수료율 유효성
      mountRules: [
        v => v <= 100 || '100 이하로 입력해 주세요.'
      ],
      floatRule: [
        v => (!v || /^[0-9\\.]+$/.test(v)) || '숫자만 입력 가능합니다.'
      ]
    }
  },
  computed: {
    // 수수료율
    headers () {
      if (this.isPartner) {
        return [
          { text: '법인구분', value: 'corpInd', align: 'center', sortable: false, width: '40%' },
          { text: '수수료율', value: 'cmsnRate', align: 'center', sortable: false, width: '30%' }
        ]
      } else {
        return [
          { text: '법인구분', value: 'corpInd', align: 'center', sortable: false, width: '40%' },
          { text: '수수료율', value: 'cmsnRate', align: 'center', sortable: false, width: '30%' },
          { text: '삭제', value: 'action', align: 'center', sortable: false, width: '30%' }
        ]
      }
    },
    // 정산검수
    empHeaders () {
      if (this.isPartner) {
        return [
          { text: '사번', value: 'emplNo', align: 'center', sortable: false, width: '30%' },
          { text: '이름', value: 'mngmUserNm', align: 'center', sortable: false, width: '25%' },
          { text: '담당 유형', value: 'chrgType', align: 'center', sortable: false, width: '25%' }
        ]
      } else {
        return [
          { text: '사번', value: 'emplNo', align: 'center', sortable: false, width: '30%' },
          { text: '이름', value: 'mngmUserNm', align: 'center', sortable: false, width: '25%' },
          { text: '담당 유형', value: 'chrgType', align: 'center', sortable: false, width: '25%' },
          { text: '삭제', value: 'action', align: 'center', sortable: false, width: '20%' }
        ]
      }
    },
    // 위약 적용 여부
    isDisabled () {
      return this.form.bkpmsYn !== 'Y'
    },
    // 수수료율 합계
    commissionSum () {
      let commission = 0
      if (this.form.cmsnList) {
        commission = this.form.cmsnList.reduce((sum, data) => sum + Number(data.cmsnRate), 0).toFixed(1)
      }
      return commission
    }
  },
  mounted () {
    // step 증가 function prop 추가 필요
    console.log('step 2 mounted')
    // 우대번호 set
    this.form.ticketNo = this.data.ticketNo
    // 공통코드 조회
    this.getCommonCode()
    // 정산 페이지 조회
    this.search()
  },
  methods: {
    // 공통코드 조회
    getCommonCode () {
      // 'SOCIAL0001' : 법인구분, 'SOCIAL0002' : 정산구분, 'SOCIAL0003' : 미사용 수수료 계산식, 'COMM0008' : 담당자 - 담당유형
      const codes = ['SOCIAL0001', 'SOCIAL0002', 'SOCIAL0003', 'COMM0008']
      commonCodeService.selectCommonCodeArray(codes).then(res => {
        if (res.data) {
          this.corpIndList = res.data.SOCIAL0001 // 법인구분
          this.calcIndList = res.data.SOCIAL0002 // 정산구분
          this.calcWayList = res.data.SOCIAL0003 // 미사용 수수료 계산식
          this.chrgCodeList = res.data.COMM0008 // 담당자 - 담당유형
        }
      })
      // 영업장 조회
      storeService.selectLcalCdList().then(res => {
        this.lcalList = res.data
      })
    },
    // 정산페이지 조회
    search () {
      ticketCalcService.selectTicketCalcInfo(this.data.ticketNo).then(res => {
        if (res.data) {
          this.form = Object.assign({}, this.initForm, res.data)
        }
      })
    },
    // 위약적용 여부 변경 시
    checkBkpmsYn () {
      if (this.form.bkpmsYn === 'N') {
        this.form.bkpmsRate = '0' // 위약률
        this.form.bkpmsCmsnRate = '0' // 위약금 수수료율
        this.form.uuseCalcWayInd = '' // 미사용 수수료 계산식
      } else {
        this.form.uuseCalcWayInd = 'A' // 미사용 수수료 계산식
      }
    },
    // 정산 그룹번호 조회
    openSearchGroupForm () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Social/Register/GroupSearchForm',
        params: {
          data: this.data
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1000,
          closeCallback: (params) => {
            if (params && params.data) {
              this.$set(this.form, 'calcNo', params.data.calcNo)
            }
          }
        }
      })
    },
    // 정보 불러오기
    searchInfo () {
    },
    // 수수료율 추가/수정 Modal Open
    addCommission (row) {
      let isNew = true
      const ptnrNm = this.data.ptnrNm
      let commForm = {}
      if (row) {
        isNew = false
        commForm = this.cloneDeep(row)
      }
      this.$store.dispatch('dialog/open', {
        componentPath: '/Social/Register/CommissionDialog',
        params: {
          isNew,
          commForm,
          ptnrNm
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 800,
          closeCallback: (params) => {
            if (params && params.data) {
              // 신규 추가
              if (isNew) {
                this.form.cmsnList.push({ ticketNo: this.form.ticketNo, cmsnRate: params.data.cmsnRate, corpInd: params.data.corpInd })
                this.setCmsnSeq()
              } else { // 수정
                const list = []
                for (let row of this.form.cmsnList) {
                  if (params.data.cmsnSeq === row.cmsnSeq) {
                    row = params.data
                  }
                  list.push(row)
                }
                this.form.cmsnList = list
              }
            }
          }
        }
      })
    },
    // 수수료율 삭제
    commissionRemove (data) {
      this.$dialog.confirm('선택한 데이터를 삭제하시겠습니까?').then(() => {
        this.form.cmsnList.splice(this.form.cmsnList.indexOf(data), 1)
        this.setCmsnSeq()
      }).catch(() => {})
    },
    // 수수료율 cmsnSeq set
    setCmsnSeq () {
      let seq = 1
      this.form.cmsnList.forEach(item => {
        item.cmsnSeq = seq
        seq++
      })
    },
    // 정산검수(사업장 담당자)
    empSearch () {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/AdminSearch',
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1200,
          closeCallback: (params) => {
            if (params && params.data) {
              // 사번, 이름, 담당유형
              this.form.chrgList.push({ ticketNo: this.form.ticketNo, emplNo: params.data.emplNo, mngmUserNm: params.data.mngmUserNm, chrgType: 'A', isNew: 'Y' })
            }
          }
        }
      })
    },
    // 정산검수 삭제
    accountEmpRemove (data) {
      this.$dialog.confirm('선택한 데이터를 삭제하시겠습니까?').then(() => {
        if (data.isNew !== 'Y') {
          // 신규가 아닐경우 실제 삭제
          ticketSearchService.deleteProdChrg(data).then(() => {})
        }
        this.form.chrgList.splice(this.form.prodList.indexOf(data), 1)
      }).catch(() => {})
    },
    // 등록
    submit () {
      this.validForm(this.$refs.form).then(() => {
        this.$dialog.confirm('정산 정보를 등록하시겠습니까?').then(() => {
          ticketCalcService.insertTicketCalcInfo(this.form).then(res => {
            this.$dialog.alert('저장되었습니다.').then(() => {
              this.search()
            })
          })
        }).catch(() => {})
      })
    }
  }
}
</script>

<style scoped>
</style>
