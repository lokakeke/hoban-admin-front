<template>
  <v-row wrap>
    <app-card :heading="'부대시설 판매 목록'" col-classes="col-12">
      <v-row>
        <v-col cols="2">
          <v-autocomplete v-model="saleYn" hide-details
                          autocomplete="off"
                          :items="saleYnList"
                          item-value="value"
                          item-text="code"
                          label="노출 여부"
                          @change="searchList"
          ></v-autocomplete>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="filter" append-icon="search" clearable label="부대시설 판매명" hide-details @keyup="searchList"></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="space-between">
        <v-col cols="6" align-self="center" class="pr-0">
          <v-btn outlined rounded color="green" @click="showOrderModal()" :disabled="cloneList.length < 1">
            노출순서 변경
          </v-btn>
          <v-btn outlined rounded color="green" @click="showChangeAllModal()" :disabled="cloneList.length < 1">
            전체설정 변경
          </v-btn>
<!--          <v-btn outlined rounded color="green" @click="showChangeInfoModal()" :disabled="cloneList.length < 1">
            정보일괄 변경
          </v-btn>-->
        </v-col>
        <v-col cols="6" align-self="center" class="text-right pl-0">
          <v-btn outlined rounded color="info" @click="openModal()">
            <v-icon left>add</v-icon>부대시설 추가</v-btn>
        </v-col>
      </v-row>
      <v-data-table
        :no-data-text="'검색 결과가 없습니다.'"
        :headers="headers"
        :items="list"
        hide-default-footer
        disable-pagination
        class="bordered switch-center pointer"
      >
        <template v-slot:item.subFcltSaleNm="{item}">
          <div @click="openModal(item)">{{ item.subFcltSaleNm }}</div>
        </template>
        <template v-slot:item.saleYmd="{item}">
          <div @click="openModal(item)">{{ item.saleYmd }}</div>
        </template>
        <template v-slot:item.saleHm="{item}">
          <div @click="openModal(item)">{{ item.saleHm }}</div>
        </template>
        <template v-slot:item.saleYn="{item}">
          <v-switch v-model="item.saleYn" true-value="Y" false-value="N" class="mt-0 justify-center"
                    hide-details dense inset color="info" @change="changeSwitch(item, 'S')"></v-switch>
        </template>
        <template v-slot:item.persCntYn="{item}">
          <v-switch v-model="item.persCntYn" true-value="Y" false-value="N" class="mt-0 justify-center"
                    hide-details dense inset color="info" @change="changeSwitch(item, 'P')"></v-switch>
        </template>
        <template v-slot:item.qtyYn="{item}">
          <v-switch v-model="item.qtyYn" true-value="Y" false-value="N" class="mt-0 justify-center"
                    hide-details dense inset color="info" @change="changeSwitch(item, 'Q')"></v-switch>
        </template>
      </v-data-table>
      <common-snackbars :text="snackbarText" v-model="isShowSnackbar" :type="snackbarType"></common-snackbars>
    </app-card>
  </v-row>
</template>

<script>
import facilityService from '@/api/modules/userSystem/facility.service'
import CommonSnackbars from '@/components/Common/CommonSnackbars.vue'

