<template>
    <v-form ref="form" lazy-validation autocomplete="off">
        <v-row no-gutters class="mb-1">
            <v-col md="11" cols="11">
                <p class="pb-0 mb-0 mt-1">국내 O.T.A 파트너 객실유형 비율관리 중인 영업장</p>
                <select-all-list
                    v-model="form.storeList"
                    :items="storeList"
                    item-value="storeCd"
                    item-text="storeNm"
                    label="영업장을 선택해 주세요."
                    multiple clearable deletable-chips chips small-chips dense single-line required />
            </v-col>
        </v-row>
        <v-row align="center" no-gutters>
            <v-col md="9" cols="12" class="text-left">
                <v-row no-gutters align="center">
                    <v-col cols="5">
                        <p class="pb-0 mb-0 mt-1">기준 일자</p>
                        <date-picker
                            v-model="form.selectDate"
                            format="YYYY-MM-DD"
                            required />
                    </v-col>
                    <v-col cols="7" class="pl-3 pt-4 font-weight-bold">
                        * 기준일자 부터 2주간의 데이터를 조회할 수 있습니다.
                    </v-col>
                </v-row>
            </v-col>
            <v-col md="3" cols="12" class="text-right">
                <v-btn outlined rounded color="info" @click="search">
                    <v-icon left>search</v-icon>
                    검색 (F3)
                </v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import SelectAllList from 'Components/Select/SelectAllList.vue'
import partnerInventoryExpectService from 'Api/modules/partner/partnerInventoryExpect.service'

export default {
  components: { SelectAllList },
  props: {
    value: {
      type: Object,
      default () {
        return null
      }
    }
  },
  name: 'PartnerInventoryStatusForm',
  data () {
    return {
      form: {
        storeList: [],
        selectDate: moment().format('YYYY-MM-DD')
      },
      storeList: []
    }
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{ target: 'F3', action: this.search }]
    })
    // 영업장 조회
    partnerInventoryExpectService.selectInventoryExpectStoreList().then(res => {
      this.storeList = res.data
    })
  },
  methods: {
    async search () {
      try {
        await this.validForm(this.$refs.form)
        // 리스트 재조회
        this.$emit('input', null)
        await this.$nextTick()
        this.$emit('input', this.form)
      } catch (e) {
      }
    }
  }
}
</script>
