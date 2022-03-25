<template>
    <v-card flat>
        <v-card-text>33333333333</v-card-text>
    </v-card>
</template>

<script>
export default {
  name: 'StatusTicketTab3',
  data () {
    return {
      list: [],
      headers: [
        { text: '우대번호', value: 'a', align: 'center' },
        { text: '순번', value: 'b', align: 'center' },
        { text: '난수번호', value: 'c', align: 'center' }
      ],
      form: {}
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    search () {
    },
    getList () {
      console.log('3 tab Load')
    }
  }

}
</script>

<style scoped>

</style>
