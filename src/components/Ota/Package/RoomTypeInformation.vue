<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="6" md="12" sm="12">
        <v-row no-gutters>
          <v-col align-self="center" cols="6">
            <span class="title font-weight-bold" style="word-break: keep-all">미판매 객실유형 리스트</span>
          </v-col>
          <v-col cols="6">
            <v-text-field
                :label="searchLabel"
                append-icon="mdi-magnify"
                hide-details
                single-line
                v-model="searchN"
            />
          </v-col>
        </v-row>
        <v-row class="mt-2" no-gutters>
          <v-col cols="12">
            <p class="subtitle-1 font-weight-bold" style="word-break: keep-all" v-if="writeAuth">※ 클릭을 통해 미판매 객실유형을 판매 객실유형으로 이동 할 수 있습니다.</p>
          </v-col>
        </v-row>
        <v-sheet class="overflow-x-auto" elevation="1" height="500" max-height="500">
          <v-data-table :class="writeAuth ? 'pointer' : ''"
                        :headers="headers"
                        :items="listN"
                        :no-data-text="emptyText"
                        :no-results-text="emptyText"
                        :search="searchN"
                        @click:row="writeAuth ? moveRow($event) : ''"
                        class="bordered"
                        disable-pagination
                        disable-sort
                        fixed-header
                        height="500"
                        hide-default-footer />
        </v-sheet>
        <v-row class="mt-3" no-gutters>
          <v-col class="text-end">
            <v-btn @click="moveAll('Y')" color="info" outlined rounded>
              모두 판매객실로
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="6" md="12" sm="12">
        <v-row no-gutters>
          <v-col align-self="center" cols="6">
            <span class="title font-weight-bold" style="word-break: keep-all">판매 객실유형 리스트</span>
          </v-col>
          <v-col cols="6">
            <v-text-field
                :label="searchLabel"
                append-icon="mdi-magnify"
                hide-details
                single-line
                v-model="searchY"
            />
          </v-col>
        </v-row>
        <v-row class="mt-2" no-gutters>
          <v-col cols="12">
            <p class="subtitle-1 font-weight-bold" style="word-break: keep-all" v-if="writeAuth">※ 클릭을 통해 판매객실유형을 미판매객실유형으로 이동 할 수 있습니다.</p>
          </v-col>
        </v-row>
        <v-sheet class="overflow-x-auto" elevation="1" height="500" max-height="500">
          <v-data-table :class="writeAuth ? 'pointer' : ''"
                        :headers="headers"
                        :items="listY"
                        :no-data-text="emptyText"
                        :no-results-text="emptyText"
                        :search="searchY"
                        @click:row="writeAuth ? moveRow($event) : ''"
                        class="bordered"
                        disable-pagination
                        disable-sort
                        fixed-header
                        height="500"
                        hide-default-footer />
        </v-sheet>
        <v-row class="mt-3" no-gutters>
          <v-col class="text-end">
            <v-btn @click="moveAll('N')" color="red" outlined rounded>
              모두 미판매객실로
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import packageService from 'Api/modules/ota/package.service'

export default {
  name: 'RoomTypeInformation',
  props: {
    isEdit: Boolean,
    pkgNoProp: String
  },
  data: function () {
    return {
      pkgNo: '',
      origin: [],
      headers: [
        { text: '영업장명 / 코드', value: 'store', align: 'center' },
        { text: '동명 / 코드', value: 'dong', align: 'center' },
        { text: '평형명 / 코드', value: 'pyeong', align: 'center' },
        { text: '객실종류명 / 코드', value: 'roomKind', align: 'center' },
        { text: '객실유형 코드', value: 'roomType', align: 'center' }
      ],
      searchN: '',
      searchY: '',

      saveData: []
    }
  },
  mounted () {
    this.pkgNo = this.pkgNoProp
    this.getPackageRoomTypeList()
  },
  computed: {
    listN () {
      return this.origin.filter(data => data.useYn === 'N')
    },
    listY () {
      return this.origin.filter(data => data.useYn === 'Y')
    }
  },
  methods: {
    getPackageRoomTypeList () {
      packageService.selectPackageRoomTypeList(this.pkgNo).then((response) => {
        const data = response.data
        this.origin = []
        data.forEach(obj => {
          this.origin.push({
            store: `${obj.storeNm} (${obj.storeCd})`,
            dong: `${obj.dongNm} (${obj.dongCd})`,
            pyeong: `${obj.pyeongNm} (${obj.pyeongCd})`,
            roomKind: `${obj.rmKindNm} (${obj.rmKindCd})`,
            roomType: `${obj.rmTypeCd}`,
            rmTypeCd: obj.rmTypeCd,
            storeCd: obj.storeCd,
            useYn: obj.otaExistYn
          })
        })
      }).catch((error) => {
        console.log(error)
      })
    },

    moveRow (event) {
      event.useYn = event.useYn === 'Y' ? 'N' : 'Y'
    },

    moveAll (flag) {
      return this.origin.map(data => {
        data.useYn = flag === 'Y' ? 'Y' : 'N'
      })
    },

    pushData () {
      if (this.listY.length === 0) {
        this.$dialog.alert('사용객실을 등록해주세요.')
        return false
      } else {
        this.saveData = []
        this.listY.forEach(room => {
          this.saveData.push({
            pkgNo: this.pkgNo,
            rmTypeCd: room.rmTypeCd,
            storeCd: room.storeCd,
            useYn: room.useYn
          })
        })

        return true
      }
    },

    async save () {
      if (!this.pushData()) return
      try {
        await packageService.insertPackageRoomTypeList(this.saveData)
        this.$emit('nextStep', 'SellerRegisterForm')
      } catch (error) {
        console.log(error)
      }
    },

    async update () {
      if (!this.pushData()) return

      try {
        await packageService.updatePackageRoomTypeList(this.saveData)
        this.$dialog.alert('수정이 완료되었습니다.')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
