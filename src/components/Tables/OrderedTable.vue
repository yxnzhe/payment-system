<template>
  <div>
    <md-table :table-header-color="tableHeaderColor">
      <md-table-row>
        <md-table-head>No</md-table-head>
        <md-table-head>Name</md-table-head>
        <md-table-head>Amount</md-table-head>
        <md-table-head>Action</md-table-head>
      </md-table-row>

      <md-table-row
        v-for="(person, index) in data"
        :key="person.id"
        slot="md-table-row"
      >
        <md-table-cell>{{ index + 1 }}</md-table-cell>
        <md-table-cell v-if="person.type == 'Debtor'">{{
          person.users.name
        }}</md-table-cell>
        <md-table-cell v-if="person.type == 'Payment'">{{
          person.debtor.users.name
        }}</md-table-cell>
        <md-table-cell v-if="person.type == 'Debtor'"
          >RM {{ parseFloat(person.total).toFixed(2) }}</md-table-cell
        >
        <md-table-cell v-if="person.type == 'Payment'"
          >RM {{ parseFloat(person.total * -1).toFixed(2) }}</md-table-cell
        >
        <md-table-cell v-if="person.type == 'Debtor'"
          ><a :href="'#/transactions/' + person.id">Details</a></md-table-cell
        >
        <md-table-cell
          v-if="person.type == 'Payment' && person.payment_proof != null"
          ><a target="_blank" :href="person.payment_proof"
            >Payment Receipt</a
          ></md-table-cell
        >
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
export default {
  name: "OrderedTable",
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
    data: Array,
  },
  data() {
    return {
      selected: [],
    };
  },
};
</script>
