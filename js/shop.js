// Biến toàn cục
let allProducts = [];
let filters = {
  search: "",
  categories: [],
  colors: [],
  tags: [],
  priceMin: 0,
  priceMax: 100,
};

// Load dữ liệu filters từ data.json
async function loadFilters() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();
    allProducts = data.products;

    renderFilterList("filter-categories", data.categories);
    renderFilterList("filter-colors", data.colors);
    renderTagList("filter-tags", data.tags);
    setupPriceSlider(); // setup slider sau khi DOM có sẵn
    setupCheckboxEvents(); // setup sự kiện checkbox sau khi render xong
    applyFilters(); // lọc ban đầu (tất cả sản phẩm)
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

// Render danh sách checkbox từ mảng
function renderFilterList(containerId, list) {
  const container = document.getElementById(containerId);
  container.innerHTML = list
    .map(
      (item) =>
        `<li>
          <label>
            <i class="bi bi-chevron-right"></i>
            <input type="checkbox" value="${item}">
            ${item}
          </label>
        </li>`
    )
    .join("");

  // Gán sự kiện sau khi render xong
  container.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const li = this.closest("li");
      if (this.checked) {
        li.classList.add("checked");
      } else {
        li.classList.remove("checked");
      }
    });
  });
}

// Render danh sách tag
function renderTagList(containerId, list) {
  const container = document.getElementById(containerId);
  container.innerHTML = list
    .map(
      (item) =>
        `<li><a href="#" class="tag-item" data-tag="${item}">${item}</a></li>`
    )
    .join("");

  setupTagFilter(containerId);
}

// Setup sự kiện cho tag filter
function setupTagFilter(containerId) {
  const tagElements = document.querySelectorAll(`#${containerId} .tag-item`);

  tagElements.forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();

      el.classList.toggle("active");

      // Lấy danh sách tag đang active
      const selectedTags = [
        ...document.querySelectorAll(`#${containerId} .tag-item.active`),
      ].map((tag) => tag.dataset.tag);

      // Cập nhật filter và gọi lọc lại
      filters.tags = selectedTags;
      currentPage = 1;
      applyFilters();
    });
  });
}

// Thiết lập sự kiện tìm kiếm
document.getElementById("widgets-searchbox").addEventListener("submit", (e) => {
  e.preventDefault();
  filters.search = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  applyFilters();
});

// Setup sự kiện cho checkbox filters
function setupCheckboxEvents() {
  document.querySelectorAll("#filter-categories input").forEach((input) => {
    input.addEventListener("change", () => {
      filters.categories = getCheckedValues("#filter-categories input");
      applyFilters();
    });
  });

  document.querySelectorAll("#filter-colors input").forEach((input) => {
    input.addEventListener("change", () => {
      filters.colors = getCheckedValues("#filter-colors input");
      applyFilters();
    });
  });
}

// Hàm hỗ trợ lấy các checkbox được chọn
function getCheckedValues(selector) {
  return [...document.querySelectorAll(selector)]
    .filter((i) => i.checked)
    .map((i) => i.value);
}

