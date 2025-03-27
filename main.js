/* When the user clicks on the button, toggle between hiding and showing the dropdown content */
function currenryDropdown() {
  let dropdown = document.getElementById("currenryDropdown");

  if (dropdown.classList.contains("show")) {
    dropdown.style.opacity = "0"; // Giảm opacity trước khi ẩn
    setTimeout(() => {
      dropdown.classList.remove("show");
    }, 200); // Đợi animation xong mới ẩn
  } else {
    dropdown.classList.add("show");
    setTimeout(() => {
      dropdown.style.opacity = "1"; // Hiển thị dần
    }, 10); // Tránh bị nhấp nháy
  }
}

// Đóng dropdown nếu click bên ngoài
window.addEventListener("click", function (event) {
  let dropdown = document.getElementById("currenryDropdown");
  let button = document.querySelector(".dropbtn");

  if (!button.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.style.opacity = "0";
    setTimeout(() => {
      dropdown.classList.remove("show");
    }, 200);
  }
});

/* When the user clicks on the button, toggle between hiding and showing the dropdown content */
function languageDropdown() {
  let dropdown = document.getElementById("languageDropdown");

  if (dropdown.classList.contains("show")) {
    dropdown.style.opacity = "0"; // Giảm opacity trước khi ẩn
    setTimeout(() => {
      dropdown.classList.remove("show");
    }, 200); // Đợi animation xong mới ẩn
  } else {
    dropdown.classList.add("show");
    setTimeout(() => {
      dropdown.style.opacity = "1"; // Hiển thị dần
    }, 10); // Tránh bị nhấp nháy
  }
}

// Đóng dropdown nếu click bên ngoài
window.addEventListener("click", function (event) {
  let dropdown = document.getElementById("languageDropdown");
  let button = document.querySelector(".dropbtn");

  if (!button.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.style.opacity = "0";
    setTimeout(() => {
      dropdown.classList.remove("show");
    }, 200);
  }
});