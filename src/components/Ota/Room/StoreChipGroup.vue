<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      영업장 선택
    </template>
    <v-container fluid>
      <v-row>
        <span class="blue--text font-weight-bold">※ 미등록 영업장만 검색됩니다.</span>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
              append-icon="mdi-magnify"
              hide-details
              label="검색 (영업장, 지역)"
              single-line
              v-model="searchStore"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
              :headers="headers"
              :items="filterItems"
              :no-data-text="emptyText"
              :no-results-text="emptyText"
              @click:row="selectStore($event)"
              class="pointer bordered"
              disable-sort
              hide-default-footer
          >
            <template v-slot:item.store="{item}">
              {{ item.storeName }} ({{ item.storeCode }})
            </template>
            <template v-slot:item.lcal="{item}">
              {{ item.lcalName }} ({{ item.lcalCode }})
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </dialog-base>
</template>

<script>
import roomTypeService from '@/api/modules/ota/roomType.service'
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'StoreChipGroup',
  data: function () {
    return {
      headers: [
        {
          text: '영업장 명 (코드)',
          value: 'store',
          align: 'center',
          sortable: false
        },
        {
          text: '지역 명 (코드)',
          value: 'lcal',
          align: 'center',
          sortable: false
        }
      ],
      items: [],
      filterList: [],
      searchStore: ''
    }
  },
  computed: {
    filterItems () {
      if (this.searchStore) {
        const keyword = this.searchStore.toLowerCase().replace(/\s/gi, '')
        return this.items.filter((data) => {
          const storeCode = (data.storeCode || '').toLowerCase().replace(/\s/gi, '')
          const storeName = (data.storeName || '').toLowerCase().replace(/\s/gi, '')
          const lcalCode = (data.lcalCode || '').toLowerCase().replace(/\s/gi, '')
          const lcalName = (data.lcalName || '').toLowerCase().replace(/\s/gi, '')
          return storeCode.indexOf(keyword) > -1 || storeName.indexOf(keyword) > -1 || lcalCode.indexOf(keyword) > -1 || lcalName.indexOf(keyword) > -1
        })
      } else {
        return this.items
      }
    }
  },
  mounted () {
    this.getStoreInformation()
  },
  methods: {
    async getStoreInformation () {
      const response = await roomTypeService.selectUnRegisteredStoreList()
      this.items = response.data
    },

    selectStore (event) {
      this.close(event)
    }
  }
}
</script>
