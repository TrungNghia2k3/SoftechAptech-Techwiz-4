// // Load products from JSON file
fetch("productsCategories.json")
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
                <tr>
                    <td><button onclick="removeProduct(${product.id})"><i class="bi bi-trash"></i></button></td>
                    <td><img src="img/${product.thumb}" alt="Product Image" width="50"></td>
                    <td>${product.name}</td>
                    <td>$${product.price}</td>
                    <td><input type="number" value="1" min="1" onchange="updateQuantity(${product.id}, this.value)"></td>
                    <td id="total-${product.id}">$${product.price}</td>
                </tr>
            `;
      total += product.price;
    });
    document.querySelector("table").innerHTML += tableContent;
    document.querySelector("#total").innerHTML = `Total: $${total}`;
  });

// Remove product
function removeProduct(id) {
  let products = JSON.parse(localStorage.getItem("products"));
  products = products.filter((product) => product.id !== id);
  localStorage.setItem("products", JSON.stringify(products));

  //     // Update the table content
  let tableContent = "";
  let total = 0;
  products.forEach((product) => {
    tableContent += `
            <tr>
                <td><button onclick="removeProduct(${product.id})"><i class="bi bi-trash"></i></button></td>
                <td><img src="${product.image}" alt="Product Image" width="50"></td>
                <td>${product.name}</td>
                <td>$${product.price}</td>
                <td><input type="number" value="1" min="1" onchange="updateQuantity(${product.id}, this.value)"></td>
                <td id="total-${product.id}">$${product.price}</td>
            </tr>
        `;
    total += product.price;
  });
  document.querySelector("table").innerHTML = tableContent;
  document.querySelector("#total").innerHTML = `Total: $${total}`;
}

// Update quantity
function updateQuantity(id, quantity) {
  let products = JSON.parse(localStorage.getItem("products"));
  const product = products.find((product) => product.id === id);
  product.price = product.price * quantity;
  localStorage.setItem("products", JSON.stringify(products));
  document.querySelector(`#total-${id}`).innerText = `$${product.price}`;
}

// Calculate the total amount
function calculateTotal() {
  let products = JSON.parse(localStorage.getItem("products"));
  let total = 0;
  products.forEach((product) => {
    total += product.price;
  });
  return total;
}

// Update total amount in Cart Total
function updateTotal() {
  let total = calculateTotal();
  document.querySelector(".subtotal h6:last-child").innerText = `$${total}`;
  document.querySelector(".total h6:last-child").innerText = `$${total}`;
}

// Call function updateTotal when click the Update button
document.querySelector(".btn-update").addEventListener("click", updateTotal);
// Update row total
function updateRowTotal(id, total) {
  document.querySelector(`#total-${id}`).innerText = `$${total}`;
}

// Update the table content
function updateTableContent(products) {
  let tableContent = `
        <thead>
            <tr>
                <th>Remove</th>
                <th>Images</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
    `;
  let total = 0;
  products.forEach((product) => {
    tableContent += `
            <tr>
                <td><button onclick="removeProduct(${product.id})"><i class="bi bi-trash"></i></button></td>
                <td><img src="${product.image}" alt="Product Image" width="50"></td>
                <td>${product.name}</td>
                <td>$${product.price}</td>
                <td><input type="number" value="1" min="1" onchange="updateQuantity(${product.id}, this.value)"></td>
                <td id="total-${product.id}">$${product.price}</td>
            </tr>
        `;
    total += product.price;
  });
  tableContent += "</tbody>";
  document.querySelector(".header-table").innerHTML = tableContent;
  updateTotal();
}
