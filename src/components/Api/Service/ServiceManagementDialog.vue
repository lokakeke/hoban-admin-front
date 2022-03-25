<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      {{isNew ? 'API 서비스 등록': 'API 서비스 상세/수정'}}
    </template>
    <v-row>
        <v-col cols="12">
            <v-card tile>
                <div v-if="partnerInfo != null">
                    <!--<v-card-title>
                        업체 정보
                    </v-card-title>-->
                    <v-card-text class="subtitle-1">
                        <span class="mr-10">파트너명 : <span class="font-weight-bold">{{partnerInfo.ptnrNm}}</span></span>
                        <span class="mr-10">BUSINESS ID : <span class="font-weight-bold">{{partnerInfo.businessId}}</span></span>
                        <span class="mr-10">업무 구분 : <span class="font-weight-bold">{{partnerInfo.taskTypeCdNm}}</span></span>
                        <span class="mr-10">업무 구분 명 : <span class="font-weight-bold">{{partnerInfo.taskTypeNm}}</span></span>
                    </v-card-text>
                </div>
                <div v-else>
                    <v-card-title class="subtitle-1">
                        업체 정보를 등록해 주세요.
                    </v-card-title>
                </div>
                <v-card-text v-if="isNew" class="pt-0 font-weight-bold accent--text">
                    * 모든 데이터를 단계적으로 등록하셔야 최종저장이 가능합니다.
                </v-card-text>
                <v-card-text v-else class="pt-0 font-weight-bold accent--text">
                    * 업체정보(업무 구분) 를 변경 하시려면, 신규로 신청해 주세요.
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
    <template v-if="tab != null">
        <v-tabs v-model="tab" color="info">
            <v-tab v-for="(tabInfo, index) in tabs" :key="index" class="subtitle-1" :disabled="tabInfo.disable" tabindex="-1">
              <v-icon left>{{tab === index? 'radio_button_checked': 'radio_button_unchecked'}}</v-icon>
                {{tabInfo.title}}
            </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item v-for="(tabInfo, index) in tabs" :key="index">
                <component :is="tabInfo.component" :item="item" :is-new="isNew" :insert-data.sync="insertData" :insert="insert" :search="search"
                           @setPartner="setPartner($event)" @changeTab="setTabIndex($event)"></component>
            </v-tab-item>
        </v-tabs-items>
    </template>
  </dialog-base>
</template>

<script>
import ApiServiceTab from './ApiServiceTab'
import InformationTab from './InformationTab'
import IPManagementTab from './IPManagementTab'
import DialogBase from 'Components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  components: { ApiServiceTab, InformationTab, IPManagementTab },
  name: 'serviceManagementDialog',
  data () {
    return {
      tab: null,
      tabs: [
        { title: '기본 정보 관리', component: 'InformationTab', disable: true },
        { title: 'API 서비스 관리', component: 'ApiServiceTab', disable: true },
        { title: 'IP 관리', component: 'IPManagementTab', disable: true }
      ],
      partnerInfo: null,
      item: Object,
      isNew: Boolean,
      insertData: { serviceManagement: {}, serviceOpenList: [], serviceIpList: [] },
      search: Function
    }
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{
        target: 'escape',
        action: this.close
      }]
    })
    this.item = this.instance.params.item
    this.isNew = this.instance.params.isNew
    this.search = this.instance.params.search
    if (!this.isNew) {
      this.partnerInfo = this.cloneDeep(this.item)
      // 모든 탭 접근 가능
      this.tabDisableControl()
      this.tab = 0
    } else {
      this.partnerInfo = null
      // 정보탭만 접근 가능
      this.tabDisableControl(0)
    }
  },
  methods: {
    insert () {
      this.search()
      this.close()
    },
    tabDisableControl (index) {
      let idx = 0
      for (const tab of this.tabs) {
        if (index === undefined) {
          tab.disable = false
        } else if (idx === index) {
          tab.disable = false
          this.tab = index
        } else {
          tab.disable = true
        }
        idx++
      }
    },
    setTabIndex (isNext = true) {
      if (isNext) {
        this.tabDisableControl(this.tab + 1)
      } else {
        this.tabDisableControl(this.tab - 1)
      }
    },
    setPartner (tabInfo) {
      this.partnerInfo = this.cloneDeep(tabInfo)
      this.item = Object.assign({}, this.item, tabInfo)
      // 탭 컨트롤
      this.tabDisableControl(1)
    }
  }
}
</script>
