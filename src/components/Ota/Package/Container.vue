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
                :pkg-no-prop="pkgNo"
                :ref="item.name"
                @nextStep="nextStep($event)"
                @setPackageNumber="setPackageNumber($event)"
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
import BasicInformation from './BasicInformation'
import RoomTypeInformation from './RoomTypeInformation'
import SellerRegisterForm from './SellerRegisterForm'
import HolidayInformation from './HolidayInformation'
import RoomPackageTypeForm from './RoomPackageTypeForm'
import DialogBase from 'Components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'Container',
  components: {
    // 패키지 정보 등록/수정
    BasicInformation,
    // 객실유형 정보 등록/수정
    RoomTypeInformation,
    // 판매대상 업체목록 등록/수정
    SellerRegisterForm,
    // 휴일 등록/수정
    HolidayInformation,
    // 패키지 분류 등록/수정
    RoomPackageTypeForm
  },
  data () {
    return {
      // 수정여부
      isEdit: Boolean,
      // 패키지 번호
      pkgNo: '',
      // 스텝
      step: 1
    }
  },
  mounted () {
    this.isEdit = this.instance.params.isEdit
    this.pkgNo = this.instance.params.pkgNoProp === '' ? '' : this.instance.params.pkgNoProp
  },
  computed: {
    stepItems () {
      const items = [
        {
          step: 1,
          label: this.isEdit
            ? '기본 정보수정'
            : '기본 정보등록',
          component: BasicInformation,
          name: 'BasicInformation',
          auth: true
        },
        {
          step: 2,
          label: this.isEdit
            ? '객실유형정보 수정'
            : '객실유형정보 등록',
          component: RoomTypeInformation,
          name: 'RoomTypeInformation',
          auth: true
        },
        {
          step: 3,
          label: this.isEdit
            ? '판매대상 업체목록 수정'
            : '판매대상 업체목록 등록',
          component: SellerRegisterForm,
          name: 'SellerRegisterForm',
          auth: !this.isPartner // 파트너는 해당 스텝 접근 불가
        },
        {
          step: 4,
          label: this.isEdit
            ? '휴일정보 수정'
            : '휴일정보 등록',
          component: HolidayInformation,
          name: 'HolidayInformation',
          auth: true
        },
        {
          step: 5,
          label: this.isEdit
            ? '패키지 분류수정'
            : '패키지 분류지정',
          component: RoomPackageTypeForm,
          name: 'RoomPackageTypeForm',
          auth: !this.isPartner // 파트너는 해당 스텝 접근 불가
        }
      ]

      return items.filter(data => data.auth === true)
    }
  },
  methods: {
    // 모든 스텝 저장 총괄 메소드
    // 스텝 추가 시 저장, 수정의 경우 'save, update' 메소드 구현 필수
    async add (item) {
      try {
        await this.$refs[item][0].save()
        this.instance.params.getRoomPackageRegisterList()
      } catch (error) {
        console.log(error)
      }
    },
    // 모든 스텝 수정 총괄 메소드
    // 스텝 추가 시 저장, 수정의 경우 'save, update' 메소드 구현 필수
    async update (item) {
      try {
        await this.$refs[item][0].update()
        this.instance.params.getRoomPackageRegisterList()
      } catch (error) {
        console.log(error)
      }
    },
    // 패키지 정보 등록 외에 나머지 스텝들은 모두 패키지 번호가 필요함
    // 패키지 정보 신규등록 시, 패키지 번호를 나머지 스텝에게 전달하기 위해 사용
    setPackageNumber (pkgNo) {
      this.pkgNo = pkgNo
    },
    // 각 스텝 이동 시, step 값을 변경시켜 줌
    // 마지막 스텝의 경우 Dialog 창을 종료
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
