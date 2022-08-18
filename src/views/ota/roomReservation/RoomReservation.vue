<template>
    <div>
        <v-row v-if="isPartner" no-gutters>
            <v-col cols="12">
                <app-card :heading="'객실/패키지 예약관리(파트너)'" col-classes="col-12 pl-0 pb-0 pr-0"
                          custom-classes="elevation-0">
                    <partner-rsv-search-form v-if="isLoading" :partner-info="partnerInfo" :room-type="roomType"
                                             :room-type-list="roomTypeList" :search-param.sync="searchParam"
                                             @change-type="changeType" @search="search" @export="exportExcel"
                                             @partner-new-rsv="partnerNewRsv($event)" disable-pagination />
                </app-card>
            </v-col>
            <v-col :cols="colList">
                <app-card custom-classes="elevation-0">
                    <template v-slot:heading>
                        <div class="title font-weight-bold">예약 현황</div>
                        <v-spacer />
                        <v-menu bottom :close-on-click="true" :nudge-width="80" back>
                            <template v-slot:activator="{ on }">
                                <v-btn outlined rounded v-on="on" color="cyan">폰트 사이즈</v-btn>
                            </template>
                            <v-card>
                                <v-list>
                                    <v-list-item>
                                        <v-radio-group v-model="selectedSize">
                                            <v-radio v-for="n in [9,12,16]" :key="n" :label="`size ${n}px`" :value="n"
                                                     @click="changeFontSize(n)" class="font-weight-bold" />
                                        </v-radio-group>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                        </v-menu>
                    </template>
                    <virtual-scroll-table :headers="headers" :items="rsvList" :item-height="30" :body-height="780">
                        <template v-slot:rsvState="{item}">
                            <span :class="`font-${selectedSize}`">{{ item.rsvState }}</span>
                        </template>
                        <template v-slot:memberNo="{item}">
                            <span :class="`font-${selectedSize}`">{{ item.memberNo }}</span>
                        </template>
                        <template v-slot:rsvNo="{item}">
              <span :class="`font-${selectedSize} info--text`" @click="showDetail(item)">
                <v-btn small color="info" text block><v-icon small>search</v-icon>{{ item.rsvNo }}</v-btn>
              </span>
                        </template>
                        <template v-slot:guestName="{item}">
                            <span :class="`font-${selectedSize}`">{{ item.guestName }}</span>
                        </template>
                        <template v-slot:guestTelNo="{item}">
                            <template v-if="item.guestTelNo">
                                <mask-phone-number :height="20" :font-size="selectedSize" :text="item.guestTelNo"
                                                   @selectPhone="selectPhone(item)" />
                            </template>
                        </template>
                        <template v-slot:checkInDate="{item}">
                            <span :class="`font-${selectedSize}`">{{ item.checkInDate }}</span>
                        </template>
                        <template v-slot:nights="{item}">
                            <span :class="`font-${selectedSize}`">{{ item.nights }}</span>
                        </template>
                        <template v-slot:roomCount="{item}">
                            <span :class="`font-${selectedSize}`">{{ item.roomCount }}</span>
                        </template>
                        <template v-slot:storeName="{item}">
                            <span :class="`font-${selectedSize}`">{{ item.storeName }}</span>
                        </template>
                        <template v-slot:dongCodeName="{item}">
                            <span :class="`font-${selectedSize}`">{{ item.dongCodeName }}</span>
                        </template>
                        <template v-slot:roomTypeName="{item}">
                            <span :class="`font-${selectedSize}`">{{ item.roomTypeName }}</span>
                        </template>
                        <template v-slot:rsvTypeName="{item}">
                            <span :class="`font-${selectedSize}`">{{ item.rsvTypeName }}</span>
                        </template>
                    </virtual-scroll-table>
                </app-card>
            </v-col>
            <v-col :cols="colDetail">
                <partner-rsv-detail-wrapper ref="ptnrChild" :partner-info="partnerInfo"
                                            :room-type="roomType" :room-type-list="roomTypeList"
                                            :rsv-detail.sync="rsvDetail" :btn-name="btnName"
                                            @select-type="selectType($event)"
                                            @show-detail="showDetail($event)" @search="search"
                                            @change-size="changeSize()" />
            </v-col>
        </v-row>
        <v-row v-else-if="!isPartner" no-gutters>
            <v-col cols="12">
                <app-card :heading="'객실/패키지 예약관리(관리자)'" col-classes="col-12 pl-0 pb-0 pr-0"
                          custom-classes="elevation-0">
                    <rsv-search-form :room-type="roomType" :room-type-list="roomTypeList"
                                     :search-param.sync="searchParam" @change-type="changeType" @search="search"
                                     @export="exportExcel" @partner-new-rsv="partnerNewRsv($event)"
                                     disable-pagination />
                </app-card>
            </v-col>
            <v-col :cols="colList">
                <rsv-list-wrapper :list-height="listHeight" :rsv-list="rsvList" :headers="headers" :room-list="roomList"
                                  :origin-list="originList" @show-detail="showDetail($event)" />
            </v-col>
            <v-col :cols="colDetail">
                <rsv-detail-wrapper ref="child" :room-type="roomType"
                                    :room-type-list="roomTypeList" :rsv-detail.sync="rsvDetail" :btn-name="btnName"
                                    @select-type="selectType($event)" @change-rm-list="changeRoomList($event)"
                                    @system-new-rsv="systemNewRsv" @show-detail="showDetail($event)"
                                    @search="search" @change-size="changeSize()" />
            </v-col>
        </v-row>
    </div>
