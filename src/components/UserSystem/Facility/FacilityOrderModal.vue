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
        <draggable v-if="facilityList.length > 0" v-model="facilityList" v-bind="{ghostClass: 'ghost'}" :forceFallback="true">
          <v-card class="ma-2" v-for="(item, i) in facilityList" :key="i" @click="() => {}">
            <v-card-text :class="{ 'grey lighten-3' : checkSaleYn(item.saleYn) }">
              <div class="text--primary" :style="{'text-decoration': checkSaleYn(item.saleYn) ? 'line-through' : ''}">
                {{ item.subFcltSaleNm }} <span v-if="checkSaleYn(item.saleYn)">(미판매중)</span>
              </div>
            </v-card-text>
          </v-card>
        </draggable>
        <v-card v-else>
          <v-card-text>
            <p>등록된 부대시설이 없습니다.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import facilityService from '@/api/modules/userSystem/facility.service'

export default {
  extends: DialogBase,
  name: 'FacilityOrderModal',
  components: {},
  data: function () {
    return {
      facilityList: [],
      cloneList: []
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
    this.facilityList = this.instance.params.list
    this.cloneList = _.cloneDeep(this.facilityList)
  },
  methods: {
    // 판매여부
    checkSaleYn (saleYn) {
      return saleYn !== 'Y'
    },
    // 저장
    save () {
      let changeYn = false
      this.facilityList.forEach((item, index) => {
        if (_.toNumber(item.sortSeq) !== (index + 1)) {
          // 메뉴 순서 변경사항 있음
          changeYn = true
        }
        item.changeSeq = index + 1
      })
      if (!changeYn) {
        this.close({ type: 'error', text: '변경된 사항이 없습니다.' })
      } else {
        this.$dialog.confirm('노출순서 변경을 하시겠습니까?').then(() => {
          facilityService.updateFacilitySort(this.facilityList).then(() => {
            this.close({ reload: 'Y', type: 'success', text: '변경하신 순서로 노출 순서가 적용되었습니다.' })
          }).catch(() => {
            this.close()
          })
        })
      }
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
