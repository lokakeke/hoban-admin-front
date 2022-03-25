<template>
  <div>
    <app-card>
      <v-row>
        <v-col>
          <h1 class="h3">{{ title }}</h1>
        </v-col>
        <v-col class="text-end">
          <v-menu
            ref="menu"
            v-model="isCalendarOpen"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn rounded color="green" class="white--text mr-2" @click="exportExcel">
                <v-icon left>dashboard</v-icon>엑셀 다운로드(F2)
              </v-btn>
              <v-btn color="primary"
                     rounded
                     v-on="on"
                     v-bind="attrs"
                     @click="showCalendar"
              >
                <v-icon class="pr-2">calendar_today</v-icon> 이전 달 정산이력 보기
              </v-btn>
            </template>
            <v-date-picker
              v-model="selectedMonth"
              type="month"
              locale="kr"
              no-title
              @change="changeMonth($event)"
            />
          </v-menu>
        </v-col>
      </v-row>
    </app-card>
    <v-tabs grow class="pb-2">
      <v-tab v-if="!isPartner" @click="changeUser('admin')">관리자</v-tab>
      <v-tab @click="changeUser('partner')">파트너</v-tab>
    </v-tabs>
    <v-tabs grow class="pb-2">
      <v-tab @click="tabName = 'all'">전체 월별 이용 내역</v-tab>
      <v-tab @click="tabName = 'room'">객실 월별 이용 내역</v-tab>
      <v-tab @click="tabName = 'pkg'">패키지 월별 이용 내역</v-tab>
      <v-tab @click="tabName = 'break'">위약금 월별 이용 내역</v-tab>
    </v-tabs>
    <app-card v-if="tabName === 'all'" custom-classes="elevation-0">
      <template v-slot:heading>
        <v-row>
          <v-col cols="8">
            <div class="title font-weight-bold">전체 월별 이용 내역 (총합계 :
              <span v-if="totAmt">{{ parseInt(totAmt.roomSum) + parseInt(totAmt.pkgSum) + parseInt(totAmt.breakSum) | price}})</span>
              <span v-else>0)</span>
            </div>
          </v-col>
          <v-col cols="4" class="text-end">
            <v-btn rounded
                   color="indigo"
                   class="white--text"
                   @click="isShowTotalCalc = !isShowTotalCalc">
              전체 월별 이용내역 접기/펼치기
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <v-col v-if="isShowTotalCalc" cols="12" class="pa-0">
        <v-simple-table
          class="bordered"
          dense
          fixed-header>
          <thead>
          <tr>
            <th class="text-center font-weight-medium" colspan="2">법인</th>
            <th class="text-center font-weight-medium py-1">제주</th>
            <th class="text-center font-weight-medium py-1" colspan="15">호텔앤리조트</th>
          </tr>
          <tr>
            <th class="text-center font-weight-medium">구분</th>
            <th class="text-center">합계</th>
            <th class="text-center font-weight-medium">소노캄 제주</th>
            <th class="text-center">제주 제외 합계</th>
            <th v-for="local in localList" :key="local.commCd"
                class="text-center font-weight-medium text--darken-1" v-html="local.commCdNm"/>
          </tr>
          </thead>
          <tbody v-if="totalAllList">
          <tr v-for="(item, index) in totalAllList" :key="index">
            <td class="text-center py-1" :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.amtTypeNm }}</td>
            <td class="text-center py-1 font-weight-bold">{{ item.totSum | price }}</td>
            <td class="text-center py-1" :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt26 | price }}</td>
            <td class="text-center py-1 font-weight-bold">{{ item.totSum - item.aftpayAmt26 | price }}</td>
            <td class="text-center py-1" :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt01 | price }}</td>
            <td class="text-center py-1" :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt02 | price }}</td>
            <td class="text-center py-1" :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt03 | price }}</td>
            <td class="text-center py-1" :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt05 | price }}</td>
            <td class="text-center py-1" :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt06 | price }}</td>
            <td class="text-center py-1" :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt10 | price }}</td>
            <td class="text-center py-1" :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt15 | price }}</td>
            <td class="text-center py-1" :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt16 | price }}</td>
            <td class="text-center py-1" :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt17 | price }}</td>
            <td class="text-center py-1" :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt18 | price }}</td>
            <td class="text-center py-1" :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt24 | price }}</td>
            <td class="text-center py-1" :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt28 | price }}</td>
            <td class="text-center py-1" :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt35 | price }}</td>
            <td class="text-center py-1" :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt73 | price }}</td>
          </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </app-card>
    <app-card v-if="tabName === 'all'" custom-classes="elevation-0">
      <template v-slot:heading>
        <div class="title font-weight-bold">파트너별 전체 월별 이용 내역</div>
      </template>
      <v-col cols="12" class="pa-0">
        <v-simple-table
          v-dragscroll="{target: '.v-data-table__wrapper'}"
          class="bordered"
          dense
          fixed-header>
          <thead>
          <tr>
            <th class="text-center font-weight-medium" colspan="3">법인</th>
            <th class="text-center font-weight-medium py-1">제주</th>
            <th class="text-center font-weight-medium py-1" colspan="15">호텔앤리조트</th>
          </tr>
          <tr>
            <th class="text-center font-weight-medium">파트너사</th>
            <th class="text-center font-weight-medium">구분</th>
            <th class="text-center">합계</th>
            <th class="text-center font-weight-medium">소노캄 제주</th>
            <th class="text-center">제주 제외 합계</th>
            <th v-for="local in localList" :key="local.commCd"
                class="text-center font-weight-medium text--darken-1" v-html="local.commCdNm"/>
          </tr>
          </thead>
          <tbody v-if="ptnrAllList">
          <tr v-for="(item, index) in ptnrAllList" :key="index">
            <td class="text-center py-1" v-if="index % 5 === 0" rowspan="5" :class="index % 5 === 0 && index+5 != ptnrAllList.length ? 'bottom-border' : ''">
              {{ item.ptnrNm }}
            </td>
            <td class="text-center py-1" :class="index % 5 === 4 ? 'bottom-border' : ''">
              <span :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.amtTypeNm }}</span>
            </td>
            <td class="text-center py-1 font-weight-bold" :class="index % 5 === 4 ? 'bottom-border' : ''">{{ item.totSum | price }}</td>
            <td class="text-center py-1" :class="index % 5 === 4 ? 'bottom-border' : ''">
              <span :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt26 | price }}</span>
            </td>
            <td class="text-center py-1 font-weight-bold" :class="index % 5 === 4 ? 'bottom-border' : ''">
              <span :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.totSum - item.aftpayAmt26 | price }}</span>
            </td>
            <td class="text-center py-1" :class="index % 5 === 4 ? 'bottom-border' : ''">
              <span :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt01 | price }}</span>
            </td>
            <td class="text-center py-1" :class="index % 5 === 4 ? 'bottom-border' : ''">
              <span :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt02 | price }}</span>
            </td>
            <td class="text-center py-1" :class="index % 5 === 4 ? 'bottom-border' : ''">
              <span :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt03 | price }}</span>
            </td>
            <td class="text-center py-1" :class="index % 5 === 4 ? 'bottom-border' : ''">
              <span :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt05 | price }}</span>
            </td>
            <td class="text-center py-1" :class="index % 5 === 4 ? 'bottom-border' : ''">
              <span :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt06 | price }}</span>
            </td>
            <td class="text-center py-1" :class="index % 5 === 4 ? 'bottom-border' : ''">
              <span :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt10 | price }}</span>
            </td>
            <td class="text-center py-1" :class="index % 5 === 4 ? 'bottom-border' : ''">
              <span :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt15 | price }}</span>
            </td>
            <td class="text-center py-1" :class="index % 5 === 4 ? 'bottom-border' : ''">
              <span :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt16 | price }}</span>
            </td>
            <td class="text-center py-1" :class="index % 5 === 4 ? 'bottom-border' : ''">
              <span :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt17 | price }}</span>
            </td>
            <td class="text-center py-1" :class="index % 5 === 4 ? 'bottom-border' : ''">
              <span :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt18 | price }}</span>
            </td>
            <td class="text-center py-1" :class="index % 5 === 4 ? 'bottom-border' : ''">
              <span :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt24 | price }}</span>
            </td>
            <td class="text-center py-1" :class="index % 5 === 4 ? 'bottom-border' : ''">
              <span :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt28 | price }}</span>
            </td>
            <td class="text-center py-1" :class="index % 5 === 4 ? 'bottom-border' : ''">
              <span :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt35 | price }}</span>
            </td>
            <td class="text-center py-1" :class="index % 5 === 4 ? 'bottom-border' : ''">
              <span :class="index % 5 === 3 ? 'font-weight-bold': ''">{{ item.aftpayAmt73 | price }}</span>
            </td>
          </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </app-card>
    <app-card v-if="tabName === 'room'" custom-classes="elevation-0">
      <template v-slot:heading>
        <div class="title font-weight-bold">지역별 객실 이용 총합계 (객실 총합계 : {{ totAmt ? totAmt.roomSum : 0 | price }})</div>
      </template>
      <v-col cols="12" class="pa-0">
        <v-simple-table
          class="bordered"
          dense
          fixed-header>
          <thead>
          <tr>
            <th class="text-center font-weight-medium">법인</th>
            <th class="text-center font-weight-medium py-1">제주</th>
            <th class="text-center font-weight-medium py-1" colspan="14">호텔앤리조트</th>
          </tr>
          <tr>
            <th class="text-center font-weight-medium">지역</th>
            <th class="text-center font-weight-medium">소노캄 제주</th>
            <th v-for="local in localList" :key="local.commCd"
                class="text-center font-weight-medium text--darken-1" v-html="local.commCdNm"/>
          </tr>
          </thead>
          <tbody v-if="totAmt">
          <tr>
            <td class="text-center py-1">총합계</td>
            <td class="text-center py-1">{{ totAmt.roomAftpayAmt26 | price }}</td>
            <td class="text-center py-1">{{ totAmt.roomAftpayAmt01 | price }}</td>
            <td class="text-center py-1">{{ totAmt.roomAftpayAmt02 | price }}</td>
            <td class="text-center py-1">{{ totAmt.roomAftpayAmt03 | price }}</td>
            <td class="text-center py-1">{{ totAmt.roomAftpayAmt05 | price }}</td>
            <td class="text-center py-1">{{ totAmt.roomAftpayAmt06 | price }}</td>
            <td class="text-center py-1">{{ totAmt.roomAftpayAmt10 | price }}</td>
            <td class="text-center py-1">{{ totAmt.roomAftpayAmt15 | price }}</td>
            <td class="text-center py-1">{{ totAmt.roomAftpayAmt16 | price }}</td>
            <td class="text-center py-1">{{ totAmt.roomAftpayAmt17 | price }}</td>
            <td class="text-center py-1">{{ totAmt.roomAftpayAmt18 | price }}</td>
            <td class="text-center py-1">{{ totAmt.roomAftpayAmt24 | price }}</td>
            <td class="text-center py-1">{{ totAmt.roomAftpayAmt28 | price }}</td>
            <td class="text-center py-1">{{ totAmt.roomAftpayAmt35 | price }}</td>
            <td class="text-center py-1">{{ totAmt.roomAftpayAmt73 | price }}</td>
          </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </app-card>
    <app-card v-if="tabName === 'room'" custom-classes="elevation-0">
      <template v-slot:heading>
        <div class="title font-weight-bold">객실 월별 이용 내역</div>
      </template>
      <v-col cols="12" class="pa-0">
        <v-simple-table
          v-dragscroll="{target: '.v-data-table__wrapper'}"
          class="bordered"
          dense
          fixed-header>
          <thead>
          <tr>
            <th class="text-center font-weight-medium">법인</th>
            <th class="text-center font-weight-medium py-1">제주</th>
            <th class="text-center font-weight-medium py-1" colspan="14">호텔앤리조트</th>
          </tr>
          <tr>
            <th class="text-center font-weight-medium">지역</th>
            <th class="text-center font-weight-medium">소노캄 제주</th>
            <th v-for="local in localList" :key="local.commCd"
                class="text-center font-weight-medium text--darken-1" v-html="local.commCdNm"/>
          </tr>
          </thead>
          <tbody v-if="processedList">
          <tr v-for="(item, index) in processedList" :key="index">
            <td class="text-center py-1">{{ item.ptnrNm }}</td>
            <td class="text-center py-1">{{ item.roomAftpayAmt26 | price }}</td>
            <td class="text-center py-1">{{ item.roomAftpayAmt01 | price }}</td>
            <td class="text-center py-1">{{ item.roomAftpayAmt02 | price }}</td>
            <td class="text-center py-1">{{ item.roomAftpayAmt03 | price }}</td>
            <td class="text-center py-1">{{ item.roomAftpayAmt05 | price }}</td>
            <td class="text-center py-1">{{ item.roomAftpayAmt06 | price }}</td>
            <td class="text-center py-1">{{ item.roomAftpayAmt10 | price }}</td>
            <td class="text-center py-1">{{ item.roomAftpayAmt15 | price }}</td>
            <td class="text-center py-1">{{ item.roomAftpayAmt16 | price }}</td>
            <td class="text-center py-1">{{ item.roomAftpayAmt17 | price }}</td>
            <td class="text-center py-1">{{ item.roomAftpayAmt18 | price }}</td>
            <td class="text-center py-1">{{ item.roomAftpayAmt24 | price }}</td>
            <td class="text-center py-1">{{ item.roomAftpayAmt28 | price }}</td>
            <td class="text-center py-1">{{ item.roomAftpayAmt35 | price }}</td>
            <td class="text-center py-1">{{ item.roomAftpayAmt73 | price }}</td>
          </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </app-card>
    <app-card v-if="tabName === 'pkg'" custom-classes="elevation-0">
      <template v-slot:heading>
        <div class="title font-weight-bold">지역별 패키지 이용 총합계 (패키지 총합계 : {{ totAmt ? totAmt.pkgSum : 0 | price }})</div>
      </template>
      <v-col cols="12" class="pa-0">
        <v-simple-table
          v-dragscroll="{target: '.v-data-table__wrapper'}"
          class="bordered"
          dense
          fixed-header>
          <thead>
          <tr>
            <th class="text-center font-weight-medium">법인</th>
            <th class="text-center font-weight-medium py-1">제주</th>
            <th class="text-center font-weight-medium py-1" colspan="14">호텔앤리조트</th>
          </tr>
          <tr>
            <th class="text-center font-weight-medium">지역</th>
            <th class="text-center font-weight-medium">소노캄 제주</th>
            <th v-for="local in localList" :key="local.commCd"
                class="text-center font-weight-medium text--darken-1" v-html="local.commCdNm"/>
          </tr>
          </thead>
          <tbody v-if="totAmt">
          <tr>
            <td class="text-center py-1">총합계</td>
            <td class="text-center py-1">{{ totAmt.pkgAftpayAmt26 | price }}</td>
            <td class="text-center py-1">{{ totAmt.pkgAftpayAmt01 | price }}</td>
            <td class="text-center py-1">{{ totAmt.pkgAftpayAmt02 | price }}</td>
            <td class="text-center py-1">{{ totAmt.pkgAftpayAmt03 | price }}</td>
            <td class="text-center py-1">{{ totAmt.pkgAftpayAmt05 | price }}</td>
            <td class="text-center py-1">{{ totAmt.pkgAftpayAmt06 | price }}</td>
            <td class="text-center py-1">{{ totAmt.pkgAftpayAmt10 | price }}</td>
            <td class="text-center py-1">{{ totAmt.pkgAftpayAmt15 | price }}</td>
            <td class="text-center py-1">{{ totAmt.pkgAftpayAmt16 | price }}</td>
            <td class="text-center py-1">{{ totAmt.pkgAftpayAmt17 | price }}</td>
            <td class="text-center py-1">{{ totAmt.pkgAftpayAmt18 | price }}</td>
            <td class="text-center py-1">{{ totAmt.pkgAftpayAmt24 | price }}</td>
            <td class="text-center py-1">{{ totAmt.pkgAftpayAmt28 | price }}</td>
            <td class="text-center py-1">{{ totAmt.pkgAftpayAmt35 | price }}</td>
            <td class="text-center py-1">{{ totAmt.pkgAftpayAmt73 | price }}</td>
          </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </app-card>
    <v-tabs v-if="tabName === 'pkg'" grow>
      <v-tab @click="pkgTabName = 'chit'">패키지 월별 이용 내역(전표용)</v-tab>
      <v-tab @click="pkgTabName = 'backdata'">패키지 월별 이용 내역(백데이터용)</v-tab>
    </v-tabs>
    <app-card v-if="tabName === 'pkg' && pkgTabName === 'chit'" custom-classes="elevation-0">
      <template v-slot:heading>
        <div class="title font-weight-bold">패키지 월별 이용 내역(전표용)</div>
      </template>
      <v-col cols="12" class="pa-0">
        <v-simple-table
          v-dragscroll="{target: '.v-data-table__wrapper'}"
          class="bordered"
          dense
          fixed-header>
          <thead>
          <tr>
            <th class="text-center font-weight-medium">법인</th>
            <th class="text-center font-weight-medium py-1">제주</th>
            <th class="text-center font-weight-medium py-1" colspan="14">호텔앤리조트</th>
          </tr>
          <tr>
            <th class="text-center font-weight-medium">지역</th>
            <th class="text-center font-weight-medium">소노캄 제주</th>
            <th v-for="local in localList" :key="local.commCd"
                class="text-center font-weight-medium text--darken-1" v-html="local.commCdNm"/>
          </tr>
          </thead>
          <tbody v-if="processedList">
          <tr v-for="(item, index) in processedList" :key="index">
            <td class="text-center py-1">{{ item.ptnrNm }}</td>
            <td class="text-center py-1">{{ item.pkgAftpayAmt26 | price }}</td>
            <td class="text-center py-1">{{ item.pkgAftpayAmt01 | price }}</td>
            <td class="text-center py-1">{{ item.pkgAftpayAmt02 | price }}</td>
            <td class="text-center py-1">{{ item.pkgAftpayAmt03 | price }}</td>
            <td class="text-center py-1">{{ item.pkgAftpayAmt05 | price }}</td>
            <td class="text-center py-1">{{ item.pkgAftpayAmt06 | price }}</td>
            <td class="text-center py-1">{{ item.pkgAftpayAmt10 | price }}</td>
            <td class="text-center py-1">{{ item.pkgAftpayAmt15 | price }}</td>
            <td class="text-center py-1">{{ item.pkgAftpayAmt16 | price }}</td>
            <td class="text-center py-1">{{ item.pkgAftpayAmt17 | price }}</td>
            <td class="text-center py-1">{{ item.pkgAftpayAmt18 | price }}</td>
            <td class="text-center py-1">{{ item.pkgAftpayAmt24 | price }}</td>
            <td class="text-center py-1">{{ item.pkgAftpayAmt28 | price }}</td>
            <td class="text-center py-1">{{ item.pkgAftpayAmt35 | price }}</td>
            <td class="text-center py-1">{{ item.pkgAftpayAmt73 | price }}</td>
          </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </app-card>
    <app-card v-if="tabName === 'pkg' && pkgTabName === 'backdata'" custom-classes="elevation-0">
      <template v-slot:heading>
        <div class="title font-weight-bold">패키지 월별 이용 내역(백데이터용)</div>
      </template>
      <v-col cols="12" class="pa-0">
        <v-simple-table
          v-dragscroll="{target: '.v-data-table__wrapper'}"
          class="bordered"
          dense
          fixed-header>
          <thead>
          <tr>
            <th class="text-center font-weight-medium">지역명</th>
            <th class="text-center font-weight-medium">회원번호</th>
            <th class="text-center font-weight-medium">패키지명</th>
            <th class="text-center font-weight-medium">후불금액</th>
          </tr>
          </thead>
          <tbody v-if="pkgBackDataList">
          <tr v-for="(item, index) in pkgBackDataList" :key="index">
            <td class="text-center py-1">{{ item.lcalNm }}</td>
            <td class="text-center py-1">{{ item.memNo }}</td>
            <td class="text-center py-1">{{ item.pkgNm }}</td>
            <td class="text-center py-1">{{ item.aftpayAmt | price }}</td>
          </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </app-card>
    <app-card v-if="tabName === 'break'" custom-classes="elevation-0">
      <template v-slot:heading>
        <div class="title font-weight-bold">지역별 위약금 이용 총합계 (위약금 총합계 : {{ totAmt ? totAmt.breakSum : 0 | price }})</div>
      </template>
      <v-col cols="12" class="pa-0">
        <v-simple-table
          class="bordered"
          dense
          fixed-header>
          <thead>
          <tr>
            <th class="text-center font-weight-medium">법인</th>
            <th class="text-center font-weight-medium py-1">제주</th>
            <th class="text-center font-weight-medium py-1" colspan="15">호텔앤리조트</th>
          </tr>
          <tr>
            <th class="text-center font-weight-medium">지역</th>
            <th class="text-center font-weight-medium">소노캄 제주</th>
            <th v-for="(local, index) in breakLocalList" :key="index"
                class="text-center font-weight-medium text--darken-1" v-html="local.commCdNm"/>
          </tr>
          </thead>
          <tbody v-if="totAmt">
          <tr>
            <td class="text-center py-1">총합계</td>
            <td class="text-center py-1">{{ totAmt.bkpmsAftpayAmt26 | price }}</td>
            <td class="text-center py-1">{{ totAmt.bkpmsAftpayAmt01 | price }}</td>
            <td class="text-center py-1">{{ totAmt.bkpmsAftpayAmt0001 | price }}</td>
            <td class="text-center py-1">{{ totAmt.bkpmsAftpayAmt0002 | price }}</td>
            <td class="text-center py-1">{{ totAmt.bkpmsAftpayAmt03 | price }}</td>
            <td class="text-center py-1">{{ totAmt.bkpmsAftpayAmt05 | price }}</td>
            <td class="text-center py-1">{{ totAmt.bkpmsAftpayAmt06 | price }}</td>
            <td class="text-center py-1">{{ totAmt.bkpmsAftpayAmt10 | price }}</td>
            <td class="text-center py-1">{{ totAmt.bkpmsAftpayAmt15 | price }}</td>
            <td class="text-center py-1">{{ totAmt.bkpmsAftpayAmt16 | price }}</td>
            <td class="text-center py-1">{{ totAmt.bkpmsAftpayAmt17 | price }}</td>
            <td class="text-center py-1">{{ totAmt.bkpmsAftpayAmt18 | price }}</td>
            <td class="text-center py-1">{{ totAmt.bkpmsAftpayAmt24 | price }}</td>
            <td class="text-center py-1">{{ totAmt.bkpmsAftpayAmt28 | price }}</td>
            <td class="text-center py-1">{{ totAmt.bkpmsAftpayAmt35 | price }}</td>
            <td class="text-center py-1">{{ totAmt.bkpmsAftpayAmt73 | price }}</td>
          </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </app-card>
    <app-card v-if="tabName === 'break'" custom-classes="elevation-0">
      <template v-slot:heading>
        <div class="title font-weight-bold">위약금 월별 이용 내역</div>
      </template>
      <v-col cols="12" class="pa-0">
        <v-simple-table
          class="bordered"
          dense
          fixed-header>
          <thead>
          <tr>
            <th class="text-center font-weight-medium">법인</th>
            <th class="text-center font-weight-medium py-1">제주</th>
            <th class="text-center font-weight-medium py-1" colspan="15">호텔앤리조트</th>
          </tr>
          <tr>
            <th class="text-center font-weight-medium">파트너사</th>
            <th class="text-center font-weight-medium">소노캄 제주</th>
            <th v-for="(local, index) in breakLocalList" :key="index"
                class="text-center font-weight-medium text--darken-1" v-html="local.commCdNm"/>
          </tr>
          </thead>
          <tbody v-if="processedList">
          <tr v-for="(item, index) in processedList" :key="index">
            <td class="text-center py-1">{{ item.ptnrNm }}</td>
            <td class="text-center py-1">{{ item.bkpmsAftpayAmt26 | price }}</td>
            <td class="text-center py-1">{{ item.bkpmsAftpayAmt01 | price }}</td>
            <td class="text-center py-1">{{ item.bkpmsAftpayAmt0001 | price }}</td>
            <td class="text-center py-1">{{ item.bkpmsAftpayAmt0002 | price }}</td>
            <td class="text-center py-1">{{ item.bkpmsAftpayAmt03 | price }}</td>
            <td class="text-center py-1">{{ item.bkpmsAftpayAmt05 | price }}</td>
            <td class="text-center py-1">{{ item.bkpmsAftpayAmt06 | price }}</td>
            <td class="text-center py-1">{{ item.bkpmsAftpayAmt10 | price }}</td>
            <td class="text-center py-1">{{ item.bkpmsAftpayAmt15 | price }}</td>
            <td class="text-center py-1">{{ item.bkpmsAftpayAmt16 | price }}</td>
            <td class="text-center py-1">{{ item.bkpmsAftpayAmt17 | price }}</td>
            <td class="text-center py-1">{{ item.bkpmsAftpayAmt18 | price }}</td>
            <td class="text-center py-1">{{ item.bkpmsAftpayAmt24 | price }}</td>
            <td class="text-center py-1">{{ item.bkpmsAftpayAmt28 | price }}</td>
            <td class="text-center py-1">{{ item.bkpmsAftpayAmt35 | price }}</td>
            <td class="text-center py-1">{{ item.bkpmsAftpayAmt73 | price }}</td>
          </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </app-card>
  </div>
