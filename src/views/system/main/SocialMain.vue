<template>
  <v-row>
    <v-col cols="12" class="pb-1">
      <v-row align="center" class="px-3 py-0 title font-weight-bold">
        <v-icon left color="primary">person</v-icon>
        <span class="primary--text pr-3">{{user.name}}</span>
        <small>( {{user.number}} )</small>
      </v-row>
    </v-col>
    <notice :use-yn="'Y'"></notice>
    <deposit :task-type="'SOCIAL'"></deposit>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import Notice from 'Components/System/Main/Notice.vue'
import Deposit from 'Components/System/Main/Deposit.vue'

export default {
  components: { Notice, Deposit },
  name: 'SocialMain',
  computed: {
    ...mapGetters({
      user: 'auth/user'
    })
  },
  mounted () {
    // 팝업 공지사항 체크
    this.checkPopUp()
  }
}
</script>
