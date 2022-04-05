<template>
    <div>
        <v-row wrap>
            <v-col cols="12" class="pb-2">
                <v-tabs v-model="tab" fixed-tabs color="info">
                    <v-tab
                        v-for="(tabItem, index) in tabItems"
                        :key="index"
                        class="subtitle-1" active-class="inventory-active-tab">
                        <v-icon left>{{ tab === index ? "radio_button_checked" : "radio_button_unchecked" }}</v-icon>
                        {{ tabItem.tabName }}
                    </v-tab>
                </v-tabs>
            </v-col>
        </v-row>
        <app-card>
            <statistics-search-form v-model="tab" @search="search">
            </statistics-search-form>
            <v-tabs-items v-model="tab">
                <v-tab-item v-for="(tabItem, index) in tabItems" :key="index">
                    <component :is="tabItem.component" v-model="tabItem.active" />
                </v-tab-item>
            </v-tabs-items>
        </app-card>
    </div>
</template>

<script>
import RegionStatistics from '@/components/Social/Statistics/RegionStatistics.vue'
import ChannelStatistics from '@/components/Social/Statistics/ChannelStatistics.vue'
import PartnerStatistics from '@/components/Social/Statistics/PartnerStatistics.vue'
import TicketStatistics from '@/components/Social/Statistics/TicketStatistics.vue'
import StatisticsSearchForm from '@/components/Social/Statistics/StatisticsSearchForm.vue'

export default {
  name: 'SocialStatistics',
  components: { StatisticsSearchForm },
  data () {
    return {
      tab: null,
      tabItems: [
        { tabName: '지역', component: RegionStatistics, active: false },
        { tabName: '채널', component: ChannelStatistics, active: false },
        { tabName: '파트너', component: PartnerStatistics, active: false },
        { tabName: '우대번호', component: TicketStatistics, active: false }
      ]
    }
  },
  methods: {
    /**
         * 검색버튼 눌렀을 경우 탭별 active 스위치 on
         */
    search () {
      this.tabItems[this.tab].active = true
    }
  }
}
</script>
