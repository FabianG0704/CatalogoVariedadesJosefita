const API = '/api';
let products = [];
let currentUser = null;
let activeCategory = 'todos';
let activeGender = 'todos';
let editingId = null;
let deletingId = null;

async function fetchAPI(url, options = {}) {
    const res = await fetch(API + url, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

async function cargarProductos() {
    try {
        products = await fetchAPI('/prendas');
        renderProducts();
    } catch (e) {
        showToast('Error al cargar productos');
    }
}

function renderProducts() {
    const grid = document.getElementById('products-grid');
    const filtered = products.filter(p => {
        const catOk = activeCategory === 'todos' || p.categoria === activeCategory;
        const genOk = activeGender === 'todos' || p.genero === activeGender;
        return catOk && genOk;
    });
    const titles = { todos: 'Todos los Productos', hombres: 'Hombres', mujeres: 'Mujeres' };
    document.getElementById('section-title').textContent = titles[activeGender];
    document.getElementById('product-count').textContent =
        `${filtered.length} producto${filtered.length !== 1 ? 's' : ''} disponible${filtered.length !== 1 ? 's' : ''}`;
    const isAdmin = currentUser !== null;
    grid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <div class="product-img-wrapper">
                <img src="${p.imagenUrl || 'https://via.placeholder.com/400x500?text=Sin+imagen'}" alt="${p.nombre}" loading="lazy" />
                <span class="product-badge">${p.categoria}</span>
            </div>
            <div class="product-body">
                <p class="product-name">${p.nombre}</p>
                <p class="product-price">$${p.precio.toLocaleString()}</p>
                <p class="product-detail">${p.talla} | ${p.color}</p>
            </div>
            ${isAdmin ? `
            <div class="product-actions admin-actions">
                <button class="btn-edit" onclick="editarProducto(${p.id})" title="Editar">Editar</button>
                <button class="btn-delete" onclick="abrirConfirmarEliminar(${p.id})" title="Eliminar">Eliminar</button>
            </div>` : ''}
        </div>
    `).join('');
}

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

// LOGIN
function handleLoginBtn() {
    if (currentUser) {
        currentUser = null;
        document.getElementById('admin-sidebar').style.display = 'none';
        updateLoginBtn();
        renderProducts();
        showToast('Sesion cerrada');
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
}

function closeModalOutside(e) {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('open');
    }
}

async function submitLogin() {
    const user = document.getElementById('input-user').value.trim();
    const pass = document.getElementById('input-pass').value;
    const errorEl = document.getElementById('modal-error');
    if (!user || !pass) {
        errorEl.textContent = 'Por favor completa todos los campos.';
        return;
    }
    try {
        const data = await fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username: user, password: pass })
        });
        currentUser = data.username;
        closeModal();
        document.getElementById('admin-sidebar').style.display = 'block';
        updateLoginBtn();
        renderProducts();
        showToast('Bienvenido, ' + user + '!');
    } catch (e) {
        errorEl.textContent = 'Usuario o contrasena incorrectos.';
        document.getElementById('input-pass').value = '';
        document.getElementById('input-pass').focus();
    }
}

function updateLoginBtn() {
    const btn = document.getElementById('login-btn');
    if (currentUser) {
        btn.textContent = 'Admin  ·  Cerrar sesion';
        btn.classList.add('logged-in');
    } else {
        btn.textContent = 'Iniciar sesion';
        btn.classList.remove('logged-in');
    }
}

// CRUD MODAL
function openAddModal() {
    editingId = null;
    document.getElementById('modal-producto-title').textContent = 'Agregar Producto';
    document.getElementById('btn-guardar-producto').textContent = 'Guardar';
    document.getElementById('prod-nombre').value = '';
    document.getElementById('prod-talla').value = '';
    document.getElementById('prod-color').value = '';
    document.getElementById('prod-precio').value = '';
    document.getElementById('prod-categoria').value = 'camisetas';
    document.getElementById('prod-genero').value = 'hombres';
    document.getElementById('prod-imagen').value = '';
    document.getElementById('modal-producto-error').textContent = '';
    document.getElementById('modal-producto-overlay').classList.add('open');
}

function editarProducto(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    editingId = id;
    document.getElementById('modal-producto-title').textContent = 'Editar Producto';
    document.getElementById('btn-guardar-producto').textContent = 'Actualizar';
    document.getElementById('prod-nombre').value = p.nombre;
    document.getElementById('prod-talla').value = p.talla;
    document.getElementById('prod-color').value = p.color;
    document.getElementById('prod-precio').value = p.precio;
    document.getElementById('prod-categoria').value = p.categoria;
    document.getElementById('prod-genero').value = p.genero;
    document.getElementById('prod-imagen').value = p.imagenUrl || '';
    document.getElementById('modal-producto-error').textContent = '';
    document.getElementById('modal-producto-overlay').classList.add('open');
}

function cerrarModalProducto() {
    document.getElementById('modal-producto-overlay').classList.remove('open');
    editingId = null;
}

async function guardarProducto() {
    const nombre = document.getElementById('prod-nombre').value.trim();
    const talla = document.getElementById('prod-talla').value.trim();
    const color = document.getElementById('prod-color').value.trim();
    const precio = parseFloat(document.getElementById('prod-precio').value);
    const categoria = document.getElementById('prod-categoria').value;
    const genero = document.getElementById('prod-genero').value;
    const imagenUrl = document.getElementById('prod-imagen').value.trim();
    const errorEl = document.getElementById('modal-producto-error');
    if (!nombre || !talla || !color || !precio) {
        errorEl.textContent = 'Completa todos los campos obligatorios.';
        return;
    }
    const body = { nombre, talla, color, precio, categoria, genero, imagenUrl: imagenUrl || 'https://via.placeholder.com/400x500?text=Sin+imagen' };
    try {
        if (editingId) {
            await fetchAPI('/prendas/' + editingId, { method: 'PUT', body: JSON.stringify(body) });
            showToast('Producto actualizado');
        } else {
            await fetchAPI('/prendas', { method: 'POST', body: JSON.stringify(body) });
            showToast('Producto agregado');
        }
        cerrarModalProducto();
        await cargarProductos();
    } catch (e) {
        errorEl.textContent = 'Error al guardar el producto.';
    }
}

// DELETE CONFIRM
function abrirConfirmarEliminar(id) {
    deletingId = id;
    document.getElementById('confirmar-mensaje').textContent = 'Esta seguro de eliminar este producto?';
    document.getElementById('modal-confirmar-overlay').classList.add('open');
}

function cerrarConfirmar() {
    document.getElementById('modal-confirmar-overlay').classList.remove('open');
    deletingId = null;
}

async function confirmarEliminar() {
    if (!deletingId) return;
    try {
        await fetchAPI('/prendas/' + deletingId, { method: 'DELETE' });
        showToast('Producto eliminado');
        cerrarConfirmar();
        await cargarProductos();
    } catch (e) {
        showToast('Error al eliminar');
    }
}

// TOAST
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2400);
}

// INIT
cargarProductos();
