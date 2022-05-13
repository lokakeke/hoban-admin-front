<template>
  <div>
    <v-container fluid grid-list-md pt-0>
      <app-card colClasses="xl12 lg12 md12 sm12 xs12">
        <v-layout row wrap>
          <v-flex xs5 md5 lg5 border-right>
            <v-card flat>
              <v-card-title class="headline font-weight-bold justify-center border-bottom pt-0">사업장 선택</v-card-title>
              <v-card-text class="pt-4">
                <branch-list :brcNo.sync="param.brcNo" :hotelCode.sync="param.hotelCode" :branchList.sync="branchList" :use-yn="''" @change="branchChange(false)" block></branch-list>
              </v-card-text>
              <v-card-title class="headline font-weight-bold justify-center border-bottom pt-0">TL-LINCOLN 객실 타입</v-card-title>
              <v-card-text class="pl-4 pr-4">
                <transition name="slide-fade" mode="out-in">
                  <v-list dense v-if="param.brcNo" :key="param.brcNo">
                    <template v-if="filterRoomTypeList && filterRoomTypeList.length > 0">
                      <div class="font-weight-bold subtitle-1 pa-1">객실 타입 선택<span class="font-sm font-weight-light"> (객실명으로 검색 가능합니다.)</span>
                      </div>
                      <v-autocomplete
                        v-model="selectedRoomTypeList"
                        :items="roomTypeList"
                        item-value="tlRmTypeCode"
                        :item-text="setRoomTypeText"
                        autocomplete="off"
                        placeholder="객실을 선택해 주세요."
                        clearable multiple chips dense deletable-chips small-chips return-object hide-details
                        class="mt-0 pt-0 mb-3"
                        no-data-text="데이터가 없습니다"
                      ></v-autocomplete>
                      <v-list-item v-for="room of filterRoomTypeList" :key="room.tlRmTypeCode" class="menu-list" :class="room.active? 'active' : ''" @click="viewChildren(room)">
                        <v-list-item-action>
                          <v-icon>edit</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ room.tlRmTypeName }} ({{ room.tlNetRmTypeGroupName }})
                          </v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-icon>keyboard_arrow_right</v-icon>
                        </v-list-item-action>
                      </v-list-item>
                    </template>
                    <v-layout v-else align-center justify-center fill-height>
                      객실타입이 존재하지 않습니다.
                    </v-layout>
                  </v-list>
                  <v-layout v-else-if="!param.brcNo" align-center justify-center fill-height>
                    사업장 을 선택해 주세요.
                  </v-layout>
                </transition>
                <v-layout justify-center>
                  <div v-if="param.brcNo">
                    <v-divider></v-divider>
                    <v-btn outlined rounded small @click="dialog = true" color="orange">
                      <v-icon small class="mr-1">refresh</v-icon>
                      TL-Lincoln 객실타입 동기화 조회
                    </v-btn>
                  </div>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs7 md7 lg7>
            <v-card flat>
              <v-card-title class="headline font-weight-bold justify-center pt-0">객실 타입 상세</v-card-title>
              <v-layout justify-center class="border-bottom">
                <div v-if="param.roomType && form.rmTypeCd" class="pb-1">
                  <v-btn outlined rounded small @click="resetForm()" color="orange">
                    <v-icon small class="mr-1">refresh</v-icon>
                    원래대로
                  </v-btn>
                  <v-btn outlined rounded small color="blue" @click="save()">
                    <v-icon small class="mr-1">check</v-icon>
                    저장
                  </v-btn>
                </div>
              </v-layout>
              <v-card-text>
                <transition name="slide-fade" mode="out-in">
                  <v-form v-if="param.roomType && form.rmTypeCd" ref="form" lazy-validation :key="param.roomType">
                    <div class="subheading green--text">PMS 룸타입</div>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <v-autocomplete v-model="form.rmTypeCd"
                                        :items="pmsHotelRoomInfoList"
                                        :item-value="'roomType'"
                                        :item-text="'roomTypeName'"
                                        :rules="[v => !!v || '룸타입은 필수입력 사항입니다.']" class="pt-0" label="" required></v-autocomplete>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="6">
                        <div class="pl-1 pb-1 subheading green--text">기준인원수</div>
                        <v-text-field type="number" v-model="form.stndPersonCnt" :rules="numberRules" class="pt-0 mt-0" disabled></v-text-field>
                      </el-col>
                      <el-col :span="6">
                        <div class="pl-1 pb-1 subheading green--text">최대인원수</div>
                        <v-text-field type="number" v-model="form.maxPersonCnt" :rules="numberRules" class="pt-0 mt-0" disabled></v-text-field>
                      </el-col>
                    </el-row>
                    <v-divider></v-divider>

                    <v-layout v-show="false" align-center justify-space-between>
                      <div class="pl-1 subheading green--text">PMS 블럭 맵핑<span class="body-2 brown--text"> ( * 마스터 블럭을 필수로 지정해 주세요.)</span>
                      </div>
                      <v-btn small round outline color="blue" @click="add()">
                        <v-icon small>add</v-icon>
                        추가
                      </v-btn>
                    </v-layout>
                    <v-data-table v-show="false" :no-data-text="'데이터가 없습니다.'" :headers="headers" :items="form.blockList" class="condensed" hide-actions>
                      <template v-slot:headers="props">
                        <tr>
                          <th v-for="header in props.headers" :key="header.value">
                            <span v-html="header.text"></span>
                          </th>
                        </tr>
                      </template>
                      <template v-slot:items="props">
                        <td>
                          <v-checkbox v-model="props.item.masterYn" class="justify-center" label="" true-value="Y" false-value="N" hide-details @change="changeMaster(props.index)"/>
                        </td>
                        <td>
                          <v-text-field type="text" v-model="props.item.blockCode" label="" :rules="emptyRules" hide-details></v-text-field>
                        </td>
                        <td>
                          <v-switch v-model="props.item.useYn" true-value="Y" false-value="N" class="justify-center" :label="props.item.useYn === 'Y'? '사용': '중지'"
                                    color="blue" hide-details :readonly="props.item.masterYn === 'Y'"></v-switch>
                        </td>
                        <td>
                          <v-text-field type="number" v-model="props.item.rsvOrder" label="" :rules="orderRules" hide-details></v-text-field>
                        </td>
                        <td>
                          <v-btn small block flat color="amber darken-4" @click="remove(props.index)">
                            <v-icon small>delete</v-icon>
                            삭제
                          </v-btn>
                        </td>
                      </template>
                    </v-data-table>

                    <v-divider v-show="false"></v-divider>

                    <div class="pl-1 subheading green--text">연결된 판매처 리스트</div>
                    <v-list dense>
                      <v-list-item v-for="agt of form.netAgtRmTypeList" :key="agt.netAgtRmTypeCode">
                        <v-list-item-action>
                          <v-icon>business</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title v-if="agt.agtName">{{ agt.agtName + '(' + agt.agtCode + ')' + ' - ' + agt.netAgtRmTypeName }}</v-list-item-title>
                          <v-list-item-title v-else>{{ agt.agtCode + ' - ' + agt.netAgtRmTypeName }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>

                    <v-divider></v-divider>

                    <div class="pl-1 pb-1 subheading green--text">Plan Group 정보</div>
                    <template v-if="form.planList && form.planList.length > 0">
                      <template v-for="(plan, index) of form.planList">
                        <el-tag class="mt-1 mb-1 mr-2" style="background: #fff;color: #606266;border-color: #dcdfe6;">{{ plan.planGroupName + ' - (' + plan.planGroupCode + ')' }}</el-tag>
                        <br v-if="index > 0 && index % 3 === 0"/>
                      </template>
                    </template>
                    <div class="subheading deep-orange--text" v-else>
                      <p class="mb-2 mt-2">* 객실에 포함된 요금 PLAN 정보가 없습니다.</p>
                      <p class="mb-0" v-if="param.pkgYn === 'N'">* TL-Lincoln 관리자 사이트에서 요금 PLAN GROUP NAME 이</p>
                      <p class="mb-1 ml-2" v-if="param.pkgYn === 'N'"> roomonly 또는 breakfast 로 생성되어야 합니다.</p>
                    </div>

                    <v-layout justify-center>
                      <div class="pa-2">
                        <v-btn outlined rounded small @click="resetForm()" color="orange">
                          <v-icon small class="mr-1">refresh</v-icon>
                          원래대로
                        </v-btn>
                        <v-btn outlined rounded small color="blue" @click="save()">
                          <v-icon small class="mr-1">check</v-icon>
                          저장
                        </v-btn>
                      </div>
                    </v-layout>
                  </v-form>
                  <v-layout v-else align-center justify-center fill-height>
                    TL-LINCOLN 객실타입을 선택해 주세요.
                  </v-layout>
                </transition>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </app-card>
    </v-container>
    <room-type-sync :dialog.sync="dialog" :branchList="branchList" :selectBrcNo="param.brcNo" :pmsHotelRoomInfoList="pmsHotelRoomInfoList" :pkgYn="param.pkgYn" @sync="branchChange(true)"></room-type-sync>
  </div>
</template>

<script>
import branchList from '@/components/Branch/BranchList.vue'
import selectList from '@/components/SelectAll/SelectList.vue'
import roomTypeSync from './RoomTypeSync'
import branchService from '@/api/modules/tl/branch.service'
import roomTypeService from '@/api/modules/tl/roomType.service'
import moment from 'moment'

export default {
  components: { selectList, roomTypeSync, branchList },
  name: 'roomType',
  data() {
    return {
      dialog: false,
      // 객실 타입 상세
      form: {},
      formClone: {},
      nameRules: [
        v => !!v || '이름은 필수 입력값 입니다.',
        v => (v && v.length <= 10) || '이름은 10글자 미만이어야 합니다.'
      ],
      orderRules: [
        v => !!v || '필수 입력항목입니다.',
        v => !(v < 1) || '0 이상의 값을 입력해 주세요.'
      ],
      numberRules: [
        v => !!v || '필수 입력항목입니다.',
        v => (!v || /^[0-9\\,]+$/.test(v)) || '숫자만 입력 가능합니다.'
      ],
      param: {
        brcNo: '',
        hotelCode: '',
        roomType: '',
        pkgYn: 'N'
      },
      headers: [
        { text: '마스터<br/>블럭', value: 'masterYn', align: 'center', sortable: false },
        { text: 'PMS<br/>블럭코드', value: 'blockCode', align: 'center', sortable: false },
        { text: '사용여부', value: 'useYn', align: 'center', sortable: false },
        { text: '예약<br/>우선순위', value: 'rsvOrder', align: 'center', sortable: false },
        { text: '삭제', value: 'delete', align: 'center', sortable: false }
      ],
      // TL 사업장
      branchList: [],
      // PMS 객실 타입 리스트
      pmsHotelRoomInfoList: [],
      // TL 객실 타입 리스트
      roomTypeList: [],
      selectedRoomTypeList: [],
      filterRoomTypeList: []
    }
  },
  watch: {
    selectedRoomTypeList(newVal) {
      if (newVal && newVal.length > 0) {
        this.filterRoomTypeList = newVal
      } else {
        this.filterRoomTypeList = this.roomTypeList
      }
    },
    'form.rmTypeCd'(newVal) {
      if (newVal) {
        this.form.stndPersonCnt = _.find(this.pmsHotelRoomInfoList, { roomType: newVal }).standardPsn
        this.form.maxPersonCnt = _.find(this.pmsHotelRoomInfoList, { roomType: newVal }).maximumPsn
      }
    }
  },
  methods: {
    moment(date) {
      return moment(date).format('YYYY.MM.DD')
    },
    add() {
      this.form.blockList.push({ masterYn: 'N', useYn: 'Y' })
    },
    remove(index) {
      this.$dialog.confirm('선택한 블럭을 삭제하시겠습니까?').then(() => {
        this.form.blockList.splice(index, 1)
      }, () => {
      })
    },
    changeMaster(index) {
      // 해당 로우를 제외하고는 master 를 해제한다.
      for (let idx = 0; idx < this.form.blockList.length; idx++) {
        if (idx !== index) {
          this.form.blockList[idx].masterYn = 'N'
        } else {
          // 마스터 블럭일 경우 사용여부 는 무조건 Y
          this.form.blockList[idx].useYn = 'Y'
        }
      }
    },
    reset() {
      for (let room of this.roomTypeList) {
        room.active = false
      }
      this.param.roomType = ''
    },
    branchChange(reload) {
      this.form = {}
      this.formClone = {}

      this.roomTypeList = []
      this.selectedRoomTypeList = []
      this.filterRoomTypeList = []

      // 영업장 셋팅 - plan list 같이 검색
      roomTypeService.selectRoomTypeList({
        brcNo: this.param.brcNo,
        searchPlanYn: 'Y',
        pkgYn: this.param.pkgYn
      }).then(res => {
        this.roomTypeList = res.data

        if (this.param.hotelCode) {
          branchService.selectPmsHotelRoomInfoList(this.param.hotelCode).then(res => {
            this.pmsHotelRoomInfoList = res.data
            this.filterRoomTypeList = this.roomTypeList
          })
        }
        if (this.roomTypeList && this.roomTypeList.length > 0) {
          if (reload) {
            for (const room of this.roomTypeList) {
              if (room.tlRmTypeCode === this.param.roomType) {
                this.viewChildren(room)
              }
            }
          } else {
            this.reset()
          }
        } else {
          this.reset()
        }
      })
    },
    viewChildren(select) {
      if (select.active) {
        return
      }
      this.blockList = []
      if (select.blockList && select.blockList.length > 0) {
        this.blockList = select.blockList
      }
      this.param.roomType = ''
      for (const room of this.roomTypeList) {
        room.active = room.tlRmTypeCode === select.tlRmTypeCode
      }
      this.param.roomType = select.tlRmTypeCode

      this.form = _.cloneDeep(select)
      this.formClone = _.cloneDeep(select)
    },
    resetForm() {
      this.form = _.cloneDeep(this.formClone)
    },
    async save() {
      try {
        // validation 체크
        await this.validForm(this.$refs.form)
        // 블럭 체크
        const blockList = this.form.blockList
        if (!blockList || blockList.length === 0) {
          this.$dialog.alert('PMS 블럭코드를 입력해 주세요.')
          return
        } else if (!_.find(blockList, { masterYn: 'Y', useYn: 'Y' })) {
          this.$dialog.alert('PMS 마스터 블럭코드를 입력해 주세요.')
          return
        }
        if (this.form.stndPersonCnt >= this.form.maxPersonCnt) {
          this.$dialog.alert('기준인원수보다 최대인원수를 크게 설정해 주세요.')
          return
        }
        this.form.rmTypeName = _.find(this.pmsHotelRoomInfoList, { roomType: this.form.rmTypeCd }).roomTypeName
        this.form.hotelName = _.find(this.pmsHotelRoomInfoList, { roomType: this.form.rmTypeCd }).hotelName

        await this.$dialog.confirm('상세내용을 저장 하시겠습니까?')

        await roomTypeService.updateRoomType(this.form)

        // 정보 재조회
        this.branchChange(true)
        this.$dialog.alert('데이터 수정에 성공하였습니다.')
      } catch (e) {
      }
    },
    setRoomTypeText(room) {
      return `${room.tlRmTypeName} (${room.tlNetRmTypeGroupName})`
    }
  }
}
</script>
