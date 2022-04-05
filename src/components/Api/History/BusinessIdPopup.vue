<template>
    <dialog-base :instance="instance" :title="'Business Id & 파트너 명 조회'">
        <v-form ref="form" lazy-validation autocomplate="off">
            <search-form :search-param.sync="searchParam" :search-list="searchList" @search="search" disable-pagination
                         init-search />
            <v-row>
                <v-col>
                    <v-data-table title="파트너 목록" :headers="headers" :items="partnerList"
                                  @click:row="choosePartner($event)" disable-sort disable-pagination hide-default-footer
                                  :no-data-text="'검색 결과가 없습니다.'">
                        <template v-slot:item.useYn="{ item }">
                            <v-simple-checkbox v-model="item.flag" disabled />
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="text-right">
                    <v-btn outlined rounded color="primary" @click="close">닫기(ESC)</v-btn>
                </v-col>
            </v-row>
        </v-form>
    </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import service from '@/api/modules/api/apiHistory.service'

export default {
  extends: DialogBase,
  name: 'BusinessIdPopup',
  computed: {
    searchList () {
      return [
        { key: 'businessId', label: 'Business Id', type: 'text', defaultValue: this.businessId, cols: 4 },
        { key: 'ptnrName', label: '파트너 명', type: 'text', cols: 4 },
        {
          key: 'taskType',
          label: '구분값',
          type: 'select',
          list: this.serviceList,
          listValue: 'taskType',
          listText: 'apiName',
          cols: 4
        }
      ]
    }
  },
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      headers: [
        { text: 'No', value: 'number', align: 'center' },
        { text: 'Business Id', value: 'businessId', align: 'center' },
        { text: '파트너 명', value: 'ptnrName', align: 'center' },
        { text: '구분값', value: 'apiName', align: 'center' }
      ],
      businessId: '',
      partnerList: [],
      serviceList: []
    }
  },
  mounted () {
    this.businessId = _.cloneDeep(this.instance.params.item)
    this.selectSvcList()
  },
  methods: {
    search () {
      service.selectPartnerList(this.searchParam).then(res => {
        this.noPartnerList(res.data)
      })
    },
    selectSvcList () {
      service.selectCommCodeForPartner().then(res => {
        this.serviceList = res.data
      })
    },
    choosePartner (row) {
      this.close({ data: row })
    },
    noPartnerList (param) {
      if (param.length === 0) {
        this.$dialog.alert('조건에 해당하는 자료가 없습니다.')
        this.partnerList = param
      } else {
        this.partnerList = param
        for (let i = 1; i < param.length + 1; i++) {
          this.partnerList[i - 1].number = i
        }
      }
    }
  }
}
</script>
