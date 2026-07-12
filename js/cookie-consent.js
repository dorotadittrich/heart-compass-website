/* ============================================
   Heart Compass Psychotherapy - zgoda na cookies
   ============================================
   Zapisuje wybór użytkownika w localStorage pod kluczem "cookie-consent"
   ("accepted" lub "rejected"). Udostępnia window.cookieConsentGiven,
   z którego może korzystać Google Tag Manager / Analytics, żeby nie
   ładować się przed wyrażeniem zgody (zgodnie z RODO).
------------------------------------------- */

(function () {
  const STORAGE_KEY = "cookie-consent";
  const banner = document.getElementById("cookieBanner");
  const acceptBtn = document.getElementById("cookieAccept");
  const rejectBtn = document.getElementById("cookieReject");

  function getStoredConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      /* localStorage niedostępny - baner pokaże się ponownie przy kolejnej wizycie */
    }
  }

  function hideBanner() {
    banner.classList.remove("is-visible");
    banner.setAttribute("aria-hidden", "true");
  }

  function showBanner() {
    banner.classList.add("is-visible");
    banner.setAttribute("aria-hidden", "false");
  }

  function grantConsent() {
    window.cookieConsentGiven = true;
    // Sygnał dla Google Tag Manager / Consent Mode - patrz sekcja GTM w <head>
    if (typeof gtag === "function") {
      gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
    document.dispatchEvent(new CustomEvent("cookieConsentAccepted"));
  }

  const stored = getStoredConsent();

  if (stored === "accepted") {
    grantConsent();
  } else if (stored !== "rejected") {
    // Brak decyzji zapisanej wcześniej - pokaż baner
    showBanner();
  }

  acceptBtn.addEventListener("click", function () {
    setStoredConsent("accepted");
    grantConsent();
    hideBanner();
  });

  rejectBtn.addEventListener("click", function () {
    setStoredConsent("rejected");
    window.cookieConsentGiven = false;
    hideBanner();
  });
})();
