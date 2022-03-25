<template>
  <dialog-base :instance="instance" :title="'객실 등록'">
    <template v-slot:buttons>
      <v-btn dark text @click="save()" :disabled="isDisabledSave">
        <v-icon left>check</v-icon>등록
      </v-btn>
    </template>
    <div style="width: 100%;display: flex;">
      <div :style="{ 'width': parentWidth+'%', 'min-width': '500px' }">
        <div class="app-card">
          <div class="app-card-content grey lighten-4" style="height: inherit;">
            <v-card outlined class="text-right grey lighten-2 mb-1" height="209">
              <v-card-title>
                전체 적용
              </v-card-title>
              <v-card-text class="black--text text-left mb-8">
                전체 적용이 필요하실 경우 정보 수정 후<br />전체적용 버튼을 눌러주세요.
              </v-card-text>
              <v-btn outlined rounded color="primary" class="text-right mt-0 mr-1 mb-1" @click="applyAll">전체 적용</v-btn>
            </v-card>
            <v-row justify="end" class="pr-3">
              <v-icon color="green darken-2">check</v-icon>필수입력
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col cols="10">
                <v-label>
                  <v-icon color="green darken-2">check</v-icon>객실명
                  <common-tooltip :type="'info'" :position="'bottom'" :text="'네이버 검색 및 고객들에게 노출되는 정보입니다.'" />
                </v-label>
                <v-text-field counter="30" v-model="itemInfoObj.name" placeholder="객실명을 입력해 주세요." :rules="maxLengthRules(30).concat(emptyRules, nameRegex)"></v-text-field>
              </v-col>
              <v-col cols="2" class="pa-0 pt-9">
                <v-btn outlined rounded color="primary" @click="applyItem('name')">복사</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="10">
                <v-label><v-icon color="green darken-2">check</v-icon>객실소개 <span class="font-sm">(최소 20자)</span></v-label>
                <v-textarea outlined counter="1000" v-model="itemInfoObj.desc" label="" placeholder="객실에 대한 소개, 자랑, 특징 및 고객들에게 꼭 알리고 싶은 내용들로 자유롭게 입력해 주세요." :rules="betweenLengthRules(20, 1000).concat(emptyRules)"></v-textarea>
              </v-col>
              <v-col cols="2" class="pa-0 pt-9">
                <v-btn outlined rounded color="primary" @click="applyItem('desc')">복사</v-btn>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col cols="12">
                <v-label><v-icon color="green darken-2">check</v-icon>이미지</v-label>
                <v-alert dense outlined type="error" class="mt-2 font-sm">
                  이미지는 [네이버 예약 파트너센터] 에서 추가/관리하시기 바랍니다.
                </v-alert>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col cols="10">
                <v-label><v-icon color="green darken-2">check</v-icon>숙박인원</v-label>
              </v-col>
              <v-col cols="2" class="pa-0">
                <v-btn outlined rounded color="primary" @click="applyItem('PersonCount')">복사</v-btn>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="itemInfoObj.minPersonCount" label="기존 투숙 인원수" :rules="oneOrMoreRegex.concat(emptyRules)" suffix="명"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="itemInfoObj.maxPersonCount" label="투숙 최대 인원수" :rules="oneOrMoreRegex.concat(emptyRules)" suffix="명"></v-text-field>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col cols="10">
                <v-label>알립니다.</v-label>
                <v-textarea outlined counter="1000" v-model="itemInfoObj.bookingPrecaution" placeholder="예약 시 고객이 주의해야 할 사항을 입력해 주세요." :rules="maxLengthRules(1000)"></v-textarea>
              </v-col>
              <v-col cols="2" class="pa-0 pt-9">
                <v-btn outlined rounded color="primary" @click="applyItem('bookingPrecaution')">복사</v-btn>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col cols="10">
                <v-label><v-icon color="green darken-2">check</v-icon>예약 허용
                  <common-tooltip :type="'info'" :position="'bottom'"
                                  :text="`최소 예약일: 예) 2일로 입력할 경우 고객은<br />최소 2박 3일 이상 예약을 해야 합니다.<br />
                                            최대 예약일: 예) 5일로 입력할 경우 고객은<br />5박 6일을 초과해서 예약을 할 수 없습니다.`" />
                </v-label>
              </v-col>
              <v-col cols="2" class="pa-0">
                <v-btn outlined rounded color="primary" @click="applyItem('BookingTime')">복사</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field v-model="itemInfoObj.minBookingTime" label="최소 예약일" suffix="일" :rules="oneOrMoreRegex.concat(emptyRules)"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="itemInfoObj.maxBookingTime" label="최대 예약일" suffix="일" disabled="disabled" :rules="oneOrMoreRegex.concat(emptyRules)"></v-text-field>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col cols="10">
                <v-label><v-icon color="green darken-2">check</v-icon>예약 개수
                  <common-tooltip :type="'info'" :position="'bottom'"
                                  :text="`최소 예약개수: 예) 2개로 입력할 경우 고객은<br />예약 시 최소 2개 이상 예약을 해야 합니다.<br />
                                            최대 예약개수: 예) 5개로 입력할 경우 고객은<br />5개를 초과해서 예약을 할 수 없습니다.`" />
                </v-label>
              </v-col>
              <v-col cols="2" class="pa-0">
                <v-btn outlined rounded color="primary" @click="applyItem('BookingCount')">복사</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field v-model="itemInfoObj.bookingCountSettingJson.minBookingCount" label="최소 예약 개수" suffix="개" :rules="oneOrMoreRegex.concat(emptyRules)"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="itemInfoObj.bookingCountSettingJson.maxBookingCount" label="최대 예약 개수" suffix="개" :rules="oneOrMoreRegex.concat(emptyRules)"></v-text-field>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row justify="space-between">
              <v-col cols="7" align-self="center" class="pr-0">
                <v-label><v-icon color="green darken-2">check</v-icon>부가정보 <span class="font-sm">(최소 1개 선택)</span></v-label>
              </v-col>
              <v-col cols="3" align-self="center" class="text-right pl-0 pr-0">
                <v-btn outlined rounded color="info" @click="addAdditionalInfo()">
                  <v-icon left>add</v-icon>추가
                </v-btn>
              </v-col>
              <v-col cols="2">
                <v-btn outlined rounded color="primary" @click="applyItem('additionalInfos')">복사</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="pt-0">
                <template v-if="itemInfoObj.additionalInfos.length > 0">
                  <v-chip class="ma-1" label v-for="(item, index) in itemInfoObj.additionalInfos" :key="index" color="blue" text-color="white">
                    {{ item }}
                  </v-chip>
                </template>
                <template v-else>
                  <v-alert dense outlined type="error" class="font-sm">
                    선택한 부가정보가 없습니다.
                  </v-alert>
                </template>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>
      <div :style="{ 'width': (100-parentWidth)+'%', 'display': 'flex' }">
        <div :style="{ 'width': childWidth+'%', 'min-width': '500px' }" v-for="(itemInfo, index) of itemInfoList" :key="index">
          <div class="app-card border">
            <div class="app-card-content" style="height: inherit;">
              <v-card outlined class="mb-1">
                <v-card-title>
                  패키지 정보
                </v-card-title>
                <v-card-text class="black--text">
                  패키지명 : {{ itemInfo.pkgNm }} ({{ itemInfo.mid }})
                </v-card-text>
                <v-card-text class="black--text pt-0">
                  영업장명 : {{ itemInfo.storeNm }} ({{ itemInfo.storeCd }})
                </v-card-text>
                <v-card-text class="black--text pt-0">
                  객실타입명 : {{ itemInfo.rmTypeNm }} ({{ itemInfo.rmTypeCd }})
                </v-card-text>
                <v-card-text class="black--text pt-0">
                  블럭코드 : {{ itemInfo.rsvBlckCd }}
                </v-card-text>
              </v-card>
              <item-info-component :originItemInfo="itemInfo" ref="itemInfo"></item-info-component>
            </div>
          </div>
        </div>
      </div>
    </div>
    <common-snackbars :text="snackbarText" v-model="isShowSnackbar" :type="snackbarType"></common-snackbars>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import ItemInfoComponent from './ItemInfoComponent'
import CommonSnackbars from 'Components/Common/CommonSnackbars.vue'
import itemService from 'Api/modules/naver/item.service'
import CommonTooltip from 'Components/Common/CommonTooltip.vue'

export default {
  extends: DialogBase,
  name: 'ItemListAddModal',
  components: {
    ItemInfoComponent,
    CommonSnackbars,
    CommonTooltip
  },
  data: function () {
    return {
      itemInfoList: [],
      itemInfoObj: {
        dmStoreId: '',
        name: '',
        desc: '',
        order: 0,
        bookingPrecaution: '',
        minPersonCount: 1,
        maxPersonCount: '',
        additionalInfos: [],
        isImp: 'N',
        isNPayUsed: 'Y',
        minBookingTime: 1,
        maxBookingTime: 1,
        bookingCountSettingJson: {
          minBookingCount: 1,
          maxBookingCount: 1
        }
      },
      parentWidth: 100,
      childWidth: 100,
      rowPerCols: 4,
      isShowSnackbar: false,
      snackbarType: 'success',
      snackbarText: '',
      isDisabledSave: false
    }
  },
  watch: {
    'itemInfoObj.minBookingTime': {
      handler (value) {
        this.itemInfoObj.maxBookingTime = _.cloneDeep(value)
      },
      deep: true
    }
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{
        target: 'escape',
        action: this.close
      }]
    })
    this.itemInfoList = this.instance.params.itemList.map(item => {
      return Object.assign(_.cloneDeep(this.itemInfoObj), item)
    })
    if (this.itemInfoList.length > 0) {
      if ((this.itemInfoList.length) < this.rowPerCols) {
        this.parentWidth = 100 / (this.itemInfoList.length + 1)
        this.childWidth = 100 / this.itemInfoList.length
      } else {
        this.parentWidth = 100 / this.rowPerCols
        this.childWidth = 100 / this.rowPerCols
      }
    }
  },
  methods: {
    applyAll () {
      for (let i = 0; i < this.instance.params.itemList.length; i++) {
        this.$refs.itemInfo[i].setData(Object.assign(_.cloneDeep(this.itemInfoObj), this.instance.params.itemList[i], { maxPersonCount: this.itemInfoObj.maxPersonCount }))
      }
    },
    applyItem (copyTargetName) {
      if (!copyTargetName) {
        this.$dialog.alert('복사할 정보가 없습니다.')
        return
      }
      for (let i = 0; i < this.instance.params.itemList.length; i++) {
        if (copyTargetName === 'PersonCount' || copyTargetName === 'BookingTime') {
          this.$refs.itemInfo[i].setItemData('min' + copyTargetName, this.itemInfoObj['min' + copyTargetName])
          this.$refs.itemInfo[i].setItemData('max' + copyTargetName, this.itemInfoObj['max' + copyTargetName])
        } else if (copyTargetName === 'BookingCount') {
          this.$refs.itemInfo[i].setItemData('min' + copyTargetName, this.itemInfoObj.bookingCountSettingJson['min' + copyTargetName])
          this.$refs.itemInfo[i].setItemData('max' + copyTargetName, this.itemInfoObj.bookingCountSettingJson['max' + copyTargetName])
        } else {
          this.$refs.itemInfo[i].setItemData(copyTargetName, this.itemInfoObj[copyTargetName])
        }
      }
    },
    addAdditionalInfo () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Naver/Item/ItemAdditionalModal',
        params: {
          additionalInfos: this.itemInfoObj.additionalInfos,
          saveModal: this.saveModal
        },
        options: {
          fullscreen: false,
          persistent: true,
          width: 750,
          scrollable: true
        }
      })
    },
    saveModal (list) {
      this.itemInfoObj.additionalInfos = list
    },
    async save () {
      let isValid = true
      for (const index in this.itemInfoList) {
        await this.$refs.itemInfo[index].getData().then(res => {
          this.itemInfoList[index] = res
        }).catch(() => {
          isValid = false
        })
        if (!isValid) {
          return
        }
      }
      if (isValid) {
        this.isDisabledSave = true
        itemService.insertItemList(this.itemInfoList).then(res => {
          this.showSnackbar('success', '저장되었습니다.')
          setTimeout(() => {
            this.$router.go(0)
          }, 1500)
        }).catch((error) => {
          if (!(error.response && error.response.status === 422)) {
            setTimeout(() => {
              this.$router.go(0)
            }, 1500)
          } else {
            this.isDisabledSave = false
          }
        })
      }
    },
    showSnackbar (type, text) {
      this.isShowSnackbar = true
      this.snackbarType = type
      this.snackbarText = text
    }
  }
}
</script>
<style scoped>
  .ghost {
    color: #FFFFFF;
    background: #e0e0e0;
  }
</style>
