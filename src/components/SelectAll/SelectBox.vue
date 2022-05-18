<template>
  <v-btn outlined rounded :block="block" :color="model ? 'green' : 'grey'">
    <v-autocomplete
      v-model="model"
      :items="list"
      :item-text="text"
      :item-value="value"
      :placeholder="title + '을 선택하세요.'"
      append-icon="keyboard_arrow_down"
      single-line
      hide-details
      no-data-text="데이터가 없습니다."
      color="green"
      class="pt-0 mt-0 custom-select"
      :menu-props="{'maxHeight':400}"
      @change="changeSelect()"
    ></v-autocomplete>
  </v-btn>
  <!--<v-menu v-model="dialog" bottom offset-y :close-on-content-click="false" transition="slide-y-transition" max-height="400">
      <template v-slot:activator="{ on }">
          <v-btn v-on="on" outlined rounded :block="block" :color="selected ? 'green' : 'grey'">
              {{name}}
              <v-icon right>{{dialog ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</v-icon>
          </v-btn>
      </template>
      <v-card>
          <v-card-text class="pa-0">
              <v-list style="min-width: 200px">
                  <v-list-item v-for="item of list" :key="item[value]" @click="changeSelect(item)">
                      <v-list-item-content>
                          <v-list-item-title :class="item[value] === model? 'green&#45;&#45;text text&#45;&#45;lighten-1':''">{{item[text]}}</v-list-item-title>
                      </v-list-item-content>
                  </v-list-item>
              </v-list>
          </v-card-text>
      </v-card>
  </v-menu>-->
</template>

<script>
export default {
  props: ['list', 'selected', 'title', 'value', 'text', 'block'],
  name: 'SelectBox',
  data() {
    return {
      model: ''
    }
  },
  watch: {
    selected(newVal) {
      this.model = newVal
    }
  },
  methods: {
    changeSelect() {
      this.$emit('update:selected', this.model)
      this.$emit('change')
    }
  },
  created() {
    this.model = this.selected
  }
}
</script>
