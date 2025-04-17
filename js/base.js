// XỬ LÝ MODAL SEARCH
const modal = document.getElementById("searchModal");
const btn = document.getElementById("searchBtn");
const span = document.getElementsByClassName("close")[0];

// Mở modal và khóa scroll
btn.onclick = function () {
  modal.style.display = "block";
  document.body.classList.add("modal-open"); // Ngăn scroll
};

// Đóng modal và mở lại scroll
span.onclick = function () {
  modal.style.display = "none";
  document.body.classList.remove("modal-open"); // Cho scroll lại
};

// Đóng modal nếu click ra ngoài
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    document.body.classList.remove("modal-open"); // Cho scroll lại
  }
};

// XỬ LÝ HEADER DÍNH
// Khi cuộn xuống qua header, hiển thị header dính
const header = document.getElementById("main-header");
const stickyHeader = document.getElementById("sticky-header");

function handleStickyHeader() {
  const scrollY = window.scrollY || window.pageYOffset;
  const headerBottom = header.offsetTop + header.offsetHeight;

  // Nếu là thiết bị di động (<= 575.98px)
  if (window.innerWidth <= 575.98) {
    stickyHeader.style.display = "block";
    return;
  }

  // Với desktop
  if (scrollY > headerBottom) {
    stickyHeader.style.display = "block";
  } else {
    stickyHeader.style.display = "none";
  }
}

// Lắng nghe sự kiện cuộn trang và resize màn hình
window.addEventListener("scroll", handleStickyHeader);
window.addEventListener("resize", handleStickyHeader);
window.addEventListener("load", handleStickyHeader); // Gọi khi tải trang

// XỬ LÝ DROPDOWN
function toggleDropdown(button) {
  const id = button.getAttribute("data-id");
  const dropdown = button.parentElement.querySelector(
    `.dropdown-content[data-id="${id}"]`
  );

  // Ẩn tất cả dropdown khác
  document.querySelectorAll(".dropdown-content").forEach((el) => {
    if (el !== dropdown) {
      el.style.opacity = "0";
      setTimeout(() => el.classList.remove("show"), 200);
    }
  });

  // Toggle dropdown được click
  if (dropdown.classList.contains("show")) {
    dropdown.style.opacity = "0";
    setTimeout(() => dropdown.classList.remove("show"), 200);
  } else {
    dropdown.classList.add("show");
    setTimeout(() => (dropdown.style.opacity = "1"), 10);
  }
}

// Đóng dropdown nếu click bên ngoài
window.addEventListener("click", function (event) {
  let isClickInside = event.target.closest(".dropdown");
  if (!isClickInside) {
    document.querySelectorAll(".dropdown-content").forEach((el) => {
      el.style.opacity = "0";
      setTimeout(() => el.classList.remove("show"), 200);
    });
  }
});

// XỬ LÝ THAY ĐỔI SỐ LƯỢNG MẶT HÀNG TRONG GIỎ HÀNG
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Đếm số lượng sản phẩm khác nhau trong cart (theo id)
  const count = cart.length;

  document.querySelectorAll(".cart-count").forEach((cartCount) => {
    if (count > 0) {
      cartCount.textContent = count;
      cartCount.style.display = "flex";
    } else {
      cartCount.style.display = "none";
    }
  });
}

function toggleWishlist(id, element) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  const index = wishlist.indexOf(id);
  const icon = element.querySelector("i");

  if (index !== -1) {
    // Đã tồn tại -> xoá
    wishlist.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    element.classList.remove("active");
    showToast("bi bi-trash-fill", "Removed from wishlist");
  } else {
    // Chưa có -> thêm vào
    wishlist.push(id);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    element.classList.add("active");
    showToast("bi bi-check-circle-fill", "Added to wishlist");
  }
}

// XỬ LÝ THÊM VÀO WISHLIST
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".add-to-wishlist");

  if (btn) {
    e.preventDefault();
    const productId = parseInt(btn.dataset.id);

    toggleWishlist(productId, btn.closest(".item-action"));
  }
});

// XỬ LÝ THÔNG BÁO
function showToast(iconClass, message, duration = 3000) {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.className = "toast";

  toast.innerHTML = `
    <i class="${iconClass}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    setTimeout(() => container.removeChild(toast), 500);
  }, duration);
}

function addToCart(id, quantity = 1) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ id, quantity });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount(); // Cập nhật số lượng giỏ hàng
  showToast("bi bi-check-circle-fill", "Add to cart successfully");
}

function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart = cart.filter((item) => item.id !== id);

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount(); // Cập nhật số lượng giỏ hàng
  showToast("bi bi-trash-fill", "Removed from cart");
}

// updates = [{ id: 1, quantity: 3 }, { id: 2, quantity: 5 }]
function updateCart(updates) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  updates.forEach((update) => {
    const item = cart.find((p) => p.id === update.id);
    if (item) {
      item.quantity = update.quantity;
    }
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  showToast("bi bi-check-circle-fill", "Cart updated successfully");
}

// XỬ LÝ THÊM VÀO GIỎ HÀNG
document.addEventListener("click", (e) => {
  if (e.target.closest(".add-to-cart")) {
    e.preventDefault();
    const id = parseInt(e.target.closest(".add-to-cart").dataset.id);
    addToCart(id, 1);
  }
});

document.addEventListener("DOMContentLoaded", updateCartCount);

// XỬ LÝ OFF CANVAS CART
function openOffCanvasCart() {
  document.getElementById("offcanvas-cart").style.width = "450px";
  document.getElementById("offcanvas-overlay").classList.add("show");
  renderOffCanvasCart(); // render giỏ hàng
}

function closeOffCanvasCart() {
  document.getElementById("offcanvas-cart").style.width = "0";
  document.getElementById("offcanvas-overlay").classList.remove("show");
}

document
  .getElementById("offcanvas-overlay")
  .addEventListener("click", closeOffCanvasCart);

async function renderOffCanvasCart() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const listContainer = document.getElementById("offcanvas-cart-item-list");
  const subtotalEl = document.getElementById("cart-subtotal");

  const allProducts = await fetchProducts(); // lấy từ data.json
  let subtotal = 0;

  listContainer.innerHTML = ""; // clear cũ

  cartItems.forEach((item) => {
    const product = allProducts.find((p) => p.id === item.id);
    if (product) {
      const total = product.price * item.quantity;
      subtotal += total;

      const html = `
          <div class="offcanvas-cart-item" data-id="${product.id}">
            <img src="${product["image-primary"]}" alt="${
        product.name
      }" width="50">
            <div class="info">
              <h4>${product.name}</h4>
              <p>Price: $${product.price.toFixed(2)}</p>
              <p>Qty: ${item.quantity}</p>
            </div>
            <button class="remove-btn" data-id="${product.id}">&times;</button>
          </div>
        `;
      listContainer.innerHTML += html;
    }
  });

  subtotalEl.textContent = subtotal.toFixed(2);

  // Gán lại sự kiện remove
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      removeFromCart(id);
      renderOffCanvasCart(); // render lại sau khi xóa
      updateCartCount(); // cập nhật số lượng icon cart
    });
  });
}
