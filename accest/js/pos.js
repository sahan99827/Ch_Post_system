// Check authentication
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const cashiar = document.getElementById("cashiar");
if (cashiar && currentUser) {
  cashiar.innerHTML = currentUser.fullname;
}

if (!currentUser) {
  window.location.href = "index.html";
}

// Initialize cart
let cart = JSON.parse(localStorage.getItem("currentCart")) || [];

// Load products
let products = JSON.parse(localStorage.getItem("products")) || [];

// Add some default products if empty
document.addEventListener("DOMContentLoaded", () => {
  let products = JSON.parse(localStorage.getItem("products")) || [];

  if (products.length === 0) {
    products = [
      {
        id: 1,
        name: "Basic T-Shirt",
        type: "tops",
        price: 1500,
        image: "accest/img/cl1.png",
        stock: 50,
      },
      {
        id: 2,
        name: "Polo Shirt",
        type: "tops",
        price: 2500,
        image: "accest/img/cl2.png",
        stock: 25,
      },
      {
        id: 3,
        name: "Jeans",
        type: "bottoms",
        price: 3500,
        image: "accest/img/cl3.png",
        stock: 10,
      },
      {
        id: 4,
        name: "Shorts",
        type: "bottoms",
        price: 2000,
        image: "accest/img/cl4.png",
        stock: 50,
      },
      {
        id: 5,
        name: "Summer Dress",
        type: "dresses",
        price: 4500,
        image: "accest/img/cl5.png",
        stock: 23,
      },
      {
        id: 6,
        name: "Sunglasses",
        type: "accessories",
        price: 1200,
        image: "accest/img/cl6.png",
        stock: 50,
      },
      {
        id: 7,
        name: "Belt",
        type: "accessories",
        price: 800,
        image: "accest/img/cl7.png",
        stock: 13,
      },
      {
        id: 8,
        name: "Hat",
        type: "accessories",
        price: 1000,
        image: "accest/img/cl8.png",
        stock: 50,
      },
    ];

    localStorage.setItem("products", JSON.stringify(products));
    console.log("Products loaded into localStorage");
  }

  // Initialize display
  loadStoredStock();
  displayProducts(currentCategory, "");
  updateCart();
});

let currentCategory = "all";

// Display products
function displayProducts(category = "all", searchTerm = "") {
  const productsGrid = document.getElementById("productsGrid");
  if (!productsGrid) return;
  
  productsGrid.innerHTML = "";

  let filteredProducts = products;

  // Filter by category
  if (category !== "all") {
    filteredProducts = filteredProducts.filter((p) => p.type === category);
  }

  // Filter by search
  if (searchTerm) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML =
      '<div class="col-12 text-center text-muted py-5"><i class="fas fa-box-open fa-3x mb-3"></i><p>No products found</p></div>';
    return;
  }

  filteredProducts.forEach((product) => {
    const productCard = `
      <div class="product-card" onclick="addToCart(${product.id})">
        <span class="badge bg-dark stock-badge">Stock: ${product.stock}</span>  
        <img src="${product.image}" alt="${product.name}">
        <h6>${product.name}</h6>
        <p class="price">${Number(product.price).toFixed(2)} LKR</p>
      </div>
    `;
    productsGrid.innerHTML += productCard;
  });
}

function loadStoredStock() {
  const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
  products = storedProducts;
}

// Add to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  // Check stock availability
  const cartItem = cart.find((item) => item.id === productId);
  const currentCartQty = cartItem ? cartItem.quantity : 0;

  if (currentCartQty >= product.stock) {
    Swal.fire({
      icon: "error",
      title: "Out of Stock",
      text: `Only ${product.stock} items available in stock`,
      confirmButtonColor: "#8b5cf6",
    });
    return;
  }

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  localStorage.setItem("currentCart", JSON.stringify(cart));
  updateCart();

  // Show success toast
  Swal.fire({
    icon: "success",
    title: "Added to Cart",
    text: `${product.name} added successfully`,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
  });
}

