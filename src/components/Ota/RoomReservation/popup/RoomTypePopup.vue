<template>
  <dialog-base :instance="instance" :title="'객실유형 조회'">
    <v-form ref="form" lazy-validation autocomplate="off">
      <search-form :search-param.sync="searchParam" :search-list="searchList" @search="search" disable-pagination/>
      <v-row>
        <v-col>
          <v-data-table title="코드 목록" :headers="headers" :items="roomTypeList" @click:row="chooseRoomType($event)" disable-sort disable-pagination hide-default-footer :no-data-text="'검색 결과가 없습니다.'">
            <template v-slot:item.useYn="{ item }">
              <v-simple-checkbox v-model="item.flag" disabled/>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-right">
          <v-btn outlined rounded color="primary" @click="close">닫기(ESC)</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import roomService from '@/api/modules/ota/roomReservation.service'

export default {
  extends: DialogBase,
  name: 'RmTypePopup',
  computed: {
    searchList () {
      return [
        {
          key: 'storeCode',
          label: '영업장코드',
          type: 'text',
          defaultValue: this.storeCode,
          disabled: true,
          cols: 2
        },
        {
          key: 'roomTypeCode',
          label: '코드/명',
          type: 'text',
          cols: 4
        },
        {
          key: 'useYn',
          label: '사용여부',
          type: 'select',
          list: this.useList,
          listText: 'code',
          listValue: 'value',
          defaultValue: this.useList[0].value,
          cols: 4
        }
      ]
    }
  },
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      headers: [
        {
          text: 'No',
          value: 'number',
          align: 'center'
        },
        {
          text: '코드',
          value: 'roomTypeCode',
          align: 'center'
        },
        {
          text: '코드명',
          value: 'roomTypeName',
          align: 'center'
        },
        {
          text: '사용여부',
          value: 'useYn',
          align: 'center'
        }
      ],
      roomTypeList: [],
      roomTypeCode: '',
      storeCode: '',
      packageNo: '',
      useList: [
        { code: '전체', value: null },
        { code: '사용', value: 'Y' },
        { code: '미사용', value: 'N' }
      ]
    }
  },
  created () {
    this.storeCode = _.cloneDeep(this.instance.params.item.storeCode)
    this.packageNo = _.cloneDeep(this.instance.params.item.packageNo)
    this.search()
  },
  methods: {
    /**
     * 검색
     */
    async search () {
      const param = {}
      // 패키지에서 객실유형 팝업을 열었을 경우 packageNo 값을 넘겨줘야 함.
      // 서비스단에서 packageNo 유무로 조건에 따라 다른 쿼리 호출
      if (this.packageNo) {
        param.packageNo = this.packageNo
      }
      // 영업장 코드는 필수
      if (this.storeCode) {
        param.storeCode = this.storeCode
      } else if (this.searchParam.q.storeCode) {
        param.storeCode = this.searchParam.q.storeCode
      }
      if (this.searchParam.q.roomTypeCode) {
        param.roomTypeCode = this.searchParam.q.roomTypeCode
      }
      // 사용여부
      param.useYn = this.searchParam.q.useYn ? this.searchParam.q.useYn : 'Y'
      const res = await roomService.selectRoomTypeAndDongInfo(param)
      this.noRoomTypeList(res.data)
    },
    /**
     * 1개의 객실 유형 선택
     */
    chooseRoomType (row) {
      this.close({ data: row })
    },
    /**
     * 객실 유형 목록 생성
     */
    noRoomTypeList (param) {
      this.roomTypeList = param
      if (param && param.length === 0) {
        this.$dialog.alert('조건에 해당하는 자료가 없습니다.')
      } else {
        this.addCheckBox(this.roomTypeList)
        for (let i = 1; i < param.length + 1; i++) {
          this.roomTypeList[i - 1].number = i
        }
      }
    },
    /**
     * 사용여부 체크박스 생성
     */
    addCheckBox (items) {
      for (const item of items) {
        item.flag = item.useYn === 'Y'
      }
    }
  }
}
</script>