export default {
  name: 'facilityManagement',
  components: {
    CommonSnackbars
  },
  data () {
    return {
      list: [],
      cloneList: [],
      filter: '',
      saleYn: '',
      headers: [
        { text: '판매여부', value: 'saleYn', align: 'center', sortable: false },
        { text: '부대시설 판매명', value: 'subFcltSaleNm', align: 'center', sortable: false, width: 400 },
        { text: '판매기간', value: 'saleYmd', align: 'center', sortable: false, width: 300 },
        { text: '판매시간', value: 'saleHm', align: 'center', sortable: false, width: 300 },
        { text: '인원수 입력여부', value: 'persCntYn', align: 'center', sortable: false },
        { text: '수량 입력여부', value: 'qtyYn', align: 'center', sortable: false },
        { text: '미리보기', value: 'review', align: 'center', sortable: false }
      ],
      saleYnList: [
        { code: '전체', value: '' },
        { code: '노출', value: 'Y' },
        { code: '미노출', value: 'N' }
      ],
      isShowSnackbar: false,
      snackbarType: 'success',
      snackbarText: ''
    }
  },
  computed: {
  },
  mounted () {
    this.selectFacilityList()
  },
  methods: {
    // 부대시설 판대목록 조회
    selectFacilityList () {
      this.list = []
      facilityService.selectFacilityManageList().then(res => {
        this.list = res.data
        // 판매기간, 판매시간 set
        this.setSaleYmd()
      })
    },
    // 판매목록 검색
    searchList () {
      if (this.filter !== '') {
        this.list = _.cloneDeep((this.cloneList.filter(data => data.subFcltSaleNm.indexOf(this.filter) !== -1)))
      } else if (this.saleYn !== '') {
        this.list = _.cloneDeep(_.filter(this.cloneList, { saleYn: this.saleYn }))
      } else {
        this.list = this.cloneList
      }
    },
    // 판매기간, 판매시간 set
    setSaleYmd () {
      this.list.forEach(item => {
        if (_.some(item.saleBgnYmd) && _.some(item.saleEndYmd)) {
          item.saleYmd = [moment(item.saleBgnYmd).format('YYYY.MM.DD'), moment(item.saleEndYmd).format('YYYY.MM.DD')].join(' ~ ')
        }
        if (_.some(item.saleBgnHm) && _.some(item.saleEndHm)) {
          item.saleHm = [item.saleBgnHm.match(/\d{2}/g).join(':'), item.saleEndHm.match(/\d{2}/g).join(':')].join(' ~ ')
        }
        this.cloneList = _.cloneDeep(this.list)
      })
    },
    // 부대시설 추가/수정(상세)
    openModal (item) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/UserSystem/Facility/FacilityForm',
        params: {
          form: item
        },
        options: {
          fullscreen: true,
          persistent: true,
          scrollable: true,
          closeCallback: async (param) => {
            if (param && param.reload === 'Y') {
              this.selectFacilityList()
            }
          }
        }
      })
    },
    // 미리보기
    reviewItem (item) {
    },
    // 스위치 변경(판매,인원수,수량 입력여부)
    async changeSwitch (item, type) {
      let name
      let columnType
      if (type === 'S') {
        name = '판매'
        columnType = 'saleYn'
      } else if (type === 'P') {
        name = '인원수 입력'
        columnType = 'persCntYn'
      } else {
        name = '수량 입력'
        columnType = 'qtyYn'
      }
      await facilityService.updateFacilityMenu(item).then(() => {
        this.showSnackbar('success', `[${item.subFcltSaleNm}] ${name}여부가 [${item[columnType] === 'Y' ? '노출' : '미노출'}] 됩니다.`)
      })
    },
    // 알림
    showSnackbar (type, text) {
      this.isShowSnackbar = true
      this.snackbarType = type
      this.snackbarText = text
    },
    // 노출 순서 변경 모달
    showOrderModal () {
      this.openChangeModal('FacilityOrderModal')
    },
    // 전체 설정변경 모달
    showChangeAllModal () {
      this.openChangeModal('FacilityChangeAllModal')
    },
    // 정보일괄변경 모달
    showChangeInfoModal () {
    },
    // 팝업
    openChangeModal (viewName) {
      this.$store.dispatch('dialog/open', {
        componentPath: `/UserSystem/Facility/${viewName}`,
        params: {
          list: this.list
        },
        options: {
          fullscreen: false,
          persistent: true,
          width: 500,
          scrollable: true,
          closeCallback: async (param) => {
            if (param) {
              if (param.reload === 'Y') {
                this.selectFacilityList()
              }
              if (param.type && param.text) {
                this.showSnackbar(param.type, param.text)
              }
            }
          }
        }
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
