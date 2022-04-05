<template>
  <v-container class="pa-0" fluid>
    <v-row>
      <v-col cols="12" lg="6" md="12" sm="12">
        <v-row no-gutters>
          <v-col cols="12">
            <h3 class="title font-weight-bold" style="word-break: keep-all">미판매 객실유형 리스트</h3>
          </v-col>
          <v-col cols="12">
            <p class="subtitle-1 font-weight-bold" style="word-break: keep-all" v-if="writeAuth">※ 클릭을 통해 미판매객실유형을 판매객실유형으로 이동 할 수 있습니다.</p>
          </v-col>
        </v-row>
        <v-sheet class="overflow-x-auto" elevation="1" height="500" max-height="500">
          <v-data-table :headers="roomTypeTableHeaders"
                        :items="listN"
                        :no-data-text="emptyText"
                        :class="writeAuth ? 'pointer' : ''"
                        :no-results-text="emptyText"
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
          <v-col cols="6">
            <h3 class="title font-weight-bold" style="word-break: keep-all">판매 객실유형 리스트</h3>
          </v-col>
          <v-col class="text-right" cols="6">
            <v-btn @click="addBatchSaleDate" color="info" v-if="writeAuth">
              판매일자 일괄등록
            </v-btn>
          </v-col>
          <v-col cols="12">
            <p class="subtitle-1 font-weight-bold" style="word-break: keep-all" v-if="writeAuth">※ 클릭을 통해 판매객실유형을 미판매객실유형으로 이동 할 수 있습니다.</p>
          </v-col>
        </v-row>
        <v-sheet elevation="1">
          <v-data-table :headers="roomTypeApplyTableHeaders"
                        :items="listY"
                        :no-data-text="emptyText"
                        :class="writeAuth ? 'pointer' : ''"
                        :no-results-text="emptyText"
                        @click:row="writeAuth ? moveRow($event) : ''"
                        class="bordered"
                        disable-pagination
                        disable-sort
                        fixed-header
                        height="500"
                        hide-default-footer
          >
            <template v-slot:item.saleBgnYmd="{item}">
              <v-edit-dialog
                  :return-value.sync="item.saleBgnYmd"
                  cancel-text="취소"
                  large
                  save-text="저장"
                  v-if="writeAuth"
              > {{ (item.saleBgnYmd === null || item.saleBgnYmd === '') ? '-' : item.saleBgnYmd }}
                <template v-slot:input>
                  <date-picker
                      clearable
                      format="YYYY-MM-DD"
                      hide-details
                      label="판매 시작일자"
                      required
                      :readonly="!writeAuth"
                      v-model="item.saleBgnYmd"
                  />
                </template>
              </v-edit-dialog>
              <div v-else>-</div>
            </template>
            <template v-slot:item.saleEndYmd="{item}">
              <v-edit-dialog
                  :return-value.sync="item.saleBgnYmd"
                  cancel-text="취소"
                  large
                  save-text="저장"
                  v-if="writeAuth"
              > {{ (item.saleEndYmd === null || item.saleEndYmd === '') ? '-' : item.saleEndYmd }}
                <template v-slot:input>
                  <date-picker
                      clearable
                      format="YYYY-MM-DD"
                      hide-details
                      label="판매 종료일자"
                      required
                      :readonly="!writeAuth"
                      v-model="item.saleEndYmd"
                  />
                </template>
              </v-edit-dialog>
              <div v-else>-</div>
            </template>
            <template v-slot:item.useYn="{item}">
              <v-switch :label="item.useYn === 'Y' ? '판 매': '미판매'"
                        @click.native.stop
                        class="my-0"
                        color="info"
                        false-value="N"
                        hide-details
                        inset
                        true-value="Y"
                        v-model="item.useYn"
                        :readonly="!writeAuth"
              />
            </template>
          </v-data-table>
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
import roomTypeService from '@/api/modules/ota/roomType.service'

