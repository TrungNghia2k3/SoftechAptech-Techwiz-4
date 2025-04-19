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
            <a class="remove-item" data-id="${product.id}">
            <i class="bi bi-x"></i>
          </td>
          <td class="product-thumbnail">
            <img src="${product["image-primary"]}" 
            alt="${product.name}" />
          </td>
          <td class="product-name">
            ${product.name}
          </td>
          <td class="product-price">
            $${product.price.toFixed(2)}
          </td>
          <td class="product-quantity">
            <form class="cart-count-form cart-page" role="form" data-product-id="${
              product.id
            }">
              <a class="minus"><i class="bi bi-dash"></i></a>
              <input class="counter" type="number" name="count" 
              value="${item.quantity}" 
              data-id="${product.id} min="1">
              <a class="plus"><i class="bi bi-plus"></i></a>
            </form>
          </td>
          <td class="product-price">
            $${(product.price * item.quantity).toFixed(2)}
          </td>
        </tr>`;
    })
    .join("");

  document.querySelectorAll(".cart-count-form").forEach((form) => {
    const input = form.querySelector(".counter");
    const plus = form.querySelector(".plus");
    const minus = form.querySelector(".minus");

    plus.addEventListener("click", () => {
      input.value = parseInt(input.value || "0", 10) + 1;
    });

    minus.addEventListener("click", () => {
      const current = parseInt(input.value || "0", 10);
      if (current > 1) input.value = current - 1;
    });
  });

  updateCartTotal(cart, allProducts);
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
    const inputs = document.querySelectorAll(".counter");
    const updates = Array.from(inputs).map((input) => ({
      id: parseInt(input.dataset.id),
      quantity: parseInt(input.value),
    }));
    updateCart(updates);
    renderCart();
  });
}

function updateCartTotal(cart, products) {
  let subtotal = 0;

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    if (product) {
      subtotal += product.price * item.quantity;
    }
  });

  const cartTotalElement = document.getElementById("cart-total");
  if (cartTotalElement) {
    cartTotalElement.innerHTML = `
      <ul>
        <li class="border-bottom-0">Subtotal <span>$${subtotal.toFixed(2)}</span></li>
        <li>Total <span>$${subtotal.toFixed(2)}</span></li>
      </ul>
    `;
  }
}

// Init
renderCart();
setupRemoveEvents();
setupUpdateEvent();
