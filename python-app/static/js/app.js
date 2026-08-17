/* =====================================================================
   Maritime Security Data Entry App — Single-file SPA (plain JS, no React)
   Targets Python 3.8 + Flask backend
   ===================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1.  GLOBAL STATE
     ------------------------------------------------------------------ */
  var APP = {
    schema: null,        // full schema from /api/schema   {sections:[...], groups:[...]}
    groups: null,        // section groups array
    data: {},            // current data  Record<sectionKey, rows[]>
    initialData: {},     // snapshot after load (for dirty detection)
    activeSection: 'sti',
    isLoading: true,
    isSaving: false,
    author: { name: '', role: '' },
    versions: [],
    versionsOpen: false,
    importDialogOpen: false,
    saveDialogOpen: false,
    confirmDialogOpen: false,
    dirty: false,
    /* DB Autocomplete state */
    dbConfigured: false,
    dbSource: null,
    dbName: '',
    dbGraphName: '',
    dbConfigDialogOpen: false,
    dbTestResult: null,
    dbTestLoading: false,
    dbSaveLoading: false,
    autocompleteResults: [],
    autocompleteLoading: false,
    autocompleteSectionKey: null,
    autocompleteFieldKey: null,
    autocompleteRowIndex: null,
    dbSourcedFields: {},   /* {sectionKey: {"row:field": true}} */
  };

  /* ------------------------------------------------------------------
     1b. DB AUTOCOMPLETE FIELD PATTERNS
     ------------------------------------------------------------------ */

  var AUTOCOMPLETE_PATTERNS = [
    /inn$/, /ogrn$/, /full_name$/, /short_name$/, /reg_num$/, /_name$/, /_fio$/, /imo$/
  ];

  function isAutocompleteField(fieldDef) {
    if (fieldDef.readOnly === true || fieldDef.virtual === true || fieldDef.type !== 'text') return false;
    var key = fieldDef.key || '';
    for (var i = 0; i < AUTOCOMPLETE_PATTERNS.length; i++) {
      if (AUTOCOMPLETE_PATTERNS[i].test(key)) return true;
    }
    return false;
  }

  function isDBSourced(sectionKey, rowIndex, fieldKey) {
    var secMap = APP.dbSourcedFields[sectionKey];
    if (!secMap) return false;
    var k = rowIndex + ':' + fieldKey;
    return !!secMap[k];
  }

  function markDBSourced(sectionKey, rowIndex, fieldKey) {
    if (!APP.dbSourcedFields[sectionKey]) APP.dbSourcedFields[sectionKey] = {};
    APP.dbSourcedFields[sectionKey][rowIndex + ':' + fieldKey] = true;
  }

  function clearDBSourced() {
    APP.dbSourcedFields = {};
  }

  /* ------------------------------------------------------------------
     2.  FORMAT VALIDATION RULES  (20 rules)
     ------------------------------------------------------------------ */
  var VALIDATION_RULES = [
    { keyPattern: /(?:^|_)ip_ogrn$/,        test: /^\d{15}$/,                hint: '15 цифр (ОГРНИП)' },
    { keyPattern: /ogrn$/,                   test: /^\d{13}$/,                hint: '13 цифр (ОГРН)' },
    { keyPattern: /(?:^|_)ip_inn$/,          test: /^\d{12}$/,                hint: '12 цифр (ИНН ИП/физлица)' },
    { keyPattern: /person_inn$/,              test: /^\d{12}$/,                hint: '12 цифр (ИНН физлица)' },
    { keyPattern: /inn$/,                     test: /^\d{10}(\d{2})?$/,       hint: '10 или 12 цифр (ИНН юрлица/физлица)' },
    { keyPattern: /kpp$/,                     test: /^\d{9}$/,                 hint: '9 цифр (КПП)' },
    { keyPattern: /okpo$/,                    test: /^\d{8,10}$/,              hint: '8 или 10 цифр (ОКПО)' },
    { keyPattern: /snils/,                    test: /^\d{11}$/,                hint: '11 цифр (СНИЛС)' },
    { keyPattern: /(?:bik|bic)$/i,           test: /^\d{9}$/,                 hint: '9 цифр (БИК)' },
    { keyPattern: /(?:^|_)rs$/,              test: /^\d{20}$/,                hint: '20 цифр (расчётный счёт)' },
    { keyPattern: /(?:^|_)ks$/,              test: /^\d{20}$/,                hint: '20 цифр (корр. счёт)' },
    { keyPattern: /email$/,                   test: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, hint: 'example@domain.com' },
    { keyPattern: /fax$/,                     test: /^[\d\s\-\+\(\)]{7,25}$/,    hint: '+7 (XXX) XXX-XX-XX' },
    { keyPattern: /phone$/,                   test: /^[\d\s\-\+\(\)]{7,25}$/,    hint: '+7 (XXX) XXX-XX-XX' },
    { keyPattern: /(?:^|_)imo$/,             test: /^\d{7}$/,                 hint: '7 цифр (IMO номер судна)' },
    { keyPattern: /mmsi$/,                    test: /^\d{9}$/,                 hint: '9 цифр (MMSI)' },
    { keyPattern: /call_sign$/,               test: /^[A-Za-z0-9\-]{3,10}$/,  hint: 'Буквенно-цифровой позывной (3–10 символов)' },
    { keyPattern: /(?:_lat|latitude)$/,       test: null,                       hint: '-90.000000 … +90.000000 (широта)', isLat: true },
    { keyPattern: /(?:_lon|longitude)$/,      test: null,                       hint: '-180.000000 … +180.000000 (долгота)', isLon: true },
    { keyPattern: /reg_num$/,                 test: null,                       hint: 'Не менее 3 символов', minLen: 3 },
  ];

  function validateField(key, value, type) {
    if (value === null || value === undefined || String(value).trim() === '') {
      return 'empty';
    }

    /* Additional type-based validation */
    if (type === 'number') {
      var numCheck = Number(value);
      if (!isFinite(numCheck)) return 'invalid';
    }
    if (type === 'date') {
      var dateStr = String(value).trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return 'invalid';
      var dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) return 'invalid';
    }

    for (var i = 0; i < VALIDATION_RULES.length; i++) {
      var rule = VALIDATION_RULES[i];
      if (!rule.keyPattern.test(key)) continue;
      var str = String(value).trim();
      if (rule.isLat) {
        var n = parseFloat(str);
        if (isNaN(n) || n < -90 || n > 90) return 'invalid';
        continue;
      }
      if (rule.isLon) {
        var n2 = parseFloat(str);
        if (isNaN(n2) || n2 < -180 || n2 > 180) return 'invalid';
        continue;
      }
      if (rule.minLen !== undefined) {
        if (str.length < rule.minLen) return 'invalid';
        continue;
      }
      if (rule.test && !rule.test.test(str)) return 'invalid';
    }
    return 'ok';
  }

  function getFieldHint(key) {
    for (var i = 0; i < VALIDATION_RULES.length; i++) {
      if (VALIDATION_RULES[i].keyPattern.test(key)) return VALIDATION_RULES[i].hint;
    }
    return '';
  }

  /* ------------------------------------------------------------------
     3.  INFRA REF AUTO-FILL MAP
     ------------------------------------------------------------------ */
  var INFRA_REF_MAP = {
    located_on_infra_ref: 'located_on_name',
    connected_to_infra_ref: 'connected_to_name',
    berth_infra_ref: 'berth_name',
    tsotb_location_infra_ref: 'tsotb_location_name',
    tsotb_monitors_infra_ref: 'tsotb_monitors_object_name',
    tsotb_powered_from_infra_ref: 'tsotb_powered_from_name',
    eng_instance_location_infra_ref: 'eng_instance_location_name',
  };

  /* ------------------------------------------------------------------
     4.  SVG ICONS (simple inline SVGs)
     ------------------------------------------------------------------ */
  var ICONS = {
    shield: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    ship: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 1v4"/></svg>',
    users: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    clipboard: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>',
    file: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    map: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
    waves: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>',
    package: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    wrench: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    lock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    database: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
    camera: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
    radio: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/></svg>',
    zap: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    eye: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    alertTriangle: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    trash: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
    plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    minus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    upload: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
    download: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    save: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
    history: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    refreshCw: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
    settings: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
    database: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
    x: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    chevronDown: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    chevronRight: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  };

  /* Section key → icon name mapping */
  var SECTION_ICON_MAP = {
    sti: 'shield',
    sti_licenses: 'shield',
    sti_employees: 'users',
    oti: 'ship',
    oti_docs: 'file',
    persons: 'users',
    vessel_crew: 'users',
    security_assessments: 'clipboard',
    security_plans: 'file',
    security_equipment: 'lock',
    isps_compliance: 'clipboard',
    training_records: 'clipboard',
    incident_reports: 'alertTriangle',
    ports: 'map',
    port_facilities: 'map',
    berths: 'map',
    terminals: 'map',
    anchorage_areas: 'map',
    navigation_channels: 'map',
    aquatories: 'waves',
    cargo_types: 'package',
    dangerous_cargo: 'alertTriangle',
    cargo_operations: 'package',
    infrastructure: 'wrench',
    access_control: 'lock',
    perimeter_security: 'lock',
    cctv_systems: 'camera',
    communication_systems: 'radio',
    lighting_systems: 'zap',
    power_supply: 'zap',
    vessel_traffic: 'eye',
  };

  function getSectionIcon(sectionKey) {
    var iconKey = SECTION_ICON_MAP[sectionKey] || 'database';
    return ICONS[iconKey] || ICONS.database;
  }

  /* ------------------------------------------------------------------
     5.  UTILITY HELPERS
     ------------------------------------------------------------------ */

  function esc(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function getSectionDef(sectionKey) {
    if (!APP.schema || !APP.schema.sections) return null;
    for (var i = 0; i < APP.schema.sections.length; i++) {
      if (APP.schema.sections[i].key === sectionKey) return APP.schema.sections[i];
    }
    return null;
  }

  function getFieldDef(sectionKey, fieldKey) {
    var sec = getSectionDef(sectionKey);
    if (!sec || !sec.fields) return null;
    for (var i = 0; i < sec.fields.length; i++) {
      if (sec.fields[i].key === fieldKey) return sec.fields[i];
    }
    return null;
  }

  function isVirtualField(sectionKey, fieldKey) {
    var fd = getFieldDef(sectionKey, fieldKey);
    return fd && fd.virtual === true;
  }

  function stripVirtuals(data) {
    var cleaned = deepClone(data);
    if (!APP.schema || !APP.schema.sections) return cleaned;
    for (var s = 0; s < APP.schema.sections.length; s++) {
      var secKey = APP.schema.sections[s].key;
      if (!cleaned[secKey]) continue;
      var virtualKeys = [];
      for (var f = 0; f < APP.schema.sections[s].fields.length; f++) {
        if (APP.schema.sections[s].fields[f].virtual) {
          virtualKeys.push(APP.schema.sections[s].fields[f].key);
        }
      }
      for (var r = 0; r < cleaned[secKey].length; r++) {
        for (var vk = 0; vk < virtualKeys.length; vk++) {
          delete cleaned[secKey][r][virtualKeys[vk]];
        }
      }
    }
    return cleaned;
  }

  function checkDirty() {
    var current = JSON.stringify(stripVirtuals(APP.data));
    var initial = JSON.stringify(APP.initialData);
    APP.dirty = (current !== initial);
    updateDirtyBadge();
  }

  function updateDirtyBadge() {
    var badge = document.getElementById('dirty-badge');
    if (!badge) return;
    if (APP.dirty) {
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }
  }

  /* ------------------------------------------------------------------
     6.  API FUNCTIONS
     ------------------------------------------------------------------ */

  function apiGet(url) {
    return fetch(url).then(function (resp) {
      if (!resp.ok) throw new Error('API error ' + resp.status);
      return resp.json();
    });
  }

  function apiPost(url, body) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(function (resp) {
      if (!resp.ok) throw new Error('API error ' + resp.status);
      return resp.json();
    });
  }

  function apiPostForm(url, formData) {
    return fetch(url, {
      method: 'POST',
      body: formData,
    }).then(function (resp) {
      if (!resp.ok) throw new Error('API error ' + resp.status);
      return resp.json();
    });
  }

  function loadSchema() {
    return apiGet('/api/schema').then(function (json) {
      APP.schema = json;
      APP.groups = json.groups || [];
    });
  }

  function loadData() {
    return apiGet('/api/data').then(function (json) {
      APP.data = json;
      APP.initialData = deepClone(json);
    });
  }

  function loadVersions() {
    return apiGet('/api/versions').then(function (json) {
      APP.versions = json || [];
    });
  }

  function saveData(author) {
    APP.isSaving = true;
    renderApp();
    var payload = {
      data: stripVirtuals(APP.data),
      author: author,
    };
    return apiPost('/api/data', payload)
      .then(function () {
        return loadData().then(function () {
          return loadVersions();
        });
      })
      .catch(function (err) {
        alert('Ошибка сохранения: ' + err.message);
      })
      .finally(function () {
        APP.isSaving = false;
        APP.dirty = false;
        APP.saveDialogOpen = false;
        renderApp();
      });
  }

  function importData(file) {
    var fd = new FormData();
    fd.append('file', file);
    return apiPostForm('/api/import', fd)
      .then(function () {
        return loadData().then(function () {
          return loadVersions();
        });
      })
      .catch(function (err) {
        alert('Ошибка импорта: ' + err.message);
      })
      .finally(function () {
        APP.importDialogOpen = false;
        renderApp();
      });
  }

  function exportData() {
    fetch('/api/export')
      .then(function (resp) {
        if (!resp.ok) throw new Error('Export failed');
        var disposition = resp.headers.get('Content-Disposition') || '';
        var match = disposition.match(/filename=("?)([^"]+)\1/);
        var filename = match ? match[2] : 'export.json';
        return resp.blob().then(function (blob) {
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(function () {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 100);
        });
      })
      .catch(function (err) {
        alert('Ошибка экспорта: ' + err.message);
      });
  }

  function loadVersion(versionId) {
    return apiGet('/api/versions/' + versionId)
      .then(function (json) {
        APP.data = json;
        APP.initialData = deepClone(json);
        APP.dirty = false;
        APP.versionsOpen = false;
        renderApp();
      })
      .catch(function (err) {
        alert('Ошибка загрузки версии: ' + err.message);
      });
  }

  /* ------------------------------------------------------------------
     7.  AUTO-FILL LOGIC
     ------------------------------------------------------------------ */

  function handleInfraRefChange(sectionKey, rowIndex, fieldKey, selectedIdx) {
    var companionKey = INFRA_REF_MAP[fieldKey];
    if (!companionKey) return;
    var infraData = APP.data['infrastructure'] || [];
    var idx = parseInt(selectedIdx, 10);
    var row = (APP.data[sectionKey] || [])[rowIndex];
    if (!row) return;
    if (isNaN(idx) || idx < 0 || idx >= infraData.length) {
      row[companionKey] = '';
    } else {
      var infraRow = infraData[idx];
      row[companionKey] = infraRow.infrastructure_name || infraRow.name || ('Объект #' + (idx + 1));
    }
  }

  function handleVirtualRefChange(sectionKey, rowIndex, fieldKey, selectedIdx) {
    var fd = getFieldDef(sectionKey, fieldKey);
    if (!fd || !fd.refAutoFill) return;
    var refSection = fd.refSection || 'infrastructure';
    var refData = APP.data[refSection] || [];
    var idx = parseInt(selectedIdx, 10);
    var row = (APP.data[sectionKey] || [])[rowIndex];
    if (!row) return;
    var mapping = fd.refAutoFill;
    var keys = Object.keys(mapping);
    if (isNaN(idx) || idx < 0 || idx >= refData.length) {
      for (var k = 0; k < keys.length; k++) {
        row[keys[k]] = '';
      }
      return;
    }
    var srcRow = refData[idx];
    for (var k2 = 0; k2 < keys.length; k2++) {
      var targetKey = keys[k2];
      var srcKey = mapping[targetKey];
      row[targetKey] = srcRow[srcKey] !== undefined ? srcRow[srcKey] : '';
    }
  }

  /* ------------------------------------------------------------------
     8.  RENDER: HEADER
     ------------------------------------------------------------------ */

  function renderHeader() {
    var dirtyBadge = '';
    if (APP.dirty) {
      dirtyBadge = '<span id="dirty-badge" class="badge-ready" style="display:inline-flex;align-items:center;gap:4px;margin-left:8px;font-size:12px;padding:2px 8px;border-radius:9999px;background:var(--accent);color:var(--accent-foreground);">● Готово к сохранению</span>';
    } else {
      dirtyBadge = '<span id="dirty-badge" class="badge-ready" style="display:none;align-items:center;gap:4px;margin-left:8px;font-size:12px;padding:2px 8px;border-radius:9999px;background:var(--accent);color:var(--accent-foreground);">● Готово к сохранению</span>';
    }
    var savingDisabled = APP.isSaving ? ' disabled' : '';
    var savingText = APP.isSaving ? 'Сохранение…' : 'Сохранить';

    return '<header class="header">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;width:100%;padding:0 24px;height:100%;">' +
        '<div style="display:flex;align-items:center;gap:12px;">' +
          '<span style="font-size:18px;font-weight:600;color:var(--foreground);">Ввод параметров морской безопасности</span>' +
        '</div>' +
        '<div class="header-actions" style="display:flex;align-items:center;gap:8px;">' +
          '<button class="btn-secondary" data-action="import">' + ICONS.upload + ' Импорт</button>' +
          '<button class="btn-secondary" data-action="export">' + ICONS.download + ' Экспорт</button>' +
          '<button class="btn-primary" data-action="save" style="position:relative;"' + savingDisabled + '>' + ICONS.save + ' ' + savingText + dirtyBadge + '</button>' +
          '<button class="btn-secondary" data-action="versions">' + ICONS.history + ' Версии</button>' +
          '<button class="btn-destructive" data-action="reset">' + ICONS.refreshCw + ' Сброс</button>' +
          '<div style="width:1px;height:24px;background:var(--border);margin:0 4px;"></div>' +
          '<button class="btn-secondary" data-action="db-settings" title="Настройки подключения к БД">' +
            (APP.dbConfigured
              ? '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:oklch(0.65 0.18 145);margin-right:4px;"></span>'
              : '') +
            ICONS.settings +
            (APP.dbConfigured ? ' БД' : ' БД') +
          '</button>' +
        '</div>' +
      '</div>' +
    '</header>';
  }

  /* ------------------------------------------------------------------
     9.  RENDER: SIDEBAR
     ------------------------------------------------------------------ */

  function renderSidebar() {
    if (!APP.schema || !APP.schema.sections || !APP.groups) return '';
    var html = '<nav class="sidebar">';

    for (var g = 0; g < APP.groups.length; g++) {
      var group = APP.groups[g];
      var groupSections = group.sections || [];
      if (groupSections.length === 0) continue;

      html += '<div class="sidebar-group-label">' + esc(group.label) + '</div>';

      for (var s = 0; s < groupSections.length; s++) {
        var secKey = groupSections[s];
        var secDef = getSectionDef(secKey);
        if (!secDef) continue;
        var isActive = (APP.activeSection === secKey);
        var activeClass = isActive ? ' active' : ''
          var icon = getSectionIcon(secKey);
        var statsText = getSectionStats(secKey);
        html += '<button class="sidebar-item' + activeClass + '" data-action="select-section" data-section="' + esc(secKey) + '">' +
          '<span style="display:flex;align-items:center;gap:8px;width:100%;">' +
            '<span style="flex-shrink:0;display:flex;align-items:center;">' + icon + '</span>' +
            '<span style="flex:1;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + esc(secDef.label) + '</span>' +
            (statsText ? '<span style="font-size:11px;color:var(--muted-foreground);flex-shrink:0;">' + esc(statsText) + '</span>' : '') +
          '</span>' +
        '</button>';
      }
    }

    html += '</nav>';
    return html;
  }

  /* ------------------------------------------------------------------
     10. RENDER: FIELD (single field within a card)
     ------------------------------------------------------------------ */

  function renderField(sectionKey, rowIndex, fieldDef, value) {
    var key = fieldDef.key;
    var label = fieldDef.label || key;
    var type = fieldDef.type || 'text';
    var readOnly = fieldDef.readOnly === true;
    var autoFilled = fieldDef.autoFilled === true;
    var isVirtual = fieldDef.virtual === true;
    var options = fieldDef.options || [];
    var nestedFields = fieldDef.nestedFields || [];
    var refSection = fieldDef.refSection;
    var refLabelField = fieldDef.refLabelField;

    var status = validateField(key, value, type);
    var statusClass = '';
    var tooltipHtml = '';

    if (status === 'empty') {
      statusClass = ' field-status-empty';
    } else if (status === 'invalid') {
      statusClass = ' invalid-field';
      var hint = getFieldHint(key);
      tooltipHtml = '<span class="invalid-tooltip">Поле ' + esc(label) + ' — некорректный формат ввода. Корректный формат: ' + esc(hint) + '</span>';
    }

    var dbSourced = isDBSourced(sectionKey, rowIndex, key);
    var autoBadge = '';
    if (autoFilled || isVirtual) {
      autoBadge = ' <span class="badge-auto">авто</span>';
    }
    if (dbSourced) {
      autoBadge += ' <span class="badge-db">из БД</span>';
    }

    var dataAttrs = ' data-section="' + esc(sectionKey) + '" data-row="' + rowIndex + '" data-field="' + esc(key) + '"';

    var labelHtml = '<label class="field-label" style="display:flex;align-items:center;gap:6px;">' +
      (status === 'empty' && !readOnly ? '<span style="width:6px;height:6px;border-radius:50%;background:var(--destructive);flex-shrink:0;"></span>' : '') +
      esc(label) +
      autoBadge +
      tooltipHtml +
    '</label>';

    var inputHtml = '';

    if (type === 'object') {
      var nestedData = Array.isArray(value) ? value : [];
      inputHtml = renderNestedTable(sectionKey, rowIndex, key, label, nestedFields, nestedData, readOnly);
      return '<div class="field-wrapper" style="margin-bottom:16px;">' + inputHtml + '</div>';
    }

    var disabledAttr = readOnly ? ' disabled' : '';
    var roClass = readOnly ? ' style="opacity:0.6;background:var(--muted);"' : '';

    if (type === 'boolean') {
      var checked = value === true || value === 'true' || value === 1 ? ' checked' : '';
      inputHtml = '<div class="field-checkbox-wrapper">' +
        '<input type="checkbox" class="field-input"' + dataAttrs + checked + disabledAttr + ' />' +
      '</div>';
    } else if (type === 'select' && options.length > 0) {
      inputHtml = '<select class="field-select' + statusClass + '"' + dataAttrs + disabledAttr + roClass + '>';
      inputHtml += '<option value=""></option>';
      for (var o = 0; o < options.length; o++) {
        var opt = options[o];
        var optVal = typeof opt === 'object' ? opt.value : opt;
        var optLabel = typeof opt === 'object' ? opt.label : opt;
        var sel = (String(value) === String(optVal)) ? ' selected' : '';
        inputHtml += '<option value="' + esc(optVal) + '"' + sel + '>' + esc(optLabel) + '</option>';
      }
      inputHtml += '</select>';
    } else if (type === 'ref' || type === 'virtual') {
      inputHtml = renderRefSelect(sectionKey, rowIndex, key, fieldDef, value, statusClass, disabledAttr, roClass, isVirtual);
    } else if (type === 'textarea') {
      inputHtml = '<textarea class="field-textarea' + statusClass + '"' + dataAttrs + disabledAttr + roClass + ' rows="3">' + esc(value) + '</textarea>';
    } else if (type === 'number') {
      inputHtml = '<input type="number" class="field-number' + statusClass + '"' + dataAttrs + ' value="' + esc(value) + '"' + disabledAttr + roClass + ' />';
    } else if (type === 'date') {
      var dateVal = value ? String(value).substring(0, 10) : '';
      inputHtml = '<input type="date" class="field-date' + statusClass + '"' + dataAttrs + ' value="' + esc(dateVal) + '"' + disabledAttr + roClass + ' />';
    } else if (type === 'array') {
      var arrStr = Array.isArray(value) ? value.join(', ') : (value || '');
      inputHtml = '<input type="text" class="field-input' + statusClass + '"' + dataAttrs + ' value="' + esc(arrStr) + '"' + disabledAttr + roClass + ' placeholder="Значения через запятую" />';
    } else {
      var canAC = isAutocompleteField(fieldDef);
      var acAttrs = canAC ? ' data-ac="true"' : '';
      var dbSrcClass = dbSourced ? ' db-sourced' : '';
      inputHtml = '<div class="autocomplete-wrapper' + (canAC ? '' : '') + '">' +
        '<input type="text" class="field-input' + statusClass + dbSrcClass + '"' + dataAttrs + acAttrs + ' value="' + esc(value) + '"' + disabledAttr + roClass + ' autocomplete="off" />' +
        (canAC ? renderAutocompleteDropdown(sectionKey, rowIndex, key) : '') +
      '</div>';
    }

    return '<div class="field-wrapper" style="margin-bottom:16px;">' + labelHtml + inputHtml + '</div>';
  }

  /* ------------------------------------------------------------------
     11. RENDER: REF SELECT (for ref and virtual types)
     ------------------------------------------------------------------ */

  function renderRefSelect(sectionKey, rowIndex, fieldKey, fieldDef, value, statusClass, disabledAttr, roClass, isVirtual) {
    var refSec = fieldDef.refSection || 'infrastructure';
    var labelField = fieldDef.refLabelField || 'name';
    var refData = APP.data[refSec] || [];

    var dataAttrs = ' data-section="' + esc(sectionKey) + '" data-row="' + rowIndex + '" data-field="' + esc(fieldKey) + '"';
    var html = '<select class="field-select' + statusClass + '"' + dataAttrs + disabledAttr + roClass + (isVirtual ? ' data-virtual-ref="true"' : '') + '>';
    html += '<option value=""></option>';
    for (var r = 0; r < refData.length; r++) {
      var refRow = refData[r];
      var displayVal = refRow[labelField] || ('Запись #' + (r + 1));
      var sel = (String(value) === String(r)) ? ' selected' : '';
      html += '<option value="' + r + '"' + sel + '>' + esc(displayVal) + '</option>';
    }
    html += '</select>';
    return html;
  }

  /* ------------------------------------------------------------------
     12. RENDER: NESTED TABLE (object type fields)
     ------------------------------------------------------------------ */

  function renderNestedTable(sectionKey, rowIndex, fieldKey, fieldLabel, nestedFields, nestedData, readOnly) {
    var count = nestedData.length;
    var html = '<div class="nested-section" data-nested-section="' + esc(fieldKey) + '" style="border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:16px;">';

    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--muted);cursor:pointer;" data-action="toggle-nested" data-section="' + esc(sectionKey) + '" data-row="' + rowIndex + '" data-field="' + esc(fieldKey) + '">' +
      '<span style="font-weight:500;font-size:14px;color:var(--foreground);">' + esc(fieldLabel) + ' (' + count + ' запис' + pluralRu(count, 'ь', 'и', 'ей') + ')</span>' +
      '<span style="display:flex;align-items:center;gap:8px;">' +
        (!readOnly ? '<button class="btn-icon" data-action="add-nested" data-section="' + esc(sectionKey) + '" data-row="' + rowIndex + '" data-field="' + esc(fieldKey) + '" title="Добавить">' + ICONS.plus + '</button>' : '') +
        '<span class="chevron-icon">' + ICONS.chevronDown + '</span>' +
      '</span>' +
    '</div>';

    html += '<div class="nested-body" style="max-height:500px;overflow-y:auto;">';

    if (count === 0) {
      html += '<div style="padding:16px;text-align:center;color:var(--muted-foreground);font-size:13px;">Нет записей</div>';
    } else {
      html += '<table class="nested-table" style="width:100%;border-collapse:collapse;font-size:13px;">';
      html += '<thead><tr>';
      for (var f = 0; f < nestedFields.length; f++) {
        html += '<th style="padding:8px 10px;text-align:left;font-weight:500;color:var(--muted-foreground);border-bottom:1px solid var(--border);white-space:nowrap;">' + esc(nestedFields[f].label || nestedFields[f].key) + '</th>';
      }
      if (!readOnly) {
        html += '<th style="width:40px;border-bottom:1px solid var(--border);"></th>';
      }
      html += '</tr></thead><tbody>';

      for (var nr = 0; nr < nestedData.length; nr++) {
        html += '<tr>';
        for (var nf = 0; nf < nestedFields.length; nf++) {
          var nfDef = nestedFields[nf];
          var nVal = nestedData[nr][nfDef.key] !== undefined ? nestedData[nr][nfDef.key] : '';
          var nDataAttrs = ' data-section="' + esc(sectionKey) + '" data-row="' + rowIndex + '" data-field="' + esc(fieldKey) + '" data-nested-row="' + nr + '" data-nested-field="' + esc(nfDef.key) + '"';
          html += '<td style="padding:4px 6px;border-bottom:1px solid var(--border);">';

          if (nfDef.type === 'boolean') {
            var nChecked = nVal === true || nVal === 'true' || nVal === 1 ? ' checked' : '';
            html += '<input type="checkbox"' + nDataAttrs + nChecked + (readOnly ? ' disabled' : '') + ' />';
          } else if (nfDef.type === 'number') {
            html += '<input type="number" class="field-number" style="width:100%;min-width:80px;"' + nDataAttrs + ' value="' + esc(nVal) + '"' + (readOnly ? ' disabled' : '') + ' />';
          } else if (nfDef.type === 'date') {
            html += '<input type="date" class="field-date" style="width:100%;min-width:120px;"' + nDataAttrs + ' value="' + esc(nVal) + '"' + (readOnly ? ' disabled' : '') + ' />';
          } else if (nfDef.type === 'select' && nfDef.options && nfDef.options.length > 0) {
            html += '<select class="field-select" style="width:100%;min-width:100px;"' + nDataAttrs + (readOnly ? ' disabled' : '') + '>';
            html += '<option value=""></option>';
            for (var no = 0; no < nfDef.options.length; no++) {
              var nOpt = nfDef.options[no];
              var nOptVal = typeof nOpt === 'object' ? nOpt.value : nOpt;
              var nOptLabel = typeof nOpt === 'object' ? nOpt.label : nOpt;
              var nSel = (String(nVal) === String(nOptVal)) ? ' selected' : '';
              html += '<option value="' + esc(nOptVal) + '"' + nSel + '>' + esc(nOptLabel) + '</option>';
            }
            html += '</select>';
          } else {
            html += '<input type="text" class="field-input" style="width:100%;min-width:100px;"' + nDataAttrs + ' value="' + esc(nVal) + '"' + (readOnly ? ' disabled' : '') + ' />';
          }
          html += '</td>';
        }
        if (!readOnly) {
          html += '<td style="padding:4px 6px;border-bottom:1px solid var(--border);text-align:center;">' +
            '<button class="btn-icon" data-action="remove-nested" data-section="' + esc(sectionKey) + '" data-row="' + rowIndex + '" data-field="' + esc(fieldKey) + '" data-nested-row="' + nr + '" title="Удалить" style="color:var(--destructive);">' + ICONS.trash + '</button>' +
          '</td>';
        }
        html += '</tr>';
      }

      html += '</tbody></table>';
    }

    html += '</div></div>';
    return html;
  }

  function pluralRu(n, one, few, many) {
    var abs = Math.abs(n) % 100;
    var lastDigit = abs % 10;
    if (abs > 10 && abs < 20) return many;
    if (lastDigit > 1 && lastDigit < 5) return few;
    if (lastDigit === 1) return one;
    return many;
  }

  /* ------------------------------------------------------------------
     13. RENDER: MAIN CONTENT (section cards)
     ------------------------------------------------------------------ */

  function renderMainContent() {
    var secKey = APP.activeSection;
    var secDef = getSectionDef(secKey);
    if (!secDef) {
      return '<main class="main-content"><div class="empty-state"><p>Раздел не найден</p></div></main>';
    }

    var rows = APP.data[secKey] || [];
    var fields = secDef.fields || [];

    var html = '<main class="main-content">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">';
    html += '<h2 style="font-size:20px;font-weight:600;color:var(--foreground);margin:0;">' + esc(secDef.label) + '</h2>';
    html += '<button class="btn-primary" data-action="add-row" data-section="' + esc(secKey) + '">' + ICONS.plus + ' Добавить запись</button>';
    html += '</div>';

    if (rows.length === 0) {
      html += '<div class="empty-state" style="padding:48px 24px;text-align:center;">' +
        '<p style="color:var(--muted-foreground);font-size:15px;">Нет записей в этом разделе</p>' +
        '<p style="color:var(--muted-foreground);font-size:13px;margin-top:4px;">Нажмите «Добавить запись» для создания</p>' +
      '</div>';
    } else {
      for (var r = 0; r < rows.length; r++) {
        var row = rows[r];
        html += '<div class="section-card" style="margin-bottom:20px;">';
        html += '<div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:12px;border-bottom:1px solid var(--border);margin-bottom:16px;">';
        html += '<span style="font-weight:600;font-size:15px;color:var(--foreground);">Запись #' + (r + 1) + '</span>';
        html += '<button class="btn-icon" data-action="delete-row" data-section="' + esc(secKey) + '" data-row="' + r + '" title="Удалить запись" style="color:var(--destructive);">' + ICONS.trash + '</button>';
        html += '</div>';

        for (var f = 0; f < fields.length; f++) {
          var fDef = fields[f];
          var fVal = row[fDef.key] !== undefined ? row[fDef.key] : '';
          html += renderField(secKey, r, fDef, fVal);
        }

        html += '</div>';
      }
    }

    html += '</main>';
    return html;
  }

  /* ------------------------------------------------------------------
     14. RENDER: FOOTER
     ------------------------------------------------------------------ */

  function renderFooter() {
    return '<footer class="footer">© 2025 Морская безопасность</footer>';
  }

  /* ------------------------------------------------------------------
     15. RENDER: MODALS / DIALOGS
     ------------------------------------------------------------------ */

  function renderModals() {
    var html = '';

    /* Save dialog */
    if (APP.saveDialogOpen) {
      html += '<div class="modal-overlay" data-action="close-save-dialog" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;">' +
        '<div class="modal-content" style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:24px;width:400px;max-width:90vw;box-shadow:0 20px 60px rgba(0,0,0,0.3);" onclick="event.stopPropagation()">' +
          '<h3 style="font-size:16px;font-weight:600;margin-bottom:16px;color:var(--foreground);">Сохранить данные</h3>' +
          '<div style="margin-bottom:12px;">' +
            '<label class="field-label">Имя автора</label>' +
            '<input type="text" id="save-author-name" class="field-input" value="' + esc(APP.author.name) + '" placeholder="Введите имя" />' +
          '</div>' +
          '<div style="margin-bottom:20px;">' +
            '<label class="field-label">Роль</label>' +
            '<input type="text" id="save-author-role" class="field-input" value="' + esc(APP.author.role) + '" placeholder="Введите роль" />' +
          '</div>' +
          '<div style="display:flex;justify-content:flex-end;gap:8px;">' +
            '<button class="btn-secondary" data-action="close-save-dialog">Отмена</button>' +
            '<button class="btn-primary" data-action="confirm-save">Сохранить</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

    /* Import dialog */
    if (APP.importDialogOpen) {
      html += '<div class="modal-overlay" data-action="close-import-dialog" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;">' +
        '<div class="modal-content" style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:24px;width:400px;max-width:90vw;box-shadow:0 20px 60px rgba(0,0,0,0.3);" onclick="event.stopPropagation()">' +
          '<h3 style="font-size:16px;font-weight:600;margin-bottom:16px;color:var(--foreground);">Импорт данных</h3>' +
          '<div style="margin-bottom:20px;">' +
            '<label class="field-label">Выберите файл (.json)</label>' +
            '<input type="file" id="import-file" accept=".json" class="field-input" style="padding:8px;" />' +
          '</div>' +
          '<div style="display:flex;justify-content:flex-end;gap:8px;">' +
            '<button class="btn-secondary" data-action="close-import-dialog">Отмена</button>' +
            '<button class="btn-primary" data-action="confirm-import">Импорт</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

    /* Versions dialog */
    if (APP.versionsOpen) {
      var vListHtml = '';
      if (APP.versions.length === 0) {
        vListHtml = '<div class="empty-state" style="padding:24px;text-align:center;color:var(--muted-foreground);">Нет сохранённых версий</div>';
      } else {
        for (var v = 0; v < APP.versions.length; v++) {
          var ver = APP.versions[v];
          var ts = ver.timestamp || ver.created_at || '';
          var author = ver.author || 'Неизвестный';
          var authorStr = (typeof author === 'object') ? ((author.name || '') + (author.role ? ' (' + author.role + ')' : '')) : author;
          var changedSections = ver.changed_sections || ver.sections || [];
          var sectionsStr = Array.isArray(changedSections) ? changedSections.join(', ') : String(changedSections);

          vListHtml += '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px;border-bottom:1px solid var(--border);cursor:pointer;transition:background 0.15s;" ' +
            'data-action="load-version" data-version-id="' + esc(ver.id || ver.version_id || v) + '" ' +
            'onmouseover="this.style.background=\'var(--muted)\'" onmouseout="this.style.background=\'transparent\'">' +
            '<div>' +
              '<div style="font-weight:500;font-size:14px;color:var(--foreground);">' + esc(authorStr) + '</div>' +
              '<div style="font-size:12px;color:var(--muted-foreground);margin-top:2px;">' + esc(sectionsStr) + '</div>' +
            '</div>' +
            '<div style="font-size:12px;color:var(--muted-foreground);white-space:nowrap;margin-left:12px;">' + esc(ts) + '</div>' +
          '</div>';
        }
      }

      html += '<div class="modal-overlay" data-action="close-versions-dialog" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;">' +
        '<div class="modal-content" style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:24px;width:500px;max-width:90vw;max-height:80vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.3);" onclick="event.stopPropagation()">' +
          '<h3 style="font-size:16px;font-weight:600;margin-bottom:16px;color:var(--foreground);">Версии</h3>' +
          '<div style="flex:1;overflow-y:auto;max-height:400px;">' + vListHtml + '</div>' +
          '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;">' +
            '<button class="btn-secondary" data-action="close-versions-dialog">Закрыть</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

    /* Confirm dialog (for reset) */
    if (APP.confirmDialogOpen) {
      html += '<div class="modal-overlay" data-action="close-confirm-dialog" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;">' +
        '<div class="modal-content" style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:24px;width:400px;max-width:90vw;box-shadow:0 20px 60px rgba(0,0,0,0.3);" onclick="event.stopPropagation()">' +
          '<h3 style="font-size:16px;font-weight:600;margin-bottom:8px;color:var(--foreground);">Подтверждение</h3>' +
          '<p style="color:var(--muted-foreground);font-size:14px;margin-bottom:20px;">Вы уверены, что хотите сбросить все изменения? Данные будут восстановлены до последнего сохранённого состояния.</p>' +
          '<div style="display:flex;justify-content:flex-end;gap:8px;">' +
            '<button class="btn-secondary" data-action="close-confirm-dialog">Отмена</button>' +
            '<button class="btn-destructive" data-action="confirm-reset">Сбросить</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

    /* DB Config dialog */
    html += renderDBConfigDialog();

    return html;
  }

  /* ------------------------------------------------------------------
     16. RENDER: LOADING STATE
     ------------------------------------------------------------------ */

  function renderLoading() {
    return '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:var(--background);">' +
      '<div style="text-align:center;">' +
        '<div style="width:40px;height:40px;border:3px solid var(--border);border-top-color:var(--primary);border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 16px;"></div>' +
        '<p style="color:var(--muted-foreground);font-size:14px;">Загрузка данных…</p>' +
      '</div>' +
    '</div>' +
    '<style>@keyframes spin{to{transform:rotate(360deg)}}</style>';
  }

  /* ------------------------------------------------------------------
     17. MASTER RENDER
     ------------------------------------------------------------------ */

  function renderApp() {
    var root = document.getElementById('app');
    if (!root) return;

    if (APP.isLoading) {
      root.innerHTML = renderLoading();
      return;
    }

    var html = '<div style="display:flex;flex-direction:column;min-height:100vh;background:var(--background);">';
    html += renderHeader();
    html += '<div style="display:flex;flex:1;overflow:hidden;">';
    html += renderSidebar();
    html += renderMainContent();
    html += '</div>';
    html += renderFooter();
    html += '</div>';
    html += renderModals();

    root.innerHTML = html;

    /* Restore scroll positions for main content */
 restoreScrollState();
  }

  /* ------------------------------------------------------------------
     18. SCROLL STATE PRESERVATION
     ------------------------------------------------------------------ */

  var _mainScrollTop = 0;
  var _sidebarScrollTop = 0;

  function saveScrollState() {
    var main = document.querySelector('.main-content');
    if (main) _mainScrollTop = main.scrollTop;
    var sidebar = document.querySelector('.sidebar');
    if (sidebar) _sidebarScrollTop = sidebar.scrollTop;
  }

  function restoreScrollState() {
    var main = document.querySelector('.main-content');
    if (main) main.scrollTop = _mainScrollTop;
    var sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.scrollTop = _sidebarScrollTop;
  }

  /* ------------------------------------------------------------------
     19. EVENT HANDLING (delegation)
     ------------------------------------------------------------------ */

  function setupEventDelegation() {
    var root = document.getElementById('app');

    root.addEventListener('click', function (e) {
      var target = e.target.closest('[data-action]');
      if (!target) return;
      var action = target.getAttribute('data-action');
      handleClick(action, target, e);
    });

    root.addEventListener('input', function (e) {
      var target = e.target;
      var section = target.getAttribute('data-section');
      var rowAttr = target.getAttribute('data-row');
      var field = target.getAttribute('data-field');
      var nestedRow = target.getAttribute('data-nested-row');
      var nestedField = target.getAttribute('data-nested-field');

      if (!section || rowAttr === null || !field) return;
      var rowIndex = parseInt(rowAttr, 10);

      if (nestedRow !== null && nestedField !== null) {
        handleNestedInput(section, rowIndex, field, parseInt(nestedRow, 10), nestedField, target, e);
      } else {
        handleFieldInput(section, rowIndex, field, target, e);
      }
    });

    root.addEventListener('change', function (e) {
      var target = e.target;
      var section = target.getAttribute('data-section');
      var rowAttr = target.getAttribute('data-row');
      var field = target.getAttribute('data-field');
      var nestedRow = target.getAttribute('data-nested-row');
      var nestedField = target.getAttribute('data-nested-field');

      if (!section || rowAttr === null || !field) return;
      var rowIndex = parseInt(rowAttr, 10);

      if (nestedRow !== null && nestedField !== null) {
        handleNestedChange(section, rowIndex, field, parseInt(nestedRow, 10), nestedField, target, e);
      } else {
        handleFieldChange(section, rowIndex, field, target, e);
      }
    });
  }

  function handleClick(action, target, e) {
    switch (action) {
      case 'select-section':
        saveScrollState();
        APP.activeSection = target.getAttribute('data-section');
        renderApp();
        break;

      case 'add-row':
        var addSec = target.getAttribute('data-section');
        if (!APP.data[addSec]) APP.data[addSec] = [];
        var newRow = {};
        var addSecDef = getSectionDef(addSec);
        if (addSecDef && addSecDef.fields) {
          for (var af = 0; af < addSecDef.fields.length; af++) {
            var afDef = addSecDef.fields[af];
            if (afDef.type === 'object') {
              newRow[afDef.key] = [];
            } else if (afDef.type === 'boolean') {
              newRow[afDef.key] = false;
            } else if (afDef.type === 'number') {
              newRow[afDef.key] = 0;
            } else {
              newRow[afDef.key] = '';
            }
          }
        }
        APP.data[addSec].push(newRow);
        checkDirty();
        renderApp();
        /* scroll to bottom of main content */
        setTimeout(function () {
          var mc = document.querySelector('.main-content');
          if (mc) mc.scrollTop = mc.scrollHeight;
        }, 50);
        break;

      case 'delete-row':
        var delSec = target.getAttribute('data-section');
        var delRow = parseInt(target.getAttribute('data-row'), 10);
        if (APP.data[delSec]) {
          APP.data[delSec].splice(delRow, 1);
          checkDirty();
          renderApp();
        }
        break;

      case 'save':
        APP.saveDialogOpen = true;
        renderApp();
        setTimeout(function () {
          var nameInput = document.getElementById('save-author-name');
          if (nameInput) nameInput.focus();
        }, 50);
        break;

      case 'close-save-dialog':
        APP.saveDialogOpen = false;
        renderApp();
        break;

      case 'confirm-save':
        var authorName = '';
        var authorRole = '';
        var nameEl = document.getElementById('save-author-name');
        var roleEl = document.getElementById('save-author-role');
        if (nameEl) authorName = nameEl.value;
        if (roleEl) authorRole = roleEl.value;
        APP.author.name = authorName;
        APP.author.role = authorRole;
        saveData({ name: authorName, role: authorRole });
        break;

      case 'import':
        APP.importDialogOpen = true;
        renderApp();
        break;

      case 'close-import-dialog':
        APP.importDialogOpen = false;
        renderApp();
        break;

      case 'confirm-import':
        var fileInput = document.getElementById('import-file');
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
          importData(fileInput.files[0]);
        } else {
          alert('Пожалуйста, выберите файл для импорта.');
        }
        break;

      case 'export':
        exportData();
        break;

      case 'versions':
        APP.versionsOpen = true;
        renderApp();
        break;

      case 'close-versions-dialog':
        APP.versionsOpen = false;
        renderApp();
        break;

      case 'load-version':
        var verId = target.getAttribute('data-version-id');
        if (verId) loadVersion(verId);
        break;

      case 'reset':
        APP.confirmDialogOpen = true;
        renderApp();
        break;

      case 'close-confirm-dialog':
        APP.confirmDialogOpen = false;
        renderApp();
        break;

      case 'db-settings':
        APP.dbConfigDialogOpen = true;
        APP.dbTestResult = null;
        renderApp();
        /* Load existing config into dialog fields */
        loadDBConfig().then(function (cfg) {
          if (!cfg) return;
          var h = document.getElementById('db-host');
          if (h) h.value = cfg.host || '';
          var p = document.getElementById('db-port');
          if (p) p.value = cfg.port || 5432;
          var d = document.getElementById('db-database');
          if (d) d.value = cfg.database || '';
          var u = document.getElementById('db-username');
          if (u) u.value = cfg.username || '';
          var s = document.getElementById('db-ssl');
          if (s) s.checked = !!cfg.ssl;
          var g = document.getElementById('db-graph-name');
          if (g) g.value = cfg.graph_name || '';
        });
        break;

      case 'close-db-dialog':
        APP.dbConfigDialogOpen = false;
        renderApp();
        break;

      case 'test-db-config':
        testDBConfig();
        break;

      case 'save-db-config':
        saveDBConfig();
        break;

      case 'delete-db-config':
        deleteDBConfig();
        break;

      case 'apply-db-match':
        var acSection = target.getAttribute('data-ac-section');
        var acRow = parseInt(target.getAttribute('data-ac-row'), 10);
        var matchIdx = parseInt(target.getAttribute('data-match-idx'), 10);
        applyDBMatch(acSection, acRow, matchIdx);
        break;

      case 'confirm-reset':
        APP.data = deepClone(APP.initialData);
        APP.dirty = false;
        APP.confirmDialogOpen = false;
        renderApp();
        break;

      case 'toggle-nested':
        var body = target.parentElement.querySelector('.nested-body');
        if (body) {
          var isHidden = body.style.display === 'none';
          body.style.display = isHidden ? '' : 'none';
          var chevron = target.querySelector('.chevron-icon');
          if (chevron) {
            chevron.innerHTML = isHidden ? ICONS.chevronDown : ICONS.chevronRight;
          }
        }
        break;

      case 'add-nested':
        var anSec = target.getAttribute('data-section');
        var anRow = parseInt(target.getAttribute('data-row'), 10);
        var anField = target.getAttribute('data-field');
        var anFd = getFieldDef(anSec, anField);
        if (!anFd || !anFd.nestedFields) break;
        var newRowObj = {};
        for (var anf = 0; anf < anFd.nestedFields.length; anf++) {
          var anfDef = anFd.nestedFields[anf];
          if (anfDef.type === 'boolean') newRowObj[anfDef.key] = false;
          else if (anfDef.type === 'number') newRowObj[anfDef.key] = 0;
          else newRowObj[anfDef.key] = '';
        }
        if (APP.data[anSec] && APP.data[anSec][anRow]) {
          if (!APP.data[anSec][anRow][anField]) APP.data[anSec][anRow][anField] = [];
          APP.data[anSec][anRow][anField].push(newRowObj);
          checkDirty();
          renderApp();
        }
        break;

      case 'remove-nested':
        var rnSec = target.getAttribute('data-section');
        var rnRow = parseInt(target.getAttribute('data-row'), 10);
        var rnField = target.getAttribute('data-field');
        var rnIdx = parseInt(target.getAttribute('data-nested-row'), 10);
        if (APP.data[rnSec] && APP.data[rnSec][rnRow] && Array.isArray(APP.data[rnSec][rnRow][rnField])) {
          APP.data[rnSec][rnRow][rnField].splice(rnIdx, 1);
          checkDirty();
          renderApp();
        }
        break;
    }
  }

  function handleFieldInput(sectionKey, rowIndex, fieldKey, target, e) {
    if (!APP.data[sectionKey] || !APP.data[sectionKey][rowIndex]) return;
    var fd = getFieldDef(sectionKey, fieldKey);
    if (!fd) return;
    if (fd.readOnly === true) return; /* don't update read-only fields */
    var type = fd.type || 'text';

    if (type === 'boolean') {
      APP.data[sectionKey][rowIndex][fieldKey] = target.checked;
    } else if (type === 'number') {
      var numVal = target.value === '' ? null : parseFloat(target.value);
      APP.data[sectionKey][rowIndex][fieldKey] = numVal;
    } else if (type === 'array') {
      var strVal = target.value.trim();
      APP.data[sectionKey][rowIndex][fieldKey] = strVal ? strVal.split(',').map(function (s) { return s.trim(); }).filter(function (s) { return s !== ''; }) : [];
    } else if (type === 'ref' || type === 'virtual') {
      /* ref/virtual handled in change, but also update on input for text fallback */
      APP.data[sectionKey][rowIndex][fieldKey] = target.value;
    } else {
      APP.data[sectionKey][rowIndex][fieldKey] = target.value;
      /* Trigger DB autocomplete for eligible fields */
      if (target.getAttribute('data-ac') === 'true') {
        debouncedTriggerAC(sectionKey, rowIndex, fieldKey, target.value);
      }
    }

    checkDirty();
  }

  function handleFieldChange(sectionKey, rowIndex, fieldKey, target, e) {
    if (!APP.data[sectionKey] || !APP.data[sectionKey][rowIndex]) return;
    var fd = getFieldDef(sectionKey, fieldKey);
    if (!fd) return;
    if (fd.readOnly === true) return; /* don't update read-only fields */
    var type = fd.type || 'text';

    if (type === 'boolean') {
      APP.data[sectionKey][rowIndex][fieldKey] = target.checked;
      checkDirty();
      return;
    }

    if (type === 'ref') {
      APP.data[sectionKey][rowIndex][fieldKey] = target.value;
      /* Check infra ref auto-fill */
      if (INFRA_REF_MAP[fieldKey]) {
        handleInfraRefChange(sectionKey, rowIndex, fieldKey, target.value);
      }
      checkDirty();
      return;
    }

    if (type === 'virtual') {
      APP.data[sectionKey][rowIndex][fieldKey] = target.value;
      handleVirtualRefChange(sectionKey, rowIndex, fieldKey, target.value);
      checkDirty();
      renderApp();
      return;
    }

    if (type === 'select') {
      APP.data[sectionKey][rowIndex][fieldKey] = target.value;
      checkDirty();
      return;
    }

    /* For number type on change (spin buttons, etc.) */
    if (type === 'number') {
      var numVal2 = target.value === '' ? null : parseFloat(target.value);
      APP.data[sectionKey][rowIndex][fieldKey] = numVal2;
      checkDirty();
      return;
    }
  }

  function handleNestedInput(sectionKey, rowIndex, fieldKey, nestedRowIndex, nestedFieldKey, target, e) {
    if (!APP.data[sectionKey] || !APP.data[sectionKey][rowIndex]) return;
    var arr = APP.data[sectionKey][rowIndex][fieldKey];
    if (!Array.isArray(arr) || !arr[nestedRowIndex]) return;

    var fd = getFieldDef(sectionKey, fieldKey);
    var nfDef = null;
    if (fd && fd.nestedFields) {
      for (var i = 0; i < fd.nestedFields.length; i++) {
        if (fd.nestedFields[i].key === nestedFieldKey) { nfDef = fd.nestedFields[i]; break; }
      }
    }

    var nType = nfDef ? nfDef.type : 'text';
    if (nType === 'boolean') {
      arr[nestedRowIndex][nestedFieldKey] = target.checked;
    } else if (nType === 'number') {
      arr[nestedRowIndex][nestedFieldKey] = target.value === '' ? null : parseFloat(target.value);
    } else {
      arr[nestedRowIndex][nestedFieldKey] = target.value;
    }
    checkDirty();
  }

  function handleNestedChange(sectionKey, rowIndex, fieldKey, nestedRowIndex, nestedFieldKey, target, e) {
    if (!APP.data[sectionKey] || !APP.data[sectionKey][rowIndex]) return;
    var arr = APP.data[sectionKey][rowIndex][fieldKey];
    if (!Array.isArray(arr) || !arr[nestedRowIndex]) return;

    var fd = getFieldDef(sectionKey, fieldKey);
    var nfDef = null;
    if (fd && fd.nestedFields) {
      for (var i = 0; i < fd.nestedFields.length; i++) {
        if (fd.nestedFields[i].key === nestedFieldKey) { nfDef = fd.nestedFields[i]; break; }
      }
    }

    var nType = nfDef ? nfDef.type : 'text';
    if (nType === 'boolean') {
      arr[nestedRowIndex][nestedFieldKey] = target.checked;
    } else if (nType === 'number') {
      arr[nestedRowIndex][nestedFieldKey] = target.value === '' ? null : parseFloat(target.value);
    } else if (nType === 'select') {
      arr[nestedRowIndex][nestedFieldKey] = target.value;
    }
    checkDirty();
  }

  /* ------------------------------------------------------------------
     20. KEYBOARD SHORTCUTS
     ------------------------------------------------------------------ */

  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
      /* Ctrl+S / Cmd+S to save */
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (!APP.isSaving) {
          APP.saveDialogOpen = true;
          renderApp();
          setTimeout(function () {
            var nameInput = document.getElementById('save-author-name');
            if (nameInput) nameInput.focus();
          }, 50);
        }
      }
      /* Escape to close modals */
      if (e.key === 'Escape') {
        if (APP.saveDialogOpen || APP.importDialogOpen || APP.versionsOpen || APP.confirmDialogOpen || APP.dbConfigDialogOpen) {
          APP.saveDialogOpen = false;
          APP.importDialogOpen = false;
          APP.versionsOpen = false;
          APP.confirmDialogOpen = false;
          APP.dbConfigDialogOpen = false;
          renderApp();
        }
      }
    });
  }

  /* ------------------------------------------------------------------
     21. TOAST NOTIFICATIONS
     ------------------------------------------------------------------ */

  function showToast(message, type) {
    type = type || 'info';
    var colors = {
      success: 'var(--primary)',
      error: 'var(--destructive)',
      info: 'var(--accent)',
    };
    var bgColor = colors[type] || colors.info;
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:' + bgColor + ';color:#fff;padding:12px 20px;border-radius:8px;font-size:14px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.2);opacity:0;transform:translateY(10px);transition:all 0.3s;';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(function () {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3000);
  }

  /* ------------------------------------------------------------------
     22. INITIALIZATION
     ------------------------------------------------------------------ */

  function init() {
    renderApp();
    setupEventDelegation();
    setupKeyboardShortcuts();
    loadDBStatus();

    /* Click outside to close autocomplete dropdowns */
    document.addEventListener('mousedown', closeAllDropdowns);

    Promise.all([loadSchema(), loadData(), loadVersions()])
      .then(function () {
        APP.isLoading = false;
        /* Set default active section to first available */
        if (APP.schema && APP.schema.sections && APP.schema.sections.length > 0) {
          APP.activeSection = APP.schema.sections[0].key;
        }
        renderApp();
        showToast('Данные загружены', 'success');
      })
      .catch(function (err) {
        APP.isLoading = false;
        var root = document.getElementById('app');
        if (root) {
          root.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:var(--background);">' +
            '<div style="text-align:center;max-width:400px;">' +
              '<p style="color:var(--destructive);font-size:16px;font-weight:500;">Ошибка загрузки данных</p>' +
              '<p style="color:var(--muted-foreground);font-size:14px;margin-top:8px;">' + esc(err.message) + '</p>' +
              '<button class="btn-primary" style="margin-top:16px;" onclick="location.reload()">Повторить</button>' +
            '</div>' +
          '</div>';
        }
      });
  }

  /* ------------------------------------------------------------------
     23. FIELD STATUS UPDATE (selective re-render for performance)
     ------------------------------------------------------------------ */

  /*
   * updateFieldValidationStatus - re-renders a single field's validation
   * indicators (red dot, invalid border, tooltip) without a full re-render.
   * This provides instant visual feedback as the user types.
   */
  function updateFieldValidationStatus(sectionKey, rowIndex, fieldKey) {
    var fd = getFieldDef(sectionKey, fieldKey);
    if (!fd) return;
    var value = (APP.data[sectionKey] || [])[rowIndex] || {};
    value = value[fieldKey];
    var type = fd.type || 'text';

    var status = validateField(fieldKey, value, type);
    var label = fd.label || fieldKey;
    var hint = getFieldHint(fieldKey);

    /* Find the field wrapper by data attributes */
    var selector = '.field-wrapper [data-section="' + sectionKey + '"][data-row="' + rowIndex + '"][data-field="' + fieldKey + '"]';
    var inputEl = document.querySelector(selector);
    if (!inputEl) return;

    /* Update input border classes */
    if (status === 'invalid') {
      inputEl.classList.add('invalid-field');
    } else {
      inputEl.classList.remove('invalid-field');
    }

    /* Update the wrapper's label area */
    var wrapper = inputEl.closest('.field-wrapper');
    if (!wrapper) return;
    var labelEl = wrapper.querySelector('.field-label');
    if (labelEl) {
      /* Remove old dot and tooltip */
      var oldDot = labelEl.querySelector('.val-dot');
      if (oldDot) oldDot.remove();
      var oldTooltip = labelEl.querySelector('.invalid-tooltip');
      if (oldTooltip) oldTooltip.remove();

      if (status === 'empty' && fd.readOnly !== true) {
        var dot = document.createElement('span');
        dot.className = 'val-dot';
        dot.style.cssText = 'width:6px;height:6px;border-radius:50%;background:var(--destructive);flex-shrink:0;display:inline-block;';
        labelEl.insertBefore(dot, labelEl.firstChild);
      }

      if (status === 'invalid') {
        var tip = document.createElement('span');
        tip.className = 'invalid-tooltip';
        tip.textContent = 'Поле ' + label + ' — некорректный формат ввода. Корректный формат: ' + hint;
        labelEl.appendChild(tip);
      }
    }
  }

  /* ------------------------------------------------------------------
     24. SECTION SUMMARY STATS
     ------------------------------------------------------------------ */

  function getSectionStats(sectionKey) {
    var rows = APP.data[sectionKey] || [];
    if (rows.length === 0) return '';
    var filled = 0;
    var total = 0;
    var secDef = getSectionDef(sectionKey);
    if (!secDef || !secDef.fields) return '' + rows.length;
    for (var r = 0; r < rows.length; r++) {
      for (var f = 0; f < secDef.fields.length; f++) {
        var fk = secDef.fields[f].key;
        if (secDef.fields[f].virtual) continue;
        total++;
        var v = rows[r][fk];
        if (v !== null && v !== undefined && String(v).trim() !== '' && !(Array.isArray(v) && v.length === 0)) {
          filled++;
        }
      }
    }
    if (total === 0) return '';
    var pct = Math.round((filled / total) * 100);
    return rows.length + ' · ' + pct + '%';
  }

  /* ------------------------------------------------------------------
     25. UNSAVED CHANGES WARNING (beforeunload)
     ------------------------------------------------------------------ */

  function setupBeforeUnload() {
    window.addEventListener('beforeunload', function (e) {
      if (APP.dirty) {
        var msg = 'Есть несохранённые изменения. Вы уверены, что хотите покинуть страницу?';
        e.preventDefault();
        e.returnValue = msg;
        return msg;
      }
    });
  }

  /* ------------------------------------------------------------------
     26. TOOLTIP MANAGEMENT (hover-triggered invalid tooltips)
     ------------------------------------------------------------------ */

  function setupTooltipListeners() {
    /* Use event delegation for hover on tooltip triggers */
    var root = document.getElementById('app');
    if (!root) return;

    root.addEventListener('mouseenter', function (e) {
      var wrapper = e.target.closest('.tooltip-trigger');
      if (wrapper) {
        var content = wrapper.querySelector('.tooltip-content');
        if (content) content.style.opacity = '1';
      }
    }, true);

    root.addEventListener('mouseleave', function (e) {
      var wrapper = e.target.closest('.tooltip-trigger');
      if (wrapper) {
        var content = wrapper.querySelector('.tooltip-content');
        if (content) content.style.opacity = '0';
      }
    }, true);
  }

  /* ------------------------------------------------------------------
     27. DB AUTOCOMPLETE
     ------------------------------------------------------------------ */

  var _acTimer = null;

  function renderAutocompleteDropdown(sectionKey, rowIndex, fieldKey) {
    var show = APP.autocompleteResults.length > 0 &&
      APP.autocompleteSectionKey === sectionKey &&
      APP.autocompleteFieldKey === fieldKey &&
      APP.autocompleteRowIndex === rowIndex;

    var html = '<div class="ac-dropdown" style="display:' + (show ? 'block' : 'none') + ';position:absolute;left:0;right:0;top:100%;z-index:60;margin-top:2px;">';

    if (APP.autocompleteLoading) {
      html += '<div style="padding:12px;text-align:center;color:var(--muted-foreground);font-size:13px;">Поиск в БД…</div>';
    } else if (APP.autocompleteResults.length === 0) {
      html += '';
    } else {
      html += '<div style="background:var(--card);border:1px solid var(--border);border-radius:var(--radius);box-shadow:0 8px 24px rgba(0,0,0,0.12);max-height:240px;overflow-y:auto;">';
      for (var i = 0; i < APP.autocompleteResults.length; i++) {
        var m = APP.autocompleteResults[i];
        html += '<div class="ac-item ac-match-item" data-action="apply-db-match" data-match-idx="' + i + '" ' +
          'data-ac-section="' + esc(sectionKey) + '" data-ac-row="' + rowIndex + '">' +
          '<div style="font-size:13px;font-weight:500;color:var(--foreground);">' + esc(m.label) + '</div>' +
          '<div style="font-size:11px;color:var(--muted-foreground);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">';
        var previewParts = [];
        var row = m.row || {};
        var rowKeys = Object.keys(row);
        for (var rk = 0; rk < Math.min(rowKeys.length, 4); rk++) {
          var rv = row[rowKeys[rk]];
          if (rv !== null && rv !== undefined && String(rv).trim() !== '' && rowKeys[rk] !== 'is_current_version') {
            previewParts.push(esc(rowKeys[rk]) + ': ' + esc(String(rv).substring(0, 30)));
          }
        }
        html += previewParts.join(' &middot; ');
        html += '</div></div>';
      }
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function triggerAutocomplete(sectionKey, rowIndex, fieldKey, value) {
    if (!APP.dbConfigured) return;
    if (value.length < 2) {
      APP.autocompleteResults = [];
      APP.autocompleteSectionKey = null;
      APP.autocompleteFieldKey = null;
      APP.autocompleteRowIndex = null;
      return;
    }
    APP.autocompleteSectionKey = sectionKey;
    APP.autocompleteFieldKey = fieldKey;
    APP.autocompleteRowIndex = rowIndex;
    APP.autocompleteLoading = true;
    /* Only update the dropdown, not the whole form */
    updateAutocompleteDropdown();

    fetch('/api/autocomplete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sectionKey: sectionKey, fieldKey: fieldKey, value: value, limit: 10 }),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        APP.autocompleteLoading = false;
        APP.autocompleteResults = Array.isArray(data) ? data : [];
        updateAutocompleteDropdown();
      })
      .catch(function () {
        APP.autocompleteLoading = false;
        APP.autocompleteResults = [];
        updateAutocompleteDropdown();
      });
  }

  function debounceAC(fn, ms) {
    return function () {
      var args = arguments;
      var ctx = this;
      clearTimeout(_acTimer);
      _acTimer = setTimeout(function () { fn.apply(ctx, args); }, ms);
    };
  }

  var debouncedTriggerAC = debounceAC(function (sk, ri, fk, v) { triggerAutocomplete(sk, ri, fk, v); }, 400);

  function applyDBMatch(sectionKey, rowIndex, matchIdx) {
    var match = APP.autocompleteResults[matchIdx];
    if (!match || !match.row) return;

    var secDef = getSectionDef(sectionKey);
    if (!secDef) return;

    var row = APP.data[sectionKey] && APP.data[sectionKey][rowIndex];
    if (!row) return;

    var dbRow = match.row;
    var dbKeys = Object.keys(dbRow);
    var filledCount = 0;

    for (var i = 0; i < dbKeys.length; i++) {
      var dbKey = dbKeys[i];
      var dbValue = dbRow[dbKey];
      if (dbValue === null || dbValue === undefined) continue;

      /* Find matching field in section */
      for (var f = 0; f < secDef.fields.length; f++) {
        var fd = secDef.fields[f];
        if (fd.key === dbKey && fd.readOnly !== true && fd.virtual !== true && fd.type === 'text') {
          var strVal = String(dbValue);
          row[fd.key] = strVal;
          markDBSourced(sectionKey, rowIndex, fd.key);
          filledCount++;
          break;
        }
      }
    }

    /* Clear autocomplete */
    APP.autocompleteResults = [];
    APP.autocompleteSectionKey = null;
    APP.autocompleteFieldKey = null;
    APP.autocompleteRowIndex = null;

    checkDirty();
    renderApp();

    if (filledCount > 0) {
      showToast('Заполнено ' + filledCount + ' полей из БД', 'success');
    }
  }

  function updateAutocompleteDropdown() {
    /* Find and update the visible dropdown without full re-render */
    var dropdowns = document.querySelectorAll('.ac-dropdown');
    for (var d = 0; d < dropdowns.length; d++) {
      var dd = dropdowns[d];
      var wrapper = dd.closest('.autocomplete-wrapper');
      if (!wrapper) continue;
      var input = wrapper.querySelector('input[data-ac]');
      if (!input) continue;
      var sk = input.getAttribute('data-section');
      var ri = input.getAttribute('data-row');
      var fk = input.getAttribute('data-field');
      var show = APP.autocompleteResults.length > 0 &&
        APP.autocompleteSectionKey === sk &&
        APP.autocompleteFieldKey === fk &&
        APP.autocompleteRowIndex === parseInt(ri, 10);

      if (show || APP.autocompleteLoading) {
        dd.style.display = 'block';
        if (APP.autocompleteLoading && APP.autocompleteResults.length === 0) {
          dd.innerHTML = '<div style="padding:12px;text-align:center;color:var(--muted-foreground);font-size:13px;">Поиск в БД…</div>';
        } else {
          dd.innerHTML = buildDropdownContent(sk, parseInt(ri, 10));
        }
      } else {
        dd.style.display = 'none';
      }
    }
  }

  function buildDropdownContent(sectionKey, rowIndex) {
    var html = '<div style="background:var(--card);border:1px solid var(--border);border-radius:var(--radius);box-shadow:0 8px 24px rgba(0,0,0,0.12);max-height:240px;overflow-y:auto;">';
    for (var i = 0; i < APP.autocompleteResults.length; i++) {
      var m = APP.autocompleteResults[i];
      html += '<div class="ac-item ac-match-item" data-action="apply-db-match" data-match-idx="' + i + '" ' +
        'data-ac-section="' + esc(sectionKey) + '" data-ac-row="' + rowIndex + '">' +
        '<div style="font-size:13px;font-weight:500;color:var(--foreground);">' + esc(m.label) + '</div>' +
        '<div style="font-size:11px;color:var(--muted-foreground);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">';
      var previewParts = [];
      var row = m.row || {};
      var rowKeys = Object.keys(row);
      for (var rk = 0; rk < Math.min(rowKeys.length, 4); rk++) {
        var rv = row[rowKeys[rk]];
        if (rv !== null && rv !== undefined && String(rv).trim() !== '' && rowKeys[rk] !== 'is_current_version') {
          previewParts.push(esc(rowKeys[rk]) + ': ' + esc(String(rv).substring(0, 30)));
        }
      }
      html += previewParts.join(' &middot; ');
      html += '</div></div>';
    }
    html += '</div>';
    return html;
  }

  function closeAllDropdowns(e) {
    if (!e || !e.target) return;
    if (e.target.closest('.ac-item')) return;
    if (e.target.closest('.autocomplete-wrapper')) return;
    APP.autocompleteResults = [];
    APP.autocompleteSectionKey = null;
    APP.autocompleteFieldKey = null;
    APP.autocompleteRowIndex = null;
    updateAutocompleteDropdown();
  }

  /* ------------------------------------------------------------------
     28. DB CONFIG DIALOG
     ------------------------------------------------------------------ */

  function loadDBStatus() {
    fetch('/api/db-status')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        APP.dbConfigured = !!data.configured;
        APP.dbSource = data.source;
        APP.dbName = data.database || '';
        APP.dbGraphName = data.graph_name || '';
        renderApp();
      })
      .catch(function () {
        APP.dbConfigured = false;
      });
  }

  function loadDBConfig() {
    return fetch('/api/db-config')
      .then(function (r) { return r.json(); })
      .then(function (data) { return data.postgresql || null; });
  }

  function saveDBConfig() {
    var config = {
      host: document.getElementById('db-host').value.trim(),
      port: parseInt(document.getElementById('db-port').value, 10) || 5432,
      database: document.getElementById('db-database').value.trim(),
      username: document.getElementById('db-username').value.trim(),
      password: document.getElementById('db-password').value,
      ssl: document.getElementById('db-ssl').checked,
      graph_name: document.getElementById('db-graph-name').value.trim(),
    };
    if (!config.host || !config.database || !config.username) {
      showToast('Заполните обязательные поля (хост, БД, пользователь)', 'error');
      return;
    }
    APP.dbSaveLoading = true;
    renderApp();
    fetch('/api/db-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
      .then(function (r) {
        if (!r.ok) return r.json().then(function (e) { throw new Error(e.error); });
        return r.json();
      })
      .then(function () {
        APP.dbSaveLoading = false;
        APP.dbConfigured = true;
        showToast('Подключение к БД сохранено', 'success');
        loadDBStatus();
      })
      .catch(function (err) {
        APP.dbSaveLoading = false;
        showToast('Ошибка: ' + err.message, 'error');
        renderApp();
      });
  }

  function testDBConfig() {
    var config = {
      host: document.getElementById('db-host').value.trim(),
      port: parseInt(document.getElementById('db-port').value, 10) || 5432,
      database: document.getElementById('db-database').value.trim(),
      username: document.getElementById('db-username').value.trim(),
      password: document.getElementById('db-password').value,
      ssl: document.getElementById('db-ssl').checked,
      graph_name: document.getElementById('db-graph-name').value.trim(),
    };
    if (!config.host || !config.database || !config.username) {
      showToast('Заполните обязательные поля', 'error');
      return;
    }
    APP.dbTestLoading = true;
    APP.dbTestResult = null;
    renderApp();
    fetch('/api/db-config/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        APP.dbTestLoading = false;
        APP.dbTestResult = data;
        renderApp();
      })
      .catch(function (err) {
        APP.dbTestLoading = false;
        APP.dbTestResult = { ok: false, error: err.message };
        renderApp();
      });
  }

  function deleteDBConfig() {
    if (!confirm('Удалить настройки подключения к БД?')) return;
    fetch('/api/db-config', { method: 'DELETE' })
      .then(function () {
        APP.dbConfigured = false;
        APP.dbConfigDialogOpen = false;
        APP.dbTestResult = null;
        clearDBSourced();
        showToast('Подключение к БД удалено', 'info');
        renderApp();
      });
  }

  function renderDBConfigDialog() {
    if (!APP.dbConfigDialogOpen) return '';
    var config = null;
    /* Load config from server for the dialog */
    /* We use a sync-ish approach: the dialog renders with placeholders, then fills in */

    var testResultHtml = '';
    if (APP.dbTestLoading) {
      testResultHtml = '<div style="padding:10px;text-align:center;color:var(--muted-foreground);font-size:13px;">Проверка подключения…</div>';
    } else if (APP.dbTestResult) {
      if (APP.dbTestResult.ok) {
        testResultHtml = '<div style="padding:10px;background:oklch(0.95 0.03 145);border-radius:var(--radius);color:oklch(0.25 0.05 145);font-size:13px;">' +
          '✓ Подключение успешно (' + (APP.dbTestResult.latency_ms || '?') + ' мс)' +
          (APP.dbTestResult.age_available ? ' &middot; Apache AGE доступен' : '') +
          '</div>';
      } else {
        testResultHtml = '<div style="padding:10px;background:oklch(0.97 0.02 25);border-radius:var(--radius);color:var(--destructive);font-size:13px;">' +
          '✗ ' + esc(APP.dbTestResult.error || 'Ошибка подключения') + '</div>';
      }
    }

    return '<div class="modal-overlay" onclick="if(event.target===this){APP.dbConfigDialogOpen=false;renderApp();}">' +
      '<div class="modal-content" style="width:520px;max-width:95vw;max-height:90vh;overflow-y:auto;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">' +
          '<h3 style="font-size:18px;font-weight:600;display:flex;align-items:center;gap:8px;">' + ICONS.database + ' Подключение к PostgreSQL</h3>' +
          '<button class="btn-ghost" data-action="close-db-dialog">' + ICONS.x + '</button>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
          '<div class="form-group" style="grid-column:1/3;">' +
            '<label class="form-label">Хост <span style="color:var(--destructive);">*</span></label>' +
            '<input type="text" id="db-host" class="form-input" placeholder="localhost" value="" />' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">Порт</label>' +
            '<input type="number" id="db-port" class="form-input" placeholder="5432" value="5432" />' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">База данных <span style="color:var(--destructive);">*</span></label>' +
            '<input type="text" id="db-database" class="form-input" placeholder="maritime_db" value="" />' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">Пользователь <span style="color:var(--destructive);">*</span></label>' +
            '<input type="text" id="db-username" class="form-input" placeholder="postgres" value="" />' +
          '</div>' +
          '<div class="form-group">' +
            '<label class="form-label">Пароль</label>' +
            '<input type="password" id="db-password" class="form-input" placeholder="••••••••" />' +
          '</div>' +
          '<div class="form-group" style="display:flex;align-items:flex-end;padding-bottom:4px;">' +
            '<label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:0.85rem;">' +
              '<input type="checkbox" id="db-ssl" class="form-checkbox" /> SSL' +
            '</label>' +
          '</div>' +
          '<div class="form-group" style="grid-column:1/3;">' +
            '<label class="form-label">Имя графа Apache AGE <span style="font-size:11px;color:var(--muted-foreground);font-weight:400;">(необязательно, для Cypher-запросов)</span></label>' +
            '<input type="text" id="db-graph-name" class="form-input" placeholder="my_graph" value="" />' +
          '</div>' +
        '</div>' +
        testResultHtml +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:16px;border-top:1px solid var(--border);">' +
          '<button class="btn-destructive btn-sm" data-action="delete-db-config">Удалить</button>' +
          '<div style="display:flex;gap:8px;">' +
            '<button class="btn-secondary" data-action="test-db-config"' + (APP.dbTestLoading ? ' disabled' : '') + '>' +
              (APP.dbTestLoading ? 'Проверка…' : 'Проверить') +
            '</button>' +
            '<button class="btn-primary" data-action="save-db-config"' + (APP.dbSaveLoading ? ' disabled' : '') + '>' +
              (APP.dbSaveLoading ? 'Сохранение…' : 'Сохранить') +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ------------------------------------------------------------------
     29. BOOT
     ------------------------------------------------------------------ */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setupBeforeUnload();
      init();
    });
  } else {
    setupBeforeUnload();
    init();
  }

})();
