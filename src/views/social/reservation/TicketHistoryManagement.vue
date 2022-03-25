<template>
    <v-row wrap>
        <v-col sm="12">
            <app-card :heading="'우대번호 거래내역 조회'">
                <!--<search-form :search-param.sync="searchParam" :search-list.sync="searchList" @search="search" excel @export="exportExcel"></search-form>-->
                <search-form :search-param.sync="searchParam" :search-list.sync="searchList"
                             @search="search"></search-form>
                <v-data-table
                    :no-data-text="'검색 결과가 없습니다.'"
                    :headers="headers"
                    :items="list"
                    hide-default-footer
                    item-key="b"
                    class="bordered"
                    disable-pagination
                >
                    <template v-slot:body="{ items }">
                        <tbody>
                        <template v-for="(item, index) in items">
                            <tr :key="item.ticketNo + index">
                                <td class="text-center pointer" @click="item.expand = !item.expand">
                                        <span v-if="item.size > 0">
                                            <v-icon>{{ item.expand ? "keyboard_arrow_up" : "keyboard_arrow_down" }}</v-icon>
                                            {{ item.ticketNo }} ({{ item.size }})
                                        </span>
                                    <span v-else>
                                            {{ item.ticketNo }}
                                        </span>
                                </td>
                                <td class="text-center">{{ item.ticketSeq }}</td>
                                <td class="text-center">{{ item.copnNo }}</td>
                                <td class="text-center">{{ item.ptnrRecpNo }}</td>
                                <td class="text-left">
                                    <pre v-if="item.exEtc">{{ item.exEtc }}</pre>
                                    <v-text-field v-model="item.etc" label=""></v-text-field>
                                </td>
                                <td class="text-center">{{ item.guestNm }}</td>
                                <td class="text-center">
                                    <mask-phone-number @selectPhone="changePhoneNo(item)" :text="item.telNo" />
                                </td>
                                <td class="text-center">{{ item.itemNm }}</td>
                                <td class="text-center">{{ setUseQty(item) }}</td>
                                <td class="text-center">
                                    <span v-if="item.useQty > 0">사용</span>
                                    <span v-else>
                                        <span v-if="checkUseState(item) === 'N'">
                                          <!-- 메인, 결합 우대번호중 상태값이 Z가 있는경우 -->
                                          에러( 관리자 문의 [상태 : Z] )
                                        </span>
                                        <span v-else-if="checkApplyYmd(item) === 'N'">
                                          <span v-if="item.state === 'mainN'">
                                            <!-- 메인 우대번호 유효기간 경과했을 경우 -->
                                            유효기간 경과 [ {{ item.applyEndYmd }} ]
                                          </span>
                                          <span v-else>
                                            <!-- 결합 우대번호 유효기간 경과했을 경우 -->
                                            {{ item.useState === "Y" ? "사용가능" : "환불" }}
                                          </span>
                                        </span>
                                        <span v-else @click="changeStatus(item)" class="pointer">
                                          <v-icon
                                              :color="setUseStateDisabled(item) ? 'grey lighten-2 grey--text' : 'primary'">{{ item.useState === "Y" ? "radio_button_checked" : "radio_button_unchecked" }}</v-icon> 사용가능
                                          <v-icon
                                              :color="setUseStateDisabled(item) ? 'grey lighten-2 grey--text' : 'primary'">{{ item.useState === "R" ? "radio_button_checked" : "radio_button_unchecked" }}</v-icon> 환불
                                        </span>
                                      </span>
                                </td>
                                <td class="text-center">{{ item.crtDt }}</td>
                            </tr>
                            <template v-if="item.expand">
                                <tr v-for="detail of item.groupList" :key="detail.ticketNo + index"
                                    class="green lighten-4">
                                    <td class="text-center">{{ detail.ticketNo }}</td>
                                    <td class="text-center">{{ detail.ticketSeq }}</td>
                                    <td class="text-center">{{ detail.copnNo }}</td>
                                    <td class="text-center">{{ detail.ptnrRecpNo }}</td>
                                    <td class="text-center">{{ detail.etc }}</td>
                                    <td class="text-center">{{ detail.guestNm }}</td>
                                    <td class="text-center">
                                        <mask-phone-number @selectPhone="changePhoneNo(detail)" :text="detail.telNo" />
                                    </td>
                                    <td class="text-center">{{ detail.itemNm }}</td>
                                    <td class="text-center">{{ setUseQty(detail) }}</td>
                                    <td class="text-center">
                                        <span v-if="detail.useQty > 0">사용</span>
                                        <span v-else-if="detail.useState === 'Z'">
                                            <!-- 결합우대번호 상태가 Z인 경우 -->
                                            에러( 관리자 문의 [상태 : Z] )
                                          </span>
                                        <span v-else-if="detail.applyYmdYn === 'N'">
                                            <!-- 결합 우대번호 유효기간 경과했을 경우 -->
                                            유효기간 경과 [ {{ detail.applyEndYmd }} ]
                                          </span>
                                        <span v-else>
                                            {{ detail.useState == "Y" ? "사용가능" : "환불" }}
                                          </span>
                                    </td>
                                    <td class="text-center">{{ detail.crtDt }}</td>
                                </tr>
                            </template>
                        </template>
                        </tbody>
                    </template>
                </v-data-table>
                <search-pagination v-model="searchParam" :total-visible="10" circle
                                   @change="search"></search-pagination>
            </app-card>
        </v-col>
    </v-row>
