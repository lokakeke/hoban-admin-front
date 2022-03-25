<template>
  <dialog-base :instance="instance" :title="'DGNS 객실 상품 연결'">
    <template v-slot:buttons>
      <v-btn dark text @click="save()">
        <v-icon left>check</v-icon>저장
      </v-btn>
    </template>
    <only-room-info-component v-if="originRoomInfo && originRoomInfo.storeCd"
                              type = "view"
                              :dmStoreId="originRoomInfo.dmStoreId"
                              :viewStoreCd="originRoomInfo.storeCd"
                              :originRoomInfo="originRoomInfo"
    ></only-room-info-component>
    <only-room-info-component v-else
                              type = "view"
                              :dmStoreId="originRoomInfo.dmStoreId"
    ></only-room-info-component>
  </dialog-base>
</template>

<script>
import itemService from "Api/modules/naver/item.service"
import DialogBase from "@/components/Dialog/DialogBase"
import { mapGetters } from "vuex"
import OnlyRoomInfoComponent from "./OnlyRoomInfoComponent"

export default {
  extends: DialogBase,
  name: 'RoomSettingModal',
  components: {
    OnlyRoomInfoComponent
  },
  data: function () {
    return {
      originRoomInfo: {
        dmStoreId: '',
        dmItemId: '',
        mid: '',
        storeCd: '',
        rmTypeCd: '',
        rsvBlckCd: ''
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
      dmStoreId: this.instance.params.dgnsItemInfo.dmStoreId,
      dmItemId: this.instance.params.dgnsItemInfo.dmItemId,
      mid: this.instance.params.dgnsItemInfo.mid,
      storeCd: this.instance.params.dgnsItemInfo.storeCd,
      rmTypeCd: this.instance.params.dgnsItemInfo.rmTypeCd,
      rsvBlckCd: this.instance.params.dgnsItemInfo.rsvBlckCd
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
      if (!this.roomInfo.rmTypeCd || !this.roomInfo.storeCd) {
        this.$dialog.alert('객실을 선택해주세요.')
        return
      } else if (!this.roomInfo.mid) {
        this.$dialog.alert('회원코드를 입력해주세요.')
        return
      } else if (!this.roomInfo.rsvBlckCd) {
        this.$dialog.alert('블럭코드를 선택해주세요.')
        return
      }
      this.$dialog.confirm('DGNS 상품 연결을 하시겠습니까?<br />저장시 상품의 재고/가격이 DGNS 재고/가격 기준으로 일괄 변경됩니다.').then(() => {
        const dgnsItemInfo = {
          dmStoreId: this.roomInfo.dmStoreId,
          dmItemId: this.roomInfo.dmItemId,
          mid: this.roomInfo.mid,
          storeCd: this.roomInfo.storeCd,
          rmTypeCd: this.roomInfo.rmTypeCd,
          rsvBlckCd: this.roomInfo.rsvBlckCd,
          pkgYn: 'N'
        }
        itemService.updateDgnsItemInfo(this.roomInfo.dmItemId, dgnsItemInfo).then(() => {
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
