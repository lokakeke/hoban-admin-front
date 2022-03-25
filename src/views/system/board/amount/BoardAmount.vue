<template>
  <div>
    <v-row wrap>
      <v-col cols="12">
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
        <app-card :heading="`${tabItem.tab} 요금 조회`" v-if="index === tab">
          <component :is="tabItem.component"></component>
        </app-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import BoardRoomAmountView from 'Components/Board/Amount/BoardRoomAmountView.vue'
import BoardPackageAmountView from 'Components/Board/Amount/BoardPackageAmountView.vue'

export default {
  name: 'BoardAmount',
  components: {
    BoardRoomAmountView,
    BoardPackageAmountView
  },
  data () {
    return {
      tab: null,
      tabItems: [
        { tab: '객실', component: BoardRoomAmountView },
        { tab: '패키지', component: BoardPackageAmountView }
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