// Update cart display
function updateCart() {
  const orderItems = document.getElementById("orderItems");
  const badge = document.querySelector(".order-header .badge");
  const itemCountBadge = document.querySelector("#currentOrderBtn .badge");

  if (!orderItems) return;

  if (cart.length === 0) {
    orderItems.innerHTML = `
      <div class="text-center text-muted py-5">
        <i class="fas fa-shopping-cart fa-3x mb-3"></i>
        <p>No items in cart</p>
      </div>
    `;
    if (badge) badge.textContent = "0 items";
    if (itemCountBadge) itemCountBadge.textContent = "0 items";
    updateTotals();
    return;
  }

  orderItems.innerHTML = "";

  cart.forEach((item) => {
    const orderItem = `
      <div class="order-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="order-item-details">
          <h6>${item.name}</h6>
          <p>${item.price.toFixed(2)} LKR x ${item.quantity}</p>
        </div>
        <div class="order-item-actions">
          <div class="qty-btn" onclick="updateQuantity(${item.id}, -1)">
            <i class="fas fa-minus"></i>
          </div>
          <span>${item.quantity}</span>
          <div class="qty-btn" onclick="updateQuantity(${item.id}, 1)">
            <i class="fas fa-plus"></i>
          </div>
          <i class="fas fa-trash remove-btn" onclick="removeFromCart(${item.id})"></i>
        </div>
      </div>
    `;
    orderItems.innerHTML += orderItem;
  });

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (badge) badge.textContent = `${totalItems} items`;
  if (itemCountBadge) itemCountBadge.textContent = `${totalItems} items`;

  updateTotals();
}

// Update quantity
function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (!item) return;

  const product = products.find((p) => p.id === productId);
  
  // Check stock when increasing quantity
  if (change > 0 && item.quantity >= product.stock) {
    Swal.fire({
      icon: "error",
      title: "Stock Limit Reached",
      text: `Only ${product.stock} items available`,
      confirmButtonColor: "#8b5cf6",
      timer: 2000,
    });
    return;
  }

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  localStorage.setItem("currentCart", JSON.stringify(cart));
  updateCart();
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("currentCart", JSON.stringify(cart));
  updateCart();
}

// Update totals
function updateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const subtotalEl = document.getElementById("subtotal");
  const taxEl = document.getElementById("tax");
  const totalEl = document.getElementById("total");

  if (subtotalEl) subtotalEl.textContent = `${subtotal.toFixed(2)} LKR`;
  if (taxEl) taxEl.textContent = `${tax.toFixed(2)} LKR`;
  if (totalEl) totalEl.textContent = `${total.toFixed(2)} LKR`;
}

// Clear cart
const clearCartBtn = document.getElementById("clearCart");
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", function () {
    if (cart.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Cart is Empty",
        text: "No items to clear",
        confirmButtonColor: "#8b5cf6",
      });
      return;
    }

    Swal.fire({
      title: "Clear Cart?",
      text: "Are you sure you want to remove all items?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8b5cf6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, clear it",
    }).then((result) => {
      if (result.isConfirmed) {
        cart = [];
        localStorage.setItem("currentCart", JSON.stringify(cart));
        updateCart();

        Swal.fire({
          icon: "success",
          title: "Cart Cleared",
          text: "All items removed from cart",
          confirmButtonColor: "#8b5cf6",
          timer: 1500,
        });
      }
    });
  });
}


// Proceed to payment - SINGLE EVENT LISTENER
const proceedPaymentBtn = document.getElementById("proceedPayment");

