<template>
  <dialog-base :title="`${commissionTypeText} 수수료 ${functionText}`" :instance="instance">
    <template v-if="commissionMap">
      <!-- 수수료 마스터 관련 정보 -->
      <v-row class="mt-5">
        <template v-if="commissionType === 'MemberInd'">
          <!-- 회원구분 수수료는 회원구분을 노출 -->
          <v-col md="3" sm="6" cols="12">
            <v-label>회원구분명</v-label>
            <v-text-field :value="commissionMap.memIndNm" disabled readonly></v-text-field>
          </v-col>
          <v-col md="3" sm="6" cols="12">
            <v-label>회원구분</v-label>
            <v-text-field :value="commissionMap.memInd" disabled readonly></v-text-field>
          </v-col>
        </template>
        <template v-else>
          <!-- 기본 / 프로모션 수수료는 회원번호를 노출 -->
          <v-col md="3" sm="6" cols="12">
            <v-label>회원명</v-label>
            <v-text-field :value="commissionMap.memNm" disabled readonly></v-text-field>
          </v-col>
          <v-col md="3" sm="6" cols="12">
            <v-label>회원번호</v-label>
            <v-text-field :value="commissionMap.memNo" disabled readonly></v-text-field>
          </v-col>
        </template>
        <v-col md="3" sm="6" cols="12" v-if="commissionType !== 'MemberInd'">
          <!-- 정산유형은 회원구분에서 노출하지 않음 -->
          <v-label>
            정산유형
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
              </template>
              <div>정산유형은 수수료가 정산되는 시점입니다.</div>
            </v-tooltip>
          </v-label>
          <v-text-field :value="commissionMap.calcTypeNm" disabled readonly></v-text-field>
        </v-col>
        <template v-if="commissionType === 'Promotion'">
          <!-- 프로모션 수수료는 적용기간을 노출 -->
          <v-col md="3" sm="6" cols="12">
            <v-label>
              적용기간
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
                </template>
                <span>적용기간은 이 프로모션 수수료 설정이 적용되는 시작 ~ 종료일입니다.</span>
              </v-tooltip>
            </v-label>
            <date-range-picker
              v-model="applyRangeYmd"
              :min="currentDate"
              :allowed-dates="getAllowedDates"
              :readonly="!writeAuth"
              :disabled="isUpdate === true"
              required
            ></date-range-picker>
          </v-col>
        </template>
        <template v-else>
          <!-- 기본 / 회원구분 수수료는 적용기간을 노출 -->
          <v-col md="3" sm="6" cols="12">
            <v-label>
              적용일자
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
                </template>
                <span>
                  적용일자는 이 {{ commissionTypeText }} 수수료 설정이 적용되는 시작일입니다.
                  <br />
                  적용종료일은 설정할 수 없으며, 이 날짜 이후의 적용일자로 등록된 다른 {{ commissionTypeText }} 수수료 설정이 존재하지 않으면 계속 적용됩니다.
                </span>
              </v-tooltip>
            </v-label>
            <date-picker
              v-model="commissionMap.applyYmd"
              :min="currentDate"
              :allowed-dates="getAllowedDates"
              :readonly="!writeAuth"
              :disabled="isUpdate === true"
              required
            ></date-picker>
          </v-col>
        </template>
        <v-col md="3" sm="6" cols="12">
          <v-label>사용여부</v-label>
          <v-radio-group v-model="commissionMap.useYn" row :readonly="!writeAuth" required>
            <v-radio label="사용" value="Y"></v-radio>
            <v-radio label="미사용" value="N"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col md="6" :offset-md="commissionType === 'MemberInd' ? 6 : 3" cols="12">
          <v-currency-field
            v-model="tempPrice"
            persistent-hint
            outlined
            label="(설정 확인용) 가상 판매가격"
            prefix="￦"
            placeholder="조건을 확인할 판매가격을 입력하세요."
            :hint="tempPriceHint"
            maxlength="12"
          ></v-currency-field>
        </v-col>
      </v-row>
      <!-- 수수료 상세 관련 정보 -->
      <v-row>
        <v-col lg="4" cols="12">
          <v-card>
            <v-card-title>
              <span>전체 설정</span>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
                </template>
                <span>
                  전체 설정은 이 회원번호 전체에 적용되는 설정입니다.
                  <br />하나 이상의 조건값이 항상 사용되어야 합니다.
                </span>
              </v-tooltip>
              <v-spacer></v-spacer>
              <span class="body-2 primary--text">기본 사용</span>
            </v-card-title>
            <template>
              <v-divider></v-divider>
              <v-list v-if="commissionMap.wholeOptionList.length > 0">
                <draggable v-model="commissionMap.wholeOptionList" handle=".drag-handle">
                  <transition-group type="transition" name="flip-list">
                    <commission-option
                      v-for="(wholeOption, wholeOptionIndex) in commissionMap.wholeOptionList"
                      :key="wholeOption.index"
                      v-model="commissionMap.wholeOptionList[wholeOptionIndex]"
                      :highlight="isEnableOption(commissionMap.wholeOptionList, wholeOptionIndex)"
                      @delete="deleteCommissionWholeOption(wholeOptionIndex)"
                    ></commission-option>
                  </transition-group>
                </draggable>
              </v-list>
              <p class="grey--text text--lighten-1 text-center" v-else>(등록된 설정이 없습니다)</p>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn color="info" small block outlined @click="addWholeOption" v-if="writeAuth">
                  <v-icon>add</v-icon>새로운 수수료 설정 추가
                </v-btn>
              </v-card-actions>
            </template>
          </v-card>
        </v-col>
        <v-col lg="4" cols="12">
          <v-card>
            <v-card-title>
              <span
                :class="{ 'grey--text text--lighten-1': commissionMap.useStoreOption !== true }"
              >영업장별 설정</span>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
                </template>
                <span>
                  영업장별 설정은 이 회원번호의 특정 영업장에만 적용되는 설정입니다.
                  <br />선택적으로 사용하실 수 있으며
                  <strong>전체 설정보다 우선</strong>되어 적용됩니다.
                </span>
              </v-tooltip>
              <v-spacer></v-spacer>
              <v-switch v-model="commissionMap.useStoreOption" label="사용" :readonly="!writeAuth"></v-switch>
            </v-card-title>
            <template v-if="commissionMap.useStoreOption === true">
              <template v-if="commissionMap.storeOptionList.length > 0">
                <div
                  v-for="(store, storeIndex) in commissionMap.storeOptionList"
                  :key="store.storeCd"
                >
                  <v-divider></v-divider>
                  <v-list>
                    <v-list-group value="true" no-action>
                      <template v-slot:activator>
                        <v-list-item-title>
                          {{ store.storeNm }}
                          <v-btn
                            x-small
                            icon
                            color="info"
                            @click.stop.prevent="openCreateStoreOptionDialog(store.storeCd, store.storeNm)"
                            title="영업장에 새로운 설정 등록"
                            v-if="writeAuth"
                          >
                            <v-icon small>add</v-icon>
                          </v-btn>
                          <v-btn
                            x-small
                            icon
                            color="error"
                            @click.stop.prevent="deleteCommissionStoreOptionGroup(commissionMap.storeOptionList, storeIndex)"
                            title="영업장 삭제"
                            v-if="writeAuth"
                          >
                            <v-icon small>mdi-close</v-icon>
                          </v-btn>
                        </v-list-item-title>
                      </template>
                      <draggable
                        v-model="store.optionList"
                        handle=".drag-handle"
                        :group="{ name: 'store', pull: 'clone', put: true }"
                      >
                        <transition-group type="transition" name="flip-list">
                          <commission-option
                            v-for="(storeOption, storeOptionIndex) in store.optionList"
                            :key="`${storeOptionIndex}`"
                            v-model="store.optionList[storeOptionIndex]"
                            :highlight="isEnableOption(store.optionList, storeOptionIndex)"
                            @delete="deleteCommissionStoreOption(storeIndex, storeOptionIndex)"
                          ></commission-option>
                        </transition-group>
                      </draggable>
                    </v-list-group>
                  </v-list>
                </div>
              </template>
              <p class="grey--text text--lighten-1 text-center" v-else>
                <v-divider></v-divider>(등록된 설정이 없습니다)
              </p>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn
                  color="info"
                  small
                  block
                  outlined
                  @click="openCreateStoreOptionDialog"
                  v-if="writeAuth"
                >
                  <v-icon>add</v-icon>새로운 수수료 설정 추가
                </v-btn>
              </v-card-actions>
            </template>
          </v-card>
        </v-col>
        <v-col lg="4" cols="12">
          <v-card>
            <v-card-title>
              <span
                :class="{ 'grey--text text--lighten-1': commissionMap.useRoomTypeOption !== true }"
              >객실유형별 설정</span>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
                </template>
                <span>
                  객실유형별 설정은 이 회원번호 > 특정 영업장/객실유형에만 적용되는 설정입니다.
                  <br />선택적으로 사용하실 수 있으며
                  <strong>전체, 영업장별 설정보다 우선</strong>되어 적용됩니다.
                </span>
              </v-tooltip>
              <v-spacer></v-spacer>
              <v-switch v-model="commissionMap.useRoomTypeOption" label="사용" :readonly="!writeAuth"></v-switch>
            </v-card-title>
            <template v-if="commissionMap.useRoomTypeOption === true">
              <template v-if="commissionMap.roomTypeOptionList.length > 0">
                <div
                  v-for="(store, storeIndex) in commissionMap.roomTypeOptionList"
                  :key="store.storeCd"
                >
                  <v-divider></v-divider>
                  <v-list>
                    <v-list-group value="true" no-action>
                      <template v-slot:activator>
                        <v-list-item-title>
                          {{ store.storeNm }}
                          <v-btn
                            x-small
                            icon
                            color="error"
                            @click.stop.prevent="deleteCommissionStoreOptionGroup(commissionMap.roomTypeOptionList, storeIndex)"
                            title="영업장 삭제"
                            v-if="writeAuth"
                          >
                            <v-icon small>mdi-close</v-icon>
                          </v-btn>
                        </v-list-item-title>
                      </template>
                      <v-list-group
                        value="true"
                        sub-group
                        v-for="(roomType, roomTypeIndex) in store.roomTypeList"
                        :key="roomType.rmTypeCd"
                      >
                        <template v-slot:activator>
                          <v-list-item-title>
                            {{ roomType.rmTypeNm }}
                            <v-btn
                              x-small
                              icon
                              color="info"
                              @click.stop.prevent="openCreateRoomTypeOptionDialog(store.storeCd, store.storeNm, roomType.rmTypeCd, roomType.rmTypeNm)"
                              title="객실유형에 새로운 설정 등록"
                              v-if="writeAuth"
                            >
                              <v-icon small>add</v-icon>
                            </v-btn>
                            <v-btn
                              x-small
                              icon
                              color="error"
                              @click.stop.prevent="deleteCommissionRoomTypeOptionGroup(commissionMap.roomTypeOptionList, storeIndex, store.roomTypeList, roomTypeIndex)"
                              title="객실유형 삭제"
                              v-if="writeAuth"
                            >
                              <v-icon small>mdi-close</v-icon>
                            </v-btn>
                          </v-list-item-title>
                        </template>
                        <draggable
                          v-model="roomType.optionList"
                          handle=".drag-handle"
                          :group="{ name: 'roomType', pull: 'clone', put: true }"
                        >
                          <transition-group type="transition" name="flip-list">
                            <commission-option
                              v-for="(roomTypeOption, roomTypeOptionIndex) in roomType.optionList"
                              :key="`${roomTypeOptionIndex}`"
                              v-model="roomType.optionList[roomTypeOptionIndex]"
                              :highlight="isEnableOption(roomType.optionList, roomTypeOptionIndex)"
                              @delete="deleteCommissionRoomTypeOption(storeIndex, roomTypeIndex, roomTypeOptionIndex)"
                            ></commission-option>
                          </transition-group>
                        </draggable>
                      </v-list-group>
                    </v-list-group>
                  </v-list>
                </div>
              </template>
              <p class="grey--text text--lighten-1 text-center" v-else>
                <v-divider></v-divider>(등록된 설정이 없습니다)
              </p>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn
                  color="info"
                  small
                  block
                  outlined
                  @click="openCreateRoomTypeOptionDialog"
                  v-if="writeAuth"
                >
                  <v-icon>add</v-icon>새로운 수수료 설정 추가
                </v-btn>
              </v-card-actions>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <v-divider class="mt-6 mb-6"></v-divider>
    <v-row justify="end">
      <v-btn outlined rounded color="orange" @click="resetCommissionMapForm()" v-if="writeAuth">
        <v-icon>refresh</v-icon>원래대로
      </v-btn>
      <v-btn outlined rounded color="info" @click="setCommissionMap()" v-if="writeAuth">
        <v-icon>check</v-icon>저장
      </v-btn>
      <v-btn outlined rounded color="primary" @click="close()">
        <v-icon>close</v-icon>닫기
      </v-btn>
    </v-row>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase'
