document.addEventListener("DOMContentLoaded", async () => {
  const wishlistIds = JSON.parse(localStorage.getItem("wishlist")) || [];

  const response = await fetch("data.json"); // chứa toàn bộ sản phẩm
  const data = await response.json();
  const allProducts = data.products;

  const wishlistProducts = allProducts.filter((p) =>
    wishlistIds.includes(p.id)
  );

  console.log(wishlistProducts);

  renderWishlist(wishlistProducts);
});

function renderWishlist(products) {
  const tbody = document.querySelector(".wishlist-table tbody");

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No items in wishlist</td></tr>`;
    return;
  }

  tbody.innerHTML = products
    .map(
      (p) => `
        <tr>
          <td class="product-remove">
            <a class="remove-item" data-id="${p.id}">
              <i class="bi bi-x"></i>
            </a>
          </td>
          <td class="product-thumbnail">
            <a href="#">
              <img src="${p["image-primary"]}" alt="${p.name}" />
            </a>
          </td>
          <td class="product-name">
            <a href="#">${p.name}</a>
          </td>
          <td class="product-price">
            <span>$${p.price.toFixed(2)}</span>
          </td>
          <td class="product-add-to-cart">
            <button>Add To Cart</button>
          </td>
        </tr>`
    )
    .join("");

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = parseInt(btn.dataset.id);
      removeFromWishlist(id);
    });
  });
}

function removeFromWishlist(id) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist = wishlist.filter((itemId) => itemId !== id);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  location.reload(); // Reload lại để cập nhật giao diện
}
