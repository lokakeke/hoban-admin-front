<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      파트너 예외 일괄설정
    </template>

    <v-container fluid>
      <v-row>
        <v-col cols="4">
          <v-text-field
              hide-details
              label="파트너 검색"
              single-line
              v-model="searchPartner"
          />
        </v-col>
      </v-row>
      <v-data-table :headers="partnerListHeader"
                    :items="partnerList"
                    :items-per-page="itemsPerPage"
                    :no-data-text="emptyText"
                    :no-results-text="emptyText"
                    :page.sync="page"
                    :search="searchPartner"
                    @page-count="pageCount = $event"
                    class="bordered pointer"
                    hide-default-footer
      >
        <template v-slot:item.rmCnt="{item}">
          <v-text-field
              label="최대 예약가능 객실 수"
              v-model="item.rmCnt"
          />
        </template>
        <template v-slot:item.stayNights="{item}">
          <v-text-field
              label="최대 예약가능 박 수"
              v-model="item.stayNights"
          />
        </template>
        <template v-slot:item.regBtn="{item}">
          <v-btn @click="saveSetting(item)" color="info" outlined>
            <v-icon>done</v-icon> 저장
          </v-btn>
        </template>
      </v-data-table>
      <v-pagination :length="pageCount"
                    class="mt-2"
                    v-model="page" />
    </v-container>
  </dialog-base>
</template>

<script>
import DialogBase from "@/components/Dialog/DialogBase"
import roomTypeService from "Api/modules/ota/roomType.service"

export default {
  extends: DialogBase,
  name: 'PartnerExceptionBatchSettingDialog',
  data () {
    return {
      partnerListHeader: [
        { text: '파트너 번호', value: 'ptnrNo', align: 'center', sortable: false },
        { text: '파트너 명', value: 'ptnrNm', align: 'center', sortable: false },
        { text: '최대 예약가능 객실 수', value: 'rmCnt', align: 'center', sortable: false },
        { text: '최대 예약가능 박 수', value: 'stayNights', align: 'center', sortable: false },
        { text: '저장', value: 'regBtn', align: 'center', sortable: false }
      ],
      partnerList: [],
      searchPartner: '',

      page: 1,
      pageCount: 5,
      itemsPerPage: 5
    }
  },
  mounted () {
    this.getPartnerList()
  },
  methods: {
    async getPartnerList () {
      const response = await roomTypeService.selectPartnerList()
      this.partnerList = response.data
    },

    async saveSetting (item) {
      try {
        await this.$dialog.confirm('모든 영업장에 해당 설정을 적용하시겠습니까?')
        const response = await roomTypeService.insertStoreAllPartnerExceptSetting(item)
        if (response.data === true) {
          this.$dialog.alert('적용되었습니다.')
        }
      } catch (e) {}
    }
  }
}
</script>