import NumberUtils from '@/utils/number.util'
import CommissionOption from 'Components/Ota/Commission/Option/CommissionOption.vue'
import commonCodeService from 'Api/modules/system/commonCode.service'

const EMPTY_OPTION_OBJECT = {
  amtCndTypeCd: 'AL',
  amtCndTypeNm: '항상',
  amtCndVal: null,
  cmsnTypeCd: 'W',
  cmsnTypeNm: '원',
  cmsnAmt: 0
}

export default {
  name: 'CommissionCommonDetailDialog',
  extends: DialogBase,
  components: {
    CommissionOption
  },
  data () {
    return {
      /**
       * 수수료 Map
       */
      commissionMap: null,
      /**
       * 원본(수정 전) 수수료 Map
       */
      orgCommissionMap: {
        memNo: this.instance.params.memNo,
        memInd: this.instance.params.memInd,
        applyYmd: null,
        applyBgnYmd: null,
        applyEndYmd: null,
        calcTypeCd: null,
        useYn: 'Y',
        wholeOptionList: [],
        useStoreOption: false,
        storeOptionList: [],
        useRoomTypeOption: false,
        roomTypeOptionList: []
      },
      /**
       * 조건유형 목록
       */
      amtCndTypeList: [],
      /**
       * 수수로 조건 계산용 가상 판매가
       */
      tempPrice: null
    }
  },
  computed: {
    /**
     * 수수료 유형
     */
    commissionType () {
      return this.instance.params.commissionType // Basic or Promotion or MemberInd
    },
    /**
     * 수수료 유형별 텍스트
     */
    commissionTypeText () {
      if (this.commissionType === 'Basic') {
        return '기본'
      } else if (this.commissionType === 'Promotion') {
        return '프로모션'
      } else if (this.commissionType === 'MemberInd') {
        return '회원구분'
      }
      return ''
    },
    /**
     * 수수료 서비스 객체
     */
    commissionService () {
      return require(`Api/modules/ota/commission${this.commissionType}.service`)
        .default
    },
    /**
     * 프로모션 수수료에서 사용하는 적용기간 배열
     */
    applyRangeYmd: {
      get () {
        return [this.commissionMap.applyBgnYmd, this.commissionMap.applyEndYmd]
      },
      set (applyRangeYmd) {
        this.commissionMap.applyBgnYmd = applyRangeYmd[0]
        this.commissionMap.applyEndYmd = applyRangeYmd[1]
      }
    },
    /**
     * 현재 날짜 문자열
     */
    currentDate () {
      return moment(new Date()).format('YYYY-MM-DD')
    },
    /**
     * 복사 대상(원본)이 존재하는지 여부
     */
    isCopy () {
      return Boolean(this.instance.params.copyTarget)
    },
    /**
     * 수정 기능인지 여부
     */
    isUpdate () {
      return Boolean(
        this.isCopy === false &&
          (this.instance.params.applyYmd || this.instance.params.applyBgnYmd)
      )
    },
    /**
     * 등록 or 수정 기능 여부에 따른 텍스트
     */
    functionText () {
      return this.isUpdate === true ? '수정' : '등록'
    },
    /**
     * 등록 or 수정 기능 여부에 따른 이름
     */
    functionName () {
      return this.isUpdate === true ? 'update' : 'insert'
    },
    /**
     * 가상 판매가격 설명
     */
    tempPriceHint () {
      return `${
        this.tempPrice
          ? '판매가격이 ' +
            NumberUtils.toKoreanNumber(this.tempPrice) +
            '원인 경우,'
          : '입력한 가상 판매가격에'
      } 해당하는 조건의 설정을 녹색으로 하이라이트합니다.`
    }
  },
  async created () {
    await this.getAmtCndTypeList() // 조건유형 목록 조회
    await this.getCommissionMap() // 수수료 Map 조회
    this.resetCommissionMap() // 수수료 Map 초기화
    if (this.isCopy === true) {
      this.$dialog.alert(
        `복사할 ${
          this.commissionTypeText
        } 수수료 정보를 등록 화면에 불러왔습니다. 적용${
          this.commissionType === 'Promotion' ? '기간' : '일자'
        }를 선택 후 저장하시면 복사가 완료됩니다.`
      )
    }
  },
  methods: {
    /**
     * 수수료 Map 가져오기
     */
    async getCommissionMap () {
      if (this.isCopy === true || this.isUpdate === true) {
        // 복사 혹은 수정
        const params = {
          memNo: this.instance.params.memNo,
          memInd: this.instance.params.memInd,
          applyYmd: this.instance.params.applyYmd,
          applyBgnYmd: this.instance.params.applyBgnYmd,
          applyEndYmd: this.instance.params.applyEndYmd
        }
        const selectFunction = this.commissionService[
          `selectCommission${this.commissionType}Map`
        ]
        let response = null
        if (this.commissionType === 'Basic') {
          // 기본
          response = await selectFunction(params.memNo, params.applyYmd)
        } else if (this.commissionType === 'Promotion') {
          // 프로모션
          response = await selectFunction(
            params.memNo,
            params.applyBgnYmd,
            params.applyEndYmd
          )
        } else if (this.commissionType === 'MemberInd') {
          // 회원구분
          response = await selectFunction(params.memInd, params.applyYmd)
        }
        const commissionMap = response.data
        if (this.isCopy === true) {
          // 복사의 경우 조회해온 수수료 Map의 회원번호, 회원명을 복사될 정보로 변경, 적용일자를 삭제
          commissionMap.memNo = this.instance.params.copyTarget.memNo
          commissionMap.memNm = this.instance.params.copyTarget.memNm
          commissionMap.memInd = this.instance.params.copyTarget.memInd
          commissionMap.memIndNm = this.instance.params.copyTarget.memIndNm
          commissionMap.applyYmd = null
          commissionMap.applyBgnYmd = null
          commissionMap.applyEndYmd = null
        }
        commissionMap.useStoreOption = commissionMap.storeOptionList.length > 0
        commissionMap.useRoomTypeOption =
          commissionMap.roomTypeOptionList.length > 0
        this.orgCommissionMap = commissionMap
      } else {
        // 등록
        this.orgCommissionMap.memNm = this.instance.params.memNm
        this.orgCommissionMap.memIndNm = this.instance.params.memIndNm
      }
    },
    /**
     * 제외할 적용일 가져오기
     */
    getAllowedDates (val) {
      // 이미 요금 등록된 적용일들(existApplyYmdList)을 제외시킨다.
      let isDisallowed = false
      const existApplyYmdList = this.instance.params.existApplyYmdList || []
      existApplyYmdList.some(item => {
        if (this.commissionType === 'Promotion') {
          // 프로모션은 item = 적용기간 객체
          const applyBgnDate = moment(item.applyBgnYmd)
          const applyEndDate = moment(item.applyEndYmd)
          isDisallowed =
            moment(val).isSameOrAfter(applyBgnDate) &&
            moment(val).isSameOrBefore(applyEndDate)
        } else {
          // 그 외는 item = 적용일자 문자열
          isDisallowed = val === moment(item).format('YYYY-MM-DD')
        }
        return isDisallowed
      })
      return isDisallowed === false
    },
    /**
     * 전체 설정 목록에 새로운 설정 추가
     */
    addWholeOption () {
      this.commissionMap.wholeOptionList.push({
        index: this.commissionMap.wholeOptionList.length + 1,
        ...EMPTY_OPTION_OBJECT
      })
    },
    /**
     * 영업장별 설정 목록에 새로운 설정 추가 Dialog 열기
     */
    openCreateStoreOptionDialog (storeCd, storeNm) {
      this.$store.dispatch('dialog/open', {
        componentPath:
          '/Ota/Commission/Option/CommissionOptionGroupCreateDialog',
        params: {
          useStore: true,
          storeCd,
          storeNm
        },
        options: {
          width: '500px',
          fullscreen: false,
          closeCallback: result => {
            if (result && result.store) {
              let targetStore = null
              this.commissionMap.storeOptionList.some((store, storeIndex) => {
                if (store.storeCd === result.store.storeCd) {
                  targetStore = store
                }
                return Boolean(targetStore)
              })
              if (targetStore === null) {
                this.commissionMap.storeOptionList.push({
                  index: this.commissionMap.storeOptionList.length + 1,
                  storeCd: result.store.storeCd,
                  storeNm: result.store.storeNm,
                  optionList: []
                })
                targetStore = this.commissionMap.storeOptionList[
                  this.commissionMap.storeOptionList.length - 1
                ]
              }
              targetStore.optionList.push({
                index: targetStore.optionList.length + 1,
                storeCd: result.store.storeCd,
                storeNm: result.store.storeNm,
                ...EMPTY_OPTION_OBJECT
              })
            }
          }
        }
      })
    },
    /**
     * 객실유형별 설정 목록에 새로운 설정 추가 Dialog 열기
     */
    openCreateRoomTypeOptionDialog (storeCd, storeNm, rmTypeCd, rmTypeNm) {
      this.$store.dispatch('dialog/open', {
        componentPath:
          '/Ota/Commission/Option/CommissionOptionGroupCreateDialog',
        params: {
          useStore: true,
          storeCd,
          storeNm,
          useRoomType: true,
          rmTypeCd,
          rmTypeNm
        },
        options: {
          width: '500px',
          fullscreen: false,
          closeCallback: result => {
            if (result && result.store && result.roomType) {
              let targetStore = null
              this.commissionMap.roomTypeOptionList.some(
                (store, storeIndex) => {
                  if (store.storeCd === result.store.storeCd) {
                    targetStore = store
                  }
                  return Boolean(targetStore)
                }
              )
              if (targetStore === null) {
                this.commissionMap.roomTypeOptionList.push({
                  index: this.commissionMap.storeOptionList.length + 1,
                  storeCd: result.store.storeCd,
                  storeNm: result.store.storeNm,
                  roomTypeList: []
                })
                targetStore = this.commissionMap.roomTypeOptionList[
                  this.commissionMap.roomTypeOptionList.length - 1
                ]
              }
              let targetRoomType = null
              targetStore.roomTypeList.some((roomType, roomTypeIndex) => {
                if (roomType.rmTypeCd === result.roomType.rmTypeCd) {
                  targetRoomType = roomType
                }
                return Boolean(targetRoomType)
              })
              if (targetRoomType === null) {
                targetStore.roomTypeList.push({
                  index: targetStore.roomTypeList.length + 1,
                  storeCd: result.store.storeCd,
                  storeNm: result.store.storeNm,
                  rmTypeCd: result.roomType.rmTypeCd,
                  rmTypeNm: result.roomType.rmTypeNm,
                  optionList: []
                })
                targetRoomType =
                  targetStore.roomTypeList[targetStore.roomTypeList.length - 1]
              }
              targetRoomType.optionList.push({
                index: targetRoomType.optionList.length + 1,
                storeCd: result.store.storeCd,
                storeNm: result.store.storeNm,
                rmTypeCd: result.roomType.rmTypeCd,
                rmTypeNm: result.roomType.rmTypeNm,
                ...EMPTY_OPTION_OBJECT
              })
            }
          }
        }
      })
    },
    /**
     * 수수료 전체 설정 삭제
     */
    deleteCommissionWholeOption (optionIndex) {
      this.commissionMap.wholeOptionList.splice(optionIndex, 1)
    },
    /**
     * 수수료 영업장별 설정 삭제
     */
    deleteCommissionStoreOption (storeIndex, optionIndex) {
      this.commissionMap.storeOptionList[storeIndex].optionList.splice(
        optionIndex,
        1
      )
      if (
        this.commissionMap.storeOptionList[storeIndex].optionList.length === 0
      ) {
        this.commissionMap.storeOptionList.splice(storeIndex, 1)
      }
    },
    /**
     * 수수료 객실유형별 설정 삭제
     */
    deleteCommissionRoomTypeOption (storeIndex, roomTypeIndex, optionIndex) {
      this.commissionMap.roomTypeOptionList[storeIndex].roomTypeList[
        roomTypeIndex
      ].optionList.splice(optionIndex, 1)
      if (
        this.commissionMap.roomTypeOptionList[storeIndex].roomTypeList[
          roomTypeIndex
        ].optionList.length === 0
      ) {
        this.commissionMap.roomTypeOptionList[storeIndex].roomTypeList.splice(
          roomTypeIndex,
          1
        )
        if (
          this.commissionMap.roomTypeOptionList[storeIndex].roomTypeList
            .length === 0
        ) {
          this.commissionMap.roomTypeOptionList.splice(storeIndex, 1)
        }
      }
    },
    /**
     * 수수료 영업장 설정 그룹 제거
     */
    deleteCommissionStoreOptionGroup (storeList, storeIndex) {
      this.$dialog
        .confirm('해당 영업장 설정을 삭제하시겠습니까?')
        .then(() => {
          storeList.splice(storeIndex, 1)
        })
        .catch(() => {})
    },
    /**
     * 수수료 객실유형 설정 그룹 제거
     */
    deleteCommissionRoomTypeOptionGroup (
      storeList,
      storeIndex,
      roomTypeList,
      roomTypeIndex
    ) {
      this.$dialog
        .confirm('해당 객실유형 설정을 삭제하시겠습니까?')
        .then(() => {
          roomTypeList.splice(roomTypeIndex, 1)
          if (roomTypeList.length === 0) {
            storeList.splice(storeIndex, 1)
          }
        })
        .catch(() => {})
    },
    /**
     * 수수료 Map 폼 초기화
     */
    resetCommissionMapForm () {
      this.$dialog
        .confirm(
          '처음 데이터로 되돌리시겠습니까? 수정하신 데이터가 초기화됩니다.'
        )
        .then(() => {
          this.resetCommissionMap()
        })
        .catch(() => {})
    },
    /**
     * 수수료 Map 초기화
     */
    resetCommissionMap () {
      this.commissionMap = _.cloneDeep(this.orgCommissionMap)
    },
    /**
     * 수수료유형 목록 가져오기
     */
    async getAmtCndTypeList () {
      const amtCndTypeList = []
      const response = await commonCodeService.selectCommonCode('CMSN0002')
      response.data.forEach(item => {
        const amtCndType = {
          text: item.commCdNm,
          value: item.commCd,
          desc: item.commCdDesc, // 설명
          sign: item.item01, // 기호
          order: item.item02 // 계산시 순번
        }
        amtCndTypeList.push(amtCndType)
      })
      this.amtCndTypeList = amtCndTypeList
    },
    /**
     * 조건을 만족하는 옵션인지 여부
     * @param {Array} optionList 설정 목록
     * @param {Number} optionIndex 해당 설정 인덱스
     */
    isEnableOption (optionList, optionIndex) {
      let isEnabledOption = false
      if (this.tempPrice !== null && this.tempPrice >= 0) {
        // 1. optionList 조건들 중 tempPrice와 일치하는 조건들을 찾아 enableOptionList에 적재
        const enableOptionList = []
        optionList.forEach((optionItem, optionItemIndex) => {
          const isGreater =
            optionItem.amtCndTypeCd === 'GT' &&
            optionItem.amtCndVal < this.tempPrice // 초과 조건
          const isGreaterEqual =
            optionItem.amtCndTypeCd === 'GE' &&
            optionItem.amtCndVal <= this.tempPrice // 이상 조건
          const isEqual =
            optionItem.amtCndTypeCd === 'EQ' &&
            Number(optionItem.amtCndVal) === Number(this.tempPrice) // 일치 조건
          const isLessEqual =
            optionItem.amtCndTypeCd === 'LE' &&
            optionItem.amtCndVal >= this.tempPrice // 이하 조건
          const isLess =
            optionItem.amtCndTypeCd === 'LT' &&
            optionItem.amtCndVal > this.tempPrice // 미만 조건
          const isAlways = optionItem.amtCndTypeCd === 'AL' // 항상 조건
          if (
            isGreater ||
            isGreaterEqual ||
            isEqual ||
            isLessEqual ||
            isLess ||
            isAlways
          ) {
            enableOptionList.push(Object.assign({
              enableIndex: optionItemIndex // 일치하는 조건의 기존 인덱스 번호
            }, optionItem))
          }
        })
        if (enableOptionList.length > 0) {
          // 2. enableOptionsList를 정렬
          const sortedEnableOptionList = _.orderBy(enableOptionList,
            [option => {
              let order = null
              this.amtCndTypeList.some(amtCntType => {
                if (amtCntType.value === option.amtCndTypeCd) {
                  order = Number(amtCntType.order)
                }
                return Boolean(order)
              })
              return order
            }, option => {
              if (['GT', 'GE'].indexOf(option.amtCndTypeCd) >= 0) {
                // 초과, 이상 조건은 조건값 내림차순
                return option.amtCndVal * -1
              } else {
                // 그 외 조건은 조건값 오름차순
                return option.amtCndVal
              }
            }],
            ['asc', 'asc'])
          // 3. 정렬된 값 중 첫번재 항목의 enableIndex값이 optionIndex와 일치하면 isEnabledOption = true
          if (sortedEnableOptionList[0].enableIndex === optionIndex) {
            isEnabledOption = true
          }
        }
      }
      return isEnabledOption
    },
    /**
     * 수수료 Map 저장 (등록 or 수정)
     */
    setCommissionMap () {
      if (this.commissionType === 'Promotion') {
        // 프로모션은 적용기간
        if (!this.commissionMap.applyBgnYmd) {
          this.$dialog.alert('적용시작일자를 선택해 주세요.')
          return false
        }
        if (!this.commissionMap.applyEndYmd) {
          this.$dialog.alert('적용종료일자를 선택해 주세요.')
          return false
        }
      } else {
        // 그 외에는 적용일자
        if (!this.commissionMap.applyYmd) {
          this.$dialog.alert('적용일자를 선택해 주세요.')
          return false
        }
      }
      if (!this.commissionMap.useYn) {
        this.$dialog.alert('사용여부를 선택해 주세요.')
        return false
      }
      if (this.commissionMap.wholeOptionList.length < 1) {
        this.$dialog.alert('전체 설정을 하나 이상 등록해 주세요.')
        return false
      }
      // 동일 설정 조건이 존재하는지 검사
      const wholeOptionListLength = this.commissionMap.wholeOptionList.length
      const wholeOptionUniqListLength = _.unionBy(
        this.commissionMap.wholeOptionList,
        wholeOption => {
          return wholeOption.amtCndTypeCd + Number(wholeOption.amtCndVal || 0)
        }
      ).length
      if (wholeOptionListLength !== wholeOptionUniqListLength) {
        this.$dialog.alert('전체 설정에서 중복된 조건이 있습니다.')
        return false
      }
      let isInvalidStoreOption = false
      this.commissionMap.storeOptionList.some(store => {
        const optionListLength = store.optionList.length
        const optionListUniqLength = _.unionBy(store.optionList, option => {
          return option.amtCndTypeCd + Number(option.amtCndVal || 0)
        }).length
        if (optionListLength !== optionListUniqLength) {
          isInvalidStoreOption = true
        }
        return isInvalidStoreOption
      })
      if (isInvalidStoreOption === true) {
        this.$dialog.alert('영업장별 설정에서 중복된 조건이 있습니다.')
        return false
      }
      let isInvalidRoomTypeOption = false
      this.commissionMap.roomTypeOptionList.some(store => {
        store.roomTypeList.some(roomType => {
          const optionListLength = roomType.optionList.length
          const optionListUniqLength = _.unionBy(
            roomType.optionList,
            option => {
              return option.amtCndTypeCd + Number(option.amtCndVal || 0)
            }
          ).length
          if (optionListLength !== optionListUniqLength) {
            isInvalidRoomTypeOption = true
          }
          return isInvalidRoomTypeOption
        })
        return isInvalidRoomTypeOption
      })
      if (isInvalidRoomTypeOption === true) {
        this.$dialog.alert('객실유형별 설정에서 중복된 조건이 있습니다.')
        return false
      }
      this.$dialog
        .confirm(`${this.functionText}하시겠습니까?`)
        .then(async () => {
          const saveFuntion = this.commissionService[
            `${this.functionName}Commission${this.commissionType}`
          ]
          if (this.commissionType === 'Basic') {
            // 기본
            await saveFuntion(
              this.commissionMap.memNo,
              this.commissionMap.applyYmd,
              this.commissionMap
            )
          } else if (this.commissionType === 'Promotion') {
            // 프로모션
            await saveFuntion(
              this.commissionMap.memNo,
              this.commissionMap.applyBgnYmd,
              this.commissionMap.applyEndYmd,
              this.commissionMap
            )
          } else if (this.commissionType === 'MemberInd') {
            // 회원구분
            await saveFuntion(
              this.commissionMap.memInd,
              this.commissionMap.applyYmd,
              this.commissionMap
            )
          }
          await this.$dialog.alert(`${this.functionText}이 완료되었습니다.`)
          this.close(true)
        })
        .catch(() => {})
    }
  }
}
</script>
