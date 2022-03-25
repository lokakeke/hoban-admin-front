<template>
  <dialog-base :title="dialogTitle" :instance="instance" v-if="isShow">
    <v-form ref="form" lazy-validation>
      <div v-if="instance.params.useStore === true">
        <v-label>영업장</v-label>
        <v-select
          v-model="form.store"
          :items="storeList"
          item-text="storeNm"
          item-value="storeCd"
          return-object
          required
          placeholder="설정할 영업장을 선택해 주세요"
        ></v-select>
      </div>
      <div v-if="instance.params.useRoomType === true && form.store && form.store.rmTypeList">
        <v-label>객실유형</v-label>
        <v-select
          v-model="form.roomType"
          :items="form.store.rmTypeList"
          item-text="rmTypeNm"
          item-value="rmTypeCd"
          return-object
          required
          placeholder="설정할 객실유형을 선택해 주세요"
        ></v-select>
      </div>
      <v-row justify="end" class="mt-5">
        <v-btn outlined rounded color="info" :disabled="isLoading === true" @click="submit">
          <v-icon>check</v-icon>저장
        </v-btn>
        <v-btn outlined rounded color="primary" @click="close">
          <v-icon>close</v-icon>닫기
        </v-btn>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import storeService from 'Api/modules/system/store.service'

export default {
  name: 'CommissionOptionGroupCreateDialog',
  extends: DialogBase,
  data () {
    return {
      /**
       * 폼 데이터
       */
      form: {
        /**
         * 영업장
         */
        store: null,
        /**
         * 객실유형
         */
        roomType: null
      },
      /**
       * Dialog 노출 여부
       */
      isShow: false,
      /**
       * 로딩여부
       */
      isLoading: true,
      /**
       * 영업장 목록
       */
      storeList: []
    }
  },
  computed: {
    /**
     * Dialog 제목
     */
    dialogTitle () {
      if (
        this.instance.params.useStore === true &&
        this.instance.params.useRoomType === true
      ) {
        return '객실유형별 설정 등록'
      }
      return '영업장별 설정 등록'
    }
  },
  async created () {
    this.isLoading = true
    if (this.instance.params.storeCd && this.instance.params.storeNm) {
      // 입력받은 영업장 코드가 있는 경우
      this.form.store = {
        storeCd: this.instance.params.storeCd,
        storeNm: this.instance.params.storeNm
      }
      if (this.instance.params.useRoomType !== true) {
        this.close(this.form) // 바로 등록
      } else if (this.instance.params.rmTypeCd && this.instance.params.rmTypeNm) {
        // 입력받은 객실유형 코드가 있는 경우
        this.form.roomType = {
          rmTypeCd: this.instance.params.rmTypeCd,
          rmTypeNm: this.instance.params.rmTypeNm
        }
        this.close(this.form) // 바로 등록
      }
    } else {
      this.isShow = true
      await this.getStoreList()
    }
    this.isLoading = false
  },
  methods: {
    /**
     * 영업장 목록 조회
     */
    async getStoreList () {
      const response = await storeService.selectStoreList()
      this.storeList = response.data
    },
    /**
     * 전송
     */
    submit () {
      this.validForm(this.$refs.form).then(() => {
        this.close(this.form)
      })
    }
  }
}
</script>
