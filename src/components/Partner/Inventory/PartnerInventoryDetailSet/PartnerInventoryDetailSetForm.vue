<template>
  <v-form ref="form" lazy-validation autocomplete="off">
    <v-row align="end">
      <v-col cols="6" class="pt-0">
        <p class="pb-0 mb-0">국내 O.T.A 객실유형 관리중 영업장</p>
        <v-autocomplete
          v-model="form.storeCd"
          :items="storeList"
          item-value="storeCd"
          item-text="storeNm"
          placeholder="영업장을 선택해 주세요." />
      </v-col>
      <v-col cols="6" class="pt-0">
        <v-row no-gutters>
          <v-col cols="5">
            <p class="pb-0 mb-0 mt-1">기준 일자<small class="font-weight-bold info--text ml-2">( * 최대 30일 )</small></p>
            <date-range-picker
              v-model="form.selectDate"
              :min="minDate"
              :max="maxDate"
              format="YYYY-MM-DD"
              required />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" class="text-right pt-0">
        <v-btn outlined rounded color="primary" @click="viewInventory">
          <v-icon left>search</v-icon>
          전지역 객실 현황  (F2)
        </v-btn>
        <v-btn outlined rounded color="info" @click="search">
          <v-icon left>search</v-icon>
          검색 (F3)
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import storeService from 'Api/modules/system/store.service'

export default {
  props: {
    value: {
      type: Object,
      default () {
        return null
      }
    }
  },
  name: 'PartnerInventoryDetailSetForm',
  data () {
    return {
      form: {
        storeCd: '',
        selectDate: [moment().format('YYYY-MM-DD'), moment().add(2, 'weeks').format('YYYY-MM-DD')]
      },
      storeList: [],
      minDate: moment().format('YYYY-MM-DD')
    }
  },
  computed: {
    maxDate () {
      // 최대 일자 선택일 후 30일까지
      if (this.form.selectDate && this.form.selectDate[0]) {
        return moment(this.form.selectDate[0]).add(30, 'days').format('YYYY-MM-DD')
      } else {
        return undefined
      }
    }
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [
        { target: 'F2', action: this.viewInventory },
        { target: 'F3', action: this.search }
      ]
    })
    // 영업장 조회
    storeService.selectPartnerInventoryStoreList().then(res => {
      const storeAll = [{ storeCd: '', storeNm: '전체' }]
      this.storeList = storeAll.concat(res.data)
    })
  },
  methods: {
    async search () {
      try {
        await this.validForm(this.$refs.form)
        await this.validDateRange(this.form.selectDate, '기준일자를 선택해 주세요.')
        // 리스트 재조회
        this.$emit('input', null)
        await this.$nextTick()
        this.$emit('input', this.form)
      } catch (e) {}
    },
    viewInventory () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/InventorySearch',
        params: {},
        options: {
          fullscreen: false,
          scrollable: true,
          width: 1200
        }
      })
    }
  }
}
</script>
