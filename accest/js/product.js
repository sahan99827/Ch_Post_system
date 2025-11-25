// Check authentication
const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
    window.location.href = 'index.html';
}
// Product Form
const productForm = document.getElementById("productForm");
if (productForm) {
productForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const productName = document.getElementById('productName').value;
    const productType = document.getElementById('productType').value;
    const productPrice = document.getElementById('productPrice').value;
    const productImage = document.getElementById('productImage').files[0];
    const productStock = document.getElementById('productStock').value;
    
    // Get existing products or create new array
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Handle image
    if (productImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const product = {
                id: Date.now(),
                name: productName,
                type: productType,
                price: parseFloat(productPrice),
                stock: parseFloat(productStock),
                image: e.target.result,
                createdAt: new Date().toISOString()
            };
            
            products.push(product);
            localStorage.setItem('products', JSON.stringify(products));
            
            showSuccessAndRedirect();
        };
        reader.readAsDataURL(productImage);
    } else {

        const defaultImages = {
            tops: 'https://via.placeholder.com/150/8b5cf6/ffffff?text=Top',
            bottoms: 'https://via.placeholder.com/150/7c3aed/ffffff?text=Bottom',
            dresses: 'https://via.placeholder.com/150/a78bfa/ffffff?text=Dress',
            accessories: 'https://via.placeholder.com/150/c4b5fd/ffffff?text=Accessory'
        };
        
        const product = {
            id: Date.now(),
            name: productName,
            type: productType,
            price: parseFloat(productPrice),
            stock: parseFloat(productStock),
            image: defaultImages[productType] || 'https://via.placeholder.com/150',
            createdAt: new Date().toISOString()
        };
        
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
        
        showSuccessAndRedirect();
    }
});
}
document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.getElementById("productInfo");
  if (tableBody) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    tableBody.innerHTML = "";
    products.forEach((products) => {
      tableBody.innerHTML += `
                <tr>
                    <td>${products.name}</td>
                    <td>${products.type}</td>
                    <td>${products.price}</td>
                    <td>${products.stock}</td>
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




 // Buttons
  const productAddbtn = document.getElementById("productAddbtn");
  if (productAddbtn) {
    productAddbtn.addEventListener("click", () => {
      window.location.href = "product-add.html";
    });
  }

  const productViewbtn = document.getElementById("productViewbtn");
  if (productViewbtn) {
    productViewbtn.addEventListener("click", () => {
      window.location.href = "product-view.html";
    });
  }


function showSuccessAndRedirect() {
    Swal.fire({
        icon: 'success',
        title: 'Product Added!',
        text: 'Product has been added successfully',
        confirmButtonColor: '#8b5cf6',
        timer: 1500
    }).then(() => {
        window.location.href = 'home.html';
    });
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to logout?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#8b5cf6',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, logout'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentCart');
            window.location.href = 'index.html';
        }
    });
});