<template>
  <dialog-base :instance="instance" :title="'정보일괄 변경'">
    <template v-slot:buttons>
      <v-btn dark text @click="save()">
        <v-icon left>check</v-icon>저장
      </v-btn>
    </template>
    <v-row no-gutters justify="space-between">
      <v-col cols="6">
        <v-row no-gutters>
          <v-form ref="form" lazy-validation style>
            <v-col cols="12">
              <v-list-item three-line class="height-auto px-1">
                <v-list-item-content class="py-0">
                  <v-list-item-title class="headline fw-bold pb-2">
                    정보일괄 변경 시 주의사항
                  </v-list-item-title>
                  <p>원하는 객실의 다음 3가지 정보를 한 번에 변경할<br />수 있습니다.
                    <span style="color: #1FA2FA;">변경 시 기존 내용은 사라지고 새로 입력한 내용이 반영됩니다.</span>
                    변경을 원하는 정보만 입력해주세요.
                  </p>
                  <v-divider></v-divider>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col cols="12" class="px-4 py-0">
              <v-label>객실소개 <span class="font-sm">(최소 20자)</span></v-label>
              <v-textarea outlined counter="1000" v-model="desc" label="" placeholder="객실에 대한 소개, 자랑, 특징 및 고객들에게 꼭 알리고 싶은 내용들로 자유롭게 입력해 주세요." :rules="betweenLengthRules(20, 1000)"></v-textarea>
              <v-divider></v-divider>
            </v-col>
            <v-col cols="12" class="px-4 py-0">
              <v-label>알립니다.</v-label>
              <v-textarea outlined counter="1000" v-model="bookingPrecaution" placeholder="예약 시 고객이 주의해야 할 사항을 입력해 주세요." :rules="maxLengthRules(1000)"></v-textarea>
            </v-col>
          </v-form>
        </v-row>
      </v-col>
      <v-col cols="5" class="mr-3 mb-3">
        <v-row no-gutters>
          <v-col cols="12">
            <v-list-item three-line class="height-auto px-0">
              <v-list-item-content>
                <v-list-item-title class="headline fw-bold pb-2">
                  변경 객실 선택
                </v-list-item-title>
                <p>
                  <span style="color: #1FA2FA;">객실소개,알립니다 2가지 정보</span>로 변경할 객실을 선택해주세요.
                </p>
                <v-divider></v-divider>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12">
            <v-row justify="space-between" class="px-3 py-1">
              <div>선택한 객실 <span style="color: #1FA2FA;">{{ dmItemIdArray.length }}</span>건</div>
              <div class="text-right pointer" @click="checkAll()"><v-icon left>{{checkIcon}}</v-icon> 전체 선택</div>
            </v-row>
            <v-card>
              <v-list shaped>
                <v-list-item-group v-model="dmItemIdArray" multiple>
                  <template v-for="(item, i) in itemList">
                    <v-divider v-if="!item.dmItemId" :key="`divider-${i}`"></v-divider>
                    <v-list-item v-else :key="`item-${i}`" :value="item.dmItemId" active-class="deep-purple--text text--accent-4">
                      <template v-slot:default="{ active }">
                        <v-list-item-content>
                          <v-list-item-title v-text="item.name"></v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-checkbox
                            :input-value="active"
                            :true-value="item.dmItemId"
                            color="deep-purple accent-4"
                          ></v-checkbox>
                        </v-list-item-action>
                      </template>
                    </v-list-item>
                  </template>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </dialog-base>
</template>

<script>
import service from "Api/modules/naver/item.service"
import DialogBase from "@/components/Dialog/DialogBase"

export default {
  extends: DialogBase,
  name: 'ItemChangeInfoModal',
  components: {},
  data: function () {
    return {
      itemList: [],
      dmItemIdArray: [],
      desc: '',
      bookingPrecaution: ''
    }
  },
  computed: {
    checkIcon () {
      if (this.itemList.length > 0) {
        if (this.itemList.length === this.dmItemIdArray.length) {
          return 'check_box'
        } else if (this.dmItemIdArray.length === 0) {
          return 'check_box_outline_blank'
        } else {
          return 'indeterminate_check_box'
        }
      } else {
        return 'check_box_outline_blank'
      }
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
    checkAll () {
      if (this.itemList.length === this.dmItemIdArray.length) {
        this.dmItemIdArray = []
      } else {
        this.dmItemIdArray = this.itemList.map(data => data.dmItemId)
      }
    },
    save () {
      this.validForm(this.$refs.form).then(() => {
        if ((!this.desc || this.desc.length < 20) && (!this.bookingPrecaution || this.bookingPrecaution.length < 1)) {
          this.$dialog.alert('객실소개나 알립니다 정보를 입력해주세요.')
          return
        }
        if (this.dmItemIdArray.length < 1) {
          this.$dialog.alert('변경할 객실을 선택해주세요.')
          return
        }
        this.$dialog.confirm('정보일괄 변경을 하시겠습니까?').then(() => {
          const dmItemIdList = this.dmItemIdArray.join(',')
          const param = {
            dmStoreId: this.itemList[0].dmStoreId,
            dmItemIds: dmItemIdList,
            desc: this.desc,
            bookingPrecaution: this.bookingPrecaution
          }
          service.patchItem(param).then(() => {
            this.close()
            const snackbarObj = { type: 'success', text: '정보가 일괄 변경되었습니다.' }
            this.instance.params.search(snackbarObj)
          }).catch(() => {
            this.close()
            this.instance.params.search()
          })
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
