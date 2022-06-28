<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      신규 패키지 생성 (기존 설정 복사)
    </template>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-card tile>
            <v-card-title>복사 패키지 정보</v-card-title>
            <v-card-text>
              <v-list dense >
                <v-row dense no-gutters>
                  <v-col cols="6">
                    <v-list-item>
                      <v-list-item-content>지역:</v-list-item-content>
                      <v-list-item-content>{{ packageInfo.localName }}({{ packageInfo.localCode }})</v-list-item-content>
                    </v-list-item>
                  </v-col>
                  <v-col cols="6">
                    <v-list-item>
                      <v-list-item-content>패키지번호:</v-list-item-content>
                      <v-list-item-content>{{ packageInfo.packageNo }}</v-list-item-content>
                    </v-list-item>
                  </v-col>
                </v-row>
                <v-row dense no-gutters>
                  <v-col cols="6">
                    <v-list-item>
                      <v-list-item-content>패키지명:</v-list-item-content>
                      <v-list-item-content>{{ packageInfo.packageName }}</v-list-item-content>
                    </v-list-item>
                  </v-col>
                  <v-col cols="6">
                    <v-list-item>
                      <v-list-item-content>패키지 설명:</v-list-item-content>
                      <v-list-item-content>{{ packageInfo.packageDesc }}</v-list-item-content>
                    </v-list-item>
                  </v-col>
                </v-row>
                <v-row dense no-gutters>
                  <v-col cols="6">
                    <v-list-item>
                      <v-list-item-content>판매시작:</v-list-item-content>
                      <v-list-item-content>{{ packageInfo.saleStartDate | date }}</v-list-item-content>
                    </v-list-item>
                  </v-col>
                  <v-col cols="6">
                    <v-list-item>
                      <v-list-item-content>판매종료:</v-list-item-content>
                      <v-list-item-content>{{ packageInfo.saleEndDate | date }}</v-list-item-content>
                    </v-list-item>
                  </v-col>
                </v-row>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-text-field
              :label="pkgTextFieldLabel"
              :rules="pkgNoRules"
              v-model="targetPackageNo"
          />
        </v-col>
        <v-col cols="6" class="align-self-center">
          <v-btn outlined rounded color="indigo" @click="addPackage">
            <v-icon>add</v-icon>등록
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <p class="font-weight-bold blue--text">
            <v-icon>error_outline</v-icon> 복사범위 : 기본정보, 판매대상 업체목록, 휴일정보(패키지 휴일), 패키지 분류 수정
          </p>
          <p class="font-weight-bold red--text">
            <v-icon>error_outline</v-icon> 객실유형 정보 수정, 휴일정보(영업장, 객실) 별도 설정이 필요합니다.
          </p>
        </v-col>
      </v-row>
    </v-container>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import packageService from '@/api/modules/ota/package.service'
import commonCodeService from '@/api/modules/system/commonCode.service'

export default {
  extends: DialogBase,
  name: 'SettingRegDialog',
  data: function () {
    return {
      packageInfo: '',

      targetPackageNo: '',
      pkgNoRules: [
        value => !!value || '패키지번호를 입력해주세요.',
        value => {
          const pattern = /^[0-9]+$/g
          return pattern.test(value) || '숫자만 입력할 수 있습니다.'
        }
      ],
      packageSaleType: []
    }
  },
  mounted () {
    this.packageInfo = this.instance.params.packageInfo
    this.getPkgSaleType()
  },
  computed: {
    pkgTextFieldLabel () {
      const saleType = this.packageSaleType.join(', ')
      return `패키지 번호 입력 [해당 판매유형(${saleType})만 등록가능]`
    }
  },
  methods: {
    // 공통코드 조회 - 패키지 판매 유형
    async getPkgSaleType () {
      const response = await commonCodeService.selectCommonCode('OTA0004')
      for (const data of response.data) {
        this.packageSaleType.push(data.commonCode)
        console.log(data.commonCode)
      }
    },
    // 패키지 번호 유효성 검증
    validatePackageNumber () {
      const pattern = /^[0-9]+$/g
      if (this.targetPackageNo === '' || this.targetPackageNo.length === 0) {
        this.$dialog.alert('패키지번호를 입력해주세요.')
      } else if (!pattern.test(this.targetPackageNo)) {
        this.$dialog.alert('유효하지 않은 패키지번호입니다.')
      } else {
        return true
      }

      return false
    },

    async addPackage () {
      if (!this.validatePackageNumber()) return

      try {
        await this.$dialog.confirm('선택한 패키지의 설정으로 해당 패키지를 등록하시겠습니까?')
        const response = await packageService.insertCopyPackageInformation(this.packageInfo.packageNo, this.targetPackageNo)
        const data = response.data

        if (data.resultCode !== '0000') {
          return await this.$dialog.alert(data.resultMsg)
        }

        this.$dialog.alert('등록되었습니다.')
        this.close(true)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scoped>

</style>
