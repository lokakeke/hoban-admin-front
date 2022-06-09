<template>
  <v-container fluid>
    <v-form ref="form">
      <v-row justify="space-between">
        <v-col :key="type.typeCode" cols="auto" v-for="type in typeList">
          <v-checkbox :label="type.typeName"
                      :value="true"
                      false-value="N"
                      true-value="Y"
                      v-model="type.existYn"
                      :readonly="!writeAuth"
          />
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import packageService from '@/api/modules/ota/package.service'

export default {
  name: 'RoomPackageTypeForm',
  props: {
    isEdit: Boolean,
    packageNoProp: String
  },
  data: function () {
    return {
      packageNo: '',
      form: {},
      typeList: [],
      selected: ''
    }
  },
  created () {
    this.packageNo = this.packageNoProp
    this.getPackageTypeList()
  },
  methods: {
    getPackageTypeList () {
      if (this.isEdit) {
        packageService.selectRoomPackageInformation(this.packageNo).then((response) => {
          this.typeList = response.data.packageTypeCodeList
        })
      } else {
        packageService.selectPackageTypeList().then((response) => {
          this.typeList = response.data
        })
      }
    },

    async save () {
      await this.validForm(this.$refs.form)

      const packageTypeCodeList = []
      const typeCheckedList = this.typeList.filter(type => type.existYn === 'Y')
      typeCheckedList.forEach(type => {
        packageTypeCodeList.push({ packageNo: this.packageNo, typeCode: type.typeCode })
      })

      await this.validCheckBoxList(packageTypeCodeList)
      await packageService.insertRoomPackageType(this.packageNo, this.form, packageTypeCodeList)
      this.$emit('nextStep', null)
    },

    async update () {
      await this.validForm(this.$refs.form)

      const packageTypeCodeList = []
      const typeCheckedList = this.typeList.filter(type => type.existYn === 'Y')
      typeCheckedList.forEach(type => {
        packageTypeCodeList.push({ packageNo: this.packageNo, typeCode: type.typeCode })
      })

      await this.validCheckBoxList(packageTypeCodeList)
      await packageService.updateRoomPackageType(packageTypeCodeList)
      this.$dialog.alert('수정이 완료되었습니다.')
      this.$emit('nextStep', null)
    },

    /** valid 체크 */
    async validCheckBoxList (list) {
      return new Promise((resolve, reject) => {
        if (list.length === 0) {
          this.$dialog.alert('체크박스를 선택 해주세요.')
          reject(new Error('체크박스를 선택 해주세요.'))
        } else {
          resolve()
        }
      })
    }
  }
}
</script>
