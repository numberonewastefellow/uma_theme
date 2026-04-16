/**
 * UMA HELP — Contextual Help System for ERPNext
 * Slide panel + field tooltips, i18n-ready
 */

(function () {
  "use strict";
  if (typeof frappe === "undefined") return;

  var HELP_DB = null;
  var HELP_LOADING = false;
  var HELP_LANG = (frappe.boot && frappe.boot.lang) || "en";
  var CACHE_KEY = "uma_help_" + HELP_LANG;
  var CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  // ── Load Help Database ───────────────────────────────────────────────
  function loadHelpDB(callback) {
    if (HELP_DB) { if (callback) callback(HELP_DB); return; }
    if (HELP_LOADING) { setTimeout(function () { loadHelpDB(callback); }, 200); return; }

    // Try localStorage cache
    try {
      var cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        var parsed = JSON.parse(cached);
        if (parsed._ts && (Date.now() - parsed._ts) < CACHE_TTL) {
          HELP_DB = parsed.data;
          if (callback) callback(HELP_DB);
          return;
        }
      }
    } catch (e) { /* ignore */ }

    // Fetch from server
    HELP_LOADING = true;
    var lang = HELP_LANG;
    var url = "/assets/uma_theme/help/" + lang + ".json";

    fetch(url)
      .then(function (r) {
        if (!r.ok && lang !== "en") {
          // Fallback to English
          return fetch("/assets/uma_theme/help/en.json");
        }
        return r;
      })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        HELP_DB = data;
        HELP_LOADING = false;
        // Cache
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ _ts: Date.now(), data: data }));
        } catch (e) { /* quota exceeded — ignore */ }
        if (callback) callback(HELP_DB);
      })
      .catch(function (err) {
        HELP_LOADING = false;
        console.warn("Uma Help: Could not load help database", err);
      });
  }

  // ── Inject Help Button in Page Header ────────────────────────────────
  function injectHelpButton(doctype) {
    // Don't duplicate
    if (document.querySelector(".uma-help-btn")) return;

    var pageActions = document.querySelector(".page-head .page-actions");
    if (!pageActions) return;

    var btn = document.createElement("button");
    btn.className = "btn btn-default btn-sm uma-help-btn";
    btn.setAttribute("title", "Help — What is this page?");
    btn.innerHTML = '<span class="uma-help-btn-icon">?</span>';
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleHelpPanel(doctype);
    });

    // Insert before other buttons
    pageActions.insertBefore(btn, pageActions.firstChild);
  }

  // ── Help Panel ───────────────────────────────────────────────────────
  function getOrCreatePanel() {
    var panel = document.querySelector(".uma-help-panel");
    if (panel) return panel;

    panel = document.createElement("div");
    panel.className = "uma-help-panel";
    panel.innerHTML =
      '<div class="uma-help-overlay"></div>' +
      '<div class="uma-help-drawer">' +
        '<div class="uma-help-header">' +
          '<div>' +
            '<h3 class="uma-help-title"></h3>' +
            '<span class="uma-help-module-badge"></span>' +
          '</div>' +
          '<button class="uma-help-close">&times;</button>' +
        '</div>' +
        '<div class="uma-help-body"></div>' +
      '</div>';

    document.body.appendChild(panel);

    // Close handlers
    panel.querySelector(".uma-help-close").addEventListener("click", closeHelpPanel);
    panel.querySelector(".uma-help-overlay").addEventListener("click", closeHelpPanel);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeHelpPanel();
    });

    return panel;
  }

  function toggleHelpPanel(doctype) {
    var panel = getOrCreatePanel();
    if (panel.classList.contains("open")) {
      closeHelpPanel();
      return;
    }

    loadHelpDB(function (db) {
      var help = db[doctype];
      if (!help) {
        frappe.show_alert({ message: "No help available for " + doctype, indicator: "yellow" });
        return;
      }

      renderHelpPanel(panel, doctype, help);
      panel.classList.add("open");
      document.body.classList.add("uma-help-open");
    });
  }

  function closeHelpPanel() {
    var panel = document.querySelector(".uma-help-panel");
    if (panel) {
      panel.classList.remove("open");
      document.body.classList.remove("uma-help-open");
    }
  }

  function renderHelpPanel(panel, doctype, help) {
    var page = help.page || {};
    var fields = help.fields || {};
    var module = help.module || "";

    panel.querySelector(".uma-help-title").textContent = doctype;
    var badge = panel.querySelector(".uma-help-module-badge");
    badge.textContent = module;
    badge.style.display = module ? "" : "none";

    var body = panel.querySelector(".uma-help-body");
    var html = "";

    // Purpose
    if (page.purpose) {
      html += '<div class="uma-help-section">' +
        '<h4>\uD83D\uDCCB Purpose</h4>' +
        '<p>' + escapeHtml(page.purpose) + '</p>' +
      '</div>';
    }

    // Workflow
    if (page.workflow) {
      html += '<div class="uma-help-section">' +
        '<h4>\uD83D\uDD04 Workflow</h4>' +
        '<div class="uma-help-workflow">' + escapeHtml(page.workflow) + '</div>' +
      '</div>';
    }

    // Tips
    if (page.tips && page.tips.length) {
      html += '<div class="uma-help-section">' +
        '<h4>\uD83D\uDCA1 Tips</h4><ul>';
      for (var i = 0; i < page.tips.length; i++) {
        html += '<li>' + escapeHtml(page.tips[i]) + '</li>';
      }
      html += '</ul></div>';
    }

    // Key Fields
    var fieldKeys = Object.keys(fields);
    if (fieldKeys.length > 0) {
      html += '<div class="uma-help-section">' +
        '<h4>\uD83D\uDDD2\uFE0F Key Fields</h4>' +
        '<dl class="uma-help-fields">';
      for (var j = 0; j < fieldKeys.length && j < 20; j++) {
        var fn = fieldKeys[j];
        var label = fn.replace(/_/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
        // Try to get proper label from current form
        if (cur_frm && cur_frm.fields_dict && cur_frm.fields_dict[fn]) {
          var fld = cur_frm.fields_dict[fn];
          if (fld.df && fld.df.label) label = fld.df.label;
        }
        html += '<dt>' + escapeHtml(label) + '</dt>' +
          '<dd>' + escapeHtml(fields[fn]) + '</dd>';
      }
      html += '</dl></div>';
    }

    if (!html) {
      html = '<div class="uma-help-empty">No detailed help available for this form yet.</div>';
    }

    body.innerHTML = html;
  }

  // ── Field Tooltips ───────────────────────────────────────────────────
  function injectFieldTooltips(doctype) {
    loadHelpDB(function (db) {
      var help = db[doctype];
      if (!help || !help.fields) return;

      var fields = help.fields;

      // Remove existing tooltips first (prevent duplicates on re-render)
      document.querySelectorAll(".uma-field-help").forEach(function (el) { el.remove(); });

      // Find all visible field labels on the form
      var controlLabels = document.querySelectorAll(".frappe-control .control-label");
      controlLabels.forEach(function (labelEl) {
        var control = labelEl.closest(".frappe-control");
        if (!control) return;

        var fieldname = control.getAttribute("data-fieldname");
        if (!fieldname || !fields[fieldname]) return;

        // Don't add to checkboxes (they have different label structure)
        if (control.getAttribute("data-fieldtype") === "Check") return;

        // Add (i) icon
        var icon = document.createElement("span");
        icon.className = "uma-field-help";
        icon.setAttribute("data-help", fields[fieldname]);
        icon.textContent = "\u24D8"; // ⓘ
        icon.addEventListener("mouseenter", showFieldTooltip);
        icon.addEventListener("mouseleave", hideFieldTooltip);
        icon.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          showFieldTooltipClick(this);
        });
        labelEl.appendChild(icon);
      });
    });
  }

  // ── Field Tooltip Popup ──────────────────────────────────────────────
  var tooltipEl = null;

  function getTooltipEl() {
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.className = "uma-field-tooltip";
      document.body.appendChild(tooltipEl);
    }
    return tooltipEl;
  }

  function showFieldTooltip(e) {
    var tip = getTooltipEl();
    var text = this.getAttribute("data-help");
    tip.textContent = text;
    tip.classList.add("visible");

    var rect = this.getBoundingClientRect();
    tip.style.top = (rect.bottom + 6) + "px";
    tip.style.left = Math.min(rect.left, window.innerWidth - 320) + "px";
  }

  function hideFieldTooltip() {
    var tip = getTooltipEl();
    tip.classList.remove("visible");
  }

  function showFieldTooltipClick(el) {
    var text = el.getAttribute("data-help");
    frappe.show_alert({ message: text, indicator: "blue" }, 5);
  }

  // ── Utils ────────────────────────────────────────────────────────────
  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // ── Lifecycle ────────────────────────────────────────────────────────
  function onFormPage() {
    var route = frappe.get_route();
    if (!route || route[0] !== "Form") {
      // Remove help button if not on form
      var btn = document.querySelector(".uma-help-btn");
      if (btn) btn.remove();
      // Remove field tooltips
      document.querySelectorAll(".uma-field-help").forEach(function (el) { el.remove(); });
      return;
    }

    var doctype = route[1];
    setTimeout(function () {
      injectHelpButton(doctype);
      injectFieldTooltips(doctype);
    }, 500);
  }

  // Preload help DB
  loadHelpDB();

  // Hook into page changes
  $(document).on("page-change", onFormPage);
  $(document).on("form-refresh", function () {
    var route = frappe.get_route();
    if (route && route[0] === "Form") {
      // Re-inject help button (page-head may have re-rendered)
      var existing = document.querySelector(".uma-help-btn");
      if (existing) existing.remove();
      setTimeout(function () {
        injectHelpButton(route[1]);
        injectFieldTooltips(route[1]);
      }, 300);
    }
  });

  // Initial check
  setTimeout(onFormPage, 1000);

})();
