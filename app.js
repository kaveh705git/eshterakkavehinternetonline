/* ============================================================
   احراز هویت
   ============================================================ */
const ADMIN_USER = "admin";
const ADMIN_PASS = "kaveh123";
const AUTH_KEY = "kaveh_auth";

function doLogin() {
  const u = document.getElementById("loginUser").value.trim();
  const p = document.getElementById("loginPass").value;
  const err = document.getElementById("loginError");

  if (u === ADMIN_USER && p === ADMIN_PASS) {
    sessionStorage.setItem(AUTH_KEY, "1");
    showApp();
    err.textContent = "";
  } else {
    err.textContent = "❌ نام کاربری یا رمز عبور اشتباه است";
  }
}

function doLogout() {
  if (!confirm("از حساب خارج می‌شوید؟")) return;
  sessionStorage.removeItem(AUTH_KEY);
  document.getElementById("mainApp").style.display = "none";
  document.getElementById("loginPage").style.display = "flex";
  document.getElementById("loginUser").value = "";
  document.getElementById("loginPass").value = "";
}

function showApp() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
  renderTable();
  updateBell();
}

/* ============================================================
   تعریف پلن‌ها
   ============================================================ */
const PLANS = {
  bronze: {
    name: "برنزی", className: "badge-bronze",
    services: {
      "کپی، اسکن، پرینت": 30,
      "تایپ و ویرایش متن": 0,
      "طراحی فرم‌های خاص": 0,
      "اکسل و کارهای اداری": 0,
      "ثبت‌نام سامانه‌های دولتی": 3,
      "اسکن مدارک و ارسال آنها": 3,
      "خدمات پرداخت قبوض": "∞",
      "ثبت‌نام و پرداخت‌های آنلاین": 3,
      "تنظیم قرارداد": 0,
      "هدیه مخصوص": "۱ گیگ فیلترشکن"
    }
  },
  silver: {
    name: "نقره‌ای", className: "badge-silver",
    services: {
      "کپی، اسکن، پرینت": 50,
      "تایپ و ویرایش متن": 5,
      "طراحی فرم‌های خاص": 0,
      "اکسل و کارهای اداری": 0,
      "ثبت‌نام سامانه‌های دولتی": 5,
      "اسکن مدارک و ارسال آنها": 5,
      "خدمات پرداخت قبوض": "∞",
      "ثبت‌نام و پرداخت‌های آنلاین": 5,
      "تنظیم قرارداد": 1,
      "هدیه مخصوص": "۵ گیگ فیلترشکن"
    }
  },
  gold: {
    name: "طلایی", className: "badge-gold",
    services: {
      "کپی، اسکن، پرینت": 100,
      "تایپ و ویرایش متن": 10,
      "طراحی فرم‌های خاص": 10,
      "اکسل و کارهای اداری": 10,
      "ثبت‌نام سامانه‌های دولتی": 10,
      "اسکن مدارک و ارسال آنها": 10,
      "خدمات پرداخت قبوض": "∞",
      "ثبت‌نام و پرداخت‌های آنلاین": 10,
      "تنظیم قرارداد": 2,
      "هدیه مخصوص": "۱۰ گیگ فیلترشکن"
    }
  }
};

/* ============================================================
   ذخیره‌سازی
   ============================================================ */
const STORAGE_KEY = "kaveh_subscribers";

function loadSubscribers() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveSubscribers(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
let subscribers = loadSubscribers();

/* ============================================================
   توست
   ============================================================ */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2500);
}

/* ============================================================
   کدها
   ============================================================ */
function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "KV-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}
function generateDiscountCode(plan) {
  const prefix = { bronze: "BRZ", silver: "SLV", gold: "GLD" }[plan] || "KVH";
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = prefix + "-";
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

/* ============================================================
   روزهای باقیمانده
   ============================================================ */
function daysRemaining(startDate, duration) {
  const start = new Date(startDate).getTime();
  const elapsed = Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24));
  return duration - elapsed;
}

/* ============================================================
   افزودن مشترک
   ============================================================ */
function addSubscriber() {
  const fullName = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const plan = document.getElementById("plan").value;
  const duration = parseInt(document.getElementById("duration").value, 10);

  if (!fullName) { showToast("❌ نام را وارد کنید"); return; }
  if (!phone) { showToast("❌ شماره تماس را وارد کنید"); return; }
  if (!duration || duration < 1) { showToast("❌ مدت نامعتبر است"); return; }

  const sub = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    fullName, phone, plan, duration,
    startDate: new Date().toISOString(),
    code: generateCode(),
    discountCode: generateDiscountCode(plan),
    quotas: JSON.parse(JSON.stringify(PLANS[plan].services))
  };

  subscribers.push(sub);
  saveSubscribers(subscribers);

  document.getElementById("fullName").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("duration").value = 30;

  renderTable();
  updateBell();
  showToast("✅ مشترک افزوده شد");
}

/* ============================================================
   حذف مشترک
   ============================================================ */
