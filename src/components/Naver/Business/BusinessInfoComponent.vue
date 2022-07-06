<template>
  <v-form ref="form" lazy-validation v-if="this.form">
    <!-- 소제목1-->
    <v-row class="pb-2">
      <v-col cols="9" class="mx-auto pa-5 border-bottom-1">
        <span class="float-left title font-weight-bold">서비스정보</span>
        <div class="float-right text-right mt-1">
          <v-icon color="green darken-2">check</v-icon>
          필수입력
        </div>
      </v-col>
    </v-row>
    <!-- 서비스명-->
    <v-row :class="form.isNotSameServiceName ? compareColor : ''">
      <v-col cols="3">
        <div class="text-right pt-5">
          <v-icon color="green darken-2">check</v-icon>
          서비스명
        </div>
      </v-col>
      <v-col cols="7">
        <v-text-field counter="30" placeholder="서비스명을 입력해주세요."
                      v-model.trim="form.serviceName" :rules="betweenLengthRules(1,30).concat(emptyRules)"
                      :readonly="readonly"></v-text-field>
      </v-col>
    </v-row>
    <!-- 홍보문구-->
    <v-row :class="form.isNotSamePromotionDesc ? compareColor : ''">
      <v-col cols="3">
        <div class="text-right pt-5">
          홍보문구
        </div>
      </v-col>
      <v-col cols="7" class="mt-5">
        <v-textarea outlined dense counter="50" v-model.trim="form.promotionDesc" :value="form.promotionDesc"
                    placeholder="홍보문구를 입력해주세요." :rules="betweenLengthRules(7,50)"
                    :readonly="readonly"></v-textarea>
      </v-col>
    </v-row>
    <!-- 서비스소개-->
    <v-row :class="form.isNotSameDesc ? compareColor : ''">
      <v-col cols="3">
        <div class="text-right pt-5">
          <v-icon color="green darken-2">check</v-icon>
          서비스소개
        </div>
      </v-col>
      <v-col cols="7" class="mt-5">
        <v-textarea outlined dense counter="2000" v-model.trim="form.desc" :value="form.desc"
                    placeholder="서비스소개를 입력해주세요." :rules="betweenLengthRules(20,2000).concat(emptyRules)"
                    :readonly="readonly"></v-textarea>
      </v-col>
    </v-row>
    <!-- 이미지-->
    <v-row :class="form.isNotSameServiceName ? compareColor : ''">
      <v-col cols="3">
        <div class="text-right pt-3">
          <v-icon color="green darken-2">check</v-icon>
          이미지
        </div>
      </v-col>
      <v-col cols="7" class="text-left">
        <v-alert dense outlined type="error" class="mt-2 font-sm">
          이미지는 [네이버 예약 파트너센터] 에서 추가 / 관리하시기 바랍니다.
        </v-alert>
      </v-col>
    </v-row>
    <!-- 배경색상-->
    <v-row>
      <v-col cols="3">
        <div class="text-right pt-5">
          <v-icon color="green darken-2">check</v-icon>
          배경 색상 선택
        </div>
      </v-col>
      <v-col cols="7" class="text-left">
        <v-alert dense outlined type="error" class="mt-2 font-sm">
          배경색상은 [네이버 예약 파트너센터] 에서 추가 / 관리하시기 바랍니다.
        </v-alert>
      </v-col>
    </v-row>
    <!-- 이벤트정보 추가-->
    <v-row :class="form.isNotSameEventDescJson ? compareColor : ''">
      <v-col cols="3">
        <div class="text-right pt-5">
          이벤트 정보
        </div>
      </v-col>
      <v-col cols="7" class="mt-2 pb-0">
        <v-row>
          <v-col cols="12" class="pb-0">
            <v-textarea outlined dense counter="100" v-model="form.eventDescJson[0].desc"
                        :value="form.eventDescJson[0].desc"
                        placeholder="이벤트 정보를 입력해주세요." :rules="maxLengthRules(100)"
                        :readonly="readonly"></v-textarea>
          </v-col>
          <v-col cols="12" class="pt-0 pb-0">
            <div class="text-left font-weight-bold">이벤트 진행기간</div>
            <v-radio-group v-model="form.eventDescJson[0].isEventPeriod" row :readonly="readonly">
              <v-radio class="pa-1" label="상시이벤트(이벤트 기간 미노출)" value="N"></v-radio>
              <v-radio class="pa-1" label="이벤트기간 설정" value="Y"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col lg="12" md="12" sm="12" v-if="form.eventDescJson[0].isEventPeriod === 'Y'">
            <vc-date-picker mode="range" v-model="eventDate"
                            :popover="{visibility: 'focus', positionFixed: true}" positionFixed>
              <v-text-field slot-scope="{ inputProps, inputEvents }" v-bind="inputProps"
                            v-on="inputEvents" append-icon="event_note"
                            :label="form.eventDescJson[0].eventStartDate ? form.eventDescJson[0].eventStartDate + ' ~ ' + form.eventDescJson[0].eventEndDate + '(최근설정)' : '이벤트 날짜 설정'"
                            readonly
                            :disabled="readonly"></v-text-field>
            </vc-date-picker>
          </v-col>
          <v-col cols="12" class="pb-0">
            <div class="text-left font-weight-bold">이벤트 노출기간</div>
            <v-radio-group v-model="form.eventDescJson[0].isImpPeriod" row :readonly="readonly">
              <v-radio class="pa-1" label="상시노출" value="N"></v-radio>
              <v-radio class="pa-1" label="노출기간 설정" value="Y"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col lg="12" md="12" sm="12" v-if="form.eventDescJson[0].isImpPeriod === 'Y'">
            <vc-date-picker mode="range" v-model="impDate"
                            :popover="{visibility: 'focus', positionFixed: true}" positionFixed>
              <v-text-field slot-scope="{ inputProps, inputEvents }" v-bind="inputProps"
                            v-on="inputEvents" append-icon="event_note"
                            :label="form.eventDescJson[0].impStartDate ? form.eventDescJson[0].impStartDate + ' ~ ' + form.eventDescJson[0].impEndDate + '(최근설정)' : '노출 날짜 설정'"
                            readonly
                            :disabled="readonly"></v-text-field>
            </vc-date-picker>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- divider-->
    <v-row>
      <v-col cols="9" class="mx-auto">
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <!-- 상품목록 탬플릿-->
    <v-row>
      <v-col cols="3" class="text-right mt-1">
        <div class="text-right pt-4">
          <v-icon color="green darken-2">check</v-icon>
          상품 목록 템플릿
        </div>
      </v-col>
      <v-col cols="7">
        <v-radio-group v-model="form.displaySettingJson.bizItemListingType" row>
          <v-radio label="이미지형" value="IMAGE"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <!-- divider-->
    <v-row>
      <v-col cols="9" class="mx-auto">
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <!-- 상세소개-->
    <v-row>
      <v-col cols="3">
        <div class="text-right pt-3">
          <v-icon color="green darken-2">check</v-icon>
          상세소개
        </div>
      </v-col>
      <v-col cols="7" class="text-left">
        <v-alert dense outlined type="error" class="mt-2 font-sm">
          상세소개는 [네이버 예약 파트너센터] 에서 추가 / 관리하시기 바랍니다.
        </v-alert>
      </v-col>
    </v-row>
    <!-- 소제목2-->
    <v-row class="pb-2">
      <v-col cols="9" class="mx-auto pa-5 border-bottom-1">
        <span class="float-left title font-weight-bold">업체정보</span>
        <div class="float-right text-right mt-1">
          <v-icon color="green darken-2">check</v-icon>
          필수입력
        </div>
      </v-col>
    </v-row>
    <!-- 업체명(사업장명)-->
    <v-row :class="form.isNotSameName ? compareColor : ''">
      <v-col cols="3">
        <div class="text-right pt-5">
          <v-icon color="green darken-2">check</v-icon>
          업체명
        </div>
      </v-col>
      <v-col cols="7">
        <v-text-field counter="30" placeholder="업체명을 입력해주세요."
                      v-model="form.name" :rules="betweenLengthRules(1,30)"
                      :readonly="readonly"></v-text-field>
      </v-col>
    </v-row>
    <!-- 대표자명-->
    <v-row :class="form.isNotSameReprOwnerName ? compareColor : ''">
      <v-col cols="3">
        <div class="text-right pt-5">
          <v-icon color="green darken-2">check</v-icon>
          대표자명
        </div>
      </v-col>
      <v-col cols="7">
        <v-text-field counter="25" placeholder="대표자명을 입력해주세요."
                      v-model="form.reprOwnerName" :rules="betweenLengthRules(1,25)"
                      :readonly="readonly"></v-text-field>
      </v-col>
    </v-row>
    <!-- 부가정보-->
    <v-row>
      <v-col cols="3">
        <div class="text-right pt-4">
          <v-icon color="green darken-2">check</v-icon>
          부가정보
          <div class="text--disabled">최소 1개 ~<br>최대 5개 선택</div>
        </div>
      </v-col>
      <v-col cols="7">
        <v-row class="pl-3 pr-3">
          <v-col cols="12" class="pb-0">
            <v-alert dense outlined type="error" class="font-sm" v-if="readonly && selected.length === 0">
              부가정보는 [네이버 예약 파트너센터]를 통해서만 <b>조회 및 제어</b>가 가능하니 연동에 참고 바랍니다.
            </v-alert>
            <div class="text-left font-weight-bold mt-1">시설정보 선택</div>
          </v-col>
          <v-col cols="6" class="pa-0 ma-0" v-show="item.amenityCategory === 'facility'"
                 v-for="item in amenityItems" :key="item.amenityCode">
            <v-checkbox :style="{'border':'1px solid #ddd'}" dense class="ma-1 pt-4 pl-2 pb-0" color="blue"
                        v-model="selected" :label="item.amenityValue" :value="item"
                        :readonly="readonly"></v-checkbox>
          </v-col>
        </v-row>
        <v-row class="pl-3 pr-3">
          <v-col cols="12" class="pb-0">
            <div class="text-left font-weight-bold mt-1">서비스정보 선택</div>
          </v-col>
          <v-col cols="6" class="pa-0 ma-0" v-show="item.amenityCategory === 'service'"
                 v-for="item in amenityItems" :key="item.amenityCode">
            <v-checkbox :style="{'border':'1px solid #ddd'}" dense class="ma-1 pt-4 pl-2 pb-0" color="blue"
                        v-model="selected" :label="item.amenityValue" :value="item"
                        :readonly="readonly"></v-checkbox>
          </v-col>
          <v-col cols="12">
            <v-row v-if="loading !== null">
              <v-col cols="12" class="text-left pl-3" v-if="selected.length < 1 || selected.length > 5">
                <v-input class="subtitle-1" :style="{color:'green'}" readonly :rules="emptyRules">최소 1개
                  이상 ~ 최대 5개 이하로 선택해 주세요.
                </v-input>
              </v-col>
              <v-col cols="12" class="text-left" v-else>
                <v-chip v-for="(selection, i) in selected" :key="selection.code" class="ma-1" label
                        :disabled="loading" close @click:close="selected.splice(i, 1)" color="blue"
                        text-color="white">
                  {{ selection.amenityValue }}
                </v-chip>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- 지번주소-->
    <v-row :class="form.isNotSameAddressJson ? compareColor : ''">
      <v-col cols="3">
        <div class="text-right pt-5">
          <v-icon color="green darken-2">check</v-icon>
          지번주소
          <common-tooltip :type="'info'" :position="'top'" :text="'(+) 표시를 눌러 주소를 선택해주세요.'"
                          v-if="addrFormOpen"/>
        </div>
      </v-col>
      <v-col cols="7" class="mt-3 pb-0 mb-0">
        <v-text-field placeholder="지번주소를 입력해주세요."
                      v-model.trim="form.addressJson.jibun" :rules="emptyRules"
                      readonly dense outlined>
          <v-icon slot="append" color="info" v-if="addrFormOpen" @click="addrFormOpen">add_circle_outline
          </v-icon>
        </v-text-field>
      </v-col>
    </v-row>
    <!-- 도로명주소-->
    <v-row :class="form.isNotSameAddressJson ? compareColor : ''">
      <v-col cols="3" class="text-right mt-0 pt-0">
        <div class="text-right pt-5">
          <v-icon color="green darken-2">check</v-icon>
          도로명주소
        </div>
      </v-col>
      <v-col cols="7" class="mt-0 pt-0 pb-0 mb-0">
        <v-text-field placeholder="도로명주소를 입력해주세요."
                      class="mt-3" readonly dense outlined background-color="grey lighten-3"
                      v-model.trim="form.addressJson.roadAddr" :rules="emptyRules"></v-text-field>
        <v-chip class="ml-1 mr-2 float-left" small>위도 : {{ form.addressJson.posLat }}</v-chip>
        <v-chip class="mr-2 float-left" small>경도 : {{ form.addressJson.posLong }}</v-chip>
        <v-chip class="mr-2 float-left" small>줌레벨 : {{ form.addressJson.zoomLevel }}</v-chip>
      </v-col>
    </v-row>
    <!-- 상세위치-->
    <v-row :class="form.isNotSameAddressJson ? compareColor : ''">
      <v-col cols="3">
        <div class="text-right mt-1">
          상세위치
        </div>
      </v-col>
      <v-col cols="7" class="pt-0 mt-3">
        <v-textarea readonly outlined dense background-color="grey lighten-3"
                    v-model="form.addressJson.detail" :value="form.addressJson.detail"
                    placeholder="방문객이 쉽게 찾도록 위치에 대한 상세한 설명 및 교통편을 입력해주세요."
                    counter="300" :rules="maxLengthRules(300)"></v-textarea>
      </v-col>
    </v-row>
    <!-- 주차정보-->
    <v-row :class="form.isNotSameBusinessParkingInfoList ? compareColor : ''">
      <v-col cols="3" class="text-right mt-1">
        <div class="text-right pt-4">
          <v-icon color="green darken-2">check</v-icon>
          주차정보 추가
        </div>
      </v-col>
      <v-col cols="7">
        <v-row>
          <v-col lg="5" md="12" sm="12" class="pt-0 pb-0">
            <v-switch
              true-value="Y"
              false-value="N"
              v-model="form.businessParkingInfoList[0].isParkingSupported"
              :label="isParkingSupported ? '주차가능' : '주차불가능'"
              :readonly="readonly"
            ></v-switch>
          </v-col>
          <v-col lg="7" md="12" sm="12" class="pt-0 pb-0"
                 v-if="form.businessParkingInfoList[0].isParkingSupported === 'Y'">
            <v-radio-group class="float-right" v-model="form.businessParkingInfoList[0].isFreeParking" row
                           :readonly="readonly">
              <v-radio label="주차유료" value="N"></v-radio>
              <v-radio label="무료" value="Y"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row
          v-if="form.businessParkingInfoList[0].isParkingSupported === 'Y' && form.businessParkingInfoList[0].isFreeParking === 'N'">
          <v-col cols="12" class="pt-0 pb-0">
            <v-radio-group class="pt-0 pb-0 mt-0 mb-0"
                           v-model="form.businessParkingInfoList[0].chargingTypeCode" row
                           :readonly="readonly">
              <v-radio label="시간당 과금" value="HOURS"></v-radio>
              <v-radio label="정액 과금" value="PRICE"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="12" class="pt-0 pb-0 mt-0 mb-0"
                 v-if="form.businessParkingInfoList[0].chargingTypeCode === 'HOURS'">
            <v-row>
              <v-col lg="6" md="6" sm="12" class="pb-0">
                <div class="text-left font-weight-bold">최초</div>
              </v-col>
              <v-col lg="6" md="6" sm="12" class="pt-0 pb-0">
                <v-checkbox label="최초무료" true-value="Y" false-value="N"
                            v-model="form.businessParkingInfoList[0].basicChargeIsFree"
                            :readonly="readonly"></v-checkbox>
              </v-col>
            </v-row>
            <v-row>
              <v-col lg="4" md="6" sm="6" class="pt-0 pb-0">
                <v-select v-model="parkingTime.basicHour" outlined dense
                          :items="selectCalculator('hour')" label="시간"
                          :readonly="readonly"
                ></v-select>
              </v-col>
              <v-col lg="4" md="6" sm="6" class="pt-0 pb-0">
                <v-select v-model="parkingTime.basicMin" outlined dense
                          :items="selectCalculator('min')" label="분"
                          :readonly="readonly"></v-select>
              </v-col>
              <v-col lg="4" md="6" sm="12" class="pt-0 pb-0">
                <v-currency-field label="요금" suffix="원" outlined dense
                                  v-model="form.businessParkingInfoList[0].basicChargePrice"
                                  v-if="!basicChargeIsFree"
                                  :rules="!basicChargeIsFree
                                    && form.businessParkingInfoList[0].chargingTypeCode === 'HOURS'
                                    && form.businessParkingInfoList[0].basicChargeIsFree=== 'N' ?
                                    oneOrMoreRegex.concat(emptyRules) : !emptyRules"
                                  v-mask="'########'" :readonly="readonly"></v-currency-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="pt-0">
                <div class="text-left font-weight-bold">추가요금</div>
              </v-col>
              <v-col lg="4" md="6" sm="6" class="pt-0 pb-0">
                <v-select v-model="parkingTime.extraHour" outlined dense
                          :items="selectCalculator('hour')" label="시간"
                          :readonly="readonly"></v-select>
              </v-col>
              <v-col lg="4" md="6" sm="6" class="pt-0 pb-0">
                <v-select v-model="parkingTime.extraMin" outlined dense
                          :items="selectCalculator('min')" label="분"
                          :readonly="readonly"></v-select>
              </v-col>
              <v-col lg="4" md="6" sm="12" class="pt-0 pb-0">
                <v-currency-field label="요금" suffix="원" outlined dense
                                  v-model="form.businessParkingInfoList[0].extraChargePrice"
                                  :rules="form.businessParkingInfoList[0].isFreeParking === 'N'
                  && form.businessParkingInfoList[0].chargingTypeCode === 'HOURS'
                  ? oneOrMoreRegex.concat(emptyRules) : !emptyRules"
                                  v-mask="'########'" :readonly="readonly"></v-currency-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="pt-0">
                <div class="text-left font-weight-bold">최대</div>
              </v-col>
              <v-col lg="4" md="6" sm="12" class="pt-0 pb-0">
                <v-currency-field
                  v-model="form.businessParkingInfoList[0].maxPrice" outlined dense
                  :rules="form.businessParkingInfoList[0].isFreeParking === 'N'
                  && form.businessParkingInfoList[0].chargingTypeCode === 'HOURS'
                  ? oneOrMoreRegex.concat(emptyRules) : !emptyRules" label="요금" suffix="원" v-mask="'########'"
                  :readonly="readonly"></v-currency-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="form.businessParkingInfoList[0].chargingTypeCode === 'PRICE'">
            <v-row>
              <v-col cols="12">
                <div class="text-left font-weight-bold">1회 주차시</div>
              </v-col>
              <v-col lg="6" md="6" sm="12">
                <v-currency-field
                  v-model="form.businessParkingInfoList[0].maxPrice" outlined dense
                  :rules="form.businessParkingInfoList[0].isFreeParking === 'N'
                  && form.businessParkingInfoList[0].chargingTypeCode === 'PRICE'
                  ? oneOrMoreRegex.concat(emptyRules) : !emptyRules" label="요금" suffix="원" v-mask="'########'"
                  :readonly="readonly"></v-currency-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="pt-0 pb-0">
            <div class="text-left font-weight-bold">발렛파킹</div>
          </v-col>
          <v-col cols="12" class="pt-0 pb-0">
            <v-radio-group v-model="form.businessParkingInfoList[0].valetParkingType" row
                           :readonly="readonly">
              <v-radio label="유료" value="CHARGED"></v-radio>
              <v-radio label="무료" value="FREE"></v-radio>
              <v-radio label="불가" value="NA"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col lg="4" md="6" sm="12" class="pt-0 pb-0">
            <v-currency-field v-model="form.businessParkingInfoList[0].valetParkingPrice" suffix="원"
                              outlined dense
                              label="요금"
                              v-if="form.businessParkingInfoList[0].valetParkingType === 'CHARGED'"
                              :rules="form.businessParkingInfoList[0].valetParkingType === 'CHARGED' ? oneOrMoreRegex.concat(emptyRules) : !emptyRules" v-mask="'########'"
                              :readonly="readonly"></v-currency-field>
          </v-col>
          <v-col cols="12" class="pt-0 pb-0">
            <div class="text-left font-weight-bold">상세안내</div>
          </v-col>
          <v-col lg="12" md="12" sm="12">
            <v-textarea outlined dense
                        placeholder="주차 관련 안내할 상세 내용이 있다면 입력해주세요." counter="400"
                        :rules="maxLengthRules(400)"
                        v-model="form.businessParkingInfoList[0].parkingInfoDetail"
                        :value="form.businessParkingInfoList[0].parkingInfoDetail"
                        :readonly="readonly"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- 유선전화-->
    <v-row :class="form.isNotSamePhoneInformationJson ? compareColor : ''">
      <v-col cols="3">
        <div class="text-right pt-5">
          <v-icon color="green darken-2">check</v-icon>
          유선전화
        </div>
      </v-col>
      <v-col cols="7">
        <v-text-field v-model="form.phoneInformationJson.reprPhone" :rules="emptyRules"
                      v-mask="['####-####', '####-####']" placeholder="XXXX-XXXX"
                      :readonly="readonly"
        ></v-text-field>
      </v-col>
    </v-row>
    <!-- 이메일-->
    <v-row :class="form.isNotSameEmail ? compareColor : ''">
      <v-col cols="3">
        <div class="text-right pt-5">
          <v-icon color="green darken-2">check</v-icon>
          이메일
        </div>
      </v-col>
      <v-col cols="7">
        <v-text-field placeholder="이메일을 입력해주세요."
                      v-model="form.email" :rules="emailRegex"
                      :readonly="readonly"></v-text-field>
      </v-col>
    </v-row>
    <!-- 관리자연락처-->
    <v-row :class="form.isNotSamePhoneInformationJson ? compareColor : ''">
      <v-col cols="3">
        <div class="text-right pt-5">
          <v-icon color="green darken-2">check</v-icon>
          관리자 연락처
        </div>
      </v-col>
      <v-col cols="7">
        <v-text-field v-model="form.phoneInformationJson.phoneListStr" :rules="emptyRules"
                      v-mask="['###-####-####', '###-###-####']" placeholder="XXX-XXXX-XXXX"
                      :readonly="readonly"
        ></v-text-field>
      </v-col>
    </v-row>
    <!-- 웹사이트-->
    <v-row :class="form.isNotSameWebsiteUrl ? compareColor : ''">
      <v-col cols="3">
        <div class="text-right pt-5">
          웹사이트
        </div>
      </v-col>
      <v-col cols="7">
        <v-text-field placeholder="웹사이트를 입력해주세요."
                      v-model="form.websiteUrl"
                      :readonly="readonly"></v-text-field>
      </v-col>
    </v-row>
    <!-- 소제목3-->
    <v-row class="pb-2">
      <v-col cols="9" class="mx-auto pa-5 border-bottom-1">
        <span class="float-left title font-weight-bold">업체서류</span>
      </v-col>
    </v-row>
    <!-- 업체서류-->
    <v-row>
      <v-col cols="3">
        <div class="text-right pt-3">
          <v-icon color="green darken-2">check</v-icon>
          사업자 등록번호
        </div>
      </v-col>
      <v-col cols="7" class="text-left">
        <v-alert dense outlined type="error" class="mt-2 font-sm">
          사업자 등록번호는 [네이버 예약 파트너센터] 에서 추가 / 관리하시기 바랍니다.
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
        <div class="text-right pt-3">
          <v-icon color="green darken-2">check</v-icon>
          통신판매업 신고번호
        </div>
      </v-col>
      <v-col cols="7" class="text-left">
        <v-alert dense outlined type="error" class="mt-2 font-sm">
          통신판매업 신고번호는 [네이버 예약 파트너센터] 에서 추가 / 관리하시기 바랍니다.
        </v-alert>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import CommonTooltip from '@/components/Common/CommonTooltip.vue'

