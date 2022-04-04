<template>
    <v-card-text>
        <v-form ref="form" lazy-validation>
            <v-container fluid>
             <!--<v-row>
                 <v-col md="2" class="ml-auto pr-0">
                   <v-select v-model="excelSeq"
                             :items="selectTicketExcelList"
                             item-value="value"
                             item-text="name"
                             label=""
                             :disabled="excelDisabled"
                   ></v-select>
                 </v-col>
                 <v-col md="1" class="text-right pl-0 align-self-center">
                   <v-btn rounded color="info" @click="ticketExcelDown" :disabled="excelDisabled">엑셀 다운로드</v-btn>
                 </v-col>
                 <v-col md="1" class="text-left align-self-center">
                   <v-btn rounded color="primary" @click="openReportDialog" v-if="writeAuth" width="90px">품의서</v-btn>
                 </v-col>
             </v-row>-->
              <v-row>
                <v-col cols="12" class="text-right">
                  <v-btn rounded color="primary" @click="openReportDialog" v-if="writeAuth">상품상세</v-btn>
                </v-col>
              </v-row>
              <v-row>
                  <v-col sm="4" md="2">
                      <v-label>우대번호</v-label>
                      <v-text-field v-model="form.ticketNo" label="" ref="ticketNo" @keypress.enter="openTicketSearchForm" maxlength="8"
                                    :rules="emptyRules.concat(numberRules)" required :disabled="data.status === 'modify'"></v-text-field>
                  </v-col>
                  <v-col align-self="center" sm="2" md="1" class="pl-0">
                      <v-btn outlined color="info" @click="openTicketSearchForm" tabindex="-1" :disabled="data.status === 'modify'" v-if="writeAuth"><!--우대번호 조회-->
                        <v-icon left>search</v-icon> 조회
                      </v-btn>
                  </v-col>
                  <v-col sm="4" md="3">
                      <v-label>우대번호 명</v-label>
                      <v-text-field v-model="form.ticketNm" label="" disabled class="text--black"></v-text-field>
                  </v-col>
                  <v-col sm="4" md="3">
                      <v-label>우대번호 유효기간</v-label>
                      <v-text-field v-model="form.vaildThruYmd" label="" disabled></v-text-field>
                  </v-col>
                  <v-col sm="4" md="2">
                      <v-label>발행매수</v-label>
                      <v-currency-field v-model="form.issuQty" label="" disabled></v-currency-field>
                  </v-col>
              </v-row>

              <v-row v-if="writeAuth">
                <v-col sm="4" md="3">
                  <v-label>우대구분</v-label>
                  <v-text-field v-model="form.pvlIndCd" label="" disabled></v-text-field>
                </v-col>
                <v-col sm="4" md="3">
                  <v-label>실적분과</v-label>
                  <v-text-field v-model="form.actualDvidCd" label="" disabled></v-text-field>
                </v-col>
                <v-col sm="4" md="3">
                  <v-label>신청자</v-label>
                  <v-text-field v-model="form.applcntEmplNo" label="" disabled></v-text-field>
                </v-col>
                <v-col sm="4" md="2">
                  <v-label>발행자</v-label>
                  <v-text-field v-model="form.issuEmplNo" label="" disabled></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col sm="4" md="3" class="pr-12">
                    <v-label>우대번호 명</v-label>
                    <v-text-field v-model="form.ticketRealNm" label="" class=""></v-text-field>
                </v-col>
                <v-col sm="4" md="2">
                    <v-label>판매 파트너명</v-label>
                    <v-text-field v-model="form.ptnrNm" label="" :rules="emptyRules" required disabled></v-text-field>
                </v-col>
                <v-col align-self="start" sm="2" md="1" class="pl-0 pt-10">
                  <v-btn outlined color="info" @click="openPartnerTerm" tabindex="-1" v-if="writeAuth"><v-icon left>search</v-icon> 조회</v-btn>
                </v-col>
                <v-col sm="4" md="3">
                  <v-label>판매채널</v-label>
                  <v-combobox
                    v-model="form.saleChnnl"
                    counter="100"
                    placeholder="판매채널을 입력해 주세요."
                    :items="saleChnnlList"
                    :rules="maxLengthRules(100).concat(emptyRules)"
                  ></v-combobox>
                </v-col>
              </v-row>
              <v-row>
                <v-col sm="12" md="6" class="pt-0">
                  <v-row>
                    <v-col md="6">
                      <v-label>판매 업체 담당자</v-label>
                    </v-col>
                    <v-col md="6" class="text-right">
                      <v-btn rounded outlined @click="chargeSearch" color="info" :disabled="chargeDisableYn" v-if="writeAuth">
                        <v-icon small>add</v-icon>추가
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-data-table
                    :no-data-text="'데이터가 없습니다.'"
                    :no-result-text="'데이터가 없습니다..'"
                    :headers="chrgHeaders"
                    :items="form.chrgList"
                    hide-default-footer
                    class="bordered"
                  >
                    <template v-slot:item.chrgType="{item}">
                      <v-select v-model="item.chrgType" :items="chrgCodeList" item-text="commCdNm" item-value="commCd"></v-select>
                    </template>
                    <template v-slot:item.action="{ item }">
                      <v-btn small color="accent" rounded outlined @click="chrgRemove(item)">
                        <v-icon small>remove</v-icon>삭제
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-col>
                <v-col sm="12" md="6" class="pt-0">
                  <v-row>
                    <v-col md="6">
                      <v-label>운영 담당자</v-label>
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
                    :items="form.prodList"
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

              <!-- 우대번호 결합 Data Table -->
              <v-row>
                <v-col md="12" class="pt-0">
                  <v-row justify="space-between">
                    <v-col cols="6" align-self="end">
                      <v-label>우대번호 상품 정보</v-label>
                      <v-tooltip top>
                        <template v-slot:activator="{ on }">
                          <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
                        </template>
                        <span>1) 상품은 Z코드만 등록 및 이용가능 ( 그룹화된 번호 포함 [객실,입장권,할인권 등] ) <br>
                                → ex) Y 또는 사용가능으로 발행 시 API 연동 시스템 이용 불가<br>
                                → ex) 51번대 1000장 Z코드 발행 / 98번대 1000장 Y코드 발행 시 상태값이 맞지 않아 API 연동 시스템 이용 불가<br>
                              2) 그룹화된 우대번호의 경우 메인과 결합된 우대번호의 발행수량이 동일 해야함<br>
                                → ex) 51번대 1000장 발행 / 98번대 1장 발행 시 잔여수량이 맞지 않아 시스템 이용불가</span>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="6" class="text-right">
                      <v-btn rounded outlined @click="openGroupDialog" color="info" :disabled="ticketDetailYn" v-if="writeAuth">
                        <v-icon small>check</v-icon>수정
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-data-table
                    class="bordered"
                    :hide-default-header="true"
                    :items="form.groupList"
                    hide-default-footer
                  >
                    <template v-slot:body="{ items }">
                      <thead>
                      <tr>
                        <th class="text-center">우대번호 ( 잔여수량 )</th>
                        <th class="text-center">우대번호 명</th>
                        <th class="text-center">상품명</th>
                        <th class="text-center">상품구분</th>
                        <th class="text-center">요금</th>
                        <th class="text-center">수량</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr align="center" v-for="(item, index) in items" :key="index">
                        <td>{{item.ticketNo}} ( {{item.remainCnt | price}}개 )</td>
                        <td>{{item.ticketNm}}</td>
                        <td>{{item.itemNm}}</td>
                        <td>{{item.itemInd | label(itemIndList, 'commCd', 'commCdNm')}}</td>
                        <td>{{item.amt | price}}</td>
                        <td>{{item.qty | price}}</td>
                      </tr>
                      <tr align="center" class="grey lighten-3">
                        <td class="font-weight-bold">합계</td>
                        <td class="font-weight-bold pr-12" colspan="5" align="right" >{{sumGroupAmt | price}} 원</td>
                      </tr>
                      </tbody>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
              <!-- 우대번호 결합 Data Table -->

                <v-row>
                    <v-col sm="4" md="3">
                        <v-label>판매 시작일자</v-label>
                        <date-picker
                          v-model='form.saleBgnYmd'
                          :max="form.vaildThruEndYmd"
                          format="YYYY-MM-DD"
                        >
                        </date-picker>
                    </v-col>
                    <v-col sm="4" md="3">
                        <v-label>판매 종료일자</v-label>
                      <date-picker
                        v-model='form.saleEndYmd'
                        :max="form.vaildThruEndYmd"
                        format="YYYY-MM-DD"
                      >
                      </date-picker>
                    </v-col>
                </v-row>

                <v-row>
                  <v-col md="4" class="pb-0">
                    <span class="font-weight-bold red--text" v-if="form.useImprtyYn !== '1'">자동발행, 추가발행이 불가능한 우대번호 입니다.</span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col md="1">
                      <v-label>우대번호<br>자동발행 여부</v-label>
                      <v-tooltip top>
                          <template v-slot:activator="{ on }">
                              <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
                          </template>
                          <span>발행 총 제한 수량까지 자동 발행됩니다.</span>
                      </v-tooltip>
                  </v-col>
                  <v-col md="2">
                      <v-radio-group v-model="form.autoIssuYn" row @change="checkAutoIssuYn" :disabled="autoIssuDisabled">
                          <v-radio label="발행" value="Y"></v-radio>
                          <v-radio label="미발행" value="N"></v-radio>
                      </v-radio-group>
                  </v-col>
                  <v-col sm="4" md="2">
                      <v-label>자동발행 기준</v-label>
                      <v-currency-field v-model="form.autoIssuRate" label="" suffix="%" :disabled="isDisabled" :rules="numberRules.concat(emptyRules, mountRules)"></v-currency-field>
                  </v-col>
                  <v-col sm="4" md="2">
                    <v-label>자동발행 수량</v-label>
                    <!--<v-currency-field v-model="form.autoIssuCnt" label="" :disabled="isDisabled" type="number" :rules="numberRules.concat(emptyRules)"></v-currency-field>-->
                    <v-select v-if="!isDisabled" v-model="form.autoIssuCnt" :items="amtList" :disabled="isDisabled" :rules="emptyRules"></v-select>
                    <v-text-field v-else v-model="form.autoIssuCnt" :disabled="isDisabled"></v-text-field>
                  </v-col>
                  <v-col sm="4" md="2">
                      <v-label>발행 총 제한수량</v-label>
                      <v-currency-field class="autoIssuLmt" v-model="form.autoIssuLmt" label="" :disabled="isDisabled" :rules="numberRules.concat(emptyRules)"></v-currency-field>
                  </v-col>
                </v-row>

                <v-row>
                    <v-col md="1">
                        <v-label>예치금 계산 여부</v-label>
                    </v-col>
                    <v-col md="2">
                        <v-radio-group v-model="form.depoApplyYn" row class="mt-0">
                            <v-radio label="적용" value="Y"></v-radio>
                            <v-radio label="미적용" value="N"></v-radio>
                        </v-radio-group>
                    </v-col>
                    <v-col sm="4" md="4">
                        <v-label>미적용 사유</v-label>
                        <v-text-field v-model="form.depoNapplyResn" label="" :disabled="form.depoApplyYn === 'N' ? false : true"></v-text-field>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12" class="text-right">
                        <v-btn color="info" @click.prevent="submit()" rounded :disabled="checkCnt" v-if="writeAuth">{{status}}</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
    </v-card-text>
