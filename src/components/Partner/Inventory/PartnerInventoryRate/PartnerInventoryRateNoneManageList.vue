<template>
    <app-card :heading="'재고예약 전송비율 미관리 파트너'" col-classes="col-md-4 col-12" :min-height="300" auto-height
              content-classes="py-1">
        <template v-slot:items>
            <v-row align="end">
                <v-col cols="12" class="text-left font-weight-bold pr-0 primary--text body-2">
                    <p class="mb-1">* 객실 상품 이용중인 파트너만 설정 가능합니다.</p>
                </v-col>
            </v-row>
            <v-row align="end">
                <v-col cols="12" md="7" class="text-left">
                    <v-icon small left>check</v-icon>
                    {{ list.length }} 개 파트너사
                </v-col>
                <v-col cols="12" md="5">
                    <v-text-field v-model="searchKeyword" hide-details single-line outlined small dense
                                  append-icon="mdi-magnify" label="Search" clearable />
                </v-col>
            </v-row>
            <v-divider class="my-0 pb-2"></v-divider>
        </template>
        <template v-for="item of filterList">
            <v-hover v-slot:default="{ hover }" :key="item.partnerSeq">
                <v-card raised :elevation="hover ? 5 : 1" class="mb-1" @click="addPartner(item)">
                    <v-card-text class="py-0">
                        <v-row class="font-weight-black subtitle-1" align="center">
                            <v-col cols="7" class="py-0">
                                {{ item.companyName }} <small>({{ item.ptnrId }})</small>
                            </v-col>
                            <v-col cols="5" class="text-right success--text subtitle-1 pr-5">
                                <v-icon left>arrow_forward</v-icon>
                                추가
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-hover>
        </template>
        <div v-if="!filterList || filterList.length === 0" class="text-center">미관리중인 파트너가 없습니다.</div>
    </app-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PartnerInventoryRateNoneManageList',
  data () {
    return {
      searchKeyword: '',
      rateRule: [v => (v > -1 && v <= 100) || '0~100% 사이의 숫자만 허용됩니다.'],
      list: []
    }
  },
  watch: {
    noneList (newList) {
      this.list = newList
    }
  },
  computed: {
    ...mapGetters({
      managementList: 'partner/inventory/managementList',
      noneList: 'partner/inventory/noneList'
    }),
    filterList () {
      if (this.searchKeyword) {
        return this.list.filter(data => data.companyName.includes(this.searchKeyword))
      } else {
        return this.list
      }
    }
  },
  methods: {
    async addPartner (item) {
      try {
        await this.$dialog.confirm(`${item.companyName} 파트너를 재고관리 리스트에 추가하시겠습니까?`)
        // 미관리 리스트에서 제거
        const list = _.cloneDeep(this.list)
        list.splice(list.findIndex(data => data.partnerSeq === item.partnerSeq), 1)
        await this.$store.dispatch('partner/inventory/setNoneList', list)
        // 관리 리스트에 추가
        const managementList = _.cloneDeep(this.managementList)
        managementList.push(Object.assign({}, item, { rate: '', memNo: '', agentCode: '' }))
        await this.$store.dispatch('partner/inventory/setList', managementList)
      } catch (e) {
      }
    }
  }
}
</script>
