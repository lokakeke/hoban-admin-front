<template>
  <v-card-text>
    <v-form ref="form" lazy-validation>
      <v-container fluid>
        <v-row>
          <v-col class="text-right pt-0 pb-0">
            <v-btn outlined rounded color="info" @click="print">
              <v-icon left>local_printshop</v-icon>인쇄
            </v-btn>
          </v-col>
        </v-row>
        <v-row wrap>
          <v-col sm="12">
            <!--<v-row class="pt-5">
              <v-col cols="1" class="font-weight-bold black&#45;&#45;text pb-0">
                ※ 판매 대행사 :
              </v-col>
              <v-col cols="3" class="black&#45;&#45;text pb-0">
              </v-col>
            </v-row>-->
            <v-row>
              <v-col cols="1" class="font-weight-bold black--text pb-0">
                사용기간 :
              </v-col>
              <v-col cols="3" class="black--text pb-0">
                <span v-if="calcYmd">{{calcYmd}}</span>
              </v-col>
            </v-row>
            <v-row class="pb-5">
              <v-col cols="1" class="font-weight-bold black--text">
                대행사 수수료 :
              </v-col>
              <v-col cols="3" class="black--text">
                {{cmsnRate}} %
              </v-col>
            </v-row>
            <!-- List 1-->
            <v-row>
              <v-col cols="12" class="font-weight-bold black--text pb-0">
                ▣ 판매대행사 판매 매출
              </v-col>
            </v-row>
            <v-col cols="12" class="mb-1">
              <v-simple-table dense class="bordered text-center" v-dragscroll="{target: '.v-data-table__wrapper'}">
                <thead>
                <tr>
                  <th class="text-center">채널</th>
                  <th class="text-center">우대번호</th>
                  <th class="text-center">상품</th>
                  <th class="text-center">판매가</th>
                  <th class="text-center">판매수량</th>
                  <th class="text-center">판매매출</th>
                  <th class="text-center">1차 정산[0%]</th>
                  <th class="text-center">수수료</th>
                  <th class="text-center">실입금액</th>
                  <th class="text-center">비고</th>
                </tr>
                </thead>
                <tbody v-if="list && list.length > 0">
                <tr v-for="(item, index) of list" :key="index">
                  <td>{{item.saleChnnlNm}}</td>
                  <td>{{item.ticketNo}}</td>
                  <td>{{item.itemNm}}</td>
                  <td>{{item.sellAmt1 | price}}</td>
                  <td>{{item.sellQty1 | price}}</td>
                  <td>{{item.saleAmt1 | price}}</td>
                  <td>{{item.calculate1 | price}}</td>
                  <td>{{item.cmsnExclAmt1 | price}} <span v-if="item.cmsnExclAmt1 > 0">({{item.cmsnRate1}}%)</span></td>
                  <td>{{item.totCmsnAmt1 | price}}</td>
                  <td>{{item.etc1}}</td>
                </tr>
                <tr class="sum-row">
                  <td colspan="4" >합 계</td>
                  <td>{{totalRow.sellQty1 | price}}</td>
                  <td>{{totalRow.saleAmt1 | price}}</td>
                  <td>{{totalRow.calculate1 | price}}</td>
                  <td>{{totalRow.cmsnExclAmt1 | price}}</td>
                  <td>{{totalRow.totCmsnAmt1 | price}}</td>
                  <td></td>
                </tr>
                </tbody>
                <tbody v-else>
                <tr>
                  <td colspan="13" class="text-center">정산내역이 없습니다.</td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-col>

            <!-- List 2 -->
            <v-row>
              <v-col cols="12" class="font-weight-bold black--text pb-0">
                ▣ DGNS 이용 매출(정산기준)
              </v-col>
            </v-row>
            <v-col cols="12" class="mb-1">
              <v-simple-table dense class="bordered text-center" v-dragscroll="{target: '.v-data-table__wrapper'}">
                <thead>
                <tr>
                  <th class="text-center">채널</th>
                  <th class="text-center">우대번호</th>
                  <th class="text-center">상품</th>
                  <th class="text-center">판매가</th>
                  <th class="text-center">이용수량</th>
                  <th class="text-center">이용매출</th>
                  <th class="text-center">최종 정산[100%]</th>
                  <th class="text-center">수수료</th>
                  <th class="text-center">실입금액</th>
                  <th class="text-center">비고</th>
                </tr>
                </thead>
                <tbody v-if="list && list.length > 0">
                <tr v-for="(item, index) of list" :key="index">
                  <td>{{item.saleChnnlNm}}</td>
                  <td>{{item.ticketNo}}</td>
                  <td>{{item.itemNm}}</td>
                  <td>{{item.sellAmt2 | price}}</td>
                  <td>{{item.useQty2 | price}}</td>
                  <td>{{item.useAmt2 | price}}</td>
                  <td>{{item.calculate2 | price}}</td>
                  <td>{{item.cmsnExclAmt2 | price}} <span v-if="item.cmsnExclAmt2 > 0">({{item.cmsnRate2}}%)</span></td>
                  <td>{{item.totCmsnAmt2 | price}}</td>
                  <td>{{item.etc2}}</td>
                </tr>
                <tr class="sum-row">
                  <td colspan="4">합 계</td>
                  <td>{{totalRow.useQty2 | price}}</td>
                  <td class="red--text">{{totalRow.useAmt2 | price}}</td>
                  <td>{{totalRow.calculate2 | price}}</td>
                  <td>{{totalRow.cmsnExclAmt2 | price}}</td>
                  <td class="red--text">{{totalRow.totCmsnAmt2 | price}}</td>
                  <td></td>
                </tr>
                </tbody>
                <tbody v-else>
                <tr>
                  <td colspan="13" class="text-center">정산내역이 없습니다.</td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-col>

            <!-- List 3 -->
            <v-row>
              <v-col cols="12" class="font-weight-bold black--text pb-0">
                ▣ 판매 후 미사용 30% 매출 ( 총판매 수량 - DGNS이용 수량)
              </v-col>
            </v-row>
            <v-col cols="12" class="mb-1">
              <v-simple-table dense class="bordered text-center" v-dragscroll="{target: '.v-data-table__wrapper'}">
                <thead>
                <tr>
                  <th class="text-center">채널</th>
                  <th class="text-center">우대번호</th>
                  <th class="text-center">상품</th>
                  <th class="text-center">판매가</th>
                  <th class="text-center">수량</th>
                  <th class="text-center">총 매출</th>
                  <th class="text-center">수수료</th>
                  <th class="text-center">환불(고객)</th>
                  <th class="text-center">입금</th>
                  <th class="text-center">실입금</th>
                </tr>
                </thead>
                <tbody v-if="list && list.length > 0">
                <tr v-for="(item, index) of list" :key="index">
                  <td>{{item.saleChnnlNm}}</td>
                  <td>{{item.ticketNo}}</td>
                  <td>{{item.itemNm}}</td>
                  <td>{{item.sellAmt3 | price}}</td>
                  <td>{{item.sellQty3 | price}}</td>
                  <td>{{item.saleAmt3 | price}}</td>
                  <td>{{item.cmsnExclAmt3 | price}} <span v-if="item.cmsnExclAmt3 > 0">({{item.cmsnRate3}}%)</span></td>
                  <td>{{item.refundAmt3 | price}} <span v-if="item.refundAmt3 > 0">({{item.refundRate3}}%)</span></td>
                  <td>{{item.depositAmt3 | price}} <span v-if="item.depositAmt3 > 0">({{item.bkpmsRate3}}%)</span></td>
                  <td>{{item.totCmsnAmt3 | price}}</td>
                </tr>
                <tr class="sum-row">
                  <td colspan="4">합 계</td>
                  <td>{{totalRow.sellQty3 | price}}</td>
                  <td>{{totalRow.saleAmt3 | price}}</td>
                  <td>{{totalRow.cmsnExclAmt3 | price}}</td>
                  <td>{{totalRow.refundAmt3 | price}}</td>
                  <td class="red--text">{{totalRow.depositAmt3 | price}}</td>
                  <td class="red--text">{{totalRow.totCmsnAmt3 | price}}</td>
                </tr>
                </tbody>
                <tbody v-else>
                <tr>
                  <td colspan="13" class="text-center">정산내역이 없습니다.</td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-col>
          </v-col>
        </v-row>

        <v-row wrap id="printMe" v-show="false">
          <v-col sm="12">
            <!--<v-row class="pt-5">
              <v-col cols="2" class="font-weight-bold black&#45;&#45;text pb-0">
                ※ 판매 대행사 :
              </v-col>
              <v-col cols="3" class="black&#45;&#45;text pb-0">
              </v-col>
            </v-row>-->
            <v-row>
              <v-col cols="2" class="font-weight-bold black--text pb-0">
                사용기간 :
              </v-col>
              <v-col cols="3" class="black--text pb-0">
                <span v-if="calcYmd">{{calcYmd}}</span>
              </v-col>
            </v-row>
            <v-row class="pb-5">
              <v-col cols="2" class="font-weight-bold black--text">
                대행사 수수료 :
              </v-col>
              <v-col cols="3" class="black--text">
                {{cmsnRate}} %
              </v-col>
            </v-row>
            <!-- List 1-->
            <v-row>
              <v-col cols="12" class="font-weight-bold black--text pb-0">
                ▣ 판매대행사 판매 매출
              </v-col>
            </v-row>
            <v-col cols="12" class="mb-1">
              <v-simple-table dense class="bordered text-center print-table" v-dragscroll="{target: '.v-data-table__wrapper'}">
                <thead>
                <tr>
                  <th class="text-center">채널</th>
                  <th class="text-center">우대번호</th>
                  <th class="text-center">상품</th>
                  <th class="text-center">판매가</th>
                  <th class="text-center">판매수량</th>
                  <th class="text-center">판매매출</th>
                  <th class="text-center">1차 정산[0%]</th>
                  <th class="text-center">수수료</th>
                  <th class="text-center">실입금액</th>
                  <th class="text-center">비고</th>
                </tr>
                </thead>
                <tbody v-if="list && list.length > 0">
                <tr v-for="(item, index) of list" :key="index">
                  <td>{{item.saleChnnlNm}}</td>
                  <td>{{item.ticketNo}}</td>
                  <td>{{item.itemNm}}</td>
                  <td>{{item.sellAmt1 | price}}</td>
                  <td>{{item.sellQty1 | price}}</td>
                  <td>{{item.saleAmt1 | price}}</td>
                  <td>{{item.calculate1 | price}}</td>
                  <td>{{item.cmsnExclAmt1 | price}} <span v-if="item.cmsnExclAmt1 > 0">({{item.cmsnRate1}}%)</span></td>
                  <td>{{item.totCmsnAmt1 | price}}</td>
                  <td>{{item.etc1}}</td>
                </tr>
                <tr class="sum-row">
                  <td colspan="4" >합 계</td>
                  <td>{{totalRow.sellQty1 | price}}</td>
                  <td>{{totalRow.saleAmt1 | price}}</td>
                  <td>{{totalRow.calculate1 | price}}</td>
                  <td>{{totalRow.cmsnExclAmt1 | price}}</td>
                  <td>{{totalRow.totCmsnAmt1 | price}}</td>
                  <td></td>
                </tr>
                </tbody>
                <tbody v-else>
                <tr>
                  <td colspan="13" class="text-center">정산내역이 없습니다.</td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-col>

            <!-- List 2 -->
            <v-row>
              <v-col cols="12" class="font-weight-bold black--text pb-0">
                ▣ DGNS 이용 매출(정산기준)
              </v-col>
            </v-row>
            <v-col cols="12" class="mb-1">
              <v-simple-table dense class="bordered text-center print-table" v-dragscroll="{target: '.v-data-table__wrapper'}">
                <thead>
                <tr>
                  <th class="text-center">채널</th>
                  <th class="text-center">우대번호</th>
                  <th class="text-center">상품</th>
                  <th class="text-center">판매가</th>
                  <th class="text-center">이용수량</th>
                  <th class="text-center">이용매출</th>
                  <th class="text-center">최종 정산[100%]</th>
                  <th class="text-center">수수료</th>
                  <th class="text-center">실입금액</th>
                  <th class="text-center">비고</th>
                </tr>
                </thead>
                <tbody v-if="list && list.length > 0">
                <tr v-for="(item, index) of list" :key="index">
                  <td>{{item.saleChnnlNm}}</td>
                  <td>{{item.ticketNo}}</td>
                  <td>{{item.itemNm}}</td>
                  <td>{{item.sellAmt2 | price}}</td>
                  <td>{{item.useQty2 | price}}</td>
                  <td>{{item.useAmt2 | price}}</td>
                  <td>{{item.calculate2 | price}}</td>
                  <td>{{item.cmsnExclAmt2 | price}} <span v-if="item.cmsnExclAmt2 > 0">({{item.cmsnRate2}}%)</span></td>
                  <td>{{item.totCmsnAmt2 | price}}</td>
                  <td>{{item.etc2}}</td>
                </tr>
                <tr class="sum-row">
                  <td colspan="4">합 계</td>
                  <td>{{totalRow.useQty2 | price}}</td>
                  <td class="red--text">{{totalRow.useAmt2 | price}}</td>
                  <td>{{totalRow.calculate2 | price}}</td>
                  <td>{{totalRow.cmsnExclAmt2 | price}}</td>
                  <td class="red--text">{{totalRow.totCmsnAmt2 | price}}</td>
                  <td></td>
                </tr>
                </tbody>
                <tbody v-else>
                <tr>
                  <td colspan="13" class="text-center">정산내역이 없습니다.</td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-col>

            <!-- List 3 -->
            <v-row>
              <v-col cols="12" class="font-weight-bold black--text pb-0">
                ▣ 판매 후 미사용 30% 매출 ( 총판매 수량 - DGNS이용 수량)
              </v-col>
            </v-row>
            <v-col cols="12" class="mb-1">
              <v-simple-table dense class="bordered text-center print-table" v-dragscroll="{target: '.v-data-table__wrapper'}">
                <thead>
                <tr>
                  <th class="text-center">채널</th>
                  <th class="text-center">우대번호</th>
                  <th class="text-center">상품</th>
                  <th class="text-center">판매가</th>
                  <th class="text-center">수량</th>
                  <th class="text-center">총 매출</th>
                  <th class="text-center">수수료</th>
                  <th class="text-center">환불(고객)</th>
                  <th class="text-center">입금</th>
                  <th class="text-center">실입금</th>
                </tr>
                </thead>
                <tbody v-if="list && list.length > 0">
                <tr v-for="(item, index) of list" :key="index">
                  <td>{{item.saleChnnlNm}}</td>
                  <td>{{item.ticketNo}}</td>
                  <td>{{item.itemNm}}</td>
                  <td>{{item.sellAmt3 | price}}</td>
                  <td>{{item.sellQty3 | price}}</td>
                  <td>{{item.saleAmt3 | price}}</td>
                  <td>{{item.cmsnExclAmt3 | price}} <span v-if="item.cmsnExclAmt3 > 0">({{item.cmsnRate3}}%)</span></td>
                  <td>{{item.refundAmt3 | price}} <span v-if="item.refundAmt3 > 0">({{item.refundRate3}}%)</span></td>
                  <td>{{item.depositAmt3 | price}} <span v-if="item.depositAmt3 > 0">({{item.bkpmsRate3}}%)</span></td>
                  <td>{{item.totCmsnAmt3 | price}}</td>
                </tr>
                <tr class="sum-row">
                  <td colspan="4">합 계</td>
                  <td>{{totalRow.sellQty3 | price}}</td>
                  <td>{{totalRow.saleAmt3 | price}}</td>
                  <td>{{totalRow.cmsnExclAmt3 | price}}</td>
                  <td>{{totalRow.refundAmt3 | price}}</td>
                  <td class="red--text">{{totalRow.depositAmt3 | price}}</td>
                  <td class="red--text">{{totalRow.totCmsnAmt3 | price}}</td>
                </tr>
                </tbody>
                <tbody v-else>
                <tr>
                  <td colspan="13" class="text-center">정산내역이 없습니다.</td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-col>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card-text>
