<template>
  <div class="pa-0">
    <vue-tour :steps="steps"/>
    <app-card custom-classes="elevation-0">
      <template v-slot:heading>
        <div class="title font-weight-bold">객실 및 회원정보 {{ statusName }}</div>
        <v-spacer></v-spacer>
        <v-btn outlined rounded color="cyan" @click="changeSize">{{ btnName }}</v-btn>
      </template>
      <partner-rsv-detail-info ref="child" :work-status="workStatus" :room-type="roomType" :room-type-list="roomTypeList" :rsv-detail.sync="rsvDetail" @change-rsv-detail="changeRsvDetail($event)"/>
    </app-card>
    <app-card class="py-0" custom-classes="elevation-0">
      <v-row v-if="writeAuth">
        <v-col cols="10" align-self="center" class="pl-0 py-0">
          <v-btn outlined rounded color="green" class="my-1 px-1 room-step-0 package-step-0" @click="openChangeLogPopup">변경Log</v-btn>
          <v-btn outlined rounded color="blue" class="my-1 px-1 room-step-1 package-step-1" @click="getPartnerInfo('ROOM')">객실신규(Ctrl+F5)</v-btn>
          <v-btn outlined rounded color="blue" class="my-1 px-1 room-step-2 package-step-2" @click="getPartnerInfo('PKG')">패키지신규(Ctrl+F6)</v-btn>
          <v-btn outlined rounded color="green" class="my-1 px-1 room-step-3 package-step-3" @click="changeMemInfo" :disabled="rsvDetail.rsvState !== '예약'">고객정보변경</v-btn>
          <v-btn outlined rounded color="green" class="my-1 px-1 room-step-4 package-step-4" @click="changeRsvInfo" :disabled="rsvDetail.rsvState !== '예약'">예약정보변경</v-btn>
<!--          <v-btn outlined rounded color="green" class="my-1 px-1 room-step-5 package-step-5" @click="changeRsvType" :disabled="rsvDetail.rsvState !== '예약'">예약이관</v-btn>
          <v-btn outlined rounded color="green" class="my-1 px-1 room-step-6" v-if="roomType.value === 'OTA_ROOM_API'" @click="splitNights" :disabled="rsvDetail.rsvState !== '예약'">박수분리</v-btn>
          <v-btn outlined rounded color="green" class="my-1 px-1 room-step-7" v-if="roomType.value === 'OTA_ROOM_API'" @click="splitRoomCount" :disabled="rsvDetail.rsvState !== '예약'">실수분리</v-btn>-->
          <v-btn outlined rounded color="green" class="my-1 px-1 package-step-5" v-if="roomType.value === 'OTA_PKG_API'" @click="pkgTodayRsv">당일예약패키지</v-btn>
          <v-btn outlined rounded color="red" class="my-1 px-1 room-step-7 package-step-6" @click="openCancelPopup" :disabled="!(rsvDetail.rsvState === '예약' || rsvDetail.rsvState === '취소')">예약취소(F8)</v-btn>
        </v-col>
        <v-col cols="2" align-self="center" class="text-right pl-0 py-0">
          <v-btn outlined rounded color="purple" @click="showManual">매뉴얼</v-btn>
        </v-col>
      </v-row>
    </app-card>
  </div>
</template>

<script>
import PartnerRsvDetailInfo from '@/components/Ota/RoomReservation/Partner/PartnerRsvDetailInfo.vue'
import VueTour from '@/components/Common/VueTour.vue'

import partnerAccountService from '@/api/modules/system/authentication/partner/partnerAccount.service'
import roomService from '@/api/modules/ota/roomReservation.service'

import roomTypeService from '@/api/modules/ota/roomType.service'
import packageService from '@/api/modules/ota/package.service'

import { mapGetters } from 'vuex'

