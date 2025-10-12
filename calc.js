// =========================
// Pricing Data
// =========================
const pricingData = {
  tier1: {
    "None": [0],
    "Landing Page": [650, 733, 967, 1200],
    "Starter Website": [800, 1000, 1100, 1300],
    "Basic WordPress / Shopify Setup": [1500, 1300, 1300, 1500],
    "Small E-commerce Setup": [2500, 1500, 1800, 2100]
  },
  tier2: {
    "None": [0],
    "Custom-coded Website": [3500, 5000, 6500, 8000],
    "E-commerce Store": [6000, 8500, 11000, 13500],
    "Web Application": [7000, 10000, 13000, 16000],
    "Branding & UI/UX": [800, 1200, 1600, 2000]
  },
  addOns: {
    "Custom Animation": [200, 300, 400, 500],
    "SEO Optimization": [150, 250, 350, 450],
    "Blog / CMS Setup": [250, 350, 450, 550],
    "Advanced Forms": [100, 150, 200, 250],
    "Responsive Testing & Fixes": [75, 125, 175, 225],
    "Performance Optimization": [150, 250, 350, 450],
    "Custom API Integration": [300, 400, 500, 600]
  },
  apiIntegrations: {
    "Booking & Appointments": [200, 300, 400, 500],
    "Social Media Integration": [150, 225, 300, 375],
    "Maps & Location": [125, 175, 225, 275],
    "Email Marketing": [200, 275, 350, 425],
    "Chat & Customer Support": [250, 325, 400, 475],
    "Analytics & Tracking": [150, 200, 250, 300],
    "AI & Content Tools": [200, 300, 400, 500],
    "Review & Reputation": [150, 200, 250, 300],
    "Security & Authentication": [200, 275, 350, 425]
  }
};

const recurringServices = {
  "SEO & Analytics Monitoring": [150, 250, 350, 450],
  "Maintenance & Support": [200, 300, 400, 550],
  "Email Marketing Campaigns": [100, 175, 250, 325],
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
function prefillFromSurvey() {
  const data = JSON.parse(localStorage.getItem('surveyData'));
  if (!data) return;

  const { name, email, siteType, features } = data;

  // ----- Map survey siteType to tiers -----
  const tier1Map = {
    'landing': 'Landing Page',
    'business': 'Starter Website',
    'ecommerce': 'Small E-commerce Setup',
    'custom': 'Basic WordPress / Shopify Setup'
  };
  const tier2Map = {
    'landing': 'None',
    'business': 'Branding & UI/UX',
    'ecommerce': 'E-commerce Store',
    'custom': 'Custom-coded Website'
  };

  const tier1Select = document.getElementById('tier1');
  const tier2Select = document.getElementById('tier2');

  if (tier1Map[siteType]) tier1Select.value = tier1Map[siteType];
  if (tier2Map[siteType]) tier2Select.value = tier2Map[siteType];

  // ----- Feature mapping from survey to calculator options -----
  const featureMap = {
    'blog': 'Blog / CMS Setup',
    'contact': 'Advanced Forms',
    'booking': 'Booking & Appointments',
    'seo': 'SEO Optimization',
    'cms': 'Blog / CMS Setup',
    'ecommerce': 'E-commerce Store',
    'custom': 'Custom API Integration',
    'e-mail': 'Email Marketing',
    'support': 'Maintenance & Support',
    'maps': 'Maps & Location'
  };

  const alwaysChecked = ['SEO Optimization', 'Responsive Testing & Fixes'];

  // ----- Prefill Add-Ons -----
  document.querySelectorAll('#addOns input[type=checkbox]').forEach(cb => {
    const key = cb.dataset.key;
    if (alwaysChecked.includes(key) || features.some(f => featureMap[f] === key)) {
      cb.checked = true;
      cb.dispatchEvent(new Event('change')); // enable select & update price
    }
  });

  // ----- Prefill API Integrations -----
  document.querySelectorAll('#apiIntegrations input[type=checkbox]').forEach(cb => {
    const key = cb.dataset.key;
    if (features.some(f => featureMap[f] === key)) {
      cb.checked = true;
      cb.dispatchEvent(new Event('change'));
    }
  });

  // ----- Prefill Recurring Services -----
  document.querySelectorAll('#recurringServicesContainer input[type=checkbox]').forEach(cb => {
    const key = cb.dataset.key;
    if (features.some(f => featureMap[f] === key)) {
      cb.checked = true;
      cb.dispatchEvent(new Event('change'));
    }
  });

  // ----- Prefill customer info -----
  if (name) document.getElementById('customerName')?.value = name;
  if (email) document.getElementById('customerEmail')?.value = email;

  // ----- Recalculate total -----
  calculateTotal();
}

// ----- Run on page load -----
document.addEventListener("DOMContentLoaded", () => {
  initCalculator();       // initialize selects and checkboxes
  prefillFromSurvey();    // prefill based on survey
});


// =========================
// Run after DOM is ready
// =========================
document.addEventListener("DOMContentLoaded", initCalculator);
