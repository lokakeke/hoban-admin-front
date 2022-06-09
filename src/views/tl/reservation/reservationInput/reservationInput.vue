<template>
    <div>
        <v-container fluid grid-list-md pt-0>
            <app-card colClasses="xl12 lg12 md12 sm12 xs12">
                <search-form init-search :search-param.sync="searchParam" :search-list.sync="searchList"
                             @search="search"></search-form>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-data-table most-sort :no-data-text="'예약 등록 목록이 없습니다.'"
                                      class="condensed" :headers="headers" :items="list"
                                      ref="detail" item-key="travRsvNo">
                            <template v-slot:body="{ items }">
                                <tbody>
                                <template v-for="(item,index) in items">
                                    <tr class="pointer" :key="index" @click="showDetail(item)">
                                        <td class="text-center">{{ item.brcName }}</td>
                                        <td class="text-center">
                                            <template v-if="item.cnt == 1">
                                                                            <span class="v-badge error">
                                                                                {{ item.cnt }}
                                                                            </span>
                                            </template>
                                            <template v-else>
                                                <v-btn small @click="openSubDetailList(null, item)" @click.stop.prevent>
                                                    {{ item.cnt }}
                                                    <v-icon>
                                                        {{
                                                            item.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
                                                        }}
                                                    </v-icon>
                                                </v-btn>
                                            </template>
                                        </td>
                                        <td class="text-center">{{ item.rsvName }}</td>
                                        <td class="text-center">{{ item.agtName }}</td>
                                        <td class="text-center">{{ item.travRsvNo }}</td>
                                        <td class="text-center">{{ item.userNm }}</td>
                                        <td class="text-center">{{ item.roomYmd | date }}</td>
                                        <td class="text-center">{{ item.roomPrice | price }}</td>
                                        <td class="text-center">{{ item.breakfastYn == 'Y' ? '포함' : '' }}</td>
                                        <td class="text-center">{{ item.notTryConfirmYmd }}</td>
                                        <td class="text-center">{{ item.createDatetime }}</td>
                                    </tr>
<!--                                    <tr v-if="item.isOpen && item.isOpen === true" :key="index+ '-'" class="bordered pr-2 pl-2">-->
<!--                                        <td colspan="14" class="pr-2 pl-2">-->
<!--                                            <div class="condensed pt-2 pb-2">-->
<!--                                                <v-data-table :items="item.detailList" class="condensed">-->
<!--                                                    <template v-slot:body="{ items }">-->
<!--                                                        <div v-for="item of items" :key="item">{{ item }}</div>-->
<!--                                                    </template>-->
<!--                                                </v-data-table>-->
<!--                                            </div>-->
<!--                                        </td>-->
<!--                                    </tr>-->
                                    <tr v-if="item.isOpen && item.isOpen === true" :key="index+ '-'" class="bordered pr-2 pl-2 sub-detail">
                                        <td colspan="14" class="pr-2 pl-2">
                                        <div class="condensed pt-2 pb-2">
                                            <table class="bordered" style="width: 100%">
                                                <thead>
                                                <tr>
                                                    <th>예약구분</th>
                                                    <th>투숙일</th>
                                                    <th>객실수</th>
                                                    <th>박수</th>
                                                    <th>객실료</th>
                                                    <th>등록일</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr v-for="(detail, index) of item.detailList" class="pointer" :key="index" @click="showSubDetail(detail)">
                                                    <td class="text-center">{{detail.rsvName}}</td>
                                                    <td class="text-center">{{detail.roomYmd | date}}</td>
                                                    <td class="text-center">{{detail.roomCnt}}</td>
                                                    <td class="text-center">{{detail.nights}}</td>
                                                    <td class="text-center">{{detail.roomPrice | price}}</td>
                                                    <td class="text-center">{{detail.createDatetime}}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        </td>
                                    </tr>
                                </template>
                                </tbody>
                            </template>
                        </v-data-table>

                        <div class="text-xs-center pt-2">
                            <search-pagination v-model="searchParam" :total-visible="10" circle
                                               @change="search"></search-pagination>
                        </div>
                    </v-flex>
                </v-layout>

            </app-card>
        </v-container>

        <reservation-input-detail :dialog.sync="dialog" :toast-data="toastData"></reservation-input-detail>
    </div>
</template>

<script>
import reservationInputService from '@/api/modules/tl/reservation/reservationInput.service'
import reservationInputDetail from '@/views/tl/reservation/reservationInput/reservationInputDetail'
import Vue from 'vue'

