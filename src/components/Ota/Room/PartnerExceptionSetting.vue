<template>
  <v-container class="pa-0" fluid>
    <v-row>
      <v-col align-self="center" cols="6">
        <span class="title font-weight-bold" style="word-break: keep-all">파트너 예외 설정</span>
      </v-col>
      <v-col class="d-flex">
        <v-radio-group class="ml-auto"
                       hide-details
                       row
                       v-model="isExcept"
        >
          <v-radio label="예외 설정" value="Y" />
          <v-radio label="예외 설정 안함" value="N" />
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row v-show="isExcept === 'Y'">
      <v-col cols="12">
        <v-data-table :headers="partnerListHeader"
                      :items="partnerList"
                      :no-data-text="emptyText"
                      :no-results-text="emptyText"
                      class="bordered pointer"
                      disable-sort
                      fixed-header
                      height="500"
                      hide-default-footer
                      disable-pagination
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
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import roomTypeService from "Api/modules/ota/roomType.service"

export default {
  name: 'PartnerExceptionSetting',
  props: {
    isEdit: Boolean,
    storeCdProp: String
  },
  data () {
    return {
      partnerListHeader: [
        { text: '파트너 번호', value: 'ptnrNo', align: 'center', sortable: false },
        { text: '파트너 명', value: 'ptnrNm', align: 'center', sortable: false },
        { text: '최대 예약가능 객실 수', value: 'rmCnt', align: 'center', sortable: false },
        { text: '최대 예약가능 박 수', value: 'stayNights', align: 'center', sortable: false }
      ],
      partnerList: [],
      isExcept: 'N'
    }
  },
  computed: {
    exceptPartnerList () {
      return this.partnerList.filter(data => data.rmCnt || data.stayNights)
    }
  },
  mounted () {
    this.getPartnerList()
  },
  methods: {
    async getPartnerList () {
      const response = await roomTypeService.selectStoreInPartnerList(this.storeCdProp)
      this.partnerList = response.data

      this.isExcept = this.exceptPartnerList.length > 0 ? 'Y' : 'N'
    },

    async save () {
      if (this.isExcept === 'N') {
        this.$emit('nextStep', 'RoomTypeInformation')
        return
      }

      if (this.exceptPartnerList.length === 0) {
        this.$dialog.alert('예외를 적용한 파트너사가 존재하지 않습니다.')
        return
      }

      const response = await roomTypeService.insertStorePartnerExceptSetting(this.storeCdProp, this.exceptPartnerList)
      if (response.data === true) {
        this.$emit('nextStep', 'RoomTypeInformation')
      } else {
        this.$dialog.alert('오류가 발생했습니다.')
      }
    },

    async update () {
      try {
        await roomTypeService.insertStorePartnerExceptSetting(this.storeCdProp, this.exceptPartnerList)
        this.$dialog.alert('수정이 완료되었습니다.')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
