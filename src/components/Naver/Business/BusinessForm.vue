<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      {{ '서비스 ' + `${ instance.params.storeId ? '상세정보 / 수정' : '등록' }` }}
      <v-chip small v-if="form && form.businessId" class="pt-0 ml-2">BusinessId : {{ form.businessId }}</v-chip>
    </template>
    <template v-slot:buttons>
      <v-btn dark text @click="setBusinessOne">
        <v-icon left>check</v-icon>
        {{ instance.params.storeId ? '수정': '등록' }}
      </v-btn>
    </template>
    <v-card-text class="pa-0">
      <business-info-component
        v-if="form && amenityItems && amenityItems.length > 0"
        ref="form"
        :origin-business-info="form"
        :amenity-items="amenityItems"
        :addr-form-open="addrFormOpen"
      ></business-info-component>
      <v-row>
        <v-col cols="10" class="text-right mt-5 pt-5 mb-5">
          <v-btn outlined rounded color="info" @click="setBusinessOne">
            <v-icon>check</v-icon>
            {{ instance.params.storeId !== '' ? '수정하기' : '등록하기' }}
          </v-btn>
          <v-btn outlined rounded color="primary" @click="close()">
            <v-icon>close</v-icon>닫기
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </dialog-base>
</template>

<script>
import service from '@/api/modules/naver/business.service'
import DialogBase from '@/components/Dialog/DialogBase.vue'
import BusinessInfoComponent from './BusinessInfoComponent'

export default {
  extends: DialogBase,
  name: 'BusinessForm',
  components: {
    BusinessInfoComponent
  },
  data: () => ({
    /**
     * 영업장 정보
     */
    form: null,
    /**
     * 부가 정보
     */
    amenityItems: []
  }),
  computed: {
  },
  methods: {
    /**
     * 주소 팝업 열기
     */
    addrFormOpen () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Naver/Business/BusinessAddressForm',
        options: {
          fullscreen: false,
          persistent: true,
          width: 800,
          scrollable: true,
          /**
           * 선택된 주소 붙여주기
           */
          closeCallback: (params) => {
            if (params && params.data) {
              this.form.addressJson = {
                jibun: params.data.item01,
                roadAddr: params.data.item02,
                posLat: params.data.item03,
                posLong: params.data.item04,
                zoomLevel: params.data.item05,
                detail: params.data.commonCodeDesc
              }
            }
          }
        }
      })
    },
    /**
     * 선택된 영업장 정보 불러오기
     */
    getBusinessOne (storeId) {
      service.selectBusiness(storeId).then(res => {
        this.form = res.data
      })
    },
    setBusinessOne () {
      this.$refs.form.setValidate().then(() => {
        this.$dialog.confirm('사업장을 ' + (this.instance.params.storeId !== '' ? '수정' : '등록') + ' 하시겠습니까?' +
          (this.instance.params.storeId ? '<p style="color: red;">수정시 네이버 예약 파트너센터의 정보를 수정하게 됩니다.</p>' : ''))
          .then(() => {
            /**
             * 선택된 영업장 정보 수정하기
             */
            if (this.instance.params.storeId !== '') {
              this.$refs.form.setParsingBusiness()
              service.updateBusiness(this.form).then(res => {
                this.$dialog.alert('수정되었습니다')
                this.instance.params.search()
              }).catch((error) => {
                if (!(error.response && error.response.status === 422)) {
                  this.close()
                  this.instance.params.search()
                }
              })
            } else {
              /**
               * 새로운 영업장 정보 등록하기
               */
              this.$refs.form.setParsingBusiness()
              service.insertBusiness(this.form).then(res => {
                this.$dialog.alert('등록되었습니다')
                this.close()
                this.instance.params.search()
              }).catch((error) => {
                if (!(error.response && error.response.status === 422)) {
                  this.close()
                  this.instance.params.search()
                }
              })
            }
          })
      }).catch(() => {
      })
    },
    /**
     * 부가정보 요소 세팅
     */
    setAdditionalItem () {
      service.selectAdditionalItem().then(res => {
        this.amenityItems = res.data
      })
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
    this.setAdditionalItem()
    /**
     * 선택된 영업장 보기
     */
    if (this.instance.params.storeId !== '') {
      this.getBusinessOne(this.instance.params.storeId)
    /**
     * 새로운 영업장 등록
     */
    } else {
      this.form = {
        name: '(주)호반호텔&리조트',
        serviceName: '',
        desc: '',
        reprOwnerName: '-',
        addressJson: {
          jibun: '',
          roadAddr: '',
          detail: '',
          posLat: '',
          posLong: '',
          zoomLevel: ''
        },
        email: 'hoban@hoban.com',
        phoneInformationJson: {
          wiredPhone: '1600-0060',
          reprPhone: '1600-0060',
          phoneList: [],
          phoneListStr: ''
        },
        promotionDesc: '',
        websiteUrl: '',
        eventDescJson: [
          {
            desc: '',
            isImpPeriod: 'N',
            impStartDate: '',
            impEndDate: '',
            isEventPeriod: 'N',
            eventStartDate: '',
            eventEndDate: ''
          }
        ],
        businessParkingInfoList: [
          {
            isParkingSupported: 'Y',
            isFreeParking: 'N',
            chargingTypeCode: 'HOURS',
            basicChargeTime: '',
            basicChargePrice: '',
            basicChargeIsFree: 'N',
            extraChargeTime: '',
            extraChargePrice: '',
            maxPrice: '',
            valetParkingType: 'CHARGED',
            valetParkingPrice: '',
            parkingInfoDetail: ''
          }
        ],
        displaySettingJson: {
          backgroundColor: '#563d2a',
          bizItemListingType: 'IMAGE'
        },
        businessAmenityJson: []
      }
    }
  }
}
</script>
