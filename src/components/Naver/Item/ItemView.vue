<template>
  <dialog-base :instance="instance" :title="'객실 상세정보 / 수정'">
    <template v-slot:title>
      객실 상세정보 / 수정 <v-chip v-if="itemInfo && itemInfo.bizItemId" small class="pt-0 ml-2"> BusinessId : {{ itemInfo.businessId }} / BizItemId : {{ itemInfo.bizItemId }}</v-chip>
    </template>
    <template v-slot:buttons>
      <v-btn dark text @click="submit()">
        <v-icon left>check</v-icon>수정
      </v-btn>
    </template>
    <v-row>
      <v-col cols="6" offset="3">
        <v-row>
          <v-col cols="12" v-if="itemInfo && itemInfo.rmTypeCode">
            <v-card outlined>
              <v-card-title>
                {{ itemInfo.pkgYn === 'Y' ? '패키지' : '객실' }} 정보
              </v-card-title>
              <v-card-text class="black--text" v-if="itemInfo.pkgYn === 'Y'">
                패키지명 : {{ itemInfo.pkgName }} ({{ itemInfo.mid }})
              </v-card-text>
              <v-card-text class="black--text" v-if="itemInfo.pkgYn === 'N'">
                회원번호 : {{ itemInfo.mid }}
              </v-card-text>
              <v-card-text class="black--text pt-0">
                영업장명 : {{ itemInfo.storeName }} ({{ itemInfo.storeCode }})
              </v-card-text>
              <v-card-text class="black--text pt-0">
                객실타입명 : {{ itemInfo.rmTypeName }} ({{ itemInfo.rmTypeCode }})
              </v-card-text>
              <v-card-text class="black--text pt-0" v-if="itemInfo.pkgYn === 'Y'">
                시작/종료일 : {{ moment(itemInfo.pkgBgnYmd).format('YYYY.MM.DD') }} ~ {{ moment(itemInfo.pkgEndYmd).format('YYYY.MM.DD') }}
              </v-card-text>
              <v-card-text class="black--text pt-0">
                객실타입명 : {{ itemInfo.rsvBlckCode }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <item-info-component v-if="isItemInfo" :originItemInfo="itemInfo" ref="itemInfo"></item-info-component>
        <v-row justify="end">
          <v-btn outlined rounded color="info" @click="submit()"><v-icon left>check</v-icon>수정</v-btn>
          <v-btn outlined rounded color="primary" @click="close()"><v-icon left>close</v-icon>닫기</v-btn>
        </v-row>
      </v-col>
    </v-row>
  </dialog-base>
</template>

<script>
import itemService from '@/api/modules/naver/item.service'
import DialogBase from '@/components/Dialog/DialogBase.vue'
import ItemInfoComponent from './ItemInfoComponent'

export default {
  extends: DialogBase,
  name: 'ItemView',
  components: {
    ItemInfoComponent
  },
  data: function () {
    return {
      itemId: '',
      itemInfo: {
        itemId: '',
        bizItemId: '',
        storeId: '',
        businessId: '',
        storeCode: '',
        rmTypeCode: '',
        pkgYn: '',
        mid: '',
        rsvBlckCode: '',
        name: '',
        desc: '',
        order: 0,
        bookingPrecaution: '',
        minPersonCount: 1,
        maxPersonCount: '',
        additionalInfos: [],
        isImp: 'N',
        isNPayUsed: 'Y',
        minBookingTime: 1,
        maxBookingTime: 1,
        bookingCountSettingJson: {
          minBookingCount: 1,
          maxBookingCount: 1
        },
        pkgBgnYmd: '',
        pkgEndYmd: ''
      },
      moment: moment,
      isItemInfo: false
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
    this.itemId = this.instance.params.itemId
    this.$nextTick(() => {
      if (this.itemId) {
        itemService.selectItem(this.itemId).then(res => {
          delete res.data.additionalInfosStr
          this.itemInfo = res.data
          this.isItemInfo = true
        })
      }
    })
  },
  methods: {
    submit () {
      this.$refs.itemInfo.getData().then(() => {
        this.$dialog.confirm('객실 정보를 수정 하시겠습니까? <p style="color: red;">수정시 네이버 예약 파트너센터의 정보를 수정하게 됩니다.</p>').then(() => {
          this.itemInfo.itemId = this.itemId

          itemService.updateItem(this.itemInfo).then(res => {
            this.close()
            const snackbarObj = { type: 'success', text: '저장되었습니다' }
            this.instance.params.search(snackbarObj)
          }).catch((error) => {
            if (!(error.response && error.response.status === 422)) {
              this.close()
              this.instance.params.search()
            }
          })
        })
      }).catch(() => {
      })
    }
  }
}
</script>