</template>

<script>
import ticketHistoryService from 'Api/modules/social/ticketHistory.service'
import maskPhoneNumber from 'Components/Mask/MaskPhoneNumber.vue'
import util from '@/utils/phone.util'
import excelMixin from 'Mixins/excelMixin'
import { mapGetters } from 'vuex'

export default {
  components: { maskPhoneNumber },
  name: 'TicketHistoryManagement',
  mixins: [excelMixin],
  computed: {
    searchList () {
      return [
        { key: 'ticketNo', label: '우대번호', type: 'text', maxlength: 8 },
        { key: 'ticketSeq', label: '순번', type: 'text', maxlength: 6 },
        { key: 'copnNo', label: '난수번호', type: 'text' },
        { key: 'ptnrRecpNo', label: '업체주문번호', type: 'text' },
        { key: 'guestNm', label: '이름', type: 'text' },
        { key: 'telNo', label: '전화번호', type: 'text' }
      ]
    },
    ...mapGetters({ user: 'auth/user' })
  },
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      list: [],
      headers: [
        { text: '우대번호', value: 'ticketNo', align: 'center' },
        { text: '순번', value: 'ticketSeq', align: 'center' },
        { text: '난수번호', value: 'copnNo', align: 'center' },
        { text: '업체주문번호', value: 'ptnrRecpNo', align: 'center' },
        { text: '비고', value: 'etc', align: 'center' },
        { text: '이름', value: 'guestNm', align: 'center' },
        { text: '전화번호', value: 'telNo', align: 'center' },
        { text: '상품명', value: 'itemNm', align: 'center' },
        { text: '사용여부', value: 'useQty', align: 'center' },
        { text: '상태', value: 'useState', align: 'center' },
        { text: '연동일자', value: 'crtDt', align: 'center' }
      ],
      form: {}
    }
  },
  mounted () {
  },
  methods: {
    // 전화번호 마스킹
    changePhoneNo (item) {
      ticketHistoryService.selectPhoneNo(item).then(res => {
        item.telNo = util.toPhoneStr(res.data)
      })
    },
    // 사용여부(수량) setting
    setUseQty (item) {
      let state
      let pattern = new RegExp('^[5]')
      // 객실(5)
      if (pattern.test(item.ticketNo)) {
        if (item.useQty > 0) {
          state = '투숙'
        } else if (item.useQty === '0') {
          state = '미사용'
        }
      }
      // 입장권(4),할인권(9)
      pattern = new RegExp('^[4|9]')
      if (pattern.test(item.ticketNo)) {
        state = item.useQty + '개'
      }
      return state
    },
    // 상태값 disabled
    setUseStateDisabled (item) {
      let disabled = false
      // 결합상품 중 1개라도 사용했을경우 상태변경 불가
      if (item.groupList.length > 0) {
        item.groupList.forEach(item => {
          if (item.useQty > 0) disabled = true
        })
      }
      return disabled
    },
    // 메인, 결합 우대번호 Z값 확인
    checkUseState (item) {
      let state = 'Y'
      // 메인 우대번호
      if (item.useState === 'Z') state = 'N'
      // 결합 우대번호
      if (item.groupList.length > 0) {
        item.groupList.forEach(item => {
          if (item.useState === 'Z') state = 'N'
        })
      }
      return state
    },
    // 우대번호 유효기간 확인
    checkApplyYmd (item) {
      let state = 'Y'
      // 메인 우대번호 유효기간
      if (item.applyYmdYn === 'N') {
        state = 'N'
        item.state = 'mainN'
      }
      // 결합 우대번호 유효기간
      if (item.groupList.length > 0) {
        item.groupList.forEach(group => {
          if (group.applyYmdYn === 'N') state = 'N'
        })
      }
      return state
    },
    // 상태값 변경
    changeStatus (item) {
      if (this.setUseStateDisabled(item)) {
        return
      }
      // 비고란 필수 확인
      if (!item.etc) {
        this.$dialog.alert('비고는 필수 입력입니다.')
        return
      }
      const status = item.useState === 'Y' ? '환불' : '사용가능'
      this.$dialog.confirm(status + ' 상태로 일괄변경 하시겠습니까?').then(() => {
        if (item.useState === 'Y') {
          item.state = 'R'
        } else if (item.useState === 'R') {
          item.state = 'Y'
        }
        // 상태값 update
        ticketHistoryService.updateTicketState(item).then(res => {
          item.useState = item.state
          this.search()
        })
      })
    },
    // 목록 조회
    search () {
      if (!this.searchParam.q.ticketNo && !this.searchParam.q.guestNm && !this.searchParam.q.telNo) {
        this.$dialog.alert('우대번호, 이름, 전화번호중 하나를 입력해 주세요.')
      } else {
        // 파트너일 경우 파트너 번호 set
        if (this.isPartner) {
          this.searchParam.q.ptnrNo = this.user.number
        }
        ticketHistoryService.selectTicketHistoryList(this.searchParam).then(res => {
          if (res.data.length > 0) {
            for (const list of res.data) {
              const length = _.size(list.groupList)
              if (length > 0) {
                list.size = length
                // for (const group of list.groupList) {
                //   group.telNo = util.toPhoneStr(group.telNo)
                // }
              }
              list.expand = false
              // 전화번호 01012345678 -> 010-1234-5678 (가운데 마스킹처리 위해)
              // list.telNo = util.toPhoneStr(list.telNo)
            }
          }
          this.list = res.data
          this.searchParam.total = res.pagination.total
        })
      }
    },
    // 엑셀 다운로드
    exportExcel () {
      let checkParam = 0
      if (Object.keys(this.searchParam.q).length === 0) {
        this.$dialog.alert('조회 조건을 통해 검색 후  <br/> 엑셀 다운로드를 해주세요.')
      } else {
        Object.keys(this.searchParam.q).forEach(item => {
          if (this.searchParam.q[item] !== '') {
            checkParam++
          }
        })
        // 검색 조건이 1개라도 있을경우만 excel download 가능
        if (checkParam !== 0) {
          this.downLoadExcel('/api/social/reservation/excel', '우대번호 거래내역 조회', this.searchParam, '.csv')
        } else {
          // 검색 조건이 전부 비어 있을경우
          this.$dialog.alert('조회 조건을 통해 검색 후  <br/> 엑셀 다운로드를 해주세요.')
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
