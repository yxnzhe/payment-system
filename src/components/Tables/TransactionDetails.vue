<template>
  <div>
    <md-table>
      <md-table-row>
        <md-table-head>No</md-table-head>
        <md-table-head>Merchant Name</md-table-head>
        <md-table-head>Amount</md-table-head>
        <md-table-head>Date</md-table-head>
      </md-table-row>
      <md-table-row
        v-for="(details, index) in data"
        :key="details.id"
        slot="md-table-row"
      >
        <md-table-cell>{{ index + 1 }}</md-table-cell>
        <md-table-cell>{{ details.merchant }}</md-table-cell>
        <md-table-cell
          >RM {{ parseFloat(details.amount).toFixed(2) }}</md-table-cell
        >
        <md-table-cell>{{ details.transaction_date }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
export default {
  name: "TransactionDetails",
  props: {
    data: Array,
  },
};
</script>
