<template>
  <div>
    <v-row>
      <v-col class="text-right pt-0 pb-0">
        <v-btn outlined rounded color="info" @click="print">
          <v-icon left>local_printshop</v-icon>인쇄
        </v-btn>
      </v-col>
    </v-row>
    <v-tabs v-model="tabList.itemName">
      <v-tab v-for="(t, index) in tabList" :key="index" :href="`#tab-${t.itemName}`" class="ml-12">
        <h5 class="font-weight-bold basil--text">{{index+1}}. {{ t.itemName }}</h5>
      </v-tab>
      <v-tab-item
        v-for="(t, index) in tabList"
        :key="index"
        :value="'tab-' + t.itemName"
      >
        <v-card flat tile>
          <v-card-text>
            <v-form ref="form" lazy-validation>
              <v-container fluid>
                <v-row wrap>
                  <v-col sm="12">
                    <v-row>
                      <v-col cols="12" class="font-weight-bold black--text pb-0">
                        ▣ 판매대행사 판매 매출
                      </v-col>
                    </v-row>
                    <v-col cols="12" class="mb-1">
                      <v-simple-table dense class="bordered text-center" v-dragscroll="{target: '.v-data-table__wrapper'}">
                        <thead>
                        <tr>
                          <th class="text-center">지역명</th>
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
                          <template v-if="item.dstbYn === 'Y' ? t.itemName === item.itemName : t.itemName === item.lcalCodeName">
                          <td>{{item.lcalCodeName}}</td>
                          <td>{{item.saleChnnlName}}</td>
                          <td>{{item.ticketNo}}</td>
                          <td>{{item.itemName}}</td>
                          <td>{{item.sellAmt1 | price}}</td>
                          <td>{{item.sellQty1 | price}}</td>
                          <td>{{item.saleAmt1 | price}}</td>
                          <td>{{item.calculate1 | price}}</td>
                          <td>{{item.cmsnExclAmt1 | price}} <span v-if="item.cmsnExclAmt1 > 0">({{item.cmsnRate1}}%)</span></td>
                          <td>{{item.totCmsnAmt1 | price}}</td>
                          <td>{{item.etc1}}</td>
                          </template>
                        </tr>
                        <tr class="sum-row">
                          <td colspan="4">합 계</td>
                          <td>{{total[t.itemName].sellAmt1 | price}}</td>
                          <td>{{total[t.itemName].sellQty1 | price}}</td>
                          <td>{{total[t.itemName].saleAmt1 | price}}</td>
                          <td>{{total[t.itemName].calculate1 | price}}</td>
                          <td>{{total[t.itemName].cmsnExclAmt1 | price}}</td>
                          <td>{{total[t.itemName].totCmsnAmt1 | price}}</td>
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
                          <th class="text-center">지역명</th>
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
                          <template v-if="item.dstbYn === 'Y' ? t.itemName === item.itemName : t.itemName === item.lcalCodeName">
                          <td>{{item.lcalCodeName}}</td>
                          <td>{{item.saleChnnlName}}</td>
                          <td>{{item.ticketNo}}</td>
                          <td>{{item.itemName}}</td>
                          <td>{{item.sellAmt2 | price}}</td>
                          <td>{{item.useQty2 | price}}</td>
                          <td>{{item.useAmt2 | price}}</td>
                          <td>{{item.calculate2 | price}}</td>
                          <td>{{item.cmsnExclAmt2 | price}} <span v-if="item.cmsnExclAmt2 > 0">({{item.cmsnRate2}}%)</span></td>
                          <td>{{item.totCmsnAmt2 | price}}</td>
                          <td>{{item.etc2}}</td>
                          </template>
                        </tr>
                        <tr class="sum-row">
                          <td colspan="4">합 계</td>
                          <td>{{total[t.itemName].sellAmt2 | price}}</td>
                          <td>{{total[t.itemName].useQty2 | price}}</td>
                          <td class="red--text">{{total[t.itemName].useAmt2 | price}}</td>
                          <td>{{total[t.itemName].calculate2 | price}}</td>
                          <td>{{total[t.itemName].cmsnExclAmt2 | price}}</td>
                          <td class="red--text">{{total[t.itemName].totCmsnAmt2 | price}}</td>
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
                        ▣ 판매 후 미사용 위약
                      </v-col>
                    </v-row>
                    <v-col cols="12" class="mb-1">
                      <v-simple-table dense class="bordered text-center" v-dragscroll="{target: '.v-data-table__wrapper'}">
                        <thead>
                        <tr>
                          <th class="text-center">지역명</th>
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
                          <template v-if="item.dstbYn === 'Y' ? t.itemName === item.itemName : t.itemName === item.lcalCodeName">
                          <td>{{item.lcalCodeName}}</td>
                          <td>{{item.saleChnnlName}}</td>
                          <td>{{item.ticketNo}}</td>
                          <td>{{item.itemName}}</td>
                          <td>{{item.sellAmt3 | price}}</td>
                          <td>{{item.sellQty3 | price}}</td>
                          <td>{{item.saleAmt3 | price}}</td>
                          <td>{{item.cmsnExclAmt3 | price}} <span v-if="item.cmsnExclAmt3 > 0">({{item.cmsnRate3}}%)</span></td>
                          <td>{{item.refundAmt3 | price}} <span v-if="item.refundAmt3 > 0">({{item.refundRate3}}%)</span></td>
                          <td>{{item.depositAmt3 | price}} <span v-if="item.depositAmt3 > 0">({{item.bkpmsRate3}}%)</span></td>
                          <td>{{item.totCmsnAmt3 | price}}</td>
                          </template>
                        </tr>
                        <tr class="sum-row">
                          <td colspan="4">합 계</td>
                          <td>{{total[t.itemName].sellAmt3 | price}}</td>
                          <td>{{total[t.itemName].sellQty3 | price}}</td>
                          <td>{{total[t.itemName].saleAmt3 | price}}</td>
                          <td>{{total[t.itemName].cmsnExclAmt3 | price}}</td>
                          <td>{{total[t.itemName].refundAmt3 | price}}</td>
                          <td class="red--text">{{total[t.itemName].depositAmt3 | price}}</td>
                          <td class="red--text">{{total[t.itemName].totCmsnAmt3 | price}}</td>
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
        </v-card>
      </v-tab-item>
    </v-tabs>

    <!-- 인쇄용 -->
    <v-card flat tile id="printMe" v-show="false">
      <v-card-text>
      <v-container fluid v-for="(t, index) in tabList" :key="index">
        <h5 class="font-weight-bold basil--text">{{index+1}}. {{ t.itemName }}</h5>
        <v-row wrap>
          <v-col sm="12">
            <v-row>
              <v-col cols="12" class="font-weight-bold black--text pb-0">
                ▣ 판매대행사 판매 매출
              </v-col>
            </v-row>
            <v-col cols="12" class="mb-1">
              <v-simple-table dense class="bordered text-center print-table" v-dragscroll="{target: '.v-data-table__wrapper'}">
                <thead>
                <tr>
                  <th class="text-center">지역명</th>
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
                  <template v-if="item.dstbYn === 'Y' ? t.itemName === item.itemName : t.itemName === item.lcalCodeName">
                    <td>{{item.lcalCodeName}}</td>
                    <td>{{item.saleChnnlName}}</td>
                    <td>{{item.ticketNo}}</td>
                    <td>{{item.itemName}}</td>
                    <td>{{item.sellAmt1 | price}}</td>
                    <td>{{item.sellQty1 | price}}</td>
                    <td>{{item.saleAmt1 | price}}</td>
                    <td>{{item.calculate1 | price}}</td>
                    <td>{{item.cmsnExclAmt1 | price}} <span v-if="item.cmsnExclAmt1 > 0">({{item.cmsnRate1}}%)</span></td>
                    <td>{{item.totCmsnAmt1 | price}}</td>
                    <td>{{item.etc1}}</td>
                  </template>
                </tr>
                <tr class="sum-row">
                  <td colspan="4">합 계</td>
                  <td>{{total[t.itemName].sellAmt1 | price}}</td>
                  <td>{{total[t.itemName].sellQty1 | price}}</td>
                  <td>{{total[t.itemName].saleAmt1 | price}}</td>
                  <td>{{total[t.itemName].calculate1 | price}}</td>
                  <td>{{total[t.itemName].cmsnExclAmt1 | price}}</td>
                  <td>{{total[t.itemName].totCmsnAmt1 | price}}</td>
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
                  <th class="text-center">지역명</th>
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
                  <template v-if="item.dstbYn === 'Y' ? t.itemName === item.itemName : t.itemName === item.lcalCodeName">
                    <td>{{item.lcalCodeName}}</td>
                    <td>{{item.saleChnnlName}}</td>
                    <td>{{item.ticketNo}}</td>
                    <td>{{item.itemName}}</td>
                    <td>{{item.sellAmt2 | price}}</td>
                    <td>{{item.useQty2 | price}}</td>
                    <td>{{item.useAmt2 | price}}</td>
                    <td>{{item.calculate2 | price}}</td>
                    <td>{{item.cmsnExclAmt2 | price}} <span v-if="item.cmsnExclAmt2 > 0">({{item.cmsnRate2}}%)</span></td>
                    <td>{{item.totCmsnAmt2 | price}}</td>
                    <td>{{item.etc2}}</td>
                  </template>
                </tr>
                <tr class="sum-row">
                  <td colspan="4">합 계</td>
                  <td>{{total[t.itemName].sellAmt2 | price}}</td>
                  <td>{{total[t.itemName].useQty2 | price}}</td>
                  <td class="red--text">{{total[t.itemName].useAmt2 | price}}</td>
                  <td>{{total[t.itemName].calculate2 | price}}</td>
                  <td>{{total[t.itemName].cmsnExclAmt2 | price}}</td>
                  <td class="red--text">{{total[t.itemName].totCmsnAmt2 | price}}</td>
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
                ▣ 판매 후 미사용 위약
              </v-col>
            </v-row>
            <v-col cols="12" class="mb-1">
              <v-simple-table dense class="bordered text-center print-table" v-dragscroll="{target: '.v-data-table__wrapper'}">
                <thead>
                <tr>
                  <th class="text-center">지역명</th>
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
                  <template v-if="item.dstbYn === 'Y' ? t.itemName === item.itemName : t.itemName === item.lcalCodeName">
                    <td>{{item.lcalCodeName}}</td>
                    <td>{{item.saleChnnlName}}</td>
                    <td>{{item.ticketNo}}</td>
                    <td>{{item.itemName}}</td>
                    <td>{{item.sellAmt3 | price}}</td>
                    <td>{{item.sellQty3 | price}}</td>
                    <td>{{item.saleAmt3 | price}}</td>
                    <td>{{item.cmsnExclAmt3 | price}} <span v-if="item.cmsnExclAmt3 > 0">({{item.cmsnRate3}}%)</span></td>
                    <td>{{item.refundAmt3 | price}} <span v-if="item.refundAmt3 > 0">({{item.refundRate3}}%)</span></td>
                    <td>{{item.depositAmt3 | price}} <span v-if="item.depositAmt3 > 0">({{item.bkpmsRate3}}%)</span></td>
                    <td>{{item.totCmsnAmt3 | price}}</td>
                  </template>
                </tr>
                <tr class="sum-row">
                  <td colspan="4">합 계</td>
                  <td>{{total[t.itemName].sellAmt3 | price}}</td>
                  <td>{{total[t.itemName].sellQty3 | price}}</td>
                  <td>{{total[t.itemName].saleAmt3 | price}}</td>
                  <td>{{total[t.itemName].cmsnExclAmt3 | price}}</td>
                  <td>{{total[t.itemName].refundAmt3 | price}}</td>
                  <td class="red--text">{{total[t.itemName].depositAmt3 | price}}</td>
                  <td class="red--text">{{total[t.itemName].totCmsnAmt3 | price}}</td>
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
      </v-card-text>
    </v-card>
  </div>