function deleteSubscriber(id) {
  if (!confirm("از حذف این مشترک مطمئن هستید؟")) return;
  subscribers = subscribers.filter(s => s.id !== id);
  saveSubscribers(subscribers);
  renderTable();
  updateBell();
  showToast("🗑️ حذف شد");
}

/* ============================================================
   رندر جدول
   ============================================================ */
function renderTable() {
  const tbody = document.getElementById("tbody");
  const emptyMsg = document.getElementById("emptyMsg");
  tbody.innerHTML = "";

  if (subscribers.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }
  emptyMsg.style.display = "none";

  subscribers.forEach(sub => {
    const plan = PLANS[sub.plan];
    const remaining = daysRemaining(sub.startDate, sub.duration);
    const startDateStr = new Date(sub.startDate).toLocaleDateString("fa-IR");

    let daysClass = "ok", daysText = `${remaining} روز`;
    if (remaining <= 0) { daysClass = "expired"; daysText = "منقضی شده"; }
    else if (remaining <= 3) { daysClass = "warning"; daysText = `${remaining} روز ⚠️`; }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(sub.fullName)}</td>
      <td>${escapeHtml(sub.phone)}</td>
      <td><span class="badge ${plan.className}">${plan.name}</span></td>
      <td><span class="code-box">${sub.code}</span></td>
      <td>${startDateStr}</td>
      <td class="days-left ${daysClass}">${daysText}</td>
      <td><span class="code-box" style="background:#fef3c7;">${sub.discountCode}</span></td>
      <td>
        <div class="actions">
          <button class="btn-success btn-small" onclick="openServices('${sub.id}')">مدیریت</button>
          <button class="btn-warning btn-small" onclick="openPrintCard('${sub.id}')">🖨️ کارت</button>
          <button class="btn-danger btn-small" onclick="deleteSubscriber('${sub.id}')">حذف</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

/* ============================================================
   Modal خدمات
   ============================================================ */
let currentSubId = null;

function openServices(id) {
  const sub = subscribers.find(s => s.id === id);
  if (!sub) return;
  currentSubId = id;

  const plan = PLANS[sub.plan];
  document.getElementById("modalTitle").textContent = `مدیریت خدمات — ${sub.fullName}`;
  document.getElementById("modalInfo").innerHTML =
    `پلن: <b>${plan.name}</b> &nbsp;|&nbsp; کد مشترک: <b class="code-box">${sub.code}</b>`;

  const discountArea = document.getElementById("discountArea");
  discountArea.style.display = "block";
  discountArea.innerHTML =
    `🎁 <b>کد تخفیف ویژه:</b> <span class="code-box" style="background:#fff;">${sub.discountCode}</span>
     <br><span style="font-size:12px; color:#92400e;">مخصوص همین مشترک برای خریدهای بعدی.</span>`;

  const listEl = document.getElementById("servicesList");
  listEl.innerHTML = "";

  Object.keys(sub.quotas).forEach(serviceName => {
    const quota = sub.quotas[serviceName];
    const isInfinite = quota === "∞";
    const isTextGift = typeof quota === "string" && quota !== "∞";
    const isNumeric = typeof quota === "number";

    let quotaText = "";
    if (isInfinite) quotaText = "نامحدود ∞";
    else if (isTextGift) quotaText = quota;
    else if (isNumeric) quotaText = quota > 0 ? `${quota} باقیمانده` : "تمام شده";

    const row = document.createElement("div");
    row.className = "service-row";
    const encoded = encodeKey(serviceName);
    row.innerHTML = `
      <div>
        <div class="service-name">${serviceName}</div>
        <div class="service-quota">${quotaText}</div>
      </div>
      <div class="service-actions">
        ${
          (isNumeric && quota > 0)
          ? `<input type="number" min="1" max="${quota}" value="1" id="qty-${encoded}">
             <button class="btn-primary btn-small" onclick="useService('${encoded}')">استفاده</button>`
          : (isNumeric && quota === 0)
            ? `<span style="color:#dc2626; font-size:12px;">اتمام سهمیه</span>`
            : isInfinite
              ? `<span style="color:#16a34a; font-size:12px;">بدون محدودیت</span>`
              : `<span style="color:#64748b; font-size:12px;">هدیه</span>`
        }
      </div>
    `;
    listEl.appendChild(row);
  });

  document.getElementById("modalOverlay").classList.add("active");
}

function encodeKey(str) {
  return btoa(unescape(encodeURIComponent(str))).replace(/=/g, "");
}
function decodeKey(key) {
  try { return decodeURIComponent(escape(atob(key))); }
  catch { return key; }
}

function useService(encodedKey) {
  const sub = subscribers.find(s => s.id === currentSubId);
  if (!sub) return;

  const serviceName = decodeKey(encodedKey);
  const input = document.getElementById("qty-" + encodedKey);
  const qty = parseInt(input.value, 10);

  if (!qty || qty < 1) { showToast("❌ تعداد نامعتبر"); return; }

  const current = sub.quotas[serviceName];
  if (typeof current !== "number") return;
  if (qty > current) { showToast("❌ بیشتر از سهمیه!"); return; }

  sub.quotas[serviceName] = current - qty;
  saveSubscribers(subscribers);
  showToast(`✅ ${qty} مورد از «${serviceName}» کسر شد`);
  openServices(currentSubId);
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("active");
  currentSubId = null;
}

/* ============================================================
   خروجی CSV / Excel
   ============================================================ */
function exportCSV() {
  if (subscribers.length === 0) { showToast("❌ مشترکی وجود ندارد"); return; }

  const headers = [
    "نام و نام خانوادگی", "شماره تماس", "نوع اشتراک",
    "کد مخصوص", "تاریخ شروع", "مدت (روز)", "روزهای باقیمانده",
    "کد تخفیف ویژه"
  ];

  const rows = subscribers.map(s => {
    const plan = PLANS[s.plan];
    const remaining = daysRemaining(s.startDate, s.duration);
    return [
      s.fullName, s.phone, plan.name, s.code,
      new Date(s.startDate).toLocaleDateString("fa-IR"),
      s.duration,
      remaining <= 0 ? "منقضی" : remaining,
      s.discountCode
    ];
  });

  let csv = "\uFEFF";
  csv += headers.map(h => `"${h}"`).join(",") + "\n";
  rows.forEach(r => {
    csv += r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `kaveh_subscribers_${new Date().toISOString().slice(0,10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);

  showToast("📤 فایل Excel دانلود شد");
}

/* ============================================================
   یادآوری انقضا
   ============================================================ */
function getExpiringSoon() {
  return subscribers.filter(s => {
    const r = daysRemaining(s.startDate, s.duration);
    return r <= 3;
  });
}

function updateBell() {
  const items = getExpiringSoon();
  const bell = document.getElementById("bellCount");
  if (items.length > 0) {
    bell.style.display = "flex";
    bell.textContent = items.length;
  } else {
    bell.style.display = "none";
  }
  renderNotifPanel();
}

function renderNotifPanel() {
  const list = document.getElementById("notifList");
  const items = getExpiringSoon();

  if (items.length === 0) {
    list.innerHTML = `<div style="text-align:center; color:#64748b; font-size:13px; padding:15px;">
      ✅ هیچ اشتراکی در آستانه انقضا نیست.
    </div>`;
    return;
  }

  list.innerHTML = items.map(s => {
    const r = daysRemaining(s.startDate, s.duration);
    const expired = r <= 0;
    return `
      <div class="notif-item ${expired ? "danger" : ""}">
        <div>
          <b>${escapeHtml(s.fullName)}</b> — ${s.phone}
          <br><span style="font-size:11px;">
            ${expired ? "❌ منقضی شده" : `⚠️ ${r} روز تا انقضا`}
          </span>
        </div>
        <button class="btn-info btn-small" onclick="openServices('${s.id}')">مشاهده</button>
      </div>
    `;
  }).join("");
}

function toggleNotifications() {
  const p = document.getElementById("notifPanel");
  p.classList.toggle("active");
  if (p.classList.contains("active")) renderNotifPanel();
}

/* ============================================================
   چاپ کارت مشترک
   ============================================================ */
function openPrintCard(id) {
  const sub = subscribers.find(s => s.id === id);
  if (!sub) return;

  const plan = PLANS[sub.plan];
  const remaining = daysRemaining(sub.startDate, sub.duration);
  const startDateStr = new Date(sub.startDate).toLocaleDateString("fa-IR");
  const planColor = { bronze: "#b45309", silver: "#94a3b8", gold: "#eab308" }[sub.plan];

  document.getElementById("printCardContent").innerHTML = `
    <div class="brand">🌐 خدمات اینترنتی آنلاین کاوه</div>
    <div class="row"><span>نام:</span><span>${escapeHtml(sub.fullName)}</span></div>
    <div class="row"><span>تلفن:</span><span>${escapeHtml(sub.phone)}</span></div>
    <div class="row"><span>تاریخ شروع:</span><span>${startDateStr}</span></div>
    <div class="row">
      <span>روزهای باقیمانده:</span>
      <span style="color:${remaining <= 0 ? "#f87171" : "#4ade80"};">
        ${remaining <= 0 ? "منقضی" : remaining + " روز"}
      </span>
    </div>
    <div style="margin-top:8px;">
      <span class="plan-line" style="background:${planColor}; color:#fff;">
        ${plan.name}
      </span>
    </div>
    <div class="code-line">${sub.code}</div>
    <div class="discount-line">
      🎁 کد تخفیف: ${sub.discountCode}
    </div>
  `;

  document.getElementById("printModal").classList.add("active");
}

function closePrintModal() {
  document.getElementById("printModal").classList.remove("active");
}

/* ============================================================
   راه‌اندازی اولیه
   ============================================================ */
if (sessionStorage.getItem(AUTH_KEY) === "1") {
  showApp();
}

setInterval(() => {
  if (sessionStorage.getItem(AUTH_KEY) === "1") {
    renderTable();
    updateBell();
  }
}, 60000);