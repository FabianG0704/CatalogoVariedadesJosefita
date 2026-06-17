// =============================================
// URL BASE DEL BACKEND (Spring Boot)
// =============================================
// API_URL viene de config.js

// =============================================
// SESIÓN
// =============================================
let currentUser  = null;
let pendingFavId = null;
let modoModal    = "login";

// =============================================
// DATOS DE PRODUCTOS
// =============================================
let products = [];

const GENERO_MAP = {
  "Masculino": "hombres",
  "Femenino":  "mujeres",
  "Otro":      "todos"
};

const categoryLabels = {
  camisetas:  "Camiseta",
  deportivas: "Deportiva",
  polos:      "Polo",
  blusas:     "Blusa"
};

let activeCategory = "todos";
let activeGender   = "todos";
let adminProductModalMode = null;
let editingPrendaId = null;

const SEXO_OPTIONS = [
  { id: "M", label: "Masculino" },
  { id: "F", label: "Femenino" },
  { id: "O", label: "Otro" }
];

// =============================================
// CARGA INICIAL DESDE LA API
// =============================================
async function cargarPrendas() {
  try {
    const res = await fetch(`${API_URL}/api/prendas`);
    if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
    const prendas = await res.json();

    products = prendas.map(p => ({
      id:       p.id,
      name:     p.nombre,
      rawPrice: p.precio,
      price:    formatearPrecio(p.precio),
      category: inferirCategoria(p.nombre),
      gender:   GENERO_MAP[p.sexo?.descripcion] ?? "todos",
      sexoId:   p.sexo?.id ?? "M",
      talla:    p.talla,
      color:    p.color,
      imagen:   p.imagen,
      img:      p.imagen
                  ? (p.imagen.startsWith("http") ? p.imagen : `${API_URL}/imagenes/${p.imagen}`)
                  : null,
      fav:      false
    }));

    renderProducts();
    if (currentUser) {
      await cargarFavoritos(currentUser.cedula);
    }
  } catch (err) {
    console.error("No se pudo conectar con el backend:", err);
    mostrarErrorConexion();
  }
}

function formatearPrecio(precio) {
  return "$" + Number(precio).toLocaleString("es-CO");
}

function inferirCategoria(nombre) {
  const n = nombre.toLowerCase();
  if (n.includes("blusa"))     return "blusas";
  if (n.includes("polo"))      return "polos";
  if (n.includes("deportiv") || n.includes("fútbol") || n.includes("futbol")) return "deportivas";
  return "camisetas";
}

function mostrarErrorConexion() {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = `
    <div style="grid-column:1/-1; text-align:center; padding:3rem; color:#888;">
      <p style="font-size:2rem;">⚠️</p>
      <p>No se pudo conectar con el servidor.</p>
      <p style="font-size:.9rem;">Verifica que Spring Boot esté corriendo en <strong>${API_URL}</strong>.</p>
    </div>`;
}