export default {
  name: 'RoomTypeInformation',
  props: {
    isEdit: Boolean,
    storeCodeProp: String
  },
  data: function () {
    return {
      originList: [],
      roomTypeTableHeaders: [
        { text: '객실유형코드', value: 'rmTypeCode', align: 'center', sortable: false, width: '35%' },
        { text: '객실유형명', value: 'rmTypeName', align: 'center', sortable: false, width: '65%' }
      ],
      roomTypeApplyTableHeaders: [
        { text: '객실유형코드', value: 'rmTypeCode', align: 'center', sortable: false, width: '15%' },
        { text: '객실유형명', value: 'rmTypeName', align: 'center', sortable: false, width: '35%' },
        { text: '판매시작일자', value: 'saleBgnYmd', align: 'center', sortable: false, width: '15%' },
        { text: '판매종료일자', value: 'saleEndYmd', align: 'center', sortable: false, width: '15%' },
        { text: '판매여부', value: 'useYn', align: 'center', sortable: false, width: '20%' }
      ]
    }
  },
  mounted () {
    this.getStoreRoomList()
  },
  computed: {
    listN () {
      return this.originList.filter(data => data.existYn === 'N')
    },
    listY () {
      return this.originList.filter(data => data.existYn === 'Y')
    }
  },
  methods: {
    async getStoreRoomList () {
      const response = await roomTypeService.selectStoreRoomList(this.storeCdProp)
      for (const data of response.data) {
        data.saleBgnYmd = data.saleBgnYmd === null ? null : moment(data.saleBgnYmd).format('YYYY-MM-DD')
        data.saleEndYmd = data.saleEndYmd === null ? null : moment(data.saleEndYmd).format('YYYY-MM-DD')
      }
      this.originList = response.data
    },

    isEmptySaleRoom () {
      return this.listY.length === 0
    },

    async addBatchSaleDate () {
      if (this.isEmptySaleRoom()) {
        await this.$dialog.alert('판매 객실유형이 존재하지 않습니다.')
        return
      }

      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Room/BatchRegisterForm',
        params: {},
        options: {
          fullscreen: false,
          scrollable: true,
          dense: true,
          width: 600,
          closeCallback: (params) => {
            if (params && params.saleBgnYmd && params.saleEndYmd) {
              this.listY.forEach(data => {
                data.saleBgnYmd = params.saleBgnYmd
                data.saleEndYmd = params.saleEndYmd
              })
            }
          }
        }
      })
    },

    moveRow (event) {
      event.existYn = event.existYn === 'Y' ? 'N' : 'Y'
      event.useYn = event.existYn === 'Y' ? 'Y' : 'N'
    },

    moveAll (flag) {
      return this.originList.map(data => {
        data.existYn = flag === 'Y' ? 'Y' : 'N'
      })
    },

    async save () {
      if (this.isEmptySaleRoom()) {
        await this.$dialog.alert('판매 객실유형이 존재하지 않습니다.')
        return true
      }

      let isRegisteredSaleDate = true
      this.listY.forEach(data => {
        if ((data.saleBgnYmd === null || data.saleBgnYmd === '') || (data.saleEndYmd === null || data.saleEndYmd === '')) {
          isRegisteredSaleDate = false
        }
      })

      if (!isRegisteredSaleDate) {
        this.$dialog.alert('판매 시작일 또는 종료일이 지정되지 않았습니다.')
        return true
      }

      const submitList = _.cloneDeep(this.listY)
      submitList.forEach((item) => {
        item.saleBgnYmd = item.saleBgnYmd ? moment(item.saleBgnYmd).format('YYYYMMDD') : null
        item.saleEndYmd = item.saleEndYmd ? moment(item.saleEndYmd).format('YYYYMMDD') : null
      })

      try {
        const response = await roomTypeService.insertStoreRoomList(this.storeCdProp, submitList)

        if (response.data > 0) {
          this.$emit('nextStep', 'HolidayInformation')
        } else {
          this.$dialog.alert('등록 중 오류가 발생했습니다.')
        }
      } catch {}
    },

    async update () {
      if (this.isEmptySaleRoom()) {
        await this.$dialog.alert('판매 객실유형이 존재하지 않습니다.')
        return true
      }

      let isRegisteredSaleDate = true
      this.listY.forEach(data => {
        if ((data.saleBgnYmd === null || data.saleBgnYmd === '') || (data.saleEndYmd === null || data.saleEndYmd === '')) {
          isRegisteredSaleDate = false
        }
      })

      if (!isRegisteredSaleDate) {
        this.$dialog.alert('판매 시작일 또는 종료일이 지정되지 않았습니다.')
        return true
      }

      const submitList = _.cloneDeep(this.listY)
      submitList.forEach((item) => {
        item.saleBgnYmd = item.saleBgnYmd ? moment(item.saleBgnYmd).format('YYYYMMDD') : null
        item.saleEndYmd = item.saleEndYmd ? moment(item.saleEndYmd).format('YYYYMMDD') : null
      })

      try {
        const response = await roomTypeService.updateStoreRoomList(this.storeCdProp, submitList)

        if (response.data > 0) {
          this.getStoreRoomList()
          this.$dialog.alert('수정이 완료되었습니다.')
        } else {
          this.$dialog.alert('등록 중 오류가 발생했습니다.')
        }
      } catch {}
    }
  }
}
</script>
