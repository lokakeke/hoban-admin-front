<template>
  <v-container fluid>
    <v-form ref="form">
      <v-row justify="space-between">
        <v-col :key="type.typeCd" cols="auto" v-for="type in typeList">
          <v-checkbox :label="type.typeNm"
                      :value="true"
                      false-value="N"
                      true-value="Y"
                      v-model="type.existYn"
                      :readonly="!writeAuth"
          />
        </v-col>
      </v-row>
      <v-row justify="space-between">
        <v-col>
          <v-radio-group :rules="emptyRules"
                          @change="selected = []"
                          class="mt-0"
                          hide-details
                          row
                          v-model="form.typeCd"
          >
            <v-radio :key="item.name"
                      :label="item.commCdNm"
                      :value="item.commCd"
                      v-for="item in typeItem"
            />
          </v-radio-group>
          <v-text-field
            placeholder="기획전 타이틀명 입력"
            v-model="form.title"
            counter="1000"
            :rules="maxLengthRules(1000).concat(emptyRules)"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import packageService from 'Api/modules/ota/package.service'
import commonCodeService from 'Api/modules/system/commonCode.service'

export default {
  name: 'RoomPackageTypeForm',
  props: {
    isEdit: Boolean,
    pkgNoProp: String
  },
  data: function () {
    return {
      pkgNo: '',
      form: null,
      typeItem: [],
      typeList: []
    }
  },
  created () {
    this.pkgNo = this.pkgNoProp
    this.init()
    this.getCommCdList()
    this.getPackageTypeList()
  },
  methods: {
    getPackageTypeList () {
      if (this.isEdit) {
        packageService.selectRoomPackageInformation(this.pkgNo).then((response) => {
          this.typeList = response.data.packTypeCdList
          this.form.typeCd = response.data.typeCd
          this.form.title = response.data.title
        }).catch((error) => {
          console.log(error)
        })
      } else {
        packageService.selectPackageTypeList().then((response) => {
          this.typeList = response.data
        }).catch((error) => {
          console.log(error)
        })
      }
    },

    async save () {
      await this.validForm(this.$refs.form)

      const packTypeCdList = []
      const typeCheckedList = this.typeList.filter(type => type.existYn === 'Y')
      typeCheckedList.forEach(type => {
        packTypeCdList.push({ pkgNo: this.pkgNo, typeCd: type.typeCd })
      })

      await this.validCheckBoxList(packTypeCdList)

      try {
        await packageService.insertRoomPackageType(this.pkgNo, this.form, packTypeCdList)
        this.$emit('nextStep', null)
      } catch (error) {
        console.log(error)
      }
    },

    async update () {
      await this.validForm(this.$refs.form)

      const packTypeCdList = []
      const typeCheckedList = this.typeList.filter(type => type.existYn === 'Y')
      typeCheckedList.forEach(type => {
        packTypeCdList.push({ pkgNo: this.pkgNo, typeCd: type.typeCd })
      })

      await this.validCheckBoxList(packTypeCdList)

      try {
        await packageService.updateRoomPackageType(this.pkgNo, this.form, packTypeCdList)
        this.$dialog.alert('수정이 완료되었습니다.')
        this.$emit('nextStep', null)
      } catch (error) {
        console.log(error)
      }
    },

    /** 변수 초기화 */
    async init () {
      this.form = {
        typeCd: null,
        title: null
      }
    },

    /** 공통 코드 조회 */
    getCommCdList () {
      commonCodeService.selectCommonCode('OTA0011').then(res => {
        this.typeItem = res.data
      })
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