export default {
  name: 'BusinessInfoComponent',
  components: {
    CommonTooltip
  },
  props: {
    originBusinessInfo: Object,
    amenityItems: Array,
    /**
     * loading: 영업장 상세정보 부가정보 보여주기 여부
     * - false: default
     * - true: readonly
     * - null: hidden(notice)
     */
    loading: {
      type: Boolean,
      default: false
    },
    addrFormOpen: Function,
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    compareColor: 'grey lighten-3',
    /**
     * 영업장 정보
     */
    form: null,
    /**
     * 이벤트 날짜 설정
     */
    eventDate: {},
    impDate: {},
    /**
     * 주차 시간 설정
     */
    parkingTime: {
      basicHour: 0,
      basicMin: 0,
      extraHour: 0,
      extraMin: 0
    },
    /**
     * 부가 정보
     */
    selected: []
  }),
  computed: {
    /**
     * 주차지원여부
     */
    isParkingSupported() {
      return this.form.businessParkingInfoList[0].isParkingSupported === 'Y'
    },
    /**
     * 기본요금무료여부
     */
    basicChargeIsFree() {
      return this.form.businessParkingInfoList[0].basicChargeIsFree === 'Y'
    }
  },
  methods: {
    /**
     * validation
     */
    setValidate() {
      return this.validForm(this.$refs.form).then(() => {
        return Promise.resolve(this.form)
      }).catch(() => {
        return Promise.reject(new Error('에러'))
      })
    },
    setParsingBusiness() {
      /**
       * 관리자 번호 리스트 추가
       */
      this.form.phoneInformationJson.phoneList[0] = this.form.phoneInformationJson.phoneListStr
      /**
       * 주차 시간 추가
       */
      this.form.businessParkingInfoList[0].basicChargeTime = this.parkingTime.basicHour * 60 + this.parkingTime.basicMin
      this.form.businessParkingInfoList[0].extraChargeTime = this.parkingTime.extraHour * 60 + this.parkingTime.extraMin
      /**
       * 주차 상태 변경시 금액도 변경
       */
      if (this.form.businessParkingInfoList[0].isFreeParking === 'Y' ||
        this.form.businessParkingInfoList[0].basicChargeIsFree === 'Y') { // 주차무료거나 최초무료일 때
        this.form.businessParkingInfoList[0].basicChargePrice = ''
      }
      if (this.form.businessParkingInfoList[0].isFreeParking === 'Y' ||
        this.form.businessParkingInfoList[0].chargingTypeCode === 'PRICE') { // 주차무료거나 정액과금일 때
        this.form.businessParkingInfoList[0].extraChargePrice = ''
      }
      if (this.form.businessParkingInfoList[0].isFreeParking === 'Y') { // 주차 무료일 때
        this.form.businessParkingInfoList[0].maxPrice = ''
      }
      if (this.form.businessParkingInfoList[0].valetParkingType !== 'CHARGED') { // 발렛파킹 무료일 때
        this.form.businessParkingInfoList[0].valetParkingPrice = ''
      }
      /**
       * 이벤트 날짜 추가
       */
      if (this.form.eventDescJson[0].isEventPeriod === 'Y') {
        this.form.eventDescJson[0].eventStartDate = moment(this.eventDate.start).format('YYYY-MM-DD')
        this.form.eventDescJson[0].eventEndDate = moment(this.eventDate.end).format('YYYY-MM-DD')
      }
      if (this.form.eventDescJson[0].isImpPeriod === 'Y') {
        this.form.eventDescJson[0].impStartDate = moment(this.impDate.start).format('YYYY-MM-DD')
        this.form.eventDescJson[0].impEndDate = moment(this.impDate.end).format('YYYY-MM-DD')
      }
      /**
       * 부가정보 추가
       */
      this.form.businessAmenityJson = this.selected
    },
    /**
     * 주차시간, 분 계산
     */
    selectCalculator(n) {
      const item = []
      if (n === 'hour') {
        for (let i = 0; i < 24; i++) {
          item.push(i)
        }
      } else if (n === 'min') {
        for (let i = 0; i < 12; i++) {
          item.push(i * 5)
        }
      }
      return item
    }
  },
  mounted() {
    /**
     * 선택된 영업장 보기
     */
    this.form = this.originBusinessInfo
    /**
     * 이벤트 시간 불러오기
     */
    this.eventDate.start = this.form.eventDescJson[0].eventStartDate
    this.eventDate.end = this.form.eventDescJson[0].eventEndDate
    this.impDate.start = this.form.eventDescJson[0].impStartDate
    this.impDate.end = this.form.eventDescJson[0].impEndDate
    /**
     * 주차시간 불러오기
     */
    this.parkingTime.basicHour = Math.floor(this.form.businessParkingInfoList[0].basicChargeTime / 60)
    this.parkingTime.basicMin = this.form.businessParkingInfoList[0].basicChargeTime % 60
    this.parkingTime.extraHour = Math.floor(this.form.businessParkingInfoList[0].extraChargeTime / 60)
    this.parkingTime.extraMin = this.form.businessParkingInfoList[0].extraChargeTime % 60
    /**
     * 부가정보 불러오기
     */
    if (this.loading !== null) {
      this.form.businessAmenityJson.forEach(item => {
        this.amenityItems.forEach(val => {
          if (item.amenityCode === val.amenityCode) {
            this.selected.push({
              amenityCategory: val.amenityCategory,
              amenityCode: val.amenityCode,
              amenityValue: val.amenityValue
            })
          }
        })
      })
    }
  }
}
</script>

<style scoped>
/*div{border:1px solid #000;}*/
</style>
