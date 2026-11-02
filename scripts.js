(() => {
  "use strict";

  const menuToggle = document.getElementById("menu-toggle");
  const navigation = document.getElementById("site-navigation");
  const footerYear = document.getElementById("footer-year");
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear());
  }

  function closeMenu() {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isExpanded));
      menuToggle.setAttribute(
        "aria-label",
        isExpanded ? "Open navigation menu" : "Close navigation menu"
      );
      navigation.classList.toggle("is-open", !isExpanded);
      document.body.classList.toggle("menu-open", !isExpanded);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
      const accessKey = accessKeyInput ? accessKeyInput.value.trim() : "";

      if (!accessKey || accessKey === "REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY") {
        if (formStatus) {
          formStatus.textContent =
            "The contact form is not configured yet. Please add your Web3Forms access key before publishing.";
        }
        return;
      }

      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton ? submitButton.innerHTML : "";

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending…";
      }
      if (formStatus) formStatus.textContent = "";

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" }
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error("The form provider did not accept the submission.");
        }

        contactForm.reset();
        if (formStatus) {
          formStatus.textContent = "Thanks for reaching out. Your inquiry has been sent.";
        }
      } catch (error) {
        if (formStatus) {
          formStatus.textContent =
            "Sorry, the message could not be sent. Please try again in a moment.";
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonText;
        }
      }
    });
  }
})();
