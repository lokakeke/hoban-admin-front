<template>
    <dialog-base :instance="instance" :title="'객실 등록'">
        <template v-slot:buttons>
            <v-btn dark text @click="save()" :disabled="isDisabledSave">
                <v-icon left>check</v-icon>
                등록
            </v-btn>
        </template>
        <div class="app-card border">
            <div class="app-card-content" style="height: inherit;">
                <v-card outlined class="mb-1">
                    <v-card-title>
                        객실 정보
                    </v-card-title>
                    <v-card-text class="black--text pt-0">
                        회원번호 : {{ itemInfo.mid }}
                    </v-card-text>
                    <v-card-text class="black--text pt-0">
                        영업장명 : {{ itemInfo.storeNm }}
                    </v-card-text>
                    <v-card-text class="black--text pt-0">
                        객실타입명 : {{ itemInfo.rmTypeNm }} ({{ itemInfo.rmTypeCd }})
                    </v-card-text>
                    <v-card-text class="black--text pt-0">
                        블럭코드 : {{ itemInfo.rsvBlckCd }}
                    </v-card-text>
                </v-card>
                <item-info-component :originItemInfo="itemInfo" ref="itemInfo"></item-info-component>
            </div>
        </div>
        <common-snackbars :text="snackbarText" v-model="isShowSnackbar" :type="snackbarType"></common-snackbars>
    </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase'
import ItemInfoComponent from 'Components/Naver/Item/ItemInfoComponent.vue'
import CommonSnackbars from 'Components/Common/CommonSnackbars.vue'
import itemService from 'Api/modules/naver/item.service'

export default {
  extends: DialogBase,
  name: 'ItemAddModal',
  components: {
    ItemInfoComponent,
    CommonSnackbars
  },
  data: function () {
    return {
      itemInfo: {
        dmItemId: '',
        bizItemId: '',
        dmStoreId: '',
        businessId: '',
        storeCd: '',
        rmTypeCd: '',
        pkgYn: '',
        mid: '',
        rsvBlckCd: '',
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
        }
      },
      parentWidth: 100,
      childWidth: 100,
      rowPerCols: 4,
      isShowSnackbar: false,
      snackbarType: 'success',
      snackbarText: '',
      isDisabledSave: false
    }
  },
  methods: {
    saveModal (list) {
      this.itemInfo.additionalInfos = list
    },
    async save () {
      try {
        try {
          this.itemInfo = await this.$refs.itemInfo.getData()
        } catch (err) {
          return
        }
        this.isDisabledSave = true
        await itemService.insertItem(this.itemInfo)
        await this.showSnackbar('success', '저장되었습니다.')
        setTimeout(() => {
          this.$router.go(0)
        }, 1500)
      } catch (error) {
        if (!(error.response && error.response.status === 422)) {
          setTimeout(() => {
            this.$router.go(0)
          }, 1500)
        } else {
          this.isDisabledSave = false
        }
      }
    },
    showSnackbar (type, text) {
      this.isShowSnackbar = true
      this.snackbarType = type
      this.snackbarText = text
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
    Object.assign(this.itemInfo, this.instance.params.itemInfo)
  }
}
</script>
<style scoped>
.ghost {
    color: #FFFFFF;
    background: #e0e0e0;
}
</style>
