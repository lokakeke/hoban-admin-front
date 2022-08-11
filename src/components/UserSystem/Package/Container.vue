<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      객실패키지 관리
    </template>
    <v-stepper v-model="step">
      <v-stepper-header>
        <!--eslint-disable vue/valid-v-for-->
        <template v-for="(item, index) in stepItems">
          <v-stepper-step
              :complete="step > item.step || isEdit"
              :editable="isEdit"
              :step="item.step"
          >{{ item.label }} {{ editText }}</v-stepper-step>
          <v-divider v-if="index !== (stepItems.length - 1)" />
        </template>
        <!--eslint-enable-->
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content :key="item.step" :step="item.step" v-for="item in stepItems">
          <v-card flat>
            <v-card-text>
              <component
                :is="item.component"
                :is-edit="isEdit"
                :package-no-prop="packageNo"
                @nextStep="nextStep"
                v-if="step === item.step"
              />
            </v-card-text>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </dialog-base>
</template>

<script>
import BasicInformation from './BasicInformation'
import RoomTypeInformation from './RoomTypeInformation'
// import SellerRegisterForm from './SellerRegisterForm'
// import HolidayInformation from './HolidayInformation'
// import RoomPackageTypeForm from './RoomPackageTypeForm'
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'Container',
  components: {
    // 패키지 정보 등록/수정
    BasicInformation,
    // 객실유형 정보 등록/수정
    RoomTypeInformation
    // 판매대상 업체목록 등록/수정
    // SellerRegisterForm,
    // 휴일 등록/수정
    // HolidayInformation,
    // 패키지 분류 등록/수정
    // RoomPackageTypeForm
  },
  data () {
    return {
      // 수정여부
      isEdit: false,
      // 패키지 번호
      packageNo: null,
      // 스텝
      step: 1
    }
  },
  mounted () {
    this.isEdit = this.instance.params.isEdit
    this.packageNo = this.instance.params.packageNoProp
  },
  computed: {
    editText () {
      return this.isEdit ? '수정' : '등록'
    },
    stepItems () {
      const items = [
        {
          step: 1,
          label: '기본 정보',
          component: BasicInformation,
          name: 'BasicInformation',
          auth: true
        },
        {
          step: 2,
          label: '객실유형정보',
          component: RoomTypeInformation,
          name: 'RoomTypeInformation',
          auth: true
        },
        {
          step: 3,
          label: '판매대상 업체목록',
          // component: SellerRegisterForm,
          name: 'SellerRegisterForm',
          auth: !this.isPartner // 파트너는 해당 스텝 접근 불가
        },
        {
          step: 4,
          label: '휴일정보',
          // component: HolidayInformation,
          name: 'HolidayInformation',
          auth: true
        }
      ]
      return items.filter(data => data.auth === true)
    }
  },
  methods: {
    // 저장
    async add (item) {
    },
    // 수정
    async update (item) {
    },
    // 스탭 이동
    nextStep (step) {
      this.step = step
      if (this.step > this.stepItems.length) {
        this.close()
      }
    }
  }
}
</script>

<style scoped>
</style>