// Price Range + Debounce + Ghi vào filters
function setupPriceSlider() {
  const rangeInputs = document.querySelectorAll(".range-input input");
  const priceInputs = document.querySelectorAll(".price-input input");
  const progressBar = document.querySelector(".slider .progress");
  const priceGap = 10; // Khoảng cách tối thiểu giữa 2 giá trị min/max

  // Debounce function
  let debounceTimer;
  function debounce(callback, delay = 500) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(callback, delay);
  }

  // Cập nhật filters và gọi lọc
  function updatePriceFilter(min, max) {
    filters.priceMin = min;
    filters.priceMax = max;
    debounce(applyFilters, 500);
  }

  // Khi nhập số min/max trực tiếp
  priceInputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      let minVal = parseInt(priceInputs[0].value);
      let maxVal = parseInt(priceInputs[1].value);

      if (
        maxVal - minVal >= priceGap &&
        maxVal <= parseInt(rangeInputs[1].max)
      ) {
        if (e.target.classList.contains("input-min")) {
          rangeInputs[0].value = minVal;
          progressBar.style.left = (minVal / rangeInputs[0].max) * 100 + "%";
        } else {
          rangeInputs[1].value = maxVal;
          progressBar.style.right =
            100 - (maxVal / rangeInputs[1].max) * 100 + "%";
        }

        updatePriceFilter(minVal, maxVal);
      }
    });
  });

  // Khi kéo slider
  rangeInputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      let minVal = parseInt(rangeInputs[0].value);
      let maxVal = parseInt(rangeInputs[1].value);

      if (maxVal - minVal < priceGap) {
        if (e.target.classList.contains("range-min")) {
          rangeInputs[0].value = maxVal - priceGap;
        } else {
          rangeInputs[1].value = minVal + priceGap;
        }
      } else {
        priceInputs[0].value = minVal;
        priceInputs[1].value = maxVal;
        progressBar.style.left = (minVal / rangeInputs[0].max) * 100 + "%";
        progressBar.style.right =
          100 - (maxVal / rangeInputs[1].max) * 100 + "%";

        updatePriceFilter(minVal, maxVal);
      }
    });
  });
}

// Lọc sản phẩm theo điều kiện biến filters
function applyFilters() {
  const result = allProducts.filter((product) => {
    // Kiểm tra theo tên sản phẩm (search)
    const nameMatch = product.name.toLowerCase().includes(filters.search);

    // Kiểm tra theo category (chỉ có 1 giá trị)
    const categoryMatch =
      filters.categories.length === 0 || // Nếu không chọn category => chấp nhận hết
      filters.categories.includes(product.category); // Nếu chọn => kiểm tra có nằm trong danh sách đã chọn không

    // Kiểm tra theo color (nhiều giá trị trong mảng)
    const colorMatch =
      filters.colors.length === 0 || // Nếu không chọn => chấp nhận hết
      filters.colors.some(
        (
          selectedColor // Nếu chọn =>  chỉ cần product có ít nhất 1 màu trùng
        ) => product.color.includes(selectedColor)
      );

    // Kiểm tra theo tags (nhiều giá trị trong mảng)
    const tagMatch =
      filters.tags.length === 0 || // Nếu không chọn => chấp nhận hết
      filters.tags.some(
        (
          selectedTag // Nếu chọn =>  chỉ cần product có ít nhất 1 tag trùng
        ) => product.tag.includes(selectedTag)
      );

    // Kiểm tra theo khoảng giá
    const priceMatch =
      product.price >= filters.priceMin && // Giá lớn hơn hoặc bằng min
      product.price <= filters.priceMax; // Và nhỏ hơn hoặc bằng max

    // return trong hàm .filter() là điều kiện quyết định giữ hay loại sản phẩm trong mảng kết quả lọc.
    // Nếu tất cả điều kiện đều đúng (true) → giữ sản phẩm lại
    // Nếu một trong số chúng là false → loại bỏ sản phẩm đó

    return nameMatch && categoryMatch && colorMatch && tagMatch && priceMatch;
  });
  renderProducts(result);
}

// Hiển thị danh sách sản phẩm
let currentPage = 1;
const productsPerPage = 12;
let currentView = "grid"; // hoặc 'list'
let currentSort = "default";

