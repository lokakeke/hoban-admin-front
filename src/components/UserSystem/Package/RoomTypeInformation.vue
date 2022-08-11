<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="6" md="12" sm="12">
        <v-row no-gutters>
          <v-col align-self="center" cols="6">
            <span class="title font-weight-bold">미판매 객실유형 리스트</span>
          </v-col>
          <v-col cols="6">
            <v-text-field
                :label="searchLabel"
                append-icon="mdi-magnify"
                hide-details
                single-line
                v-model="searchN"
            />
          </v-col>
        </v-row>
        <v-row class="mt-2" no-gutters>
          <v-col cols="12">
            <p class="subtitle-1 font-weight-bold" v-if="writeAuth">※ 클릭을 통해 미판매 객실유형을 판매 객실유형으로 이동 할 수 있습니다.</p>
          </v-col>
        </v-row>
        <v-sheet class="overflow-x-auto" elevation="1" height="500" max-height="500">
          <v-data-table :class="writeAuth ? 'pointer' : ''"
                        :headers="headers"
                        :no-data-text="emptyText"
                        :no-results-text="emptyText"
                        :search="searchN"
                        class="bordered"
                        disable-pagination
                        disable-sort
                        fixed-header
                        height="500"
                        hide-default-footer />
        </v-sheet>
        <v-row class="mt-3" no-gutters>
          <v-col class="text-end">
            <v-btn color="info" outlined rounded>
              모두 판매객실로
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="6" md="12" sm="12">
        <v-row no-gutters>
          <v-col align-self="center" cols="6">
            <span class="title font-weight-bold">판매 객실유형 리스트</span>
          </v-col>
          <v-col cols="6">
            <v-text-field
                :label="searchLabel"
                append-icon="mdi-magnify"
                hide-details
                single-line
                v-model="searchY"
            />
          </v-col>
        </v-row>
        <v-row class="mt-2" no-gutters>
          <v-col cols="12">
            <p class="subtitle-1 font-weight-bold" v-if="writeAuth">※ 클릭을 통해 판매객실유형을 미판매객실유형으로 이동 할 수 있습니다.</p>
          </v-col>
        </v-row>
        <v-sheet class="overflow-x-auto" elevation="1" height="500" max-height="500">
          <v-data-table :class="writeAuth ? 'pointer' : ''"
                        :headers="headers"
                        :no-data-text="emptyText"
                        :no-results-text="emptyText"
                        :search="searchY"
                        class="bordered"
                        disable-pagination
                        disable-sort
                        fixed-header
                        height="500"
                        hide-default-footer />
        </v-sheet>
        <v-row class="mt-3" no-gutters>
          <v-col class="text-end">
            <v-btn color="red" outlined rounded>
              모두 미판매객실로
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-right">
        <v-btn @click="save" color="primary" rounded v-if="!isEdit">
          <v-icon>keyboard_arrow_right</v-icon>저장 후 다음단계로 이동</v-btn>
        <v-btn @click="update" color="primary" rounded v-else>
          <v-icon class="pr-2">edit</v-icon>수정
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'RoomTypeInformation',
  props: {
    isEdit: Boolean,
    packageNoProp: String
  },
  data: function () {
    return {
      packageNo: '',
      origin: [],
      headers: [
        { text: '영업장명 / 코드', value: 'store', align: 'center' },
        { text: '객실유형명 / 코드', value: 'roomType', align: 'center' }
      ],
      searchN: '',
      searchY: '',
      saveData: []
    }
  },
  mounted () {
    this.packageNo = this.packageNoProp
  },
  computed: {
  },
  methods: {
    async save () {
    },
    async update () {
    }
  }
}
</script>
