<template>
  <dialog-base :instance="instance" :title="'회원번호 일괄 변경'">
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
                    회원번호 일괄 변경 시 주의사항
                  </v-list-item-title>
                  <p>일정 스케줄 작동 시간을 피해 수정해 주시기 바랍니다.
                    <span style="color: #1FA2FA;">스케줄 작동 시간이 매시 15분, 45분 일 경우<br />25분~35분 사이, 55분~5분 사이 변경 해주세요.</span><br />
                    변경한 회원정보로 일정 스케줄이 바로 전송됩니다.
                  </p>
                  <v-divider></v-divider>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col cols="12" class="px-4 py-0">
              <v-text-field :style="{'max-width':'250px'}" v-model="mid" label="회원번호" :rules="emptyRules" maxlength="20"></v-text-field>
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
                  변경 서비스 선택
                </v-list-item-title>
                <p>
                  <span style="color: #1FA2FA;">선택한 서비스에 객실로 셋팅된 상품의 회원번호가 일괄 수정됩니다.</span> 변경할 사업장을 선택해주세요.
                </p>
                <v-divider></v-divider>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12">
            <v-row justify="space-between" class="px-3 py-1">
              <div>선택한 서비스 <span style="color: #1FA2FA;">{{ businessIdArray.length }}</span>건</div>
              <div class="text-right pointer" @click="checkAll()"><v-icon left>{{checkIcon}}</v-icon> 전체 선택</div>
            </v-row>
            <v-card>
              <v-list shaped>
                <v-list-item-group v-model="businessIdArray" multiple>
                  <template v-for="(item, i) in businessCodeList">
                    <v-divider v-if="!item.businessId" :key="`divider-${i}`"></v-divider>
                    <v-list-item v-else :key="`item-${i}`" :value="item.businessId" active-class="deep-purple--text text--accent-4">
                      <template v-slot:default="{ active }">
                        <v-list-item-content>
                          <v-list-item-title v-text="item.serviceName"></v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-checkbox
                            :input-value="active"
                            :true-value="item.businessId"
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
import service from 'Api/modules/naver/item.service'
import DialogBase from 'Components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'RoomChangeMidModal',
  components: {},
  data: function () {
    return {
      businessCodeList: [],
      businessIdArray: [],
      mid: ''
    }
  },
  computed: {
    checkIcon () {
      if (this.businessCodeList.length > 0) {
        if (this.businessCodeList.length === this.businessIdArray.length) {
          return 'check_box'
        } else if (this.businessIdArray.length === 0) {
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
    this.businessCodeList = this.instance.params.list
  },
  methods: {
    checkAll () {
      if (this.businessCodeList.length === this.businessIdArray.length) {
        this.businessIdArray = []
      } else {
        this.businessIdArray = this.businessCodeList.map(data => data.businessId)
      }
    },
    save () {
      this.validForm(this.$refs.form).then(() => {
        if (!this.mid) {
          this.$dialog.alert('회원번호를 입력해주세요.')
          return
        }
        if (this.businessIdArray.length < 1) {
          this.$dialog.alert('변경할 객실을 선택해주세요.')
          return
        }
        this.$dialog.confirm('회원번호를 변경을 하시겠습니까? 일정 스케줄 작동 시간을 피해 수정해주세요.').then(() => {
          const businessIdList = this.businessIdArray.join(',')
          const param = {
            businessIds: businessIdList,
            mid: this.mid
          }
          service.updateRoomChangeMid(param).then(() => {
            this.close()
            const snackbarObj = { type: 'success', text: '회원정보가 일괄 변경되었습니다. 변경한 회원정보로 일정 스케줄이 바로 전송됩니다.' }
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
