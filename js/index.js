// XỬ LÝ SLIDESHOW
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

// XỬ LÝ TAB SẢN PHẨM
document.addEventListener("DOMContentLoaded", async () => {
  let products = [];
  let activeTab = "featured"; // Mặc định là Featured

  products = await fetchProducts();
  renderProducts(); // Hiển thị sản phẩm khi tải xong

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

  function renderProducts() {
    const filteredProducts = filterProducts(activeTab);
    const tabContent = document.getElementById("tabContent");

    // Lấy wishlist hiện tại từ localStorage
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    tabContent.innerHTML = filteredProducts
      .map((product) => {
        const stars = Array.from(
          { length: product.rating },
          () => '<i class="bi bi-star-fill"></i>'
        ).join("");

        // Kiểm tra xem product này có trong wishlist không
        const isInWishlist = wishlist.includes(product.id);

        return `
            <div class="product-card">
              <div class="product-image"> 
                <a href="product-detail.html?id=${product.id}">
                  <img src="${product["image-primary"]}" alt="${
          product.name
        }" class="primary-img" />
                  <img src="${product["image-secondary"]}" alt="${
          product.name
        }" class="secondary-img" />
                </a>

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
                <a  class="product-name" 
                    href="product-detail.html?id=${product.id}">
                  ${product.name}
                </a>
                <div class="price">
                  <span class="new-price">$${product.price.toFixed(2)}</span>
                </div>
                <div class="rating">${stars}</div>
              </div>
            </div>
        `;
      })
      .join("");
  }

  document.querySelectorAll(".product-tab-nav .nav-item").forEach((tab) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      document
        .querySelectorAll(".product-tab-nav .nav-item")
        .forEach((link) => link.classList.remove("active"));
      event.target.classList.add("active");
      activeTab = event.target.getAttribute("data-target").replace("#", "");
      renderProducts();
    });
  });
});

// XỬ LÝ NEW PRODUCTS
document.addEventListener("DOMContentLoaded", async () => {
  let products = await fetchProducts();
  renderNewProducts();

  function renderNewProducts() {
    const newProductsList = document.getElementById("new-products-list");
    
    // Lấy wishlist hiện tại từ localStorage
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    
    const newProducts = [...products]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 4);

    newProductsList.innerHTML = newProducts
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
                      <li><a href="#"><i class="bi bi-eye"></i></a></li>
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
      .join("");
  }
});

// XỬ LÝ TESTIMONIALS
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch dữ liệu từ data.json
    const response = await fetch("data.json");
    const data = await response.json();

    // Gọi hàm render testimonials
    renderTestimonials(data.testimonials);
  } catch (error) {
    console.error("Lỗi khi fetch testimonials:", error);
  }
});

function renderTestimonials(testimonials) {
  const testimonialList = document.getElementById("testimonial-list");

  testimonialList.innerHTML = testimonials
    .map(
      (testimonial) => `
      <div class="testimonial-card">
        <div class="testimonial-info">
            <div class="testimonial-image">
                <img src="${testimonial.image}" alt="${testimonial.name}">
            </div>
            <div class="testimonial-content">
              <h4 class="testimonial-name">${testimonial.name}</h4>
              <span class="testimonial-occupation">Client</span>
            </div>
        </div>
        <p class="testimonial-comment">${testimonial.description}</p>
      </div>
    `
    )
    .join("");
}

// XỬ LÝ BLOG
document.addEventListener("DOMContentLoaded", async () => {
  let blogs = await fetchBlogs();
  renderBlogs(blogs);
});

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function renderBlogs(blogs) {
  const blogList = document.getElementById("blog-list");

  blogList.innerHTML = blogs
    .map(
      (blog) => `  
      <div class="blog-card">
        <div class="blog-content">
            <div class="blog-meta">
              <ul>
                  <li class="author">
                      <a href="#">By: ${blog.author}</a>
                  </li>
                  <li class="date">
                       ${formatDate(blog.created_at)}
                  </li>
              </ul>
            </div> 
            <h2 class="blog-title"><a href="#">${blog.title}</a></h2>
            <p class="blog-description">${blog.description}</p>
        </div>
        <div class="blog-img">
            <a href="#">
                <img src="${blog.image}" alt="${blog.title}">
            </a>
            <div class="inner-btn">
              <a href="#">
                <i class="bi bi-link-45deg"></i>
              </a>
            </div>
        </div>
      </div>
    `
    )
    .join("");
}

// FETCH DỮ LIỆU BLOG
async function fetchBlogs() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();
    return data.blogs;
  } catch (error) {
    console.error("Lỗi khi fetch blogs:", error);
    return [];
  }
}
