// =============================================
// CREDENCIALES POR DEFECTO (temporal)
// Reemplazar por conexión a BD más adelante
// =============================================
const DEFAULT_USER = 'josefita';
const DEFAULT_PASS = '1234';

let currentUser  = null;
let pendingFavId = null; // favorito pendiente antes del login

// =============================================
// DATOS DE PRODUCTOS
// Categorías: camisetas | deportivas | polos | blusas
// =============================================
const products = [
  // — HOMBRES —
  { id:1,  name:"Camiseta FC Barcelona",    price:"$50.000", category:"deportivas", gender:"hombres",
    img:"https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80", fav:false },
  { id:2,  name:"Camiseta Real Madrid",     price:"$55.000", category:"deportivas", gender:"hombres",
    img:"https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&q=80", fav:false },
  { id:3,  name:"Camiseta Básica Blanca",   price:"$28.000", category:"camisetas",  gender:"hombres",
    img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80", fav:false },
  { id:4,  name:"Camiseta Negra Slim",      price:"$30.000", category:"camisetas",  gender:"hombres",
    img:"https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80", fav:false },
  { id:5,  name:"Polo Casual Azul",         price:"$32.000", category:"polos",      gender:"hombres",
    img:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80", fav:false },
  // — MUJERES —
  { id:6,  name:"Blusa Elegante Roja",      price:"$38.000", category:"blusas",     gender:"mujeres",
    img:"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80", fav:false },
  { id:7,  name:"Blusa Casual Rosa",        price:"$34.000", category:"blusas",     gender:"mujeres",
    img:"https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&q=80", fav:false },
  { id:8,  name:"Camiseta Oversize Mujer",  price:"$29.000", category:"camisetas",  gender:"mujeres",
    img:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80", fav:false },
  { id:9,  name:"Camiseta Deportiva Mujer", price:"$45.000", category:"deportivas", gender:"mujeres",
    img:"https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80", fav:false },
  { id:10, name:"Polo Clásico Mujer",       price:"$36.000", category:"polos",      gender:"mujeres",
    img:"https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80", fav:false },
];

const categoryLabels = {
  camisetas:'Camiseta', deportivas:'Deportiva', polos:'Polo', blusas:'Blusa'
};

let activeCategory = 'todos';
let activeGender   = 'todos';

// =============================================
// RENDER DE TARJETAS
// =============================================
function renderProducts() {
  const grid = document.getElementById('products-grid');
  const filtered = products.filter(p => {
    const catOk = activeCategory === 'todos' || p.category === activeCategory;
    const genOk = activeGender   === 'todos' || p.gender   === activeGender;
    return catOk && genOk;
  });

  const titles = { todos:'Todos los Productos', hombres:'Hombres', mujeres:'Mujeres' };
  document.getElementById('section-title').textContent = titles[activeGender];
  document.getElementById('product-count').textContent =
    `${filtered.length} producto${filtered.length !== 1 ? 's' : ''} disponible${filtered.length !== 1 ? 's' : ''}`;

  grid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div class="product-img-wrapper">
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
        <span class="product-badge">${categoryLabels[p.category]}</span>
      </div>
      <div class="product-body">
        <p class="product-name">${p.name}</p>
        <p class="product-price">${p.price}</p>
      </div>
      <div class="product-actions">
        <button class="btn-fav ${p.fav ? 'active' : ''}"
          title="${currentUser ? 'Guardar en favoritos' : 'Inicia sesión para guardar favoritos'}"
          onclick="toggleFav(${p.id})">
          ${p.fav ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  `).join('');
}

// =============================================
// FILTROS
// =============================================
function filterCategory(cat, btn) {
  activeCategory = cat;
  document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts();
}

function filterGender(gender, btn) {
  activeGender = gender;
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts();
}

// =============================================
// FAVORITOS — requiere sesión activa
// =============================================
function toggleFav(id) {
  if (!currentUser) {
    pendingFavId = id;
    openModal();
    return;
  }
  const p = products.find(x => x.id === id);
  p.fav = !p.fav;
  renderProducts();
  updateFavPanel();
  showToast(p.fav ? '❤️ Añadido a favoritos' : '🤍 Eliminado de favoritos');
}

// =============================================
// PANEL DE FAVORITOS EN HEADER
// =============================================
function toggleFavPanel() {
  const panel = document.getElementById('fav-panel');
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) {
    updateFavPanel();
  }
}

function updateFavPanel() {
  const favProducts = products.filter(p => p.fav);
  const listEl      = document.getElementById('fav-panel-list');
  const emptyEl     = document.getElementById('fav-panel-empty');
  const countEl     = document.getElementById('fav-count');
  const btnEl       = document.getElementById('fav-header-btn');

  // Actualizar contador del botón
  if (favProducts.length > 0) {
    countEl.textContent = favProducts.length;
    countEl.style.display = 'flex';
    btnEl.textContent = ''; // limpiar para re-renderizar con el span
    btnEl.innerHTML = `❤️ <span class="fav-count" id="fav-count">${favProducts.length}</span>`;
  } else {
    btnEl.innerHTML = `🤍 <span class="fav-count" id="fav-count" style="display:none">0</span>`;
  }

  // Renderizar lista de favoritos
  if (favProducts.length === 0) {
    listEl.innerHTML = '';
    emptyEl.style.display = 'block';
    return;
  }

  emptyEl.style.display = 'none';
  listEl.innerHTML = favProducts.map(p => `
    <div class="fav-item">
      <img src="${p.img}" alt="${p.name}" />
      <div class="fav-item-info">
        <p class="fav-item-name">${p.name}</p>
        <p class="fav-item-price">${p.price}</p>
      </div>
      <button class="fav-item-remove" onclick="removeFav(${p.id})" title="Quitar de favoritos">✕</button>
    </div>
  `).join('');
}

function removeFav(id) {
  const p = products.find(x => x.id === id);
  p.fav = false;
  renderProducts();
  updateFavPanel();
  showToast('🤍 Eliminado de favoritos');
}

// Cerrar panel al hacer clic fuera
document.addEventListener('click', function(e) {
  const wrapper = document.querySelector('.fav-wrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    document.getElementById('fav-panel').classList.remove('open');
  }
});

// =============================================
// SESIÓN
// =============================================
function handleLoginBtn() {
  if (currentUser) {
    currentUser = null;
    products.forEach(p => p.fav = false);
    updateLoginBtn();
    updateFavPanel();
    renderProducts();
    showToast('👋 Sesión cerrada');
  } else {
    openModal();
  }
}

function openModal() {
  document.getElementById('input-user').value = '';
  document.getElementById('input-pass').value = '';
  document.getElementById('modal-error').textContent = '';
  document.getElementById('modal-overlay').classList.add('open');
  setTimeout(() => document.getElementById('input-user').focus(), 100);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  pendingFavId = null;
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

function submitLogin() {
  const user    = document.getElementById('input-user').value.trim();
  const pass    = document.getElementById('input-pass').value;
  const errorEl = document.getElementById('modal-error');

  if (!user || !pass) {
    errorEl.textContent = 'Por favor completa todos los campos.';
    return;
  }
  if (user !== DEFAULT_USER || pass !== DEFAULT_PASS) {
    errorEl.textContent = '❌ Usuario o contraseña incorrectos.';
    document.getElementById('input-pass').value = '';
    document.getElementById('input-pass').focus();
    return;
  }

  // Login exitoso
  currentUser = user;
  closeModal();
  updateLoginBtn();
  showToast(`✅ ¡Bienvenido, ${user}!`);

  if (pendingFavId !== null) {
    toggleFav(pendingFavId);
    pendingFavId = null;
  } else {
    renderProducts();
  }
}

function updateLoginBtn() {
  const btn = document.getElementById('login-btn');
  if (currentUser) {
    btn.textContent = `👤 ${currentUser}  ·  Cerrar sesión`;
    btn.classList.add('logged-in');
  } else {
    btn.textContent = '→ Iniciar sesión';
    btn.classList.remove('logged-in');
  }
}

// =============================================
// TOAST
// =============================================
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

// =============================================
// INIT
// =============================================
renderProducts();
