const products = [
  {
    id: 1,
    name: "~ Haru Matcha Bear ~",
    category: "videojuegos",
    price: 24.99,
    img: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=400&auto=format&fit=crop",
    desc: "Oso de felpa verde salvia tradicional, súper suave."
  },
  {
    id: 2,
    name: "~ Haru Moss Mini Llavero ~",
    category: "llaveros",
    price: 12.50,
    img: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&auto=format&fit=crop",
    desc: "Tamaño bolsillo con enganche de metal vintage."
  },
  {
    id: 3,
    name: "~ Haru Fairy Forest Bear ~",
    category: "combos",
    price: 32.00,
    img: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&auto=format&fit=crop",
    desc: "Combo edición limitada con alitas de duende tejido."
  },
  {
    id: 4,
    name: "~ Cardigan Verde para Oso ~",
    category: "liquidacion",
    price: 9.99,
    img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop",
    desc: "Suéter tejido a mano a la medida del oso clásico."
  },
  {
    id: 5,
    name: "~ Haru Clover Honey Bear ~",
    category: "videojuegos",
    price: 26.50,
    img: "https://images.unsplash.com/photo-1556012018-50c5c0da73bf?w=400&auto=format&fit=crop",
    desc: "Color crema con detalles de tréboles bordados."
  },
  {
    id: 6,
    name: "~ Haru Froggy Hat Bear ~",
    category: "combos",
    price: 29.99,
    img: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop",
    desc: "Combo oso con sombrerito tejido de rana + llavero."
  }
];

let cart = [];
let currentCategory = 'all';
let selectedProduct = null;
let isPlaying = false;
const WHATSAPP_NUMBER = "59170000000";

window.addEventListener('load', () => {
  document.getElementById('loading-spinner').style.display = 'none';
});

function toggleSidebar() {
  document.getElementById('sidebarMenu').classList.toggle('sidebar--open');
}

function renderProducts(list) {
  const grid = document.getElementById('productsGrid');
  const count = document.getElementById('productCount');

  grid.innerHTML = '';
  count.textContent = `Mostrando ${list.length} productos`;

  if (list.length === 0) {
    grid.innerHTML = '<p>No se encontraron ositos :(</p>';
    return;
  }

  list.forEach(p => {
    grid.innerHTML += `
      <article class="product-card">
        <img src="${p.img}" alt="${p.name}" class="product-card__img" onclick="openProductModal(${p.id})">
        <h3 class="product-card__name" onclick="openProductModal(${p.id})">${p.name}</h3>
        <p class="product-card__desc">${p.desc}</p>
        <div class="product-card__bottom">
          <span class="product-card__price">$${p.price.toFixed(2)}</span>
          <button type="button" class="btn" onclick="addToCart(${p.id})">+ Agregar</button>
        </div>
      </article>
    `;
  });
}

function filterCategory(cat, btn) {
  currentCategory = cat;
  document.querySelectorAll('.categories__btn').forEach(b => b.classList.remove('categories__btn--active'));
  btn.classList.add('categories__btn--active');
  filterProducts();
}

function filterProducts() {
  const text = document.getElementById('searchInput').value.toLowerCase();

  const filtered = products.filter(p => {
    const matchCat = currentCategory === 'all' || p.category === currentCategory;
    const matchText = p.name.toLowerCase().includes(text) || p.desc.toLowerCase().includes(text);
    return matchCat && matchText;
  });

  renderProducts(filtered);
}

function openProductModal(id) {
  selectedProduct = products.find(p => p.id === id);
  document.getElementById('modalTitle').textContent = selectedProduct.name;
  document.getElementById('modalImage').src = selectedProduct.img;
  document.getElementById('modalDesc').textContent = selectedProduct.desc;
  document.getElementById('modalPrice').textContent = `$${selectedProduct.price.toFixed(2)}`;
  document.getElementById('productModal').classList.add('modal--active');
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('modal--active');
}

function addModalToCart() {
  if (selectedProduct) {
    addToCart(selectedProduct.id);
    closeProductModal();
  }
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const item = cart.find(i => i.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  document.getElementById('cartDrawer').classList.add('cart-drawer--open');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  const container = document.getElementById('cartItems');
  const count = document.getElementById('cartCount');
  const totalEl = document.getElementById('cartTotal');

  container.innerHTML = '';
  let total = 0;
  let qtyTotal = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    qtyTotal += item.qty;

    container.innerHTML += `
      <div class="cart-drawer__item">
        <div>
          <div class="cart-drawer__item-title">${item.name} (x${item.qty})</div>
          <div class="cart-drawer__item-price">$${(item.price * item.qty).toFixed(2)}</div>
        </div>
        <button type="button" class="btn" onclick="removeFromCart(${index})">✕</button>
      </div>
    `;
  });

  count.textContent = qtyTotal;
  totalEl.textContent = `$${total.toFixed(2)}`;
}

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('cart-drawer--open');
}

function sendWhatsAppCartOrder() {
  if (cart.length === 0) {
    alert("Tu carrito está vacío 🧸");
    return;
  }

  let total = 0;
  let msg = "¡Hola Haru Store! 🌸 Quiero pedir:\n\n";

  cart.forEach((item, i) => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    msg += `${i + 1}. ${item.name} (x${item.qty}) - $${subtotal.toFixed(2)}\n`;
  });

  msg += `\nTotal: $${total.toFixed(2)}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

function toggleMusic() {
  isPlaying = !isPlaying;
  document.getElementById('vinyl').classList.toggle('music-player__vinyl--playing', isPlaying);
  document.getElementById('equalizer').classList.toggle('music-player__eq--active', isPlaying);
}

function openAdminModal() {
  document.getElementById('adminModal').classList.add('modal--active');
}

function closeAdminModal() {
  document.getElementById('adminModal').classList.remove('modal--active');
}

function loginAdmin() {
  document.getElementById('adminLoginForm').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'block';
}

function logoutAdmin() {
  document.getElementById('adminLoginForm').style.display = 'block';
  document.getElementById('adminPanel').style.display = 'none';
}

renderProducts(products);