// =============================================
// RENDER DE TARJETAS
// =============================================
function renderProducts() {
  const grid     = document.getElementById("products-grid");
  const esAdmin  = currentUser?.esAdmin === true;
  const filtered = products.filter(p => {
    const catOk = activeCategory === "todos" || p.category === activeCategory;
    const genOk = activeGender   === "todos" || p.gender   === activeGender;
    return catOk && genOk;
  });

  const titles = { todos:"Todos los Productos", hombres:"Hombres", mujeres:"Mujeres" };
  document.getElementById("section-title").textContent = titles[activeGender];
  document.getElementById("product-count").textContent =
    `${filtered.length} producto${filtered.length !== 1 ? "s" : ""} disponible${filtered.length !== 1 ? "s" : ""}`;

  // Botón de agregar producto (solo admin)
  let btnAgregar = document.getElementById("btn-agregar-producto");
  if (esAdmin) {
    if (!btnAgregar) {
      btnAgregar = document.createElement("button");
      btnAgregar.id = "btn-agregar-producto";
      btnAgregar.textContent = "＋ Agregar producto";
      btnAgregar.className = "btn-submit";
      btnAgregar.style.cssText = "margin:1rem 0; padding:.6rem 1.4rem;";
      btnAgregar.onclick = abrirModalAgregarProducto;
      document.getElementById("product-count").insertAdjacentElement("afterend", btnAgregar);
    }
  } else {
    btnAgregar?.remove();
  }

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#888;padding:2rem;">
      No hay productos en esta categoría todavía.</p>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div class="product-img-wrapper">
        ${p.img
          ? `<img src="${p.img}" alt="${p.name}" loading="lazy"
                  onerror="this.src='https://placehold.co/400x400?text=Sin+foto'" />`
          : `<div style="width:100%;aspect-ratio:1;background:#f0f0f0;display:flex;
                         align-items:center;justify-content:center;color:#aaa;
                         font-size:.9rem;flex-direction:column;gap:.4rem;">
               <span style="font-size:2rem;">📷</span> Sin foto
             </div>`
        }
        <span class="product-badge">${categoryLabels[p.category] ?? p.category}</span>

        ${esAdmin ? `
        <div class="upload-overlay" id="overlay-${p.id}">
          <label class="btn-upload" title="Subir foto">
            📷 Subir foto
            <input type="file" accept="image/*" style="display:none"
                   onchange="subirFoto(event, ${p.id})" />
          </label>
          <span class="upload-status" id="status-${p.id}"></span>
        </div>` : ""}
      </div>
      <div class="product-body">
        <p class="product-name">${p.name}</p>
        <p class="product-price">${p.price}</p>
      </div>
      <div class="product-actions">
        <button class="btn-fav ${p.fav ? "active" : ""}"
          title="${currentUser ? "Guardar en favoritos" : "Inicia sesión para guardar favoritos"}"
          onclick="toggleFav(${p.id})">
          ${p.fav ? "❤️" : "🤍"}
        </button>
        ${esAdmin ? `
        <button class="btn-upload" style="font-size:.8rem;padding:.3rem .7rem;margin-left:.5rem;"
          onclick="abrirModalEditarProducto(${p.id})">✏️ Editar</button>
        <button class="btn-upload" style="font-size:.8rem;padding:.3rem .7rem;margin-left:.4rem;background:#c0392b;"
          onclick="confirmarEliminar(${p.id})">❌ Eliminar</button>
        ` : ""}
      </div>
    </div>
  `).join("");
}

function abrirModalAgregarProducto() {
  adminProductModalMode = "agregar";
  editingPrendaId = null;
  renderProductoModal();
  document.getElementById("modal-overlay").classList.add("open");
  setTimeout(() => document.getElementById("modal-nombre")?.focus(), 100);
}

function abrirModalEditarProducto(id) {
  adminProductModalMode = "editar";
  editingPrendaId = id;
  renderProductoModal();
  document.getElementById("modal-overlay").classList.add("open");
  setTimeout(() => document.getElementById("modal-nombre")?.focus(), 100);
}

function confirmarEliminar(id) {
  if (!confirm("¿Deseas eliminar este producto?")) return;
  eliminarProducto(id);
}

async function eliminarProducto(id) {
  try {
    const res = await fetch(`${API_URL}/api/prendas/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("No se pudo eliminar el producto.");
    products = products.filter(p => p.id !== id);
    renderProducts();
    showToast("✅ Producto eliminado");
  } catch (err) {
    console.error(err);
    showToast("❌ Error al eliminar el producto");
  }
}

