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
  hostingServices: {
    "Managed Hosting (Standard)": [45, 65, 95, 125],
    "Managed Hosting (Premium SLA)": [85, 125, 165, 225],
    "Enterprise Cloud Stack": [150, 225, 325, 425]
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
  },
  mediaAutomation: {
    "None": [0],
    "Auto-Posting + Scheduling Suite": [950, 1200, 1500, 1900],
    "Content Repurposing Pipeline": [1200, 1500, 2000, 2400],
    "AI Media Ops Command": [1600, 2100, 2600, 3100]
  },
  crmBuild: {
    "None": [0],
    "Sales Pipeline CRM": [1800, 2300, 2800, 3400],
    "Service Desk Workspace": [2200, 2800, 3400, 4000],
    "Enterprise Partner OS": [3500, 4200, 5200, 6200]
  }
};

const recurringServices = {
  "SEO & Analytics Monitoring": [150, 250, 350, 450],
  "Maintenance & Support": [200, 300, 400, 550],
  "Email Marketing Campaigns": [100, 175, 250, 325],
};

// Preset packages for quick-fill from homepage
const packagePresets = {
  starter: {
    tier1: "Landing Page",
    tier2: "None",
    addOns: ["Responsive Testing & Fixes", "Performance Optimization"],
    api: ["Email Marketing"],
    hosting: [],
    recurring: []
  },
  standard: {
    tier1: "Basic WordPress / Shopify Setup",
    tier2: "None",
    addOns: ["SEO Optimization", "Blog / CMS Setup", "Responsive Testing & Fixes", "Performance Optimization"],
    api: [],
    hosting: [],
    recurring: []
  },
  ecommerce: {
    tier1: "Small E-commerce Setup",
    tier2: "None",
    addOns: ["SEO Optimization", "Blog / CMS Setup", "Responsive Testing & Fixes", "Performance Optimization"],
    api: ["Email Marketing", "Chat & Customer Support"],
    hosting: ["Managed Hosting (Standard)"],
    recurring: ["Maintenance & Support", "Email Marketing Campaigns"]
  }
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

  const mediaAutomationSelect = document.getElementById("mediaAutomation");
  if (mediaAutomationSelect && mediaAutomationSelect.value !== "None") {
    const price = pricingData.mediaAutomation[mediaAutomationSelect.value][0];
    total += price;
    itemized.push(`${mediaAutomationSelect.value} (Media Automation) - $${price}`);
  }

  const crmSelect = document.getElementById("crmBuild");
  if (crmSelect && crmSelect.value !== "None") {
    const price = pricingData.crmBuild[crmSelect.value][0];
    total += price;
    itemized.push(`${crmSelect.value} (Custom CRM) - $${price}`);
  }

  [
    { selector: "#addOns", data: pricingData.addOns, label: "Add-On" },
    { selector: "#apiIntegrations", data: pricingData.apiIntegrations, label: "API" },
    { selector: "#hostingServices", data: pricingData.hostingServices, label: "Hosting", monthly: true },
    { selector: "#recurringServicesContainer", data: recurringServices, label: "Monthly", monthly: true }
  ].forEach(({ selector, data, label, monthly }) => {
    document.querySelectorAll(`${selector} input[type=checkbox]:checked`).forEach(cb => {
      const key = cb.dataset.key;
      const select = cb.closest(".checkbox-item").querySelector("select");
      const price = data[key][select.value];
      total += price;
      itemized.push(`${key} (${label}) - $${price}${monthly ? "/mo" : ""}`);
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
  populateSelect(document.getElementById("mediaAutomation"), pricingData.mediaAutomation);
  populateSelect(document.getElementById("crmBuild"), pricingData.crmBuild);
  populateCheckboxGroup(document.getElementById("addOns"), pricingData.addOns);
  populateCheckboxGroup(document.getElementById("hostingServices"), pricingData.hostingServices, true);
  populateCheckboxGroup(document.getElementById("apiIntegrations"), pricingData.apiIntegrations);
  populateCheckboxGroup(document.getElementById("recurringServicesContainer"), recurringServices, true);

  document.getElementById("tier1").addEventListener("change", calculateTotal);
  document.getElementById("tier2").addEventListener("change", calculateTotal);
  document.getElementById("mediaAutomation").addEventListener("change", calculateTotal);
  document.getElementById("crmBuild").addEventListener("change", calculateTotal);

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
  const nameInput = document.getElementById('customerName');
  const emailInput = document.getElementById('customerEmail');
  if (name && nameInput) nameInput.value = name;
  if (email && emailInput) emailInput.value = email;

  // ----- Recalculate total -----
  calculateTotal();
}

// =========================
// Package quick-fill helpers
// =========================
function resetSelections() {
  const tier1 = document.getElementById("tier1");
  const tier2 = document.getElementById("tier2");
  if (tier1) { tier1.value = "None"; }
  if (tier2) { tier2.value = "None"; }

  document.querySelectorAll(".checkbox-item").forEach(item => {
    const cb = item.querySelector("input[type=checkbox]");
    const sel = item.querySelector("select");
    if (cb) cb.checked = false;
    if (sel) {
      sel.disabled = true;
      sel.selectedIndex = 0;
    }
  });
}

function applyPackagePreset(presetName) {
  const preset = packagePresets[presetName];
  if (!preset) return false;

  resetSelections();

  const tier1 = document.getElementById("tier1");
  const tier2 = document.getElementById("tier2");
  if (tier1 && preset.tier1) tier1.value = preset.tier1;
  if (tier2 && preset.tier2) tier2.value = preset.tier2;

  const applyGroup = (selector, names=[]) => {
    names.forEach(name => {
      const checkbox = Array.from(document.querySelectorAll(`${selector} input[type=checkbox]`))
        .find(cb => cb.dataset.key === name);
      if (checkbox) {
        checkbox.checked = true;
        const sel = checkbox.closest(".checkbox-item")?.querySelector("select");
        if (sel) {
          sel.disabled = false;
          sel.selectedIndex = 0;
        }
      }
    });
  };

  applyGroup("#addOns", preset.addOns || []);
  applyGroup("#apiIntegrations", preset.api || []);
  applyGroup("#hostingServices", preset.hosting || []);
  applyGroup("#recurringServicesContainer", preset.recurring || []);

  calculateTotal();
  return true;
}

// ----- Run on page load -----
let calculatorInitialized = false;
function bootstrapCalculator() {
  if (calculatorInitialized) return;
  calculatorInitialized = true;

  initCalculator(); // initialize selects and checkboxes

  const urlPreset = new URLSearchParams(window.location.search).get("preset");
  const storedPreset = localStorage.getItem("prefillPackage");
  const preset = urlPreset || storedPreset;

  const presetApplied = preset ? applyPackagePreset(preset) : false;
  if (presetApplied) {
    localStorage.removeItem("prefillPackage");
  } else {
    prefillFromSurvey(); // prefill based on survey if no preset
  }
}
// expose for safety re-calls
window.bootstrapCalculator = bootstrapCalculator;
window.applyPackagePreset = applyPackagePreset;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrapCalculator);
} else {
  bootstrapCalculator();
}

// Fallback: retry preset after full load in case of caching/delays
window.addEventListener("load", () => {
  const preset = new URLSearchParams(window.location.search).get("preset") || localStorage.getItem("prefillPackage");
  if (preset && applyPackagePreset(preset)) {
    localStorage.removeItem("prefillPackage");
  }
});

// Collapsible sections (Services page)
document.addEventListener("click", e => {
  const toggle = e.target.closest(".collapsible");
  if (!toggle) return;
  const content = toggle.nextElementSibling;
  content.classList.toggle("open");
  content.style.maxHeight = content.classList.contains("open") ? content.scrollHeight + "px" : "0";
  const icon = toggle.querySelector(".fa-chevron-down, .fa-chevron-up");
  if (icon) {
    icon.classList.toggle("fa-chevron-down");
    icon.classList.toggle("fa-chevron-up");
  }
});

// Send Estimate via EmailJS (Services page)
function sendEstimate() {
  const total = document.getElementById("totalPrice").textContent;
  const itemizedHTML = Array.from(document.querySelectorAll("#itemizedList div"))
    .map(div => {
      const [item, price] = div.textContent.split(" - $");
      return `<tr><td>${item}</td><td>$${price}</td></tr>`;
    }).join("");
  const userEmail = document.getElementById("customerEmail").value;
  const userName = document.getElementById("customerName").value;
  if (!userEmail || !userName) {
    alert("Please enter your name and email.");
    return;
  }

  const templateParams = {
    total_price: total,
    itemized_list: itemizedHTML,
    user_email: userEmail,
    user_name: userName
  };

  emailjs.send("service_h5mqhzn", "template_lckjawf", templateParams)
    .then(() => alert("✅ Estimate sent!"))
    .catch(err => alert("❌ Error sending estimate: " + JSON.stringify(err)));
}
