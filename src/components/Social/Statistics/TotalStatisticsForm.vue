<template>
  <v-form lazy-validation ref="form" autocomplete="off">
    <v-row>
      <v-col cols="6">
        <v-row>
          <v-col cols="6" class="py-0">
            <v-autocomplete
              v-model="searchForm.basicYear"
              :items="yearList"
              label="기준연도"
              hide-details
              :rules="emptyRules" />
          </v-col>
          <v-col cols="6" class="py-0">
            <v-autocomplete
              v-model="searchForm.compareYear"
              :items="yearList"
              label="비교연도"
              hide-details
              :rules="emptyRules" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-autocomplete
          v-model="searchForm.kpiSeq"
          :items="kpiList"
          item-value="kpiSeq"
          item-text="kpiIndNm"
          placeholder="KPI 카테고리를 선택해 주세요."
          no-data-text="검색 가능한 KPI 카테고리가 없습니다."
          label="KPI 카테고리"
          hide-details
          :rules="emptyRules" />
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col cols="6">
        <v-radio-group v-model="searchForm.searchKind" row hide-details class="pt-0 mt-0">
          <v-radio label="전체" value="A" color="info"></v-radio>
          <v-radio label="상시" value="O" color="info"></v-radio>
          <v-radio label="전략" value="S" color="info"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col col="6">
        <v-radio-group v-model="searchForm.saleKind" row hide-details class="pt-0 mt-0">
          <v-radio label="판매" value="S" color="info"></v-radio>
          <v-radio label="사용" value="U" color="info"></v-radio>
          <v-radio label="취소" value="C" color="info"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row no-gutters align="center">
      <v-col cols="10">
        <select-all-list
          v-model="searchForm.chrgList"
          :items="chrgList"
          item-value="value"
          item-text="label"
          placeholder="담당자를 선택해 주세요."
          no-data-text="검색 가능한 담당자가 없습니다."
          :prefix="'담당자 : '"
          multiple clearable deletable-chips chips small-chips single-line required
        ></select-all-list>
      </v-col>
      <v-col cols="2" class="text-right">
        <v-btn rounded color="info" @click="search"><v-icon left>search</v-icon>검색 (F4)</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import SelectAllList from 'Components/Select/SelectAllList.vue'
import statisticsService from 'Api/modules/social/statistics.service'
import kpiService from 'Api/modules/social/kpi.service'

export default {
  name: 'TotalStatisticsForm',
  components: { SelectAllList },
  data () {
    return {
      yearList: [],
      chrgList: [],
      kpiList: [],
      searchForm: {
        basicYear: moment().format('YYYY'),
        compareYear: moment().add(-1, 'years').format('YYYY'),
        searchKind: 'A',
        saleKind: 'S',
        kpiSeq: '',
        chrgList: []
      }
    }
  },
  async mounted () {
    // 키 입력 이벤트 추가
    await this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [
        {
          target: 'F4',
          action: this.search
        }
      ]
    })
    // 연도 리스트 : 이전 10년 ~ 내년 까지 리스트를 만든다
    const yearLength = 9
    const year = parseInt(moment().format('YYYY')) + 1
    const yearList = []
    for (let index = 0; index < yearLength; index++) {
      const data = (year - index) + ''
      yearList.push({ value: data, text: data + ' 년' })
    }
    this.yearList = yearList
    // 담당자 리스트 조회
    this.chrgList = await statisticsService.selectChrgList()
    // KPI 리스트 조회
    this.kpiList = await kpiService.selectKpiList({ useYn: 'Y' })
  },
  methods: {
    async search () {
      try {
        await this.validForm(this.$refs.form)
        this.$emit('search', this.searchForm)
      } catch (e) {}
    }
  }
}
</script>
