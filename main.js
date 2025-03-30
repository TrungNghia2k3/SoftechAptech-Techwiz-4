function toggleDropdown(id) {
  let dropdown = document.getElementById(id);

  // Ẩn tất cả dropdown khác
  document.querySelectorAll(".dropdown-content").forEach((el) => {
    if (el.id !== id) {
      el.style.opacity = "0";
      setTimeout(() => el.classList.remove("show"), 200);
    }
  });

  // Hiển thị hoặc ẩn dropdown được chọn
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

function updateCartCount(count) {
  let cartCount = document.querySelector(".cart-count");
  count = 10;
  if (count > 0) {
    cartCount.textContent = count;
    cartCount.style.display = "flex";
  } else {
    cartCount.style.display = "none"; // Ẩn nếu giỏ hàng trống
  }
}

// Ví dụ: Cập nhật số lượng sản phẩm khi thêm vào giỏ hàng
updateCartCount(5); // Thay đổi số sản phẩm theo thực tế

let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

function showSlide(index) {
  if (index >= slides.length) currentSlide = 0;
  else if (index < 0) currentSlide = slides.length - 1;
  else currentSlide = index;

  slides.forEach((slide) => {
    slide.classList.remove("active");
    slide.querySelectorAll(".animate").forEach((el) => {
      el.classList.remove("animate"); // Reset animation
    });
  });

  slides[currentSlide].classList.add("active");

  // Kích hoạt hiệu ứng sau khi slide xuất hiện
  setTimeout(() => {
    slides[currentSlide].querySelector("span").classList.add("animate");
    slides[currentSlide].querySelector("h2").classList.add("animate");
    slides[currentSlide].querySelector("p").classList.add("animate");
    slides[currentSlide].querySelector("button").classList.add("animate");
    slides[currentSlide].querySelector("img").classList.add("animate");
  }, 1000);
}

function changeSlide(step) {
  showSlide(currentSlide + step);
}

// Tự động chuyển slide
setInterval(() => changeSlide(1), 10000);

// Hiển thị slide đầu tiên
showSlide(currentSlide);

document.addEventListener("DOMContentLoaded", async () => {
  let products = [];
  let activeTab = "featured"; // Mặc định là Featured

  // Fetch dữ liệu từ file JSON
  async function fetchProducts() {
    try {
      const response = await fetch("data.json");
      const data = await response.json();
      products = data.products;
      console.log(products); // In ra danh sách sản phẩm để kiểm tra
      renderProducts(); // Hiển thị sản phẩm khi tải xong
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  }

  // Hàm lọc sản phẩm theo tab
  function filterProducts(filterType) {
    switch (filterType) {
      case "featured":
        return products.filter((product) => product.featured).slice(0, 8);
      case "best-seller":
        return [...products].sort((a, b) => b.sold - a.sold).slice(0, 8);
      case "latest":
        return [...products]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 8);
      default:
        return products.slice(0, 8);
    }
  }

  // Hiển thị sản phẩm trong `tab-content`
  function renderProducts() {
    const filteredProducts = filterProducts(activeTab);
    const tabContent = document.getElementById("tabContent");

    tabContent.innerHTML = filteredProducts
      .map((product) => {
        // Tạo HTML cho số sao dựa trên rating
        const stars = Array.from(
          { length: product.rating },
          () => '<i class="bi bi-star-fill"></i>'
        ).join("");

        return `
        <div class="product-card">
            <img src="${product["image-primary"]}" alt="${product.name}" class="product-image" />
            <a class="product-name">${product.name}</a>
            <div class="price">
                <span class="new-price">$${product.price.toFixed(2)}</span>
            </div>
            <div class="rating">${stars}</div> <!-- Hiển thị số sao -->
        </div>
      `;
      })
      .join("");
  }

  // Xử lý sự kiện khi click vào tab
  document.querySelectorAll(".product-tab-nav .nav-item").forEach((tab) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();

      // Xóa class "active" khỏi tất cả các tab
      document
        .querySelectorAll(".product-tab-nav .nav-item")
        .forEach((link) => link.classList.remove("active"));

      // Thêm class "active" vào tab được click
      event.target.classList.add("active");

      // Cập nhật tab đang active
      activeTab = event.target.getAttribute("data-target").replace("#", "");

      // Cập nhật danh sách sản phẩm theo tab
      renderProducts();
    });
  });

  await fetchProducts(); // Fetch data khi load trang
});
