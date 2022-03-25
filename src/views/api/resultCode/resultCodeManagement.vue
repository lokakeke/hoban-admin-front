<template>
  <v-row wrap>
    <app-card :heading="'결과 코드 리스트'" col-classes="col-12">
      <v-row>
        <v-col class="pt-0"></v-col>
        <v-col class="pt-0"></v-col>
        <v-col class="pt-0"></v-col>
        <v-col class="pt-0">
          <v-text-field v-model="filterText"
                        class="mb-1"
                        hide-details
                        outlined
                        small
                        dense
                        append-icon="mdi-magnify"
                        label="Search"/>
        </v-col>
      </v-row>
      <v-data-table disable-pagination :no-data-text="'검색 결과가 없습니다.'" :headers="headers" :items="filteredList" disable-sort hide-default-footer class="bordered"></v-data-table>
    </app-card>
  </v-row>
</template>

<script>
import service from 'Api/modules/system/resultCode.service'

export default {
  name: 'resultCodeManagement',
  mounted () {
    this.load()
  },
  computed: {
    filteredList () {
      if (this.messages && this.messages.length > 0) {
        if (this.filterText) {
          return this.messages.filter(data => data.code.toLowerCase().indexOf(this.filterText.toLowerCase()) !== -1 || data.korMessage.toLowerCase().indexOf(this.filterText.toLowerCase()) !== -1 || (data.engMessage.toLowerCase() || '').indexOf(this.filterText.toLowerCase()) !== -1 || (data.target || '').indexOf(this.filterText.toLowerCase()) !== -1)
        } else {
          return this.messages
        }
      } else {
        return []
      }
    }
  },
  data () {
    return {
      messages: [],
      headers: [
        { text: '코드', value: 'code', align: 'center', width: '20%' },
        { text: '한글이름', value: 'korMessage', align: 'center', width: '30%' },
        { text: '영문이름', value: 'engMessage', align: 'center', width: '30%' },
        { text: '타겟', value: 'target', align: 'center', width: '20%' }
      ],
      filterText: ''
    }
  },
  methods: {
    load () {
      service.selectApiMessage().then(res => {
        this.messages = res.data
      })
    }
  }
}
</script>
