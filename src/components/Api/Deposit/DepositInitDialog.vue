<template>
  <dialog-base title="예치금 초기화" :instance="instance">
    <template v-if="tab != null">
        <v-tabs v-model="tab" color="info">
            <v-tab v-for="(tabInfo, index) in tabs" :key="index" class="subtitle-1" tabindex="-1">
              <v-icon left>{{tab === index? 'radio_button_checked': 'radio_button_unchecked'}}</v-icon>
                {{tabInfo.title}}
            </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item v-for="(tabInfo, index) in tabs" :key="index">
                <component :is="tabInfo.component"></component>
            </v-tab-item>
        </v-tabs-items>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from "@/components/Dialog/DialogBase"
import DepositInitInsuranceTab from "./DepositInitInsuranceTab"
import DepositInitCustomTab from "./DepositInitCustomTab"

export default {
  name: 'depositInitDialog',
  components: {
  },
  extends: DialogBase,
  data () {
    return {
      tab: null,
      tabs: [
        { title: '사용자 정의 기준', component: DepositInitCustomTab },
        { title: '증권 기준', component: DepositInitInsuranceTab }
      ]
    }
  },
  mounted () {
    this.tab = 0
  },
  methods: {

  }
}
</script>
