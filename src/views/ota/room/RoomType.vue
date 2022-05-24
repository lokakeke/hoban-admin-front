<template>
  <v-row wrap>
    <v-col sm="12">
      <app-card :heading="'객실 등록관리'">
        <search-form :search-list="searchList" :search-param.sync="searchParam" init-search @search="search" />
        <v-data-table :headers="headers"
                      :items="list"
                      :no-data-text="'검색 결과가 없습니다.'"
                      @click:row="openDialog($event)"
                      class="bordered pointer"
                      disable-pagination
                      hide-default-footer
        >
          <template v-slot:item.local="{item}">
            {{item.localName}} ({{ item.localCode }})
          </template>
          <template v-slot:item.store="{item}">
            {{item.storeName}} ({{ item.storeCode }})
          </template>
          <template v-slot:item.saleStartDate="{item}">
            {{ item.saleStartDate | date }}
          </template>
          <template v-slot:item.saleEndDate="{item}">
            {{ item.saleEndDate | date }}
          </template>
          <template v-slot:item.blockCode="{item}">
            {{ isPartner ? '-' : item.blockCode }}
          </template>
          <template v-slot:item.useYn="{item}">
            {{ item.useYn === 'Y' ? '판매' : '판매중지' }}
          </template>
        </v-data-table>
        <v-row v-if="writeAuth">
          <v-col class="text-right">
            <v-btn @click="openPartnerExceptionBatchSettingDialog" color="success" outlined rounded>
              <v-icon small>add</v-icon>파트너 예외 일괄설정
            </v-btn>
            <v-btn @click="openDialog" color="info" outlined rounded>
              <v-icon small>add</v-icon>영업장 추가
            </v-btn>
          </v-col>
        </v-row>
        <search-pagination :total-visible="10" @change="search" circle v-model="searchParam"></search-pagination>
      </app-card>
    </v-col>
  </v-row>
</template>

<script>
import roomTypeService from '@/api/modules/ota/roomType.service'
import { mapGetters } from 'vuex'

export default {
  name: 'RoomPackage',
  computed: {
    searchList () {
      return [
        { key: 'localCode', label: '지역코드', type: 'text' },
        { key: 'localName', label: '지역명', type: 'text' },
        { key: 'storeCode', label: '영업장코드', type: 'text' },
        { key: 'storeName', label: '영업장명', type: 'text' },
        { key: 'useYn', label: '판매중인 상품만 보기', type: 'boolean', trueValue: 'Y', defaultValue: 'Y' }
      ]
    },
    ...mapGetters({
      user: 'auth/user'
    })
  },
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 20,
        total: 0
      },
      list: [],
      headers: [
        { text: '지역 명(코드)', value: 'local', align: 'center', sortable: false },
        { text: '영업장 명(코드)', value: 'store', align: 'center', sortable: false },
        { text: '판매 시작', value: 'saleStartDate', align: 'center', sortable: false },
        { text: '판매 종료', value: 'saleEndDate', align: 'center', sortable: false },
        { text: '블럭코드', value: 'blockCode', align: 'center', sortable: false },
        { text: '판매유무', value: 'useYn', align: 'center', sortable: false }
      ]
    }
  },
  methods: {
    checkPartner () {
      if (this.isPartner) {
        this.searchParam.q.partnerSeq = this.user.number
      }
    },

    search () {
      this.getRoomTypeList()
    },

    async getRoomTypeList () {
      this.checkPartner()
      const response = await roomTypeService.selectRoomTypeInformationList(this.searchParam)
      const items = response.data
      this.list = items
      this.searchParam.total = response.pagination.total
    },

    openDialog (event) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Room/Container',
        params: {
          getRoomTypeList: this.getRoomTypeList,
          storeCode: event.storeCode,
          isEdit: !!event.storeCode
        },
        options: {
          fullscreen: true,
          scrollable: true,
          dense: true
        }
      })
    },

    openPartnerExceptionBatchSettingDialog (event) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Room/PartnerExceptionBatchSettingDialog',
        params: {
          getRoomTypeList: this.getRoomTypeList,
          storeCode: event.storeCode,
          isEdit: !!event.storeCode
        },
        options: {
          fullscreen: false,
          scrollable: true,
          dense: true,
          width: 1200
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
