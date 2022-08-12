<template>
  <div>
    <vue-tour :steps="steps"/>
    <app-card custom-classes="elevation-0">
      <template v-slot:heading>
        <div class="title font-weight-bold">객실 및 회원정보 {{ statusName }}</div>
        <v-spacer/>
        <v-btn outlined rounded color="cyan" @click="changeSize">{{ btnName }}</v-btn>
      </template>
      <rsv-detail-info ref="child" :room-type="roomType" :room-type-list="roomTypeList"
                       :rsv-detail.sync="rsvDetail" :group-flag="groupFlag" @change-group-flag="changeGroupFlag"
                       @change-rm-list="changeRmList($event)" @change-rsv-detail="changeRsvDetail($event)"/>
    </app-card>
    <app-card custom-classes="elevation-0">
      <v-row v-if="writeAuth">
        <v-col cols="8" align-self="center" class="pl-0 py-0">
          <v-btn outlined rounded color="green" class="my-1 px-1 room-step-0 package-step-0"
                 @click="openChangeLogPopup">변경Log
          </v-btn>
          <!--                    <v-btn outlined rounded color="blue" class="my-1 px-1 room-step-1 package-step-1" @click="makeNew">신규(Ctrl+F5)</v-btn>-->
          <v-btn outlined rounded color="blue" class="my-1 px-1 room-step-1 package-step-9"
                 @click="getPartnerInfo('ROOM')">객실 신규
          </v-btn>
          <v-btn outlined rounded color="blue" class="my-1 px-1 room-step-11 package-step-10"
                 @click="getPartnerInfo('PKG')">패키지 신규
          </v-btn>
          <v-btn outlined rounded color="green" class="my-1 px-1 room-step-2 package-step-2" @click="changeMemInfo"
                 :disabled="rsvDetail.rsvState !== '예약' || (!rsvDetail.packageName && !rsvDetail.partnerName)">
            고객정보변경
          </v-btn>
<!--          <v-btn outlined rounded color="green" class="my-1 px-1 room-step-3 package-step-3" @click="changeRsvInfo"
                 :disabled="rsvDetail.rsvState !== '예약' || (!rsvDetail.packageName && !rsvDetail.partnerName) || rsvDetail.totalPrice === '0'">
            예약정보변경
          </v-btn>-->
          <!--                    <v-btn outlined rounded color="green" class="my-1 px-1 room-step-4 package-step-4"
                                     @click="changeRsvType"
                                     :disabled="rsvDetail.rsvState !== '예약' || (!rsvDetail.packageName && !rsvDetail.partnerName)">예약이관
                              </v-btn>
                              <v-btn outlined rounded color="green" class="my-1 px-1 room-step-5"
                                     v-if="roomType.value === 'OTA_ROOM_API'" @click="splitNights"
                                     :disabled="rsvDetail.rsvState !== '예약'">박수분리
                              </v-btn>
                              <v-btn outlined rounded color="green" class="my-1 px-1 room-step-6"
                                     v-if="roomType.value === 'OTA_ROOM_API'" @click="splitRoomCount"
                                     :disabled="rsvDetail.rsvState !== '예약'">실수분리
                              </v-btn>-->
          <v-btn outlined rounded color="green" class="my-1 px-1 package-step-5"
                 v-if="roomType.value === 'OTA_PKG_API'" @click="pkgTodayRsv"
                 :disabled="(!rsvDetail.packageName && !rsvDetail.partnerName) || groupFlag === 'naver'">
            당일예약패키지
          </v-btn>
<!--          <v-btn outlined rounded color="blue" class="my-1 px-1 room-step-7 package-step-6"
                 @click="checkAllValidation" :disabled="workStatus === '' || workStatus === 'detail'">
            저장(Ctrl+F2)
          </v-btn>-->
          <v-btn outlined rounded color="green" class="my-1 px-1 room-step-8 package-step-7"
                 @click="copyPopup"
                 :disabled="(!rsvDetail.packageName && !rsvDetail.partnerName) || groupFlag === 'naver'">복사(F7)
          </v-btn>
          <v-btn outlined rounded color="red" class="my-1 px-1 room-step-9 package-step-8"
                 @click="openCancelPopup"
                 :disabled="!(rsvDetail.rsvState === '예약' || rsvDetail.rsvState === '취소')">예약취소(F8)
          </v-btn>
        </v-col>
        <v-col cols="4" align-self="center" class="text-right pl-0 py-0">
          <v-btn outlined rounded color="purple" @click="showManual">매뉴얼</v-btn>
          <v-btn outlined rounded color="orange" class="my-1 px-1 room-step-12 package-step-11"
                 @click="checkAllInventory">전지역객실현황
          </v-btn>
        </v-col>
      </v-row>
    </app-card>
  </div>
