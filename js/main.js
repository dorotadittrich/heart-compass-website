/* ============================================
   Heart Compass Psychotherapy — site script
   ============================================ */

/* ---------- 1. SUPABASE CONFIG ----------
   Fill these in once you've created your own Supabase project.
   Project Settings → API → Project URL / anon public key.
   These two values are safe to keep in public front-end code —
   they are the public "anon" key, not a secret admin key.
------------------------------------------- */
const SUPABASE_URL = "https://qijyaibyiswjjegtlser.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpanlhaWJ5aXN3amplZ3Rsc2VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MDY0NTQsImV4cCI6MjA5OTE4MjQ1NH0.EJuxAFd9FDMmUJ0klp4_fSSXGK0KqmaNPp19moXlSMY";
const SUPABASE_TABLE = "contact_submissions";

/* ---------- 2. Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- 3. Mobile menu ---------- */
const header = document.querySelector(".site-header");
const menuToggle = document.getElementById("menuToggle");

menuToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

document.querySelectorAll(".mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

/* ---------- 4. Scroll reveal ---------- */
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => io.observe(el));

/* ---------- 5. Contact form -> Supabase ---------- */
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Honeypot check — if this hidden field is filled, it's a bot.
  if (form.companyWebsite.value) return;

  if (SUPABASE_URL.startsWith("PASTE_") || SUPABASE_ANON_KEY.startsWith("PASTE_")) {
    statusEl.textContent = "Form is not connected yet — add your Supabase URL and key in js/main.js.";
    statusEl.dataset.state = "error";
    return;
  }

  const payload = {
    enquiry_reason: form.reason.value,
    first_name: form.firstName.value.trim(),
    surname: form.surname.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim(),
    preferred_contact: form.preferredContact.value,
    additional_info: form.additionalInfo.value.trim(),
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";
  statusEl.textContent = "";
  statusEl.removeAttribute("data-state");

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `Request failed with status ${res.status}`);
    }

    form.reset();
    statusEl.textContent = "Thank you — your message has been sent. I'll be in touch within 24 hours.";
    statusEl.dataset.state = "success";
  } catch (err) {
    console.error("Contact form submission failed:", err);
    statusEl.textContent = "Something went wrong sending your message. Please try again or email directly.";
    statusEl.dataset.state = "error";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Start your healing journey";
  }
});
