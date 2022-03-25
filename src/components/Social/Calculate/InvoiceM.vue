<template>
  <v-card-text>
    <v-form ref="form" lazy-validation>
      <v-container fluid>
        <v-row>
          <v-col class="text-right pt-0 pb-0">
            <v-btn rounded color="primary" @click="saveInvoiceInfo" v-if="writeAuth && form.calcNo && historyYn === 'N'">상세저장</v-btn>
            <v-btn outlined rounded color="info" @click="print">
              <v-icon left>local_printshop</v-icon>인쇄
            </v-btn>
          </v-col>
        </v-row>
        <v-row dense>
          <!-- 인보이스 타이틀 -->
          <v-col cols="12" class="text-center black--text">
            <h1 class="headline-text mb-7">I N V O I C E</h1>
          </v-col>

          <!-- 소노 호텔 & 리조트 로고 -->
          <v-col cols="12" class="mb-0 pl-3 font-weight-black subtitle-1 black--text pt-0">
            <v-row justify="space-between" align="end">
              <v-col cols="3">
                <v-text-field v-model="form.corpNm" hide-details dense prefix="(주)"></v-text-field>
              </v-col>
              <img :src="logo" width="150px" alt="소노 호텔&리조트"/>
            </v-row>
          </v-col>
          <v-col cols="4" class="pl-3 font-weight-black subtitle-1 black--text pt-0">
            <v-text-field v-model="form.addr" hide-details dense placeholder="주소입력: 서울시 송파구 법원로 135 대명타워 13층"></v-text-field>
          </v-col>
          <v-col cols="8">
          </v-col>

          <!-- 인보이스 기본정보 1 -->
          <v-col cols="3" class="body-1 black--text py-2 text-center border-top border-right">
            Invoice Number
          </v-col>
          <v-col cols="9" class="body-1 black--text py-2 pl-3 border-top">
            <v-text-field v-model="form.invoiceNo" hide-details class="pt-0" dense></v-text-field>
          </v-col>
          <v-col cols="3" class="body-1 black--text py-2 text-center border-right">
            Invoice Date
          </v-col>
          <v-col cols="9" class="body-1 black--text py-2 pl-3">
            <date-picker
              v-model='form.issuYmd'
              format="YYYY-MM-DD"
              hide-details
              dense
              prepend-icon
            >
            </date-picker>
          </v-col>
          <v-col cols="3" class="body-1 black--text text-center py-2 border-right">
            발 신 자
          </v-col>
          <v-col cols="9" class="body-1 black--text py-2 pl-3">
            <v-text-field v-model="form.sendNm" hide-details dense></v-text-field>
          </v-col>
          <v-col cols="3" class="body-1 black--text text-center py-2 border-right border-bottom">
            수 신 자
          </v-col>
          <v-col cols="9" class="body-1 black--text py-2 pl-3 border-bottom">
            <v-text-field v-model="form.rcvcNm" hide-details dense></v-text-field>
          </v-col>

          <!-- 인보이스 기본정보 2 -->
          <v-col cols="3" class="body-1 black--text py-2 mt-4 text-center border-top border-right">
            <v-row style="height: 100%" justify="center" align="center">
              상 품
            </v-row>
          </v-col>
          <v-col cols="9" class="body-1 black--text py-2 pl-3 mt-4 border-top success--text">
            <v-text-field v-model="form.itemNm" hide-details dense prepend-inner-icon="mdi-18px mdi-square-inc">
            </v-text-field>
          </v-col>
          <v-col cols="3" class="body-1 black--text py-2 text-center border-right">
            정 산 기 간
          </v-col>
          <v-col cols="9" class="body-1 black--text py-2 pl-3">
            <span v-if="form.calcYmd">{{form.calcYmd}}</span>
          </v-col>
          <v-col cols="3" class="body-1 black--text py-2 text-center border-right">
            입 금 금 액
          </v-col>
          <v-col cols="9" class="body-1 black--text py-2 pl-3 font-weight-bold">
            {{(totalRow.cmsnExclAmt + addInvoiceAmtSum) | price}} 원
          </v-col>
          <v-col cols="3" class="body-1 black--text py-2 text-center border-right border-bottom">
            세금계산서 금액
          </v-col>
          <v-col cols="9" class="body-1 red--text py-2 pl-3 font-weight-bold border-bottom">
            {{form.taxInvoice | price}} 원
          </v-col>

          <!-- 인보이스 상세내역 -->
          <v-col cols="12" class="text-center subtitle-1 font-weight-bold black--text pt-3">
            상 세 내 역
          </v-col>
          <v-col cols="12" class="text-right py-1">
            [단위: 매,원 / VAT 포함]
          </v-col>
          <v-col cols="12" class="mb-1">
            <v-simple-table dense class="bordered text-center" v-dragscroll="{target: '.v-data-table__wrapper'}">
              <thead>
              <tr>
                <th class="text-center">법인</th>
                <th class="text-center">사업장</th>
                <th class="text-center">채널</th>
                <th class="text-center">핀번호</th>
                <th class="text-center">상품</th>
                <th class="text-center">판매가</th>
                <th class="text-center">유효기간</th>
                <th class="text-center">이용 수량</th>
                <th class="text-center">이용 금액</th>
                <th class="text-center">수수료</th>
                <th class="text-center">수수료 제외<br/>금액</th>
              </tr>
              </thead>
              <tbody v-if="form.invoiceList && form.invoiceList.length > 0">
              <tr v-for="(item, index) of form.invoiceList" :key="index" @click="detailInfo(item)" class="pointer">
                <td>{{item.corpNm}}</td>
                <td>{{item.storeNm}}</td>
                <td>{{item.saleChnnlNm}}</td>
                <td>{{item.ticketNo}}</td>
                <td>{{item.itemNm}}</td>
                <td>{{item.sellAmt | price}}</td>
                <td>{{item.stndBgnYmd}} ~ {{item.stndEndYmd}}</td>
                <td>{{item.useQty | price}}</td>
                <td>{{item.useAmt | price}}</td>
                <td>{{item.cmsnAmt | price}} <span v-if="item.cmsnAmt != 0">({{item.cmsnRate}}%)</span></td>
                <td>{{item.cmsnExclAmt | price}}</td>
              </tr>
              <!-- 추가정산 -->
              <tr v-if="addInvoiceList.length > 0">
                <td colspan="11" class="pa-0">
                  <v-data-table
                    class="bordered"
                    :no-data-text="'데이터가 없습니다.'"
                    :no-result-text="'데이터가 없습니다..'"
                    :headers="addInvoice"
                    :items="addInvoiceList"
                    item-key="index"
                    hide-default-footer
                  >
                    <template v-slot:item.ticketNo="{item}">
                      <v-text-field v-model="item.ticketNo" label="" :rules="emptyRules" maxlength="8"></v-text-field>
                    </template>
                    <template v-slot:item.ticketSeq="{item}">
                      <v-text-field v-model="item.ticketSeq" label="" :rules="emptyRules" maxlength="6"></v-text-field>
                    </template>
                    <template v-slot:item.checkTicket="{item}">
                      <v-btn small rounded outlined color="primary" @click="checkTicket(item)" v-if="writeAuth" width="90px">확인</v-btn>
                    </template>
                    <template v-slot:item.useQty="{item}">
                      <v-currency-field v-model="item.useQty" label :rules="numberRules.concat(emptyRules)" disabled></v-currency-field>
                    </template>
                    <template v-slot:item.useAmt="{item}">
                      <v-currency-field v-model="item.useAmt" label :rules="emptyRules" :disabled="item.checkTicketNo"></v-currency-field>
                    </template>
                    <template v-slot:item.itemStat="{item}">
                    <span v-if="item.itemStat">
                      <span v-if="item.itemStat === 'Z'">발권가능</span>
                      <span v-else-if="item.itemStat === 'Y'">사용가능</span>
                      <span v-else-if="item.itemStat === 'R'">환불</span>
                      <span v-else>사용불가능</span>
                      ({{item.itemStat}})</span>
                    </template>
                    <template v-slot:item.memo="{item}">
                      <v-text-field v-model="item.memo" label :rules="emptyRules" :disabled="item.checkTicketNo"></v-text-field>
                    </template>
                    <template v-slot:item.action="{ item }">
                      <v-btn small color="accent" rounded outlined @click="removeAddInvoiceList(item)">
                        <v-icon small>remove</v-icon>삭제
                      </v-btn>
                    </template>
                  </v-data-table>
                </td>
              </tr>
              <tr v-if="addInvoiceList.length > 0">
                <td colspan="6" class="text-right font-weight-bold">정산 원금</td>
                <td>{{totalRow.cmsnExclAmt | price}}</td>
                <td class="font-weight-bold">추가정산 합계</td>
                <td>{{addInvoiceAmtSum | price}}</td>
                <td class="font-weight-bold">정산원금 + 추가정산 합계</td>
                <td>{{(totalRow.cmsnExclAmt + addInvoiceAmtSum) | price}}</td>
              </tr>
              <tr class="sum-row">
                <td colspan="7">합 계</td>
                <td>{{totalRow.useQty | price}}</td>
                <td>{{totalRow.useAmt | price}}</td>
                <td>{{totalRow.cmsnAmt | price}}</td>
                <td>{{(totalRow.cmsnExclAmt + addInvoiceAmtSum) | price}}</td>
              </tr>
              </tbody>
              <tbody v-else>
              <tr>
                <td colspan="11" class="text-center">정산내역이 없습니다.</td>
              </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </v-row>
        <v-divider style="border-color: black"></v-divider>
        <v-row dense>
          <v-col cols="1" class="body-1 black--text pt-3">
            입금 계좌 :
          </v-col>
          <v-col cols="3" class="body-1 black--text">
            <v-text-field v-model="form.rcpmnyAcnoNo" hide-details dense></v-text-field>
          </v-col>
          <v-col cols="8" class="text-right">
            <v-btn small rounded outlined @click="addInvoiceCalc" color="info" v-if="writeAuth && historyYn === 'N'"><v-icon small>add</v-icon>정산 추가</v-btn>
            <v-btn small color="primary" rounded outlined @click="saveInvoiceCalc" v-if="writeAuth && historyYn === 'N'"><v-icon small>check</v-icon>추가정산 저장</v-btn>
          </v-col>
          <v-col cols="1" class="body-1 black--text pt-3">
            입금 기한 :
          </v-col>
          <v-col cols="3" class="body-1 black--text">
            <date-picker
              v-model='form.rcpmnyTerm'
              format="YYYY-MM-DD"
              hide-details
              dense
              prepend-icon
            >
            </date-picker>
          </v-col>
          <v-col cols="1" class="body-1 black--text pt-3">
            까지
          </v-col>
          <v-col cols="7"></v-col>
          <v-row justify="end" align="center" class="pr-4 mt-5">
            <div class="pl-5 font-weight-black subtitle-1 primary--text">
              <div class="mb-1">주 식 회 사 <span class="ml-3">{{form.corpNm}}</span></div>
              <div class="float-left">대 표 이 사</div>
              <v-text-field v-model="form.ceoNm" hide-details dense class="float-left ml-5 mt-0" style="width: 100px"></v-text-field>
              <span class="mr-4">(인)</span>
            </div>
          </v-row>
        </v-row>

        <span id="printMe" v-show="false">
          <v-row dense class="invoiceTop">
            <!-- 인보이스 타이틀 -->
            <v-col cols="12" class="text-center black--text">
              <h1 class="headline-text mb-7">I N V O I C E</h1>
            </v-col>

            <!-- 소노 호텔 & 리조트 로고 -->
            <v-col cols="12" class="mb-0 pl-3 font-weight-black subtitle-1 black--text pt-0">
              <v-row style="position: relative;">
                <v-col cols="3">
                  <span>(주) {{form.corpNm}}</span>
                </v-col>
                <img style="position: absolute; right: 20px; top: -15px;" :src="logo" width="150px" alt="소노 호텔&리조트"/>
              </v-row>
            </v-col>
            <v-col cols="4" class="pl-3 font-weight-black subtitle-1 black--text pt-0" style="padding-top: 0px;">
              <span>{{form.addr}}</span>
            </v-col>
            <v-col cols="8">
            </v-col>

            <!-- 인보이스 기본정보 1 -->
            <v-col cols="3" class="invoiceTitle body-1 black--text py-2 text-center border-top border-right">
              Invoice Number
            </v-col>
            <v-col cols="9" class="body-1 black--text py-2 pl-3 border-top">
              <span class="invoiceContent">{{form.invoiceNo}}</span>
            </v-col>
            <v-col cols="3" class="invoiceTitle body-1 black--text py-2 text-center border-right">
              Invoice Date
            </v-col>
            <v-col cols="9" class="body-1 black--text py-2 pl-3">
              <span class="invoiceContent">{{form.issuYmd}}</span>
            </v-col>
            <v-col cols="3" class="invoiceTitle body-1 black--text text-center py-2 border-right">
              발 신 자
            </v-col>
            <v-col cols="9" class="body-1 black--text py-2 pl-3">
              <span class="invoiceContent">{{form.sendNm}}</span>
            </v-col>
            <v-col cols="3" class="invoiceTitle body-1 black--text text-center py-2 border-right border-bottom">
              수 신 자
            </v-col>
            <v-col cols="9" class="body-1 black--text py-2 pl-3 border-bottom">
              <span class="invoiceContent">{{form.rcvcNm}}</span>
            </v-col>

            <!-- 인보이스 기본정보 2 -->
             <v-col cols="3" class="invoiceTitle body-1 black--text py-2 text-center border-right">
              상 품
            </v-col>
            <v-col cols="9" class="body-1 black--text py-2 pl-3">
              <span class="invoiceContent">{{form.itemNm}}</span>
            </v-col>
            <v-col cols="3" class="invoiceTitle body-1 black--text py-2 text-center border-right">
              정 산 기 간
            </v-col>
            <v-col cols="9" class="body-1 black--text py-2 pl-3">
              <span v-if="form.calcYmd"  class="invoiceContent">{{form.calcYmd}}</span>
            </v-col>
            <v-col cols="3" class="invoiceTitle body-1 black--text py-2 text-center border-right">
              입 금 금 액
            </v-col>
            <v-col cols="9" class="body-1 black--text py-2 pl-3 font-weight-bold">
              <span class="invoiceContent">{{(totalRow.cmsnExclAmt + addInvoiceAmtSum) | price}} 원</span>
            </v-col>
            <v-col cols="3" class="invoiceTitle body-1 black--text py-2 text-center border-right border-bottom">
              세금계산서 금액
            </v-col>
            <v-col cols="9" class="body-1 red--text py-2 pl-3 font-weight-bold border-bottom">
              <span class="invoiceContent">{{form.taxInvoice | price}} 원</span>
            </v-col>

            <!-- 인보이스 상세내역 -->
            <v-col cols="12" class="text-center subtitle-1 font-weight-bold black--text pt-3">
              상 세 내 역
            </v-col>
            <v-col cols="12" class="text-right py-1">
              [단위: 매,원 / VAT 포함]
            </v-col>
            <v-col class="mb-1" cols="12">
              <v-simple-table dense class="bordered text-center print-table">
                <thead>
              <tr>
                <th class="text-center">법인</th>
                <th class="text-center">사업장</th>
                <th class="text-center">채널</th>
                <th class="text-center">핀번호</th>
                <th class="text-center">상품</th>
                <th class="text-center">판매가</th>
                <th class="text-center">유효기간</th>
                <th class="text-center">이용 수량</th>
                <th class="text-center">이용 금액</th>
                <th class="text-center">수수료</th>
                <th class="text-center">수수료 제외<br/>금액</th>
              </tr>
              </thead>
              <tbody v-if="form.invoiceList && form.invoiceList.length > 0">
              <tr v-for="(item, index) of form.invoiceList" :key="index+item.ticketNo" @click="detailInfo(item)" class="pointer">
                <td>{{item.corpNm}}</td>
                <td>{{item.storeNm}}</td>
                <td>{{item.saleChnnlNm}}</td>
                <td>{{item.ticketNo}}</td>
                <td>{{item.itemNm}}</td>
                <td>{{item.sellAmt | price}}</td>
                <td>{{item.stndBgnYmd}} ~ {{item.stndEndYmd}}</td>
                <td>{{item.useQty | price}}</td>
                <td>{{item.useAmt | price}}</td>
                <td>{{item.cmsnAmt | price}} <span v-if="item.cmsnAmt != 0">({{item.cmsnRate}}%)</span></td>
                <td>{{item.cmsnExclAmt | price}}</td>
              </tr>
              <tr style="background-color: #eeeeee" v-if="addInvoiceList.length > 0">
                  <th class="text-center" colspan="11">추가정산</th>
              </tr>
              <tr style="background-color: #eeeeee" v-if="addInvoiceList.length > 0">
                <th class="text-center" colspan="2">우대번호</th>
                <th class="text-center">순번</th>
                <th class="text-center">사용수량</th>
                <th class="text-center" colspan="2">금액</th>
                <th class="text-center" colspan="2">상태</th>
                <th class="text-center" colspan="3">메모</th>
              </tr>
              <tr v-for="(item, index) of addInvoiceList" :key="index+item.ticketSeq">
                <td colspan="2">{{item.ticketNo}}</td>
                <td>{{item.ticketSeq}}</td>
                <td>{{item.useQty}}</td>
                <td colspan="2">{{item.useAmt | price}}</td>
                <td colspan="2"><span v-if="item.itemStat === 'Z'">발권가능</span>
                    <span v-else-if="item.itemStat === 'Y'">사용가능</span>
                    <span v-else-if="item.itemStat === 'R'">환불</span>
                    <span v-else>사용불가능</span>({{item.itemStat}})
                </td>
                <td colspan="3">{{item.memo}}</td>
              </tr>
              <tr v-if="addInvoiceList.length > 0">
                <td colspan="6" class="text-right font-weight-bold">정산 원금</td>
                <td>{{totalRow.cmsnExclAmt | price}}</td>
                <td class="font-weight-bold">추가정산 합계</td>
                <td>{{addInvoiceAmtSum | price}}</td>
                <td class="font-weight-bold">정산원금 + 추가정산 합계</td>
                <td>{{(totalRow.cmsnExclAmt + addInvoiceAmtSum) | price}}</td>
              </tr>
              <tr class="sum-row">
                <td colspan="7">합 계</td>
                <td>{{totalRow.useQty | price}}</td>
                <td>{{totalRow.useAmt | price}}</td>
                <td>{{totalRow.cmsnAmt | price}}</td>
                <td>{{(totalRow.cmsnExclAmt + addInvoiceAmtSum) | price}}</td>
              </tr>
              </tbody>
              <tbody v-else>
              <tr>
                <td colspan="11" class="text-center">정산내역이 없습니다.</td>
              </tr>
              </tbody>
              </v-simple-table>
            </v-col>
          </v-row>
          <v-divider style="border-color: black; margin: 5px 5px;"></v-divider>
          <v-row dense class="invoiceBottom" style="position:relative;">
            <v-col cols="12" class="body-1 black--text pt-3">
              입금 계좌 : <span style="padding-left: 15px;">{{form.rcpmnyAcnoNo}}</span>
            </v-col>
            <v-col cols="12" class="body-1 black--text pt-3">
              입금 기한 : <span style="padding-left: 15px;">{{form.rcpmnyTerm}} 까지</span>
            </v-col>
            <v-row style="position: absolute; right: 30px; top: 10px;" align="center" class="ceoClass pr-4 mt-5">
              <div class="pl-5 font-weight-black subtitle-1 primary--text">
                <div class="mb-1">주 식 회 사 <span class="ml-3" style="padding-left: 10px;">{{form.corpNm}}</span></div>
                <div class="float-left">대 표 이 사 <span style="padding-left: 10px;">{{form.ceoNm}}</span> <span style="padding-left: 20px;">(인)</span>
                </div>
              </div>
            </v-row>
          </v-row>
        </span>
      </v-container>
    </v-form>
  </v-card-text>
