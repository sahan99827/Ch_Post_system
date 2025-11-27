// Check authentication
const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  window.location.href = "index.html";
}
// Product Form
const productForm = document.getElementById("productForm");
if (productForm) {
  productForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const productName = document.getElementById("productName").value;
    const productType = document.getElementById("productType").value;
    const productPrice = document.getElementById("productPrice").value;
    const productImage = document.getElementById("productImage").files[0];
    const productStock = document.getElementById("productStock").value;
    
    // Get existing products or create new array
    let products = JSON.parse(localStorage.getItem("products")) || [];

    // Handle image
    if (productImage) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const product = {
          id: Date.now(),
          name: productName,
          type: productType,
          price: parseFloat(productPrice),
          stock: parseFloat(productStock),
          image: e.target.result,
          isActive: true,
          createdAt: new Date().toISOString(),
        };

        products.push(product);
        localStorage.setItem("products", JSON.stringify(products));

        showSuccessAndRedirect();
      };
      reader.readAsDataURL(productImage);
    } else {
      const defaultImages = {
        tops: "https://via.placeholder.com/150/8b5cf6/ffffff?text=Top",
        bottoms: "https://via.placeholder.com/150/7c3aed/ffffff?text=Bottom",
        dresses: "https://via.placeholder.com/150/a78bfa/ffffff?text=Dress",
        accessories:
          "https://via.placeholder.com/150/c4b5fd/ffffff?text=Accessory",
      };

      const product = {
        id: Date.now(),
        name: productName,
        type: productType,
        price: parseFloat(productPrice),
        stock: parseFloat(productStock),
        image: defaultImages[productType] || "https://via.placeholder.com/150",
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      products.push(product);
      localStorage.setItem("products", JSON.stringify(products));

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
                    <td><button   class="btn btn-dark" onclick="edit(${products.id})">Edit</button>
                        <button   class="btn btn-dark" onclick="deleteproduct(${products.id})">Delete</button>
                    </td>
                </tr>
            `;
      
    });
  }
  
});


function deleteproduct(id) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const product = products.find((p) => p.id === id);
    product.isActive = false;
    localStorage.setItem("products", JSON.stringify(products));
     Swal.fire({
    icon: "success",
    title: "Product Deleted!",
    text: "Product has been Deleted successfully",
    confirmButtonColor: "#8b5cf6",
    timer: 1500,
  }).then(()=>{
    location.reload();
  })

}


function edit(id) {
  const productName = document.getElementById("productName");
  const productType = document.getElementById("productType");
  const productPrice = document.getElementById("productPrice");
  const productStock = document.getElementById("productStock");
  const imagePreview = document.getElementById("imagePreview");

  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products.find((p) => p.id === id);

  if (!product) {
     Swal.fire({
      title: "Product not found!",
      text: "The Product not found.",
      icon: "info",
      confirmButtonText: "OK",
    });
    return;
  }

  productName.value = product.name;
  productType.value = product.type;
  productPrice.value = product.price;
  productStock.value = product.stock;

if(product.isActive==true){
   document.getElementById("productActive").style.display = "none";
}else{
   document.getElementById("productActive").style.display = "block";
   document.getElementById("productTrue").checked = product.isActive === true;
  document.getElementById("productflse").checked = product.isActive === false;
}
 


  if (product.image) {
    imagePreview.src = product.image;
    imagePreview.style.display = "block";
  } else {
    imagePreview.style.display = "none";
  }

  // Save id to localStorage
  localStorage.setItem("editProductId", id);

  // Open modal
  var myModal = new bootstrap.Modal(document.getElementById("orderItemModal"));
  myModal.show();
}



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

const orderViewbtn = document.getElementById("orderViewbtn");
if (orderViewbtn) {
  orderViewbtn.addEventListener("click", () => {
    window.location.href = "order.html";
  });
}

function showSuccessAndRedirect() {
  Swal.fire({
    icon: "success",
    title: "Product Added!",
    text: "Product has been added successfully",
    confirmButtonColor: "#8b5cf6",
    timer: 1500,
  }).then(() => {
    window.location.href = "home.html";
  });
}

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

const updateproductForm = document.getElementById("updateproductForm");

if (updateproductForm) {
    updateproductForm.addEventListener("submit", function(e) {
        e.preventDefault();

        // Get input fields again
        const productName = document.getElementById("productName");
        const productType = document.getElementById("productType");
        const productPrice = document.getElementById("productPrice");
        const productStock = document.getElementById("productStock");
        const productTrue = document.getElementById("productTrue");
        const productFalse = document.getElementById("productflse");
        const fileInput = document.getElementById("productImage");

        let activeValue = productTrue.checked ? true : false;

        const products = JSON.parse(localStorage.getItem("products")) || [];
        const editId = Number(localStorage.getItem("editProductId"));
        const index = products.findIndex(p => p.id === editId);

        if (index !== -1) {
            products[index].name = productName.value;
            products[index].type = productType.value;
            products[index].price = Number(productPrice.value);
            products[index].stock = Number(productStock.value);
            products[index].isActive = activeValue;

            // If new image selected
            if (fileInput.files.length > 0) {
                const reader = new FileReader();
                reader.onload = function () {
                    products[index].image = reader.result;
                    localStorage.setItem("products", JSON.stringify(products));
                    Swal.fire({
                          title: "product Update!",
                          text: "The product was successfully updated.",
                          icon: "success",
                          confirmButtonText: "OK",
                        }).then(() => {
                          updateproductForm.reset();
                          location.reload();

                        });
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                // No new image → keep old one
                localStorage.setItem("products", JSON.stringify(products));
                 Swal.fire({
                          title: "product Update!",
                          text: "The product was successfully updated.",
                          icon: "success",
                          confirmButtonText: "OK",
                        }).then(() => {
                          updateproductForm.reset();
                          location.reload();

                        });
            }
        }
    });
}
