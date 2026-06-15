// =============================================
// URL BASE DEL BACKEND (Spring Boot)
// =============================================
const API_URL = "http://localhost:8080";

// =============================================
// SESIÓN
// =============================================
const _sesionGuardada = localStorage.getItem("sesionJosefita");
let currentUser = _sesionGuardada ? JSON.parse(_sesionGuardada) : null;
let pendingFavId = null;
let modoModal    = "login"; // "login" | "registro"

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
    price:    formatearPrecio(p.precio),
    category: inferirCategoria(p.nombre),
    gender:   GENERO_MAP[p.sexo?.descripcion] ?? "todos",
    img:      p.imagen ? `${API_URL}/imagenes/${p.imagen}` : null,
    talla:    p.talla,
    color:    p.color,
    fav:      false,
    agotado:  p.status?.id === 0  // ← nuevo campo
}));

    renderProducts();
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
      <p style="font-size:.9rem;">Verifica que Spring Boot esté corriendo en <strong>localhost:8080</strong>.</p>
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
        ${p.agotado
          ? `<span class="product-badge" style="background: rgba(120,120,120,0.6);">Agotado</span>`
          : `<span class="product-badge">${categoryLabels[p.category] ?? p.category}</span>`
        }

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
          ${p.fav ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="#c47fa0" stroke="#c47fa0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>` : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`}
        </button>
        ${esAdmin ? `
        <button class="btn-upload" style="font-size:.8rem;padding:.3rem .7rem;"
          onclick="abrirModalEditarProducto(${p.id})">✏️ Editar</button>
        <button class="btn-upload" style="font-size:.8rem;padding:.3rem .7rem;background:#c0392b;"
          onclick="confirmarEliminar(${p.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg> Eliminar</button>
        ` : ""}
      </div>
    </div>
  `).join("");
}

// =============================================
// SUBIR FOTO (solo admin)
// =============================================
async function subirFoto(event, prendaId) {
  const file = event.target.files[0];
  if (!file) return;

  const statusEl = document.getElementById(`status-${prendaId}`);
  statusEl.textContent = "Subiendo...";

  try {
    const formData = new FormData();
    formData.append("file", file);

    const resUpload = await fetch(`${API_URL}/api/prendas/upload`, {
      method: "POST",
      body: formData
    });
    if (!resUpload.ok) throw new Error("Error al subir el archivo");
    const nombreArchivo = await resUpload.text();

    const resAsignar = await fetch(
      `${API_URL}/api/prendas/${prendaId}/imagen?nombreArchivo=${nombreArchivo}`,
      { method: "PUT" }
    );
    if (!resAsignar.ok) throw new Error("Error al asociar la imagen");

    const producto = products.find(p => p.id === prendaId);
    producto.img = `${API_URL}/imagenes/${nombreArchivo}`;

    statusEl.textContent = "✅";
    setTimeout(() => {
      renderProducts();
      showToast("📷 Foto actualizada correctamente");
    }, 800);

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
// Reemplaza toggleFav
// Al hacer login/registro, carga los favoritos del usuario desde el backend
async function cargarFavoritosUsuario() {
  if (!currentUser) return;
  try {
    const res = await fetch(`${API_URL}/api/favoritos/${currentUser.cedula}`);
    const ids = await res.json(); // [3, 7, 12, ...]
    products.forEach(p => p.fav = ids.includes(p.id));
    renderProducts();
    updateFavPanel();
  } catch (err) {
    console.error("No se pudieron cargar los favoritos:", err);
  }
}

async function toggleFav(id) {
  if (!currentUser) {
    pendingFavId = id;
    abrirModalLogin();
    return;
  }
  const p = products.find(x => x.id === id);
  const nuevoEstado = !p.fav;

  try {
    if (nuevoEstado) {
      await fetch(`${API_URL}/api/favoritos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula: currentUser.cedula, prendaId: id })
      });
    } else {
      await fetch(`${API_URL}/api/favoritos/${currentUser.cedula}/${id}`, {
        method: "DELETE"
      });
    }
    p.fav = nuevoEstado;
    renderProducts();
    updateFavPanel();
    showToast(p.fav ? "Añadido a favoritos" : "Eliminado de favoritos");
  } catch (err) {
    showToast("❌ Error al actualizar favoritos");
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
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="#c47fa0" stroke="#c47fa0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> <span class="fav-count" id="fav-count">${favProducts.length}</span>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> <span class="fav-count" id="fav-count" style="display:none">0</span>`;

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
      <button class="fav-item-remove" onclick="removeFav(${p.id})" title="Quitar"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
  `).join("");
}

// Reemplaza removeFav
async function removeFav(id) {
  await toggleFav(id); // reutiliza la misma lógica
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
    localStorage.removeItem("sesionJosefita");
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

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("open");
  pendingFavId = null;
}

function closeModalOutside(e) {
  if (e.target === document.getElementById("modal-overlay")) closeModal();
}

// LOGIN contra la API
async function submitLogin() {
  const correo   = document.getElementById("modal-correo")?.value.trim();
  const password = document.getElementById("modal-password")?.value;
  const errorEl  = document.getElementById("modal-error");

  if (!correo || !password) {
    errorEl.textContent = "Por favor completa todos los campos.";
    return;
  }

  errorEl.textContent = "Verificando...";

  try {
    const res = await fetch(`${API_URL}/api/clientes/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = "❌ " + data.error;
      return;
    }

    // Login exitoso
    currentUser = data;
    localStorage.setItem("sesionJosefita", JSON.stringify(data)); 
    closeModal();
    updateLoginBtn();
    renderProducts();
    await cargarFavoritosUsuario();
    showToast(`✅ ¡Bienvenido, ${currentUser.nombre}!`);

    if (pendingFavId !== null) { toggleFav(pendingFavId); pendingFavId = null; }

  } catch (err) {
    errorEl.textContent = "❌ No se pudo conectar con el servidor.";
  }
}

