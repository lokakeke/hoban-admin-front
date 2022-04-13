<template>
    <dialog-base :instance="instance" :title="'파트너 담당자 검색'">
        <search-form :search-param.sync="searchParam" :search-list="searchList" @search="search" :cols="4"
                     disable-pagination :init-search="initSearch"></search-form>
        <v-data-table :no-data-text="emptyText" :headers="headers" :items="list" item-key="regionCode" disable-pagination
                      hide-default-footer class="click-row" @click:row="select($event)">
            <template v-slot:item.telNo="{ item }">
                <mask-tel-number :text="item.telNo" @search="viewTelNo(item)" />
            </template>
        </v-data-table>
        <template v-slot:actions>
            <v-btn outlined rounded color="primary" @click="close()">
                <v-icon left>close</v-icon>
                닫기
            </v-btn>
        </template>
    </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import partnerManagerService from '@/api/modules/partner/partnerManager.service'
import MaskTelNumber from '@/components/Mask/MaskTelNumber.vue'

export default {
  extends: DialogBase,
  components: { MaskTelNumber },
  name: 'PartnerChargeSearch',
  data () {
    return {
      searchParam: {
        q: {}
      },
      partnerSeq: '',
      disabled: false,
      initSearch: false,
      list: [],
      headers: [
        { text: '담당자 ID', value: 'ptnrChrgId', align: 'center' },
        { text: '담당자 명', value: 'chrgName', align: 'center' },
        { text: '전화 번호', value: 'telNo', align: 'center' },
        { text: '이메일', value: 'email', align: 'center' }
      ]
    }
  },
  mounted () {
    if (this.instance.params.partnerSeq) {
      this.partnerSeq = parseInt(this.instance.params.partnerSeq)
      this.disabled = true
      this.initSearch = true
    }
  },
  computed: {
    searchList () {
      return [
        {
          key: 'partnerSeq',
          label: '파트너 선택',
          type: 'partner',
          required: true,
          defaultValue: this.partnerSeq,
          disabled: this.disabled
        }
      ]
    }
  },
  methods: {
    search () {
      // 조회
      partnerManagerService.selectPartnerManagerList(this.searchParam.q.partnerSeq).then(res => {
        this.list = res.data
      })
    },
    async viewTelNo (item) {
      const res = await partnerManagerService.selectPartnerManagerDetail({
        partnerSeq: item.partnerSeq,
        ptnrChrgId: item.ptnrChrgId
      })
      item.telNo = res.data.telNo
    },
    select (row) {
      if (row.partnerSeq && row.ptnrChrgId) {
        this.$dialog.confirm(`${row.chrgName} 을 선택 하시겠습니까?`).then(() => {
          this.close({ data: row })
        })
      }
    }
  }
}
</script>
