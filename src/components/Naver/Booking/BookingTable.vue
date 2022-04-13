<template>
  <v-form>
    <table border="1" style="border:1px solid #ddd;" class="text-center">
      <tr>
        <th></th>
        <th>Naver
          <v-chip class="ma-1 font-weight-light" small>
            예약상태: {{ form.statusCode.bookingStatusCode ? form.statusCode.bookingStatusCode : '-' }}
            / 결제상태: {{ form.statusCode.nPayChargedStatusCode ? form.statusCode.nPayChargedStatusCode : '-' }}
          </v-chip>
        </th>
        <th>DGNS
          <v-chip class="ma-1 font-weight-light" small>상태: {{ dgnsInfo.rsvState ? dgnsInfo.rsvState : '-' }}</v-chip>
        </th>
      </tr>
      <tr>
        <th>DGNS 예약번호</th>
        <td colspan="2">{{ form.naver.rsvNo ? form.naver.rsvNo : '-' }}</td>
      </tr>
      <tr>
        <th>DGNS KEY 예약번호</th>
        <td colspan="2">{{ form.naver.keyRsvNo ? form.naver.keyRsvNo : '-' }}</td>
      </tr>
      <tr v-if="item.pkgYn === 'Y'">
        <th>패키지명</th>
        <td>{{ item.pkgName }}({{ item.mid }})</td>
        <td>{{ form.companyName ? form.companyName : '-' }}({{ dgnsInfo.memNo ? dgnsInfo.memNo : '-' }})</td>
      </tr>
      <tr v-else>
        <th>회원번호</th>
        <td>{{ item.mid }}</td>
        <td>{{ dgnsInfo.memNo ? dgnsInfo.memNo : '-' }}</td>
      </tr>
      <tr>
        <th>영업장명</th>
        <td>{{ item.storeName }} ({{ item.storeCode }})</td>
        <td>{{ dgnsInfo.storeName ? dgnsInfo.storeName : '-' }} ({{ dgnsInfo.storeCode ? dgnsInfo.storeCode : '-' }})</td>
      </tr>
      <tr>
        <th>객실타입명</th>
        <td>{{ form.naver.dmItemName }}</td>
        <td>{{ dgnsInfo.rmTypeName ? dgnsInfo.rmTypeName : '-' }} ({{ dgnsInfo.rmTypeCode ? dgnsInfo.rmTypeCode : '-' }})</td>
      </tr>
      <tr>
        <th>블럭코드</th>
        <td>{{ item.rsvBlckCode }}</td>
        <td>{{ dgnsInfo.rsvBlckCode ? dgnsInfo.rsvBlckCode : '-' }}</td>
      </tr>
      <tr>
        <th>DGNS예약부가정보</th>
        <td colspan="2" v-if="!dgnsInfo.keyRsvNo">
          <v-alert dense outlined type="info" class="ma-1 font-sm" v-if="!form.dgns">
            DGNS에 해당 예약과 일치하는 데이터가 없습니다.
          </v-alert>
        </td>
        <td colspan="2" class="pb-1" v-else>
          <v-chip class="mr-1 mt-1" small>예약자성명: {{ dgnsInfo.rsvGuestlnm }}</v-chip>
          <v-chip class="mr-1 mt-1" small>등록자: {{ dgnsInfo.crtName }}</v-chip>
          <v-chip class="mr-1 mt-1" small>등록일시: {{ dgnsInfo.crtDt }}</v-chip>
          <v-chip class="mr-1 mt-1" small>수정자: {{ dgnsInfo.updName }}</v-chip>
          <v-chip class="mr-1 mt-1" small>수정일시: {{ dgnsInfo.updDt }}</v-chip>
          <v-chip class="mr-1 mt-1" small>취소사유코드: {{ dgnsInfo.cancelResnCode ? dgnsInfo.cancelResnCode : '(없음)' }}</v-chip>
        </td>
      </tr>
    </table>
  </v-form>
</template>

<script>

export default {
  name: 'BookingTable',
  components: {},
  data: () => ({
  }),
  props: {
    form: Object,
    item: Object,
    dgnsInfo: Object
  }
}
</script>

<style>
  td, th { padding : 0 10px; }
</style>
