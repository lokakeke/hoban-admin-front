<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      객실유형등록 관리
    </template>
    <v-stepper v-model="step">
      <v-stepper-header>
        <!--eslint-disable vue/valid-v-for-->
        <template v-for="(item, index) in stepItems">
          <v-stepper-step
            :complete="step > item.step || isEdit"
            :editable="isEdit"
            :step="item.step"
          >{{ item.label }}</v-stepper-step>
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
                :ref="item.name"
                :store-code-prop="storeCodeProp"
                @nextStep="nextStep($event)"
                @setStoreCode="setStoreCode($event)"
                v-if="step === item.step"
              />
              <v-row>
                <v-col class="text-right" v-if="writeAuth">
                  <v-btn @click="add(item.name)" color="primary" rounded v-if="!isEdit">
                    <v-icon>keyboard_arrow_right</v-icon>
                    {{ item.step === stepItems.length ? '저장 후 닫기' : '저장 후 다음단계로 이동' }}
                  </v-btn>
                  <v-btn @click="update(item.name)" color="primary" rounded v-if="isEdit">
                    <v-icon class="pr-2">edit</v-icon>수정
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import BasicInformation from '@/components/Ota/Room/BasicInformation'
import PartnerExceptionSetting from './PartnerExceptionSetting'
import RoomTypeInformation from './RoomTypeInformation'
import HolidayInformation from './HolidayInformation'

export default {
  extends: DialogBase,
  name: 'StepperContainer',
  data () {
    return {
      storeCodeProp: this.instance.params.storeCode,
      isEdit: this.instance.params.isEdit,
      step: 1
    }
  },
  computed: {
    stepItems () {
      const items = [
        {
          step: 1,
          label: this.isEdit
            ? '기본정보 수정'
            : '기본정보 등록',
          component: BasicInformation,
          name: 'BasicInformation',
          auth: true
        },
        {
          step: 2,
          label: this.isEdit
            ? '파트너 예외 설정 수정'
            : '파트너 예외 설정 등록',
          component: PartnerExceptionSetting,
          name: 'PartnerExceptionSetting',
          auth: !this.isPartner
        },
        {
          step: 3,
          label: this.isEdit
            ? '객실유형정보 수정'
            : '객실유형정보 등록',
          component: RoomTypeInformation,
          name: 'RoomTypeInformation',
          auth: true
        },
        {
          step: 4,
          label: this.isEdit
            ? '휴일정보 수정'
            : '휴일정보 등록',
          component: HolidayInformation,
          name: 'HolidayInformation',
          auth: true
        }
      ]

      return items.filter(data => data.auth === true)
    }
  },
  methods: {
    async add (item) {
      await this.$refs[item][0].save()
      await this.instance.params.getRoomTypeList()
    },
    async update (item) {
      await this.$refs[item][0].update()
      await this.instance.params.getRoomTypeList()
    },
    setStoreCode (storeCode) {
      this.storeCodeProp = storeCode
    },
    nextStep (componentName) {
      const step = componentName === null ? this.stepItems.length + 1 : this.stepItems.find(item => item.name === componentName).step

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
