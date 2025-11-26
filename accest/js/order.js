const loggedUser = localStorage.getItem("currentUser");

if (!loggedUser) {
  window.location.href = "index.html";
}

let users = JSON.parse(localStorage.getItem("users")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

function getCashierName(cashierUsername) {
    const foundUser = users.find(u => u.username === cashierUsername);
    return foundUser ? foundUser.fullname : cashierUsername;
}

document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.getElementById("orderInfo");
  if (tableBody) {
    tableBody.innerHTML = "";
    orders.forEach((orders) => {
          const userName = getCashierName(orders.cashier);
      tableBody.innerHTML += `
                <tr>
                    <td>${userName}</td>
                    <td>${orders.customerNumber}</td>
                    <td>${Math.round(orders.total)}</td>
                     <td>${new Date(orders.date).toLocaleDateString("en-CA")}</td>
                    <td><button   class="btn btn-dark " onclick="viewItem(${
                      orders.id
                    })">View Order Item</button></td>
                </tr>
            `;
    });
  }
});
function viewItem(orderId) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    alert("Order not found!");
    return;
  }

  const tbody = document.getElementById("orderItemsBody");
  tbody.innerHTML = "";

  order.items.forEach(item => {
    tbody.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.price}</td>
        <td>${item.quantity * item.price}</td>
      </tr>
    `;
  });

  const modal = new bootstrap.Modal(document.getElementById('orderItemModal'));
  modal.show();
}
