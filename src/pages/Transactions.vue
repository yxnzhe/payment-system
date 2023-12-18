<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item">
        <div
          class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
        >
          <md-button @click="$router.go(-1)">Back</md-button>
          <md-card v-if="transactions.length > 0">
            <md-card-header data-background-color="orange">
              <div class="md-layout">
                <div class="md-layout-item">
                  <h4 class="title">{{ transactions[0].debtor.users.name }}</h4>
                </div>
                <div class="md-layout-item" style="text-align: right">
                  <h4>
                    <small>RM </small>{{ parseFloat(subtotal).toFixed(2) }}
                  </h4>
                </div>
              </div>
            </md-card-header>
            <md-card-content>
              <TransactionDetails :data="transactions"></TransactionDetails>
            </md-card-content>
          </md-card>
          <div v-else>Loading transactions...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TransactionDetails from "../components/Tables/TransactionDetails";
import { supabase } from "../../supabaseClient";

export default {
  name: "Transactions",
  data() {
    return {
      transactions: [],
      subtotal: 0,
      loading: true,
      debtorId: this.$route.params.debtorId,
    };
  },
  components: {
    TransactionDetails,
  },
  beforeMount() {
    this.getTransactionsDetails();
  },
  methods: {
    async getTransactionsDetails() {
      const { data, error } = await supabase
        .from("transactions")
        .select("*, debtor(users(name))")
        .eq("debtor_id", this.debtorId)
        .order("transaction_date", { ascending: false });
      if (error) {
        console.log(error);
      } else {
        this.transactions = data;
        for (let i = 0; i < this.transactions.length; i++) {
          this.subtotal += parseFloat(this.transactions[i].amount);
        }
        this.loading = false;
      }
    },
  },
};
</script>
