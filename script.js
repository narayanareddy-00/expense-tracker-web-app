
const form = document.getElementById("transaction-form");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");

const balanceDisplay = document.getElementById("balance");
const incomeDisplay = document.getElementById("income");
const expenseDisplay = document.getElementById("expense");
const transactionList = document.getElementById("transaction-list");

// Load saved transactions
let transactions = JSON.parse(
    localStorage.getItem("transactions") || "[]"
);

// Format currency
function formatMoney(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
    }).format(amount);
}

// Update dashboard
function updateDashboard() {
    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {
        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expense += transaction.amount;
        }
    });

    const balance = income - expense;

    balanceDisplay.textContent = formatMoney(balance);
    incomeDisplay.textContent = formatMoney(income);
    expenseDisplay.textContent = formatMoney(expense);

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    displayTransactions();
}

// Display transactions
function displayTransactions() {
    transactionList.innerHTML = "";

    if (transactions.length === 0) {
        transactionList.innerHTML =
            '<li class="empty">No transactions yet.</li>';
        return;
    }

    transactions.forEach(transaction => {
        const li = document.createElement("li");

        const info = document.createElement("div");
        info.className = "transaction-info";

        const name = document.createElement("strong");
        name.textContent = transaction.title;

        const date = document.createElement("small");
        date.textContent = transaction.date;

        info.append(name, date);

        const amount = document.createElement("strong");
        amount.className = transaction.type === "income"
            ? "positive" : "negative";

        amount.textContent =
            (transaction.type === "income" ? "+ " : "- ") +
            formatMoney(transaction.amount);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", () => {
            deleteTransaction(transaction.id);
        });

        li.append(info, amount, deleteBtn);
        transactionList.appendChild(li);
    });
}

// Add transaction
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;

    if (!title || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter valid transaction details.");
        return;
    }

    const transaction = {
        id: crypto.randomUUID(),
        title: title,
        amount: amount,
        type: type,
        date: new Date().toLocaleDateString("en-IN")
    };

    transactions.push(transaction);

    updateDashboard();

    form.reset();
});

// Delete transaction
function deleteTransaction(id) {
    transactions = transactions.filter(
        transaction => transaction.id !== id
    );

    updateDashboard();
}

// Initial display
updateDashboard();
