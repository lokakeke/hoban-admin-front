<template>
  <v-app
    id="body"
    :class="[{'box-layout': boxLayout, 'collapse-sidebar': collapseSidebar, 'rtl-layout': rtlLayout}]"
  >
    <!-- 화면 노출 router-view -->
    <router-view></router-view>

    <!-- 팝업 컨테이너 -->
    <dialog-container></dialog-container>

    <!-- Vue Loading Overlay -->
    <vue-loading-overlay></vue-loading-overlay>

    <!-- 상단 알림 -->
    <common-snackbars
      v-for="(snackbar, snackbarKey) in snackbars"
      :key="snackbarKey"
      :text="snackbar.text"
      v-model="snackbar.isShow"
      :type="snackbar.type"
      :timeout="-1"
    ></common-snackbars>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import DialogContainer from '@/components/Dialog/DialogContainer.vue'
import VueLoadingOverlay from '@/components/LoadingOverlay/VueLoadingOverlay.vue'
import CommonSnackbars from '@/components/Common/CommonSnackbars.vue'
import depositAccountService from '@/api/modules/api/depositAccount.service'

export default {
  components: {
    DialogContainer,
    VueLoadingOverlay,
    CommonSnackbars
  },
  data () {
    return {
      animation: {
        enter: {
          opacity: [1, 0],
          translateX: [0, -300],
          scale: [1, 0.2]
        },
        leave: {
          opacity: 0,
          height: 0
        }
      },
      snackbars: {
        refresh: {
          isShow: false,
          text: '홈페이지에 업데이트된 항목이 있습니다. 브라우저를 새로고침(Ctrl + Shift + R) 해주세요.',
          type: 'info'
        },
        deposit: {
          isShow: false,
          text: '예치금이 부족합니다. 예치금을 확인하여 주세요.',
          type: 'error'
        }
      },
      partnerDepositInterval: null
    }
  },
  computed: {
    ...mapGetters({
      collapseSidebar: 'settings/collapseSidebar',
      boxLayout: 'settings/boxLayout',
      rtlLayout: 'settings/rtlLayout',
      sequence: 'keypress/sequence',
      keyEventList: 'keypress/keyEventList',
      keyMulti: 'keypress/keyMulti',
      jwtToken: 'auth/jwtToken'
    })
  },
  mounted () {
    // 키 입력 이벤트 바인딩
    document.addEventListener('keydown', this.keydownEventHandler)
    document.addEventListener('keyup', this.keyupEventHandler)
    // 파트너 예치금 부족 주기적 확인
    // FIXME 개발 후 주석 풀기
    // this.checkPartnerDeposit()
    // this.partnerDepositInterval = setInterval(this.checkPartnerDeposit, 30 * 60 * 1000) // 30분 간격
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.keydownEventHandler)
    document.removeEventListener('keyup', this.keyupEventHandler)
    if (this.partnerDepositInterval) {
      clearInterval(this.partnerDepositInterval)
    }
  },
  methods: {
    keydownEventHandler (e) {
      // alert, confirm 팝업창 이 노출되었을 경우는 키 이벤트 제거
      if (document.body.className.indexOf('dg-open') > -1) {
        // e.preventDefault()
        return
      }
      // 이벤트가 존재하면 검사한다.
      if (this.keyEventList.length > 0 && e.key) {
        // 멀티 키 입력 체크 - control 키 눌었을 시 작동
        if (e.key.toLowerCase() === 'control') {
          this.$store.dispatch('keypress/toggleKeyMulti', {
            target: e.key,
            isPress: true
          })
        }
        for (const eventTarget of this.keyEventList) {
          // 이벤트 화면 sequence 와 현재 최종화면 sequence 가 같은지 검사한다.
          if (
            eventTarget.sequence === this.sequence && eventTarget.eventList && eventTarget.eventList.length > 0
          ) {
            for (const event of eventTarget.eventList) {
              if (
                event.target && event.action && e.key.toLowerCase() === event.target.toLowerCase()
              ) {
                // 키 조합 이벤트일 경우 control 키가 눌리지 않았다면 continue
                if (event.multi && !this.keyMulti) {
                  continue
                } else if (!event.multi && this.keyMulti) {
                  // 키 한개 이벤트 일 경우 control 키가 눌렸다면 continue
                  continue
                }
                // 입력 권한 체크 - writeAuth
                if (event.writeAuth === true && !this.writeAuth) {
                  return
                }
                // 매칭 될 경우 이벤트 실행 후 입력 키 초기화
                e.preventDefault()
                if (event.param !== undefined) {
                  event.action(event.param)
                } else {
                  event.action()
                }
                return
              }
            }
          }
        }
      }
    },
    keyupEventHandler (e) {
      // 멀티 키 해제 체크 - control 키 눌었을 시 작동
      if (e.key && e.key.toLowerCase() === 'control') {
        this.$store.dispatch('keypress/toggleKeyMulti', {
          target: e.key,
          isPress: false
        })
      }
    },
    async checkPartnerDeposit () {
      try {
        // 예치금 체크
        // 토큰이 있을경우만 진행
        if (this.jwtToken) {
          const res = await depositAccountService.selectPartnerDepositCheck()
          if (res.data === false) {
            this.snackbars.deposit.isShow = true
          }
        }
      } catch (e) {
        console.log('파트너 예치금 조회에 실패하였습니다.')
      }
    }
  }
}
</script>