// REGISTRO contra la API
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
    errorEl.textContent = "Por favor completa todos los campos.";
    return;
  }

  errorEl.textContent = "Registrando...";

  try {
    const res = await fetch(`${API_URL}/api/clientes/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, cedula, correo, password, celular, direccion, sexoId })
    });

    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = "❌ " + data.error;
      return;
    }

    // Registro exitoso → sesión automática
    currentUser = data;
    localStorage.setItem("sesionJosefita", JSON.stringify(data)); 
    closeModal();
    updateLoginBtn();
    renderProducts();
    await cargarFavoritosUsuario();
    showToast(`✅ ¡Cuenta creada! Bienvenido, ${currentUser.nombre}!`);

    if (pendingFavId !== null) { toggleFav(pendingFavId); pendingFavId = null; }

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
// MODAL — AGREGAR PRODUCTO (solo admin)
// =============================================
function abrirModalAgregarProducto() {
  const body = document.getElementById("modal-body");
  body.innerHTML = `
    <div class="modal-title">➕ Agregar producto</div>

    <div class="form-group">
      <label>Nombre</label>
      <input type="text" id="ap-nombre" placeholder="Ej: Camiseta básica blanca" />
    </div>
    <div class="form-group">
      <label>Precio</label>
      <input type="number" id="ap-precio" placeholder="Ej: 35000" />
    </div>
    <div class="form-group">
      <label>Talla</label>
      <select id="ap-talla">
        <option>XS</option><option>S</option><option selected>M</option>
        <option>L</option><option>XL</option><option>XXL</option>
      </select>
    </div>
    <div class="form-group">
      <label>Color</label>
      <input type="text" id="ap-color" placeholder="Ej: Rojo" />
    </div>
    <div class="form-group">
      <label>Género</label>
      <select id="ap-sexo">
        <option value="M">Masculino</option>
        <option value="F">Femenino</option>
        <option value="O">Otro</option>
      </select>
    </div>
    <div class="form-group">
      <label>Foto (opcional)</label>
      <input type="file" id="ap-foto" accept="image/*" />
    </div>

    <p class="modal-error" id="ap-error"></p>

    <div class="modal-actions">
      <button class="btn-submit" onclick="submitAgregarProducto()">Guardar</button>
      <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
    </div>
  `;
  document.getElementById("modal-overlay").classList.add("open");
}

async function submitAgregarProducto() {
  const nombre  = document.getElementById("ap-nombre")?.value.trim();
  const precio  = document.getElementById("ap-precio")?.value;
  const talla   = document.getElementById("ap-talla")?.value;
  const color   = document.getElementById("ap-color")?.value.trim();
  const sexoId  = document.getElementById("ap-sexo")?.value;
  const fotoEl  = document.getElementById("ap-foto");
  const errorEl = document.getElementById("ap-error");

  if (!nombre || !precio || !color) {
    errorEl.textContent = "Nombre, precio y color son obligatorios.";
    return;
  }

  errorEl.textContent = "Guardando...";

  try {
    // 1. Crear la prenda
    const res = await fetch(`${API_URL}/api/prendas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        precio: parseFloat(precio),
        talla,
        color,
        sexo:   { id: sexoId },
        status: { id: 1 }
      })
    });

    if (!res.ok) throw new Error("Error al crear la prenda");
    const nuevaPrenda = await res.json();

    // 2. Si hay foto, subirla y asociarla
    const file = fotoEl?.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const resUpload = await fetch(`${API_URL}/api/prendas/upload`, {
        method: "POST", body: formData
      });
      if (resUpload.ok) {
        const nombreArchivo = await resUpload.text();
        await fetch(`${API_URL}/api/prendas/${nuevaPrenda.id}/imagen?nombreArchivo=${nombreArchivo}`,
          { method: "PUT" });
        nuevaPrenda.imagen = nombreArchivo;
      }
    }

    // 3. Agregar al array local y renderizar sin recargar
    products.push({
      id:       nuevaPrenda.id,
      name:     nuevaPrenda.nombre,
      price:    formatearPrecio(nuevaPrenda.precio),
      category: inferirCategoria(nuevaPrenda.nombre),
      gender:   GENERO_MAP[nuevaPrenda.sexo?.descripcion] ?? "todos",
      img:      nuevaPrenda.imagen ? `${API_URL}/imagenes/${nuevaPrenda.imagen}` : null,
      fav:      false,
      talla:    nuevaPrenda.talla,   // ← nuevo
      color:    nuevaPrenda.color    // ← nuevo
    });
    closeModal();
    renderProducts();
    showToast("✅ Producto agregado correctamente");

  } catch (err) {
    errorEl.textContent = "❌ Error: " + err.message;
  }
}

