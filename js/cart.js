// Lấy dữ liệu cart từ localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Lấy dữ liệu từ file data.json (giả sử chứa danh sách sản phẩm)
async function fetchProducts() {
  const res = await fetch("data.json");
  const data = await res.json();
  return data.products;
}

// Render danh sách giỏ hàng
async function renderCart() {
  const cart = getCart();
  const allProducts = await fetchProducts();
  const tbody = document.querySelector(".cart-table-body");

  if (!cart.length) {
    tbody.innerHTML = `<tr><td colspan="6">Giỏ hàng đang trống</td></tr>`;
    return;
  }

  tbody.innerHTML = cart
    .map((item) => {
      const product = allProducts.find((p) => p.id === item.id);
      if (!product) return "";

      return `
        <tr>
          <td class="product-remove">
            <a href="#" class="remove-item" data-id="${
              product.id
            }"><i class="bi bi-trash"></i></a>
          </td>
          <td class="product-thumbnail">
            <img src="${product["image-primary"]}" alt="${product.name}" />
          </td>
          <td class="product-name">${product.name}</td>
          <td class="product-price">$${product.price.toFixed(2)}</td>
          <td class="product-quantity">
            <input type="number" min="1" value="${item.quantity}" data-id="${
        product.id
      }" class="quantity-input">
          </td>
        </tr>`;
    })
    .join("");
}

// Lắng nghe remove
function setupRemoveEvents() {
  document.addEventListener("click", (e) => {
    if (e.target.closest(".remove-item")) {
      e.preventDefault();
      const id = parseInt(e.target.closest(".remove-item").dataset.id);
      removeFromCart(id);
      renderCart();
    }
  });
}

// Xử lý update cart
function setupUpdateEvent() {
  const updateBtn = document.getElementById("updateCartBtn");
  updateBtn.addEventListener("click", () => {
    const inputs = document.querySelectorAll(".quantity-input");
    const updates = Array.from(inputs).map((input) => ({
      id: parseInt(input.dataset.id),
      quantity: parseInt(input.value),
    }));
    updateCart(updates);
    renderCart();
  });
}

// Init
renderCart();
setupRemoveEvents();
setupUpdateEvent();
