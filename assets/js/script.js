let currentProduct = "";
let currentPrice = 0;
let cart = JSON.parse(localStorage.getItem("cart")) || [];

updateCartCount();

const modalElement = document.getElementById("productModal");
const bootstrapModal = new bootstrap.Modal(modalElement);
// clearing cart
function ClearCart(){
  cart.splice(0 , cart.length);
  localStorage.removeItem("cart");
  renderCart();
  updateCartCount();
}

const clearBtn = document.getElementById("clear");
clearBtn.addEventListener("click" , ClearCart);


document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("authForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const user = {
      name: document.getElementById("authName").value,
      email: document.getElementById("authEmail").value,
      phone: document.getElementById("authPhone").value,
      address: document.getElementById("authAddress").value,
      password: document.getElementById("authPassword").value
    };

    localStorage.setItem("loggedInUser", JSON.stringify(user));
    document.getElementById("profileIcon").innerHTML =
      `<i class="bi bi-person-check-fill fs-5 text-success"></i>`;
    const modalElement = document.getElementById("authModal");
    const authModal = bootstrap.Modal.getOrCreateInstance(modalElement);
    authModal.hide();
    buildProfileDropdown();
    location.reload();
  });

  updateCartCount();
});
function buildProfileDropdown() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const dropdown = document.getElementById("profileDropdown");
  dropdown.innerHTML = ""; // Clear previous

  if (user) {
    dropdown.innerHTML = `
      <li><a class="dropdown-item" href="#" onclick="showAccountModal()">Account Info</a></li>
      <li><a class="dropdown-item" href="#" onclick="showOrdersModal()">Past Orders</a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item text-danger" href="#" onclick="logout()">Log Out</a></li>
    `;
  } else {
    dropdown.innerHTML = `
      <li><a class="dropdown-item" href="#" onclick="showAuthModal()">Sign In</a></li>
    `;
  }
}
function showAuthModal() {
  new bootstrap.Modal(document.getElementById("authModal")).show();
}
document.addEventListener("DOMContentLoaded", function () {
  buildProfileDropdown();
});

function updatePopupPrice() {
  const qty = parseInt(document.getElementById("popupQty").value);
  const total = currentPrice * qty;
  document.getElementById("popupPrice").innerText = `Total: ${total.toFixed(2)} EG`;
}

function popupIncreaseQty() {
  let qty = document.getElementById("popupQty");
  qty.value = parseInt(qty.value) + 1;
  updatePopupPrice();
}

function popupDecreaseQty() {
  let qty = document.getElementById("popupQty");
  if (parseInt(qty.value) > 1) {
    qty.value = parseInt(qty.value) - 1;
    updatePopupPrice();
  }
}

function openPopup(productName, imageUrl, price) {
  currentProduct = productName;
  currentPrice = price;
  document.getElementById("popupTitle").innerText = productName;
  document.getElementById("popupImage").src = imageUrl;
  document.getElementById("popupQty").value = 1;
  updatePopupPrice();
  bootstrapModal.show();
}

function closePopup() {
  bootstrapModal.hide();
}

function confirmAddToCart() {

  // No need to authenticate user in adding products to cart


  // const user = localStorage.getItem("loggedInUser");
  // if (!user) {
  //   showToast("⚠️ Please sign in or register before adding to cart.");
  //   bootstrapModal.hide();
  //   new bootstrap.Modal(document.getElementById("authModal")).show();
  //   return;
  // }

  const qty = parseInt(document.getElementById("popupQty").value);
  const image = document.getElementById("popupImage").src;
  addProductToCart(currentProduct, currentPrice, qty, image);
  showToast(`✅ ${currentProduct} (x${qty}) added to cart`);
  bootstrapModal.hide();
}

function showToast(message) {
  const toastEl = document.getElementById("toast");
  const toastBody = document.getElementById("toastBody");
  toastBody.textContent = message;

  const bsToast = new bootstrap.Toast(toastEl);
  bsToast.show();
}