</template>

<script>
import RsvDetailInfo from '@/components/Ota/RoomReservation/RsvDetailInfo.vue'

import VueTour from '@/components/Common/VueTour.vue'
import { mapGetters } from 'vuex'

import roomService from '@/api/modules/ota/roomReservation.service'
import pmsStockPriceService from '@/api/modules/pms/stockPrice.service'
import roomTypeService from '@/api/modules/ota/roomType.service'
import packageService from '@/api/modules/ota/package.service'

export default {
  components: {
    RsvDetailInfo,
    VueTour
  },
  props: {
    /** 객실/패키지 */
    roomType: {
      type: Object
    },
    /** 객실/패키지 목록 리스트 */
    roomTypeList: {
      type: Array
    },
    /** 예약 상세 정보 객체 */
    rsvDetail: {
      type: Object
    },
    /** 확장/축소 */
    btnName: {
      type: String
    }
  },
  name: 'RoomReservationDetailWrapper',
  data () {
    return {
      isChange: false, // 변경 Flag
      statusName: '', // 신규/수정 관련해서 화면에 보여줄 텍스트
      path: 'system',
      steps: [], // VueTour의 단계
      groupFlag: 'ota' // OTA인지 NAVER인지 구분값
    }
  },
  computed: {
    ...mapGetters({ user: 'auth/user' })
  },
  mounted () {
    this.allReset() // 상세화면쪽 전부 readonly 처리
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [
        /* {
          target: 'F2',
          multi: true,
          action: this.checkAllValidation
        }, */
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
          target: 'F7',
          action: this.copyPopup
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
            content: '새로운 예약을 생성하는 <br/> 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.room-step-2',
            content: '업체예약번호 및 이용자명, 이용자 <br/> 연락처를 변경하는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
        /*
          {
            target: '.room-step-3',
            content: '예약과 관련된 정보를 <br/> 변경하는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.room-step-4',
            content: '예약을 저장하는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
             */
          {
            target: '.room-step-8',
            content: '현재의 예약과 같은 내용의 <br/> 신규 예약을 생성하는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.room-step-9',
            content: '현재의 예약을 취소하는 <br/> 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
        /*
          {
            target: '.room-step-7',
            content: '파트너가 보는 객실 예약 <br/> 화면입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.room-step-8',
            content: '파트너가 보는 패키지 예약 <br/> 화면입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.room-step-9',
            content: '전 지역의 객실 현황을 <br/> 볼 수 있는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          }
             */
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
            content: '새로운 예약을 생성하는 <br/> 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.package-step-2',
            content: '업체예약번호 및 이용자명, 이용자 <br/> 연락처를 변경하는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.package-step-3',
            content: '예약과 관련된 정보를 <br/> 변경하는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.package-step-4',
            content: '당일 예약이 가능한 패키지를 <br/> 예약하는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.package-step-5',
            content: '예약을 저장하는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.package-step-6',
            content: '현재의 예약과 같은 내용의 <br/> 신규 예약을 생성하는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.package-step-7',
            content: '현재의 예약을 취소하는 <br/> 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.package-step-8',
            content: '파트너가 보는 객실 예약 <br/> 화면입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.package-step-9',
            content: '파트너가 보는 패키지 예약 <br/> 화면입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          },
          {
            target: '.package-step-10',
            content: '전 지역의 객실 현황을 <br/> 보는 버튼입니다.',
            params: {
              placement: 'top',
              enableScrolling: false
            }
          }
        ]
      }
      this.$nextTick(() => {
        this.$tours.myTour.start()
      })
    },
    /**
     * 유효성 검사
     */
    /* async checkAllValidation () {
      await this.$refs.child.checkValidation()
      // 패키지인 경우 agentCode 필수 확인
      if (this.roomType.value === 'OTA_PKG_API' && !this.rsvDetail.agentCode) {
        this.$dialog.alert('agent 코드는 필수입니다.')
      } else {
        this.preSave(this.rsvDetail)
      }
    }, */
    /**
     * groupFlag 변경
     */
    changeGroupFlag (flag) {
      if (flag) {
        this.groupFlag = flag
      }
      this.statusName = '- 신규(' + this.groupFlag + ')'
    },
    /**
     * 잔여 객실 현황 파라미터 전달
     */
    changeRmList (param) {
      this.$emit('change-rm-list', param)
    },
    /**
     * 전지역 객실 현황
     */
    checkAllInventory () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/InventorySearch',
        params: {},
        options: {
          fullscreen: false,
          scrollable: true,
          width: 1200
        }
      })
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
                rsvInfo.guestTelNo = params.data.guestTelNo
                rsvInfo.partnerRsvNo = params.data.partnerRsvNo
                rsvInfo.loginId = this.user.number
                rsvInfo.agentCode = params.data.agentCode
                // 객실
                if (params.data.memberNo) {
                  rsvInfo.memberNo = params.data.memberNo
                  this.rsvChangeToRoom(this.path, rsvInfo)
                } else { // 패키지
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
            // 박수분리는 2박 이상인 경우만 가능
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
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/RoomReservation/popup/TodayRsvPkgPopup',
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
        // 예약 취소 팝업
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
          // 취소 사유 변경 팝업
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
     * 복사 화면 오픈
     */
    copyPopup () {
      // 예약 번호 필수
      if (this.rsvDetail.rsvNo) {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Ota/RoomReservation/popup/CopyPopup',
          params: {
            item: this.rsvDetail
          },
          options: {
            fullscreen: false,
            scrollable: false,
            width: 800,
            closeCallback: (params) => {
              if (params && params.data) {
                if (this.rsvDetail.memberNo) { // 객실
                  if (params.data.memberNo) {
                    params.data.rsvNo = ''
                    this.preSave(params.data)
                  } else {
                    this.$dialog.alert('회원번호는 필수입니다.')
                  }
                } else { // 패키지
                  if (params.data.agentCode) {
                    params.data.rsvNo = ''
                    this.preSave(params.data)
                  } else {
                    this.$dialog.alert('Agent 코드는 필수입니다.')
                  }
                }
              }
            }
          }
        })
      } else {
        this.$dialog.alert('복사할 예약이 존재하지 않습니다.')
      }
    },
    /**
     * 예약 및 수정사항 저장 시 인증확인
     */
    preSave (item) {
      this.$dialog.confirm('개인 정보 수집에 동의하시겠습니까?').then(() => {
        this.save(item)
        // 인증을 위한 4자리 숫자 생성
        // const authNo = Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111
        // this.$store.dispatch('dialog/open', {
        //   componentPath: '/Ota/RoomReservation/popup/SimpleAuthPopup',
        //   params: {
        //     authNo: authNo
        //   },
        //   options: {
        //     fullscreen: false,
        //     scrollable: true,
        //     width: 600,
        //     closeCallback: (params) => {
        //       if (params && params.data) {
        //         // 인증번호와 입력받은 값이 같은 경우에만 저장 로직 실행
        //         if (params.data && params.data === authNo.toString()) {
        //           this.save(item)
        //         } else {
        //           this.$dialog.alert('인증번호를 잘못 입력하셨습니다. 다시 시도해주세요.')
        //         }
        //       }
        //     }
        //   }
        // })
      })
    },
    /**
     * 예약 및 수정을 위한 기본 파라미터 세팅
     */
    setRsvParams (item) {
      const rsvInfo = {}
      rsvInfo.modifyId = this.user.number
      rsvInfo.guestName = item.guestName // 이용자명
      rsvInfo.guestTelNo = item.guestTelNo // 이용자 연락처
      rsvInfo.partnerRsvNo = item.partnerRsvNo // 업체 예약번호(주문번호)
      rsvInfo.storeCode = item.storeCode
      rsvInfo.checkInDate = item.checkInDate
      rsvInfo.roomTypeCode = item.roomTypeCode
      rsvInfo.adultCount = item.adultCount
      rsvInfo.childCount = item.childCount
      rsvInfo.blockCode = item.blockCode
      rsvInfo.agentCode = item.agentCode
      rsvInfo.partnerName = item.partnerName// 예약자명(예약파트너명)
      rsvInfo.partnerRsvPrice = item.partnerRsvPrice // 총합계
      return rsvInfo
    },
    /**
     * 예약 및 수정사항 저장
     */
    async save (item) {
      // TODO 유효성검사 필요
      if (!item.rsvNo) { // 신규
        const rsvInfo = this.setRsvParams(item)
        rsvInfo.partnerSeq = item.partnerSeq // 예치금에 필요
        rsvInfo.termSeq = item.termSeq // 예치금에 필요
        rsvInfo.partnerTelNo = item.partnerTelNo // 예약자 연락처
        rsvInfo.nights = item.nights
        rsvInfo.roomCount = item.roomCount
        if (item.memberNo) { // 객실
          rsvInfo.memberNo = item.memberNo
          // 재고 확인을 위한 정보 조회
          const infoRes = await roomTypeService.selectRoomTypeInformation(rsvInfo.storeCode)
          rsvInfo.searchDayCount = rsvInfo.nights
          rsvInfo.todayRsvYn = infoRes.data.todayRsvYn
          rsvInfo.todayRsvTime = infoRes.data.todayRsvTime
          rsvInfo.roomTypeCode = Array(item.roomTypeCode)
          // 재고 조회
          const inventoryRes = await pmsStockPriceService.checkRoomLeaveCount(rsvInfo)
          rsvInfo.roomTypeCode = item.roomTypeCode
          let flag = true
          // 각 날짜별 재고 확인
          for (const oneRes of inventoryRes.data) {
            if (oneRes.leaveCount < 0) {
              const confirm = await this.$dialog.confirm('예약자권한으로 예약하시겠습니까?')
              if (confirm) {
                // 객실 예약 실행
                this.insertNewRoomRsv(item, rsvInfo)
                flag = false
              }
              break
            }
          }
          // 재고가 0 이하인 날이 없는 경우
          if (flag) {
            // 객실 예약 실행
            this.insertNewRoomRsv(item, rsvInfo)
          }
        } else { // 패키지
          rsvInfo.packageNo = item.packageNo
          rsvInfo.searchDayCount = rsvInfo.nights
          rsvInfo.roomTypeCode = Array(item.roomTypeCode)
          if (this.groupFlag === 'naver') {
            this.path = 'naver'
            rsvInfo.todayRsvYn = 'Y'
            rsvInfo.todayRsvTime = moment().format('hhmm')
          } else {
            // 재고 확인을 위한 정보 조회
            const infoRes = await packageService.selectRoomPackageInformation(rsvInfo.packageNo)
            rsvInfo.todayRsvYn = infoRes.data.todayRsvYn
            rsvInfo.todayRsvTime = infoRes.data.todayRsvTime
          }
          // 재고 조회
          const inventoryRes = await pmsStockPriceService.checkPackageLeaveCount(rsvInfo)
          rsvInfo.roomTypeCode = item.roomTypeCode
          let flag = true
          // 각 날짜별 재고 확인
          for (const oneRes of inventoryRes.data) {
            if (oneRes.leaveCount < 0) {
              const confirm = await this.$dialog.confirm('예약자권한으로 예약하시겠습니까?')
              if (confirm) {
                // 객실 예약 실행
                this.insertNewPackgeRsv(item, rsvInfo)
                flag = false
              }
              break
            }
          }
          // 재고가 0 이하인 날이 없는 경우
          if (flag) {
            this.insertNewPackgeRsv(item, rsvInfo)
          }
        }
        this.groupFlag = 'ota'
      } else { // 수정
        this.updateRsvInfo(this.rsvDetail)
      }
    },
    /**
     * 객실 예약
     */
    async insertNewRoomRsv (item, rsvInfo) {
      // 객실 예약 등록
      const res = await roomService.insertRoomNewRsv(this.path, rsvInfo)
      if (res.data.resultMsg === 'SUCCESS') {
        console.log(`예약번호: ${res.data.guestRsvNo},  ${res.data.partnerRsvNo}`)
        this.$dialog.alert(`예약번호: ${res.data.guestRsvNo}`)
        this.$emit('show-detail', item)
        this.allReset()
      } else if (res.data.resultMsg === undefined) {
        this.$dialog.alert('예약시 문제가 발생했습니다. 다시 시도해 주세요.')
      } else {
        this.$dialog.alert(res.data.resultMsg)
      }
    },
    /**
     * 패키지 예약
     */
    async insertNewPackgeRsv (item, rsvInfo) {
      // 패키지 예약 등록
      const res = await roomService.insertPkgNewRsv(this.path, rsvInfo)
      if (res.data.resultMsg === 'SUCCESS') {
        console.log(`예약번호: ${res.data.guestRsvNo},  ${res.data.partnerRsvNo}`)
        this.$dialog.alert(`예약번호: ${res.data.guestRsvNo}`)
        this.$emit('show-detail', item)
        this.allReset()
      } else if (res.data.resultMsg === undefined) {
        this.$dialog.alert('예약시 문제가 발생했습니다. 다시 시도해 주세요.')
      } else {
        this.$dialog.alert(res.data.resultMsg)
      }
    },
    /**
     * 신규
     */
    /* makeNew () {
      this.statusName = '- 신규(ota)'
      this.$emit('system-new-rsv')
      this.$emit('change-work-status', 'new')
      // 신규 버튼 클릭 시 기본값 세팅
      const rsvDetail = {}
      rsvDetail.checkInDate = moment().format('YYYYMMDD')
      rsvDetail.checkOutDate = moment().add(1, 'days').format('YYYYMMDD')
      rsvDetail.nights = 1
      rsvDetail.roomCount = 1
      rsvDetail.adultCount = 1
      rsvDetail.childCount = 0
      rsvDetail.rsvState = ''
      this.changeRsvDetail(rsvDetail)
    }, */
    /**
     * 고객정보 변경(수정)
     */
    changeMemInfo () {
      // 예약 번호 필수
      if (this.rsvDetail.rsvNo) {
        const origin = {}
        origin.partnerRsvNo = this.rsvDetail.partnerRsvNo // 업체예약번호
        origin.guestName = this.rsvDetail.guestName
        origin.guestTelNo = this.rsvDetail.guestTelNo
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
                if (this.rsvDetail.totalPrice === '0') {
                  const rsvInfoCopy = _.cloneDeep(this.rsvDetail)
                  if (params.data.guestTelNo) {
                    rsvInfoCopy.guestTelNo = params.data.guestTelNo
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
                  if (params.data.guestTelNo) {
                    param.guestTelNo = params.data.guestTelNo
                  }
                  // 필수값이 다 있는 경우
                  if (param.keyRsvNo && param.guestTelNo && param.guestLnm) {
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
     * 실제 예약 정보 변경 로직 실행(복사도 이 로직을 탐)
     */
    async updateRsvInfo (item) {
      const rsvInfo = this.setRsvParams(item)
      rsvInfo.keyRsvNo = item.keyRsvNo // key예약번호(수정시에만)
      rsvInfo.partnerTelNo = item.partnerTelNo // 예약자 연락처
      if (item.memberNo) { // 객실
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
      this.groupFlag = 'ota'
    },
    /**
     * 예약정보 변경(수정)
     */
    /* changeRsvInfo () {
      // 예약 번호 필수
      if (this.rsvDetail.rsvNo) {
        this.statusName = '- 예약정보변경'
        this.$emit('change-work-status', 'update')
      } else {
        this.$dialog.alert('변경할 예약이 존재하지 않습니다.')
      }
    }, */
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
    },
    /**
     * 파트너 관련 정보 조회
     */
    getPartnerInfo (roomType) {
      const param = {}
      param.taskType = this.roomType.value
      param.partnerSeq = this.user.number
      if (roomType === 'ROOM') {
        this.openNewRoomRsvPopup() // 객실 신규 팝업 오픈
      } else if (roomType === 'PKG') {
        this.openNewPkgRsvPopup() // 패키지 신규 팝업 오픈
      }
    },
    /**
     * 파트너 객실 신규 예약 팝업 오픈
     */
    async openNewRoomRsvPopup () {
      await this.$emit('select-type', 'ROOM') // roomType값 변경
      this.changeRsvDetail({}) // rsvDetail 초기화
      await this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/RoomReservation/Partner/PartnerNewRoomRsvPopup',
        params: {
          roomType: this.roomType
        },
        options: {
          fullscreen: false,
          scrollable: false,
          width: 1500
        }
      })
    },
    /**
     * 파트너 패키지 신규 예약 팝업 오픈
     */
    async openNewPkgRsvPopup () {
      await this.$emit('select-type', 'PKG') // roomType값 변경
      this.changeRsvDetail({}) // rsvDetail 초기화
      await this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/RoomReservation/Partner/PartnerNewPackageRsvPopup',
        params: {
          roomType: this.roomType
        },
        options: {
          fullscreen: false,
          scrollable: false,
          width: 1500
        }
      })
    }
  }
}
</script>
