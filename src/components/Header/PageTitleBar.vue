<template>
  <v-row align="center">
    <v-col>
      <span class="fw-bold ml-3"><v-icon left>home</v-icon> {{pageTitle}}</span>
        <span class="hidden-sm-and-down ml-10 border-left">
          <span class="ml-4" v-for="(breadcrumbs, index) of pageBreadcrumb" :key="index">
            <a href="javascript:void(0)">
              {{breadcrumbs}}
              <span class="ml-4" v-if="pageBreadcrumb.length !== (index+1)">/</span>
            </a>
          </span>
        </span>
    </v-col>
  </v-row>
  <!-- <v-breadcrumbs class="pa-6 pr-4" :items="breadcrumbItems" v-if="breadcrumbItems != null">
    <template slot="item" slot-scope="props">
      <h2 class="text-capitalize mb-0">{{props.item.title}}</h2>
      <div class="spacer"></div>
      <v-breadcrumbs-item>
        <a href="javascript:void(0)">{{props.item.breadcrumb[0].breadcrumbInactive}}</a>
      </v-breadcrumbs-item>
      <v-breadcrumbs-item disabled>{{props.item.breadcrumb[1].breadcrumbActive}} / {{projectId}}</v-breadcrumbs-item>
    </template>
  </v-breadcrumbs> -->
</template>

<script>
export default {
  computed: {
    pageBreadcrumb () {
      const pageBreadcrumb = []
      for (const breadcrumb of this.$breadcrumbs) {
        if (breadcrumb.meta) {
          if (breadcrumb.meta.breadcrumb) {
            pageBreadcrumb.push(breadcrumb.meta.breadcrumb)
          }
        }
      }
      return pageBreadcrumb
    },
    pageTitle () {
      let pageTitle = ''
      for (const breadcrumb of this.$breadcrumbs) {
        if (breadcrumb.meta) {
          if (breadcrumb.meta && breadcrumb.meta.title) {
            pageTitle = breadcrumb.meta.title
          }
        }
      }
      return pageTitle
    }
  }
}
</script>
