<template>
  <dialog-base :instance="instance" :title="'PMS 객실 상품 연결'">
    <template v-slot:buttons>
      <v-btn dark text @click="save()">
        <v-icon left>check</v-icon>저장
      </v-btn>
    </template>
    <only-room-info-component v-if="originRoomInfo && originRoomInfo.storeCode"
                              type = "view"
                              :storeId="originRoomInfo.storeId"
                              :viewStoreCode="originRoomInfo.storeCode"
                              :originRoomInfo="originRoomInfo"
    ></only-room-info-component>
    <only-room-info-component v-else
                              type = "view"
                              :storeId="originRoomInfo.storeId"
    ></only-room-info-component>
  </dialog-base>
</template>

<script>
import itemService from '@/api/modules/naver/item.service'
import DialogBase from '@/components/Dialog/DialogBase.vue'
import { mapGetters } from 'vuex'
import OnlyRoomInfoComponent from './OnlyRoomInfoComponent'

export default {
  extends: DialogBase,
  name: 'RoomSettingModal',
  components: {
    OnlyRoomInfoComponent
  },
  data: function () {
    return {
      originRoomInfo: {
        storeId: '',
        itemId: '',
        mid: '',
        storeCode: '',
        roomTypeCode: '',
        blockCode: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      roomInfo: 'naver/roomInfo'
    })
  },
  created () {
    this.$store.dispatch('naver/setRoomInfo', {
      storeId: this.instance.params.dgnsItemInfo.storeId,
      itemId: this.instance.params.dgnsItemInfo.itemId,
      mid: this.instance.params.dgnsItemInfo.mid,
      storeCode: this.instance.params.dgnsItemInfo.storeCode,
      roomTypeCode: this.instance.params.dgnsItemInfo.roomTypeCode,
      blockCode: this.instance.params.dgnsItemInfo.blockCode
    })
    this.$nextTick(() => {
      this.originRoomInfo = _.cloneDeep(this.roomInfo)
    })
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{
        target: 'escape',
        action: this.close
      }]
    })
  },
  methods: {
    save () {
      if (!this.roomInfo.roomTypeCode || !this.roomInfo.storeCode) {
        this.$dialog.alert('객실을 선택해주세요.')
        return
      } else if (!this.roomInfo.mid) {
        this.$dialog.alert('회원코드를 입력해주세요.')
        return
      } else if (!this.roomInfo.blockCode) {
        this.$dialog.alert('블럭코드를 선택해주세요.')
        return
      }
      this.$dialog.confirm('PMS 상품 연결을 하시겠습니까?<br />저장시 상품의 재고/가격이 PMS 재고/가격 기준으로 일괄 변경됩니다.').then(() => {
        const dgnsItemInfo = {
          storeId: this.roomInfo.storeId,
          itemId: this.roomInfo.itemId,
          mid: this.roomInfo.mid,
          storeCode: this.roomInfo.storeCode,
          roomTypeCode: this.roomInfo.roomTypeCode,
          blockCode: this.roomInfo.blockCode,
          packageYn: 'N'
        }
        itemService.updateDgnsItemInfo(this.roomInfo.itemId, dgnsItemInfo).then(() => {
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
    }
  }
}
</script>
