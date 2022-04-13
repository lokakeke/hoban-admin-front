<template>
    <dialog-base :instance="instance">
        <template v-slot:title>
            파트너({{ partner.companyName }}) - 담당자({{ profile.chrgName }}) 프로필
        </template>
        <v-tabs v-model="tab" color="info">
            <v-tab
                v-for="(tabItem, index) in tabItems"
                :key="tabItem.tab"
                class="subtitle-1">
                <v-icon left>{{ tab === index ? 'radio_button_checked' : 'radio_button_unchecked' }}</v-icon>
                {{ tabItem.tab }}
            </v-tab>
        </v-tabs>
        <v-tabs-slider></v-tabs-slider>
        <v-tabs-items v-model="tab">
            <v-tab-item
                v-for="tabItem in tabItems"
                :key="tabItem.tab">
                <component :is="tabItem.component" :partner="partner" :profile="profile" :main-auth="mainAuth"
                           :partner-no="partner.partnerSeq" :is-modify="true" @change="getUserProfile"></component>
            </v-tab-item>
        </v-tabs-items>
    </dialog-base>
</template>

<script>
import adminAuthService from '@/api/modules/system/authentication/admin/adminAuth.service'
import DialogBase from '@/components/Dialog/DialogBase.vue'
import PartnerProfilePartnerInformation from './PartnerProfilePartnerInformation'
import PartnerProfileBasicInformation from './PartnerProfileBasicInformation'
import PartnerProfilePassword from './PartnerProfilePassword'
import PartnerAddCharge from '@/components/Partner/management/PartnerAddCharge.vue'

export default {
  extends: DialogBase,
  name: 'PartnerProfile',
  data () {
    return {
      mainAuth: false,
      partner: {},
      profile: {},
      tab: null,
      tabItems: []
    }
  },
  mounted () {
    this.getUserProfile()
  },
  methods: {
    getUserProfile () {
      adminAuthService.selectProfile().then(res => {
        this.mainAuth = res.data.mainAuthYn === 'Y'
        this.partner = res.data.partner
        this.profile = res.data.profile
        if (this.mainAuth) {
          this.tabItems = [
            { tab: '유저 프로필', component: PartnerProfileBasicInformation },
            { tab: '파트너사 기본정보', component: PartnerProfilePartnerInformation },
            { tab: '파트너 비밀번호 변경', component: PartnerProfilePassword },
            { tab: '담당자 관리', component: PartnerAddCharge }
          ]
        } else {
          this.tabItems = [
            { tab: '유저 프로필', component: PartnerProfileBasicInformation },
            { tab: '파트너사 기본정보', component: PartnerProfilePartnerInformation }
          ]
        }
      }).catch(() => {
        this.close()
      })
    }
  }
}
</script>
