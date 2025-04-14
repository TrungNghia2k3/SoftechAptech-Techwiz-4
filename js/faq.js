document.querySelectorAll(".frequently-item .has-sub > a").forEach((toggle) => {
  toggle.addEventListener("click", function () {
    const currentItem = this.parentElement;
    const allItems = document.querySelectorAll(".frequently-item .has-sub");

    // Nếu đang mở -> đóng lại
    if (currentItem.classList.contains("active")) {
      currentItem.classList.remove("active");
    } else {
      // Đóng tất cả accordion
      allItems.forEach((item) => item.classList.remove("active"));

      // Mở accordion hiện tại
      currentItem.classList.add("active");
    }
  });
});
