import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Dashboard from "@/pages/Dashboard.vue";
import Transactions from "@/pages/Transactions.vue";
import Debtors from "@/pages/Debtors.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "debtors",
        name: "Debtors",
        component: Debtors,
      },
      {
        path: "transactions/:debtorId",
        name: "Transactions",
        component: Transactions,
      },
    ],
  },
];

export default routes;
