<template>
  <div>
    <v-row v-if="isPartner" no-gutters>
      <v-col cols="12">
        <app-card :heading="'다중 예약 취소(파트너)'" col-classes="col-12 pl-0 pb-0 pr-0">
          <partner-rsv-search-form :is-multi-cancel="isMultiCancel" v-if="partnerInfo.memberNo" :partner-info="partnerInfo" :room-type="roomType" :room-type-list="roomTypeList" :search-param.sync="searchParam" @change-type="changeType" @search="search" @export="exportExcel" disable-pagination/>
        </app-card>
      </v-col>
      <v-col>
        <app-card>
          <template v-slot:heading>
            <div class="title font-weight-bold">예약 현황 (총 {{rsvList.length}} 건)</div>
          </template>
          <virtual-scroll-table :key="key" :headers="headers" :items="rsvList" :item-height="30" :body-height="730" item-key="keyRsvNo">
            <template v-slot:selectedYn="{item}">
              <v-btn icon
               @click="changeSelect(item)"
              >
                <v-icon>{{ item.selectedYn === 'Y' ? 'check_box': 'check_box_outline_blank' }}</v-icon>
              </v-btn>
            </template>
            <template v-slot:realGuestName="{item}">
              <mask-name :text="item.realGuestName" />
            </template>
            <template v-slot:guestTelNo="{item}">
              <template v-if="item.guestTelNo">
                <mask-phone-number :height="20" :text="item.guestTelNo" @selectPhone="selectPhone(item)"/>
              </template>
            </template>
            <template v-slot:rsvNo="{item}">
              <v-row v-if="!!item.rsvNo" @click.stop="openReservation(item.keyRsvNo)" align="center">
                <v-btn small color="info" text block><v-icon small>search</v-icon>{{item.rsvNo}}</v-btn>
              </v-row>
              <span v-else>없음</span>
            </template>
          </virtual-scroll-table>
          <v-col align-self="center" class="text-right" v-if="writeAuth">
            <v-btn outlined rounded color="red" @click="openCancelPopup">예약취소(F8)</v-btn>
          </v-col>
        </app-card>
      </v-col>
    </v-row>
    <v-row v-else-if="!isPartner" no-gutters>
      <v-col cols="12">
        <app-card :heading="'다중 예약 취소(관리자)'" col-classes="col-12 pl-0 pb-0 pr-0">
          <rsv-search-form :is-multi-cancel="isMultiCancel" :room-type="roomType" :room-type-list="roomTypeList" :search-param.sync="searchParam" @change-type="changeType" @search="search" @export="exportExcel" disable-pagination/>
        </app-card>
      </v-col>
      <v-col>
        <app-card>
          <template v-slot:heading>
            <div class="title font-weight-bold">예약 현황 (총 {{rsvList.length}} 건)</div>
          </template>
          <virtual-scroll-table :key="key" :headers="headers" :items="rsvList" :item-height="30" :body-height="730" item-key="keyRsvNo">
            <template v-slot:selectedYn="{item}">
              <v-btn icon
                @click="changeSelect(item)"
              >
                <v-icon>{{ item.selectedYn === 'Y' ? 'check_box': 'check_box_outline_blank' }}</v-icon>
              </v-btn>
            </template>
            <template v-slot:realGuestName="{item}">
              <mask-name :text="item.realGuestName" />
            </template>
            <template v-slot:guestTelNo="{item}">
              <template v-if="item.guestTelNo">
                <mask-phone-number :height="20" :text="item.guestTelNo" @selectPhone="selectPhone(item)"/>
              </template>
            </template>
            <template v-slot:rsvNo="{item}">
              <v-row v-if="!!item.rsvNo" @click.stop="openReservation(item.keyRsvNo)" align="center">
                <v-btn small color="info" text block><v-icon small>search</v-icon>{{item.rsvNo}}</v-btn>
              </v-row>
              <span v-else>없음</span>
            </template>
          </virtual-scroll-table>
          <v-col align-self="center" class="text-right" v-if="writeAuth">
            <v-btn outlined rounded color="red" @click="openCancelPopup">예약취소(F8)</v-btn>
          </v-col>
        </app-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import RsvSearchForm from '@/components/Ota/RoomReservation/RsvSearchForm.vue'
