<template>
    <v-row wrap>
        <app-card heading="KPI 관리" col-classes="col-12">
            <v-form lazy-validation ref="form" autocomplete="off">
                <v-row align="center">
                    <v-col cols="5">
                        <v-autocomplete
                            v-model="searchForm.kpiSeq"
                            :items="kpiList"
                            item-value="kpiSeq"
                            item-text="kpiIndNm"
                            :no-data-text="emptyText"
                            :rules="emptyRules"
                            label="KPI 카테고리"
                            placeholder="KPI 카테고리를 선택 해 주세요."
                            @change="search"
                        >
                            <template v-slot:append-outer v-if="writeAuth">
                                <v-btn v-if="searchForm.kpiSeq" @click="openKpiCategoryForm(searchForm.kpiSeq)" outlined
                                       color="green">
                                    <v-icon left>edit</v-icon>
                                    수정
                                </v-btn>
                                <v-btn outlined color="primary" @click="openKpiCategoryForm()">
                                    <v-icon left>add</v-icon>
                                    추가
                                </v-btn>
                            </template>
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="3" class="pl-3">
                        <v-autocomplete
                            v-model="searchForm.stndYear"
                            :items="yearList"
                            item-value="value"
                            item-text="text"
                            label="입력연도"
                            placeholder="입력연도를 선택 해 주세요."
                            :rules="emptyRules"
                            @change="search" />
                    </v-col>
                </v-row>
            </v-form>
            <v-divider></v-divider>
            <v-row v-if="detailForm.kpiSeq && detailForm.stndYear" dense class="pt-3">
                <v-col cols="1">
                    <v-currency-field v-model="detailForm.kpi1" label="1월"></v-currency-field>
                </v-col>
                <v-col cols="1">
                    <v-currency-field v-model="detailForm.kpi2" label="2월"></v-currency-field>
                </v-col>
                <v-col cols="1">
                    <v-currency-field v-model="detailForm.kpi3" label="3월"></v-currency-field>
                </v-col>
                <v-col cols="1">
                    <v-currency-field v-model="detailForm.kpi4" label="4월"></v-currency-field>
                </v-col>
                <v-col cols="1">
                    <v-currency-field v-model="detailForm.kpi5" label="5월"></v-currency-field>
                </v-col>
                <v-col cols="1">
                    <v-currency-field v-model="detailForm.kpi6" label="6월"></v-currency-field>
                </v-col>
                <v-col cols="1">
                    <v-currency-field v-model="detailForm.kpi7" label="7월"></v-currency-field>
                </v-col>
                <v-col cols="1">
                    <v-currency-field v-model="detailForm.kpi8" label="8월"></v-currency-field>
                </v-col>
                <v-col cols="1">
                    <v-currency-field v-model="detailForm.kpi9" label="9월"></v-currency-field>
                </v-col>
                <v-col cols="1">
                    <v-currency-field v-model="detailForm.kpi10" label="10월"></v-currency-field>
                </v-col>
                <v-col cols="1">
                    <v-currency-field v-model="detailForm.kpi11" label="11월"></v-currency-field>
                </v-col>
                <v-col cols="1">
                    <v-currency-field v-model="detailForm.kpi12" label="12월"></v-currency-field>
                </v-col>
                <v-col cols="12" class="text-right" v-if="writeAuth">
                    <v-btn color="info" @click="insertKpiDetail">
                        <v-icon left>check</v-icon>
                        입력
                    </v-btn>
                </v-col>
            </v-row>
            <v-row v-else align="center" justify="center" class="title font-weight-bold pt-3">
                KPI 카테고리, 입력연도를 선택 해 주세요.
            </v-row>
        </app-card>
    </v-row>
</template>

<script>
import kpiService from 'Api/modules/social/kpi.service'
// (woojung)

export default {
  name: 'KpiManagement',
  data () {
    return {
      kpiList: [],
      yearList: [],
      searchForm: {
        kpiSeq: '',
        stndYear: moment().format('YYYY')
      },
      detailForm: {
        kpiSeq: '',
        stndYear: '',
        kpi1: '',
        kpi2: '',
        kpi3: '',
        kpi4: '',
        kpi5: '',
        kpi6: '',
        kpi7: '',
        kpi8: '',
        kpi9: '',
        kpi10: '',
        kpi11: '',
        kpi12: ''
      }
    }
  },
  async mounted () {
    // 연도 리스트 : 이전 10년 ~ 내년 까지 리스트를 만든다
    const yearLength = 9
    const year = parseInt(moment().format('YYYY')) + 1
    const yearList = []
    for (let index = 0; index < yearLength; index++) {
      const data = (year - index) + ''
      yearList.push({ value: data, text: data + ' 년' })
    }
    this.yearList = yearList
    // kpi 카테고리 리스트 조회
    try {
      this.kpiList = await kpiService.selectKpiList()
    } catch (e) {
    }
  },
  methods: {
    async search () {
      try {
        await this.validForm(this.$refs.form)
        this.detailForm = await kpiService.selectKpiDetail(this.searchForm)
      } catch (e) {
      }
    },
    async insertKpiDetail () {
      try {
        await this.$dialog.confirm(`${this.searchForm.stndYear}년 의 KPI 수치를 입력 하시겠습니까?`)
        await kpiService.insertKpiDetail(this.detailForm)
        this.$dialog.alert('KPI 수치를 입력하였습니다.')
        this.search()
      } catch (e) {
      }
    },
    openKpiCategoryForm (kpiSeq) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Social/Statistics/KpiCategoryDialog',
        params: {
          kpiSeq: kpiSeq || ''
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 700,
          closeCallback: (params) => {
            if (params && params.change) {
              // 카테고리를 다시 조회한다.
              kpiService.selectKpiList().then(res => {
                this.kpiList = res
              })
            }
          }
        }
      })
    }
  }
}
</script>
