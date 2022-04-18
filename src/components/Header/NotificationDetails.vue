<template>
    <div>
        <v-list class="dropdown-list" style="max-height: 1000px" v-scroll:#scroll-target="onScroll" >
            <v-list-item v-for="(item, index) in list" :key="index">
                <v-list-item-content @click="viewDetail(item)" class="pointer">
                    <v-list-item-title v-text="item.message"/>
                    <v-list-item-subtitle v-text="item.fromNow"/>
                </v-list-item-content>
                <v-list-item-action>
                    <v-btn @click="readNotification(item)" class="white--text" color="blue darken-3" small v-if="item.readYn === 'N'">읽음 처리</v-btn>
                </v-list-item-action>
            </v-list-item>
        </v-list>

        <!-- 인벤토리 전송 에러 -->
        <!--<send-detail :dialog.sync="dialog" :toast-data="toastData" v-if="viewNum == 1"></send-detail>

        &lt;!&ndash; 예약 에러 &ndash;&gt;
        <reservation-error-detail :dialog.sync="dialog" :toast-data="toastData" v-if="viewNum == 2"></reservation-error-detail>

        &lt;!&ndash; 예약 수동 또는 수동 성공 &ndash;&gt;
        <reservation-manual-detail :dialog.sync="dialog" :toast-data="toastData" v-if="viewNum == 3"></reservation-manual-detail>-->
    </div>
</template>

<script>
import messageAdminService from '@/api/modules/message/messageAdmin.service'
import messagePartnerService from '@/api/modules/message/messagePartner.service'
import { mapGetters } from 'vuex'

export default {
  name: 'NotificationDetails',
  props: ['selected'],
  data () {
    return {
      list: [],
      dialog: false,
      viewNum: 0,
      notificationData: {}
    }
  },

  computed: { // 계산된 속성
    ...mapGetters({ partnerYn: 'auth/partnerYn' })
  },

  mounted () {
    this.getNotificationList()
  },

  methods: {
    /** 실제 알림 목록 조회 */
    getNotificationList () {
      if (this.isPartner) {
        messagePartnerService.selectMessageList({ messageId: this.selected.messageId, messageType: this.selected.messageType }).then(res => {
          if (res.data) {
            this.list = res.data.list
          }
        })
      } else {
        messageAdminService.selectMessageList({ messageId: this.selected.messageId, messageType: this.selected.messageType }).then(res => {
          if (res.data.list) {
            this.list = res.data.list
          }
        })
      }
    },
    /** 알림 1개 읽음 처리 */
    async readNotification (item) {
      if (this.isPartner) {
        const res = await messagePartnerService.readMessage({ messagePartnerSeq: item.messagePartnerSeq })
        if (res.data) {
          this.getNotificationList()
          this.$emit('reset', true)
        }
      } else {
        const res = await messageAdminService.readMessage({ messageAdminSeq: item.messageAdminSeq })
        if (res.data) {
          this.getNotificationList()
          this.$emit('reset', true)
        }
      }
    },

    onScroll (e) {
      this.offsetTop = e.target.scrollTop
    },

    viewDetail (item) {
      this.dialog = false

      // TODO 상세 화면 페이지로 로직 구현 필요

      this.$nextTick(() => {
        this.dialog = true
      })

      // 상세화면을 보면 읽음 처리
      // this.readNotification(item)
    }
  }
}
</script>
