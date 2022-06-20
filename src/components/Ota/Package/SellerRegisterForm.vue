<template>
  <v-container fluid>
    <v-row>
      <app-card col-classes="col-12 box-shadow-none">
        <div class="app-card-title px-0">
          <div class="title font-weight-bold">판매대상 업체 지정</div>
          <v-spacer />
          <v-radio-group v-model="saleType"
                         row
                         class="justify-end mb-3"
                         hide-details
                         :readonly="!writeAuth"
          >
            <v-radio label="전체 판매" value="Y"></v-radio>
            <v-radio label="개별 판매" value="N"></v-radio>
          </v-radio-group>
        </div>
        <template v-if="saleType === 'N'">
          <v-row>
            <v-col>
              <v-radio-group v-model="saleCheckType"
                             row
                             class="justify-end mb-3"
                             hide-details
                             @change="changeSaleCheckType"
                             :readonly="!writeAuth"
              >
                <v-radio label="전체 적용" value="Y"></v-radio>
                <v-radio label="전체 미적용" value="N"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col v-if="writeAuth">
              <v-text-field
                  v-model="searchSalePartner"
                  append-icon="mdi-magnify"
                  :label="searchLabel"
                  single-line
                  hide-details
              />
            </v-col>
          </v-row>
          <v-data-table :no-data-text="emptyText"
                        :no-results-text="emptyText"
                        :headers="saleHeaders"
                        :items="salePartnerList"
                        :search="searchSalePartner"
                        class="bordered"
                        hide-default-footer
                        disable-sort
                        disable-pagination
                        fixed-header
                        height="500"
          >
            <template v-slot:item.existYn="{item}">
              <template v-if="saleType === 'Y'">
                <span>전체 판매</span>
              </template>
              <template v-else>
                <v-switch v-model="item.existYn"
                          true-value="Y"
                          false-value="N"
                          :label="item.existYn === 'Y'? '적 용': '미적용'"
                          :readonly="!writeAuth"
                          inset
                          color="info"
                          hide-details
                          class="my-0"
                />
              </template>
            </template>
          </v-data-table>
        </template>
      </app-card>
    </v-row>
  </v-container>
</template>

<script>
import packageService from '@/api/modules/ota/package.service'
import {mapGetters} from 'vuex'

export default {
  name: 'SellerRegisterForm',
  props: {
    isEdit: Boolean,
    packageNoProp: String
  },
  data: function () {
    return {
      packageNo: '',
      packageInformation: {},

      saleType: 'Y',

      saleCheckType: 'N',
      searchSalePartner: '',
      saleHeaders: [
        { text: '판매여부', value: 'existYn', align: 'center', width: '20%' },
        { text: '업체 명', value: 'partnerName', align: 'start', width: '80%' }
      ],
      salePartnerList: []
    }
  },
  mounted () {
    this.packageNo = this.packageNoProp
    this.getPackageInformation()
  },
  computed: {
    applySalePartnerList () {
      // 판매대상업체 "전체" 지정일 경우 모든 업체 출력
      // "개별" 지정일 경우 existYn이 Y인 업체만 출력
      return (this.saleType === 'Y') ? this.salePartnerList : this.salePartnerList.filter(partner => partner.existYn === 'Y')
    },
    ...mapGetters({ partnerYn: 'auth/partnerYn', user: 'auth/user' })
  },
  methods: {
    getPackageInformation () {
      packageService.selectRoomPackageInformation(this.packageNo).then((response) => {
        this.packageInformation = response.data
        this.saleType = this.packageInformation.allSaleYn === 'Y' ? 'Y' : 'N'
        this.getSalePartnerList()
      })
    },

    getSalePartnerList () {
      let partnerSeq = this.user.number
      if (this.isPartner !== true) {
        partnerSeq = null
      }

      packageService.selectPartnerList(this.packageNo, partnerSeq).then((response) => {
        this.salePartnerList = response.data
      })
    },

    changeSaleCheckType () {
      for (const salePartner of this.salePartnerList) {
        salePartner.existYn = (this.saleCheckType === 'Y') ? 'Y' : 'N'
      }
    },

    async save () {
      if (this.applySalePartnerList.length === 0) {
        this.$dialog.alert('판매 대상 업체가 존재하지 않습니다.')
        return
      }

      if (this.saleType === 'Y') {
        // 신규생성이므로 삭제 액션 필요없음.
        await packageService.updateRoomPackageSaleType(this.packageNo, 'Y')
        this.$emit('nextStep', 'HolidayInformation')
      } else {
        // 개별적용의 경우
        const submitList = []
        this.salePartnerList.filter(partner => partner.existYn === 'Y').forEach((partner) => {
          submitList.push({
            packageNo: this.packageNo,
            partnerSeq: partner.partnerSeq,
            useYn: 'Y'
          })
        })

        // 패키지 allSaleYn을 "N"으로 변경 후 파트너 데이터 insert
        await packageService.updateRoomPackageSaleType(this.packageNo, 'N')
        await packageService.insertSalePartnerList(submitList)
        this.$emit('nextStep', 'HolidayInformation')
      }
    },

    async update () {
      if (this.applySalePartnerList.length === 0) {
        this.$dialog.alert('판매 대상 업체가 존재하지 않습니다.')
        return
      }

      const responseObject = await packageService.selectPackageRoomTypeList(this.packageNo)
      const data = responseObject.data
      const existY = data.filter(obj => obj.otaExistYn === 'Y').length

      if (existY === 0) {
        this.$dialog.alert('판매객실이 등록되어있지 않습니다.\r\n판매객실 등록 후 다시 시도해주세요.')
        this.$emit('nextStep', 'RoomTypeInformation')
        return
      }

      if (this.saleType === 'Y') {
        // 파트너 insert 데이터 삭제 후 allSaleYn을 Y로 변경한다.
        await packageService.deleteSalePartnerList(this.packageNo)
        await packageService.updateRoomPackageSaleType(this.packageNo, 'Y')
        this.$dialog.alert('수정이 완료되었습니다.')
      } else {
        // 개별적용 수정의 경우
        const submitList = []
        this.salePartnerList.filter(partner => partner.existYn === 'Y').forEach((partner) => {
          submitList.push({
            packageNo: this.packageNo,
            partnerSeq: partner.partnerSeq,
            useYn: 'Y'
          })
        })

        // 패키지 allSaleYn을 "N"으로 변경 후 파트너 데이터 update
        await packageService.updateRoomPackageSaleType(this.packageNo, 'N')
        await packageService.updateSalePartnerList(submitList)
        this.$dialog.alert('수정이 완료되었습니다.')
      }
    }
  }
}
</script>
