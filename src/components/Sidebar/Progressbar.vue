<template>
    <v-menu top offset-x :close-on-content-click="false" v-model="expand">
        <template v-slot:activator="{ on }">
            <v-btn block text v-on="on" height="48" title="재고 전송현황 조회">
                <v-icon left>cast_connected</v-icon>
                <span class="font-weight-bold">재고전송 현황 : {{progressList.length}} 건</span>
                <v-icon right>search</v-icon>
            </v-btn>
        </template>
        <v-toolbar dense dark color="primary">
            <v-spacer></v-spacer>
            <v-btn icon small @click="search(false)" title="재조회">
                <v-icon>refresh</v-icon>
            </v-btn>
            <v-btn icon small @click="expand = false" title="닫기">
                <v-icon>close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-list dense>
            <v-divider class="ma-0"></v-divider>
            <v-list-item v-for="item in progressList" :key="item.brcNo">
                <v-list-item-content>
                    <v-list-item-title>{{item.brcNm +'  - ' + item.cnt + ' / '+ item.totCnt}}</v-list-item-title>
                    <v-list-item-subtitle>
                        <v-progress-linear class="mt-0 mb-0" :value="item.cnt/item.totCnt*100"></v-progress-linear>
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="progressList.length === 0">
                <v-list-item-icon>
                    <v-icon>priority_high</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title style="font-size: 12px;">전송중인 사업장이 없습니다.</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
export default {
  name: 'Progressbar',
  data () {
    return {
      progressList: [],
      searchUrl: '/api/global/tll/processList', // 알림을 받아올 URL 정보
      expand: false,
      intervalTime: 1000 * 60
    }
  },
  mounted () {
    /*
            // 처음에 한번 조회
            this.search(true);
            // URL 에 요청 주기적으로 요청 보내기
            this.$polling.addObserver(this.searchUrl, {
                interval: this.intervalTime,
                maxFails: 10,           // break after 10 (5 by defualt) continuous failures
                headers: {
                    'Content-Type': 'application/json',
                    'jwt-header' : this.$store.getters.jwtToken
                }
            });
            // 요청에 대한 resopnse 처리
            this.$options.listeners[this.searchUrl] = (res) => {
                if(res.data) {
                    this.progressList = res.data;
                }
            };
            */
  },
  methods: {
    search (init) {
      /* inventoryService.selectInventoryProgress().then(res=>{
                    this.progressList = res.data;
                    const testList = [
                        {brcNm: '비발디파크', cnt: 10, totCnt: 100},
                        {brcNm: '델피노', cnt: 8, totCnt: 100},
                        {brcNm: '소노 여수', cnt: 7, totCnt: 100},
                        {brcNm: '소노 단양', cnt: 30, totCnt: 100},
                        {brcNm: '삼척', cnt: 45, totCnt: 100},
                        {brcNm: '양양', cnt: 66, totCnt: 100},
                        {brcNm: '거제', cnt: 71, totCnt: 100},
                        {brcNm: '제주', cnt: 11, totCnt: 100},
                    ];
                    this.progressList = testList;
                    if(init){
                        this.expand = this.progressList.length > 0;
                    }
                }); */
    }
  },
  destroyed () {
    this.$polling.removeObserver(this.searchUrl)
    delete this.$options.listeners[this.searchUrl] // listener 삭제
  }
}
</script>
