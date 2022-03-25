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
            <v-col cols="12" class="mb-1">
              <v-simple-table dense class="bordered text-center" v-dragscroll="{target: '.v-data-table__wrapper'}">
                <thead>
                  <tr>
                    <th class="text-center" colspan="8">판매</th>
                    <th class="text-center" colspan="2">회수<br>(DGNS 발생기준)</th>
                    <th class="text-center" colspan="2">미회수<br>(비발디 낙전)</th>
                    <th class="text-center" colspan="2">미사용30%<br>(비발디 낙전)</th>
                  </tr>
                  <tr>
                    <th class="text-center">구분</th>
                    <th class="text-center">사업장</th>
                    <th class="text-center">옵션명</th>
                    <th class="text-center">우대번호</th>
                    <th class="text-center">사용수량</th>
                    <th class="text-center">매수환산</th>
                    <th class="text-center">단가</th>
                    <th class="text-center">매출</th>
                    <th class="text-center">수량</th>
                    <th class="text-center">매출</th>
                    <th class="text-center">수량</th>
                    <th class="text-center">매출</th>
                    <th class="text-center">수량</th>
                    <th class="text-center">매출</th>
                  </tr>
                </thead>
                <tbody v-if="roomList && roomList.length > 0">
                  <tr v-for="(item, index) of roomList" :key="index">
                    <td>{{item.corpNm}}</td>
                    <td>{{item.lcalCdNm}}</td>
                    <td>{{item.itemNm}}</td>
                    <td>{{item.ticketNo}}</td>
                    <td>{{item.useQty1 | price}}</td>
                    <td>{{item.totQty | price}}</td>
                    <td>{{item.itemAmt | price}}</td>
                    <td>{{item.saleAmt1 | price}}</td>
                    <td>{{item.useQty2 | price}}</td>
                    <td>{{item.saleAmt2 | price}}</td>
                    <td>{{item.useQty3 | price}}</td>
                    <td>{{item.saleAmt3 | price}}</td>
                    <td>{{item.useQty4 | price}}</td>
                    <td>{{item.saleAmt4 | price}}</td>
                  </tr>
                  <tr class="sum-row">
                    <td colspan="4">합 계</td>
                    <td>{{total.roomList.useQty1 | price}}</td>
                    <td>{{total.roomList.totQty | price}}</td>
                    <td>{{total.roomList.itemAmt | price}}</td>
                    <td>{{total.roomList.saleAmt1 | price}}</td>
                    <td>{{total.roomList.useQty2 | price}}</td>
                    <td>{{total.roomList.saleAmt2 | price}}</td>
                    <td>{{total.roomList.useQty3 | price}}</td>
                    <td>{{total.roomList.saleAmt3 | price}}</td>
                    <td>{{total.roomList.useQty4 | price}}</td>
                    <td>{{total.roomList.saleAmt4 | price}}</td>
                  </tr>
                </tbody>
                <tbody v-else>
                <tr>
                  <td colspan="14" class="text-center">정산내역이 없습니다.</td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-col>

            <!-- List 2 -->
            <v-col cols="12" class="mb-1">
              <v-simple-table dense class="bordered text-center sum-table" v-dragscroll="{target: '.v-data-table__wrapper'}">
                <thead>
                <tr>
                  <th class="text-center" colspan="8">판매</th>
                  <th class="text-center" colspan="2">회수<br>(DGNS 발생기준)</th>
                  <th class="text-center" colspan="2">미회수<br>(비발디 낙전)</th>
                  <th class="text-center" colspan="2">미사용30%<br>(비발디 낙전)</th>
                </tr>
                <tr>
                  <th class="text-center">구분</th>
                  <th class="text-center">사업장</th>
                  <th class="text-center">옵션명</th>
                  <th class="text-center">우대번호</th>
                  <th class="text-center">사용수량</th>
                  <th class="text-center">매수환산</th>
                  <th class="text-center">단가</th>
                  <th class="text-center">매출</th>
                  <th class="text-center">수량</th>
                  <th class="text-center">매출</th>
                  <th class="text-center">수량</th>
                  <th class="text-center">매출</th>
                  <th class="text-center">수량</th>
                  <th class="text-center">매출</th>
                </tr>
                </thead>
                <tbody v-if="ticketList && ticketList.length > 0">
                <tr v-for="(item, index) of ticketList" :key="index">
                  <td>{{item.corpNm}}</td>
                  <td>{{item.lcalCdNm}}</td>
                  <td>{{item.itemNm}}</td>
                  <td>{{item.ticketNo}}</td>
                  <td>{{item.useQty1 | price}}</td>
                  <td>{{item.totQty | price}}</td>
                  <td>{{item.itemAmt | price}}</td>
                  <td>{{item.saleAmt1 | price}}</td>
                  <td>{{item.useQty2 | price}}</td>
                  <td>{{item.saleAmt2 | price}}</td>
                  <td>{{item.useQty3 | price}}</td>
                  <td>{{item.saleAmt3 | price}}</td>
                  <td>{{item.useQty4 | price}}</td>
                  <td>{{item.saleAmt4 | price}}</td>
                </tr>
                <tr class="sum-row">
                  <td colspan="4">합 계</td>
                  <td>{{total.ticketList.useQty1 | price}}</td>
                  <td>{{total.ticketList.totQty | price}}</td>
                  <td>{{total.ticketList.itemAmt | price}}</td>
                  <td>{{total.ticketList.saleAmt1 | price}}</td>
                  <td>{{total.ticketList.useQty2 | price}}</td>
                  <td>{{total.ticketList.saleAmt2 | price}}</td>
                  <td>{{total.ticketList.useQty3 | price}}</td>
                  <td>{{total.ticketList.saleAmt3 | price}}</td>
                  <td>{{total.ticketList.useQty4 | price}}</td>
                  <td>{{total.ticketList.saleAmt4 | price}}</td>
                </tr>
                <br/>
                <br/>
                <tr class="sum-row-all" style="background-color: #FFE0B2;">
                  <td colspan="4">합 계</td>
                  <td>{{total.totalList.useQty1 | price}}</td>
                  <td>{{total.totalList.totQty | price}}</td>
                  <td>{{total.totalList.itemAmt | price}}</td>
                  <td>{{total.totalList.saleAmt1 | price}}</td>
                  <td>{{total.totalList.useQty2 | price}}</td>
                  <td>{{total.totalList.saleAmt2 | price}}</td>
                  <td>{{total.totalList.useQty3 | price}}</td>
                  <td>{{total.totalList.saleAmt3 | price}}</td>
                  <td>{{total.totalList.useQty4 | price}}</td>
                  <td>{{total.totalList.saleAmt4 | price}}</td>
                </tr>
                </tbody>
                <tbody v-else>
                <tr>
                  <td colspan="14" class="text-center">정산내역이 없습니다.</td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-col>
          </v-col>
        </v-row>
        <!--인쇄용-->
        <v-row wrap id="printMe" v-show="false">
          <v-col sm="12">
            <v-col cols="12" class="mb-1">
              <v-simple-table dense class="bordered text-center print-table" v-dragscroll="{target: '.v-data-table__wrapper'}">
                <thead>
                <tr>
                  <th class="text-center" colspan="8">판매</th>
                  <th class="text-center" colspan="2">회수<br>(DGNS 발생기준)</th>
                  <th class="text-center" colspan="2">미회수<br>(비발디 낙전)</th>
                  <th class="text-center" colspan="2">미사용30%<br>(비발디 낙전)</th>
                </tr>
                <tr>
                  <th class="text-center">구분</th>
                  <th class="text-center">사업장</th>
                  <th class="text-center">옵션명</th>
                  <th class="text-center">우대번호</th>
                  <th class="text-center">사용수량</th>
                  <th class="text-center">매수환산</th>
                  <th class="text-center">단가</th>
                  <th class="text-center">매출</th>
                  <th class="text-center">수량</th>
                  <th class="text-center">매출</th>
                  <th class="text-center">수량</th>
                  <th class="text-center">매출</th>
                  <th class="text-center">수량</th>
                  <th class="text-center">매출</th>
                </tr>
                </thead>
                <tbody v-if="roomList && roomList.length > 0">
                <tr v-for="(item, index) of roomList" :key="index">
                  <td>{{item.corpNm}}</td>
                  <td>{{item.lcalCdNm}}</td>
                  <td>{{item.itemNm}}</td>
                  <td>{{item.ticketNo}}</td>
                  <td>{{item.useQty1 | price}}</td>
                  <td>{{item.totQty | price}}</td>
                  <td>{{item.itemAmt | price}}</td>
                  <td>{{item.saleAmt1 | price}}</td>
                  <td>{{item.useQty2 | price}}</td>
                  <td>{{item.saleAmt2 | price}}</td>
                  <td>{{item.useQty3 | price}}</td>
                  <td>{{item.saleAmt3 | price}}</td>
                  <td>{{item.useQty4 | price}}</td>
                  <td>{{item.saleAmt4 | price}}</td>
                </tr>
                <tr class="sum-row">
                  <td colspan="4">합 계</td>
                  <td>{{total.roomList.useQty1 | price}}</td>
                  <td>{{total.roomList.totQty | price}}</td>
                  <td>{{total.roomList.itemAmt | price}}</td>
                  <td>{{total.roomList.saleAmt1 | price}}</td>
                  <td>{{total.roomList.useQty2 | price}}</td>
                  <td>{{total.roomList.saleAmt2 | price}}</td>
                  <td>{{total.roomList.useQty3 | price}}</td>
                  <td>{{total.roomList.saleAmt3 | price}}</td>
                  <td>{{total.roomList.useQty4 | price}}</td>
                  <td>{{total.roomList.saleAmt4 | price}}</td>
                </tr>
                </tbody>
                <tbody v-else>
                <tr>
                  <td colspan="14" class="text-center">정산내역이 없습니다.</td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-col>

            <!-- List 2 -->
            <v-col cols="12" class="mb-1">
              <v-simple-table dense class="bordered text-center sum-table print-table" v-dragscroll="{target: '.v-data-table__wrapper'}">
                <thead>
                <tr>
                  <th class="text-center" colspan="8">판매</th>
                  <th class="text-center" colspan="2">회수<br>(DGNS 발생기준)</th>
                  <th class="text-center" colspan="2">미회수<br>(비발디 낙전)</th>
                  <th class="text-center" colspan="2">미사용30%<br>(비발디 낙전)</th>
                </tr>
                <tr>
                  <th class="text-center">구분</th>
                  <th class="text-center">사업장</th>
                  <th class="text-center">옵션명</th>
                  <th class="text-center">우대번호</th>
                  <th class="text-center">사용수량</th>
                  <th class="text-center">매수환산</th>
                  <th class="text-center">단가</th>
                  <th class="text-center">매출</th>
                  <th class="text-center">수량</th>
                  <th class="text-center">매출</th>
                  <th class="text-center">수량</th>
                  <th class="text-center">매출</th>
                  <th class="text-center">수량</th>
                  <th class="text-center">매출</th>
                </tr>
                </thead>
                <tbody v-if="ticketList && ticketList.length > 0">
                <tr v-for="(item, index) of ticketList" :key="index">
                  <td>{{item.corpNm}}</td>
                  <td>{{item.lcalCdNm}}</td>
                  <td>{{item.itemNm}}</td>
                  <td>{{item.ticketNo}}</td>
                  <td>{{item.useQty1 | price}}</td>
                  <td>{{item.totQty | price}}</td>
                  <td>{{item.itemAmt | price}}</td>
                  <td>{{item.saleAmt1 | price}}</td>
                  <td>{{item.useQty2 | price}}</td>
                  <td>{{item.saleAmt2 | price}}</td>
                  <td>{{item.useQty3 | price}}</td>
                  <td>{{item.saleAmt3 | price}}</td>
                  <td>{{item.useQty4 | price}}</td>
                  <td>{{item.saleAmt4 | price}}</td>
                </tr>
                <tr class="sum-row">
                  <td colspan="4">합 계</td>
                  <td>{{total.ticketList.useQty1 | price}}</td>
                  <td>{{total.ticketList.totQty | price}}</td>
                  <td>{{total.ticketList.itemAmt | price}}</td>
                  <td>{{total.ticketList.saleAmt1 | price}}</td>
                  <td>{{total.ticketList.useQty2 | price}}</td>
                  <td>{{total.ticketList.saleAmt2 | price}}</td>
                  <td>{{total.ticketList.useQty3 | price}}</td>
                  <td>{{total.ticketList.saleAmt3 | price}}</td>
                  <td>{{total.ticketList.useQty4 | price}}</td>
                  <td>{{total.ticketList.saleAmt4 | price}}</td>
                </tr>
                <br/>
                <br/>
                <tr class="sum-row-all" style="background-color: #FFE0B2;">
                  <td colspan="4">합 계</td>
                  <td>{{total.totalList.useQty1 | price}}</td>
                  <td>{{total.totalList.totQty | price}}</td>
                  <td>{{total.totalList.itemAmt | price}}</td>
                  <td>{{total.totalList.saleAmt1 | price}}</td>
                  <td>{{total.totalList.useQty2 | price}}</td>
                  <td>{{total.totalList.saleAmt2 | price}}</td>
                  <td>{{total.totalList.useQty3 | price}}</td>
                  <td>{{total.totalList.saleAmt3 | price}}</td>
                  <td>{{total.totalList.useQty4 | price}}</td>
                  <td>{{total.totalList.saleAmt4 | price}}</td>
                </tr>
                </tbody>
                <tbody v-else>
                <tr>
                  <td colspan="14" class="text-center">정산내역이 없습니다.</td>
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
import calculateService from "Api/modules/social/calculate.service"

