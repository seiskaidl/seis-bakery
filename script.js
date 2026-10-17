// Interaksi Seis Bakery: navigasi, filter, keranjang, dan checkout.
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? '×' : '☰';
  });
}
const CART_KEY = 'seisBakeryCart';
const ORDER_KEY = 'seisBakeryLastOrder';
const rupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
function readCart() { try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; } }
function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }
function updateCartCount() {
  const count = readCart().reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('#cartCount, #floatingCartCount').forEach(el => el.textContent = count);
}
function addToCart(product) {
  const cart = readCart();
  const found = cart.find(item => item.id === product.id);
  if (found) found.qty += 1; else cart.push({ ...product, qty: 1 });
  saveCart(cart);
  const button = document.querySelector(`[data-add-cart][data-id="${CSS.escape(product.id)}"]`);
  if (button) { const old = button.textContent; button.textContent = 'Ditambahkan ✓'; setTimeout(() => button.textContent = old, 1100); }
}
document.querySelectorAll('[data-add-cart]').forEach(button => button.addEventListener('click', () => addToCart({ id: button.dataset.id, name: button.dataset.name, price: Number(button.dataset.price), image: button.dataset.image || '', qty: 1 })));
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(other => { other.classList.toggle('active', other === button); other.setAttribute('aria-pressed', String(other === button)); });
  document.querySelectorAll('.product-card').forEach(card => card.classList.toggle('is-hidden', button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter));
}));
function renderCheckout() {
  const itemsEl = document.getElementById('cartItems');
  if (!itemsEl) return;
  const cart = readCart();
  const empty = document.getElementById('emptyCart');
  empty.hidden = cart.length > 0;
  itemsEl.innerHTML = cart.map(item => `<div class="cart-row"><img src="${item.image}" alt=""><div class="cart-row-info"><strong>${item.name}</strong><small>${rupiah(item.price)} / item</small><div class="quantity-control"><button type="button" data-qty="minus" data-id="${item.id}" aria-label="Kurangi ${item.name}">−</button><span>${item.qty}</span><button type="button" data-qty="plus" data-id="${item.id}" aria-label="Tambah ${item.name}">+</button><button class="remove-item" type="button" data-qty="remove" data-id="${item.id}">Hapus</button></div></div><strong>${rupiah(item.price * item.qty)}</strong></div>`).join('');
  document.getElementById('summaryItems').innerHTML = cart.map(item => `<div class="summary-product"><span>${item.name} × ${item.qty}</span><strong>${rupiah(item.price * item.qty)}</strong></div>`).join('');
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = document.querySelector('input[name="fulfillment"]:checked')?.value === 'delivery';
  const shipping = delivery && cart.length ? 10000 : 0;
  document.getElementById('subtotal').textContent = rupiah(subtotal);
  document.getElementById('shipping').textContent = rupiah(shipping);
  document.getElementById('total').textContent = rupiah(subtotal + shipping);
  document.querySelectorAll('[data-qty]').forEach(button => button.addEventListener('click', () => {
    let updated = readCart(); const item = updated.find(x => x.id === button.dataset.id);
    if (button.dataset.qty === 'remove') updated = updated.filter(x => x.id !== button.dataset.id);
    else if (item) { item.qty += button.dataset.qty === 'plus' ? 1 : -1; updated = updated.filter(x => x.qty > 0); }
    saveCart(updated); renderCheckout();
  }));
}
const fulfillmentInputs = document.querySelectorAll('input[name="fulfillment"]');
fulfillmentInputs.forEach(input => input.addEventListener('change', () => {
  const delivery = input.value === 'delivery' && input.checked;
  const fields = document.getElementById('deliveryFields');
  if (fields) fields.hidden = !delivery;
  const address = document.querySelector('[name="address"]');
  const city = document.querySelector('[name="city"]');
  if (address) address.required = delivery;
  if (city) city.required = delivery;
  renderCheckout();
}));
const checkoutForm = document.getElementById('checkoutForm');
if (checkoutForm) {
  renderCheckout();
  checkoutForm.addEventListener('submit', event => {
    event.preventDefault();
    const cart = readCart();
    const error = document.getElementById('checkoutError');
    if (!cart.length) { error.textContent = 'Keranjang masih kosong. Tambahkan menu cake terlebih dahulu.'; return; }
    if (!checkoutForm.reportValidity()) return;
    const form = new FormData(checkoutForm);
    const fulfillment = form.get('fulfillment');
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = fulfillment === 'delivery' ? 10000 : 0;
    const order = { orderNumber: 'SEIS-' + Date.now().toString().slice(-8), items: cart, customer: { name: form.get('customerName'), phone: form.get('phone'), email: form.get('email') }, fulfillment, address: fulfillment === 'delivery' ? [form.get('address'), form.get('city'), form.get('postalCode')].filter(Boolean).join(', ') : 'Ambil sendiri di toko', notes: form.get('notes'), subtotal, shipping, total: subtotal + shipping, createdAt: new Date().toISOString() };
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
    window.location.href = 'order-success.html';
  });
}
function renderSuccess() {
  const target = document.getElementById('successOrderDetails'); if (!target) return;
  let order; try { order = JSON.parse(localStorage.getItem(ORDER_KEY) || 'null'); } catch {}
  if (!order) { target.innerHTML = '<p>Belum ada pesanan yang tersimpan di browser ini. <a href="menu.html">Pilih menu terlebih dahulu.</a></p>'; return; }
  document.getElementById('successIntro').textContent = `Terima kasih, ${order.customer.name}. Nomor pesananmu ${order.orderNumber}.`;
  target.innerHTML = `<p><strong>Nomor pesanan:</strong> ${order.orderNumber}</p><p><strong>Penerimaan:</strong> ${order.fulfillment === 'pickup' ? 'Ambil di toko' : 'Delivery'}</p><p><strong>Alamat:</strong> ${order.address}</p>${order.notes ? `<p><strong>Catatan:</strong> ${order.notes}</p>` : ''}<hr>${order.items.map(item => `<div class="summary-product"><span>${item.name} × ${item.qty}</span><strong>${rupiah(item.price * item.qty)}</strong></div>`).join('')}<div class="summary-line"><span>Subtotal</span><strong>${rupiah(order.subtotal)}</strong></div><div class="summary-line"><span>Ongkir</span><strong>${rupiah(order.shipping)}</strong></div>`;
  document.getElementById('successTotal').textContent = rupiah(order.total);
  if (window.SEIS_BANK_DETAILS) {
    document.getElementById('bankName').textContent = window.SEIS_BANK_DETAILS.bankName;
    document.getElementById('bankAccount').textContent = window.SEIS_BANK_DETAILS.accountNumber;
    document.getElementById('bankHolder').textContent = window.SEIS_BANK_DETAILS.accountHolder;
  }
  document.getElementById('copyAccount')?.addEventListener('click', async () => {
    const account = document.getElementById('bankAccount').textContent;
    try { await navigator.clipboard.writeText(account); document.getElementById('copyAccount').textContent = 'Tersalin ✓'; }
    catch { window.prompt('Salin nomor rekening ini:', account); }
  });
}
renderSuccess();
document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());
updateCartCount();
