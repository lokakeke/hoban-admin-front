<template>
    <v-row>
        <app-card heading="소셜 전체 통계" col-classes="col-12">
            <total-statistics-form @search="search($event)"></total-statistics-form>
            <v-col cols="12" v-if="!isLoading" class="title text-center font-weight-bold">
                조건 선택 후 검색 (F4) 해주세요.
            </v-col>
            <total-statistics-chart v-else :data="data" :search-condition="searchCondition" />
        </app-card>
    </v-row>
</template>

<script>
import TotalStatisticsForm from '@/components/Social/Statistics/TotalStatisticsForm.vue'
import TotalStatisticsChart from '@/components/Social/Statistics/TotalStatisticsChart.vue'
import statisticsService from '@/api/modules/social/statistics.service'

export default {
  name: 'TotalStatistics',
  components: { TotalStatisticsForm, TotalStatisticsChart },
  data () {
    return {
      isLoading: false,
      data: null,
      searchCondition: null
    }
  },
  methods: {
    async search (form) {
      this.isLoading = false
      this.searchCondition = form
      this.data = await statisticsService.selectSocialTotalStatistics(form)
      this.isLoading = true
    }
  }
}
</script>