export default {
  name: 'RoomDist',
  props: { data: Object, close: Function },
  data: function () {
    return {
      param: {
        calcInd: '',
        calcSeq: '',
        calcNo: ''
      },
      roomList: [], // 객실 목록
      ticketList: [], // 입장권 목록
      totalList: [], // 전체 목록
      total: {}, // 합계
      totalRow: {
        useQty1: '',
        totQty: '',
        itemAmt: '',
        saleAmt1: '',
        totCmsnAmt1: '',
        useQty2: '',
        saleAmt2: '',
        useQty3: '',
        saleAmt3: '',
        useQty4: '',
        saleAmt4: ''
      }
    }
  },
  mounted () {
    if (this.data) {
      this.param.calcInd = this.data.calcInd
      this.param.calcSeq = this.data.calcSeq
      this.param.calcNo = this.data.calcNo
      // 객실 합계
      this.$set(this.total, 'roomList', _.cloneDeep(this.totalRow))
      // 입장권 합계
      this.$set(this.total, 'ticketList', _.cloneDeep(this.totalRow))
      // 전체 합계
      this.$set(this.total, 'totalList', _.cloneDeep(this.totalRow))
    }
    this.search()
  },
  methods: {
    // 목록 조회
    search () {
      calculateService.selectRoomDistList(this.param).then(res => {
        if (res.data) {
          // 전체 list
          this.totalList = res.data
          // 객실 list
          this.roomList = _.filter(res.data, function (item) {
            return _.startsWith(item.ticketNo, '5')
          })
          // 입장권 list
          this.ticketList = _.filter(res.data, function (item) {
            return _.startsWith(item.ticketNo, '4')
          })
          this.setTotalCal()
        }
      })
    },
    // 객실 배분 합계(객실, 입장권 별)
    setTotalCal () {
      // total : { totalList(전체), roomList(객실), ticketList(입장권) }
      Object.keys(this.total).forEach(totalKey => {
        Object.keys(this.total[totalKey]).forEach(item => {
          this.total[totalKey][item] = this[totalKey].reduce((sum, row) => {
            if (Object.prototype.hasOwnProperty.call(row, item) && !isNaN(row[item])) {
              return sum + Number(row[item])
            } else {
              return sum
            }
          }, 0)
        })
      })
    },
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

<style lang="scss">
  .bordered.sum-table tbody tr {
    &.sum-row-all {
      td {
        font-weight: bold;
        background-color: #FFE0B2;
        border: 1px solid !important;
      }
    }
  }

  div.print-table table {
    td, th {
      white-space: normal !important;
      font-size: 9px !important;
    }
  }
</style>