export default {
  components: { reservationInputDetail },
  name: 'reservationInput',
  computed: {
    pages () {
      if (this.pagination.rowsPerPage == null ||
                this.pagination.totalItems == null
      ) return 0

      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    }
  },
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      pagination: {
        rowsPerPage: 10,
        totalItems: 0,
        sortBy: 'createDatetime',
        descending: true
      },
      page: 1,
      list: [],
      headers: [
        { text: '사업장', value: 'brcName', align: 'center', sortable: false },
        { text: '건수', value: 'cnt', align: 'center', sortable: false },
        { text: '상태', value: 'rsvName', align: 'center', sortable: false },
        { text: '판매처', value: 'agtName', align: 'center', sortable: false },
        { text: 'TL예약번호', value: 'travRsvNo', align: 'center', sortable: false },

        { text: '예약자', value: 'userNm', align: 'center', sortable: false },
        { text: '투숙일', value: 'roomYmd', align: 'center' },
        { text: '객실료', value: 'roomPrice', align: 'center', sortable: false },
        { text: '조식여부', value: 'breakfastYn', align: 'center', sortable: false },
        { text: '미 시도 확인', value: 'notTryConfirmYmd', align: 'center', sortable: false },
        { text: '등록일', value: 'createDatetime', align: 'center' }
      ],
      searchList: [
        { key: 'brcNo', label: '사업장1', type: 'branch' },
        { key: 'rsvType', label: '예약구분1', type: 'code', commCd: 'tl_rsv_type' },
        { key: 'agtCode', label: '판매처1', type: 'code', commCd: 'agt' },
        { key: 'userNm', label: '예약자1', type: 'text' },
        {
          key: 'roomYmd',
          label: '투숙일',
          type: 'dateRange',
          startField: 'beginDate1',
          endField: 'endDate1',
          format: 'YYYYMMDD'
        },
        // {key: 'insDt', label: '등록일', type: 'dateRange', startField: 'beginDate2', endField: 'endDate2', format: 'YYYYMMDD', defaultValue: {'start': moment().toDate(), 'end': moment().toDate()}},
        {
          key: 'createDatetime',
          label: '등록일',
          type: 'dateRange',
          startField: 'beginDate2',
          endField: 'endDate2',
          format: 'YYYYMMDD'
        },
        { key: 'travRsvNo', label: 'TL예약번호', type: 'text' },
        { key: 'isBreakfast', label: '조식여부', type: 'boolean' },
        { key: 'ciModifyDaysYn', label: '투숙일 기준 3일이내 취소', type: 'boolean' },
        { key: 'noHistoryYn', label: '예약 미 시도', type: 'boolean' }
      ],
      emptyRules: this.emptyRules,
      toastData: {},
      dialog: false
    }
  },
  watch: {
    pagination: {
      handler (newVal, oldVal) {
        if (newVal.sortBy != null && newVal.descending != null) {
          if (newVal.sortBy !== oldVal.sortBy || newVal.descending !== oldVal.descending) {
            this.search()
          }
        }
      },
      deep: true
    }
  },
  methods: {
    getWaitList (procYn) {
      this.searchParam.q.procYn = procYn
      this.search()
    },
    search () {
      this.searchParam.q.sortBy = this.pagination.sortBy || ''
      this.searchParam.q.orderBy = this.pagination.descending ? 'desc' : ''

      this.searchParam.q.breakfastYn = this.searchParam.q.isBreakfast ? 'Y' : ''
      this.searchParam.q.ciModifyDaysYn = this.searchParam.q.ciModifyDaysYn ? 'Y' : ''
      this.searchParam.q.noHistoryYn = this.searchParam.q.noHistoryYn ? 'Y' : ''

      reservationInputService.selectReservationInputList(this.searchParam).then(res => {
        this.list = res.data
        this.searchParam.total = res.pagination.total
        this.pagination.totalItems = res.pagination.total
        this.page = this.searchParam.page

        for (const detail of this.list) {
          this.$set(this.$refs.detail.expanded, detail.orgDataId, false)
        }
      })
    },
    pageChange (page) {
      if (page !== this.searchParam.page) {
        this.searchParam.page = page
        this.search()
      }
    },

    showDetail (item) {
      this.toastData.bindParam1 = item.brcNo
      this.toastData.bindParam2 = item.detailList[0].inputNo
      this.toastData.bindParam3 = item.detailList[0].inputDetailNo
      this.dialog = true
    },

    showSubDetail (item) {
      this.toastData.bindParam1 = item.brcNo
      this.toastData.bindParam2 = item.inputNo
      this.toastData.bindParam3 = item.inputDetailNo
      this.dialog = true
    },
    openSubDetailList (detail, item) {
      if (!item.isOpen) {
        Vue.set(item, 'isOpen', true)
      } else {
        item.isOpen = !item.isOpen
      }
    }
  }
}
</script>
