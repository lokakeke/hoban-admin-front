<template>
  <dialog-base :instance="instance" :title="'PMS 패키지 상품 연결'">
    <template v-slot:buttons>
      <v-btn dark text @click="save()">
        <v-icon left>check</v-icon>저장
      </v-btn>
    </template>
    <package-info-component v-if="originRoomInfo && originRoomInfo.mid"
                            type = "view"
                            :storeId="originRoomInfo.storeId"
                            :viewPkgNo="originRoomInfo.mid"
                            :originRoomInfo="originRoomInfo"
                            :isValidPkg.sync="isValidPkg"
    ></package-info-component>
    <package-info-component v-else
                            type = "view"
                            :storeId="originRoomInfo.storeId"
                            :isValidPkg.sync="isValidPkg"
    ></package-info-component>
  </dialog-base>
</template>

<script>
import itemService from '@/api/modules/naver/item.service'
import PackageInfoComponent from './PackageInfoComponent'
import DialogBase from '@/components/Dialog/DialogBase.vue'
import { mapGetters } from 'vuex'

export default {
  extends: DialogBase,
  name: 'PackageSettingModal',
  components: {
    PackageInfoComponent
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
      },
      isValidPkg: false
    }
  },
  computed: {
    ...mapGetters({
      roomInfo: 'naver/roomInfo'
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
  methods: {
    save () {
      if (!this.isValidPkg) {
        this.$dialog.alert('패키지를 검색해주세요.')
        return
      }
      if (!this.roomInfo.roomTypeCode || !this.roomInfo.storeCode) {
        this.$dialog.alert('객실을 선택해주세요.')
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
          packageYn: 'Y'
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
