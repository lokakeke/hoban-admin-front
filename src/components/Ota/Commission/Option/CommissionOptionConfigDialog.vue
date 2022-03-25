<template>
  <dialog-base :title="dialogTitle" :instance="instance">
    <v-form ref="form" lazy-validation v-if="option">
      <v-row>
        <v-col cols="6">
          <v-label>
            조건값(원)
             <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
              </template>
              <div>조건값과 조건유형이 조합되어 조건이 만들어집니다.</div>
            </v-tooltip>
          </v-label>
          <v-currency-field
            v-model="option.amtCndVal"
            :disabled="option.amtCndTypeCd === 'AL'"
            :rules="amtCndValRules"
            :placeholder="option.amtCndTypeCd === 'AL' ? '필요없음' : '조건값을 입력해 주세요'"
            maxlength="12"
          ></v-currency-field>
        </v-col>
        <v-col cols="6">
          <v-label>
            조건유형
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
              </template>
              <div>조건유형은 조건값의 기준이 되는 유형입니다.</div>
              <ul>
                <li v-for="amtCndType in amtCndTypeList" :key="amtCndType.value">
                  {{ amtCndType.text }} : {{ amtCndType.desc }}
                </li>
              </ul>
            </v-tooltip>
          </v-label>
          <v-select v-model="option.amtCndTypeCd" :items="amtCndTypeList" required>
            <template v-slot:item="{ item }">{{ item.text }} ({{ item.sign }})</template>
            <template v-slot:selection="{ item }">{{ item.text }} ({{ item.sign }})</template>
          </v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-label>수수료</v-label>
          <v-currency-field v-model="option.cmsnAmt" maxlength="8" placeholder="수수료를 입력해 주세요"></v-currency-field>
        </v-col>
        <v-col cols="6">
          <v-label>수수료유형</v-label>
          <v-select v-model="option.cmsnTypeCd" :items="cmsnTypeList" required></v-select>
        </v-col>
      </v-row>
      <v-divider class="mt-3 mb-3"></v-divider>
      <v-label>설정 미리보기</v-label>
      <h2 class="text-center mt-5">
        {{ amtCndText }}
        <br v-if="option.amtCndTypeCd !== 'AL'" />
        {{ (option.cmsnAmt || '?') | price }}{{ getCmsnTypeNm(option.cmsnTypeCd) }}의 수수료가 적용됩니다.
      </h2>
      <v-divider class="mt-5 mb-7"></v-divider>
      <v-row justify="end" class="mt-5">
        <v-btn outlined rounded color="orange" @click="resetForm()">
          <v-icon>refresh</v-icon>원래대로
        </v-btn>
        <v-btn outlined rounded color="info" @click="save()">
          <v-icon>check</v-icon>저장
        </v-btn>
        <v-btn outlined rounded color="primary" @click="close()">
          <v-icon>close</v-icon>닫기
        </v-btn>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import commonCodeService from 'Api/modules/system/commonCode.service'

export default {
  name: 'CommissionOptionConfigDialog',
  extends: DialogBase,
  data () {
    return {
      /**
       * 기본 설정값
       */
      option: {},
      /**
       * 조건유형 목록
       */
      amtCndTypeList: [],
      /**
       * 수수료유형 목록
       */
      cmsnTypeList: []
    }
  },
  computed: {
    /**
     * Dialog 제목
     */
    dialogTitle () {
      let typeText = '전체'
      if (this.option.storeNm) {
        typeText = `${this.option.storeNm}`
        if (this.option.rmTypeNm) {
          typeText = `${this.option.storeNm} > ${this.option.rmTypeNm}`
        }
      }
      return `${typeText} 설정 편집`
    },
    /**
     * 조건유형 텍스트
     */
    amtCndText () {
      const amtCndTypeNm = this.getAmtCndTypeNm(this.option.amtCndTypeCd)
      if (this.option.amtCndTypeCd !== 'AL') {
        // 조건유형 = "항상"이 아닌경우
        return `가격이 ${this.$options.filters.price(
          this.option.amtCndVal || '?'
        )}원 ${amtCndTypeNm}인 경우,`
      } else {
        // 조건유형 = "항상"인경우
        return amtCndTypeNm
      }
    },
    /**
     * 조건값 유효성
     */
    amtCndValRules () {
      return [
        v =>
          !!v || this.option.amtCndTypeCd === 'AL' || '조건값은 필수입력입니다.'
      ]
    }
  },
  watch: {
    'option.amtCndTypeCd' (newVal) {
      if (newVal === 'AL') {
        this.option.amtCndVal = null
      }
    }
  },
  async created () {
    await this.getAmtCndTypeList()
    await this.getCmsnTypeList()
    this.resetForm()
  },
  methods: {
    /**
     * 조건유형명 가져오기
     */
    getAmtCndTypeNm (amtCndTypeCd) {
      let amtCndTypeNm = ''
      const amtCndTypeList = this.amtCndTypeList || []
      amtCndTypeList.some(amtCndType => {
        if (amtCndType.value === amtCndTypeCd) {
          amtCndTypeNm = amtCndType.text
          return true
        }
        return false
      })
      return amtCndTypeNm
    },
    /**
     * 수수료유형명 가져오기
     */
    getCmsnTypeNm (cmsnTypeCd) {
      let cmsnTypeNm = ''
      const cmsnTypeList = this.cmsnTypeList || []
      cmsnTypeList.some(cmsnType => {
        if (cmsnType.value === cmsnTypeCd) {
          cmsnTypeNm = cmsnType.text
          return true
        }
        return false
      })
      return cmsnTypeNm
    },
    /**
     * 조건유형 목록 가져오기
     */
    async getAmtCndTypeList () {
      const amtCndTypeList = []
      const response = await commonCodeService.selectCommonCode('CMSN0002')
      response.data.forEach(item => {
        const amtCndType = {
          text: item.commCdNm,
          value: item.commCd,
          desc: item.commCdDesc, // 설명
          sign: item.item01, // 기호
          order: item.item02 // 계산시 순번
        }
        amtCndTypeList.push(amtCndType)
      })
      this.amtCndTypeList = amtCndTypeList
    },
    /**
     * 수수료유형 목록 가져오기
     */
    async getCmsnTypeList () {
      const cmsnTypeList = []
      const response = await commonCodeService.selectCommonCode('CMSN0003')
      response.data.forEach(item => {
        const cmsnType = {
          text: item.commCdNm,
          value: item.commCd
        }
        cmsnTypeList.push(cmsnType)
      })
      this.cmsnTypeList = cmsnTypeList
    },
    /**
     * 원래대로
     */
    resetForm () {
      this.option = _.cloneDeep(this.instance.params.option)
    },
    /**
     * 저장
     */
    save () {
      this.validForm(this.$refs.form).then(() => {
        this.option.amtCndTypeNm = this.getAmtCndTypeNm(
          this.option.amtCndTypeCd
        )
        this.option.cmsnTypeNm = this.getCmsnTypeNm(this.option.cmsnTypeCd)
        this.close(this.option)
      })
    }
  }
}
</script>
