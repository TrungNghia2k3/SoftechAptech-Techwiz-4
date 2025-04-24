function toggleAccordion(span) {
  const item = span.closest(".accordion-item"); // tìm đến .accordion-item
  item.classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("ship-box");
  const shipBoxInfo = document.getElementById("ship-box-info");

  checkbox.addEventListener("change", function () {
    if (this.checked) {
      shipBoxInfo.classList.add("open");
    } else {
      shipBoxInfo.classList.remove("open");
    }
  });
});

async function renderOrderTable() {
  const products = await fetchProducts();
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const tbody = document.getElementById("order-tbody");
  // const subtotalElement = document.getElementById("cart-subtotal");
  const totalElement = document.getElementById("order-total");

  let subtotal = 0;
  let html = "";

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    if (product) {
      const total = product.price * item.quantity;
      subtotal += total;

      html += `
          <tr class="cart_item">
            <td class="cart-product-name">
              ${product.name}
              <strong class="product-quantity">x ${item.quantity}</strong>
            </td>
            <td class="cart-product-total">
              <span class="amount">$${total.toFixed(2)}</span>
            </td>
          </tr>
        `;
    }
  });

  tbody.innerHTML = html;
  // subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  totalElement.textContent = `$${subtotal.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", renderOrderTable);

document.querySelectorAll(".accordion-toggle").forEach((btn) => {
  btn.addEventListener("click", function () {
    const allCollapses = document.querySelectorAll(".collapse");
    const targetCollapse = this.closest(".card").querySelector(".collapse");

    // Nếu đang mở => đóng lại
    if (targetCollapse.classList.contains("show")) {
      targetCollapse.classList.remove("show");
    } else {
      // Đóng tất cả
      allCollapses.forEach((c) => c.classList.remove("show"));
      // Mở phần đang click
      targetCollapse.classList.add("show");
    }
  });
});
