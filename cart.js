// cart.js — handles quantity changes, row removal, and live totals on cart.html

document.addEventListener("DOMContentLoaded", function () {
  const table = document.getElementById("cart-table");
  if (!table) return;

  function formatMoney(n) {
    return "$" + n.toFixed(2).replace(/\.00$/, "");
  }

  function updateRow(row) {
    const price = parseFloat(row.dataset.price);
    const qtyInput = row.querySelector(".quantity");
    let qty = parseInt(qtyInput.value, 10);
    if (isNaN(qty) || qty < 1) {
      qty = 1;
      qtyInput.value = 1;
    }
    row.querySelector(".subtotal").textContent = formatMoney(price * qty);
  }

  function updateCartTotal() {
    let total = 0;
    table.querySelectorAll("tbody tr").forEach(function (row) {
      const price = parseFloat(row.dataset.price);
      const qty = parseInt(row.querySelector(".quantity").value, 10) || 1;
      total += price * qty;
    });

    const subtotalEl = document.getElementById("cart-subtotal");
    const grandTotalEl = document.getElementById("cart-grand-total");
    if (subtotalEl) subtotalEl.textContent = formatMoney(total);
    if (grandTotalEl) grandTotalEl.textContent = formatMoney(total);

    // Show an empty-cart message if every row has been removed
    if (table.querySelectorAll("tbody tr").length === 0) {
      const section = document.getElementById("cart");
      if (section && !document.querySelector(".empty-cart")) {
        table.style.display = "none";
        const addRow = document.getElementById("cart-add");
        if (addRow) addRow.style.display = "none";
        const msg = document.createElement("div");
        msg.className = "empty-cart";
        msg.innerHTML = "<p>Your cart is empty.</p>";
        section.insertBefore(msg, table);
      }
    }
  }

  table.querySelectorAll("tbody tr").forEach(function (row) {
    updateRow(row);

    row.querySelector(".quantity").addEventListener("input", function () {
      updateRow(row);
      updateCartTotal();
    });

    row.querySelector(".cart-remove").addEventListener("click", function () {
      row.remove();
      updateCartTotal();
    });
  });

  updateCartTotal();
});
