function openVideoPopup() {
  const videoPopup = document.getElementById("videoPopup");
  const videoFrame = document.getElementById("videoFrame");

  // Đặt link video YouTube hoặc local (ví dụ YouTube)
  videoFrame.src = "https://www.youtube.com/embed/FNJW8K0_73o?autoplay=1";
  videoPopup.style.display = "flex";
  document.body.style.overflow = "hidden"; // Ngăn scroll nền
}

function closeVideoPopup() {
  const videoPopup = document.getElementById("videoPopup");
  const videoFrame = document.getElementById("videoFrame");

  videoPopup.style.display = "none";
  videoFrame.src = ""; // Dừng video
  document.body.style.overflow = ""; // Cho scroll lại
}