import PartnerRsvSearchForm from '@/components/Ota/RoomReservation/Partner/PartnerRsvSearchForm.vue'
import roomService from '@/api/modules/ota/roomReservation.service'

import { mapGetters } from 'vuex'
import excelMixin from '@/mixins/excelMixin'
import maskName from '@/components/Mask/MaskName.vue'
import VirtualScrollTable from '@/components/Common/VirtualScrollTable.vue'
import partnerTermService from '@/api/modules/partner/partnerTerm.service'

export default {
  components: { maskName, RsvSearchForm, PartnerRsvSearchForm, VirtualScrollTable },
  name: 'MultipleRsvCancel',
  mixins: [excelMixin],
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      headers: [
        {
          name: '선택',
          value: 'selectedYn',
          align: 'center',
          sortable: false,
          size: 1
        },
        {
          name: '상태',
          value: 'rsvState',
          align: 'center',
          sortable: false,
          size: 1
        },
        {
          name: '회원번호',
          value: 'memberNo',
          align: 'center',
          sortable: false,
          size: 2
        },
        {
          name: '예약번호',
          value: 'rsvNo',
          align: 'center',
          sortable: true,
          size: 2
        },
        {
          name: '이용자',
          value: 'guestName',
          align: 'center',
          sortable: true,
          size: 2
        },
        {
          name: '이용자연락처',
          value: 'guestTelNo',
          align: 'center',
          sortable: false,
          size: 2
        },
        {
          name: '입실일자',
          value: 'checkInDate',
          align: 'center',
          sortable: true,
          size: 2
        },
        {
          name: '박',
          value: 'nights',
          align: 'center',
          sortable: false,
          size: 1
        },
        {
          name: '객',
          value: 'roomCount',
          align: 'center',
          sortable: false,
          size: 1
        },
        {
          name: '영업장명',
          value: 'storeName',
          align: 'center',
          sortable: true,
          size: 4,
          type: 'truncate',
          textSize: 30
        },
        {
          name: '동',
          value: 'dongCodeName',
          align: 'center',
          sortable: false,
          size: 1
        },
        {
          name: '객실유형명',
          value: 'roomTypeName',
          align: 'center',
          sortable: false,
          size: 3,
          type: 'truncate',
          textSize: 30
        },
        {
          name: '타입',
          value: 'rsvTypeName',
          align: 'center',
          sortable: false,
          size: 1
        }
      ],
      rsvList: [], // 예약 조회 목록
      roomType: { text: '객실', value: 'OTA_ROOM_API' },
      roomTypeList: [ // 객실/패키지 목록 리스트
        {
          text: '객실',
          value: 'OTA_ROOM_API'
        },
        {
          text: '패키지',
          value: 'OTA_PKG_API'
        }
      ],
      isMultiCancel: true, // 다건취소 여부
      path: '', // 파트너 or 관리자
      partnerInfo: { // 파트너 정보
        memberNo: '',
        memName: '',
        termSeq: '',
        agentCode: '',
        rsvGuestTelNo: ''
      },
      selectedList: [], // 체크박스가 선택된 예약정보들 목록
      key: 0 // 강제 렌더링을 위한 변수
    }
  },
  computed: {
    ...mapGetters({ user: 'auth/user' })
  },
  mounted () {
    this.selectDefaultPartnerInfo()
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [
        {
          target: 'F8', // 다중 예약 취소 팝업
          action: this.openCancelPopup
        },
        {
          target: 'F11', // 예약번호 검색창에 Focus
          action: this.focusRsv
        }
      ]
    })
  },
  methods: {
    /**
     * 파트너인 경우 회원정보 조회
     */
    async selectDefaultPartnerInfo () {
      if (this.isPartner) {
        const res = await partnerTermService.selectDefaultPartnerInfo()
        this.partnerInfo.memberNo = res.data.memberNo
        this.partnerInfo.memName = res.data.memName
        this.partnerInfo.termSeq = res.data.termSeq
        this.partnerInfo.agentCode = res.data.agentCode
        this.partnerInfo.rsvGuestTelNo = res.data.rsvGuestTelNo
      }
    },
    /**
     * 다중 체크박스 선택 시
     */
    changeSelect (item) {
      // 체크박스 on/off
      item.selectedYn = item.selectedYn === 'Y' ? 'N' : 'Y'
      if (item.selectedYn === 'Y') {
        this.selectedList.push(item)
      } else {
        const itemIndex = this.selectedList.findIndex(function (data) { return data.rsvNo === item.rsvNo })
        this.selectedList.splice(itemIndex, 1)
      }
      this.key += 1
    },
    /**
     * 객실 혹은 패키지 선택
     */
    changeType (type) {
      // type이 객실인 경우와 패키지인 경우에 따라 roomType 변경
      type === this.roomTypeList[0].value ? this.roomType = this.roomTypeList[0] : this.roomType = this.roomTypeList[1]
      this.rsvList = [] // 예약목록 초기화
    },
    /**
     * 검색
     */
    async search () {
      this.rsvList = [] // 예약 현황 목록 초기화
      this.partnerSeq = this.searchParam.q.partnerSeq

      // keyRsvNo로 검색하지 않는 경우 OR 파트너인 경우 필수 조건 적용
      if (!this.searchParam.q.keyRsvNo || this.isPartner) {
        if (
          this.searchParam.q.memberNo ||
          this.searchParam.q.packageNo ||
          this.searchParam.q.agentCode
        ) {
          if (this.searchParam.q.memberNo && !this.searchParam.q.memberNo.startsWith('5')) {
            this.$dialog.alert('회원번호는 5로 시작해야 합니다')
            return
          }
        } else {
          if (this.roomType.value === 'OTA_ROOM_API') {
            this.$dialog.alert('회원번호/패키지번호 또는 Agent 코드를 입력해주시기 바랍니다.')
            return
          }
        }

        if (
          !this.searchParam.q.checkInDate ||
          !this.searchParam.q.checkInDate[0] ||
          !this.searchParam.q.checkInDate[1]
        ) {
          this.$dialog.alert('입실일자는 필수값 입니다.')
          return
        }
      }

      // 객실인 경우 패키지 번호 제거, 패키지인 경우 회원 번호 제거
      this.roomType.value === 'OTA_ROOM_API' ? this.searchParam.q.packageNo = '' : this.searchParam.q.memberNo = ''

      // 파트너 여부 추가
      this.searchParam.q.isPartner = this.isPartner ? 'Y' : 'N'

      // 파트너 일 경우 파트너번호 추가
      if (this.searchParam.q.isPartner === 'Y') {
        this.searchParam.q.partnerSeq = this.user.number
      }

      // 예약 현황 조회
      const res = await roomService.selectReservationList(this.searchParam)
      this.rsvList = res.data
    },
    /**
     * 예약취소 팝업 오픈
     */
    openCancelPopup () {
      const rsv = this.selectedList.filter(data => data.rsvState === '예약')
      const cancel = this.selectedList.filter(data => data.rsvState === '취소')
      if (this.selectedList.length > 0) {
        // 전체 취소
        if (this.selectedList.length === rsv.length) {
          this.$store.dispatch('dialog/open', {
            componentPath: '/Ota/RoomReservation/popup/CancelPopup',
            params: {},
            options: {
              fullscreen: false,
              scrollable: true,
              width: 700,
              closeCallback: (params) => {
                if (params && params.data) {
                  const cancelReason = {}
                  cancelReason.cancelResnCode = params.data.cancelResnCode
                  cancelReason.cancelResnDesc = params.data.cancelResnDesc
                  this.rsvCancel(cancelReason) // 실제 예약취소 실행
                }
              }
            }
          })
        // 취소 사유 변경
        } else if (this.selectedList.length === cancel.length) {
          this.$store.dispatch('dialog/open', {
            componentPath: '/Ota/RoomReservation/popup/CancelResnChangePopup',
            params: {},
            options: {
              fullscreen: false,
              scrollable: true,
              width: 700,
              closeCallback: (params) => {
                if (params && params.data) {
                  const cancelReason = {}
                  cancelReason.cancelResnCode = params.data.cancelResnCode
                  cancelReason.cancelResnDesc = params.data.cancelResnDesc
                  this.updateCancelResn(cancelReason)
                }
              }
            }
          })
        } else {
          this.$dialog.alert('동일한 예약 상태만 선택해주시기 바랍니다.')
        }
      } else {
        this.$dialog.alert('취소할 예약이 없습니다.')
      }
    },
    /**
     * 취소 사유 변경
     */
    async updateCancelResn (cancelReason) {
      const param = []
      for (const row of this.selectedList) {
        const oneRsv = {}
        oneRsv.keyRsvNo = row.keyRsvNo
        oneRsv.keySeq = row.keySeq
        oneRsv.cancelResnCode = cancelReason.cancelResnCode
        oneRsv.cancelResnDesc = cancelReason.cancelResnDesc
        oneRsv.updId = this.user.number // 수정자
        param.push(oneRsv)
      }
      // 취소 사유 변경
      const res = await roomService.updateMultipleCancelResn(param)
      this.openMultiCancelPopup(res)
    },
    /**
     * 실제 예약 취소
     */
    async rsvCancel (cancelReason) {
      const param = []
      for (const rsv of this.selectedList) {
        const oneRsv = {}
        oneRsv.rsvNo = rsv.rsvNo
        oneRsv.keyRsvNo = rsv.keyRsvNo
        oneRsv.guestName = rsv.guestName
        oneRsv.cancelResnCode = cancelReason.cancelResnCode
        oneRsv.cancelResnDesc = cancelReason.cancelResnDesc
        oneRsv.updId = this.user.number // 수정자
        if (rsv.memberNo && rsv.memberNo.startsWith('56')) { // 객실
          oneRsv.memberNo = rsv.memberNo
        } else { // 패키지
          oneRsv.agentCode = rsv.agentCode
        }
        param.push(oneRsv)
      }
      // path 설정
      this.isPartner ? this.path = 'partner' : this.path = 'system'
      // 다중 취소 로직 실행
      const res = await roomService.cancelMultipleRsv(this.path, param)
      this.openMultiCancelPopup(res)
    },
    /**
     * 취소 및 취소사유 변경 후 처리
     */
    openMultiCancelPopup (res) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/RoomReservation/popup/MultiCancelResultPopup',
        params: {
          list: res.data
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 800
        }
      })
      // 검색
      this.search()
      // selectedList 초기화
      this.selectedList = []
    },
    /**
     * 엑셀 다운로드
     */
    exportExcel () {
      if (this.rsvList.length > 0) {
        const searchParam = _.cloneDeep(this.searchParam)
        searchParam.q.checkInDate = _.join(searchParam.q.checkInDate, ',')
        searchParam.q.statusCode = _.join(searchParam.q.statusCode, ',')
        this.downLoadExcel('/api/system/ota/roomReservation/excel', '객실 예약 관리', searchParam, '.csv')
      } else {
        this.$dialog.alert('다운로드할 예약이 없습니다.')
      }
    },
    /**
     * 단축키 F11 예약번호 검색창으로 focus
     */
    focusRsv () {
      document.getElementById('rsvNo').focus()
    },
    /**
     * 예약내역 팝업창 호출
     * @param keyRsvNo 예약 번호
     */
    openReservation (keyRsvNo) {
      if (keyRsvNo) {
        this.$store.dispatch('dialog/open', {
          componentPath: '/SearchDialog/ReservationSearch',
          params: {
            keyRsvNo: keyRsvNo
          },
          options: {
            fullscreen: false,
            scrollable: true,
            width: 800
          }
        })
      }
    },
    /**
     * 실제 이용자 연락처 조회
     */
    async selectPhone (item) {
      const res = await roomService.selectRealGuestTelNo(item.keyRsvNo)
      item.guestTelNo = res.data.toString()
    }
  }
}
</script>