if (proceedPaymentBtn) {

  proceedPaymentBtn.addEventListener("click", function () {
    if (cart.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Cart is Empty",
        text: "Please add items to cart first",
        confirmButtonColor: "#8b5cf6",
      });
      return;
    }


    // Check stock availability before proceeding
    let stockError = false;
    let errorMessage = "";

    cart.forEach((cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);
      if (!product || product.stock < cartItem.quantity) {
        stockError = true;
        errorMessage += `${cartItem.name}: Only ${product ? product.stock : 0} available\n`;
      }
    });

    if (stockError) {
      Swal.fire({
        icon: "error",
        title: "Insufficient Stock",
        text: errorMessage,
        confirmButtonColor: "#8b5cf6",
      });
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    Swal.fire({
      title: "Complete Payment",
      html: `
        <div class="text-start">
          <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)} LKR</p>
          <p><strong>Tax (8%):</strong> ${tax.toFixed(2)} LKR</p>
          <p><strong>Total Amount:</strong> ${total.toFixed(2)} LKR</p>
          <p><strong>Items:</strong> ${cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
        </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#8b5cf6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: '<i class="fas fa-print me-2"></i>Complete & Print Bill',
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          // Update product stock
          let storedProducts = JSON.parse(localStorage.getItem("products")) || [];
          
          cart.forEach((cartItem) => {
            const product = storedProducts.find((p) => p.id === cartItem.id);
            if (product) {
              product.stock -= cartItem.quantity;
              if (product.stock < 0) product.stock = 0;
            }
          });
          
          localStorage.setItem("products", JSON.stringify(storedProducts));

          // Save order
          const orders = JSON.parse(localStorage.getItem("orders")) || [];
          const customerNumber =JSON.parse(localStorage.getItem("customerNumber"));
          const newOrder = {
            id: Date.now(),
            items: JSON.parse(JSON.stringify(cart)), 
            subtotal: subtotal,
            tax: tax,
            total: total,
            date: new Date().toISOString(),
            cashier: currentUser.fullname || currentUser.username,
            customerNumber:customerNumber,
          };
          
          orders.push(newOrder);
          localStorage.setItem("orders", JSON.stringify(orders));
          localStorage.removeItem(customerNumber);
          // Store invoice data for printing
          localStorage.setItem("currentInvoice", JSON.stringify(newOrder));

          // Clear cart
          cart = [];
          localStorage.setItem("currentCart", JSON.stringify(cart));

          // Show success message
          Swal.fire({
            icon: "success",
            title: "Payment Complete!",
            text: "Redirecting to invoice...",
            confirmButtonColor: "#8b5cf6",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            // Redirect to invoice page
            window.location.href = "bill.html";
          });
          
        } catch (error) {
          console.error("Payment error:", error);
          Swal.fire({
            icon: "error",
            title: "Payment Failed",
            text: "There was an error processing your payment. Please try again.",
            confirmButtonColor: "#8b5cf6",
          });
        }
      }
    });
  });
}

// Category tabs
document.querySelectorAll(".category-tab").forEach((tab) => {
  tab.addEventListener("click", function () {
    document.querySelectorAll(".category-tab").forEach((t) => t.classList.remove("active"));
    this.classList.add("active");
    currentCategory = this.dataset.category;
    const searchInput = document.getElementById("searchProduct");
    displayProducts(currentCategory, searchInput ? searchInput.value : "");
  });
});

// Sidebar icons
document.querySelectorAll(".sidebar-icon[data-view]").forEach((icon) => {
  icon.addEventListener("click", function () {
    document.querySelectorAll(".sidebar-icon[data-view]").forEach((i) => i.classList.remove("active"));
    this.classList.add("active");
    const view = this.dataset.view;
    currentCategory = view;

    document.querySelectorAll(".category-tab").forEach((t) => t.classList.remove("active"));
    const categoryTab = document.querySelector(`.category-tab[data-category="${view}"]`);
    if (categoryTab) categoryTab.classList.add("active");

    const searchInput = document.getElementById("searchProduct");
    displayProducts(view, searchInput ? searchInput.value : "");
  });
});

// Search
const searchInput = document.getElementById("searchProduct");
if (searchInput) {
  searchInput.addEventListener("input", function () {
    displayProducts(currentCategory, this.value);
  });
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
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
}


const customernumberBtn = document.getElementById("customernumberBtn");
const myModal = new bootstrap.Modal(document.getElementById("customerModal"));
const customerModal = document.getElementById("customerModal");

// OPEN MODAL when button clicked
customernumberBtn.addEventListener("click", () => {
    myModal.show();
});

// Form submit
const customerNumberForm = document.getElementById("customerNumberForm");

if (customerNumberForm) {
    customerNumberForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const customerNumber = document.getElementById("customerNumber").value;
        localStorage.setItem("customerNumber", JSON.stringify(customerNumber));

        document.activeElement.blur();
        myModal.hide();
    });
}


customerModal.addEventListener("hidden.bs.modal", () => {
    customerModal.setAttribute("inert", "");
});

customerModal.addEventListener("show.bs.modal", () => {
    customerModal.removeAttribute("inert");
});
