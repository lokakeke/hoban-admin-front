<template>
    <div>
        <v-row v-for="(item, index) of list" :key="index">
            <v-col cols="2">
                {{ item.packageNo }}
            </v-col>
            <v-col cols="2">
                {{ item.packageName }}
            </v-col>
        </v-row>
    </div>
</template>

<script>
import packageService from '@/api/modules/userSystem/package.service'
export default {
  name: 'PackageManagement',
  data () {
    return {
      list: []
    }
  },
  mounted () {
    this.selectPackageList()
  },
  methods: {
    selectPackageList () {
      // 테스트 조회
      packageService.selectPackageList().then(res => {
        console.log(res)
        this.list = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