</template>

<script>
import ticketSearchService from 'Api/modules/social/ticketSearch.service'
import commonCodeService from 'Api/modules/system/commonCode.service'

export default {
  props: { data: Object, complete: Boolean, close: Function, step: Function },
  name: 'TicketRegForm1',
  data () {
    return {
      sumGroupAmt: 0, // 우대번호 상품정보 요금 합계
      itemIndList: [], // 우대번호 상품정보 - 상품구분
      saleChnnlList: [], // 판매채널 목록
      amtList: ['1000', '900', '800', '700', '600', '500', '400', '300', '200', '100'], // 자동발행 수량
      checkCnt: false,
      // cntFlag: null,
      status: '',
      form: {
        groupList: [], // 우대번호 결합상품 정보
        chrgList: [], // 판매 업체 담당자 목록
        prodList: [], // 운영 담당자 목록
        vaildThruEndYmd: null, // 판매종료일자 maxDate
        autoIssuYn: 'N', // 우대번호 자동발행 여부
        depoApplyYn: 'Y', // 예치금 계산 여부
        useImprtyYn: '1',
        autoIssuRate: 0, // 자동발행 기준
        autoIssuCnt: 0, // 자동발행 수량
        autoIssuLmt: 0 // 자동발행 총 제한수량
      },
      chrgCodeList: [], // 담당자 - 담당유형 공통코드
      excelSeq: 0,
      selectTicketExcelList: [{ value: 0, name: '순번 선택' }],
      mountRules: [
        v => v <= 100 || '100 이하로 입력해 주세요.'
      ]
    }
  },
  computed: {
    // 판매 업체 담당자
    chrgHeaders () {
      if (this.isPartner) {
        return [
          { text: '담당자 명', value: 'chrgNm', align: 'center', sortable: false, width: '40%' },
          { text: '담당 유형', value: 'chrgType', align: 'center', sortable: false, width: '40%' }
        ]
      } else {
        return [
          { text: '담당자 명', value: 'chrgNm', align: 'center', sortable: false, width: '40%' },
          { text: '담당 유형', value: 'chrgType', align: 'center', sortable: false, width: '40%' },
          { text: '삭제', value: 'action', align: 'center', sortable: false, width: '20%' }
        ]
      }
    },
    // 운영 담당자
    empHeaders () {
      if (this.isPartner) {
        return [
          { text: '사번', value: 'emplNo', align: 'center', sortable: false, width: '30%' },
          { text: '이름', value: 'adminName', align: 'center', sortable: false, width: '25%' },
          { text: '담당 유형', value: 'chrgType', align: 'center', sortable: false, width: '25%' }
        ]
      } else {
        return [
          { text: '사번', value: 'emplNo', align: 'center', sortable: false, width: '30%' },
          { text: '이름', value: 'adminName', align: 'center', sortable: false, width: '25%' },
          { text: '담당 유형', value: 'chrgType', align: 'center', sortable: false, width: '25%' },
          { text: '삭제', value: 'action', align: 'center', sortable: false, width: '20%' }
        ]
      }
    },
    // 판매 업체 담당자 disabled
    chargeDisableYn () {
      return !(this.form.ptnrNm !== undefined && this.form.ptnrNm !== '')
    },
    // 우대번호 상품정보 disabled
    ticketDetailYn () {
      return !(this.form.ticketNo !== undefined && this.form.ticketNo !== '')
    },
    // 우대번호 자동발행 disabled
    isDisabled () {
      return this.form.autoIssuYn !== 'Y'
    },
    // USE_IMPRTY_YN Column 이 1이 아닌경우 자동발행, 추가발행 금지
    autoIssuDisabled () {
      return this.form.useImprtyYn !== '1'
    },
    // 엑셀다운로드 disabled
    excelDisabled () {
      return !this.data.ticketNo
    }
  },
  mounted () {
    this.status = this.data.status === 'regist' ? '등록' : '수정'
    // 수정
    if (this.data.ticketNo) {
      this.selectTicketNoDetail(this.data.ticketNo)
    }
    // 우대번호 상품정보 상품구분
    this.selectItemInd()
    // 담당자 담당유형 공통코드 조회
    this.getChrgCode()
    // 판매 채널 목록 조회
    this.selectSaleChnnlList()
  },
  methods: {
    // 판매채널 목록조회
    selectSaleChnnlList () {
      const saleChnnlList = []
      ticketSearchService.selectSaleChnnlList().then(res => {
        if (res.data) {
          res.data.forEach(item => {
            saleChnnlList.push(item.saleChnnl)
          })
          this.saleChnnlList = saleChnnlList
        }
      })
    },
    // 업체 이용정보 조회 팝업 호출
    openPartnerTerm () {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/PartnerTermSearch',
        params: {
          taskType: 'SOCIAL_API'
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1400,
          closeCallback: (params) => {
            if (params && params.data) {
              // 판매 업체 담당자 초기화
              this.form.chrgList = []
              this.$set(this.form, 'ptnrNo', params.data.ptnrNo)
              this.$set(this.form, 'ptnrNm', params.data.ptnrNm + '(' + params.data.taskTypeNm + ')')
              this.$set(this.form, 'termSeq', params.data.termSeq)
            }
          }
        }
      })
    },
    // 우대번호 조회 Modal
    openTicketSearchForm () {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Social/Register/TicketSearchForm',
        params: {
          ticketNo: this.form.ticketNo
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1000,
          closeCallback: (params) => {
            if (params && params.data) {
              const row = params.data
              // 메인 우대번호
              const rowArr = ['ticketNo', 'ticketNm', 'ticketRealNm', 'issuQty', 'vaildThruBgnYmd', 'vaildThruEndYmd', 'vaildThruYmd', 'useImprtyYn', 'pvlIndCd', 'actualDvidCd', 'applcntEmplNo', 'issuEmplNo']
              for (const arr of rowArr) {
                this.$set(this.form, arr, row[arr])
              }
              // 결합 우대번호 초기화
              this.form.groupList = []
              // 판매업체 담당자 초기화
              this.form.chrgList = []
              for (const ticket of row.groupList) {
                const groupTicket = { ticketNo: ticket.ticketNo, remainCnt: ticket.remainCnt, ticketNm: ticket.ticketNm, itemNm: '', itemInd: '', amt: 0, qty: 1, useYn: '', cancelPsblYn: '', issuQtyList: [] }
                this.form.groupList.push(groupTicket)
              }
              // 우대번호 결합상품 총 합계
              this.sumAmtGroupList()
              // 우대번호 잔여수량 확인
              this.checkRemainCnt()
            }
          }
        }
      })
    },
    // 우대번호 상품정보 다이얼로그
    openGroupDialog () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Social/Register/TicketRegGroupDialog',
        params: {
          groupList: _.cloneDeep(this.form.groupList)
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 1800,
          closeCallback: (params) => {
            // 변경되면 적용한다.
            if (params && params.data) {
              this.form.groupList = params.data
              this.sumAmtGroupList()
            }
          }
        }
      })
    },
    // 품의서
    openReportDialog () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Social/Register/ReportDialog',
        params: {
          report: this.form.report
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 800,
          closeCallback: (params) => {
            if (params && params.data) {
              this.form.report = params.data
            }
          }
        }
      })
    },
    // 우대번호 상세조회
    selectTicketNoDetail (ticketNo) {
      ticketSearchService.selectTicketDetail(ticketNo).then(res => {
        if (res.data) {
          this.form = res.data
          // 우대번호 결합상품 총 합 요금
          this.sumAmtGroupList()
          // 메인 우대번호 명 변경 했을경우, 변경된 값 set
          this.setMainTicketNm()
          // 우대번호 잔여수량 확인
          this.checkRemainCnt()
          // 엑셀 다운로드 순번 select box (우대번호, 순번, 난수번호)
          // this.setExcelDownSelectBox()
        }
      })
    },
    // 우대번호 상품정보 상품구분
    selectItemInd () {
      commonCodeService.selectCommonCode('ITEM_IND').then(res => {
        if (res.data) {
          this.itemIndList = res.data
        }
      })
    },
    // date format 변경
    setSaleYmd () {
      // 판매 시작일자, 종료일자
      const ymdArr = ['saleBgnYmd', 'saleEndYmd']
      ymdArr.forEach(item => {
        this.form[item] = this.form[item].replaceAll('-', '')
      })
    },
    // 메인 우대번호 명 변경 했을경우, 변경된 값 set
    setMainTicketNm () {
      if (this.form.groupList.length > 0) {
        if (this.form.ticketNm !== this.form.groupList[0].ticketNm) {
          this.form.groupList[0].ticketNm = this.form.ticketNm
        }
      }
    },
    // 잔여 우대번호 체크
    checkRemainCnt () {
      this.checkCnt = false
      let cnt = 0
      if (this.form.groupList.length > 0) {
        cnt = this.form.groupList[0].remainCnt // 메인우대번호 잔여수량
      }
      this.form.groupList.forEach(item => {
        // 잔여 우대번호가 0일 경우 등록버튼 비활성화
        if (item.remainCnt < 1) {
          this.checkCnt = true
          // this.cntFlag = 'A' // 잔여 우대번호 0
        }
        // 메인, 결합 잔여 개수 다른경우
        if (item.remainCnt !== cnt) {
          this.checkCnt = true
          // this.cntFlag = 'B'
        }
      })
    },
    // 우대번호, 순번, 난수번호 Excel Download
    ticketExcelDown () {
    },
    // 엑셀 다운로드(우대번호, 순번, 난수번호)
    setExcelDownSelectBox () {
      // 발행 매수
      // const count = Math.floor(this.form.issuQty / 2000)
      // const mod = (this.form.issuQty % 2000)
      // for (let i = 0; i < count; i++) {
      // }
      // console.log(count)
      // console.log(mod)
      // console.log(this.form.issuQty % 2000)
      // this.selectTicketExcelList.push({ value: '002000', name: '000001 ~ 002000' })
    },
    // 우대번호 자동발행 여부 변경 (미 발행시 초기화)
    checkAutoIssuYn () {
      if (this.form.autoIssuYn === 'N') {
        this.form.autoIssuRate = 0 // 자동발행 기준
        this.form.autoIssuCnt = 0 // 자동발행 수량
        this.form.autoIssuLmt = 0 // 발행 총 제한수량
      } else {
        this.form.autoIssuCnt = '1000' // 자동발행 수량
      }
    },
    // 담당자 담당유형 공통코드 조회
    getChrgCode () {
      commonCodeService.selectCommonCode('COMM0008').then(res => {
        if (res.data) {
          this.chrgCodeList = res.data
        }
      })
    },
    // 판매 업체 담당자 삭제
    chrgRemove (data) {
      this.$dialog.confirm('담당자를 삭제하시겠습니까?').then(() => {
        this.form.chrgList.splice(this.form.chrgList.indexOf(data), 1)
      }).catch(() => {})
    },
    // 판매 업체 담당자
    chargeSearch () {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/PartnerChargeSearch',
        params: {
          ptnrNo: this.form.ptnrNo
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1200,
          closeCallback: (params) => {
            if (params && params.data) {
              // 담당자명, 담당 유형 추가
              this.form.chrgList.push({ chrgNm: params.data.chrgNm, chrgType: 'A', ptnrChrgId: params.data.ptnrChrgId, ticketNo: this.form.ticketNo })
            }
          }
        }
      })
    },
    // 운영 담당자
    empSearch () {
      if (!this.form.prodList) {
        this.form.prodList = []
      }
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
              this.form.prodList.push({ ticketNo: this.form.ticketNo, emplNo: params.data.emplNo, adminName: params.data.adminName, chrgType: 'A', isNew: 'Y' })
            }
          }
        }
      })
    },
    // 운영 담당자 삭제
    accountEmpRemove (data) {
      this.$dialog.confirm('선택한 데이터를 삭제하시겠습니까?').then(() => {
        if (data.isNew !== 'Y') {
          // 신규가 아닐경우 실제 삭제
          ticketSearchService.deleteProdChrg(data).then(() => {})
        }
        this.form.prodList.splice(this.form.prodList.indexOf(data), 1)
      }).catch(() => {})
    },
    // 등록, 수정
    submit () {
      this.validForm(this.$refs.form).then(() => {
        if (this.form.ticketNm === undefined) {
          this.$dialog.alert('우대번호를 조회해 주세요.')
          return
        }
        // 우대번호 상품정보, 상세 유효성 체크
        if (this.checkFormValidation()) {
          // 날짜 format 변경
          this.setSaleYmd()
          this.$dialog.confirm('우대번호를 ' + this.status + ' 하시겠습니까?').then(() => {
            if (this.data.status === 'regist') {
              this.save()
            } else {
              this.update()
            }
          }).catch(() => {})
          this.$emit('update:complete', true)
        }
      })
    },
    // 등록
    save () {
      ticketSearchService.insertTicketInfo(this.form).then(() => {
        this.$dialog.alert(this.status + ' 되었습니다.').then(() => {
          // this.checkCnt = true
          this.form.status = 'modify'
          this.status = '수정'
          this.$emit('update:data', this.form)
        })
      })
    },
    // 수정
    update () {
      ticketSearchService.updateTicketInfo(this.form).then(() => {
        this.$dialog.alert(this.status + ' 되었습니다.').then(() => {
          this.selectTicketNoDetail(this.data.ticketNo)
        })
      })
    },
    // 우대번호 상품정보 상품 합계
    sumAmtGroupList () {
      this.sumGroupAmt = this.form.groupList.reduce((sum, data) => sum + Number(data.amt * data.qty), 0)
    },
    // 우대번호 상품, 상세, 자동발행 여부 유효성
    checkFormValidation () {
      let valid = true
      this.form.groupList.forEach(item => {
        if (!item.itemNm) {
          this.$dialog.alert('상품명은 필수입니다.').then(() => {
            this.openGroupDialog()
          })
          valid = false
        }
      })
      if (this.form.autoIssuYn === 'Y') {
        valid = false
        if (this.form.autoIssuRate === 0) {
          this.$dialog.alert('자동발행 기준은 0% 이상이여야 합니다.')
        } else if (this.form.autoIssuLmt <= this.form.issuQty) {
          this.$dialog.alert('발행 총 제한 수량은 발행매수 보다 커야 합니다.')
        } else {
          valid = true
        }
      }
      return valid
    }
  }
}
</script>