</template>

<script>
import monthlyUsedCalcService from 'Api/modules/ota/monthlyUsedCalculation.service'

import excelMixin from 'Mixins/excelMixin'
import commonCodeService from 'Api/modules/system/commonCode.service'

import { mapGetters } from 'vuex'

export default {
  name: 'MonthlyUsedCalculation',
  mixins: [excelMixin],
  data () {
    return {
      selectedDate: moment().format('YYYYMMDD'),
      selectedMonth: null, // 선택된 달
      isCalendarOpen: false,
      localList: [], // 지역 목록
      breakLocalList: [], // 위약금 쪽 지역목록
      processedList: [], // 가공된 목록
      ptnrAllList: [], // 전체 파트너별 월별 이용내역 목록
      totalAllList: [], //  전체 총 월별 이용내역 목록
      pkgBackDataList: [], // 패키지 월별 이용내역 (백데이터용)
      totAmt: '', // 총금액
      tabName: 'all',
      pkgTabName: 'chit', // 패키지 내부 탭
      ptnrNo: '', // 파트너 번호
      isShowTotalCalc: true // 전체 총 월별 이용내역 접기/펼치기
    }
  },
  computed: {
    ...mapGetters({ user: 'auth/user' }),
    title () {
      const titleDate = moment(this.selectedDate).format('YYYY년 MM월')
      return `${titleDate} 이용 내역`
    }
  },
  mounted () {
    this.isPartner ? this.ptnrNo = this.user.number : this.ptnrNo = ''
    this.selectStoreList()
    this.selectAllBasicInfo()
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [
        {
          target: 'F2',
          action: this.exportExcel
        }
      ]
    })
  },
  methods: {
    /**
     * 관리자 OR 파트너 선택
     */
    changeUser (user) {
      if (user === 'partner') { // 파트너
        this.isPartner ? this.ptnrNo = this.user.number : this.ptnrNo = '0'
      } else { // 관리자
        this.ptnrNo = ''
      }
      this.selectAllBasicInfo()
    },
    /**
     * 전체 정보 조회
     */
    selectAllBasicInfo () {
      this.selectMonthlyUsedList(this.selectedDate)
      this.selectAllMonthlyUsedList(this.selectedDate)
      this.selectPkgBackDataList(this.selectedDate)
    },
    /**
     * 월별 캘린더 오픈
     */
    showCalendar () {
      this.isCalendarOpen = true
      this.selectedMonth = moment(this.selectedDate).format('YYYY-MM')
    },
    /**
     * 새로운 월에 대한 정보 추가
     * @param date
     */
    changeMonth (date) {
      this.selectedDate = moment(date).format('YYYYMMDD')
      this.selectMonthlyUsedList(this.selectedDate)
      this.selectAllMonthlyUsedList(this.selectedDate)
      this.selectPkgBackDataList(this.selectedDate)
    },
    /**
     * 월별 이용 내역 목록 및 총금액 조회
     * @param selectedDate
     */
    async selectMonthlyUsedList (selectedDate) {
      const param = {}
      param.ptnrNo = this.ptnrNo
      param.selectedDate = selectedDate
      const res = await monthlyUsedCalcService.selectMonthlyUsedCaculation(param)
      this.processedList = res.data.monthlyUsedCalcList
      this.totAmt = res.data.totAmt
    },
    /**
     * 전체 월별 이용 내역 목록
     * @param selectedDate
     */
    async selectAllMonthlyUsedList (selectedDate) {
      const param = {}
      param.ptnrNo = this.ptnrNo
      param.selectedDate = selectedDate
      const res = await monthlyUsedCalcService.selectAllMonthlyUsedCaculation(param)
      this.ptnrAllList = res.data.ptnrAllList // 파트너별
      this.totalAllList = res.data.totalAllList // 전체
    },
    /**
     * 패키지 월별 이용현황 (백데이터용)
     */
    async selectPkgBackDataList (selectedDate) {
      const param = {}
      param.ptnrNo = this.ptnrNo
      param.selectedDate = selectedDate
      const res = await monthlyUsedCalcService.selectPkgBackDataList(param)
      this.pkgBackDataList = res.data
    },
    /**
     * 지역 정보 조회
     */
    async selectStoreList () {
      // 공통코드에서 OTA 지역 코드 조회
      const res = await commonCodeService.selectCommonCode('OTA0009')
      this.localList = res.data

      // 위약금 지역 정보 리스트 생성(비발디파크 -> 비발디, 소노펠리체로 분리)
      const localList = _.cloneDeep(this.localList)
      localList.splice(1, 1, { commCdNm: '비발디' }, { commCdNm: '소노펠리체' })
      this.breakLocalList = localList
    },
    /**
     * 엑셀 다운로드
     */
    exportExcel () {
      if (this.processedList.length > 0) {
        const param = {}
        param.ptnrNo = this.ptnrNo
        param.selectedDate = this.selectedDate
        let userName = ''
        if (!this.isPartner) {
          param.ptnrNo === '' ? userName = '관리자용' : userName = '파트너용'
        } else {
          userName = '파트너'
        }
        this.downLoadExcel('/api/ota/monthlyUsedCalculation/excel', `월별 이용 내역 (${userName})`, param)
      } else {
        this.$dialog.alert('다운로드할 현황이 없습니다.')
      }
    }
  }
}
</script>

<style scoped>
  td.bottom-border {
    border-bottom: #009688 solid 2px!important;
  }
</style>
