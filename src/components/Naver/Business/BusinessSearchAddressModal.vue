<template>
  <dialog-base :instance="instance" right title="주소 검색">
    <v-alert dense outlined type="info" class="mt-2 font-sm">
      주소 검색을 상세하게 해주세요. 5개까지 검색됩니다.
    </v-alert>
    <v-card-text class="pt-0" style="height: 400px;">
      <v-row>
        <v-col cols="10">
          <v-text-field v-model="addressText" append-icon="search" clearable label="주소 검색" hide-details @keypress.enter="searchAddress"></v-text-field>
        </v-col>
        <v-col cols="2" align-self="center" class="text-right pl-0">
          <v-btn outlined rounded color="info" @click="searchAddress">
            <v-icon left>search</v-icon>검색</v-btn>
        </v-col>
      </v-row>
      <v-data-table
        :no-data-text="'주소 검색을 상세하게 해주세요.'"
        :no-results-text="'검색 결과가 없습니다.'"
        :headers="headers"
        :items="addressList"
        disable-sort disable-pagination hide-default-footer
        class="bordered">
        <template v-slot:item.select="{ item }">
          <v-btn outlined rounded small color="info" @click="selectAddress(item)">
            선택
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import service from 'Api/modules/naver/business.service'

export default {
  extends: DialogBase,
  name: 'BusinessSearchAddressModal',
  data () {
    return {
      headers: [
        { text: '선택', value: 'select', align: 'center', sortable: false },
        { text: '지번주소', value: 'address', align: 'center', sortable: false },
        { text: '도로명주소', value: 'roadAddress', align: 'center', sortable: false },
        { text: '위도', value: 'latitude', align: 'center', sortable: false },
        { text: '경도', value: 'longitude', align: 'center', sortable: false }
      ],
      addressText: '',
      addressList: []
    }
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{
        target: 'escape',
        action: this.close
      }]
    })
  },
  computed: {
  },
  methods: {
    searchAddress () {
      if (this.addressText) {
        service.getAddress(this.addressText).then(res => {
          this.addressList = res.data
        })
      }
    },
    selectAddress (param) {
      this.close({ data: param })
    }
  }
}
</script>
