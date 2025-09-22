// =========================
// Pricing Data
// =========================
const pricingData = {
  tier1: {
    "None": [0],
    "Starter Website": [500, 733, 967, 1200],
    "Landing Page": [400, 500, 600, 700],
    "Basic WordPress / Shopify Setup": [600, 800, 1000, 1200],
    "Small E-commerce Setup": [800, 1033, 1267, 1500]
  },
  tier2: {
    "None": [0],
    "Custom-coded website": [3000, 4500, 6000, 7500],
    "E-commerce store": [5000, 7333, 9667, 12000],
    "Web app / SaaS dashboards": [6000, 9000, 12000, 15000],
    "Branding & UI/UX": [500, 1000, 1500, 2000]
  },
  addOns: {
    "Custom Animation": [150, 233, 317, 400],
    "SEO Optimization": [100, 167, 233, 300],
    "E-Commerce Integration": [250, 367, 483, 600],
    "Blog / CMS Setup": [200, 300, 400, 500],
    "Advanced Forms": [75, 117, 158, 200],
    "Responsive Testing & Fixes": [50, 83, 117, 150],
    "Performance Optimization": [100, 167, 233, 300],
    "Custom API Integration": [200, 300, 400, 500]
  },
  apiIntegrations: {
    "Payment & E-Commerce": [200, 300, 400, 500],
    "Booking & Appointments": [150, 233, 317, 400],
    "Social Media Integration": [100, 167, 233, 300],
    "Maps & Location": [100, 150, 200, 250],
    "Email Marketing": [150, 217, 283, 350],
    "Chat & Customer Support": [200, 267, 333, 400],
    "Analytics & Tracking": [100, 150, 200, 250],
    "AI & Content Tools": [150, 233, 317, 400],
    "Review & Reputation": [100, 150, 200, 250],
    "Security & Authentication": [150, 217, 283, 350]
  }
};

const recurringServices = {
  "SEO & Analytics Monitoring": [100, 200, 300, 400],
  "Maintenance & Support": [150, 250, 350, 500],
  "Email Marketing Campaigns": [75, 150, 225, 300]
};

// =========================
// Populate Select Dropdown
// =========================
function populateSelect(select, options) {
  select.innerHTML = "";
  for (let key in options) {
    const price = options[key][0];
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = `${key} ($${price})`;
    select.appendChild(opt);
  }
}

// =========================
// Populate Checkbox Groups
// =========================
function populateCheckboxGroup(container, options, monthly = false) {
  container.innerHTML = "";
  for (let key in options) {
    const div = document.createElement("div");
    div.className = "checkbox-item";
    div.innerHTML = `
      <label>
        <input type="checkbox" data-key="${key}"> ${key}
      </label>
      <select disabled>
        ${options[key]
          .map((p, i) =>
            `<option value="${i}">Lvl ${i+1} ($${p}${monthly ? "/mo" : ""})</option>`
          ).join("")}
      </select>
    `;
    container.appendChild(div);
  }

  // ✅ Bind events right after creating elements
  container.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", () => {
      const select = cb.closest(".checkbox-item").querySelector("select");
      select.disabled = !cb.checked;
      calculateTotal();
    });
  });

  container.querySelectorAll("select").forEach(sel => {
    sel.addEventListener("change", () => {
      updatePricePreview(sel);
      calculateTotal();
    });
  });
}

// =========================
// Price Preview Next to Label
// =========================
function updatePricePreview(sel) {
  const label = sel.previousElementSibling;
  label.querySelector(".price-preview")?.remove();
  const price = sel.options[sel.value].textContent.match(/\$(\d+)/)[1];
  const span = document.createElement("span");
  span.className = "price-preview";
  span.style.marginLeft = "10px";
  span.style.fontWeight = "600";
  span.style.color = "#1e5fa8";
  span.textContent = `($${price})`;
  label.appendChild(span);
}

// =========================
// Calculate Total
// =========================
function calculateTotal() {
  let total = 0;
  let itemized = [];

  const tier1Select = document.getElementById("tier1");
  const tier2Select = document.getElementById("tier2");

  if (tier1Select.value !== "None") {
    const price = pricingData.tier1[tier1Select.value][0];
    total += price;
    itemized.push(`${tier1Select.value} (Tier1) - $${price}`);
  }
  if (tier2Select.value !== "None") {
    const price = pricingData.tier2[tier2Select.value][0];
    total += price;
    itemized.push(`${tier2Select.value} (Tier2) - $${price}`);
  }

  [["#addOns", pricingData.addOns, "Add-On"], 
   ["#apiIntegrations", pricingData.apiIntegrations, "API"], 
   ["#recurringServicesContainer", recurringServices, "Monthly"]]
   .forEach(([id, data, labelText]) => {
    document.querySelectorAll(`${id} input[type=checkbox]:checked`).forEach(cb => {
      const key = cb.dataset.key;
      const select = cb.closest(".checkbox-item").querySelector("select");
      const price = data[key][select.value];
      total += price;
      itemized.push(`${key} (${labelText}) - $${price}${labelText==="Monthly" ? "/mo" : ""}`);
    });
  });

  document.getElementById("totalPrice").textContent = `$${total}`;
  document.getElementById("itemizedList").innerHTML = itemized.map(i => `<div>${i}</div>`).join('');
}

// =========================
// Initialize Calculator
// =========================
function initCalculator() {
  populateSelect(document.getElementById("tier1"), pricingData.tier1);
  populateSelect(document.getElementById("tier2"), pricingData.tier2);
  populateCheckboxGroup(document.getElementById("addOns"), pricingData.addOns);
  populateCheckboxGroup(document.getElementById("apiIntegrations"), pricingData.apiIntegrations);
  populateCheckboxGroup(document.getElementById("recurringServicesContainer"), recurringServices, true);

  document.getElementById("tier1").addEventListener("change", calculateTotal);
  document.getElementById("tier2").addEventListener("change", calculateTotal);

  calculateTotal();
}

// =========================
// Run after DOM is ready
// =========================
document.addEventListener("DOMContentLoaded", initCalculator);