export default {
  components: { PartnerRsvDetailInfo, VueTour },
  props: {
    /**
     * 객실/패키지
     */
    roomType: {
      type: Object
    },
    /**
     * 객실/패키지 목록 리스트
     */
    roomTypeList: {
      type: Array
    },
    /**
     * 예약 상세 정보 객체
     */
    rsvDetail: {
      type: Object
    },
    /**
     * 확장/축소
     */
    btnName: {
      type: String
    },
    /**
     * 작업상태(ex: 기본, 조회, 신규, 수정)
     */
    workStatus: {
      type: String
    },
    /**
     * 파트너 기본정보
     */
    partnerInfo: {
      type: Object
    }
  },
  name: 'RoomReservationDetailWrapper',
  data () {
    return {
      ptnrBasicInfo: [], // 파트너 기본 정보
      isTodayRsvPkg: false, // 당일예약 패키지 여부
      statusName: '', // 신규/수정 관련해서 화면에 보여줄 텍스트
      path: 'partner',
      steps: [] // VueTour의 단계
    }
  },
  computed: {
    ...mapGetters({ user: 'auth/user' })
  },
  mounted () {
    this.allReset() // 상세화면쪽 전부 readonly 처리
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [
        {
          target: 'F2',
          multi: true,
          action: this.checkAllValidation
        },
        {
          target: 'F5',
          multi: true,
          action: this.getPartnerInfo,
          param: 'ROOM'
        },
        {
          target: 'F6',
          multi: true,
          action: this.getPartnerInfo,
          param: 'PKG'
        },
        {
          target: 'F8',
          action: this.openCancelPopup
        }
      ]
    })
  },
  methods: {
    /**
     * 매뉴얼 실행
     */
    showManual () {
      if (this.roomType.value === this.roomTypeList[0].value) { //  객실
        this.steps = [
          {
            target: '.room-step-0',
            content: '변경된 이력을 보는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.room-step-1',
            content: '새로운 객실 예약을 <br/> 생성하는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.room-step-2',
            content: '새로운 패키지 예약을 <br/> 생성하는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.room-step-3',
            content: '업체예약번호 및 이용자명, 이용자 <br/> 연락처를 변경하는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.room-step-4',
            content: '객실→패키지로의 예약이관을<br/> 하는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.room-step-5',
            content: '2박 이상의 예약을 각각 1박으로 <br/> 분리하는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.room-step-6',
            content: '2객실 이상의 예약을 각각 1객실로 <br/> 분리하는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.room-step-7',
            content: '현재의 예약을 취소하는 <br/> 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          }
        ]
      } else { // 패키지
        this.steps = [
          {
            target: '.package-step-0',
            content: '변경된 이력을 보는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.package-step-1',
            content: '새로운 객실 예약을 <br/> 생성하는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.package-step-2',
            content: '새로운 패키지 예약을 <br/> 생성하는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.package-step-3',
            content: '업체예약번호 및 이용자명, 이용자 <br/> 연락처를 변경하는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.package-step-4',
            content: '패키지→패키지, 패키지→객실로의 <br/> 예약이관을 하는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.package-step-5',
            content: '당일 예약이 가능한 패키지를 <br/> 예약하는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.package-step-6',
            content: '현재의 예약을 취소하는 <br/> 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          }
        ]
      }
      this.$nextTick(() => { this.$tours.myTour.start() })
    },
    /**
     * 확장/축소
     */
    changeSize () {
      this.$emit('change-size')
    },
    /**
     * 변경 Log 목록 조회
     */
    openChangeLogPopup () {
      // 예약 번호 필수
      if (this.rsvDetail.rsvNo) {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Ota/RoomReservation/popup/ChangeLogsPopup',
          params: {
            keyRsvNo: this.rsvDetail.keyRsvNo
          },
          options: {
            fullscreen: false,
            scrollable: true,
            width: 800
          }
        })
      } else {
        this.$dialog.alert('변경 Log를 조회할 예약이 존재하지 않습니다.')
      }
    },
    /**
     * 예약이관
     */
    /* changeRsvType () {
      // 예약 번호 필수
      if (this.rsvDetail.rsvNo) {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Ota/RoomReservation/popup/RsvTypeChangePopup',
          params: {
            item: this.rsvDetail
          },
          options: {
            fullscreen: false,
            scrollable: true,
            width: 900,
            closeCallback: (params) => {
              if (params && params.data) {
                const rsvInfo = {}
                rsvInfo.keyRsvNo = this.rsvDetail.keyRsvNo
                rsvInfo.guestName = params.data.guestName
                rsvInfo.smsPhone = params.data.smsPhone
                rsvInfo.partnerRsvNo = params.data.partnerRsvNo
                rsvInfo.loginId = this.user.number
                rsvInfo.agentCode = params.data.agentCode
                if (params.data.memberNo) {
                  rsvInfo.memberNo = params.data.memberNo
                  this.rsvChangeToRoom(this.path, rsvInfo)
                } else {
                  rsvInfo.packageNo = params.data.packageNo
                  this.rsvChangeToPkg(this.path, rsvInfo)
                }
              }
            }
          }
        })
      } else {
        this.$dialog.alert('이관할 예약이 존재하지 않습니다.')
      }
    }, */
    /**
     * 객실로 예약 이관 실행
     */
    /* async rsvChangeToRoom (path, rsvInfo) {
      const res = await roomService.updateRsvChangeToRoom(path, rsvInfo)
      if (res.data.guestRsvNo) {
        console.log(`예약번호: ${res.data.guestRsvNo},  ${res.data.partnerRsvNo}`)
        this.$dialog.alert(`예약번호: ${res.data.guestRsvNo}`)
        this.$emit('show-detail', this.rsvDetail)
      } else {
        this.$dialog.alert(res.data.resultMsg)
      }
    }, */
    /**
     * 패키지로 예약 이관 실행
     */
    /* async rsvChangeToPkg (path, rsvInfo) {
      const res = await roomService.updateRsvChangeToPkg(path, rsvInfo)
      if (res.data.guestRsvNo) {
        console.log(`예약번호: ${res.data.guestRsvNo},  ${res.data.partnerRsvNo}`)
        this.$dialog.alert(`예약번호: ${res.data.guestRsvNo}`)
        this.$emit('show-detail', this.rsvDetail)
      } else {
        this.$dialog.alert(res.data.resultMsg)
      }
    }, */
    /**
     * 실수분리
     */
    /* async splitRoomCount () {
      // 예약 번호 필수
      if (this.rsvDetail.rsvNo) {
        // 객실인 경우에만 실수분리 가능
        if (this.roomType.value === 'OTA_ROOM_API') {
          const confirm = await this.$dialog.confirm('객실수분리를 선택하셨습니다. 계속 진행하시겠습니까?')
          if (confirm) {
            // 실수분리는 2실 이상인 경우만 가능
            if (this.rsvDetail.roomCount < 2) {
              this.$dialog.alert('실수분리는 2실 이상 예약에서만 가능합니다.')
            } else {
              // 실수분리 로직 실행
              const res = await roomService.splitRoomCount(this.path, this.rsvDetail.keyRsvNo)
              if (res.data && res.data.length > 0) {
                let rsvList = '신규예약번호 : '
                for (const one of res.data) {
                  rsvList = rsvList + one.guestRsvNo + ', '
                }
                this.$dialog.alert(rsvList)
                this.$emit('show-detail', this.rsvDetail)
              } else {
                this.$dialog.alert('실수분리에 실패 하였습니다.')
              }
            }
          }
        } else {
          this.$dialog.alert('실수분리는 룸온리에서만 가능합니다.')
        }
      } else {
        this.$dialog.alert('실수분리할 예약이 존재하지 않습니다.')
      }
    }, */
    /**
     * 박수분리
     */
    /* async splitNights () {
      // 예약 번호 필수
      if (this.rsvDetail.rsvNo) {
        // 객실인 경우에만 박수분리 가능
        if (this.roomType.value === 'OTA_ROOM_API') {
          const confirm = await this.$dialog.confirm('박수분리를 선택하셨습니다. 계속 진행하시겠습니까?')
          if (confirm) {
            // 실수분리는 2실 이상인 경우만 가능
            if (this.rsvDetail.nights < 2) {
              this.$dialog.alert('박수분리는 2박 이상 예약에서만 가능합니다.')
            } else {
              // 박수분리 로직 실행
              const res = await roomService.splitNights(this.path, this.rsvDetail.keyRsvNo)
              if (res.data && res.data.length > 0) {
                let rsvList = '신규예약번호 : '
                for (const one of res.data) {
                  rsvList = rsvList + one.guestRsvNo + ', '
                }
                this.$dialog.alert(rsvList)
                this.$emit('show-detail', this.rsvDetail)
              } else {
                this.$dialog.alert('박수분리에 실패 하였습니다.')
              }
            }
          }
        } else {
          this.$dialog.alert('박수분리는 룸온리에서만 가능합니다.')
        }
      } else {
        this.$dialog.alert('박수분리할 예약이 존재하지 않습니다.')
      }
    }, */
    /**
     * 패키지 당일 예약
     */
    pkgTodayRsv () {
      this.isTodayRsvPkg = true
      this.getPartnerInfo()
    },
    /**
     * 패키지 당일 예약 팝업 오픈
     */
    openPkgTodayRsv () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/RoomReservation/popup/TodayRsvPkgPopup',
        params: {
          ptnrBasicInfo: this.ptnrBasicInfo
        },
        options: {
          fullscreen: false,
          scrollable: false,
          width: 1500
        }
      })
    },
    /**
     * 예약취소 팝업 오픈
     */
    openCancelPopup () {
      // 예약 번호 필수
      if (this.rsvDetail.rsvNo) {
        // 예약 취소
        if (this.rsvDetail.rsvState === '예약') {
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
        // 취소 사유 변경(현재는 취소 상태일때 버튼이 보이지 않도록 처리해 둠.)
        } else if (this.rsvDetail.rsvState === '취소') {
          this.$store.dispatch('dialog/open', {
            componentPath: '/Ota/RoomReservation/popup/CancelResnChangePopup',
            params: {
              originInfo: this.rsvDetail
            },
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
        }
      } else {
        this.$dialog.alert('취소할 예약이 존재하지 않습니다.')
      }
    },
    /**
     * 취소 사유 변경
     */
    async updateCancelResn (cancelReason) {
      // 예약 번호 필수
      if (this.rsvDetail.rsvNo) {
        const param = {}
        param.keyRsvNo = this.rsvDetail.keyRsvNo
        param.keySeq = this.rsvDetail.keySeq
        param.cancelResnCode = cancelReason.cancelResnCode
        param.cancelResnDesc = cancelReason.cancelResnDesc
        param.modifyId = this.user.number // 수정자
        // 취소 사유 변경
        const res = await roomService.updateCancelResn(param)
        if (res.data.result === '0') {
          this.$dialog.alert('정상적으로 수정되었습니다.')
          this.$emit('show-detail', this.rsvDetail)
        } else {
          this.$dialog.alert(res.data.resultMsg)
        }
      }
    },
    /**
     * 실제 예약 취소
     */
    async rsvCancel (cancelReason) {
      // 예약 번호 필수
      if (this.rsvDetail.rsvNo) {
        const param = {}
        param.keyRsvNo = this.rsvDetail.keyRsvNo
        param.cancelResnCode = cancelReason.cancelResnCode
        param.cancelResnDesc = cancelReason.cancelResnDesc
        param.modifyId = this.user.number // 수정자
        if (this.roomType.value === 'OTA_ROOM_API') { // 객실
          param.memberNo = this.rsvDetail.memberNo
          // 객실 예약 취소
          const res = await roomService.cancelRoomRsv(this.path, param)
          if (res.data.resultCode === '0000') {
            this.$dialog.alert('정상적으로 취소되었습니다.')
            this.$emit('show-detail', this.rsvDetail)
            this.$emit('search')
          } else {
            this.$dialog.alert(res.data.resultMsg)
          }
        } else { // 패키지
          param.agentCode = this.rsvDetail.agentCode
          // 패키지 예약 취소
          const res = await roomService.cancelPkgRsv(this.path, param)
          if (res.data.resultCode === '0000') {
            this.$dialog.alert('정상적으로 취소되었습니다.')
            this.$emit('show-detail', this.rsvDetail)
            this.$emit('search')
          } else {
            this.$dialog.alert(res.data.resultMsg)
          }
        }
      }
    },
    /**
     * 파트너 관련 정보 조회
     */
    async getPartnerInfo (roomType) {
      const param = {}
      param.taskType = this.roomType.value
      param.partnerSeq = this.user.number
      const res = await partnerAccountService.selectPtnrInfoForRsv(param)
      this.ptnrBasicInfo = res.data
      if (this.isTodayRsvPkg) {
        this.openPkgTodayRsv() // 당일예약 패키지 오픈
      } else {
        if (roomType === 'ROOM') {
          await this.openNewRoomRsvPopup() // 객실 신규 팝업 오픈
        } else if (roomType === 'PKG') {
          await this.openNewPkgRsvPopup() // 패키지 신규 팝업 오픈
        }
      }
      this.isTodayRsvPkg = false
    },
    /**
     * 객실 신규 예약 팝업 오픈
     */
    async openNewRoomRsvPopup () {
      await this.$emit('select-type', 'ROOM') // roomType값 변경
      this.changeRsvDetail({}) // rsvDetail 초기화
      await this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/RoomReservation/Partner/PartnerNewRoomRsvPopup',
        params: {
          roomType: this.roomType,
          partnerInfo: this.partnerInfo
        },
        options: {
          fullscreen: false,
          scrollable: false,
          width: 1500
        }
      })
    },
    /**
     * 패키지 신규 예약 팝업 오픈
     */
    async openNewPkgRsvPopup () {
      await this.$emit('select-type', 'PKG') // roomType값 변경
      this.changeRsvDetail({}) // rsvDetail 초기화
      await this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/RoomReservation/Partner/PartnerNewPackageRsvPopup',
        params: {
          roomType: this.roomType,
          ptnrBasicInfo: this.ptnrBasicInfo
        },
        options: {
          fullscreen: false,
          scrollable: false,
          width: 1500
        }
      })
    },
    /**
     * 고객정보 변경(수정)
     */
    changeMemInfo () {
      // 예약 번호 필수
      if (this.rsvDetail.rsvNo) {
        const origin = {}
        origin.partnerRsvNo = this.rsvDetail.partnerRsvNo // 업체예약번호
        origin.guestName = this.rsvDetail.guestName
        origin.smsPhone = this.rsvDetail.smsPhone
        this.$store.dispatch('dialog/open', {
          componentPath: '/Ota/RoomReservation/popup/MemInfoChangePopup',
          params: {
            origin: origin
          },
          options: {
            fullscreen: false,
            scrollable: false,
            width: 800,
            closeCallback: (params) => {
              if (params && params.data) {
                // 총합계가 0원 일때
                if (this.rsvDetail.partnerRsvPrice === '0') {
                  const rsvInfoCopy = _.cloneDeep(this.rsvDetail)
                  if (params.data.smsPhone) {
                    rsvInfoCopy.smsPhone = params.data.smsPhone
                  }
                  if (params.data.guestLnm) {
                    rsvInfoCopy.guestName = params.data.guestLnm
                  }
                  if (params.data.partnerRsvNo) {
                    rsvInfoCopy.partnerRsvNo = params.data.partnerRsvNo
                  }
                  this.updateRsvInfo(rsvInfoCopy)
                } else {
                  const param = {}
                  if (this.rsvDetail.keyRsvNo) {
                    param.keyRsvNo = this.rsvDetail.keyRsvNo
                  } else {
                    this.$dialog.alert('key예약번호는 필수값입니다. 다시 시도해주세요')
                    return
                  }
                  if (params.data.partnerRsvNo) {
                    param.partnerRsvNo = params.data.partnerRsvNo
                  }
                  if (params.data.guestLnm) {
                    param.guestLnm = params.data.guestLnm
                  } else {
                    this.$dialog.alert('이용자명은 필수값입니다. 다시 시도해주세요')
                    return
                  }
                  if (params.data.smsPhone) {
                    param.smsPhone = params.data.smsPhone
                  }
                  const paramCheck = Boolean(param.keyRsvNo && param.smsPhone && param.guestLnm)
                  if (paramCheck) { // 필수값이 다 있는 경우
                    // 고객 정보 변경 실행
                    this.updateGuestInfo(param)
                  }
                }
              }
            }
          }
        })
      } else {
        this.$dialog.alert('변경할 예약이 존재하지 않습니다.')
      }
    },
    /**
     * 실제 고객 정보 변경 로직 실행
     */
    async updateGuestInfo (param) {
      const res = await roomService.updateGuestInfo(param)
      if (res.data.result === '0') {
        this.$dialog.alert('성공적으로 수정되었습니다.')
        this.$emit('show-detail', this.rsvDetail)
      } else {
        this.$dialog.alert('문제가 발생했습니다. 다시 시도해 주세요.')
      }
    },
    /**
     * 객실료가 0원 일 때, 실제 고객 정보 변경 로직 실행
     */
    async updateRsvInfo (item) {
      const rsvInfo = {}
      rsvInfo.modifyId = this.user.number
      rsvInfo.guestName = item.guestName // 이용자명
      rsvInfo.guestTelNo = item.smsPhone // 이용자 연락처
      rsvInfo.keyRsvNo = item.keyRsvNo // key예약번호(수정시에만)
      rsvInfo.partnerRsvNo = item.partnerRsvNo// 업체 예약번호(주문번호)
      rsvInfo.storeCode = item.storeCode
      rsvInfo.checkInDate = item.checkInDate
      rsvInfo.roomTypeCode = item.roomTypeCode
      rsvInfo.adultCount = item.adultCount
      rsvInfo.childCount = item.childCount
      rsvInfo.blockCode = item.blockCode
      rsvInfo.agentCode = item.agentCode
      rsvInfo.partnerName = item.partnerName// 예약자명(예약파트너명)
      rsvInfo.partnerTelNo = item.partnerTelNo // 예약자 연락처
      rsvInfo.partnerRsvPrice = item.partnerRsvPrice // 총합계
      // 객실
      if (item.memberNo) {
        rsvInfo.memberNo = item.memberNo
        rsvInfo.nights = item.nights
        rsvInfo.roomCount = item.roomCount
        const res = await roomService.updateRoomRsvInfo(this.path, rsvInfo)
        if (res.data.resultCode === '0000') {
          this.$dialog.alert('성공적으로 수정되었습니다.')
          this.$emit('show-detail', item)
        } else {
          this.$dialog.alert(res.data.resultMsg)
        }
      } else { // 패키지
        rsvInfo.packageNo = item.packageNo
        const res = await roomService.updatePackageRsvInfo(this.path, rsvInfo)
        if (res.data.resultCode === '0000') {
          this.$dialog.alert('성공적으로 수정되었습니다.')
          this.$emit('show-detail', item)
        } else {
          this.$dialog.alert(res.data.resultMsg)
        }
      }
    },
    /**
     * 예약 정보 변경(수정)
     */
    changeRsvInfo () {
      // 예약 번호 필수
      if (this.rsvDetail.rsvNo) {
        const origin = {}
        origin.partnerRsvNo = this.rsvDetail.partnerRsvNo // 업체예약번호
        origin.guestName = this.rsvDetail.guestName // 이용자명
        origin.guestTelNo = this.rsvDetail.smsPhone // 이용자연락처
        origin.memberNo = this.rsvDetail.memberNo // 회원번호
        origin.memberName = this.rsvDetail.memberName // 회원명
        origin.packageNo = this.rsvDetail.packageNo // 패키지번호
        origin.packageName = this.rsvDetail.packageName // 패키지명
        origin.storeCode = this.rsvDetail.storeCode // 영업장코드
        origin.storeName = this.rsvDetail.storeName // 영업장명
        origin.roomTypeCode = this.rsvDetail.roomTypeCode // 객실유형코드
        origin.roomTypeName = this.rsvDetail.roomTypeName // 객실유형명
        origin.roomType = this.roomType.value // 타입

        this.$store.dispatch('dialog/open', {
          componentPath: '/Ota/RoomReservation/popup/RsvInfoChangePopup',
          params: {
            origin: origin
          },
          options: {
            fullscreen: false,
            scrollable: false,
            width: 800,
            closeCallback: (params) => {
              if (params && params.data) {
                const rsvInfoCopy = _.cloneDeep(this.rsvDetail)
                this.getBlockCode(rsvInfoCopy, params)
              }
            }
          }
        })
      } else {
        this.$dialog.alert('변경할 예약이 존재하지 않습니다.')
      }
    },
    /**
     * 객실/패키지 정보 내 예약블럭 조회
     */
    async getBlockCode (rsvInfoCopy, params) {
      if (params.data.roomTypeCode) {
        rsvInfoCopy.roomTypeCode = params.data.roomTypeCode
      }
      if (params.data.partnerRsvNo) {
        rsvInfoCopy.partnerRsvNo = params.data.partnerRsvNo
      }
      if (params.data.guestName) {
        rsvInfoCopy.guestName = params.data.guestName
      }
      if (params.data.smsPhone) {
        rsvInfoCopy.smsPhone = params.data.smsPhone
      }
      if (rsvInfoCopy.blockCode === '104') {
        // 104 → 기본블럭으로 변경
        if (rsvInfoCopy.memberNo) { // 객실
          const res = await roomTypeService.selectRoomTypeInformationPartner(rsvInfoCopy.storeCode, this.user.number)
          rsvInfoCopy.blockCode = res.data.blockCode
        } else { // 패키지
          const res = await packageService.selectRoomPackageInformation(rsvInfoCopy.packageNo)
          rsvInfoCopy.blockCode = res.data.blockCode
        }
      }
      // 파트너사의 경우 104블럭으로 예약정보변경 불가
      if (rsvInfoCopy.blockCode === '104' || rsvInfoCopy.blockCode === '') {
        this.$dialog.alert('변경에 실패하였습니다. (예약블럭 조회 실패)')
        return
      }
      this.updateRsvInfo(rsvInfoCopy)
    },
    /**
     * 디테일 화면 readOnly
     */
    allReset () {
      this.statusName = ''
      this.$emit('change-work-status', '')
    },
    /**
     * rsvDetail 내용 수정
     */
    changeRsvDetail (rsvDetail) {
      this.$emit('update:rsv-detail', rsvDetail)
    }
  }
}
</script>
