<template>
    <v-row>
        <v-col cols="6">
            <v-label>메뉴권한 그룹 ID</v-label>
            <v-text-field v-model="formData.menuAuthGroupId" label="" disabled class="pt-0"></v-text-field>
        </v-col>
        <v-col cols="6">
            <v-label>메뉴권한 그룹 이름</v-label>
            <v-text-field v-model="formData.menuAuthGroupName" :rules="emptyRules" label="" class="pt-0"></v-text-field>
        </v-col>
        <v-col class="py-0">
            <v-checkbox class="mt-0" v-model="formData.useYn" label="사용여부" hide-details true-value="Y" false-value="N"></v-checkbox>
        </v-col>
    </v-row>
</template>

<script>
export default {
  props: { formData: Object },
  name: 'adminMenuAuthGroupForm'
}
</script>
