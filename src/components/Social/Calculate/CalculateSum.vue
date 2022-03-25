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
        <v-row>
          <v-col sm="6">
            <!-- List 1-->
            <v-row class="sumTitle">
              <v-col cols="12" class="font-weight-bold black--text pb-0">
                ▣ 입금 금액(판매대행사 수수료 차감)
              </v-col>
            </v-row>
            <v-col cols="12" class="sumBody mb-1">
              <v-simple-table dense class="bordered text-center" v-dragscroll="{target: '.v-data-table__wrapper'}">
                <thead>
                <tr>
                  <th class="text-center">입금일</th>
                  <th class="text-center">지급율</th>
                  <th class="text-center">금액</th>
                </tr>
                </thead>
                <!--<tbody v-if="list && list.length > 0">
                <tr v-for="(item, index) of list" :key="index">
                  <td>{{item.month}}</td>
                  <td>{{item.per}}</td>
                  <td>{{item.amt | price}}</td>
                </tr>
                <tr class="sum-row">
                  <td>계</td>
                  <td></td>
                  <td>{{list1Sum | price}}</td>
                </tr>
                </tbody>-->
                <tbody v-if="form">
                <tr>
                  <td></td>
                  <td></td>
                  <td>{{(form.totCmsnSum + addInvoiceAmtSum) | price}}</td>
                </tr>
                <tr class="sum-row">
                  <td>계</td>
                  <td></td>
                  <td>{{(form.totCmsnSum + addInvoiceAmtSum) | price}}</td>
                </tr>
                </tbody>
                <tbody v-else>
                <tr>
                  <td colspan="3" class="text-center">정산내역이 없습니다.</td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-col>

            <!-- List 2-->
            <v-row class="sumTitle">
              <v-col cols="12" class="font-weight-bold black--text pb-0">
                ▣ 판매대행사 수수료
              </v-col>
            </v-row>
            <v-col cols="12" class="sumBody mb-1">
              <v-simple-table dense class="bordered text-center" v-dragscroll="{target: '.v-data-table__wrapper'}">
                <thead>
                <tr>
                  <th class="text-center">세금계산서 발행일</th>
                  <th class="text-center">수수료</th>
                  <th class="text-center">금액</th>
                </tr>
                </thead>
                <!--<tbody v-if="list2 && list2.length > 0">
                <tr v-for="(item, index) of list2" :key="index">
                  <td>{{item.month}}</td>
                  <td>{{item.per}}</td>
                  <td>{{item.amt | price}}</td>
                </tr>
                <tr class="sum-row">
                  <td>계</td>
                  <td></td>
                  <td>{{list2Sum | price}}</td>
                </tr>
                </tbody>-->
                <tbody v-if="form">
                <tr>
                  <td></td>
                  <td></td>
                  <td>{{form.cmsnExclSum | price}}</td>
                </tr>
                <tr class="sum-row">
                  <td>계</td>
                  <td></td>
                  <td>{{form.cmsnExclSum | price}}</td>
                </tr>
                </tbody>
                <tbody v-else>
                <tr>
                  <td colspan="3" class="text-center">정산내역이 없습니다.</td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-col>

            <!-- List 3-->
            <v-row class="sumTitle">
              <v-col cols="12" class="font-weight-bold black--text pb-0">
                ▣ 후불 (DGNS매출 + 미사용 30%)
              </v-col>
            </v-row>
            <v-col cols="12" class="sumBody mb-1">
              <v-simple-table dense class="bordered text-center" v-dragscroll="{target: '.v-data-table__wrapper'}">
                <thead>
                <tr>
                  <th class="text-center">내용</th>
                  <th class="text-center">금액</th>
                </tr>
                </thead>
                <!--<tbody v-if="list3 && list3.length > 0">
                <tr v-for="(item, index) of list3" :key="index">
                  <td>{{item.content}}</td>
                  <td>{{item.amt | price}}</td>
                </tr>
                <tr class="sum-row">
                  <td>계</td>
                  <td>{{list3Sum | price}}</td>
                </tr>
                </tbody>-->
                <tbody v-if="form">
                <tr>
                  <td>DGNS 매출</td>
                  <td>{{form.useSum | price}}</td>
                </tr>
                <tr>
                  <td>미사용 30%</td>
                  <td>{{form.depositSum | price}}</td>
                </tr>
                <tr class="sum-row">
                  <td>계</td>
                  <td>{{form.useSum + form.depositSum | price}}</td>
                </tr>
                </tbody>
                <tbody v-else>
                <tr>
                  <td colspan="3" class="text-center">정산내역이 없습니다.</td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-col>
          </v-col>
          <v-col sm="6" v-if="addInvoiceList && addInvoiceList.length > 0">
            <v-row class="sumTitle">
              <v-col cols="12" class="font-weight-bold black--text pb-0">
                ▣ 추가정산
              </v-col>
            </v-row>
            <v-col cols="12" class="sumBody mb-1">
              <v-simple-table dense class="bordered text-center" v-dragscroll="{target: '.v-data-table__wrapper'}">
                <thead>
                <tr>
                  <th class="text-center">우대번호</th>
                  <th class="text-center">순번</th>
                  <th class="text-center">사용수량</th>
                  <th class="text-center">금액</th>
                  <th class="text-center">상태</th>
                  <th class="text-center">메모</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) of addInvoiceList" :key="index+item.ticketSeq">
                  <td>{{item.ticketNo}}</td>
                  <td>{{item.ticketSeq}}</td>
                  <td>{{item.useQty}}</td>
                  <td>{{item.useAmt | price}}</td>
                  <td><span v-if="item.itemStat === 'Z'">발권가능</span>
                    <span v-else-if="item.itemStat === 'Y'">사용가능</span>
                    <span v-else-if="item.itemStat === 'R'">환불</span>
                    <span v-else>사용불가능</span>({{item.itemStat}})
                  </td>
                  <td>{{item.memo}}</td>
                </tr>
                <tr>
                  <td class="text-right font-weight-bold">정산 원금</td>
                  <td>{{form.totCmsnSum | price}}</td>
                  <td class="font-weight-bold">추가정산 합계</td>
                  <td>{{addInvoiceAmtSum | price}}</td>
                  <td class="font-weight-bold">정산원금 + 추가정산 합계</td>
                  <td>{{(form.totCmsnSum + addInvoiceAmtSum) | price}}</td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-col>
          </v-col>
        </v-row>
        <!-- 인쇄용 -->
        <span id="printMe" v-show="false">
          <v-row class="print-table">
            <v-col sm="6">
              <!-- List 1-->
              <v-row class="sumTitle">
                <v-col cols="12" class="font-weight-bold black--text pb-0">
                  ▣ 입금 금액(판매대행사 수수료 차감)
                </v-col>
              </v-row>
              <v-col cols="12" class="sumBody mb-1">
                <v-simple-table dense class="bordered text-center" v-dragscroll="{target: '.v-data-table__wrapper'}">
                  <thead>
                  <tr>
                    <th class="text-center">입금일</th>
                    <th class="text-center">지급율</th>
                    <th class="text-center">금액</th>
                  </tr>
                  </thead>
                  <tbody v-if="form">
                  <tr>
                    <td></td>
                    <td></td>
                    <td>{{(form.totCmsnSum + addInvoiceAmtSum) | price}}</td>
                  </tr>
                  <tr class="sum-row">
                    <td>계</td>
                    <td></td>
                    <td>{{(form.totCmsnSum + addInvoiceAmtSum) | price}}</td>
                  </tr>
                  </tbody>
                  <tbody v-else>
                  <tr>
                    <td colspan="3" class="text-center">정산내역이 없습니다.</td>
                  </tr>
                  </tbody>
                </v-simple-table>
              </v-col>
              <!-- List 2-->
              <v-row class="sumTitle">
                <v-col cols="12" class="font-weight-bold black--text pb-0">
                  ▣ 판매대행사 수수료
                </v-col>
              </v-row>
              <v-col cols="12" class="sumBody mb-1">
                <v-simple-table dense class="bordered text-center" v-dragscroll="{target: '.v-data-table__wrapper'}">
                  <thead>
                  <tr>
                    <th class="text-center">세금계산서 발행일</th>
                    <th class="text-center">수수료</th>
                    <th class="text-center">금액</th>
                  </tr>
                  </thead>
                  <tbody v-if="form">
                  <tr>
                    <td></td>
                    <td></td>
                    <td>{{form.cmsnExclSum | price}}</td>
                  </tr>
                  <tr class="sum-row">
                    <td>계</td>
                    <td></td>
                    <td>{{form.cmsnExclSum | price}}</td>
                  </tr>
                  </tbody>
                  <tbody v-else>
                  <tr>
                    <td colspan="3" class="text-center">정산내역이 없습니다.</td>
                  </tr>
                  </tbody>
                </v-simple-table>
              </v-col>
              <!-- List 3-->
              <v-row class="sumTitle">
                <v-col cols="12" class="font-weight-bold black--text pb-0">
                  ▣ 후불 (DGNS매출 + 미사용 30%)
                </v-col>
              </v-row>
              <v-col cols="12" class="sumBody mb-1">
                <v-simple-table dense class="bordered text-center" v-dragscroll="{target: '.v-data-table__wrapper'}">
                  <thead>
                  <tr>
                    <th class="text-center">내용</th>
                    <th class="text-center">금액</th>
                  </tr>
                  </thead>
                  <tbody v-if="form">
                  <tr>
                    <td>DGNS 매출</td>
                    <td>{{form.useSum | price}}</td>
                  </tr>
                  <tr>
                    <td>미사용 30%</td>
                    <td>{{form.depositSum | price}}</td>
                  </tr>
                  <tr class="sum-row">
                    <td>계</td>
                    <td>{{form.useSum + form.depositSum | price}}</td>
                  </tr>
                  </tbody>
                  <tbody v-else>
                  <tr>
                    <td colspan="3" class="text-center">정산내역이 없습니다.</td>
                  </tr>
                  </tbody>
                </v-simple-table>
              </v-col>
            </v-col>
            <v-col sm="6" v-if="addInvoiceList && addInvoiceList.length > 0">
              <v-row class="sumTitle">
                <v-col cols="12" class="font-weight-bold black--text pb-0">
                  ▣ 추가정산
                </v-col>
              </v-row>
              <v-col cols="12" class="sumBody mb-1">
                <v-simple-table dense class="bordered text-center print-table" v-dragscroll="{target: '.v-data-table__wrapper'}">
                  <thead>
                  <tr>
                    <th class="text-center">우대번호</th>
                    <th class="text-center">순번</th>
                    <th class="text-center">사용수량</th>
                    <th class="text-center">금액</th>
                    <th class="text-center">상태</th>
                    <th class="text-center">메모</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item, index) of addInvoiceList" :key="index+item.ticketSeq">
                    <td>{{item.ticketNo}}</td>
                    <td>{{item.ticketSeq}}</td>
                    <td>{{item.useQty}}</td>
                    <td>{{item.useAmt | price}}</td>
                    <td><span v-if="item.itemStat === 'Z'">발권가능</span>
                      <span v-else-if="item.itemStat === 'Y'">사용가능</span>
                      <span v-else-if="item.itemStat === 'R'">환불</span>
                      <span v-else>사용불가능</span>({{item.itemStat}})
                    </td>
                    <td>{{item.memo}}</td>
                  </tr>
                  <tr>
                    <td class="text-right font-weight-bold">정산 원금</td>
                    <td>{{form.totCmsnSum | price}}</td>
                    <td class="font-weight-bold">추가정산 합계</td>
                    <td>{{addInvoiceAmtSum | price}}</td>
                    <td class="font-weight-bold">정산원금 + 추가정산 합계</td>
                    <td>{{(form.totCmsnSum + addInvoiceAmtSum) | price}}</td>
                  </tr>
                  </tbody>
                </v-simple-table>
              </v-col>
            </v-col>
          </v-row>
        </span>
      </v-container>
    </v-form>
  </v-card-text>
</template>

<script>
import calculateService from "Api/modules/social/calculate.service"

export default {
  name: 'CalculateSum',
  props: { data: Object, close: Function },
  data: function () {
    return {
      param: {
        calcInd: '',
        calcSeq: '',
        calcNo: ''
      },
      form: {
        totCmsnSum: 0,
        cmsnExclSum: 0,
        useSum: 0,
        depositSum: 0
      },
      addInvoiceList: [], // 추가정산
      addInvoiceAmtSum: 0 // 추가정산 합계
    }
  },
  computed: {
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
      calculateService.selectCalculateSumList(this.param).then(res => {
        if (res.data) {
          this.form = res.data
        }
        if (res.data.addInvoiceList) {
          this.addInvoiceList = res.data.addInvoiceList
          this.addInvoiceList.forEach(item => {
            this.addInvoiceAmtSum += item.useAmt
          })
        }
      })
    },
    // 총계 인쇄
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
