document.addEventListener("DOMContentLoaded", () => {
  const tabItems = document.querySelectorAll(".nav-item:not(.logout)");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Remove active class from tabs and panes
      tabItems.forEach((el) => el.classList.remove("active"));
      tabPanes.forEach((pane) => pane.classList.remove("active"));

      // Add active class to selected tab
      item.classList.add("active");
      const targetId = item.dataset.target;
      document.querySelector(targetId).classList.add("active");
    });
  });
});
