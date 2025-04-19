// Lấy ID từ URL
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get("id"));

// Giả sử bạn lấy từ data.json
async function fetchData() {
  const res = await fetch("data.json");
  const data = await res.json();
  return data.products;
}

function renderProductDetail(product) {
  const container = document.getElementById("product-detail");
  if (!product) {
    container.innerHTML = "<p>Product not found.</p>";
    return;
  }

  // Lấy wishlist hiện tại từ localStorage
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  const stars = Array.from(
    { length: product.rating },
    () => '<i class="bi bi-star-fill"></i>'
  ).join("");

  // Kiểm tra xem product này có trong wishlist không
  const isInWishlist = wishlist.includes(product.id);

  container.innerHTML = `
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
            <a class="add-to-wishlist ${isInWishlist ? "active" : ""}" data-id="${product.id}">
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

        <div class="product-category">
          <span class="title">Categories: </span>
          <span class="category">${product.category}</span>
        </div>

        <div class="product-tag">
          <span class="title">Tags:</span>
          <ul class="product-tag-list">
            ${product.tag
              ?.map((tag, index, arr) => {
                const isLast = index === arr.length - 1;
                return `<li><a href="#">${tag}</a>${!isLast ? "," : ""}</li>`;
              })
              .join("")}
          </ul>
        </div>

        <div class="social-share">
          <span class="title">Share: </span>
            <ul class="social-list">
              <li><a href="#"><i class="bi bi-facebook"></i></a></li>
              <li><a href="#"><i class="bi bi-twitter"></i></a></li>
              <li><a href="#"><i class="bi bi-instagram"></i></a></li>
              <li><a href="#"><i class="bi bi-pinterest"></i></a></li>
            </ul>
          </div>
      </div>
    </div>
  `;

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

fetchData().then((products) => {
  const product = products.find((p) => p.id === productId);
  renderProductDetail(product);
});

// XỬ LÝ TAB SẢN PHẨM
document.querySelectorAll(".tab-item").forEach((tab) => {
  tab.addEventListener("click", () => {
    // Remove active class from all tabs
    document
      .querySelectorAll(".tab-item")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelectorAll(".tab-panel")
      .forEach((panel) => panel.classList.remove("active"));

    // Add active to clicked tab and target panel
    tab.classList.add("active");
    const target = document.querySelector(tab.dataset.target);
    target.classList.add("active");
  });
});

// XỬ LÝ CÁC SẢN PHẨM KHÁC CÙNG LOẠI VỚI SẢN PHẨM ĐANG XEM
async function renderRelatedProducts() {
  const products = await fetchData();
  const currentProduct = products.find((p) => p.id === productId);

  if (!currentProduct) {
    console.error("Product not found!");
    return;
  }

  // 🔹 Lọc sản phẩm cùng category, khác id hiện tại
  const relatedProducts = products
    .filter((p) => p.category === currentProduct.category && p.id !== productId)
    .slice(0, 4); // ✅ Giới hạn 4 sản phẩm

  const container = document.getElementById("product-category");

  // Lấy wishlist hiện tại từ localStorage
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  container.innerHTML = relatedProducts.length
    ? relatedProducts
        .map((product) => {
          const stars = Array.from(
            { length: product.rating },
            () => '<i class="bi bi-star-fill"></i>'
          ).join("");

          // Kiểm tra xem product này có trong wishlist không
          const isInWishlist = wishlist.includes(product.id);

          return `
          
          <div class="product-card">
            <a href="product-detail.html?id=${product.id}">
              <div class="product-image"> 
                <img  src="${product["image-primary"]}" 
                      alt="${product.name}" 
                      class="primary-img" />
                
                <img  src="${product["image-secondary"]}" 
                      alt="${product.name}" 
                      class="secondary-img" />

                <div class="product-add-action">
                  <ul>
                    <div class="item-action ${isInWishlist ? "active" : ""}">
                      <li>
                        <a class="add-to-wishlist" data-id="${product.id}">
                          <i class="bi bi-heart"></i>
                        </a>
                      </li>
                    </div>
                    <div class="item-action">
                      <li>
                        <a data-id="${product.id}">
                          <i class="bi bi-eye"></i>
                        </a>
                      </li>
                    </div>
                    <div class="item-action">
                      <li>
                        <a class="add-to-cart" data-id="${product.id}">
                          <i class="bi bi-cart"></i>
                        </a>
                      </li>
                    </div>         
                  </ul>
                </div>
              </div>
              <div class="product-content">
                <a class="product-name" href="product-detail.html?id=${
                  product.id
                }">${product.name}</a>
                <div class="price">
                  <span class="new-price">$${product.price.toFixed(2)}</span>
                </div>
                <div class="rating">${stars}</div>
              </div>
            </a>
          </div>
      `;
        })
        .join("")
    : "<p>No related products found.</p>";
}

renderRelatedProducts();