function renderProductoModal() {
  const body = document.getElementById("modal-body");
  const esAdmin = currentUser?.esAdmin === true;
  if (!esAdmin) {
    body.innerHTML = `<p>No autorizado.</p>`;
    return;
  }

  const isEditar = adminProductModalMode === "editar";
  const producto = isEditar ? products.find(p => p.id === editingPrendaId) : null;
  const nombre = producto?.name ?? "";
  const talla = producto?.talla ?? "";
  const color = producto?.color ?? "";
  const precio = producto?.rawPrice ?? "";
  const sexoId = producto?.sexoId ?? "M";

  body.innerHTML = `
    <div class="modal-title">${isEditar ? "Editar producto" : "Agregar producto"}</div>
    <div class="form-group">
      <label>Nombre</label>
      <input type="text" id="modal-nombre" value="${nombre}" />
    </div>
    <div class="form-group">
      <label>Talla</label>
      <input type="text" id="modal-talla" value="${talla}" />
    </div>
    <div class="form-group">
      <label>Color</label>
      <input type="text" id="modal-color" value="${color}" />
    </div>
    <div class="form-group">
      <label>Precio</label>
      <input type="number" id="modal-precio" step="0.01" value="${precio}" />
    </div>
    <div class="form-group">
      <label>Género</label>
      <select id="modal-sexo">
        ${SEXO_OPTIONS.map(option => `
          <option value="${option.id}" ${sexoId === option.id ? "selected" : ""}>
            ${option.label}
          </option>
        `).join("")}
      </select>
    </div>
    <p style="font-size:.85rem;color:#666;margin-bottom:1rem;">
      La imagen se puede asignar luego con el botón de subir foto.
    </p>
    <p class="modal-error" id="modal-producto-error"></p>
    <div class="modal-actions">
      <button class="btn-submit" onclick="submitProductoModal()">
        ${isEditar ? "Guardar cambios" : "Agregar producto"}
      </button>
      <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
    </div>
  `;
}

async function submitProductoModal() {
  const nombre = document.getElementById("modal-nombre")?.value.trim();
  const talla = document.getElementById("modal-talla")?.value.trim();
  const color = document.getElementById("modal-color")?.value.trim();
  const precio = document.getElementById("modal-precio")?.value.trim();
  const sexoId = document.getElementById("modal-sexo")?.value;
  const errorEl = document.getElementById("modal-producto-error");

  if (!nombre || !talla || !color || !precio) {
    errorEl.textContent = "Por favor completa todos los campos.";
    return;
  }

  const body = {
    nombre,
    talla,
    color,
    precio: Number(precio),
    sexo: { id: sexoId }
  };

  if (adminProductModalMode === "agregar") {
    body.status = { id: 1 };
  }

  try {
    const url = adminProductModalMode === "editar"
      ? `${API_URL}/api/prendas/${editingPrendaId}`
      : `${API_URL}/api/prendas`;
    const method = adminProductModalMode === "editar" ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (!res.ok) {
      errorEl.textContent = data.error || "Error al guardar el producto.";
      return;
    }

    if (adminProductModalMode === "editar") {
      const index = products.findIndex(p => p.id === data.id);
      if (index >= 0) {
        products[index] = {
          ...products[index],
          name: data.nombre,
          talla: data.talla,
          color: data.color,
          rawPrice: data.precio,
          price: formatearPrecio(data.precio),
          sexoId: data.sexo?.id ?? products[index].sexoId,
          gender: GENERO_MAP[data.sexo?.descripcion] ?? products[index].gender,
          imagen: data.imagen ?? products[index].imagen,
          img: data.imagen
            ? (data.imagen.startsWith("http") ? data.imagen : `${API_URL}/imagenes/${data.imagen}`)
            : products[index].img
        };
      }
      showToast("✅ Producto actualizado");
    } else {
      products.unshift({
        id: data.id,
        name: data.nombre,
        rawPrice: data.precio,
        price: formatearPrecio(data.precio),
        category: inferirCategoria(data.nombre),
        gender: GENERO_MAP[data.sexo?.descripcion] ?? "todos",
        sexoId: data.sexo?.id ?? "M",
        talla: data.talla,
        color: data.color,
        imagen: data.imagen,
        img: data.imagen
          ? (data.imagen.startsWith("http") ? data.imagen : `${API_URL}/imagenes/${data.imagen}`)
          : null,
        fav: false
      });
      showToast("✅ Producto agregado");
    }

    closeModal();
    renderProducts();
  } catch (err) {
    console.error(err);
    errorEl.textContent = "❌ Ocurrió un error al guardar el producto.";
  }
}

