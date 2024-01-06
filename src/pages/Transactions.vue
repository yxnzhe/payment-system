<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item">
        <div
          class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
        >
          <md-button @click="$router.go(-1)">Back</md-button>
          <md-button @click="sendEmail">Send Report</md-button>
          <md-button v-if="subtotal <= 0" @click="clearTransactions"
            >Clear Transactions</md-button
          >
          <md-card id="transaction-report" v-if="transactions.length > 0">
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
import html2pdf from "html2pdf.js";
import axios from "axios";

export default {
  name: "Transactions",
  data() {
    return {
      transactions: [],
      subtotal: 0,
      loading: true,
      debtorId: this.$route.params.debtorId,
      debtorInfo: null,
      apiKey: // TODO: Add API Key
        "",
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
        .select("*, debtor(users(name, email))")
        .eq("debtor_id", this.debtorId)
        .eq("active", true)
        .order("transaction_date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) {
        alert(error.message);
      } else {
        this.transactions = data;
        this.debtorInfo = data[0].debtor.users;
        for (let i = 0; i < this.transactions.length; i++) {
          this.subtotal += parseFloat(this.transactions[i].amount);
        }
        this.loading = false;
      }
    },

    async sendEmail() {
      const element = document.getElementById("transaction-report");
      const opt = {
        margin: 5,
        filename: "Transaction Report_" + this.debtorId + ".pdf",
      };
      try {
        const pdfBlob = await html2pdf().from(element).set(opt).outputPdf();
        const pdfData = btoa(pdfBlob);

        await axios({
          method: "POST",
          url: "https://api.sendinblue.com/v3/smtp/email",
          headers: {
            "api-key": this.apiKey,
            "content-type": "application/json",
          },
          data: {
            sender: {
              name: "", // TODO: Add Sender Name
              email: "noreply@payment-system.com",
            },
            to: [
              {
                name: this.debtorInfo.name,
                email: this.debtorInfo.email,
              },
            ],
            subject: "Debtor Report - " + this.debtorInfo.name,
            htmlContent: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Debtor Report Email</title>
                </head>
                <body style="font-family: Arial, sans-serif;">

                  <p>Dear ${this.debtorInfo.name},</p>
                  
                  <p>I hope this email finds you well. As part of our commitment to transparency and keeping you informed, we are pleased to provide you with a detailed report of your recent transactions as of ${new Date().toLocaleDateString()}. This report includes a breakdown of all transactions conducted on your account, along with corresponding amounts.</p>

                  <p>The total amount due is <strong>RM ${parseFloat(
                    this.subtotal
                  ).toFixed(2)}</strong>.</p>
                  
                  <p>Please take a moment to review the attached PDF, which outlines the specifics of each transaction. If you have any questions or require further clarification, do not hesitate to reach out to me on WhatsApp.</p>

                  <p>Your prompt attention to this matter is greatly appreciated. We are here to assist you with any concerns you may have.</p>

                  <p>
                    Best Regards, <br>
                    TODO: Add Sender Name
                  </p>

                </body>
              </html>
            `,
            attachment: [
              {
                content: pdfData,
                name: "Transaction Report_" + this.debtorId + ".pdf",
                type: "application/pdf",
              },
            ],
          },
        });
        alert("Email sent successfully");
      } catch (error) {
        alert(error.message);
      }
    },

    async clearTransactions() {
      const { data, error } = await supabase
        .from("transactions")
        .update({ active: false })
        .eq("debtor_id", this.debtorId)
        .neq("merchant", "Setup Debtor");
      if (error) {
        alert(error.message);
      } else {
        this.$notify({
          message: "Transactions deleted successfully",
          type: "success",
          horizontalAlign: "right",
          verticalAlign: "top",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    },
  },
};
</script>
