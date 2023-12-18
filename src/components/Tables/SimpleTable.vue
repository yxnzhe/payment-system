<template>
  <div>
    <md-table :table-header-color="tableHeaderColor">
      <md-table-row>
        <md-table-head>No</md-table-head>
        <md-table-head>Name</md-table-head>
        <!-- <md-table-head>Email</md-table-head> -->
      </md-table-row>

      <md-table-row
        v-for="(person, index) in data"
        :key="person.id"
        slot="md-table-row"
      >
        <md-table-cell>{{ index + 1 }}</md-table-cell>
        <md-table-cell>{{ person.users.name }}</md-table-cell>
        <!-- <md-table-cell>{{ person.users.email }}</md-table-cell> -->
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
export default {
  name: "simple-table",
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
    data: Array,
  },
};
</script>
