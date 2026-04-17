/**
 * UMA THEME v3 — "Think Less Do More"
 * Roboflow-Inspired ERPNext v16 Desk
 * Bento Grid Home + Sidebar Branding + Live Stats
 */

(function () {
  "use strict";
  if (typeof frappe === "undefined") return;

  // ══════════════════════════════════════════════════════════════════════
  // SIDEBAR BRANDING
  // ══════════════════════════════════════════════════════════════════════

  function brandSidebarHeader() {
    var subtitle = document.querySelector('.sidebar-header .header-subtitle');
    if (subtitle && !subtitle.classList.contains('uma-branded')) {
      subtitle.textContent = 'think less do more';
      subtitle.classList.add('uma-branded');
    }
    var logo = document.querySelector('.sidebar-header .header-logo');
    if (logo && !logo.classList.contains('uma-branded')) {
      var existing = logo.querySelector('svg, img, .icon');
      if (existing) existing.style.display = 'none';
      if (!logo.querySelector('.uma-logo-icon')) {
        var s = document.createElement('span');
        s.className = 'uma-logo-icon';
        s.textContent = '\u2726';
        logo.appendChild(s);
      }
      logo.classList.add('uma-branded');
    }
  }

  var sidebarObserver = null;
  function startSidebarObserver() {
    if (sidebarObserver) return;
    var target = document.querySelector('.body-sidebar');
    if (!target) { setTimeout(startSidebarObserver, 500); return; }
    sidebarObserver = new MutationObserver(function () {
      var h = document.querySelector('.sidebar-header .header-subtitle');
      if (h && !h.classList.contains('uma-branded')) brandSidebarHeader();
    });
    sidebarObserver.observe(target, { childList: true, subtree: true });
  }

  // ══════════════════════════════════════════════════════════════════════
  // BENTO GRID HOME PAGE
  // ══════════════════════════════════════════════════════════════════════

  var MODULE_CONFIG = [
    {
      id: 'manufacturing', title: 'Manufacturing', icon: '\uD83C\uDFED',
      desc: 'Production planning, work orders, and job tracking',
      color: '#6366f1',
      route: '/app/manufacturing',
      stats: [
        { label: 'Work Orders', doctype: 'Work Order' },
        { label: 'BOMs', doctype: 'BOM' },
      ],
      links: [
        { label: 'Work Order', route: '/app/work-order' },
        { label: 'Job Card', route: '/app/job-card' },
        { label: 'BOM', route: '/app/bom' },
        { label: 'Production Plan', route: '/app/production-plan' },
      ]
    },
    {
      id: 'stock', title: 'Stock', icon: '\uD83D\uDCE6',
      desc: 'Inventory, warehouses, and material tracking',
      color: '#059669',
      route: '/app/stock',
      stats: [
        { label: 'Items', doctype: 'Item' },
        { label: 'Warehouses', doctype: 'Warehouse' },
      ],
      links: [
        { label: 'Item', route: '/app/item' },
        { label: 'Stock Entry', route: '/app/stock-entry' },
        { label: 'Material Request', route: '/app/material-request' },
        { label: 'Delivery Note', route: '/app/delivery-note' },
      ]
    },
    {
      id: 'accounting', title: 'Accounting', icon: '\uD83D\uDCB0',
      desc: 'Invoicing, payments, and financial reports',
      color: '#d97706',
      route: '/app/accounting',
      stats: [
        { label: 'Sales Invoices', doctype: 'Sales Invoice' },
        { label: 'Purchase Invoices', doctype: 'Purchase Invoice' },
      ],
      links: [
        { label: 'Sales Invoice', route: '/app/sales-invoice' },
        { label: 'Payment Entry', route: '/app/payment-entry' },
        { label: 'Journal Entry', route: '/app/journal-entry' },
        { label: 'Chart of Accounts', route: '/app/account' },
      ]
    },
    {
      id: 'selling', title: 'Selling', icon: '\uD83D\uDCCB',
      desc: 'Quotations, sales orders, and customer management',
      color: '#0891b2',
      route: '/app/selling',
      stats: [
        { label: 'Sales Orders', doctype: 'Sales Order' },
        { label: 'Customers', doctype: 'Customer' },
      ],
      links: [
        { label: 'Sales Order', route: '/app/sales-order' },
        { label: 'Quotation', route: '/app/quotation' },
        { label: 'Customer', route: '/app/customer' },
      ]
    },
    {
      id: 'buying', title: 'Buying', icon: '\uD83D\uDED2',
      desc: 'Purchase orders, suppliers, and procurement',
      color: '#7c3aed',
      route: '/app/buying',
      stats: [
        { label: 'Purchase Orders', doctype: 'Purchase Order' },
        { label: 'Suppliers', doctype: 'Supplier' },
      ],
      links: [
        { label: 'Purchase Order', route: '/app/purchase-order' },
        { label: 'Supplier', route: '/app/supplier' },
        { label: 'Purchase Receipt', route: '/app/purchase-receipt' },
      ]
    },
    {
      id: 'quality', title: 'Quality', icon: '\u2705',
      desc: 'Inspections, QC templates, and compliance',
      color: '#059669',
      route: '/app/quality',
      stats: [
        { label: 'Inspections', doctype: 'Quality Inspection' },
      ],
      links: [
        { label: 'Quality Inspection', route: '/app/quality-inspection' },
        { label: 'QI Template', route: '/app/quality-inspection-template' },
      ]
    },
    {
      id: 'projects', title: 'Projects', icon: '\uD83D\uDCCA',
      desc: 'Project tracking, tasks, and timesheets',
      color: '#2563eb',
      route: '/app/projects',
      stats: [
        { label: 'Projects', doctype: 'Project' },
      ],
      links: [
        { label: 'Project', route: '/app/project' },
        { label: 'Task', route: '/app/task' },
        { label: 'Timesheet', route: '/app/timesheet' },
      ]
    },
    {
      id: 'assets', title: 'Assets', icon: '\uD83C\uDFE2',
      desc: 'Fixed assets, depreciation, and maintenance',
      color: '#475569',
      route: '/app/assets',
      stats: [
        { label: 'Assets', doctype: 'Asset' },
      ],
      links: [
        { label: 'Asset', route: '/app/asset' },
        { label: 'Asset Category', route: '/app/asset-category' },
        { label: 'Maintenance', route: '/app/asset-maintenance' },
      ]
    },
    {
      id: 'hr', title: 'Organization', icon: '\uD83D\uDC65',
      desc: 'Company, employees, departments, and users',
      color: '#be185d',
      route: '/app/organization',
      stats: [
        { label: 'Employees', doctype: 'Employee' },
      ],
      links: [
        { label: 'Company', route: '/app/company' },
        { label: 'Employee', route: '/app/employee' },
        { label: 'Department', route: '/app/department' },
        { label: 'User', route: '/app/user' },
      ]
    },
    {
      id: 'hrms', title: 'Human Resources', icon: '\uD83D\uDC64',
      desc: 'Leaves, attendance, shifts, and holidays',
      color: '#9333ea',
      route: '/app/hr',
      stats: [
        { label: 'Leave Apps', doctype: 'Leave Application' },
        { label: 'Attendance', doctype: 'Attendance' },
      ],
      links: [
        { label: 'Leave Application', route: '/app/leave-application' },
        { label: 'Attendance', route: '/app/attendance' },
        { label: 'Holiday List', route: '/app/holiday-list' },
        { label: 'Shift Assignment', route: '/app/shift-assignment' },
      ]
    },
    {
      id: 'payroll', title: 'Payroll', icon: '\uD83D\uDCB5',
      desc: 'Salary structures, slips, and payroll runs',
      color: '#16a34a',
      route: '/app/payroll',
      stats: [
        { label: 'Salary Slips', doctype: 'Salary Slip' },
        { label: 'Structures', doctype: 'Salary Structure' },
      ],
      links: [
        { label: 'Salary Slip', route: '/app/salary-slip' },
        { label: 'Salary Structure', route: '/app/salary-structure' },
        { label: 'Structure Assignment', route: '/app/salary-structure-assignment' },
        { label: 'Payroll Entry', route: '/app/payroll-entry' },
      ]
    },
    {
      id: 'gst', title: 'GST India', icon: '\uD83C\uDDEE\uD83C\uDDF3',
      desc: 'GST compliance, returns, and e-invoicing',
      color: '#ea580c',
      route: '/app/gst-india',
      stats: [],
      links: [
        { label: 'GST Settings', route: '/app/gst-settings' },
        { label: 'GSTR-1', route: '/app/gstr-1-beta' },
      ]
    },
    {
      id: 'settings', title: 'Settings', icon: '\u2699\uFE0F',
      desc: 'System configuration and ERPNext settings',
      color: '#64748b',
      route: '/app/erpnext-settings',
      stats: [],
      links: [
        { label: 'ERPNext Settings', route: '/app/erpnext-settings' },
        { label: 'Stock Settings', route: '/app/stock-settings' },
        { label: 'Manufacturing Settings', route: '/app/manufacturing-settings' },
      ]
    },
  ];

  function getGreeting() {
    var h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }

  function getUserName() {
    var name = (frappe.session && frappe.session.user_fullname) || 'there';
    var first = name.split(' ')[0];
    return first === 'Administrator' ? 'Admin' : first;
  }

  function buildBentoHTML() {
    var today = new Date().toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      timeZone: 'Asia/Kolkata'
    });

    var heroHTML =
      '<div class="uma-hero">' +
        '<div class="uma-hero-content">' +
          '<div class="uma-hero-icon">\u2726</div>' +
          '<div>' +
            '<h1 class="uma-hero-title">' + getGreeting() + ', ' + getUserName() + '</h1>' +
            '<p class="uma-hero-sub">Uma Furnitures ERP &middot; ' + today + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="uma-hero-actions">' +
          '<a href="/app/sales-order/new" class="uma-hero-btn uma-hero-btn-primary">+ New Sales Order</a>' +
          '<a href="/app/item/new" class="uma-hero-btn uma-hero-btn-secondary">+ New Item</a>' +
          '<a href="/app/financial-reports" class="uma-hero-btn uma-hero-btn-secondary">Reports</a>' +
        '</div>' +
      '</div>';

    var cardsHTML = '<div class="uma-bento-grid">';
    for (var i = 0; i < MODULE_CONFIG.length; i++) {
      var m = MODULE_CONFIG[i];
      var statsHTML = '';
      for (var j = 0; j < m.stats.length; j++) {
        statsHTML +=
          '<div class="uma-card-stat">' +
            '<span class="uma-card-stat-value" data-doctype="' + m.stats[j].doctype + '">--</span>' +
            '<span class="uma-card-stat-label">' + m.stats[j].label + '</span>' +
          '</div>';
      }

      var linksHTML = '';
      for (var k = 0; k < m.links.length; k++) {
        linksHTML +=
          '<a href="' + m.links[k].route + '" class="uma-card-link">' +
            '<span class="uma-card-link-arrow">\u2192</span> ' + m.links[k].label +
          '</a>';
      }

      cardsHTML +=
        '<div class="uma-bento-card" data-module="' + m.id + '">' +
          '<a href="' + m.route + '" class="uma-card-header">' +
            '<span class="uma-card-icon" style="background:' + m.color + '">' + m.icon + '</span>' +
            '<div>' +
              '<div class="uma-card-title">' + m.title + '</div>' +
              '<div class="uma-card-desc">' + m.desc + '</div>' +
            '</div>' +
          '</a>' +
          (statsHTML ? '<div class="uma-card-stats">' + statsHTML + '</div>' : '') +
          '<div class="uma-card-links">' + linksHTML + '</div>' +
        '</div>';
    }
    cardsHTML += '</div>';

    return heroHTML + cardsHTML;
  }

  function fetchLiveStats() {
    var statEls = document.querySelectorAll('.uma-card-stat-value[data-doctype]');
    statEls.forEach(function (el) {
      var doctype = el.getAttribute('data-doctype');
      frappe.xcall('frappe.client.get_count', { doctype: doctype })
        .then(function (count) {
          el.textContent = count.toLocaleString('en-IN');
          el.classList.add('uma-stat-loaded');
        })
        .catch(function () {
          el.textContent = '-';
        });
    });
  }

  function injectBentoHome() {
    var route = frappe.get_route();
    if (!route || route[0] !== 'Workspaces') return;
    if (route[1] && route[1] !== 'Home' && route[1] !== 'home') {
      // Not home — remove bento if exists, show original
      var existing = document.querySelector('.uma-bento-home');
      if (existing) existing.remove();
      var orig = document.querySelector('.editor-js-container');
      if (orig) orig.style.display = '';
      return;
    }

    // Already injected
    if (document.querySelector('.uma-bento-home')) {
      fetchLiveStats();
      return;
    }

    // Hide original workspace content
    var editor = document.querySelector('.editor-js-container');
    if (editor) editor.style.display = 'none';

    // Inject bento grid
    var body = document.querySelector('.layout-main-section');
    if (!body) return;

    var container = document.createElement('div');
    container.className = 'uma-bento-home';
    container.innerHTML = buildBentoHTML();
    body.prepend(container);

    // Fetch live data
    fetchLiveStats();
  }

  // ══════════════════════════════════════════════════════════════════════
  // PAGE TITLE
  // ══════════════════════════════════════════════════════════════════════

  function updatePageTitle() {
    var el = document.querySelector('title');
    if (el && el.textContent.indexOf('Uma Furnitures') === -1) {
      el.textContent = el.textContent.replace(' | ERPNext', '').replace(' | Frappe', '') + ' | Uma Furnitures';
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ══════════════════════════════════════════════════════════════════════

  function onRouteChange() {
    setTimeout(function () {
      brandSidebarHeader();
      injectBentoHome();
      updatePageTitle();
    }, 200);
  }

  $(document).on('page-change', onRouteChange);
  $(document).on('form-refresh', function () { setTimeout(brandSidebarHeader, 100); });
  $(document).on('sidebar_setup', function () { setTimeout(brandSidebarHeader, 100); });

  document.addEventListener('DOMContentLoaded', function () {
    onRouteChange();
    startSidebarObserver();
  });

  setTimeout(function () { brandSidebarHeader(); startSidebarObserver(); }, 500);
  setTimeout(function () { brandSidebarHeader(); onRouteChange(); }, 1500);
  setTimeout(brandSidebarHeader, 3000);

  console.log(
    '%c\u2726 Uma Furnitures ERP %c think less do more ',
    'background: #4f46e5; color: white; padding: 6px 12px; border-radius: 6px 0 0 6px; font-weight: bold;',
    'background: #111827; color: #9ca3af; padding: 6px 12px; border-radius: 0 6px 6px 0;'
  );
})();
