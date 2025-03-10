function selectPaymentMethod(method) {
  var methods = document.getElementsByClassName("payment-method");
  for (var i = 0; i < methods.length; i++) {
    methods[i].classList.remove("selected");
  }
  method.classList.add("selected");
}
$(document).ready(function () {
  $(".toggle-coupon").click(function () {
    $("#couponInput").animate(
      {
        height: "toggle",
      },
      600
    );
  });
});
$(document).ready(function () {
  $(".toggleCard").click(function () {
    $("#cardInput").animate(
      {
        height: "toggle",
      },
      600
    );
  });
});