</template>

<script>

import calculateService from '@/api/modules/social/calculate.service'

export default {
  name: 'TicketDist',
  props: { data: Object, close: Function },
  data: function () {
    return {
      param: {
        calcInd: '',
        calcSeq: '',
        calcNo: ''
      },
      list: [],
      tabList: [],
      total: {},
      totalRow: {
        sellAmt1: 0,
        sellQty1: 0,
        saleAmt1: 0,
        calculate1: 0,
        cmsnExclAmt1: 0,
        totCmsnAmt1: 0,
        sellAmt2: 0,
        useQty2: 0,
        useAmt2: 0,
        calculate2: 0,
        cmsnExclAmt2: 0,
        totCmsnAmt2: 0,
        sellAmt3: 0,
        sellQty3: 0,
        saleAmt3: 0,
        cmsnExclAmt3: 0,
        refundAmt3: 0,
        depositAmt3: 0,
        totCmsnAmt3: 0
      }
    }
  },
  mounted () {
    if (this.data) {
      this.param.calcInd = this.data.calcInd
      this.param.calcSeq = this.data.calcSeq
      this.param.calcNo = this.data.calcNo
    }
    this.setTab()
  },
  methods: {
    // 배분 지역 목록 조회
    setTab () {
      calculateService.selectDstbTabList(this.param).then(res => {
        if (res.data) {
          res.data.forEach(res => {
            this.tabList.push({ itemName: res.itemName })
            this.$set(this.total, res.itemName, _.cloneDeep(this.totalRow))
          })
        }
        this.search()
      })
    },
    // 목록 조회
    search () {
      calculateService.selectTicketDistList(this.param).then(res => {
        if (res.data) {
          this.list = res.data
          this.setTotalCal()
        }
      })
    },
    // 배분 총 합계
    setTotalCal () {
      // 배분여부가 Y 인경우 상품명으로 총 합계 계산
      for (const key in this.total) {
        const filteredList = _.filter(this.list, { itemName: key, dstbYn: 'Y' })
        Object.keys(this.total[key]).forEach(item => {
          filteredList.forEach(filteredItem => {
            this.total[key][item] += Number(filteredItem[item])
          })
        })
      }
      // 배분여부가 N 인경우 지역명으로 총 합계 계산
      for (const key in this.total) {
        const filteredList = _.filter(this.list, { lcalCodeName: key, dstbYn: 'N' })
        Object.keys(this.total[key]).forEach(item => {
          filteredList.forEach(filteredItem => {
            this.total[key][item] += Number(filteredItem[item])
          })
        })
      }
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

<style scoped lang="scss">
  div.print-table table {
    td, th {
      white-space: normal !important;
      font-size: 9px !important;
    }
  }
</style>