</template>

<script>

import calculateService from 'Api/modules/social/calculate.service'

export default {
  name: 'TicketBlackacre',
  props: { data: Object, close: Function },
  data: function () {
    return {
      param: {
        calcInd: '',
        calcSeq: '',
        calcNo: ''
      },
      calcYmd: '', // 정산 기간
      cmsnRate: 0, // 대행사 수수료
      list: []
    }
  },
  computed: {
    totalRow () {
      const totalRow = {
        sellQty1: '',
        saleAmt1: '',
        calculate1: '',
        cmsnExclAmt1: '',
        totCmsnAmt1: '',
        useQty2: '',
        useAmt2: '',
        calculate2: '',
        cmsnExclAmt2: '',
        totCmsnAmt2: '',
        sellQty3: '',
        saleAmt3: '',
        cmsnExclAmt3: '',
        refundAmt3: '',
        depositAmt3: '',
        totCmsnAmt3: ''
      }
      if (this.list && this.list.length > 0) {
        for (const key in totalRow) {
          totalRow[key] = this.list.reduce((sum, row) => {
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
  mounted () {
    if (this.data) {
      this.param.calcInd = this.data.calcInd
      this.param.calcSeq = this.data.calcSeq
      this.param.calcNo = this.data.calcNo
    }
    this.search()
  },
  methods: {
    // 목록 조회
    search () {
      calculateService.selectTicketBlackacreList(this.param).then(res => {
        if (res.data) {
          this.list = res.data
          if (this.list.length > 0) {
            this.calcYmd = this.list[0].calcYmd
            this.cmsnRate = this.list[0].cmsnRate1
          }
        }
      })
    },
    // 인쇄
    print () {
      // Get HTML to print from element
      const prtHtml = document.getElementById('printMe').innerHTML

      // Get all stylesheets HTML
      let stylesHtml = ''
      for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
        stylesHtml += node.outerHTML
      }

      // Open the print window
      const WinPrint = window.open('', '', 'left=0,top=0,width=1200,height=900,toolbar=0,scrollbars=0,status=0')

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
  div.print-table table {
    td, th {
      white-space: normal !important;
      font-size: 9px !important;
    }
  }
</style>
