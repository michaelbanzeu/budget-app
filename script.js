// Select elements
const balanceElt = document.querySelector(".balance .value");
const incomeTotalElt = document.querySelector(".income-total");
const outcomeTotalElt = document.querySelector(".outcome-total");
const incomeElt = document.querySelector("#income");
const expenseElt = document.querySelector("#expense");
const allElt = document.querySelector("#all");
const incomeListElt = document.querySelector("#income .list");
const expenseListElt = document.querySelector("#expense .list");
const allListElt = document.querySelector("#all .list");

// Select the toggle buttons
const expenseBtn = document.querySelector(".tab1");
const incomeBtn = document.querySelector(".tab2");
const allBtn = document.querySelector(".tab3");

// Select the inputs & the button for adding an Expense
const expenseTitle = document.querySelector("#expense-title");
const expenseAmount = document.querySelector("#expense-amount");
const addExpense = document.querySelector(".add-expense");

// Select the inputs & the button for adding an Income
const incomeTitle = document.querySelector("#income-title");
const incomeAmount = document.querySelector("#income-amount");
const addIncome = document.querySelector(".add-income");

// Variables
var ENTRY_LIST;
var balance = 0, income = 0, outcome = 0;

const DELETE = "delete", EDIT = "edit";


// Check if there are saved data on the local storage
ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUI();

// Event listeners
expenseBtn.addEventListener('click', function () {
    show(expenseElt);
    hide([incomeElt, allElt]);
    activate(expenseBtn);
    inactivate([incomeBtn, allBtn]);
})

incomeBtn.addEventListener('click', function () {
    show(incomeElt);
    hide([expenseElt, allElt]);
    activate(incomeBtn);
    inactivate([expenseBtn, allBtn]);
})

allBtn.addEventListener('click', function () {
    show(allElt);
    hide([incomeElt, expenseElt]);
    activate(allBtn);
    inactivate([incomeBtn, expenseBtn]);
})

addExpense.addEventListener('click', function () {
    // Verifying if the inputs are empty or not. While not, saving it to the ENTRY_LIST
    if (!expenseTitle.value || !expenseAmount.value) {
        return;
    } else {
        let expense = {
            type: "expense",
            title: expenseTitle.value,
            amount: parseFloat(expenseAmount.value)
        }
        ENTRY_LIST.push(expense);
        updateUI();
        clearInputs([expenseTitle, expenseAmount]);
    }
})

addIncome.addEventListener('click', function () {
    // Verifying if the inputs are empty or not. While not, saving it to the ENTRY_LIST
    if (!incomeTitle.value || !incomeAmount.value) {
        return;
    } else {
        let income = {
            type: "income",
            title: incomeTitle.value,
            amount: parseFloat(incomeAmount.value)
        }
        ENTRY_LIST.push(income);
        updateUI();
        clearInputs([incomeTitle, incomeAmount]);
    }
})

incomeListElt.addEventListener('click', deleteOrEdit);
expenseListElt.addEventListener('click', deleteOrEdit);
allListElt.addEventListener('click', deleteOrEdit);

// Functions
function deleteOrEdit(event) {
    const targetBtn = event.target;
    const entry = targetBtn.parentNode;
    console.log(entry);

    if (targetBtn.id == DELETE) {
        deleteEntry(entry);
    } else if (targetBtn.id == EDIT) {
        editEntry(entry);
    }
}

function deleteEntry(entry) {
    ENTRY_LIST.splice(entry.id, 1)
    updateUI();
}

function editEntry(entry) {
    let ENTRY = ENTRY_LIST[entry.id];

    if (ENTRY.type == "income") {
        incomeAmount.value = ENTRY.amount;
        incomeTitle.value = ENTRY.title;
    } else if (ENTRY.type == "expense") {
        expenseAmount.value = ENTRY.amount;
        expenseTitle.value = ENTRY.title;
    }
    deleteEntry(entry);
}

function show(element) {
    element.classList.remove("hide");
}

function hide(elements) {
    elements.forEach(element => {
        element.classList.add("hide");
    });
}

function activate(element) {
    element.classList.add("active");
}

function inactivate(elements) {
    elements.forEach(element => {
        element.classList.remove("active");
    });
}

function updateUI() {
    // Update the different amounts
    income = calculateTotal("income", ENTRY_LIST);
    outcome = calculateTotal("expense", ENTRY_LIST);
    balance = Math.abs(calculateBalance(income, outcome));

    // Determine the sign of the balance
    let sign = (income >= outcome) ? "$" : "-$";

    balanceElt.innerHTML = `<small>${sign}</small>${balance}`;
    outcomeTotalElt.innerHTML = `<small>$</small>${outcome}`;
    incomeTotalElt.innerHTML = `<small>$</small>${income}`;


    // Update the UI
    clearElements([expenseListElt, incomeListElt, allListElt]);

    ENTRY_LIST.forEach((entry, index) => {
        if (entry.type == "expense") {
            showEntry(expenseListElt, entry.type, entry.title, entry.amount, index);
        } else if (entry.type == "income") {
            showEntry(incomeListElt, entry.type, entry.title, entry.amount, index);
        }
        showEntry(allListElt, entry.type, entry.title, entry.amount, index);
    });

    updateChart(income, outcome);

    // Storing data to the local storage
    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

function showEntry(list, type, title, amount, id) {
    const entry = `<li id="${id}" class="${type}">
                        <div class="entry">${title}: $${amount}</div>
                        <div id="edit"></div>
                        <div id="delete"></div>
                    </li>`;
    const position = "afterbegin";

    list.insertAdjacentHTML(position, entry);
};

function clearElements(elements) {
    elements.forEach(element => {
        element.innerHTML = "";
    });
}

function clearInputs(inputs) {
    inputs.forEach(input => {
        input.value = "";
    });
}

function calculateBalance(income, outcome) {
    return income - outcome;
}

function calculateTotal(type, list) {
    let sum = 0;

    list.forEach(entry => {
        if (entry.type == type) {
            sum += entry.amount;
        }
    })
    return sum;
}