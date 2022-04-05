<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      패키지 정산 추가/삭제 관리
    </template>
    <v-container fluid>
      <v-row dense>
        <v-col cols="12">
          <v-list dense>
            <v-list-item-title class="font-weight-bold mb-3">등록된 패키지번호</v-list-item-title>
            <v-divider />
            <template v-if="addPackageList.length === 0">
              검색결과가 없습니다.
            </template>
            <template v-else>
              <v-list-item v-for="(item, index) of addPackageList" :key="item.pkgNo" class="px-0">
                <v-list-item-content>{{ index + 1 }}. {{ item.pkgNo }}</v-list-item-content>
                <v-list-item-action>
                  <v-btn icon color="red" @click="removePackage(item)">
                    <v-icon>clear</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
        </v-col>
        <v-col class="text-end">
          <v-btn outlined
                 rounded
                 color="primary"
                 @click="togglePackageRegWindow"
          >
            패키지 등록
          </v-btn>
        </v-col>
      </v-row>
      <v-divider />
      <v-row dense v-show="togglePkgReg">
        <v-col>
          <v-row>
            <v-col cols="10">
              <v-text-field
                  placeholder="패키지 번호"
                  v-model="pkgNo"
                  hide-details
              />
            </v-col>
            <v-col cols="2" class="text-end align-self-center">
              <v-btn color="info"
                     outlined
                     rounded
                     @click="getPackageInformation"
              >
                검색
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <p class="text-subtitle-2">
                <v-icon>error_outline</v-icon> 정산 시작 전, 추가로 정산이 필요한 패키지 번호를 입력해주세요.
              </p>
            </v-col>
          </v-row>
          <v-row v-if="pkgInfo">
            <v-col cols="12">
              <v-card>
                <v-card-title>{{ pkgInfo.pkgName }}</v-card-title>
                <v-divider />
                <v-card-text>
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-content>패키지번호</v-list-item-content>
                      <v-list-item-content class="align-end">{{ pkgInfo.pkgNo }}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>지역</v-list-item-content>
                      <v-list-item-content class="align-end">{{ pkgInfo.lcalName }} ({{ pkgInfo.lcalCd }})</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>패키지 판매 시작/종료일</v-list-item-content>
                      <v-list-item-content class="align-end">{{ pkgInfo.pkgBgnYmd | date}} ~ {{ pkgInfo.pkgEndYmd | date}}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>패키지 판매 유형</v-list-item-content>
                      <v-list-item-content class="align-end">{{ pkgInfo.pkgSaleTypeName}} ({{ pkgInfo.pkgSaleType }})</v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col class="text-end">
              <v-btn color="error"
                     outlined
                     rounded
                     @click="cancel"
              >
                취소
              </v-btn>
              <v-btn color="primary"
                     outlined
                     rounded
                     @click="addPackage"
              >
                이번 달 정산에 등록
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import packageService from '@/api/modules/ota/package.service'
import calculationService from '@/api/modules/ota/calculation.service'

export default {
  extends: DialogBase,
  name: 'PackageAddDialog',
  data: function () {
    return {
      addPackageList: [],

      pkgNo: '',
      pkgInfo: null,
      targetDate: '',

      togglePkgReg: false
    }
  },
  mounted () {
    this.targetDate = this.instance.params.targetDate
    this.getAddPakcageList()
  },
  methods: {
    async getAddPakcageList () {
      const targetMonth = moment(this.targetDate).format('YYYYMM')
      const response = await calculationService.retrieveMonthCalcAddPackageList(targetMonth)
      const data = response.data

      if (data.resultCode !== '0000') {
        return this.$dialog.alert(data.resultMsg)
      }

      this.addPackageList = data.resultList
    },
    async getPackageInformation () {
      if (this.pkgNo === '' || this.pkgNo === null) {
        return this.$dialog.alert('패키지 번호를 입력해주세요')
      }

      const response = await packageService.selectPackageMasterInformation(this.pkgNo)
      const data = response.data

      if (data.pkgNo === null) {
        this.pkgInfo = null
        return this.$dialog.alert('검색 결과가 존재하지 않습니다.')
      }

      this.pkgInfo = response.data
    },

    cancel () {
      this.close()
    },

    async addPackage () {
      try {
        await this.$dialog.confirm('해당 패키지를 이번달 정산에 등록하시겠습니까?')

        const hasPackage = await this.checkRegisteredPackage()
        if (!hasPackage) {
          return this.$dialog.alert('이미 등록된 패키지 입니다.')
        }

        const formData = {
          pkgNo: this.pkgInfo.pkgNo,
          calcYm: moment(this.targetDate).format('YYYYMM')
        }

        const response = await calculationService.addMonthCalcAddPackage(formData)
        const data = response.data

        if (data.resultCode !== '0000') {
          return this.$dialog.alert(data.resultMsg)
        }

        await this.$dialog.alert('등록되었습니다.')
        this.close(true)
      } catch (e) {
        console.log(e)
      }
    },

    async checkRegisteredPackage () {
      const targetMonth = moment(this.targetDate).format('YYYYMM')
      const response = await calculationService.retrieveMonthCalcAddPackage(this.pkgInfo.pkgNo, targetMonth)
      const data = response.data

      return data.resultCode !== '0000'
    },

    togglePackageRegWindow () {
      this.togglePkgReg = this.togglePkgReg !== true
    },

    async removePackage (item) {
      await this.$dialog.confirm('선택한 패키지를 삭제하시겠습니까?')

      const targetMonth = moment(this.targetDate).format('YYYYMM')
      const form = {
        pkgNo: item.pkgNo,
        calcYm: targetMonth
      }

      const response = await calculationService.deleteMonthCalcAddPackage(form)
      const data = response.data

      if (data.resultCode !== '0000') {
        return this.$dialog.alert(data.resultMsg)
      }

      this.$dialog.alert('삭제되었습니다.')
      this.getAddPakcageList()
    }
  }
}
</script>

<style scoped>

</style>
