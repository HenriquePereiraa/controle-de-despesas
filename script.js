const transactionsUl = document.querySelector("#transactions");
const balanceDisplay = document.querySelector("#balance");
const incomeDisplay = document.querySelector("#money-plus");
const expenseDisplay = document.querySelector("#money-minus");
const form = document.querySelector("#form");
const inputTransactionName = document.querySelector("#text");
const inputTransactionAmount = document.querySelector("#amount");

function generateID() {
  let code = "#";

  for (let i = 0; i < 4; i++) {
    let value = Math.floor(Math.random() * 10);
    code += value.toString();
  }
  return code;
}

function formatValueToBRL(value) {
  const valueFormatted = new Intl.NumberFormat("pt-br", {
    style: "currency",
    currency: "BRL",
  }).format(value);

  return valueFormatted;
}

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);

  init();
  updateLocalStorage();
}

const addTransactionIntoDOM = (transaction) => {
  const operator = transaction.amount < 0 ? "-" : "+";
  const CSSCLASS = transaction.amount < 0 ? "minus" : "plus";
  const amountWithoutOperator = Math.abs(transaction.amount);
  const li = document.createElement("li");

  li.classList.add(CSSCLASS);
  li.innerHTML = `
    ${transaction.name} <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction('${transaction.id}')">x</button>
  `;

  transactionsUl.append(li);
};

function getExpenses(transactionsAmount) {
  const expense = transactionsAmount
    .filter((values) => values < 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2);

  return expense;
}

function getIncome(transactionsAmount) {
  const income = transactionsAmount
    .filter((value) => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2);

  return income;
}

function getTotal(transactionsAmount) {
  const total = transactionsAmount
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2);

  return total;
}

const updateBalanceValues = () => {
  const transactionsAmount = transactions.map(
    (transaction) => transaction.amount
  );
  const total = getTotal(transactionsAmount);

  const income = getIncome(transactionsAmount);

  const expense = getExpenses(transactionsAmount);

  balanceDisplay.textContent = formatValueToBRL(total);

  incomeDisplay.textContent = formatValueToBRL(income);

  expenseDisplay.textContent = formatValueToBRL(expense);
};

// esta function ira executar o preenchimento das informações do estado da aplicação quando a página for carregada
const init = () => {
  transactionsUl.innerHTML = "";

  transactions.forEach(addTransactionIntoDOM);
  updateBalanceValues();
};

init();

function addToTransactionsArray(transactionName, transactionsAmount) {
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount: Number(transactionsAmount),
  });
}

function clearInput() {
  inputTransactionName.value = "";
  inputTransactionAmount.value = "";
}

function handleFormSubmit(event) {
  event.preventDefault();

  const transactionName = inputTransactionName.value.trim();
  const transactionsAmount = inputTransactionAmount.value.trim();
  const isSomeInputEmpty = transactionName === "" || transactionsAmount === "";

  if (isSomeInputEmpty) {
    alert("Por favor preencha todos os campos");
    return;
  }

  addToTransactionsArray(transactionName, transactionsAmount);
  init();
  updateLocalStorage();
  clearInput();
}

form.addEventListener("submit", handleFormSubmit);
