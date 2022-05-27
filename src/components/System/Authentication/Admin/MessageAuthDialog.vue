<template>
  <dialog-base :title="instance.params.title" :instance="instance">
    <template v-slot:buttons v-if="writeAuth">
      <v-btn text color="info" @click="update()"><v-icon left>check</v-icon>적용</v-btn>
    </template>
    <v-row>
      <v-col sm="6" md="3" v-for="messageGroup of messageList" :key="messageGroup.menuId" class="border-bottom border-left border-top border-right">
        <v-row align="center">
          <v-col cols="12" class="headline font-weight-bold text-center px-7">
            <v-icon class="float-left" @click="selectAll(messageGroup)">{{ messageGroup.isChecked ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}</v-icon>
            <span>{{messageGroup.commonCodeName}}</span>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-list dense>
          <template v-for="subItem of messageGroup.messages">
            <template>
              <v-list-item :key="subItem.messageId" @click="clickRow(subItem)">
                <v-list-item-icon>
                  <v-icon>subdirectory_arrow_right</v-icon>
                  <v-icon :color="true ? '#ee7500' : 'gray'">{{ subItem.isChecked ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  {{subItem.messageName}} ({{subItem.messageId}})
                </v-list-item-content>
              </v-list-item>
            </template>
          </template>
        </v-list>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-right">
        <v-btn v-if="writeAuth" outlined rounded color="info" @click="update()"><v-icon left>check</v-icon>적용</v-btn>
        <v-btn outlined rounded color="primary" @click="close()"><v-icon left>close</v-icon>닫기</v-btn>
      </v-col>
    </v-row>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import adminMessageAuthService from '@/api/modules/system/authentication/admin/adminMessageAuth.service'
import partnerMessageAuthService from '@/api/modules/system/authentication/partner/partnerMessageAuth.service'
import Vue from 'vue'

export default {
  extends: DialogBase,
  name: 'messageAuthDialog',
  data () {
    return {
      menuList: [],
      selectMenu: [],
      change: Function,
      menuAuthGroupId: Number,
      myMessageAuthList: [],
      messageList: [],
      form: [],
      isPartner: false
    }
  },
  mounted () {
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{ target: 'escape', action: this.close }]
    })
    this.change = this.instance.params.change
    this.myMessageAuthList = this.instance.params.myMessageAuthList.messageAuths
    this.messageList = this.instance.params.messageList
    this.menuAuthGroupId = this.instance.params.menuAuthGroupId
    this.change = this.instance.params.change
    this.isPartner = this.instance.params.isPartner
    this.menuAuthGroupName = this.instance.params.menuAuthGroupName
    this.form = new Set()
    if (this.myMessageAuthList) {
      for (const messageGroup of this.myMessageAuthList) {
        this.form.add(messageGroup.messageId)
      }
    }

    const checkPropertyName = 'isChecked'

    this.messageList
      .forEach(messageGroup => {
        if (messageGroup.messages) {
          for (const message of messageGroup.messages) {
            if (this.form.has(message.messageId)) {
              Vue.set(message, checkPropertyName, true)
              Vue.set(messageGroup, checkPropertyName, true)
            } else {
              Vue.set(message, checkPropertyName, false)
            }
          }
        } else {
          Vue.set(messageGroup, checkPropertyName, false)
        }
      })
  },
  methods: {
    clickRow (message) {
      message.isChecked = !message.isChecked
      this.toggleMessageCheck(message)
    },
    selectAll (messageGroup) {
      messageGroup.isChecked = !messageGroup.isChecked
      if (messageGroup.messages) {
        for (const message of messageGroup.messages) {
          message.isChecked = messageGroup.isChecked
          this.toggleMessageCheck(message)
        }
      }
    },
    toggleMessageCheck (message) {
      if (message.isChecked) {
        this.form.add(message.messageId)
      } else {
        this.form.delete(message.messageId)
      }
    },
    update () {
      this.$dialog.confirm('메시지권한 그룹 (' + this.menuAuthGroupName + ')의<br/>메뉴를 적용 하시겠습니까?').then(() => {
        if (this.isPartner && this.isPartner === true) {
          partnerMessageAuthService.updateMessageAuth({ menuAuthGroupId: this.menuAuthGroupId, messageAuths: this.form })
            .then(_ => this.change())
        } else {
          adminMessageAuthService.updateMessageAuth({ menuAuthGroupId: this.menuAuthGroupId, messageAuths: this.form })
            .then(_ => this.change())
        }
      }).catch(() => {})
    }
  }

}
</script>
