<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    persistent
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable>
    <v-card tile>
      <v-card-title class="pa-0">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="close()">
            <v-icon>close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-title>{{ packageYn === 'N' ? '객실' : '패키지' }} 동기화</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="submit()">
              <v-icon>refresh</v-icon>
              동기화 실행
            </v-btn>
            <v-btn dark text @click="close()">Close</v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-card-title>
      <v-card-text class="pt-3">
        <v-layout wrap>
          <select-box :selected.sync="branchNo" :list="branchList" :title="'사업장'" :value="'branchNo'" :text="'branchName'"></select-box>
          <v-btn outlined rounded color="orange" @click="sync()">
            <v-icon left>search</v-icon>
            TL-Lincoln 객실타입 동기화 조회
          </v-btn>
        </v-layout>
        <v-divider></v-divider>
        <template v-if="isSync !== null">
          <v-layout justify-space-between>
            <span class="headline">현재 동기화 여부 : {{ isSync }}</span>
            <h5>
              <v-icon large>panorama_fish_eye</v-icon>
              변경없음
              <v-icon large color="#B3E5FC">lens</v-icon>
              추가됨
              <v-icon large color="#FFE082">lens</v-icon>
              변경됨
              <v-icon large color="#EF9A9A">lens</v-icon>
              삭제됨
            </h5>
          </v-layout>
          <v-layout>
            <v-flex xs12>
              <v-form ref="syncForm" lazy-validation autocomplete="off">
                <table class="bordered">
                  <thead class="head">
                    <tr>
                      <th colspan="2" class="table-contents">객실 타입 정보</th>
                      <th class="table-contents">TL-Lincoln 시스템 객실마스터 정보</th>
                    </tr>
                  </thead>
                  <tbody>
                  <template v-for="data of roomTypeSync">
                    <tr>
                      <th rowspan="8" class="bottom-border left-border table-contents">{{ data.tlRmTypeInfo.tlRmTypeName }}</th>
                      <th class="table-contents right-border">TL 객실타입코드</th>
                      <td :class="data.adminRmTypeInfo.tlRmTypeCode.state" class="right-border">
                        {{ data.adminRmTypeInfo.tlRmTypeCode.value }}
                      </td>
                    </tr>
                    <tr>
                      <th class="table-contents right-border">TL 객실타입명</th>
                      <td :class="data.adminRmTypeInfo.tlRmTypeName.state" class="right-border">
                        {{ data.adminRmTypeInfo.tlRmTypeName.value }}
                      </td>
                    </tr>
                    <tr>
                      <th class="table-contents right-border">TL 온라인객실타입그룹코드</th>
                      <td :class="data.adminRmTypeInfo.tlNetRmTypeGroupCode.state" class="right-border">
                        {{ data.adminRmTypeInfo.tlNetRmTypeGroupCode.value }}
                      </td>
                    </tr>
                    <tr>
                      <th class="table-contents right-border">TL 온라인객실타입그룹명</th>
                      <td :class="data.adminRmTypeInfo.tlNetRmTypeGroupName.state" class="right-border">
                        {{ data.adminRmTypeInfo.tlNetRmTypeGroupName.value }}
                      </td>
                    </tr>
                    <tr>
                      <th class="table-contents right-border">판매처 리스트</th>
                      <td class="pa-2 right-border">
                        <table class="bordered dense">
                          <thead>
                          <tr>
                            <th>판매처</th>
                            <th>판매처<br/>객실타입코드</th>
                            <th>판매처<br/>객실타입명</th>
                            <th v-show="false">TL<br/>재고조정여부</th>
                            <th v-show="false">TL<br/>사용여부</th>
                          </tr>
                          </thead>
                          <tbody>
                            <tr v-for="agt of data.adminRmTypeInfo.netAgtRmTypeList">
                              <td :class="agt.agentName.state">{{ agt.agentName.value }}</td>
                              <td :class="agt.netAgtRmTypeCode.state">{{ agt.netAgtRmTypeCode.value }}</td>
                              <td :class="agt.netAgtRmTypeName.state">
                                <v-tooltip top>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon text v-bind="attrs" v-on="on">
                                      {{ agt.netAgtRmTypeName.value | textTruncate(45, '...') }}
                                    </v-btn>
                                  </template>
                                  <span>{{ agt.netAgtRmTypeName.value }}</span>
                                </v-tooltip>
                              </td>
                              <td v-show="false" :class="agt.isStockAdjustable.state">{{ agt.isStockAdjustable.value }}</td>
                              <td v-show="false" :class="agt.lincolnUseFlag.state">{{ agt.lincolnUseFlag.value }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <th class="table-contents right-border">
                        Plan Group 정보
                      </th>
                      <td class="right-border pa-2">
                        <template v-if="data.planList && data.planList.length > 0">
                          <template v-for="(plan, index) of data.planList">
                            <span v-if="plan.state !== 'match'">
                              <v-chip :type="plan.state" class="mt-1 mb-1 mr-2" style="background-color: #B3E5FC;">{{ plan.planGroupName + ' - (' + plan.planGroupCode + ')' }}</v-chip>
                            </span>
                            <span v-else>
                              <v-chip class="mt-1 mb-1 mr-2">{{ plan.planGroupName + ' - (' + plan.planGroupCode + ')' }}</v-chip>
                            </span>
                            <br v-if="index > 0 && index % 3 === 0"/>
                          </template>
                        </template>
                        <template v-else>
                          <div class="subheading deep-orange--text">
                            <p class="mb-2 mt-2">* 객실에 포함된 요금 PLAN 정보가 없습니다.</p>
                            <p class="mb-0" v-if="packageYn === 'N'">* TL-Lincoln 관리자 사이트에서 요금 PLAN GROUP NAME 이</p>
                            <p class="mb-1 ml-2" v-if="packageYn === 'N'"> roomonly 또는 breakfast 로 생성되어야 합니다.</p>
                          </div>
                        </template>
                      </td>
                    </tr>
                    <tr>
                      <th class="table-contents right-border">PMS 객실 정보</th>
                      <td class="top-border right-border">
                        <v-row wrap>
                          <v-col cols="12">
                            <div class="title-2 font-weight-bold brown--text">PMS 룸타입</div>
                            <v-autocomplete v-model="data.tlRmTypeInfo.roomTypeCode"
                                            :items="pmsStoreRoomInfoList"
                                            :rules="[v => !!v || '룸타입은 필수입력 사항입니다.']"
                                            :item-value="'roomTypeCode'"
                                            :item-text="'roomTypeName'"
                                            @change="changeRoomType(data.tlRmTypeInfo)"
                                            class="pt-0"></v-autocomplete>
                          </v-col>
                        </v-row>
                      </td>
                    </tr>
                    <tr>
                      <th class="bottom-border table-contents right-border">PMS 숙박 인원 수</th>
                      <td class="bottom-border right-border">
                        <v-row wrap>
                          <v-col cols="6">
                            <div class="title-2 font-weight-bold brown--text">기준인원수</div>
                            <v-text-field type="number" v-model="data.tlRmTypeInfo.minPersonCount" :rules="numberRules" class="pt-0" required disabled></v-text-field>
                          </v-col>
                          <v-col cols="6">
                            <div class="title-2 font-weight-bold brown--text">최대인원수</div>
                            <v-text-field type="number" v-model="data.tlRmTypeInfo.maxPersonCount" :rules="numberRules" class="pt-0" required disabled></v-text-field>
                          </v-col>
                        </v-row>
                      </td>
                    </tr>
                    <tr v-show="false">
                      <th class="bottom-border table-contents right-border">
                        PMS 블럭 맵핑
                        <br/>
                        <v-btn small outlined rounded color="blue" class="mb-0" @click="add(data.tlRmTypeInfo.blockList)">
                          <v-icon small>add</v-icon>
                          추가
                        </v-btn>
                      </th>
                      <td class="bottom-border pa-2 right-border">
                        <div class="mt-1 title-2 font-weight-bold deep-orange--text">* 마스터 블럭은 필수로 지정해 주셔야 합니다.</div>
                        <table class="bordered dense mt-1">
                          <thead>
                          <tr>
                            <th>마스터 블럭</th>
                            <th>PMS 블럭코드</th>
                            <th>사용여부</th>
                            <th>예약 우선순위</th>
                            <th>삭제</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="(block, index) of data.tlRmTypeInfo.blockList">
                            <td>
                              <v-checkbox v-model="block.masterYn" class="justify-center mt-0" label="" true-value="Y" false-value="N" hide-details
                                          @change="changeMaster(data.tlRmTypeInfo.blockList, index)"/>
                            </td>
                            <td>
                              <v-text-field type="text" v-model="block.blockCode" :rules="emptyRules" hide-details class="pt-0 mt-0"></v-text-field>
                            </td>
                            <td>
                              <v-switch v-model="block.useYn" true-value="Y" false-value="N" class="justify-center mt-0" :label="block.useYn === 'Y'? '사용': '중지'"
                                        color="blue" hide-details :readonly="block.masterYn === 'Y'"></v-switch>
                            </td>
                            <td>
                              <v-text-field type="number" v-model="block.rsvOrder" :rules="orderRules" hide-details class="pt-0 mt-0"></v-text-field>
                            </td>
                            <td class="text-xs-center">
                              <v-btn small color="amber darken-4" outlined rounded @click="remove(data.tlRmTypeInfo.blockList, index)">
                                <v-icon small>delete</v-icon>
                                삭제
                              </v-btn>
                            </td>
                          </tr>
                          <tr v-if="!data.tlRmTypeInfo.blockList || data.tlRmTypeInfo.blockList.length === 0">
                            <td colspan="5" class="text-xs-center">
                              데이터가 없습니다.
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </template>
                  </tbody>
                </table>
              </v-form>
            </v-flex>
          </v-layout>
          <v-layout justify-end mt-2>
            <v-btn outlined rounded color="primary" @click="submit()">
              <v-icon>refresh</v-icon>
              동기화 실행
            </v-btn>
          </v-layout>
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import roomTypeService from '@/api/modules/tl/roomType.service'
import planService from '@/api/modules/tl/plan.service'
import SelectBox from '@/components/SelectAll/SelectBox.vue'
import moment from 'moment'
import commonCodeService from '@/api/modules/system/commonCode.service'

export default {
  name: 'roomTypeSync',
  components: { SelectBox },
  props: ['dialog', 'branchList', 'selectBrcNo', 'pmsStoreRoomInfoList', 'packageYn'],
  data () {
    return {
      branchNo: '',
      storeCode: '',
      roomTypeSync: [],
      isSync: null,
      orderRules: [
        v => !!v || '필수 입력항목입니다.',
        v => !(v < 1) || '0 이상의 값을 입력해 주세요.'
      ],
      numberRules: [
        v => (v !== 0 ? !!v : true) || '필수 입력항목입니다.',
        v => (!v || /^[0-9\\,]+$/.test(v)) || '숫자만 입력 가능합니다.'
      ],
      defaultBlockList: [
        { masterYn: 'Y', blockCode: '000', useYn: 'Y', rsvOrder: '1' }
      ]
    }
  },
  computed: {
    branchName () {
      let text = ''
      if (!this.branchNo) {
        text = '사업장을 선택하세요.'
      } else {
        text += _.find(this.branchList, { branchNo: this.branchNo }).branchName
      }
      return text
    }
  },
  watch: {
    selectBrcNo (newVal) {
      this.branchNo = newVal
    },
    dialog (newVal) {
      if (newVal) {
        this.isSync = null
        this.sync()
      }
    }
  },
  methods: {
    moment (date) {
      return moment(date).format('YYYY.MM.DD')
    },
    add (blockList) {
      blockList.push({ masterYn: 'N', useYn: 'Y' })
    },
    remove (blockList, index) {
      this.$dialog.confirm('선택한 블럭을 삭제하시겠습니까?').then(() => {
        blockList.splice(index, 1)
      }, () => {
      })
    },
    changeMaster (blockList, index) {
      // 해당 로우를 제외하고는 master 를 해제한다.
      for (let idx = 0; idx < blockList.length; idx++) {
        if (idx !== index) {
          blockList[idx].masterYn = 'N'
        } else {
          // 마스터 블럭일 경우 사용여부 는 무조건 Y
          blockList[idx].useYn = 'Y'
        }
      }
    },
    close () {
      this.$emit('update:dialog', false)
    },
    async sync () {
      // 사업장 선택 validation
      if (!this.branchNo) {
        this.$dialog.alert('사업장을 선택해 주세요.')
        return
      }
      this.roomTypeSync = []
      // TL 객실타입 동기화 여부 조회
      const sync = await roomTypeService.selectRoomTypeSync(this.branchNo, this.packageYn)
      this.isSync = sync.data

      // TL 요금 plan 리스트 조회
      const plan = await planService.selectBranchPlanGroupInfo(this.branchNo)
      const planMasterList = plan.data

      // TL 객실 타입 마스터 조회
      const res = await roomTypeService.selectTLRoomTypeList(this.branchNo, this.packageYn)
      const tlRmTypeMaster = res.data

      // TL - Admin 동기화 데이터 sync
      if (!(tlRmTypeMaster.commonResponse && tlRmTypeMaster.commonResponse.isSuccess === 'true')) {
        this.$dialog.alert('TL-Lincoln 객실정보 조회에 실패하였습니다.<br/>관리자에게 문의하여 주세요.')
        return
      }
      // TL-Lincoln 데이터를 검증한다.
      if ((!tlRmTypeMaster.rmTypeList || tlRmTypeMaster.rmTypeList.length === 0) || (!tlRmTypeMaster.netRmTypeGroupList || tlRmTypeMaster.netRmTypeGroupList.length === 0) ||
            tlRmTypeMaster.rmTypeList.length !== tlRmTypeMaster.netRmTypeGroupList.length) {
        this.$dialog.alert('TL-Lincoln 객실타입 정보가 잘못되었습니다.<br/>관리자에게 문의바랍니다.')
        return
      }
      let tlRmTypeList = []
      const originTlRmTypeList = tlRmTypeMaster.rmTypeList
      const commonAgtList = await commonCodeService.selectCommonCode('agent').then(res => {
        return res.data
      })
      for (const tlRmType of originTlRmTypeList) {
        const tlNetRmTypeGroup = _.find(tlRmTypeMaster.netRmTypeGroupList, { roomTypeCode: tlRmType.roomTypeCode })
        if (!tlNetRmTypeGroup) {
          this.$dialog.alert('TL-Lincoln 객실타입 정보가 잘못되었습니다.<br/>관리자에게 문의바랍니다.')
          return
        } else {
          const row = {
            tlRmTypeCode: tlRmType.roomTypeCode,
            tlRmTypeName: tlRmType.roomTypeName,
            tlNetRmTypeGroupCode: tlNetRmTypeGroup.netRmTypeGroupCode,
            tlNetRmTypeGroupName: tlNetRmTypeGroup.netRmTypeGroupName
          }
          const netAgtRmTypeArray = []
          if (tlRmTypeMaster.netAgtRmTypeList && tlRmTypeMaster.netAgtRmTypeList.length > 0) {
            // TL-Lincoln 객실타입과 링크설정이 되어 있는지 확인 [필수]
            if (_.some(tlRmTypeMaster.netAgtRmTypeList, { roomTypeCode: '----' })) {
              this.$dialog.alert('TL-Lincoln 객실타입코드 설정이 안된 객실이 있습니다.<br/>TL-Lincoln 에서 설정 완료 후 동기화를 해주세요.')
              return
              // TL-Lincoln 온라인 객실타입 그룹과 링크 설정이 되어 있는지 확인 [필수]
            } else if (_.some(tlRmTypeMaster.netAgtRmTypeList, { netRmTypeGroupCode: '---' })) {
              this.$dialog.alert('TL-Lincoln 온라인객실타입 그룹코드 설정이 안된 객실이 있습니다.<br/>TL-Lincoln 에서 설정 완료 후 동기화를 해주세요.')
              return
            }
            const tlNetAgtRmTypeList = _.filter(tlRmTypeMaster.netAgtRmTypeList, { roomTypeCode: tlRmType.roomTypeCode })
            if (tlNetAgtRmTypeList && tlNetAgtRmTypeList.length > 0) {
              for (const tlNetAgtRmType of tlNetAgtRmTypeList) {
                netAgtRmTypeArray.push({
                  agentName: _.some(commonAgtList, { commonCode: tlNetAgtRmType.agentCode }) ? _.find(commonAgtList, { commonCode: tlNetAgtRmType.agentCode }).commonCodeName : '',
                  agentCode: tlNetAgtRmType.agentCode,
                  netAgtRmTypeCode: tlNetAgtRmType.netAgtRmTypeCode,
                  netAgtRmTypeName: tlNetAgtRmType.netAgtRmTypeName,
                  tlRmTypeCode: tlNetAgtRmType.roomTypeCode,
                  tlNetRmTypeGroupCode: tlNetAgtRmType.netRmTypeGroupCode,
                  isStockAdjustable: tlNetAgtRmType.isStockAdjustable === 'true' ? 'Y' : 'N',
                  lincolnUseFlag: tlNetAgtRmType.lincolnUseFlag === '1' ? 'Y' : 'N'
                })
              }
            }
          }
          row.netAgtRmTypeList = netAgtRmTypeArray
          tlRmTypeList.push({ tlRmTypeInfo: row })
        }
      }
      // ADMIN 시스템 룸타입 정보
      const adminRmType = await roomTypeService.selectRoomTypeList({ branchNo: this.branchNo, packageYn: this.packageYn })
      const adminRmTypeList = adminRmType.data
      // FIXME 2개만 TEST
      tlRmTypeList = [tlRmTypeList[0], tlRmTypeList[1]]

      for (const tlRmType of tlRmTypeList) {
        const tlRmTypeInfo = tlRmType.tlRmTypeInfo
        const adminRmTypeInfo = {}
        // 현재 ADMIN 정보에 맵핑되는 데이터가 있는지 확인한다.
        let matchAdminRmTypeInfo = _.some(adminRmTypeList, { tlRmTypeCode: tlRmTypeInfo.tlRmTypeCode }) ? _.find(adminRmTypeList, { tlRmTypeCode: tlRmTypeInfo.tlRmTypeCode }) : {}
        let match = true
        if (_.isEmpty(matchAdminRmTypeInfo)) {
          matchAdminRmTypeInfo = tlRmTypeInfo
          match = false
        }
        // PMS 영업장 코드
        this.storeCode = _.find(this.branchList, { branchNo: this.branchNo }).storeCode
        tlRmTypeInfo.storeCode = match ? matchAdminRmTypeInfo.storeCode : this.storeCode
        // PMS 객실타입 코드
        this.selectHotel(tlRmType)
        tlRmTypeInfo.roomTypeCode = match ? matchAdminRmTypeInfo.roomTypeCode : ''
        // 기준인원수
        tlRmTypeInfo.minPersonCount = match ? matchAdminRmTypeInfo.minPersonCount : ''
        // 최대인원수
        tlRmTypeInfo.maxPersonCount = match ? matchAdminRmTypeInfo.maxPersonCount : ''
        // PMS 블럭코드
        tlRmTypeInfo.blockList = match ? matchAdminRmTypeInfo.blockList : _.cloneDeep(this.defaultBlockList)
        // 사업장 코드
        tlRmTypeInfo.branchNo = this.branchNo

        // 패키지 여부
        tlRmTypeInfo.packageYn = match ? matchAdminRmTypeInfo.packageYn : 'N'
        // 객실타입 코드
        adminRmTypeInfo.tlRmTypeCode = {
          value: tlRmTypeInfo.tlRmTypeCode,
          state: !match ? 'insert' : (matchAdminRmTypeInfo.tlRmTypeCode !== tlRmTypeInfo.tlRmTypeCode ? 'update' : 'match')
        }
        // 객실타입 이름
        adminRmTypeInfo.tlRmTypeName = {
          value: tlRmTypeInfo.tlRmTypeName,
          state: !match ? 'insert' : (matchAdminRmTypeInfo.tlRmTypeName !== tlRmTypeInfo.tlRmTypeName ? 'update' : 'match')
        }
        // 객실타입 그룹 코드
        adminRmTypeInfo.tlNetRmTypeGroupCode = {
          value: tlRmTypeInfo.tlNetRmTypeGroupCode,
          state: !match ? 'insert' : (matchAdminRmTypeInfo.tlNetRmTypeGroupCode !== tlRmTypeInfo.tlNetRmTypeGroupCode ? 'update' : 'match')
        }
        // 객실타입 그룹 이름
        adminRmTypeInfo.tlNetRmTypeGroupName = {
          value: tlRmTypeInfo.tlNetRmTypeGroupName,
          state: !match ? 'insert' : (matchAdminRmTypeInfo.tlNetRmTypeGroupName !== tlRmTypeInfo.tlNetRmTypeGroupName ? 'update' : 'match')
        }
        // 맵핑 AGENT 리스트
        const agtArray = []
        for (const tlAgt of tlRmTypeInfo.netAgtRmTypeList) {
          let matchAgt = _.find(matchAdminRmTypeInfo.netAgtRmTypeList, {
            agentCode: tlAgt.agentCode,
            netAgtRmTypeCode: tlAgt.netAgtRmTypeCode
          })
          let matchAgtData = true
          if (!matchAgt) {
            matchAgt = tlAgt
            matchAgtData = false
          }
          agtArray.push({
            agentName: {
              value: _.some(commonAgtList, { commonCode: tlAgt.agentCode }) ? _.find(commonAgtList, { commonCode: tlAgt.agentCode }).commonCodeName : tlAgt.agentCode,
              state: !match || !matchAgtData ? 'insert' : matchAgt.agentCode !== tlAgt.agentCode ? 'update' : 'match'
            },
            agentCode: {
              value: tlAgt.agentCode,
              state: !match || !matchAgtData ? 'insert' : matchAgt.agentCode !== tlAgt.agentCode ? 'update' : 'match'
            },
            netAgtRmTypeCode: {
              value: tlAgt.netAgtRmTypeCode,
              state: !match || !matchAgtData ? 'insert' : matchAgt.netAgtRmTypeCode !== tlAgt.netAgtRmTypeCode ? 'update' : 'match'
            },
            netAgtRmTypeName: {
              value: tlAgt.netAgtRmTypeName,
              state: !match || !matchAgtData ? 'insert' : matchAgt.netAgtRmTypeName !== tlAgt.netAgtRmTypeName ? 'update' : 'match'
            },
            tlRmTypeCode: {
              value: tlAgt.tlRmTypeCode,
              state: !match || !matchAgtData ? 'insert' : matchAgt.tlRmTypeCode !== tlAgt.tlRmTypeCode ? 'update' : 'match'
            },
            tlNetRmTypeGroupCode: {
              value: tlAgt.tlNetRmTypeGroupCode,
              state: !match || !matchAgtData ? 'insert' : matchAgt.tlNetRmTypeGroupCode !== tlAgt.tlNetRmTypeGroupCode ? 'update' : 'match'
            },
            isStockAdjustable: {
              value: tlAgt.isStockAdjustable,
              state: !match || !matchAgtData ? 'insert' : matchAgt.isStockAdjustable !== tlAgt.isStockAdjustable ? 'update' : 'match'
            },
            lincolnUseFlag: {
              value: tlAgt.lincolnUseFlag,
              state: !match || !matchAgtData ? 'insert' : matchAgt.lincolnUseFlag !== tlAgt.lincolnUseFlag ? 'update' : 'match'
            }
          })
        }
        // 삭제된 AGENT 리스트가 있다면 체크한다.
        if (match) {
          for (const adminAgt of matchAdminRmTypeInfo.netAgtRmTypeList) {
            const adminRemoveData = _.find(tlRmTypeInfo.netAgtRmTypeList, { agentCode: adminAgt.agentCode })
            // 매칭 정보가 없다면 삭제된 데이터이다.
            if (!adminRemoveData) {
              agtArray.push({
                agentCode: { value: adminAgt.agentCode, state: 'delete' },
                netAgtRmTypeCode: { value: adminAgt.netAgtRmTypeCode, state: 'delete' },
                netAgtRmTypeName: { value: adminAgt.netAgtRmTypeName, state: 'delete' },
                tlRmTypeCode: { value: adminAgt.tlRmTypeCode, state: 'delete' },
                tlNetRmTypeGroupCode: { value: adminAgt.tlNetRmTypeGroupCode, state: 'delete' },
                isStockAdjustable: { value: adminAgt.isStockAdjustable, state: 'delete' },
                lincolnUseFlag: { value: adminAgt.lincolnUseFlag, state: 'delete' }
              })
            }
          }
        }
        adminRmTypeInfo.netAgtRmTypeList = agtArray
        tlRmType.adminRmTypeInfo = adminRmTypeInfo

        // Plan Group 리스트 매핑
        const planList = []
        // TL 에 저장된 요금 Plan 리스트
        const planTlList = planMasterList.filter(data => {
          const agtList = data.netAgtRmTypeList || []
          return agtList.filter(netRow => agtArray.findIndex(agt => agt.netAgtRmTypeCode.value === netRow.netAgtRmTypeCode) > -1).length > 0
        })

        // Admin 에 저장된 요금 Plan 리스트
        const planAdminList = matchAdminRmTypeInfo.planList || []
        // 매칭
        for (const plan of planTlList) {
          const row = { planGroupCode: plan.planGroupCode, planGroupName: plan.planGroupName, state: '' }
          const adminMatch = planAdminList.find(data => data.planGroupCode === plan.planGroupCode)
          if (adminMatch) {
            if (plan.planGroupName === adminMatch.planGroupName) {
              row.state = 'match'
            } else {
              row.state = 'warning'
            }
          }
          planList.push(row)
        }
        // 삭제된 데이터 처리
        planAdminList.filter(data => planTlList.findIndex(row => row.planGroupCode === data.planGroupCode) === -1)
          .forEach(value => {
            planList.push({ planGroupCode: value.planGroupCode, planGroupName: value.planGroupName, state: 'danger' })
          })
        tlRmType.planList = planList
      }
      this.roomTypeSync = tlRmTypeList
      if (this.$refs.syncForm) {
        this.$refs.syncForm.resetValidation()
      }
    },
    selectHotel (tlRmType) {
      if (tlRmType.tlRmTypeInfo && tlRmType.tlRmTypeInfo.storeCode) {
        const hotelList = _.filter(this.pmsStoreRoomInfoList, { storeCode: tlRmType.tlRmTypeInfo.storeCode })
        if (hotelList && hotelList.length > 0) {
          tlRmType.rmTypeList = hotelList
        } else {
          tlRmType.rmTypeList = []
        }
      } else {
        tlRmType.rmTypeList = []
      }
    },
    changeRoomType (tlRmTypeInfo) {
      tlRmTypeInfo.minPersonCount = _.find(this.pmsStoreRoomInfoList, { roomTypeCode: tlRmTypeInfo.roomTypeCode }).standardPerson
      tlRmTypeInfo.maxPersonCount = _.find(this.pmsStoreRoomInfoList, { roomTypeCode: tlRmTypeInfo.roomTypeCode }).maxPerson
    },
    async submit () {
      try {
        await this.validForm(this.$refs.syncForm)
        // PMS 블럭코드 맵핑
        for (const room of this.roomTypeSync) {
          const info = room.tlRmTypeInfo
          if (!info.blockList || info.blockList.length === 0) {
            this.$dialog.alert(info.tlRmTypeName + '의 PMS 블럭을 입력해 주세요.')
            return
          } else if (!_.find(info.blockList, { masterYn: 'Y', useYn: 'Y' })) {
            this.$dialog.alert(info.tlRmTypeName + '의 PMS 마스터 블럭코드를 입력해 주세요.')
            return
          }
          if (info.minPersonCount >= info.maxPersonCount) {
            this.$dialog.alert('기준인원수보다 최대인원수를 크게 설정해 주세요.')
            return
          }
        }
        await this.$dialog.confirm(this.branchName + '사업장의 객실타입을<br/>동기화 하시겠습니까?')
        const insertArray = []
        let insertBrcNo = ''
        // 입력 데이터
        for (const room of this.roomTypeSync) {
          room.tlRmTypeInfo.packageYn = this.packageYn
          const addRow = _.cloneDeep(room.tlRmTypeInfo)
          insertBrcNo = addRow.branchNo
          if (addRow.netAgtRmTypeList) {
            for (const agt of addRow.netAgtRmTypeList) {
              agt.branchNo = addRow.branchNo
            }
          }
          addRow.planList = room.planList
          addRow.roomTypeName = _.find(this.pmsStoreRoomInfoList, { roomTypeCode: addRow.roomTypeCode }).roomTypeName
          addRow.storeName = _.find(this.pmsStoreRoomInfoList, { roomTypeCode: addRow.roomTypeCode }).storeName

          insertArray.push(addRow)
        }
        await roomTypeService.insertRoomTypeSync(insertBrcNo, this.packageYn, insertArray)
        this.$emit('sync')
        this.$dialog.alert('동기화에 성공하였습니다.')
        await this.sync()
      } catch (e) {
      }
    }
  }
}
</script>

<style scoped lang="scss">
td {
  &.insert {
    background-color: #B3E5FC;
  }

  &.update {
    background-color: #FFE082;
  }

  &.delete {
    background-color: #EF9A9A;
  }
}

div {
  &.insert div.v-list__tile__title {
    background-color: #B3E5FC;
  }

  &.update div.v-list__tile__title {
    background-color: #FFE082;
  }

  &.delete div.v-list__tile__title {
    background-color: #EF9A9A;
  }
}

table {
  width: 100% !important;

  td, th {
    font-size: 14px;
    background-color: white;
    padding: 6px;

    &.bottom-border {
      border-bottom: 4px #009688 solid;
    }

    &.bottom-border-dgns {
      border-bottom: 4px #795548 solid;
    }

    &.right-border {
      border-right: 4px #009688 solid;
    }

    &.right-border-dgns {
      border-right: 4px #795548 solid;
    }

    &.left-border {
      border-left: 4px #009688 solid;
    }

    &.top-border {
      border-top: 4px #795548 solid;
    }

    &.table-contents {
      background-color: #EEEEEE;
    }
  }

  thead {
    th {
      padding: 10px 6px 10px 6px;
    }

    &.head {
      tr {
        th {
          background-color: #009688;
          color: white !important;
          border-top: 1px #009688 solid;

          &:first-child {
            border-left: 4px #009688 solid;
            border-right: 4px white solid;
          }

          &:last-child {
            border-left: 4px white solid;
            border-right: 4px #009688 solid;
          }
        }
      }
    }
  }

  &.dense {
    thead {
      td, th {
        background-color: #9E9E9E;
        color: white !important;
      }
    }

    td, th {
      padding: 4px;
      text-align: center;
    }
  }
}

.font-small {
  font-size: 12px;
}
</style>
