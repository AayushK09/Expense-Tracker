document
  .getElementById("expense-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    if (editingRow) {
      saveEdit();
    } else {
      addExpense();
    }
  });

document
  .getElementById("filter-input")
  .addEventListener("input", filterExpenses);

const exchangeRate = 73; // 1 USD = 73 INR (as an example)
let totalAmount = 0;
let editingRow = null;

document
  .querySelectorAll("#expense-name, #expense-amount, #expense-category")
  .forEach((input) => {
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        if (editingRow) {
          saveEdit();
        } else {
          document
            .getElementById("expense-form")
            .dispatchEvent(new Event("submit"));
        }
      }
    });
  });

function addExpense() {
  const name = document.getElementById("expense-name").value;
  const amountINR = parseFloat(document.getElementById("expense-amount").value);
  const category = document.getElementById("expense-category").value;

  if (name && !isNaN(amountINR) && category) {
    const table = document
      .getElementById("expense-table")
      .getElementsByTagName("tbody")[0];
    const newRow = table.insertRow();

    const nameCell = newRow.insertCell(0);
    const categoryCell = newRow.insertCell(1);
    const amountCell = newRow.insertCell(2);
    const actionCell = newRow.insertCell(3);

    nameCell.textContent = name;
    categoryCell.textContent = category;
    amountCell.textContent = `₹${amountINR.toFixed(2)}`;
    actionCell.innerHTML =
      '<button onclick="editExpense(this)">Edit</button> <button onclick="removeExpense(this)">Remove</button>';

    totalAmount += amountINR;
    updateTotal();

    document.getElementById("expense-form").reset();
  }
}

function removeExpense(button) {
  const row = button.parentNode.parentNode;
  const amount = parseFloat(row.cells[2].textContent.substring(1));
  totalAmount -= amount;
  row.remove();
  updateTotal();
}

function editExpense(button) {
  const row = button.parentNode.parentNode;
  editingRow = row;

  document.getElementById("expense-name").value = row.cells[0].textContent;
  document.getElementById("expense-category").value = row.cells[1].textContent;
  document.getElementById("expense-amount").value = parseFloat(
    row.cells[2].textContent.substring(1)
  );

  row.classList.add("editable");
}

function saveEdit() {
  if (editingRow) {
    const name = document.getElementById("expense-name").value;
    const amountINR = parseFloat(
      document.getElementById("expense-amount").value
    );
    const category = document.getElementById("expense-category").value;

    if (name && !isNaN(amountINR) && category) {
      const amountDifference =
        amountINR - parseFloat(editingRow.cells[2].textContent.substring(1));

      editingRow.cells[0].textContent = name;
      editingRow.cells[1].textContent = category;
      editingRow.cells[2].textContent = `₹${amountINR.toFixed(2)}`;
      totalAmount += amountDifference;
      updateTotal();

      editingRow.classList.remove("editable");
      editingRow = null;

      document.getElementById("expense-form").reset();
    }
  }
}

function updateTotal() {
  document.getElementById("total-amount").textContent = totalAmount.toFixed(2);
}

function filterExpenses() {
  const filter = document.getElementById("filter-input").value.toLowerCase();
  const rows = document
    .getElementById("expense-table")
    .getElementsByTagName("tbody")[0]
    .getElementsByTagName("tr");

  Array.from(rows).forEach((row) => {
    const name = row.cells[0].textContent.toLowerCase();
    if (name.includes(filter)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

function printContent() {
  window.print();
}

function downloadPDF() {
  // Get the container element
  const container = document.getElementById("container");

  // Clone the container element
  const clonedContainer = container.cloneNode(true);

  // Hide elements that should not appear in the PDF in the cloned container
  const elementsToHide = clonedContainer.querySelectorAll(".hide-in-pdf");
  elementsToHide.forEach(function (element) {
    element.remove();
  });

  // Generate and save the PDF from the cloned container
  const opt = {
    filename: "Expense_Report.pdf",
  };

  html2pdf().from(clonedContainer).set(opt).save();
}