function addProductToCart(name, price, quantity = 1, image = "") {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ name, price, quantity, image });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  document.getElementById('menu-indicator').classList.remove('d-none');
}

document.querySelector('.bi-cart3').addEventListener('click', () => {
  renderCart();
  const cartModalEl = document.getElementById('cartModal');
  const cartModal = bootstrap.Offcanvas.getOrCreateInstance(cartModalEl);
  cartModal.show();

  cartModalEl.addEventListener('hidden.bs.offcanvas', () => {
    document.body.classList.remove('offcanvas-backdrop');
    document.querySelector('.offcanvas-backdrop')?.remove();
  }, { once: true });

  document.getElementById('menu-indicator').classList.add('d-none');
});

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').innerText = count;
  const indicator = document.getElementById('menu-indicator');
  if (count > 0) indicator.classList.remove('d-none');
}

function renderCart() {
  const list = document.getElementById('cartItemsList');
  const totalEl = document.getElementById('cartTotal');
  list.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    list.innerHTML = `<li class="list-group-item text-center text-muted">No items in your cart</li>`;
    totalEl.innerText = `0.00 EG`;
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `
      <div class="row align-items-center">
        <div class="col-md-2"><img src="${item.image}" alt="${item.name}" width="50" height="50" style="object-fit: cover; border-radius: 5px;"></div>
        <div class="col-md-4"><strong>${item.name}</strong></div>
        <div class="col-md-2">${item.price.toFixed(2)} EG</div>
        <div class="col-md-3">
          <div class="input-group w-100">
            <button class="btn btn-outline-secondary btn-decrease" data-index="${index}">-</button>
            <input type="number" class="form-control text-center qty-input" data-index="${index}" value="${item.quantity}" readonly>
            <button class="btn btn-outline-secondary btn-increase" data-index="${index}">+</button>
          </div>
        </div>
        <div class="col-md-2 fw-bold item-total">${itemTotal.toFixed(2)} EG</div>
        <div class="col-md-1 text-end">
          <button class="btn btn-sm btn-danger btn-remove" data-index="${index}">&times;</button>
        </div>
      </div>
    `;
    list.appendChild(li);
  });




  totalEl.innerText = `${total.toFixed(2)} EG`;

  list.querySelectorAll('.btn-increase').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.dataset.index);
      cart[index].quantity++;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      updateCartCount();
    });
  });

  list.querySelectorAll('.btn-decrease').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.dataset.index);
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        updateCartCount();
      }
    });
  });

  list.querySelectorAll('.btn-remove').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.dataset.index);
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      updateCartCount();
    });
  });
}

function startPayment(method) {
  const select = document.getElementById("selectedPaymentMethod");
  const cardDetails = document.getElementById("cardDetails");

  select.value = method;
  select.setAttribute("disabled", true);

  const user = localStorage.getItem('loggedInUser');
  if (!user) {
    showToast("⚠️ Please log in to proceed");
    new bootstrap.Modal(document.getElementById('authModal')).show();
    return;
  }

  if (cart.length === 0) {
    alert("The cart is empty");
    return;
  }

  if (method === 'Credit Card') {
    cardDetails.style.display = 'block';
    cardDetails.querySelectorAll('input').forEach(input => input.setAttribute('required', 'required'));
  } else {
    cardDetails.style.display = 'none';
    cardDetails.querySelectorAll('input').forEach(input => input.removeAttribute('required'));
  }

  new bootstrap.Modal(document.getElementById("paymentSection")).show();
}