function renderProducts(products) {
  const container = document.querySelector(".tab-content");

  // Cập nhật class view (grid-view hoặc list-view)
  container.classList.remove("grid-view", "list-view");
  container.classList.add(`${currentView}-view`);

  // Sort trước khi paginate
  const sorted = [...products].sort((a, b) => {
    switch (currentSort) {
      case "sold":
        return b.sold - a.sold;
      case "rated":
        return b.rating - a.rating;
      case "latest":
        return new Date(b.created_at) - new Date(a.created_at);
      case "high-price":
        return b.price - a.price;
      case "low-price":
        return a.price - b.price;
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sorted.length / productsPerPage);
  const start = (currentPage - 1) * productsPerPage;
  const paginated = sorted.slice(start, start + productsPerPage);

  // View format
  container.innerHTML = paginated.length
    ? paginated
        .map((p) => {
          const stars = Array.from(
            { length: p.rating },
            () => '<i class="bi bi-star-fill"></i>'
          ).join("");

          if (currentView === "grid") {
            return `
          <div class="product-card">
            <div class="product-image"> 
              <img src="${p["image-primary"]}" alt="${
              p.name
            }" class="primary-img" />
              <img src="${p["image-secondary"]}" alt="${
              p.name
            }" class="secondary-img" />
              <div class="product-add-action">
                <ul>
                  <div class="item-action">
                    <li><a href="#"><i class="bi bi-heart"></i></a></li>
                  </div>
                  <div class="item-action">
                    <li><a href="#"><i class="bi bi-eye"></i></a></li>
                  </div>
                  <div class="item-action">
                    <li><a href="#"><i class="bi bi-cart"></i></a></li>
                  </div>         
                </ul>
              </div>
            </div>
            <div class="product-content">
              <a class="product-name">${p.name}</a>
              <div class="price">
                <span class="new-price">$${p.price.toFixed(2)}</span>
              </div>
              <div class="rating">${stars}</div>
            </div> 
          </div>`;
          }

          // list-view style
          return `
        <div class="product-card list-view">
          <div class="product-image"> 
              <img src="${p["image-primary"]}" 
              alt="${p.name}" 
              class="primary-img" />
              
              <img src="${p["image-secondary"]}" 
              alt="${p.name}" 
              class="secondary-img" />

              <div class="product-list-content">
                <h3 class="product-name">${p.name}</h3>
                <p class="price">$${p.price.toFixed(2)}</p>
                <div class="rating">${stars}</div>
                <p class="product-description">${p.description}</p>
                <ul class="item-action-list">
                  <div class="item-action">
                    <li><a href="#"><i class="bi bi-heart"></i></a></li>
                  </div>
                  <div class="item-action">
                    <li><a href="#"><i class="bi bi-eye"></i></a></li>
                  </div>
                  <div class="item-action">
                    <li><a href="#"><i class="bi bi-cart"></i></a></li>
                  </div>         
                </ul>
              </div>
          </div>
        </div>`;
        })
        .join("")
    : "<p>No products found.</p>";

  renderPagination(totalPages);
}

// View Toggle
document.querySelectorAll(".view-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".view-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    currentView = btn.dataset.view;
    applyFilters(); // gọi lại toàn bộ với view mới
  });
});

//  Sort chọn
document.getElementById("sortSelect").addEventListener("change", (e) => {
  currentSort = e.target.value; // Cập nhật sort hiện tại
  currentPage = 1; // Reset về trang đầu tiên
  applyFilters(); // Gọi lại lọc + render
});

// Pagination:
function renderPagination(totalPages) {
  const container = document.querySelector(".pagination-area");
  let buttons = "";

  // Prev button
  buttons += `<button class="page-btn prev-btn" ${
    currentPage === 1 ? "disabled" : ""
  } data-page="${currentPage - 1}">&laquo;</button>`;

  // Số trang
  for (let i = 1; i <= totalPages; i++) {
    buttons += `<button class="page-btn ${
      i === currentPage ? "active" : ""
    }" data-page="${i}">${i}</button>`;
  }

  // Next button
  buttons += `<button class="page-btn next-btn" ${
    currentPage === totalPages ? "disabled" : ""
  } data-page="${currentPage + 1}">&raquo;</button>`;

  // Gán HTML
  container.innerHTML = buttons;

  // Gán sự kiện click
  document.querySelectorAll(".page-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = parseInt(btn.dataset.page);

      // Bảo vệ không vượt ngoài range
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        currentPage = page;
        applyFilters(); // render lại trang mới
      }
    });
  });
}

// Gọi khởi tạo khi load trang
loadFilters();
