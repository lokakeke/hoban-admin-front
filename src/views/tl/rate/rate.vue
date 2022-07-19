<template>
  <div>
    <v-container fluid pt-0>
      <app-card colClasses="xl12 lg12 md12 sm12 xs12">
        <v-layout>
          <v-flex xs12 md6 lg4 border-right>
            <v-card flat>
              <v-card-title class="headline font-weight-bold justify-center border-bottom pt-0">TL-LINCOLN 사업장</v-card-title>
              <v-card-text class="mt-8 pl-2 pr-5">
                <v-list dense v-if="branch && branch.length > 0" class="pr-5">
                  <transition-group type="transition" name="flip-list">
                    <v-list-item v-for="item of branch" :key="item.branchNo" @click="choiceBranch(item)" class="menu-list" :class="item.active? 'active' : ''">
                      <v-list-item-action>
                        <v-icon>business</v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ item.branchName }}
                        </v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-icon>keyboard_arrow_right</v-icon>
                      </v-list-item-action>
                    </v-list-item>
                  </transition-group>
                </v-list>
                <v-layout v-else align-center justify-center fill-height>
                  등록된 사업장이 없습니다.
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 md6 lg4 border-right>
            <v-card flat>
              <v-card-title class="headline font-weight-bold justify-center border-bottom pt-0">AGENT 선택</v-card-title>
              <v-card-text class="mt-8 pl-5 pr-5">
                <v-list dense v-if="param.branch && agentCodeList && agentCodeList.length > 0" class="pr-5">
                  <transition-group type="transition" name="flip-list">
                    <v-list-item v-for="item of agentCodeList" :key="item.commonCode" @click="viewDetail(item)" class="menu-list" :class="item.active? 'active' : ''">
                      <v-list-item-action>
                        <v-icon>business</v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ item.commonCodeName }}
                        </v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-icon>keyboard_arrow_right</v-icon>
                      </v-list-item-action>
                    </v-list-item>
                  </transition-group>
                </v-list>
                <v-layout v-else align-center justify-center fill-height>
                  TL-LINCOLN 사업장을 선택해 주세요.
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 md6 lg4>
            <v-card flat>
              <v-card-title class="headline font-weight-bold justify-center border-bottom pt-0">요율 상세 내용</v-card-title>
              <v-card-text class="mt-8 pl-5 pr-5">
                <transition name="slide-fade" mode="out-in">
                  <template v-if="param.branch &&  param.agentCode">
                    <v-form ref="form" lazy-validation :key="param.agentCode" autocomplete="off">
                      <v-label>요율(100% 일경우 1로 입력 110% 일경우 1.1)</v-label>
                      <v-text-field v-model="form.rate" label="" class="pt-0" :rules="emptyRules"></v-text-field>
                      <v-layout justify-center>
                        <div class="pa-2">
                          <v-btn outlined rounded small color="red" @click="deleteItem()">
                            <v-icon small class="mr-1">check</v-icon>
                            삭제
                          </v-btn>
                        </div>
                        <div class="pa-2">
                          <v-btn outlined rounded small color="blue" @click="commit()">
                            <v-icon small class="mr-1">check</v-icon>
                            저장
                          </v-btn>
                        </div>
                      </v-layout>
                    </v-form>
                  </template>
                  <v-layout v-else align-center justify-center fill-height>
                    AGENT를 선택해 주세요.
                  </v-layout>
                </transition>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </app-card>
    </v-container>
  </div>
</template>

<script>
import branchService from '@/api/modules/tl/branch.service'
import commonCodeService from '@/api/modules/system/commonCode.service'
import rateService from '@/api/modules/tl/rate.service'

export default {
  components: {},
  name: 'rate',
  data () {
    return {
      // 사업장 리스트
      branch: [],
      // ota 코드리스트
      agentCodeList: [],
      param: { branch: '', agentCode: '' },
      dialog: false,
      form: {}
    }
  },
  methods: {
    selectBranch (branchNo) {
      branchService.selectTLBranchList().then(res => {
        this.branch = res.data
        for (const row of this.branch) {
          if (branchNo && row.branchNo === branchNo) {
            this.choiceBranch(row)
          }
        }
      })
    },
    selectRate () {
      rateService.selectRate(this.param).then(res => {
        if (res.data) {
          this.form = res.data
        } else {
          this.form = {} // 초기화
        }
      })
    },
    choiceBranch (item) {
      for (const data of this.branch) {
        data.active = false
      }
      for (const data of this.agentCodeList) {
        data.active = false
      }
      item.active = true
      this.param.agentCode = ''
      this.param.branch = item.branchNo
    },
    viewDetail (item) {
      for (const data of this.agentCodeList) {
        data.active = false
      }
      item.active = true
      this.param.agentCode = item.commonCode

      // 기존에 저장된 정보를 가져와야됨.
      this.selectRate()
    },
    async commit () {
      this.form.branchNo = this.param.branch
      this.form.agentCode = this.param.agentCode

      await this.validForm(this.$refs.form)

      await this.$dialog.confirm('요율 정보를 저장 하시겠습니까?').then(() => {
        rateService.updateRate(this.form).then(res => {
          this.dialog = false
          this.$dialog.alert('저장되었습니다.')
        })
      }, () => {
      })
    },
    deleteItem () {
      if (!this.form.rate) {
        this.$dialog.alert('삭제할 정보가 없습니다.')
        return
      }
      this.form.branchNo = this.param.branch
      this.form.agentCode = this.param.agentCode

      this.$dialog.confirm('요율 정보를 삭제 하시겠습니까?').then(() => {
        rateService.deleteRate(this.form).then(res => {
          this.dialog = false
          this.form.rate = ''

          this.$dialog.alert('삭제되었습니다.')
        })
      }, () => {
      })
    }
  },
  mounted () {
    this.selectBranch()
    commonCodeService.selectCommonCode('agent').then(res => {
      this.agentCodeList = res.data
    })
  }
}
</script>
