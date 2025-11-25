// Check authentication
const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  window.location.href = "index.html";
}

const customerForm = document.getElementById("customerForm");
if (customerForm) {
  customerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const customerName = document.getElementById("customerName").value;
    const customerTel = document.getElementById("customerTel").value;
    const customerAddress = document.getElementById("customerAddress").value;

    let customers = JSON.parse(localStorage.getItem("customers")) || [];

    const customer = {
      id: Date.now(),
      name: customerName,
      tel: customerTel,
      address: customerAddress,
      createdAt: new Date().toISOString(),
    };

    customers.push(customer);
    localStorage.setItem("customers", JSON.stringify(customers));

    Swal.fire({
      title: "Customer Added!",
      text: "The customer was successfully saved.",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      customerForm.reset();
    });

    customerForm.reset();
  });
}

// Load table
document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.getElementById("customerTableBody");
  if (tableBody) {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    tableBody.innerHTML = "";
    customers.forEach((customer) => {
      tableBody.innerHTML += `
                <tr>
                    <td>${customer.name}</td>
                    <td>${customer.address}</td>
                    <td>${customer.tel}</td>
                    <td><button   class="btn btn-dark ">Edit</button></td>
                </tr>
            `;
    });
  }

  // Buttons
  const customerAddBtn = document.getElementById("customerAddbtn");
  if (customerAddBtn) {
    customerAddBtn.addEventListener("click", () => {
      window.location.href = "customer-add.html";
    });
  }

  const customerViewBtn = document.getElementById("customerViewbtn");
  if (customerViewBtn) {
    customerViewBtn.addEventListener("click", () => {
      window.location.href = "customer-view.html";
    });
  }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", function () {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to logout?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#8b5cf6",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, logout",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("currentCart");
      window.location.href = "index.html";
    }
  });
});