// =============================================
// SUBIR FOTO A CLOUDINARY (a través del back)
// =============================================
async function subirFoto(event, prendaId) {
  const file = event.target.files[0];
  if (!file) return;

  const statusEl = document.getElementById(`status-${prendaId}`);
  statusEl.textContent = "Subiendo...";

  try {
    // 1. Subir a Cloudinary a través del backend — devuelve la URL permanente
    const formData = new FormData();
    formData.append("file", file);

    const resUpload = await fetch(`${API_URL}/api/prendas/upload`, {
      method: "POST",
      body: formData
    });
    if (!resUpload.ok) throw new Error("Error al subir el archivo");
    const urlCloudinary = await resUpload.text();

    // 2. Asociar la URL de Cloudinary a la prenda
    const resAsignar = await fetch(
      `${API_URL}/api/prendas/${prendaId}/imagen?nombreArchivo=${encodeURIComponent(urlCloudinary)}`,
      { method: "PUT" }
    );
    if (!resAsignar.ok) throw new Error("Error al asociar la imagen");

    // 3. Actualizar el array local y re-renderizar
    const producto = products.find(p => p.id === prendaId);
    producto.img = urlCloudinary;

    statusEl.textContent = "✅";
    renderProducts();  // ← sin setTimeout, inmediato
    showToast("📷 Foto actualizada correctamente");

  } catch (err) {
    console.error(err);
    statusEl.textContent = "❌ Error";
    showToast("❌ No se pudo subir la foto");
  }
}

