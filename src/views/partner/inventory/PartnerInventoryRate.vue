<template>
  <div>
    <v-row>
      <v-col cols="12" class="pb-0">
        <v-tabs v-model="tab" fixed-tabs>
          <v-tab
            v-for="(tabItem, index) in tabItems"
            :key="tabItem.tab"
            class="subtitle-1" active-class="inventory-active-tab">
            <v-icon left>{{tab === index? 'radio_button_checked': 'radio_button_unchecked'}}</v-icon> {{ tabItem.tab }}
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>
    <v-tabs-items v-model="tab" style="background: none">
      <v-tab-item v-for="(tabItem, index) in tabItems" :key="tabItem.tab">
        <component v-if="index === tab" :is="tabItem.component"></component>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import PartnerInventoryRateTab from '@/components/Partner/Inventory/PartnerInventoryRate/PartnerInventoryRateTab.vue'
import PartnerInventoryRateOptionTab
  from '@/components/Partner/Inventory/PartnerInventoryRate/PartnerInventoryRateOptionTab.vue'

export default {
  components: { PartnerInventoryRateTab, PartnerInventoryRateOptionTab },
  name: 'PartnerInventory',
  data () {
    return {
      tab: null,
      tabItems: [
        { tab: '전송 조건 설정', component: PartnerInventoryRateOptionTab },
        { tab: '비율관리', component: PartnerInventoryRateTab }
      ]
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style>
.inventory-active-tab {
  background-color: #EFEBE9;
}
</style>
