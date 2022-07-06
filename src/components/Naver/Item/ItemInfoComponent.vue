<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="pt-0 px-0">
      <v-row justify="end" class="pr-3">
        <v-icon color="green darken-2">check</v-icon>필수입력
      </v-row>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="12" :class="itemInfo.isNotSameName ? compareColor : ''">
          <v-label>
            <v-icon color="green darken-2">check</v-icon>객실명
            <common-tooltip :type="'info'" :position="'bottom'" :text="'네이버 검색 및 고객들에게 노출되는 정보입니다.'" />
          </v-label>
          <v-text-field counter="30" v-model="itemInfo.name" placeholder="객실명을 입력해 주세요." :rules="maxLengthRules(30).concat(emptyRules, nameRegex)" :readonly="isReadonly"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" :class="itemInfo.isNotSameDesc ? compareColor : ''">
          <v-label><v-icon color="green darken-2">check</v-icon>객실소개 <span class="font-sm">(최소 20자)</span></v-label>
          <v-textarea outlined counter="1000" v-model="itemInfo.desc" label="" placeholder="객실에 대한 소개, 자랑, 특징 및 고객들에게 꼭 알리고 싶은 내용들로 자유롭게 입력해 주세요." :rules="betweenLengthRules(20, 1000).concat(emptyRules)" :readonly="isReadonly"></v-textarea>
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
        <v-col cols="12">
          <v-label><v-icon color="green darken-2">check</v-icon>숙박인원</v-label>
        </v-col>
        <v-col cols="6" :class="itemInfo.isNotSameMinPersonCount ? compareColor : ''">
          <v-text-field v-model="itemInfo.minPersonCount" label="기존 투숙 인원수" :rules="oneOrMoreRegex.concat(emptyRules)" suffix="명" :readonly="isReadonly"></v-text-field>
        </v-col>
        <v-col cols="6" :class="itemInfo.isNotSameMaxPersonCount ? compareColor : ''">
          <v-text-field v-model="itemInfo.maxPersonCount" label="투숙 최대 인원수" :rules="oneOrMoreRegex.concat(emptyRules)" suffix="명" :readonly="isReadonly"></v-text-field>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="12" :class="itemInfo.isNotSameBookingPrecaution ? compareColor : ''">
          <v-label>알립니다.</v-label>
          <v-textarea outlined counter="1000" v-model="itemInfo.bookingPrecaution" placeholder="예약 시 고객이 주의해야 할 사항을 입력해 주세요." :rules="maxLengthRules(1000)" :readonly="isReadonly"></v-textarea>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row>
        <v-col>
          <v-label><v-icon color="green darken-2">check</v-icon>예약 허용
            <common-tooltip :type="'info'" :position="'bottom'"
                            :text="`최소 예약일: 예) 2일로 입력할 경우 고객은<br />최소 2박 3일 이상 예약을 해야 합니다.<br />
                                            최대 예약일: 예) 5일로 입력할 경우 고객은<br />5박 6일을 초과해서 예약을 할 수 없습니다.`" />
          </v-label>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" :class="itemInfo.isNotSameMinBookingTime ? compareColor : ''">
          <v-text-field v-model="itemInfo.minBookingTime" label="최소 예약일" suffix="일" :rules="oneOrMoreRegex.concat(emptyRules)" :readonly="isReadonly"></v-text-field>
        </v-col>
        <v-col cols="6" :class="itemInfo.isNotSameMaxBookingTime ? compareColor : ''">
          <v-text-field v-model="itemInfo.maxBookingTime" label="최대 예약일" suffix="일" :rules="oneOrMoreRegex.concat(emptyRules)" :disabled="itemInfo.pkgYn === 'Y' && !isReadonly" :readonly="isReadonly"></v-text-field>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row>
        <v-col>
          <v-label><v-icon color="green darken-2">check</v-icon>예약 개수
            <common-tooltip :type="'info'" :position="'bottom'"
                            :text="`최소 예약개수: 예) 2개로 입력할 경우 고객은<br />예약 시 최소 2개 이상 예약을 해야 합니다.<br />
                                            최대 예약개수: 예) 5개로 입력할 경우 고객은<br />5개를 초과해서 예약을 할 수 없습니다.`" />
          </v-label>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" :class="itemInfo.isNotSameMaxBookingCount ? compareColor : ''">
          <v-text-field v-model="itemInfo.bookingCountSettingJson.minBookingCount" label="최소 예약 개수" suffix="개" :rules="oneOrMoreRegex.concat(emptyRules)" :readonly="isReadonly"></v-text-field>
        </v-col>
        <v-col cols="6" :class="itemInfo.isNotSameMaxBookingCount ? compareColor : ''">
          <v-text-field v-model="itemInfo.bookingCountSettingJson.maxBookingCount" label="최대 예약 개수" suffix="개" :rules="oneOrMoreRegex.concat(emptyRules)" :readonly="isReadonly"></v-text-field>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row justify="space-between">
        <v-col cols="9" align-self="center" class="pr-0">
          <v-label><v-icon color="green darken-2">check</v-icon>부가정보 <span class="font-sm">(최소 1개 선택)</span></v-label>
        </v-col>
        <v-col v-if="!isReadonly" cols="3" align-self="center" class="text-right pl-0">
          <v-btn outlined rounded color="info" @click="addAdditionalInfo()">
            <v-icon left>add</v-icon>추가
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="pt-0" :class="itemInfo.isNotSameAdditionalInfos ? compareColor : ''">
          <template v-if="itemInfo.additionalInfos.length > 0">
            <v-chip class="ma-1" label v-for="(item, index) in itemInfo.additionalInfos" :key="index" color="blue" text-color="white">
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
    </v-container>
  </v-form>
</template>

<script>
import CommonTooltip from '@/components/Common/CommonTooltip.vue'

export default {
  name: 'ItemInfoComponent',
  components: {
    CommonTooltip
  },
  props: {
    originItemInfo: Object,
    isReadonly: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data: function () {
    return {
      compareColor: 'grey lighten-3',
      itemInfo: {
        itemId: '',
        bizItemId: '',
        storeId: '',
        businessId: '',
        storeCode: '',
        rmTypeCode: '',
        pkgYn: '',
        mid: '',
        rsvBlckCode: '',
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
      }
    }
  },
  computed: {
  },
  watch: {
    'itemInfo.minBookingTime': {
      handler (value) {
        if (this.itemInfo.pkgYn === 'Y') {
          this.itemInfo.maxBookingTime = _.cloneDeep(value)
        }
      },
      deep: true
    }
  },
  methods: {
    setData (item) {
      this.itemInfo = item
    },
    setItemData (name, value) {
      if (name.indexOf('BookingCount') > -1) {
        this.itemInfo.bookingCountSettingJson[name] = value
      } else {
        this.itemInfo[name] = value
      }
    },
    getData () {
      return this.validForm(this.$refs.form).then(() => {
        if (this.itemInfo.additionalInfos.length < 1) {
          this.$dialog.alert('필수 입력값을 확인해 주세요.')
          return Promise.reject(new Error('에러'))
        }
        return Promise.resolve(this.itemInfo)
      }).catch(() => {
        return Promise.reject(new Error('에러'))
      })
    },
    addAdditionalInfo () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Naver/Item/ItemAdditionalModal',
        params: {
          additionalInfos: this.itemInfo.additionalInfos,
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
      this.itemInfo.additionalInfos = list
    }
  },
  mounted () {
    this.itemInfo = this.originItemInfo
  }
}
</script>