// =============================================
// FILTROS
// =============================================
function filterCategory(cat, btn) {
  activeCategory = cat;
  document.querySelectorAll(".sidebar-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderProducts();
}

function filterGender(gender, btn) {
  activeGender = gender;
  document.querySelectorAll(".filter-tab").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderProducts();
}

// =============================================
// FAVORITOS
// =============================================
function toggleFav(id) {
  if (!currentUser) {
    pendingFavId = id;
    abrirModalLogin();
    return;
  }

  const p = products.find(x => x.id === id);
  const nuevoEstado = !p.fav;
  p.fav = nuevoEstado;
  renderProducts();
  updateFavPanel();
  showToast(nuevoEstado ? "❤️ Añadido a favoritos" : "🤍 Eliminado de favoritos");

  persistFavorite(currentUser.cedula, id, nuevoEstado);
}

async function persistFavorite(cedula, prendaId, agregar) {
  try {
    if (agregar) {
      await fetch(`${API_URL}/api/favoritos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula, prendaId })
      });
    } else {
      await fetch(`${API_URL}/api/favoritos/${cedula}/${prendaId}`, {
        method: "DELETE"
      });
    }
  } catch (err) {
    console.error("Error al persistir favorito:", err);
  }
}

async function cargarFavoritos(cedula) {
  try {
    const res = await fetch(`${API_URL}/api/favoritos/${cedula}`);
    if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
    const favoritos = await res.json();
    products.forEach(p => {
      p.fav = favoritos.includes(p.id);
    });
    renderProducts();
    updateFavPanel();
  } catch (err) {
    console.error("No se pudieron cargar favoritos:", err);
  }
}

function toggleFavPanel() {
  const panel = document.getElementById("fav-panel");
  panel.classList.toggle("open");
  if (panel.classList.contains("open")) updateFavPanel();
}

function updateFavPanel() {
  const favProducts = products.filter(p => p.fav);
  const listEl  = document.getElementById("fav-panel-list");
  const emptyEl = document.getElementById("fav-panel-empty");
  const btnEl   = document.getElementById("fav-header-btn");

  btnEl.innerHTML = favProducts.length > 0
    ? `❤️ <span class="fav-count" id="fav-count">${favProducts.length}</span>`
    : `🤍 <span class="fav-count" id="fav-count" style="display:none">0</span>`;

  if (favProducts.length === 0) {
    listEl.innerHTML = "";
    emptyEl.style.display = "block";
    return;
  }

  emptyEl.style.display = "none";
  listEl.innerHTML = favProducts.map(p => `
    <div class="fav-item">
      <img src="${p.img ?? 'https://placehold.co/400x400?text=Sin+foto'}" alt="${p.name}" />
      <div class="fav-item-info">
        <p class="fav-item-name">${p.name}</p>
        <p class="fav-item-price">${p.price}</p>
      </div>
      <button class="fav-item-remove" onclick="removeFav(${p.id})" title="Quitar">✕</button>
    </div>
  `).join("");
}

function removeFav(id) {
  const p = products.find(x => x.id === id);
  p.fav = false;
  renderProducts();
  updateFavPanel();
  showToast("🤍 Eliminado de favoritos");
}

document.addEventListener("click", function(e) {
  const wrapper = document.querySelector(".fav-wrapper");
  if (wrapper && !wrapper.contains(e.target))
    document.getElementById("fav-panel").classList.remove("open");
});

// =============================================
// MODAL — LOGIN / REGISTRO
// =============================================
function handleLoginBtn() {
  if (currentUser) {
    currentUser = null;
    localStorage.removeItem("currentUser");
    products.forEach(p => p.fav = false);
    updateLoginBtn();
    updateFavPanel();
    renderProducts();
    showToast("👋 Sesión cerrada");
  } else {
    abrirModalLogin();
  }
}

function abrirModalLogin() {
  modoModal = "login";
  renderModal();
  document.getElementById("modal-overlay").classList.add("open");
  setTimeout(() => document.getElementById("modal-correo")?.focus(), 100);
}

function abrirModalRegistro() {
  modoModal = "registro";
  renderModal();
  setTimeout(() => document.getElementById("modal-nombre")?.focus(), 100);
}

function renderModal() {
  const body = document.getElementById("modal-body");

  if (modoModal === "login") {
    body.innerHTML = `
      <div class="modal-title">Iniciar sesión</div>
      <p class="modal-sub">Inicia sesión para guardar tus favoritos</p>
      <div class="form-group">
        <label>Correo</label>
        <input type="email" id="modal-correo" placeholder="correo@ejemplo.com" autocomplete="off"
               onkeydown="if(event.key==='Enter') submitLogin()" />
      </div>
      <div class="form-group">
        <label>Contraseña</label>
        <input type="password" id="modal-password" placeholder="••••••••"
               onkeydown="if(event.key==='Enter') submitLogin()" />
      </div>
      <p class="modal-error" id="modal-error"></p>
      <div class="modal-actions">
        <button class="btn-submit" onclick="submitLogin()">Entrar</button>
        <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
      </div>
      <p class="modal-switch">
        ¿No tienes cuenta?
        <button class="btn-link" onclick="abrirModalRegistro()">Regístrate aquí</button>
      </p>
    `;
  } else {
    body.innerHTML = `
      <div class="modal-title">Crear cuenta</div>
      <p class="modal-sub">Regístrate para guardar tus favoritos</p>
      <div class="form-group">
        <label>Nombre completo</label>
        <input type="text" id="modal-nombre" placeholder="Tu nombre" />
      </div>
      <div class="form-group">
        <label>Cédula</label>
        <input type="number" id="modal-cedula" placeholder="Número de cédula" />
      </div>
      <div class="form-group">
        <label>Correo</label>
        <input type="email" id="modal-correo" placeholder="correo@ejemplo.com" />
      </div>
      <div class="form-group">
        <label>Contraseña</label>
        <input type="password" id="modal-password" placeholder="••••••••" />
      </div>
      <div class="form-group">
        <label>Celular</label>
        <input type="number" id="modal-celular" placeholder="3001234567" />
      </div>
      <div class="form-group">
        <label>Dirección</label>
        <input type="text" id="modal-direccion" placeholder="Tu dirección" />
      </div>
      <div class="form-group">
        <label>Género</label>
        <select id="modal-sexo">
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="O">Otro</option>
        </select>
      </div>
      <p class="modal-error" id="modal-error"></p>
      <div class="modal-actions">
        <button class="btn-submit" onclick="submitRegistro()">Registrarme</button>
        <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
      </div>
      <p class="modal-switch">
        ¿Ya tienes cuenta?
        <button class="btn-link" onclick="abrirModalLogin()">Inicia sesión</button>
      </p>
    `;
  }
}

function closeModal(clearPending = true) {
  document.getElementById("modal-overlay").classList.remove("open");
  if (clearPending) pendingFavId = null;
}

function closeModalOutside(e) {
  if (e.target === document.getElementById("modal-overlay")) closeModal();
}

async function submitLogin() {
  const correo   = document.getElementById("modal-correo")?.value.trim();
  const password = document.getElementById("modal-password")?.value;
  const errorEl  = document.getElementById("modal-error");

  if (!correo || !password) { errorEl.textContent = "Por favor completa todos los campos."; return; }
  errorEl.textContent = "Verificando...";

  try {
    const res = await fetch(`${API_URL}/api/clientes/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, password })
    });
    const data = await res.json();
    if (!res.ok) { errorEl.textContent = "❌ " + data.error; return; }

    currentUser = data;
    closeModal(false);
    updateLoginBtn();
    await cargarFavoritos(currentUser.cedula);
    renderProducts();
    showToast(`✅ ¡Bienvenido, ${currentUser.nombre}!`);
    if (pendingFavId !== null) { toggleFav(pendingFavId); pendingFavId = null; }
    guardarSesion();
  } catch (err) {
    errorEl.textContent = "❌ No se pudo conectar con el servidor.";
  }
}

