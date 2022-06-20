<template>
  <v-row>
    <v-col md="4" sm="12" cols="12" class="pr-1">
      <app-card :heading="'메시지 권한 그룹 리스트'" auto-height>
        <template v-slot:items>
          <v-row>
            <v-col cols="12" class="pb-0">
              <v-text-field v-model="searchMenu" hide-details single-line outlined small dense append-icon="mdi-magnify" label="Search" clearable />
            </v-col>
          </v-row>
        </template>
        <v-list dense v-if="groupFilterList && groupFilterList.length > 0">
          <v-list-item v-for="item of groupFilterList" :key="item.menuAuthGroupId" @click="viewDetail(item, true)" class="menu-list" :class="item.active? 'active' : ''">
            <v-list-item-action>
              <v-icon>account_tree</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title :class="{ 'strike': item.useYn === 'N' }">
                {{ item.menuAuthGroupName }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>keyboard_arrow_right</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-row v-else align="center" justify="center">
          등록된 메뉴 권한 그룹이 없습니다.
        </v-row>
      </app-card>
    </v-col>
    <v-col md="4" sm="12" cols="12" class="px-1">
      <app-card :heading="'메시지 권한 그룹 상세내역'" :colClasses="'mb-2'">
        <transition name="slide-fade" mode="out-in">
          <template v-if="selectedGroup && selectedGroup.menuAuthGroupId">
              <v-row>
                  <v-col cols="6">
                      <v-label>메뉴권한 그룹 ID</v-label>
                      <v-text-field :value="selectedGroup.menuAuthGroupId" label="" disabled class="pt-0" />
                  </v-col>
                  <v-col cols="6">
                      <v-label>메뉴권한 그룹 이름</v-label>
                      <v-text-field v-model="selectedGroup.menuAuthGroupName" disabled :rules="emptyRules" label="" class="pt-0" />
                  </v-col>
                  <v-col class="py-0">
                      <v-checkbox class="mt-0" v-model="selectedGroup.useYn" disabled label="사용여부" hide-details true-value="Y" false-value="N" />
                  </v-col>
              </v-row>
          </template>
          <v-row v-else align="center" justify="center">
            메시지 권한 그룹을 선택해 주세요.
          </v-row>
        </transition>

      </app-card>
      <app-card :heading="'메시지 권한 관리자 리스트'">
        <template v-if="selectedGroup">
          <v-row no-gutters justify="end" class="mb-2">
            <v-col cols="6">
              <v-text-field v-model="search" hide-details single-line outlined small dense append-icon="mdi-magnify" label="Search"/>
            </v-col>
          </v-row>
          <v-data-table :no-data-text="menuAuthGroupName +' 그룹에 관리자 정보가 없습니다.'"
                        :no-results-text="'검색 결과가 없습니다.'" :headers="headers" :items="selectedGroup.partnerAccounts" :search="search">
            <template v-slot:item.action="{ item }">
              <v-btn outlined rounded small color="info">
                <v-icon small left>edit</v-icon>
                개인메뉴
              </v-btn>
            </template>
          </v-data-table>
        </template>
        <v-row v-else align="center" justify="center">
          메시지 권한 그룹을 선택해 주세요.
        </v-row>
      </app-card>
    </v-col>
    <v-col md="4" sm="12" cols="12" class="pl-1">
      <app-card :heading="'메시지 권한 리스트'" auto-height>
        <template v-slot:items v-if="selectedGroup">
          <v-row>
            <v-col cols="6" class="pb-0">
              <v-text-field v-model="searchAuth" hide-details single-line outlined small dense append-icon="mdi-magnify" label="Search" clearable />
            </v-col>
            <v-col cols="6" class="pb-0">
              <v-btn outlined rounded @click="openMenu" color="info">
                <v-icon left>edit</v-icon>
                권한 메뉴
              </v-btn>
            </v-col>
          </v-row>
        </template>
        <transition name="slide-fade" mode="out-in">
          <template v-if="selectedGroup && selectedGroup.menuAuthGroupId">
            <div :key="selectedGroup.menuAuthGroupId" >
              <template v-if="selectedGroup.menuAuthGroupId && selectedGroup.messageAuths.length >0">
                <v-list dense>
                  <v-list-item v-for="(messageAuth,index) of selectedGroup.messageAuths" :key="index">
                    <v-list-item-action>
                      <v-icon>menu</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>
                          {{ messageAuth.messageName }} <span v-for="n in 0" :key="n">{{ messageAuth.messageName }}</span> ({{messageAuth.messageId}})
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </template>
              <v-row v-else justify="center">
                {{menuAuthGroupName}} 그룹에 메시지 권한 리스트가 없습니다.
              </v-row>
            </div>
          </template>
          <v-row v-else align="center" justify="center">
            메시지 권한 그룹을 선택해 주세요.
          </v-row>
        </transition>
      </app-card>
    </v-col>
    <v-navigation-drawer v-model="dialog" :width="600" right app temporary stateless fixed>
      <v-toolbar color="primary" dark>
        <v-btn icon dark @click="close">
          <v-icon>close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title>메뉴 권한그룹 추가</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="close">Close</v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </v-navigation-drawer>
  </v-row>
</template>

<script>
import partnerMessageAuth from '@/api/modules/system/authentication/partner/partnerMessageAuth.service'
import commonCodeService from '@/api/modules/system/commonCode.service'
import messageService from '@/api/modules/system/message.service'

export default {
  name: 'partnerMessageAuth',
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{ target: 'escape', action: this.close }]
    })
    this.load()
  },
  computed: {
    menuAuthGroupName () {
      let text = ''
      if (this.selectedGroup && this.selectedGroup.menuAuthGroupId) {
        const select = _.find(this.messageGroups, { menuAuthGroupId: this.selectedGroup.menuAuthGroupId })
        text = select ? this.selectedGroup.menuAuthGroupName : ''
      }
      return text
    },
    groupFilterList () {
      return this.messageGroups.filter(data => this.searchMenu ? data.menuAuthGroupName.indexOf(this.searchMenu) > -1 : true)
    }
  },
  data () {
    return {
      // 메시지 권한 사용자리스트
      selectedGroup: {},
      messageGroups: [],
      fullMessages: [],
      headers: [
        { text: '파트너번호', value: 'partnerSeq', align: 'center' },
        { text: '아이디', value: 'loginId', align: 'center' },
        { text: '파트너명', value: 'partnerName', align: 'center' },
        { text: '상세보기', value: 'action', align: 'center' }
      ],
      search: '',
      /**
       * 메뉴 권한 필터 키워드
       */
      searchMenu: '',
      /**
       * 메뉴 권한 메뉴 필터 키워드
       */
      searchAuth: '',
      // 선택 파라미터
      // 신규 등록 dialog 컨트롤
      dialog: false
    }
  },
  methods: {
    openMenu () {
      if (!this.selectedGroup || !this.selectedGroup.menuAuthGroupId) return

      this.$store.dispatch('dialog/open', {
        componentPath: '/System/Authentication/Admin/MessageAuthDialog',
        params: {
          title: `메시지 권한 그룹(${this.menuAuthGroupName}) 메뉴 설정`,
          menuAuthGroupId: this.selectedGroup.menuAuthGroupId,
          menuAuthGroupName: this.menuAuthGroupName,
          isAdmin: false,
          change: this.load,
          myMessageAuthList: Object.assign({}, this.selectedGroup),
          messageList: Object.assign(this.fullMessages)
        },
        options: {
          fullscreen: true,
          retainFocus: false,
          persistent: true,
          scrollable: true
        }
      })
    },
    load () {
      this.dialog = false
      partnerMessageAuth.selectAllGroupByMenuAuthGroup().then(res => {
        this.messageGroups = res.data
        if (this.selectedGroup && this.selectedGroup.menuAuthGroupId) {
          const targetGroup = this.messageGroups.find(group => group.menuAuthGroupId === this.selectedGroup.menuAuthGroupId)
          this.viewDetail(targetGroup, false)
        }
      })

      this.getMessageList()
    },
    viewDetail (group, keywordChange) {
      for (const row of this.messageGroups) {
        row.active = row.menuAuthGroupId === group.menuAuthGroupId
      }

      this.selectedGroup = group
      if (keywordChange) {
        this.search = ''
      }
    },
    async getMessageList () {
      const result = []
      await commonCodeService.selectCommonCode('MESSAGE_TYPE').then(res => {
        this.fullMessages = res.data
      })
      await messageService.selectList()
        .then(res => {
          this.messageList = _.groupBy(res.data, item => item.messageType)
        })

      for (const code of this.fullMessages) {
        result.push({
          commonCode: code.commonCode,
          commonCodeName: code.commonCodeName,
          commonCodeSeq: code.commonCodeSeq,
          messages: this.messageList[code.commonCode]
        })
      }
      this.fullMessages = result
    },
    close () {
      this.dialog = false
    }
  }
}
</script>
