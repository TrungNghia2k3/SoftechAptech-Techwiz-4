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

// XỬ LÝ GIỎ HÀNG
function updateCartCount(count) {
  // Lấy tất cả phần tử có class .cart-count (cả trong header và sticky)
  let cartCounts = document.querySelectorAll(".cart-count");

  cartCounts.forEach((cartCount) => {
    if (count > 0) {
      cartCount.textContent = count;
      cartCount.style.display = "flex";
    } else {
      cartCount.style.display = "none";
    }
  });
}

// Ví dụ: Cập nhật số lượng sản phẩm khi thêm vào giỏ hàng
updateCartCount(5); // Thay đổi số sản phẩm theo thực tế