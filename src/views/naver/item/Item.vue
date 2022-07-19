<template>
  <v-row wrap>
    <app-card :heading="'객실 목록'" col-classes="col-12">
      <v-row justify="space-between">
        <v-col cols="4">
          <v-autocomplete v-model="searchParam.storeId" hide-details
                          autocomplete="off"
                          :items="businessCodeList"
                          item-value="storeId"
                          item-text="serviceName"
                          label="서비스명"
                          @change="search"
          ></v-autocomplete>
        </v-col>
        <v-col cols="6" align-self="center" class="text-right">
          <v-btn outlined rounded color="orange" @click="showRoomChangeMidModal()" :disabled="this.businessCodeList.length < 1">
            회원번호 일괄 변경
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2">
          <v-autocomplete v-model="useYn" hide-details
                          autocomplete="off"
                          :items="useYnList"
                          item-value="value"
                          item-text="code"
                          label="노출 여부"
                          @change="searchList"
          ></v-autocomplete>
        </v-col>
        <v-col cols="2">
          <v-autocomplete v-model="packageYn" hide-details
                          autocomplete="off"
                          :items="packageYnList"
                          item-value="value"
                          item-text="code"
                          label="상품 타입"
                          @change="searchList"
          ></v-autocomplete>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="mid" append-icon="search" clearable label="회원번호/패키지번호" hide-details @input="searchList"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="roomTypeCode" append-icon="search" clearable label="객실타입코드" hide-details @input="searchList"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-autocomplete v-model="sendYn" hide-details
                          autocomplete="off"
                          :items="sendYnList"
                          item-value="value"
                          item-text="code"
                          label="네이버API 전송여부"
                          @change="searchList"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row justify="space-between">
        <v-col cols="6" align-self="center" class="pr-0">
          <v-btn outlined rounded color="green" @click="showOrderModal()" :disabled="this.originList.length < 1">
            노출순서 변경
          </v-btn>
          <v-btn outlined rounded color="green" @click="showChangeAllModal()" :disabled="this.originList.length < 1">
            전체설정 변경
          </v-btn>
          <v-btn outlined rounded color="green" @click="showChangeInfoModal()" :disabled="this.originList.length < 1">
            정보일괄 변경
          </v-btn>
        </v-col>
        <v-col cols="6" align-self="center" class="text-right pl-0">
          <span class="black--text pr-2">객실 <span class="blue--text">{{ list.length }}</span>건</span>
          <v-btn outlined rounded color="info" @click="addItemRoom()">
          <v-icon left>add</v-icon>객실등록</v-btn>
          <v-btn outlined rounded color="info" @click="addItemPackage()">
          <v-icon left>add</v-icon>패키지등록</v-btn>
        </v-col>
      </v-row>
      <v-data-table
        :no-data-text="'검색 결과가 없습니다.'"
        :headers="headers"
        :items="list"
        hide-default-footer
        disable-pagination
        class="bordered switch-center"
      >
        <template v-slot:header.scheduleSendYn="{header}">
          {{ header.text }}
          <common-tooltip :type="'info'" :position="'top'" :text="'객실이 미노출 중일 때만 설정할 수 있습니다.<br />해지시 일정 스케줄을 전송하지 않습니다.'" />
        </template>
        <template v-slot:item.name="{item}">
          <div @click="showDetail(item)" class="pointer pa-3 text-left">
            <v-icon>search</v-icon>
            {{ item.name | textTruncate }}
          </div>
        </template>
        <template v-slot:item.itemType="{item}">
          <v-chip v-if="item.packageYn === 'N'" small color="orange" text-color="white">객실</v-chip>
          <v-chip v-else-if="item.packageYn === 'Y'" small color="info">패키지</v-chip>
        </template>
        <template v-slot:item.pkgInfo="{item}">
          <div class="text-left pa-1" v-if="item.packageYn === 'Y'" @click="showPackageInfoModal(item)" style="cursor: pointer;">
            <p class="pa-1 ma-0">패키지명 : {{ item.pkgName }} ({{ item.mid }})</p>
            <p class="pa-1 ma-0">영업장명 : {{ item.storeName }} ({{ item.storeCode }})</p>
            <p class="pa-1 ma-0">객실타입명 : {{ item.roomTypeName }} ({{ item.roomTypeCode }})</p>
            <p class="pa-1 ma-0">시작/종료일 : {{ moment(item.pkgBgnYmd).format('YYYY.MM.DD') }} ~ {{ moment(item.pkgEndYmd).format('YYYY.MM.DD') }}</p>
            <p class="pa-1 ma-0">블럭코드 : {{ item.blockCode }}</p>
          </div>
          <div class="text-left pa-1" v-else-if="item.packageYn === 'N'" @click="showRoomInfoModal(item)" style="cursor: pointer;">
            <p class="pa-1 ma-0">회원번호 : {{ item.mid }}</p>
            <p class="pa-1 ma-0">영업장명 : {{ item.storeName }} ({{ item.storeCode }})</p>
            <p class="pa-1 ma-0">객실타입명 : {{ item.roomTypeName }} ({{ item.roomTypeCode }})</p>
            <p class="pa-1 ma-0">블럭코드 : {{ item.blockCode }}</p>
          </div>
          <div v-else>
            <v-btn outlined rounded small color="red" @click="showRoomInfoModal(item)" :disabled="isNotEditor(item)">
              객실 연결
            </v-btn>
            <v-btn outlined rounded small color="red" @click="showPackageInfoModal(item)" :disabled="isNotEditor(item)">
              패키지 연결
            </v-btn>
          </div>
        </template>
        <template v-slot:item.sendYn="{item}">
          <v-chip v-if="item.sendYn === 'Y'" small color="success">성공</v-chip>
          <template v-else>
            <v-chip small color="red" text-color="white" class="mr-2">실패</v-chip>
            <v-btn outlined rounded small color="red" @click="resendNaverApi(item)" :disabled="isDisabledResend">
              재전송
            </v-btn>
          </template>
        </template>
        <template v-slot:item.isImp="{item}">
          <v-switch v-model="item.isImp" true-value="Y" false-value="N" class="justify-center mt-0"
                    hide-details dense inset color="info" @change="changeImp(item)" :disabled="isNotEditor(item)"></v-switch>
        </template>
        <template v-slot:item.scheduleSendYn="{item}">
          <v-switch v-model="item.scheduleSendYn" true-value="Y" false-value="N" class="justify-center mt-0"
                    hide-details dense inset color="info" @change="changeScheduleSend(item)" :disabled="(isNotEditor(item) || item.isImp === 'Y')"></v-switch>
        </template>
        <template v-slot:item.isNPayUsed="{item}">
          <v-switch :input-value="item.isNPayUsed" true-value="Y" false-value="N" class="justify-center mt-0"
                    hide-details dense inset color="info" @click="changeNpay(item)" :readonly="!isNotEditor(item)" :disabled="isNotEditor(item)"></v-switch>
        </template>
        <template v-slot:item.review="{item}">
          <v-btn text block rounded color="green" @click="reviewItem(item)" :disabled="isNotEditor(item)">
            미리보기
          </v-btn>
        </template>
        <template v-slot:item.copy="{item}">
          <v-btn text block rounded color="green" @click="copyItem(item)" :disabled="(!!(isNotEditor(item) || item.packageYn === 'N' || item.scheduleSendYn === 'N'))">
            <v-icon left>file_copy</v-icon>복사
          </v-btn>
        </template>
        <template v-slot:item.delete="{item}">
          <v-btn text block rounded color="green" @click="deleteItem(item)" :disabled="isNotEditor(item)">
            <v-icon left>delete</v-icon>삭제
          </v-btn>
        </template>
      </v-data-table>
      <common-snackbars :text="snackbarText" v-model="isShowSnackbar" :type="snackbarType"></common-snackbars>
    </app-card>
  </v-row>