</template>

<script>
import roomService from '@/api/modules/ota/roomReservation.service'

import RsvSearchForm from '@/components/Ota/RoomReservation/RsvSearchForm.vue'
import RsvDetailWrapper from '@/components/Ota/RoomReservation/RsvDetailWrapper.vue'
import RsvListWrapper from '@/components/Ota/RoomReservation/RsvListWrapper.vue'
import PartnerRsvSearchForm from '@/components/Ota/RoomReservation/Partner/PartnerRsvSearchForm.vue'
import PartnerRsvDetailWrapper from '@/components/Ota/RoomReservation/Partner/PartnerRsvDetailWrapper.vue'

import { mapGetters } from 'vuex'
import excelMixin from '@/mixins/excelMixin'
import VirtualScrollTable from '@/components/Common/VirtualScrollTable.vue'
import partnerTermService from '@/api/modules/partner/partnerTerm.service'

export default {
  components: {
    RsvListWrapper,
    RsvSearchForm,
    RsvDetailWrapper,
    PartnerRsvSearchForm,
    PartnerRsvDetailWrapper,
    VirtualScrollTable
  },
  name: 'RoomReservation',
  mixins: [excelMixin],
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      sizeFlag: false, // list가 넓은 경우 false, detail이 넓은 경우 true
      btnName: '확장',
      colList: 9, // 확장시 colSize
      colDetail: 3, // 축소시 colSize
      listHeight: '680', // 예약 현황 목록의 높이
      headers: [
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
          textSize: 20
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
          textSize: 20
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
      rsvDetail: {}, // 예약 상세 정보 및 신규등록 기본 폼
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
      originList: [], // 원래 객실 리스트
      roomList: {}, // 가공된 객실 정보
      partnerSeq: '', // 파트너번호(예치금시 필요)
      partnerInfo: { // 파트너 정보
        memberNo: '',
        partnerName: '',
        termSeq: '',
        agentCode: '',
        partnerTelNo: ''
      },
      isLoading: false,
      selectedSize: 12 // font-size 변수
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
          target: 'F11', // 예약번호 검색창에 Focus
          action: this.focusRsv
        }
      ]
    })
  },
  methods: {
    /** 파트너인 경우 회원정보 조회 */
    async selectDefaultPartnerInfo () {
      if (this.isPartner) {
        this.listHeight = '850'
        const res = await partnerTermService.selectDefaultPartnerInfo()
        this.partnerInfo.memberNo = res.data.memberNo
        this.partnerInfo.partnerName = res.data.partnerName
        this.partnerInfo.termSeq = res.data.termSeq
        this.partnerInfo.agentCode = res.data.agentCode
        this.partnerInfo.partnerTelNo = res.data.partnerTelNo
        this.isLoading = true
      }
    },
    /** 잔여 객실 현황 목록 조회 */
    async changeRoomList (param) {
    /*
      // 잔여 객실 현황 필수값 확인
      if (param.storeCode && param.blockCode && param.startDate && param.endDate) {
        const newParam = {}
        newParam.storeCode = param.storeCode
        newParam.checkInDate = param.startDate
        newParam.checkOutDate = param.endDate
        // 잔여 객실 현황 조회
        const res = await pmsStockPriceService.selectLeaveRooms(param.blockCode, newParam)
        // 조회된 정보 중 날짜만 뽑아서 가공
        const days = _.uniqBy(res.data, 'checkInDate')
        this.originList = res.data.filter(room => room.checkInDate === days[0].checkInDate)

        // 객실에 대한 정보 가공
        const arr = {}
        for (const day of days) {
          arr[day.checkInDate] = res.data.filter(room => room.checkInDate === day.checkInDate)
        }
        this.roomList = arr
      }
         */
    },
    /** 객실 혹은 패키지 선택 */
    changeType (type) {
      // type이 객실인 경우와 패키지인 경우에 따라 roomType 변경
      type === this.roomTypeList[0].value ? this.roomType = this.roomTypeList[0] : this.roomType = this.roomTypeList[1]
      this.rsvDetail = {} // 초기화
      this.rsvList = [] // 예약목록 초기화
      this.resetRoomList() // 잔여객실 관련 목록 초기화
      this.detailReset() // 예약상세화면 설정 초기화
    },
    /** 잔여객실 관련 목록 초기화 */
    resetRoomList () {
      this.originList = [] // 원래 잔여객실 목록
      this.roomList = {} // 가공된 잔여객실
    },
    /** 관리자 - 신규 */
    systemNewRsv () {
      if (this.btnName === '확장' && !this.isPartner) {
        this.changeSize()
      }
    },
    /** 파트너 - 신규 */
    partnerNewRsv (roomType) {
      // 파트너 정보 조회 후 신규 팝업
      this.selectType(roomType)
      this.$nextTick(() => {
        this.$refs.ptnrChild.getPartnerInfo(roomType)
      })
      /* if (this.isPartner) {
        // 파트너 정보 조회 후 신규 팝업
        this.selectType(roomType)
        this.$nextTick(() => {
          this.$refs.ptnrChild.getPartnerInfo(roomType)
        })
      } else {
        this.$refs.child.makeNew()
        if (this.btnName === '확장') {
          this.changeSize()
        }
      } */
    },
    /** 객실인지 패키지인지 여부를 판단해 this.roomType의 값을 세팅 */
    selectType (roomType) {
      this.roomType = roomType === 'ROOM' ? this.roomTypeList[0] : this.roomTypeList[1]
    },
    /** 검색 */
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

      // Detail 화면이 넓은 경우
      if (this.sizeFlag) {
        this.changeSize()
      }
      this.resetRoomList() // 잔여객실 관련 목록 초기화
    },
    /** 예약 목록 중 1개 선택시 상세정보 보기 */
    async showDetail (item) {
      // keyRsvNo가 있는 경우
      if (item.keyRsvNo) {
        // 예약 상세 정보 조회
        const res = await roomService.selectReservationDetail(item.keyRsvNo)
        // 상세 정보가 있는 경우
        if (res.data) {
          this.rsvDetail = res.data
          // list 화면이 넓은 경우
          if (!this.sizeFlag) {
            this.changeSize()
          }
          this.detailReset() // 예약상세화면 설정 초기화

          if (this.rsvDetail.rsvType === 'PKG') { // 패키지인 경우
            this.rsvDetail.packageNo = res.data.memberNo
            this.rsvDetail.packageName = res.data.partnerName
            this.rsvDetail.memberNo = ''
            this.rsvDetail.memberName = ''
            this.roomType = this.roomTypeList[1]
          } else {
            this.roomType = this.roomTypeList[0]
          }

          // 잔여 객실 조회를 위한 파라미터 세팅
          /*
          if (!this.isPartner) {
            const param = {}
            param.storeCode = this.rsvDetail.storeCode
            param.startDate = this.rsvDetail.checkInDate
            param.endDate = moment(this.rsvDetail.checkInDate).add(30, 'days').format('YYYYMMDD')
            param.blockCode = this.rsvDetail.blockCode
            this.changeRoomList(param)
          }
             */
        } else {
          this.$dialog.alert('상세 예약 정보가 없습니다. <br />확인 후 다시 시도해 주세요.')
        }
      }
    },
    /** 버튼 클릭시 화면 비율 변경 */
    changeSize () {
      this.sizeFlag = !this.sizeFlag
      if (this.sizeFlag) { // detail이 넓은경우
        this.colList = 3
        this.colDetail = 9
        this.btnName = '축소'
        this.listHeight = this.isPartner ? '740' : '515'
      } else { // list가 넓은경우
        this.colList = 9
        this.colDetail = 3
        this.btnName = '확장'
        this.listHeight = this.isPartner ? '905' : '680'
      }
    },
    /** 엑셀 다운로드 */
    exportExcel () {
      if (this.rsvList.length > 0) {
        const searchParam = _.cloneDeep(this.searchParam)
        searchParam.q.checkInDate = _.join(searchParam.q.checkInDate, ',')
        searchParam.q.statusCode = _.join(searchParam.q.statusCode, ',')
        this.downLoadExcel('/api/cms/ota/booking/roomReservation/excel', '객실 예약 관리', searchParam)
      } else {
        this.$dialog.alert('다운로드할 예약이 없습니다.')
      }
    },
    /** 단축키 F11 예약번호 검색창으로 focus */
    focusRsv () {
      document.getElementById('rsvNo').focus()
    },
    /** 배경색 및 readonly 설정 */
    detailReset () {
      if (this.isPartner) {
        this.$refs.ptnrChild.allReset() // 디테일 화면 전부 readOnly 처리 & 배경색 제거
      } else {
        this.$refs.child.allReset() // 디테일 화면 전부 readOnly 처리 & 배경색 제거
      }
    },
    /** font size 변경 */
    changeFontSize (size) {
      this.selectedSize = size
    },
    /** 실제 이용자 연락처 조회 */
    async selectPhone (item) {
      const res = await roomService.selectRealGuestTelNo(item.keyRsvNo)
      item.guestTelNo = res.data.toString()
    }
  }
}
</script>
