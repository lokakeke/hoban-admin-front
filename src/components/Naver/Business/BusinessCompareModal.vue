<template>
  <dialog-base :instance="instance" :title="'서비스 정보 비교'">
    <template v-slot:buttons>
    </template>
    <v-alert dense outlined type="success" class="font-sm">
      정보가 다를 시 <v-chip class="grey lighten-3" label>색상</v-chip>으로 표시 됩니다.
    </v-alert>
    <v-row class="ma-0">
      <v-col cols="6">
        <v-alert dense outlined type="info" class="font-sm">
          [소노] 서비스 정보
        </v-alert>
        <business-info-component
          v-if="form"
          :origin-business-info="form[0]"
          :amenity-items="instance.params.amenityItems"
          :loading="instance.params.loading"
          :addr-form-open="instance.params.addrFormOpen"
          :readonly="instance.params.readonly"
        ></business-info-component>
      </v-col>
      <v-col cols="6" :style="{'border-left':'1px solid #ddd'}">
        <v-alert dense outlined type="info" class="font-sm">
          [네이버 예약 파트너센터] 서비스 정보
        </v-alert>
        <business-info-component
          v-if="form"
          :origin-business-info="form[1]"
          :amenity-items="instance.params.amenityItems"
          :loading="null"
          :addr-form-open="instance.params.addrFormOpen"
          :readonly="instance.params.readonly"
        ></business-info-component>
      </v-col>
    </v-row>
    <template v-slot:actions>
      <v-btn outlined rounded color="primary" @click="close()"><v-icon left>close</v-icon>닫기</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import BusinessInfoComponent from './BusinessInfoComponent'
import service from 'Api/modules/naver/business.service'

export default {
  extends: DialogBase,
  name: 'BusinessCompareModal',
  components: {
    BusinessInfoComponent
  },
  data: () => ({
    form: null
  }),
  computed: {
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{
        target: 'escape',
        action: this.close
      }]
    })
    this.inits()
  },
  methods: {
    inits () {
      service.compareBusiness(this.instance.params.dmStoreId).then(res => {
        this.form = res.data
        const park = this.form[1].businessParkingInfoList.parkingInfoSetting
        this.form[1].businessParkingInfoList = [
          {
            basicChargeIsFree: park.parkingCharge.basicCharge.isFree === true ? 'Y' : 'N',
            basicChargePrice: park.parkingCharge.basicCharge.price,
            basicChargeTime: park.parkingCharge.basicCharge.time,
            chargingTypeCode: park.parkingCharge.chargingTypeCode,
            dmStoreId: res.data[0].dmStoreId,
            extraChargePrice: park.parkingCharge.extraCharge.price,
            extraChargeTime: park.parkingCharge.extraCharge.time,
            isFreeParking: park.isFreeParking === true ? 'Y' : 'N',
            isParkingSupported: park.isParkingSupported === true ? 'Y' : 'N',
            maxPrice: park.parkingCharge.maxPrice,
            parkingInfoDetail: park.parkingInfoDetail === '' ? null : park.parkingInfoDetail,
            valetParkingPrice: park.valetParking.price,
            valetParkingType: park.valetParking.valetParkingType
          }
        ]
        this.form[1].eventDescJson = [
          {
            dmStoreId: res.data[0].dmStoreId,
            desc: this.form[1].eventDescJson[0].desc === '' ? null : this.form[1].eventDescJson[0].desc,
            isImpPeriod: this.form[1].eventDescJson[0].isImpPeriod === true ? 'Y' : 'N',
            impStartDate: this.form[1].eventDescJson[0].impStartDate,
            impEndDate: this.form[1].eventDescJson[0].impEndDate,
            isEventPeriod: this.form[1].eventDescJson[0].isEventPeriod === true ? 'Y' : 'N',
            eventStartDate: this.form[1].eventDescJson[0].eventStartDate,
            eventEndDate: this.form[1].eventDescJson[0].eventEndDate
          }
        ]
        this.form[1].addressJson = {
          jibun: this.form[1].addressJson.jibun,
          roadAddr: this.form[1].addressJson.roadAddr,
          detail: this.form[1].addressJson.detail
        }
        this.form[1].phoneInformationJson.phoneListStr = this.form[1].phoneInformationJson.phoneList[0]
        if (this.form && this.form.length === 2) {
          for (const obj in this.form[1]) {
            this.$set(this.form[1], 'isNotSame' + _.upperFirst(obj), !_.isEqual(this.form[0][obj], this.form[1][obj]))
          }
        }
      })
    }
  }
}
</script>
