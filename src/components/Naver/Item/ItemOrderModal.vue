<template>
  <dialog-base :instance="instance" :title="'노출순서 변경'">
    <template v-slot:buttons>
      <v-btn dark text @click="save()">
        <v-icon left>check</v-icon>저장
      </v-btn>
    </template>
    <v-row>
      <v-col>
        <v-alert dense type="info">
          노출 순서변경<h6>(마우스로 객실을 드래그하여 순서를 변경할 수 있습니다.)</h6>
        </v-alert>
        <draggable v-if="itemList.length > 0" v-model="itemList" v-bind="{ghostClass: 'ghost'}" :forceFallback="true">
          <v-card class="ma-2" v-for="(item, i) in itemList" :key="i" @click="() => {}">
            <v-card-text :class="{'grey lighten-3': item.isImp === 'N'}">
              <div class="text--primary" :style="{'text-decoration': item.isImp === 'N' ? 'line-through' : ''}">
                {{ item.name }} (미노출중)
              </div>
            </v-card-text>
          </v-card>
        </draggable>
        <v-card v-else>
          <v-card-text>
            <p>등록된 객실이 없습니다.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </dialog-base>
</template>

<script>
import service from "Api/modules/naver/item.service"
import DialogBase from "@/components/Dialog/DialogBase"

export default {
  extends: DialogBase,
  name: 'ItemOrderModal',
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
    save () {
      this.$dialog.confirm('노출순서 변경을 하시겠습니까?').then(() => {
        const dmItemIdList = this.itemList.map(item => item.dmItemId).join(',')
        const param = {
          dmStoreId: this.itemList[0].dmStoreId,
          dmItemIds: dmItemIdList,
          order: 1
        }
        service.patchItem(param).then(() => {
          this.close()
          const snackbarObj = { type: 'success', text: '변경하신 순서로 노출 순서가 적용되었습니다.' }
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
