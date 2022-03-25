<template>
  <dialog-base :instance="instance" :title="'객실 정보 비교'">
    <v-alert dense outlined type="success" class="font-sm">
      정보가 다를 시 <v-chip class="grey lighten-3" label>색상</v-chip>으로 표시 됩니다.
    </v-alert>
    <v-row>
      <v-col cols="6" class="border">
        <v-alert dense outlined type="info" class="font-sm">
          [소노] 객실 정보
        </v-alert>
        <item-info-component v-if="isItemInfo" :originItemInfo="itemDBInfo" :isReadonly="isReadonly"></item-info-component>
      </v-col>
      <v-col cols="6" class="border">
        <v-alert dense outlined type="info" class="font-sm">
          [네이버 예약 파트너센터] 객실 정보
        </v-alert>
        <item-info-component v-if="isItemInfo" :originItemInfo="itemNaverInfo" :isReadonly="isReadonly"></item-info-component>
      </v-col>
    </v-row>
    <template v-slot:actions>
      <v-btn outlined rounded color="primary" @click="close()"><v-icon left>close</v-icon>닫기</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import itemService from 'Api/modules/naver/item.service'
import DialogBase from 'Components/Dialog/DialogBase.vue'
import ItemInfoComponent from './ItemInfoComponent'

export default {
  extends: DialogBase,
  name: 'ItemCompareModal',
  components: {
    ItemInfoComponent
  },
  data: function () {
    return {
      dmItemId: '',
      itemDBInfo: {},
      itemNaverInfo: {},
      isItemInfo: false,
      isReadonly: true
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
    this.dmItemId = this.instance.params.dmItemId
    this.$nextTick(() => {
      if (this.dmItemId) {
        itemService.compareItem(this.dmItemId).then(res => {
          if (res.data && res.data.length === 2) {
            this.itemDBInfo = res.data[0]
            this.itemNaverInfo = res.data[1]
            this.isItemInfo = true

            for (const obj in this.itemNaverInfo) {
              if (!_.isArray(this.itemDBInfo[obj]) && _.isObject(this.itemDBInfo[obj])) {
                for (const childObj in this.itemDBInfo[obj]) {
                  this.$set(this.itemNaverInfo, 'isNotSame' + _.upperFirst(childObj), !_.isEqual(this.itemDBInfo[obj][childObj], this.itemNaverInfo[obj][childObj]))
                }
              } else {
                this.$set(this.itemNaverInfo, 'isNotSame' + _.upperFirst(obj), !_.isEqual(this.itemDBInfo[obj], this.itemNaverInfo[obj]))
              }
            }
          }
        })
      }
    })
  },
  methods: {
  }
}
</script>
