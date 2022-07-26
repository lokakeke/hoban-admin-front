<template>
  <div>
    <v-row wrap>
      <v-tabs v-model="tab" fixed-tabs>
        <v-tab
          v-for="(tabItem, index) in tabItems"
          :key="tabItem.tab"
          class="subtitle-1" active-class="inventory-active-tab">
          <v-icon left>{{tab === index? 'radio_button_checked': 'radio_button_unchecked'}}</v-icon> {{ tabItem.tab }}
        </v-tab>
      </v-tabs>
    </v-row>
    <v-tabs-items v-model="tab" style="background: none">
      <v-tab-item v-for="(tabItem, index) in tabItems" :key="tabItem.tab">
        <component v-if="index === tab" :is="tabItem.component"></component>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import DepositRequestList from '@/components/Api/Deposit/DepositRequestList'
import DepositHistoryList from '@/components/Api/Deposit/DepositHistoryList'
import DepositFailureList from '@/components/Api/Deposit/DepositFailureList'

export default {
  name: 'DepositTransaction',
  components: {
    DepositRequestList,
    DepositHistoryList
  },
  data () {
    return {
      tab: null,
      tabItems: [
        { tab: '예치금 신청 목록', component: DepositRequestList },
        { tab: '예치금 이력 목록', component: DepositHistoryList },
        { tab: '예치금 실패 목록', component: DepositFailureList }
      ]
    }
  }
}
</script>

<style scoped>
  .inventory-active-tab {
    background-color: #EFEBE9;
  }
</style>
