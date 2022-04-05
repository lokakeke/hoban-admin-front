<template>
  <v-row>
    <v-col cols="12" class="pb-1">
      <v-row align="center" class="px-3 py-0 title font-weight-bold">
        <v-icon left color="primary">person</v-icon>
        <span class="primary--text pr-3">{{user.name}}</span>
        <small>( {{user.number}} )</small>
      </v-row>
    </v-col>
    <notice :notice-type-nm="'요금공지'"></notice>
    <notice :notice-type-nm="'휴장공지'"></notice>
    <notice :notice-type-nm="'기타공지'"></notice>
    <deposit :task-type="'OTA'"></deposit>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import Notice from '@/components/System/Main/Notice.vue'
import Deposit from '@/components/System/Main/Deposit.vue'

export default {
  components: { Notice, Deposit },
  name: 'OtaMain',
  computed: {
    ...mapGetters({ user: 'auth/user' })
  },
  mounted () {
    // 팝업 공지사항 체크
    this.checkPopUp()
  }
}
</script>
