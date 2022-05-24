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
        <template v-slot:item.roomCount="{item}">
          <v-text-field
              label="최대 예약가능 객실 수"
              v-model="item.roomCount"
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
import DialogBase from '@/components/Dialog/DialogBase.vue'
import roomTypeService from '@/api/modules/ota/roomType.service'

export default {
  extends: DialogBase,
  name: 'PartnerExceptionBatchSettingDialog',
  data () {
    return {
      partnerListHeader: [
        { text: '파트너 번호', value: 'partnerSeq', align: 'center', sortable: false },
        { text: '파트너 명', value: 'companyName', align: 'center', sortable: false },
        { text: '최대 예약가능 객실 수', value: 'roomCount', align: 'center', sortable: false },
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
    getPartnerList () {
      roomTypeService.selectPartnerList().then(res => {
        this.partnerList = res.data
      })
    },

    saveSetting (item) {
      this.$dialog.confirm('모든 영업장에 해당 설정을 적용하시겠습니까?').then(() => {
        roomTypeService.insertStoreAllPartnerExceptSetting(item).then(res => {
          if (res.data === true) {
            this.$dialog.alert('적용되었습니다.')
          }
        })
      })
    }
  }
}
</script>