// =============================================
// MODAL — EDITAR PRODUCTO (solo admin)
// =============================================
function abrirModalEditarProducto(id) {
  const p = products.find(x => x.id === id);
  const body = document.getElementById("modal-body");
  body.innerHTML = `
    <div class="modal-title">✏️ Editar producto</div>

    <div class="form-group">
      <label>Nombre</label>
      <input type="text" id="ep-nombre" value="${p.name}" />
    </div>
    <div class="form-group">
      <label>Precio</label>
      <input type="number" id="ep-precio"
        value="${p.price.replace(/[$.,]/g, "").replace(/\./g, "")}" />
    </div>
    <div class="form-group">
      <label>Talla</label>
      <select id="ep-talla">
        ${["XS","S","M","L","XL","XXL"].map(t =>
          `<option ${p.talla === t ? "selected" : ""}>${t}</option>`
        ).join("")}
      </select>
    </div>
    <div class="form-group">
      <label>Color</label>
      <input type="text" id="ep-color" value="${p.color ?? ""}" />
    </div>
    <div class="form-group">
      <label>Género</label>
      <select id="ep-sexo">
        <option value="M" ${p.gender==="hombres"?"selected":""}>Masculino</option>
        <option value="F" ${p.gender==="mujeres"?"selected":""}>Femenino</option>
        <option value="O" ${p.gender==="todos"?"selected":""}>Otro</option>
      </select>
    </div>

    <p class="modal-error" id="ep-error"></p>

    <div class="modal-actions">
      <button class="btn-submit" onclick="submitEditarProducto(${id})">Guardar cambios</button>
      <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
    </div>
  `;
  document.getElementById("modal-overlay").classList.add("open");
}

async function submitEditarProducto(id) {
  const nombre  = document.getElementById("ep-nombre")?.value.trim();
  const precio  = document.getElementById("ep-precio")?.value;
  const talla   = document.getElementById("ep-talla")?.value;
  const color   = document.getElementById("ep-color")?.value.trim();
  const sexoId  = document.getElementById("ep-sexo")?.value;
  const errorEl = document.getElementById("ep-error");

  if (!nombre || !precio || !color) {
    errorEl.textContent = "Nombre, precio y color son obligatorios.";
    return;
  }

  errorEl.textContent = "Guardando...";

  try {
    const res = await fetch(`${API_URL}/api/prendas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        precio: parseFloat(precio),
        talla,
        color,
        sexo:   { id: sexoId },
        status: { id: 1 }
      })
    });

    if (!res.ok) throw new Error("Error al actualizar");

    // Actualiza el array local
    const p = products.find(x => x.id === id);
    p.name     = nombre;
    p.price    = formatearPrecio(parseFloat(precio));
    p.category = inferirCategoria(nombre);
    p.gender   = { M: "hombres", F: "mujeres", O: "todos" }[sexoId];
    p.talla    = talla;
    p.color    = color;

    closeModal();
    renderProducts();
    showToast("✅ Producto actualizado");

  } catch (err) {
    errorEl.textContent = "❌ " + err.message;
  }
}

// =============================================
// ELIMINAR PRODUCTO (solo admin)
// =============================================
function confirmarEliminar(id) {
  const p = products.find(x => x.id === id);
  const body = document.getElementById("modal-body");
  body.innerHTML = `
    <div class="modal-title">Eliminar producto</div>
    <p style="text-align:center;margin:1rem 0;">
      ¿Segura que deseas eliminar <strong>${p.name}</strong>?<br>
      <span style="color:#888;font-size:.9rem;">Esta acción no se puede deshacer.</span>
    </p>
    <div class="modal-actions">
      <button class="btn-submit" style="background:#c0392b;"
        onclick="submitEliminarProducto(${id})">Sí, eliminar</button>
      <button class="btn-cancel" onclick="closeModal()">Cancelar</button>
    </div>
  `;
  document.getElementById("modal-overlay").classList.add("open");
}

async function submitEliminarProducto(id) {
  try {
    const res = await fetch(`${API_URL}/api/prendas/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar");

    products = products.filter(x => x.id !== id);
    closeModal();
    renderProducts();
    updateFavPanel();
    showToast("Producto eliminado");

  } catch (err) {
    showToast("❌ No se pudo eliminar el producto");
  }
}

// =============================================
// INIT
// =============================================
(async () => {
  cargarPrendas();
  updateLoginBtn();
  await cargarFavoritosUsuario();
})();