</template>

<script>
import calculateService from 'Api/modules/social/calculate.service'

export default {
  props: { data: Object, close: Function },
  name: 'InvoiceM',
  data () {
    return {
      historyYn: 'N', // 이전정산 페이지 여부
      param: {
        calcInd: '',
        calcSeq: '',
        calcNo: ''
      },
      addInvoice: [
        { text: '우대번호', value: 'ticketNo', align: 'center', sortable: false, width: '15%' },
        { text: '우대번호 순번', value: 'ticketSeq', align: 'center', sortable: false, width: '15%' },
        { text: '우대번호 상태', value: 'checkTicket', align: 'center', sortable: false, width: '5%' },
        { text: '사용수량', value: 'useQty', align: 'center', sortable: false, width: '5%' },
        { text: '금액', value: 'useAmt', align: 'center', sortable: false, width: '15%' },
        { text: '상태', value: 'itemStat', align: 'center', sortable: false, width: '5%' },
        { text: '메모', value: 'memo', align: 'center', sortable: false, width: '30%' },
        { text: '삭제', value: 'action', align: 'center', sortable: false, width: '7%' }
      ],
      addInvoiceList: [], // 추가정산 목록
      addInvoiceAmtSum: 0, // 추가정산 합계
      form: {
        corpNm: '', // 법인명
        addr: '', // 주소
        invoiceNo: '', // Invoice No
        issuYmd: '', // Invoice Date
        sendNm: '', // 발신자
        rcvcNm: '', // 수신자
        itemNm: '', // 상품명
        calcYmd: '', // 정산기간
        deposit: 0, // 입금금액
        taxInvoice: 0, // 세금계산서 금액
        rcpmnyAcnoNo: '', // 입금계좌
        rcpmnyTerm: '', // 입금기한
        ceoNm: '', // 대표자명
        invoiceList: [] // Invoice List
      },
      /**
         * logo 경로
         */
      logo: '/static/img/logo/logo_sono_hnr.svg'
    }
  },
  computed: {
    totalRow () {
      const totalRow = {
        useQty: '',
        useAmt: '',
        cmsnAmt: '',
        cmsnExclAmt: ''
      }
      if (this.form.invoiceList && this.form.invoiceList.length > 0) {
        for (const key in totalRow) {
          totalRow[key] = this.form.invoiceList.reduce((sum, row) => {
            if (Object.prototype.hasOwnProperty.call(row, key) && !isNaN(row[key])) {
              return sum + row[key]
            } else {
              return sum
            }
          }, 0)
        }
      }
      return totalRow
    }
  },
  async mounted () {
    // 정산이력여부
    this.historyYn = this.data.historyYn
    if (this.data) {
      this.param.calcInd = this.data.calcInd
      this.param.calcSeq = this.data.calcSeq
      this.param.calcNo = this.data.calcNo
    }
    // invoice 조회
    calculateService.selectInvoiceList(this.param).then(res => {
      if (res.data) {
        if (_.some(res.data.invoiceInfo)) {
          // 인보이스 상세 정보
          this.form = res.data.invoiceInfo
        }
        // 법인명 값 없을경우 기본값
        if (!_.some(this.form.corpNm)) {
          this.form.corpNm = '소노호텔앤리조트'
        }
        // 주소 값 없을경우 기본값
        if (!_.some(this.form.addr)) {
          this.form.addr = '서울시 송파구 법원로 135 대명타워 13층'
        }
        // 인보이스 정산 목록
        this.form.invoiceList = res.data.invoiceList
        // 추가정산 목록
        if (res.data.addInvoiceList) {
          this.addInvoiceList = res.data.addInvoiceList
          this.addInvoiceList.forEach(item => {
            this.addInvoiceAmtSum += item.useAmt
          })
        }
        this.setCalculateInfo()
      }
    })
  },
  methods: {
    // 추가정산 추가
    addInvoiceCalc () {
      const addInvoice = { calcSeq: this.data.calcSeq, ticketNo: '', ticketSeq: '', useQty: 0, useAmt: 0, itemStat: '', memo: '', checkTicketNo: true }
      this.addInvoiceList.push(addInvoice)
    },
    // 추가정산 목록 삭제
    removeAddInvoiceList (data) {
      this.$dialog.confirm('선택한 정산을 삭제하시겠습니까?').then(() => {
        calculateService.deleteAddInvoiceCalc(data).then(() => {
          this.addInvoiceList.splice(this.addInvoiceList.indexOf(data), 1)
        })
      }).catch(() => {})
    },
    // 우대번호 , 순번 확인
    checkTicket (item) {
      calculateService.checkTicketStatus(item).then(res => {
        if (res.data) {
          item.useQty = res.data.useQty // 사용수량
          item.useAmt = res.data.useAmt // 금액
          item.itemStat = res.data.itemStat // 상태값
          item.memo = res.data.memo // 메모
          item.checkTicketNo = false // disabled 여부
        }
        return item
      })
    },
    // 추가정산 저장
    saveInvoiceCalc () {
      this.validForm(this.$refs.form).then(() => {
        this.$dialog.confirm('추가정산을 저장하시겠습니까?').then(() => {
          calculateService.saveAddInvoiceCalc(this.addInvoiceList).then(() => {
            this.$dialog.alert('저장 되었습니다.').then(() => {
              this.addInvoiceAmtSum = 0
              this.addInvoiceList.forEach(item => {
                this.addInvoiceAmtSum += item.useAmt
              })
            })
          })
        }).catch(() => {})
      })
    },
    // 이용수량 상세 정보
    detailInfo (item) {
      if (item.ticketNo) {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Social/Calculate/TicketNoSeqSearch',
          params: {
            lcalCd: item.lcalCd,
            calcSeq: item.calcSeq,
            ticketNo: item.ticketNo
          },
          options: {
            fullscreen: false,
            retainFocus: false,
            persistent: true,
            scrollable: true,
            width: 1200
            // closeCallback: (params) => {
            //   if (params && params.data) {
            //   }
            // }
          }
        })
      }
    },
    // Invoice 정보
    setCalculateInfo () {
      // 세금 계산서 금액 (수수료+미사용 수수료)
      this.form.taxInvoice = this.totalRow.cmsnAmt
      // 입금금액
      this.form.deposit = this.totalRow.cmsnExclAmt
      // 정산기간
      if (this.form.invoiceList.length > 0) {
        this.form.calcYmd = this.form.invoiceList[0].calcYmd
        this.form.calcNo = this.form.invoiceList[0].calcNo
      }
    },
    // Invoice 정보 수정
    saveInvoiceInfo () {
      calculateService.saveInvoiceInfo(this.form).then(res => {
      })
    },
    // 인보이스 인쇄
    print () {
      // Get HTML to print from element
      const prtHtml = document.getElementById('printMe').innerHTML

      // Get all stylesheets HTML
      let stylesHtml = ''
      for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
        stylesHtml += node.outerHTML
      }

      // Open the print window
      const WinPrint = window.open('', '', 'left=0,top=0,width=2000,height=1200,toolbar=0,scrollbars=0,status=0')

      WinPrint.document.write(`<!DOCTYPE html>
      <html>
        <head>
          <style>html, body {min-width: 100%; min-height: 100%;}</style>
          ${stylesHtml}
        </head>
        <body>
          ${prtHtml}
        </body>
      </html>`)

      WinPrint.document.close()
      WinPrint.focus()
      WinPrint.print()
      WinPrint.onafterprint = () => {
        WinPrint.close()
      }
    }
  }
}
</script>