async function submitRegistro() {
  const nombre    = document.getElementById("modal-nombre")?.value.trim();
  const cedula    = document.getElementById("modal-cedula")?.value.trim();
  const correo    = document.getElementById("modal-correo")?.value.trim();
  const password  = document.getElementById("modal-password")?.value;
  const celular   = document.getElementById("modal-celular")?.value.trim();
  const direccion = document.getElementById("modal-direccion")?.value.trim();
  const sexoId    = document.getElementById("modal-sexo")?.value;
  const errorEl   = document.getElementById("modal-error");

  if (!nombre || !cedula || !correo || !password || !celular || !direccion) {
    errorEl.textContent = "Por favor completa todos los campos."; return;
  }
  errorEl.textContent = "Registrando...";

  try {
    const res = await fetch(`${API_URL}/api/clientes/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, cedula, correo, password, celular, direccion, sexoId })
    });
    const data = await res.json();
    if (!res.ok) { errorEl.textContent = "❌ " + data.error; return; }

    currentUser = data;
    closeModal(false);
    updateLoginBtn();
    await cargarFavoritos(currentUser.cedula);
    renderProducts();
    showToast(`✅ ¡Cuenta creada! Bienvenido, ${currentUser.nombre}!`);
    if (pendingFavId !== null) { toggleFav(pendingFavId); pendingFavId = null; }
    guardarSesion();
  } catch (err) {
    errorEl.textContent = "❌ No se pudo conectar con el servidor.";
  }
}

function updateLoginBtn() {
  const btn = document.getElementById("login-btn");
  if (currentUser) {
    btn.textContent = `👤 ${currentUser.nombre}  ·  Cerrar sesión`;
    btn.classList.add("logged-in");
  } else {
    btn.textContent = "→ Iniciar sesión";
    btn.classList.remove("logged-in");
  }
}

function guardarSesion() {
  if (currentUser) {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  } else {
    localStorage.removeItem("currentUser");
  }
}

function cargarSesion() {
  const raw = localStorage.getItem("currentUser");
  if (!raw) return;
  try {
    currentUser = JSON.parse(raw);
    updateLoginBtn();
  } catch (err) {
    console.error("Error al cargar la sesión:", err);
    localStorage.removeItem("currentUser");
  }
}

// =============================================
// TOAST
// =============================================
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2400);
}

// =============================================
// INIT
// =============================================

cargarSesion();

cargarPrendas();
