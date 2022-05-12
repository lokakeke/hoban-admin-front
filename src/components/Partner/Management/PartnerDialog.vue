<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      파트너 - {{ dialogTitle }}
    </template>
    <v-tabs v-model="tab" color="info">
      <v-tab
        v-for="(tabItem, index) in tabItems"
        :key="tabItem.tab"
        class="subtitle-1"
        :disabled="tabItem.disable">
        <v-icon left>{{tab === index? 'radio_button_checked': 'radio_button_unchecked'}}</v-icon> {{ tabItem.tab }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="tabItem in tabItems"
        :key="tabItem.tab">
        <component :is="tabItem.component"
                   :partner-seq="partnerSeq"
                   :is-modify="isModify"
                   :set-info="setInfo"
                   :search="search"></component>
      </v-tab-item>
    </v-tabs-items>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import PartnerBasicInformation from './PartnerBasicInformation'
import PartnerAddManager from './PartnerAddManager'
import PartnerApi from './PartnerApi'

export default {
  extends: DialogBase,
  name: 'PartnerDialog',
  data () {
    return {
      search: Function,
      tab: null,
      tabItems: [
        { tab: '기본정보', component: PartnerBasicInformation, disable: false },
        { tab: '담당자 관리', component: PartnerAddManager, disable: true },
        { tab: 'API 관리', component: PartnerApi, disable: true }
      ],
      isModify: false,
      partnerSeq: '',
      partnerName: ''
    }
  },
  mounted () {
    this.setInfo(this.instance.params.isModify, this.instance.params.partnerSeq, this.instance.params.partnerName)
    this.search = this.instance.params.search
  },
  methods: {
    setInfo (isModify, partnerSeq, partnerName) {
      this.isModify = isModify
      this.partnerSeq = partnerSeq
      this.partnerName = partnerName
      // 수정일 경우 담당자 탭 활성화
      if (this.isModify) {
        this.tabItems[1].disable = false
        this.tabItems[2].disable = false
      }
    }
  },
  computed: {
    dialogTitle () {
      return this.isModify ? this.partnerName + ' 상세 정보' : '업체 신규등록'
    }
  }
}
</script>
