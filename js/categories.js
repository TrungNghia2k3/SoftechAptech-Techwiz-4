fetch("./productsCategories.json")
  .then((response) => response.json())
  .then((products) => {
    // Save products to localStorage
    localStorage.setItem("products", JSON.stringify(products));

    // Get products from localStorage
    const savedProducts = JSON.parse(localStorage.getItem("products"));

    // Display products in the table
    let tableContent = "";
    let total = 0;
    savedProducts.forEach((product) => {
      tableContent += `
                 <div class="product">
                <div class="image">
                    <a href="#"><img src="img/${product.thumb}" alt="picture product"></a>
                    <div class="products_add_action">
                        <ul>
                            <li><a href="#"><i class="fa-solid fa-heart"></i></a></li>
                            <li><a href="#"><i class="fa-solid fa-eye"></i></a></li>
                            <li><a href="cart.html"><i class="fa-solid fa-cart-shopping"></i></a></li>
                        </ul>
                    </div>
                </div>
                <div class="nameProduct">
                    <a href="#">${product.name}</a>
                </div>
                <div class="priceProduct">
                    <span>$${product.price}</span>
                </div>
                <div class="rating">
                    <ul>
                        <li><span>${product.rank}</span><i class="fa-solid fa-star"></i></li>
                    </ul>
                </div>
            </div>
            `;
      total += product.price;
    });
    document.querySelector(".viewProducts").innerHTML += tableContent;
  });
