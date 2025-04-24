// XỬ LÝ MODAL SEARCH
const modal = document.getElementById("searchModal");
const buttons = document.getElementsByClassName("searchBtn");
const span = document.getElementsByClassName("close")[0];

// Gán sự kiện mở modal cho tất cả nút searchBtn
Array.from(buttons).forEach((btn) => {
  btn.addEventListener("click", () => {
    modal.style.display = "block";
    document.body.classList.add("modal-open");
  });
});

// Gán sự kiện đóng modal
span.onclick = function () {
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
};

// Đóng khi click ra ngoài modal
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
  }
};

// XỬ LÝ HEADER STICKY
// Khi cuộn xuống qua header, hiển thị header sticky
const header = document.getElementById("main-header");
const stickyHeader = document.getElementById("sticky-header");

function handleStickyHeader() {
  const scrollY = window.scrollY || window.pageYOffset;
  const headerBottom = header.offsetTop + header.offsetHeight;

  // Nếu là thiết bị di động (<= 575.98px)
  if (window.innerWidth <= 575.98 || 
    (window.innerWidth >= 768 && window.innerWidth <= 991.98)|| 
    (window.innerWidth >= 992 && window.innerWidth <= 1199.98)) {
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

  // Nếu nằm trong item-action, thêm class ở cha ngoài cùng
  const parentItem = element.closest(".item-action") || element;

  if (index !== -1) {
    wishlist.splice(index, 1);
    parentItem.classList.remove("active");
    element.classList.remove("active");
    showToast("bi bi-trash-fill", "Removed from wishlist");
  } else {
    wishlist.push(id);
    parentItem.classList.add("active");
    element.classList.add("active");
    showToast("bi bi-check-circle-fill", "Added to wishlist");
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// XỬ LÝ THÊM VÀO WISHLIST
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".add-to-wishlist");
  if (btn) {
    e.preventDefault();
    const productId = parseInt(btn.dataset.id);
    if (!isNaN(productId)) {
      toggleWishlist(productId, btn);
    }
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
  console.log("open offcanvas cart");
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
            <img 
              src="${product["image-primary"]}" 
              alt="${product.name}">
            <div class="product-item-info">
              <a class="product-name">${product.name}</a>
              <p class="product-quantity-price">${
                item.quantity
              } x $${product.price.toFixed(2)}</p>
            </div>
            <button class="remove-btn" data-id="${product.id}">&times;</button>
          </div>
          
        `;
      listContainer.innerHTML += html;
    }
  });

  subtotalEl.textContent = `$` + subtotal.toFixed(2);

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

// FETCH DỮ LIỆU SẢN PHẨM
async function fetchProducts() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
    return [];
  }
}

const productModalWrapper = document.getElementById("product-modal-wrapper");
const productModalBody = document.getElementById("product-modal-body");
const closeProductModal = document.querySelector(".product-modal-close");

// Lắng nghe click biểu tượng "eye"
document.addEventListener("click", async function (e) {
  const eyeBtn = e.target.closest(".bi-eye");

  if (eyeBtn) {
    e.preventDefault();

    const itemAction = eyeBtn.closest(".item-action");
    const productId = itemAction?.querySelector("a")?.dataset.id;

    if (productId) {
      const products = await fetchProducts(); // Hàm lấy danh sách sản phẩm
      const product = products.find((p) => p.id === parseInt(productId));
      renderProductModal(product);
    }
  }
});

// Hàm render nội dung sản phẩm trong modal
function renderProductModal(product) {
  if (!product) {
    productModalBody.innerHTML = "<p>Product not found.</p>";
    return;
  }

  const stars = Array.from(
    { length: product.rating },
    () => '<i class="bi bi-star-fill"></i>'
  ).join("");

  // Lấy wishlist hiện tại từ localStorage
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  // Kiểm tra xem sản phẩm có trong wishlist không
  const isInWishlist = wishlist.includes(product.id);

  productModalBody.innerHTML = `
    <div class="product-detail-wrapper">
      <div class="product-detail-image"> 
          <img id="mainImage"
            src="${product["image-primary"]}" 
            alt="${product.name}">

          <div class="product-detail-images-list">
            <img class="thumb-image" 
                src="${product["image-primary"]}" 
                alt="${product.name}">
            <img class="thumb-image" 
                src="${product["image-secondary"]}" 
                alt="${product.name}">
          </div>
      </div>

      <div class="product-detail-content">
        <h2 class="product-name">${product.name}</h2>
        
        <div class="price-box">
          <span class="new-price">${product.price}</span>
        </div>
        
        <div class="rating-box">
          ${stars}
        </div>

        <div class="selector-wrap color-option">
          <span class="selector-title border-bottom-0">Color</span>
          <div class="select-wrapper">
            <select class="nice-select border-bottom-0" id="color-select">
              ${product.color
                ?.map((color) => `<option value="${color}">${color}</option>`)
                .join("")}
            </select>
            <i class="bi bi-chevron-down custom-icon"></i>
          </div>
        </div>
        
        <div class="selector-wrap size-option">
          <span class="selector-title">Size</span>
          <div class="select-wrapper">
            <select class="nice-select" id="size-select">
              ${product.size
                ?.map((size) => `<option value="${size}">${size}</option>`)
                .join("")}
            </select>
            <i class="bi bi-chevron-down custom-icon"></i>
          </div>
        </div>

        <p class="description">${product.description}</p>
        
        <ul class="quantity-with-btn">
          <li class="quantity">
            <form class="cart-count-form" role="form" data-product-id="${
              product.id
            }">
              <a class="minus"><i class="bi bi-dash"></i></a>
              <input class="counter" type="number" name="count" value="1" min="1">
              <a class="plus"><i class="bi bi-plus"></i></a>
            </form>
          </li>
          <li class="add-to-cart-btn">
            <button id="addToCartBtn">Add to Cart</button>
          </li>
          <li class="wishlist-btn-wrap">
            <a class="add-to-wishlist ${isInWishlist ? "active" : ""}" 
            data-id="${product.id}">
              <i class="bi bi-heart"></i>
            </a>
          </li>
        </ul>

        
        <ul class="service-item-wrap">
          <li class="service-item">
            <div class="service-img">
              <img src="assets/images/shipping-1.png" alt="Shipping-1">
            </div>
            <div class="service-content">
              <span class="title">
              Free <br> 
              Shipping
              </span>
            </div>
          </li>
          <li class="service-item">
            <div class="service-img">
              <img src="assets/images/shipping-2.png" alt="Shipping-2">
            </div>
            <div class="service-content">
              <span class="title">
              Safe <br> 
              Payment
              </span>
            </div>
          </li>
          <li class="service-item">
            <div class="service-img">
              <img src="assets/images/shipping-3.png" alt="Shipping-3">
            </div>
            <div class="service-content">
              <span class="title">
              Safe <br> 
              Payment
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `;

  productModalWrapper.style.display = "flex";

  // Thay đổi ảnh chính khi nhấp vào ảnh thu nhỏ
  const mainImage = document.getElementById("mainImage");
  const thumbnails = document.querySelectorAll(".thumb-image");

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      mainImage.src = thumb.src;
    });
  });

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

  // XỬ LÝ THÊM VÀO GIỎ HÀNG
  document.getElementById("addToCartBtn").addEventListener("click", () => {
    const form = document.querySelector(".cart-count-form");
    const productId = parseInt(form.dataset.productId);
    const quantity = parseInt(form.querySelector(".counter").value);

    if (quantity > 0) {
      addToCart(productId, quantity);
    }
  });
}

// Đóng modal
closeProductModal.onclick = () => {
  productModalWrapper.style.display = "none";
};

window.onclick = (e) => {
  if (e.target === productModalWrapper) {
    productModalWrapper.style.display = "none";
  }
};
