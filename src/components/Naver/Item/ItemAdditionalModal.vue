<template>
  <dialog-base :instance="instance" :title="'부가정보'">
    <template v-slot:buttons>
      <v-btn dark text @click="save()">
        <v-icon left>check</v-icon>저장
      </v-btn>
    </template>
    <v-row>
      <v-col cols="5">
        <v-card class="mx-auto">
          <v-list shaped>
            <v-list-item-group v-model="selectAdditionalInfos" multiple>
              <template v-for="(item, i) in additionalInfoList">
                <v-divider v-if="!item.text" :key="`divider-${i}`"></v-divider>
                <v-list-item v-else :key="`item-${i}`" :value="item.text" active-class="deep-purple--text text--accent-4">
                  <template v-slot:default="{ active }">
                    <v-list-item-content>
                      <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-checkbox
                        :input-value="active"
                        :true-value="item.text"
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
      <v-col cols="7">
        <v-alert dense type="info">
          노출 순서변경<h6>(마우스로 대상을 드래그해서 순서를 조정하세요.)</h6>
        </v-alert>
        <draggable v-if="selectAdditionalInfos.length > 0" v-model="selectAdditionalInfos" v-bind="{ghostClass: 'ghost'}" :forceFallback="true">
          <v-card class="ma-2" v-for="(item, i) in selectAdditionalInfos" :key="i" @click="() => {}">
            <v-card-text>
              {{ item }}
            </v-card-text>
          </v-card>
        </draggable>
        <v-card v-else>
          <v-card-text>
            <p>선택한 부가정보가 없습니다.</p>
            <strong>부가 정보는 최소 1개 이상 선택되어야 합니다.</strong>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </dialog-base>
</template>

<script>
import itemService from '@/api/modules/naver/item.service'
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'ItemAdditionalModal',
  components: {},
  data: function () {
    return {
      additionalInfoList: [],
      selectAdditionalInfos: []
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
    itemService.selectAdditionalInfo().then(res => {
      this.additionalInfoList = res.data
    })
    this.selectAdditionalInfos = _.cloneDeep(this.instance.params.additionalInfos)
  },
  methods: {
    save () {
      this.instance.params.saveModal(this.selectAdditionalInfos)
      this.close()
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
