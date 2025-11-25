// Check authentication
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
cashiar.innerHTML = currentUser.fullname;
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
});

let currentCategory = "all";

// Display products
function displayProducts(category = "all", searchTerm = "") {
  const productsGrid = document.getElementById("productsGrid");
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
                <span class="badge bg-dark stock-badge">Stock: ${
                  product.stock
                }</span>  
                <img src="${product.image}" alt="${product.name}">
                <h6>${product.name}</h6>
                <p class="price">${product.price.toFixed(2)} LKR</p>
            </div>
        `;
    productsGrid.innerHTML += productCard;
  });
}

window.addEventListener("DOMContentLoaded", () => {
  loadStoredStock();
  displayProducts(currentCategory, "");
});

document
  .getElementById("proceedPayment")
  .addEventListener("click", completePayment);

// Add to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

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

function completePayment() {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let cart = JSON.parse(localStorage.getItem("currentCart")) || [];

  if (cart.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Cart is empty",
      text: "Add items first.",
    });
    return;
  }

  cart.forEach((cartItem) => {
    const product = products.find((p) => p.id === cartItem.id);
    if (!product) return;

    product.stock -= cartItem.quantity;
    if (product.stock < 0) product.stock = 0;
  });

  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("currentCart", JSON.stringify([]));

  // Set flag for next page reload
  localStorage.setItem("paymentSuccess", "true");
 
}
function  pageReload(){
    location.reload();
}


function loadStoredStock() {
  const product = JSON.parse(localStorage.getItem("products")) || [];
  products = product;
}

// Update cart display
function updateCart() {
  const orderItems = document.getElementById("orderItems");
  const badge = document.querySelector(".order-header .badge");
  const itemCountBadge = document.querySelector("#currentOrderBtn .badge");

  if (cart.length === 0) {
    orderItems.innerHTML = `
            <div class="text-center text-muted py-5">
                <i class="fas fa-shopping-cart fa-3x mb-3"></i>
                <p>No items in cart</p>
            </div>
        `;
    badge.textContent = "0 items";
    itemCountBadge.textContent = "0 items";
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
                    <div class="qty-btn" onclick="updateQuantity(${
                      item.id
                    }, -1)">
                        <i class="fas fa-minus"></i>
                    </div>
                    <span>${item.quantity}</span>
                    <div class="qty-btn" onclick="updateQuantity(${
                      item.id
                    }, 1)">
                        <i class="fas fa-plus"></i>
                    </div>
                    <i class="fas fa-trash remove-btn" onclick="removeFromCart(${
                      item.id
                    })"></i>
                </div>
            </div>
        `;
    orderItems.innerHTML += orderItem;
  });

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = `${totalItems} items`;
  itemCountBadge.textContent = `${totalItems} items`;

  updateTotals();
}

function updateProductCards() {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  products.forEach((product) => {
    const stockText =
      product.stock <= 5
        ? `<span class="text-danger fw-bold">Low: ${product.stock}</span>`
        : `<span>Stock: ${product.stock}</span>`;

    const card = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h6>${product.name}</h6>
                <p>${product.price.toFixed(2)} LKR</p>
                <p>${stockText}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;

    container.innerHTML += card;
  });
}

// Update quantity
function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (!item) return;

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
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  document.getElementById("subtotal").textContent = `${subtotal.toFixed(
    2
  )} LKR`;
  document.getElementById("tax").textContent = `${tax.toFixed(2)} LKR`;
  document.getElementById("total").textContent = `${total.toFixed(2)} LKR`;
}

// Clear cart
document.getElementById("clearCart").addEventListener("click", function () {
  if (cart.length === 0) return;

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

// Proceed to payment
document
  .getElementById("proceedPayment")
  .addEventListener("click", function () {
    if (cart.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Cart is Empty",
        text: "Please add items to cart first",
        confirmButtonColor: "#8b5cf6",
      });
      return;
    }

    const total =
      cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.08;

    Swal.fire({
      title: "Complete Payment",
      html: `
            <div class="text-start">
                <p><strong>Total Amount:</strong> ${total.toFixed(2)} LKR</p>
                <p><strong>Items:</strong> ${cart.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                )}</p>
            </div>
        `,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#8b5cf6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Complete Payment",
    }).then((result) => {
      if (result.isConfirmed) {
        // Save order
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders.push({
          id: Date.now(),
          items: cart,
          total: total,
          date: new Date().toISOString(),
          cashier: currentUser.username,
        });
        localStorage.setItem("orders", JSON.stringify(orders));

        // Clear cart
        cart = [];
        localStorage.setItem("currentCart", JSON.stringify(cart));
        updateCart();

        Swal.fire({
          icon: "success",
          title: "Payment Successful!",
          text: "Order completed successfully",
          confirmButtonColor: "#8b5cf6",
        }).then(()=>{
             pageReload();
        });
      }
    });
   
  });

// Category tabs
document.querySelectorAll(".category-tab").forEach((tab) => {
  tab.addEventListener("click", function () {
    document
      .querySelectorAll(".category-tab")
      .forEach((t) => t.classList.remove("active"));
    this.classList.add("active");
    currentCategory = this.dataset.category;
    displayProducts(
      currentCategory,
      document.getElementById("searchProduct").value
    );
  });
});

// Sidebar icons
document.querySelectorAll(".sidebar-icon[data-view]").forEach((icon) => {
  icon.addEventListener("click", function () {
    document
      .querySelectorAll(".sidebar-icon[data-view]")
      .forEach((i) => i.classList.remove("active"));
    this.classList.add("active");
    const view = this.dataset.view;
    currentCategory = view;

    document
      .querySelectorAll(".category-tab")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelector(`.category-tab[data-category="${view}"]`)
      .classList.add("active");

    displayProducts(view, document.getElementById("searchProduct").value);
  });
});

// Search
document.getElementById("searchProduct").addEventListener("input", function () {
  displayProducts(currentCategory, this.value);
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

// Initialize
displayProducts();
updateCart();
