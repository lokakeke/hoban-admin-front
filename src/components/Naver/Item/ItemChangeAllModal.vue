<template>
  <dialog-base :instance="instance" :title="'전체설정 변경'">
    <v-row no-gutters>
      <v-col cols="12">
        <v-list-item three-line class="height-auto px-0">
          <v-list-item-content class="pt-0">
            <v-row justify="space-between">
              <v-col cols="8" class="pb-0">
                <v-list-item-title class="headline fw-bold">
                  객실 노출
                </v-list-item-title>
              </v-col>
              <v-col cols="4" class="no-gutter pb-0">
                <v-card-actions>
                  <v-btn outlined text @click="changeAllImp('Y')">노출</v-btn>
                  <v-btn outlined text @click="changeAllImp('N')">미노출</v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
            <v-list-item-action-text>전체 객실을 한 번에 노출/미노출 할 수 있습니다.</v-list-item-action-text>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="12">
        <v-list-item three-line class="height-auto px-0">
          <v-list-item-content class="border-top">
            <v-row justify="space-between">
              <v-col cols="4" class="pb-0">
                <v-list-item-title class="headline fw-bold">
                  네이버페이 적용
                </v-list-item-title>
              </v-col>
              <v-col cols="8" class="py-0">
                <v-alert dense outlined type="error" class="font-sm">
                  [네이버 예약 파트너센터] 에서<br />관리하시기 바랍니다.
                </v-alert>
              </v-col>
            </v-row>
            <v-list-item-action-text>전체 객실에 네이버페이를 한 번에 적용/미적용 할 수 있습니다.</v-list-item-action-text>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="12">
        <v-list-item three-line class="height-auto px-0">
          <v-list-item-content class="border-top">
            <v-row justify="space-between">
              <v-col cols="4" class="pb-0">
                <v-list-item-title class="headline fw-bold">
                  예약 확정방식
                </v-list-item-title>
              </v-col>
              <v-col cols="8" class="py-0">
                <v-alert dense outlined type="error" class="font-sm">
                  [네이버 예약 파트너센터] 에서<br />관리하시기 바랍니다.
                </v-alert>
              </v-col>
            </v-row>
            <v-list-item-action-text>전체 객실의 확정 방식을 한 번에 변경할 수 있습니다.<br />단, 네이버페이 적용 객실의 확정방식은 '예약 신청과 동시에 확정'에서 변경할 수 없습니다.</v-list-item-action-text>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
  </dialog-base>
</template>

<script>
import service from "Api/modules/naver/item.service"
import DialogBase from "@/components/Dialog/DialogBase"

export default {
  extends: DialogBase,
  name: 'ItemChangeAllModal',
  components: {},
  data: function () {
    return {
      itemList: []
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
    this.itemList = this.instance.params.list
  },
  methods: {
    changeAllImp (isImp) {
      const text = isImp === 'Y' ? '전체 객실을 예약서비스에서 노출하시겠습니까?' : '전체 객실을 예약서비스에서 미노출하시겠습니까? 미노출된 객실은 예약이 불가합니다.'
      this.$dialog.confirm(text).then(() => {
        const dmItemIdList = this.itemList.map(item => item.dmItemId).join(',')
        const param = {
          dmStoreId: this.itemList[0].dmStoreId,
          dmItemIds: dmItemIdList,
          isImp: isImp
        }
        service.patchItem(param).then(() => {
          this.close()
          const snackbarObj = { type: 'success', text: `전체 객실이 [${isImp === 'Y' ? '노출' : '미노출'}]되었습니다.` }
          this.instance.params.search(snackbarObj)
        }).catch(() => {
          this.close()
          this.instance.params.search()
        })
      })
    }
  }
}
</script>
<style scoped>
  .ghost {
    color: #FFFFFF;
    background: #e0e0e0;
  }
</style>
