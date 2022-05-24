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
            <template v-slot:item.saleStartDate="{item}">
              <v-edit-dialog
                  :return-value.sync="item.saleStartDate"
                  cancel-text="취소"
                  large
                  save-text="저장"
                  v-if="writeAuth"
              > {{ (item.saleStartDate === null || item.saleStartDate === '') ? '-' : item.saleStartDate }}
                <template v-slot:input>
                  <date-picker
                      clearable
                      format="YYYY-MM-DD"
                      hide-details
                      label="판매 시작일자"
                      required
                      :readonly="!writeAuth"
                      v-model="item.saleStartDate"
                  />
                </template>
              </v-edit-dialog>
              <div v-else>-</div>
            </template>
            <template v-slot:item.saleEndDate="{item}">
              <v-edit-dialog
                  :return-value.sync="item.saleStartDate"
                  cancel-text="취소"
                  large
                  save-text="저장"
                  v-if="writeAuth"
              > {{ (item.saleEndDate === null || item.saleEndDate === '') ? '-' : item.saleEndDate }}
                <template v-slot:input>
                  <date-picker
                      clearable
                      format="YYYY-MM-DD"
                      hide-details
                      label="판매 종료일자"
                      required
                      :readonly="!writeAuth"
                      v-model="item.saleEndDate"
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
        { text: '객실유형코드', value: 'roomTypeCode', align: 'center', sortable: false, width: '35%' },
        { text: '객실유형명', value: 'roomTypeName', align: 'center', sortable: false, width: '65%' }
      ],
      roomTypeApplyTableHeaders: [
        { text: '객실유형코드', value: 'roomTypeCode', align: 'center', sortable: false, width: '15%' },
        { text: '객실유형명', value: 'roomTypeName', align: 'center', sortable: false, width: '35%' },
        { text: '판매시작일자', value: 'saleStartDate', align: 'center', sortable: false, width: '15%' },
        { text: '판매종료일자', value: 'saleEndDate', align: 'center', sortable: false, width: '15%' },
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
    getStoreRoomList () {
      roomTypeService.selectRoomTypeInfoListByStoreCode(this.storeCodeProp).then(res => {
        for (const data of res.data) {
          data.saleStartDate = data.saleStartDate === null ? null : moment(data.saleStartDate).format('YYYY-MM-DD')
          data.saleEndDate = data.saleEndDate === null ? null : moment(data.saleEndDate).format('YYYY-MM-DD')
        }
        this.originList = res.data
      })
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
            if (params && params.saleStartDate && params.saleEndDate) {
              this.listY.forEach(data => {
                data.saleStartDate = params.saleStartDate
                data.saleEndDate = params.saleEndDate
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

    /**
     * insert 및 update 시 유효성 검사
     * @returns {boolean}
     */
    validate () {
      if (this.isEmptySaleRoom()) {
        this.$dialog.alert('판매 객실유형이 존재하지 않습니다.')
        return false
      }

      let isRegisteredSaleDate = false
      this.listY.forEach(data => {
        if (data.saleStartDate && data.saleEndDate) {
          isRegisteredSaleDate = true
        }
      })

      if (!isRegisteredSaleDate) {
        this.$dialog.alert('판매 시작일 또는 종료일이 지정되지 않았습니다.')
        return false
      }

      this.listY.forEach((item) => {
        item.saleStartDate = item.saleStartDate ? moment(item.saleStartDate).format('YYYYMMDD') : null
        item.saleEndDate = item.saleEndDate ? moment(item.saleEndDate).format('YYYYMMDD') : null
      })
      return true
    },

    async save () {
      if (this.validate()) {
        roomTypeService.insertSaleRoomTypeList(this.listY).then(res => {
          if (res.data > 0) {
            this.$emit('nextStep', 'HolidayInformation')
          } else {
            this.$dialog.alert('등록 중 오류가 발생했습니다.')
          }
        })
      }
    },

    async update () {
      if (this.validate()) {
        roomTypeService.updateSaleRoomTypeList(this.storeCodeProp, this.listY).then(res => {
          if (res.data > 0) {
            this.getStoreRoomList()
            this.$dialog.alert('수정이 완료되었습니다.')
          } else {
            this.$dialog.alert('등록 중 오류가 발생했습니다.')
          }
        })
      }
    }
  }
}
</script>