</template>

<script>
import itemService from '@/api/modules/naver/item.service'
import CommonSnackbars from '@/components/Common/CommonSnackbars.vue'
import CommonTooltip from '@/components/Common/CommonTooltip.vue'

export default {
  name: 'Item',
  components: {
    CommonSnackbars,
    CommonTooltip
  },
  data () {
    return {
      searchParam: {
        storeId: null
      },
      originList: [],
      list: [],
      headers: [
        { text: '객실명', value: 'name', align: 'center', sortable: false },
        { text: '상품 타입', value: 'itemType', align: 'center', sortable: false },
        { text: 'PMS 상품 정보', value: 'pkgInfo', align: 'center', sortable: false, width: 400 },
        { text: '네이버API 전송여부', value: 'sendYn', align: 'center', sortable: false, maxWidth: 200 },
        { text: '객실 노출중', value: 'isImp', align: 'center', sortable: false, maxWidth: 200 },
        { text: '스케줄전송', value: 'scheduleSendYn', align: 'center', sortable: false, maxWidth: 200 },
        { text: '네이버페이 적용중', value: 'isNPayUsed', align: 'center', sortable: false, maxWidth: 200 },
        { text: '미리보기', value: 'review', align: 'center', sortable: false, maxWidth: 200 },
        { text: '복사', value: 'copy', align: 'center', sortable: false, maxWidth: 200 },
        { text: '삭제', value: 'delete', align: 'center', sortable: false, maxWidth: 200 }
      ],
      businessCodeList: [],
      mid: '',
      roomTypeCode: '',
      packageYn: '',
      packageYnList: [
        { code: '전체', value: '' },
        { code: '미등록', value: 'X' },
        { code: '패키지', value: 'Y' },
        { code: '객실', value: 'N' }
      ],
      useYn: '',
      useYnList: [
        { code: '전체', value: '' },
        { code: '노출', value: 'Y' },
        { code: '미노출', value: 'N' }
      ],
      sendYn: '',
      sendYnList: [
        { code: '전체', value: '' },
        { code: '성공', value: 'Y' },
        { code: '실패', value: 'N' }
      ],
      isShowSnackbar: false,
      snackbarType: 'success',
      snackbarText: '',
      originItem: {},
      moment: moment,
      isDisabledResend: false
    }
  },
  computed: {
    isNotEditorList () {
      return this.originList.filter(item => { return !item.bizItemId || item.sendYn === 'N' }).length > 0
    },
    isNotSettingDgnsItemList () {
      return this.originList.filter(item => { return !item.packageYn }).length > 0
    }
  },
  mounted () {
    itemService.selectBusinessCodeList().then(res => {
      this.businessCodeList = res.data
      if (this.businessCodeList && this.businessCodeList.length > 0) {
        if (this.$route.query && this.$route.query.storeId) {
          this.searchParam.storeId = Number(this.$route.query.storeId)
          this.$nextTick(() => {
            this.search()
          })
        } else {
          this.searchParam.storeId = Number(this.businessCodeList[0].storeId)
          this.$router.replace(this.$route.path + '?storeId=' + this.businessCodeList[0].storeId)
          this.$nextTick(() => {
            this.search()
          })
        }
      }
    })
  },
  methods: {
    isNotEditor (item) {
      return (!item.bizItemId || item.sendYn === 'N')
    },
    isNotSettingDgnsItem (item) {
      return !item.packageYn
    },
    search (snackbarObj) {
      this.packageYn = ''
      this.useYn = ''
      this.mid = ''
      this.roomTypeCode = ''
      this.sendYn = ''

      if (this.$route.query && this.$route.query.storeId && (this.searchParam.storeId !== Number(this.$route.query.storeId))) {
        this.$router.replace(this.$route.path + '?storeId=' + this.searchParam.storeId)
      }
      itemService.selectItemList(this.searchParam).then(res => {
        this.originList = res.data
        this.list = _.cloneDeep(this.originList)
        if (snackbarObj && snackbarObj.text) {
          this.showSnackbar(snackbarObj.type, snackbarObj.text)
        }
      })
    },
    searchList () {
      this.mid = this.mid || ''
      this.roomTypeCode = this.roomTypeCode || ''
      this.list = _.cloneDeep(this.originList).filter((item) => {
        item.mid = item.mid || ''
        item.roomTypeCode = item.roomTypeCode || ''
        item.sendYn = item.sendYn || ''
        item.packageYn = item.packageYn || ''
        if (this.useYn === 'Y' || this.useYn === 'N') {
          return item.isImp === this.useYn && item.mid.indexOf(this.mid) > -1 && item.roomTypeCode.indexOf(this.roomTypeCode) > -1
        } else {
          return item.mid.indexOf(this.mid) > -1 && item.roomTypeCode.indexOf(this.roomTypeCode) > -1
        }
      }).filter((item) => {
        if (this.sendYn) {
          return item.sendYn.indexOf(this.sendYn) > -1
        } else {
          return item
        }
      }).filter((item) => {
        if (this.packageYn === 'Y' || this.packageYn === 'N') {
          return item.packageYn === this.packageYn
        } else if (this.packageYn === 'X') {
          return !item.packageYn
        } else {
          return item
        }
      })
    },
    addItemRoom () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Naver/Item/ItemRoomForm',
        params: {
          storeId: this.searchParam.storeId
        },
        options: {
          fullscreen: true,
          persistent: true,
          scrollable: true
        }
      })
    },
    addItemPackage () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Naver/Item/ItemPackageForm',
        params: {
          storeId: this.searchParam.storeId
        },
        options: {
          fullscreen: true,
          persistent: true,
          scrollable: true
        }
      })
    },
    showDetail (item) {
      if (this.isNotSettingDgnsItem(item)) {
        this.$dialog.alert('PMS 상품 연결을 먼저 해주세요.')
        return
      }
      if (this.isNotEditor(item)) {
        this.$dialog.alert('네이버 API 재전송을 해주세요.')
        return
      }
      this.$store.dispatch('dialog/open', {
        componentPath: '/Naver/Item/ItemView',
        params: {
          itemId: item.itemId,
          search: this.search
        },
        options: {
          fullscreen: true,
          persistent: true,
          scrollable: true
        }
      })
    },
    reviewItem (item) {
      if (this.isNotEditor(item)) {
        this.$dialog.alert('네이버 API 재전송을 해주세요.')
        return
      }
      const currentUrl = window.location.origin
      let url = `http://test.booking.naver.com/booking/3/bizes/${item.businessId}/items/${item.bizItemId}`
      if (currentUrl.indexOf('//sonoadmin.') > -1) {
        url = `https://booking.naver.com/booking/3/bizes/${item.businessId}/items/${item.bizItemId}`
      }
      window.open(url, '_blank')
    },
    copyItem (item) {
      if (this.isNotSettingDgnsItem(item)) {
        this.$dialog.alert('PMS 상품 연결을 먼저 해주세요.')
        return
      }
      if (this.isNotEditor(item)) {
        this.$dialog.alert('네이버 API 재전송을 해주세요.')
        return
      }
      if (item.scheduleSendYn === 'N') {
        this.$dialog.alert(' 스케줄 전송 등록이 된 상품만 복사 가능합니다.')
        return
      }
      this.originItem = item
      this.$nextTick(() => {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Naver/Item/ItemCopyModal',
          params: {
            copyItem: this.originItem,
            search: this.search
          },
          options: {
            fullscreen: false,
            persistent: true,
            width: 500,
            scrollable: true
          }
        })
      })
    },
    resendNaverApi (item) {
      this.$dialog.confirm('재전송하시겠습니까?').then(() => {
        this.isDisabledResend = true
        itemService.resendApiItem(item.itemId).then(() => {
          this.isDisabledResend = false
          this.showSnackbar('success', '재전송되었습니다.')
          this.search()
        }).catch(() => {
          this.isDisabledResend = false
        })
      })
    },
    changeImp (item) {
      if (this.isNotSettingDgnsItem(item)) {
        this.$dialog.alert('PMS 상품 연결을 먼저 해주세요.')
        this.search()
        return
      }
      if (this.isNotEditor(item)) {
        this.$dialog.alert('네이버 API 재전송을 해주세요.')
        this.search()
        return
      }
      const param = {
        storeId: this.searchParam.storeId,
        itemIds: item.itemId,
        isImp: item.isImp
      }
      itemService.patchItem(param).then(() => {
        this.showSnackbar('success', `[${item.name}] 예약서비스에 [${item.isImp === 'Y' ? '노출' : '미노출'}] 됩니다.`)
        this.search()
      }).catch(() => {
        this.search()
      })
    },
    changeScheduleSend (item) {
      if (this.isNotSettingDgnsItem(item)) {
        this.$dialog.alert('PMS 상품 연결을 먼저 해주세요.')
        this.search()
        return
      }
      if (this.isNotEditor(item)) {
        this.$dialog.alert('네이버 API 재전송을 해주세요.')
        this.search()
        return
      }
      if (item.isImp === 'Y') {
        this.$dialog.alert('객실이 미노출 중일 때만 설정할 수 있습니다.')
        this.search()
        return
      }
      const param = {
        storeId: this.searchParam.storeId,
        itemIds: item.itemId,
        scheduleSendYn: item.scheduleSendYn
      }
      itemService.patchItem(param).then(() => {
        this.showSnackbar('success', `[${item.name}] 스케줄 전송이 [${item.scheduleSendYn === 'Y' ? '등록' : '해지'}] 되었습니다.`)
        this.search()
      }).catch(() => {
        this.search()
      })
    },
    changeNpay (item) {
      if (this.isNotSettingDgnsItem(item)) {
        this.$dialog.alert('PMS 상품 연결을 먼저 해주세요.')
        return
      }
      if (this.isNotEditor(item)) {
        this.$dialog.alert('네이버 API 재전송을 해주세요.')
        return
      }
      this.showSnackbar('error', '[네이버 예약 파트너센터] 에서 관리하시기 바랍니다.')
    },
    showSnackbar (type, text) {
      this.isShowSnackbar = true
      this.snackbarType = type
      this.snackbarText = text
    },
    showOrderModal () {
      if (this.isNotSettingDgnsItemList) {
        this.$dialog.alert('PMS 상품 연결이 안된 상품이 존재합니다. PMS 상품 연결 후 수정해주세요.')
        return
      }
      if (this.isNotEditorList) {
        this.$dialog.alert('네이버 API 미전송 건이 존재합니다. 재전송 후 수정해주세요.')
        return
      }
      this.$store.dispatch('dialog/open', {
        componentPath: '/Naver/Item/ItemOrderModal',
        params: {
          list: this.originList,
          search: this.search
        },
        options: {
          fullscreen: false,
          persistent: true,
          width: 500,
          scrollable: true
        }
      })
    },
    showChangeAllModal () {
      if (this.isNotSettingDgnsItemList) {
        this.$dialog.alert('PMS 상품 연결이 안된 상품이 존재합니다. PMS 상품 연결 후 수정해주세요.')
        return
      }
      if (this.isNotEditorList) {
        this.$dialog.alert('네이버 API 미전송 건이 존재합니다. 재전송 후 수정해주세요.')
        return
      }
      this.$store.dispatch('dialog/open', {
        componentPath: '/Naver/Item/ItemChangeAllModal',
        params: {
          list: this.originList,
          search: this.search
        },
        options: {
          fullscreen: false,
          persistent: true,
          width: 500,
          scrollable: true
        }
      })
    },
    showRoomChangeMidModal () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Naver/Item/RoomChangeMidModal',
        params: {
          list: this.businessCodeList,
          search: this.search
        },
        options: {
          fullscreen: false,
          persistent: true,
          width: 800,
          scrollable: true
        }
      })
    },
    showChangeInfoModal () {
      if (this.isNotSettingDgnsItemList) {
        this.$dialog.alert('PMS 상품 연결이 안된 상품이 존재합니다. PMS 상품 연결 후 수정해주세요.')
        return
      }
      if (this.isNotEditorList) {
        this.$dialog.alert('네이버 API 미전송 건이 존재합니다. 재전송 후 수정해주세요.')
        return
      }
      this.$store.dispatch('dialog/open', {
        componentPath: '/Naver/Item/ItemChangeInfoModal',
        params: {
          list: this.originList,
          search: this.search
        },
        options: {
          fullscreen: false,
          persistent: true,
          width: 800,
          scrollable: true
        }
      })
    },
    showRoomInfoModal (item) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Naver/Item/RoomSettingModal',
        params: {
          dgnsItemInfo: item,
          search: this.search
        },
        options: {
          fullscreen: true,
          persistent: true,
          scrollable: true
        }
      })
    },
    showPackageInfoModal (item) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Naver/Item/PackageSettingModal',
        params: {
          dgnsItemInfo: item,
          search: this.search
        },
        options: {
          fullscreen: true,
          persistent: true,
          scrollable: true
        }
      })
    },
    deleteItem (item) {
      if (this.isNotEditor(item)) {
        this.$dialog.alert('네이버 API 재전송을 해주세요.')
        this.search()
        return
      }
      this.$dialog.confirm(`[${item.name}] 삭제 하시겠습니까? 삭제시 복구할 수 없습니다.`).then(() => {
        itemService.deleteItem(item.itemId).then(() => {
          this.showSnackbar('success', `[${item.name}] 삭제 되었습니다.`)
          this.search()
        }).catch(() => {
          this.search()
        })
      })
    }
  }
}
</script>

<style>
  .switch-center td.text-center {
    padding: 0px;
  }
  .switch-center td.text-center > div.v-input--switch {
    height: 47px;
  }
  .switch-center td.text-center > div.v-input--switch > div.v-input__control {
    max-width: 35px;
    padding-top: 9px;
  }
</style>