function confirmOrder() {
  const method = document.getElementById('selectedPaymentMethod').value;
  if (!method) {
    alert("No payment method selected.");
    return;
  }

  if (method === 'Credit Card') {
    const cardNumber = document.querySelector('#cardDetails input[placeholder="1234 5678 9012 3456"]').value;
    const expiry = document.querySelector('#cardDetails input[placeholder="MM/YY"]').value;
    const cvv = document.querySelector('#cardDetails input[placeholder="123"]').value;

    if (!cardNumber || !expiry || !cvv) {
      alert("Please fill out credit card details.");
      return;
    }
  }

  const confirmedOrder = {
    date: new Date().toLocaleString(),
    method,
    items: [...cart]
  };

  // Save the order to localStorage
  let pastOrders = JSON.parse(localStorage.getItem("pastOrders")) || [];
  pastOrders.push(confirmedOrder);
  localStorage.setItem("pastOrders", JSON.stringify(pastOrders));

  // UI feedback
  document.getElementById('confirmationMethod').innerText = method;
  bootstrap.Modal.getInstance(document.getElementById('paymentSection')).hide();
  new bootstrap.Modal(document.getElementById('orderConfirmedModal')).show();

  ClearCart();
  updateCartCount();
  renderCart();
}


document.getElementById('paymentMethod')?.addEventListener('change', function () {
  document.getElementById('cardDetails').style.display = this.value === 'Credit Card' ? 'block' : 'none';
});

function handleProfileClick() {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (user) {
    showAccountModal(user);
  } else {
    new bootstrap.Modal(document.getElementById("authModal")).show();
  }
}

function showAccountModal() {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (user) {
    document.getElementById("accountDetails").innerHTML = `
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone:</strong> ${user.phone}</p>
      <p><strong>Address:</strong> ${user.address}</p>
    `;
    new bootstrap.Modal(document.getElementById("accountModal")).show();
  }
}
function showOrdersModal() {
  // Add logic later to fetch and show past orders
  new bootstrap.Modal(document.getElementById("ordersModal")).show();
}

function logout() {
  localStorage.removeItem("loggedInUser");
  document.getElementById("profileIcon").innerHTML = `<i class="bi bi-person-circle fs-5"></i>`;
  location.reload();
  bootstrap.Modal.getInstance(document.getElementById("accountModal")).hide();
  showToast("Logged out successfully");
}

document.addEventListener("DOMContentLoaded", () => {
  const backToTopBtn = document.getElementById("backToTopBtn");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.remove("d-none");
    } else {
      backToTopBtn.classList.add("d-none");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// ✅ Sync cart between tabs/pages
window.addEventListener('storage', function (e) {
  if (e.key === 'cart') {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCartCount();
    renderCart();
  }
});
function showOrdersModal() {
  const ordersContainer = document.getElementById("ordersContent");
  const pastOrders = JSON.parse(localStorage.getItem("pastOrders")) || [];

  if (pastOrders.length === 0) {
    ordersContainer.innerHTML = `<p class="text-muted text-center">You have no past orders.</p>`;
  } else {
    ordersContainer.innerHTML = pastOrders.map((order, index) => `
      <div class="border rounded-3 p-3 mb-4">
        <h6 class="mb-2 text-success">Order #${index + 1}</h6>
        <p class="mb-1"><strong>Date:</strong> ${order.date}</p>
        <p class="mb-1"><strong>Payment Method:</strong> ${order.method}</p>
        <ul class="list-group mt-2">
          ${order.items.map(item => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>${item.name}</strong><br/>
                <small>Qty: ${item.quantity}</small>
              </div>
              <span class="text-muted">${(item.price * item.quantity).toFixed(2)} EG</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `).join('');
  }

  new bootstrap.Modal(document.getElementById("ordersModal")).show();
}

const video = document.getElementById('clipVideo');

const startTime = 8;
const endTime = 15;

// Set initial playback when metadata is loaded
video.addEventListener('loadedmetadata', () => {
  video.currentTime = startTime;
  video.play();
});

// Loop manually between startTime and endTime
video.addEventListener('timeupdate', () => {
  if (video.currentTime >= endTime) {
    video.currentTime = startTime;
  }
});

// Listen for when the carousel changes
const carousel = document.getElementById('aboutVideoCarousel');
carousel.addEventListener('slid.bs.carousel', () => {
  // Check if the first video is the active one again
  if (video.closest('.carousel-item').classList.contains('active')) {
    video.currentTime = startTime;
    video.play();
  } else {
    video.pause();
  }
});