<style scoped lang="scss">
  $border-red: 1px solid #F44336!important;

  .bordered table {
    thead tr {
      th {
        &.bg-yellow {
          background-color: #FFEB3B;
        }

        &.bd-red {
          border-top: $border-red;
          border-left: $border-red;
          border-right: $border-red;
        }
      }
    }

    tbody tr {
      &.sum-row {
        td {
          font-weight: bold;
          background-color: #FFE0B2;
          &.bd-red {
            border-bottom: $border-red;
            border-left: $border-red;
            border-right: $border-red;
          }
        }
      }
      td.bd-red {
        border-left: $border-red;
        border-right: $border-red;
      }
    }
  }
  h1.headline-text {
    font-size: 44px;
  }
  .border-right {
    border-right: 2px solid black;
  }
  .border-top {
    border-top: 2px solid black;
  }
  .border-bottom {
    border-bottom: 2px solid black;
  }

  .invoiceTop {
    padding: 5px 5px;
  }

  .invoiceBottom {
    padding: 5px 5px;
    font-weight: bold;
  }

  .invoiceTitle {
    font-weight: bold;
  }

  .invoiceContent {
    padding-left: 15px;
  }

  .ceoClass{
    color: #795548;
    font-weight: 900 !important;
  }

  div.print-table table {
    td, th {
      white-space: normal !important;
      font-size: 9px !important;
    }
  }
</style>
