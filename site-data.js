/* Teves data bridge: the page keeps its built-in fallback until Supabase is configured. */
(function () {
  const cfg = window.TEVES_CONFIG || { url: '', anonKey: '' };
  if (!cfg.url || !cfg.anonKey) return;
  const endpoint = cfg.url.replace(/\/$/, '') + '/rest/v1/products?select=*&active=eq.true&order=sort_order.asc,created_at.asc';
  fetch(endpoint, { headers: { apikey: cfg.anonKey, Authorization: 'Bearer ' + cfg.anonKey } })
    .then(r => r.ok ? r.json() : Promise.reject(new Error('products request failed')))
    .then(rows => {
      if (!Array.isArray(rows) || !rows.length) return;
      const products = Object.fromEntries(rows.map(p => [p.slug, {
        name: p.name, category: String(p.category || 'GENERAL').toUpperCase(), image: p.image_class || 'p1',
        imageUrl: p.image_url || '', description: p.short_description || p.description || '',
        details: Array.isArray(p.details) ? p.details : [], suitableFor: p.suitable_for || '',
        notSuitableFor: p.not_suitable_for || '', usage: p.usage || '', notes: p.notes || '',
        price: p.price, originalPrice: p.original_price
      }]));
      const grid = document.getElementById('productGrid');
      if (!grid) return;
      grid.innerHTML = Object.entries(products).map(([id, p]) => `<article class="product reveal" data-category="${escapeValue(p.category).toLowerCase()}" onclick="openProduct('${escapeValue(id)}')"><div class="product-img ${escapeValue(p.image)}"${p.imageUrl ? ` style="background-image:url('${escapeValue(p.imageUrl)}')"` : ''}></div><div class="product-info"><span class="tag">${escapeValue(p.category)}</span><h3>${escapeValue(p.name)}</h3><p>${escapeValue(p.description)}</p><div class="product-bottom"><span class="price">${p.price ? `${escapeValue(p.price)} جنيه` : 'السعر يُضاف لاحقًا'}</span><button class="btn btn-outline product-action" type="button" onclick="event.stopPropagation(); openProduct('${escapeValue(id)}')">التفاصيل</button></div></div></article>`).join('');
      window.openProduct = function (id) {
        const p = products[id];
        if (!p) return;
        document.getElementById('modalCategory').textContent = p.category;
        document.getElementById('modalTitle').textContent = p.name;
        document.getElementById('modalDescription').textContent = p.description;
        document.getElementById('modalDetails').innerHTML = p.details.map(x => '<li>' + escapeValue(x) + '</li>').join('');
        document.getElementById('modalPrice').textContent = p.price ? `${p.price} جنيه` : 'السعر يُضاف لاحقًا';
        document.getElementById('modalSuitableFor').textContent = p.suitableFor;
        document.getElementById('modalNotSuitableFor').textContent = p.notSuitableFor;
        document.getElementById('modalUsage').textContent = p.usage;
        document.getElementById('modalNotes').textContent = p.notes;
        const img = document.getElementById('modalImage'); img.className = 'modal-image ' + (p.image || 'p1');
        if (p.imageUrl) img.style.backgroundImage = `url('${p.imageUrl}')`;
        document.getElementById('productModal').classList.add('open');
        document.body.style.overflow = 'hidden';
      };
      grid.querySelectorAll('.product').forEach(x => x.classList.add('visible'));
    })
    .catch(() => { /* fallback content remains visible */ });
  function escapeValue(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
}());
