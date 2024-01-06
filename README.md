# Payment Record System

## Installation Guide
**Prerequisite**
1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.
2. [Git](https://git-scm.com/downloads) installed (optional)
### Windows, MAC and UNIX System
1. Clone this repository by running `git clone https://github.com/yxnzhe/payment-system.git`, or
Download as ZIP file and extract the files
2. Edit the file by searching for `TODO`. There should be a total of 10 TODO items in the following file:
   1. supabaseClient.js
   2. Dashboard.vue
   3. Transactions.vue
3. Add the necessary API key and information and specified.
4. For the `// TODO: Add API Key`, kindly request from the owner of this project.
5. Run the following command `docker build -t payment-system .`
6. Wait for the process to run.
7. When the process completed, run the following command `docker run -d -p 1000:8080 payment-system`.
8. Head to `localhost:1000` and you should be able to start using the system.
