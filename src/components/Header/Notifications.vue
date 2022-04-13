<template>
  <v-menu
    :close-on-content-click="openMenu"
    offset-y
    left
    origin="right top"
    z-index="99"
    content-class="notification-dropdown"
    transition="slide-y-transition"
    nudge-top="-10"
  >
    <template v-slot:activator="{ on }">
      <v-badge
              right
              overlap
              slot="activator"
              offset-x="25"
              offset-y="20">
        <span slot="badge">{{ typeNotiList | sum('count') }}</span>
        <v-btn v-on="on" icon color="blue-grey" title="알림">
          <i class="zmdi zmdi-notifications-active infinite wobble zmdi-hc-fw font-lg"
             :class="typeNotiList && typeNotiList.length > 0 ? 'animated' : '' "></i>
        </v-btn>
      </v-badge>
    </template>

    <div class="dropdown-content" style="width: 380px">
      <div class="dropdown-top d-custom-flex primary" style="padding-top: 0; padding-bottom: 0">
        <v-row>
          <v-col style="margin-top: 3px">
            <span class="white--text fw-bold py-1">알림</span>
            <v-chip class="white--text mx-3" color="yellow darken-2" small>{{ typeNotiList | sum('count') }} NEW</v-chip>
          </v-col>
          <v-col style="text-align: right">
            <v-btn @click="showAllNotification" color="white--text blue lighten-2" small>전체 메시지 게시판</v-btn>
          </v-col>
        </v-row>
      </div>

      <!-- 첫번째 알림 화면(알림 구분) -->
      <v-list class="dropdown-list" v-if="depth === 1">
        <v-list-item
          v-for="message in typeNotiList"
          :key="message.messageCodeName"
          @click="showMessageNotifications(message)"
        >
          <v-list-item-icon class="pl-3">
            <v-icon medium color="teal darken-2">mdi-email</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="message.messageCodeName"></v-list-item-title>
            <v-list-item-subtitle v-text="message.fromNow"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn small color="red lighten-1" dark>{{ message.count }}</v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <!-- 두번째 알림 화면(메세지 구분) -->
      <v-fab-transition>
        <div v-if="depth === 2">
          <v-layout class="px-5 py-1" row justify-space-between>
            <v-btn @click="showTypeNotification" class="white--text" color="teal" small>뒤로</v-btn>
          </v-layout>
          <v-list class="dropdown-list">
            <v-list-item
              v-for="notification in notifications"
              :key="notification.messageName"
              @click="showDetailNotifications(notification)"
            >
              <v-list-item-icon class="pl-3">
                <v-icon medium color="teal darken-2">mdi-email</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="notification.messageName"></v-list-item-title>
                <v-list-item-subtitle v-text="notification.fromNow"></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn small color="red lighten-1" dark>{{ notification.count }}</v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </div>
      </v-fab-transition>

      <!-- 세번째 알림 화면(디테일, 실제 알림내용) -->
      <v-fab-transition>
        <div v-if="depth === 3">
          <v-layout class="px-5 py-1" row justify-space-between>
            <v-btn @click="showMessageNotifications(selectedType)" class="white--text" color="teal" small>뒤로</v-btn>
            <v-btn @click="readAllByName" class="white--text" color="orange darken-1" small>모두 읽음</v-btn>
          </v-layout>
          <notification-details :selected="selectedItem" @reset="goBackToMessageNotifications($event)"/>
        </div>
      </v-fab-transition>
    </div>
  </v-menu>
</template>

<script>
import NotificationDetails from './NotificationDetails'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: { NotificationDetails },
  computed: {
    ...mapGetters({
      depth: 'message/depth',
      typeNotiList: 'message/typeNotiList',
      selectedType: 'message/selectedType',
      selectedItem: 'message/selectedItem',
      notifications: 'message/notifications',
      openMenu: 'message/openMenu'
    })
  },
  methods: {
    ...mapActions({
      showAllNotification: 'message/showAllMessage',
      showTypeNotification: 'message/showTypeNotification',
      showDetailNotifications: 'message/showDetailNotifications',
      showMessageNotifications: 'message/showMessageNotifications',
      goBackToMessageNotifications: 'message/goBackToMessageNotifications',
      getNotificationType: 'message/getNotificationType',
      getNotificationGroup: 'message/getNotificationGroup',
      readAllByName: 'message/readAllByName',
      addNotificationObserver: 'message/addNotificationObserver',
      clearInterval: 'message/clearInterval'
    })
  },
  async mounted () {
    await this.getNotificationType()
    await this.$store.dispatch('message/getNotificationType')
    this.addNotificationObserver()
  },
  destroyed () {
    this.clearInterval()
  }
}
</script>
