// =============================================================================
// Maritime Security Data Entry SPA — Vanilla JS
// =============================================================================

(function () {
  'use strict';

  // ===========================================================================
  //  State
  // ===========================================================================

  const AppState = {
    schema: null,
    groups: null,
    data: {},
    initialData: {},
    isLoading: true,
    isSaving: false,
    activeSection: 'sti',
    activeRecord: {},
    author: { name: '', role: '' },
    versions: [],
    collapsedGroups: new Set(),
    collapsedReadOnly: new Set(),
    collapsedObject: new Set(),
    selectedImportFile: null,
  };

  // ===========================================================================
  //  Format Validation Rules
  // ===========================================================================

  const FORMAT_RULES = [
    { keyPattern: /(?:^|_)ip_ogrn$/, validate: v => /^\d{15}$/.test(v), formatHint: '15 цифр (ОГРНИП)' },
    { keyPattern: /ogrn$/, validate: v => /^\d{13}$/.test(v), formatHint: '13 цифр (ОГРН)' },
    { keyPattern: /(?:^|_)ip_inn$/, validate: v => /^\d{12}$/.test(v), formatHint: '12 цифр (ИНН ИП/физлица)' },
    { keyPattern: /person_inn$/, validate: v => /^\d{12}$/.test(v), formatHint: '12 цифр (ИНН физлица)' },
    { keyPattern: /inn$/, validate: v => /^\d{10}(\d{2})?$/.test(v), formatHint: '10 или 12 цифр (ИНН юрлица/физлица)' },
    { keyPattern: /kpp$/, validate: v => /^\d{9}$/.test(v), formatHint: '9 цифр (КПП)' },
    { keyPattern: /okpo$/, validate: v => /^\d{8,10}$/.test(v), formatHint: '8 или 10 цифр (ОКПО)' },
    { keyPattern: /snils/, validate: v => /^\d{11}$/.test(v), formatHint: '11 цифр (СНИЛС)' },
    { keyPattern: /(?:bik|bic)$/i, validate: v => /^\d{9}$/.test(v), formatHint: '9 цифр (БИК)' },
    { keyPattern: /(?:^|_)rs$/, validate: v => /^\d{20}$/.test(v), formatHint: '20 цифр (расчётный счёт)' },
    { keyPattern: /(?:^|_)ks$/, validate: v => /^\d{20}$/.test(v), formatHint: '20 цифр (корр. счёт)' },
    { keyPattern: /email$/, validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), formatHint: 'example@domain.com' },
    { keyPattern: /fax$/, validate: v => /^[\d\s\-\+\(\)]{7,25}$/.test(v), formatHint: '+7 (XXX) XXX-XX-XX' },
    { keyPattern: /phone$/, validate: v => /^[\d\s\-\+\(\)]{7,25}$/.test(v), formatHint: '+7 (XXX) XXX-XX-XX' },
    { keyPattern: /(?:^|_)imo$/, validate: v => /^\d{7}$/.test(v), formatHint: '7 цифр (IMO номер судна)' },
    { keyPattern: /mmsi$/, validate: v => /^\d{9}$/.test(v), formatHint: '9 цифр (MMSI)' },
    { keyPattern: /call_sign$/, validate: v => /^[A-Za-z0-9\-]{3,10}$/.test(v), formatHint: 'Буквенно-цифровой позывной (3–10 символов)' },
    { keyPattern: /(?:_lat|latitude)$/, validate: v => { const n = Number(v); return /^-?\d{1,3}(\.\d+)?$/.test(v) && n >= -90 && n <= 90; }, formatHint: '-90.000000 … +90.000000 (широта)' },
    { keyPattern: /(?:_lon|longitude)$/, validate: v => { const n = Number(v); return /^-?\d{1,3}(\.\d+)?$/.test(v) && n >= -180 && n <= 180; }, formatHint: '-180.000000 … +180.000000 (долгота)' },
    { keyPattern: /reg_num$/, validate: v => v.length >= 3, formatHint: 'Не менее 3 символов' },
  ];

  function findFormatRule(fieldKey) {
    for (const rule of FORMAT_RULES) {
      if (rule.keyPattern.test(fieldKey)) return rule;
    }
    return null;
  }

  function getFieldFormatHint(field) {
    if (field.type === 'number') return 'Число (дробное через точку)';
    if (field.type === 'date') return 'ГГГГ-ММ-ДД (например, 2024-12-31)';
    const rule = findFormatRule(field.key);
    return rule ? rule.formatHint : null;
  }

  // ===========================================================================
  //  Field Status
  // ===========================================================================

  function getFieldStatus(field, value) {
    if (field.readOnly || field.virtual) return 'ok';
    if (field.type === 'boolean') return 'ok';
    if (field.type === 'object') return 'ok';

    const isEmpty = () => {
      switch (field.type) {
        case 'text':
        case 'textarea':
          return value === '' || value === undefined || value === null;
        case 'number':
          return value === null || value === undefined;
        case 'date':
          return value === null || value === undefined || value === '';
        case 'select':
          return value === '' || value === null;
        case 'array':
          return !Array.isArray(value) || value.length === 0;
        case 'ref':
          return value === null || value === undefined;
        default:
          return false;
      }
    };

    if (isEmpty()) return 'empty';

    if (field.type === 'number') {
      if (typeof value !== 'number' || !Number.isFinite(value)) return 'invalid';
      return 'ok';
    }

    if (field.type === 'date') {
      const str = String(value);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return 'invalid';
      const d = new Date(str + 'T00:00:00');
      if (isNaN(d.getTime())) return 'invalid';
      const [y, m, day] = str.split('-').map(Number);
      if (d.getFullYear() !== y || d.getMonth() + 1 !== m || d.getDate() !== day) return 'invalid';
      return 'ok';
    }

    if (field.type === 'text' || field.type === 'textarea') {
      const str = String(value);
      const rule = findFormatRule(field.key);
      if (rule && !rule.validate(str)) return 'invalid';
      return 'ok';
    }

    if (field.type === 'select') return 'ok';
    if (field.type === 'array') return 'ok';
    if (field.type === 'ref') return 'ok';
    return 'ok';
  }

  function countFieldIssues(fields, row) {
    let count = 0;
    for (const f of fields) {
      if (f.readOnly || f.virtual) continue;
      if (getFieldStatus(f, row[f.key]) !== 'ok') count++;
    }
    return count;
  }

  // ===========================================================================
  //  Helpers
  // ===========================================================================

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function esc(s) {
    const el = document.createElement('span');
    el.textContent = String(s == null ? '' : s);
    return el.innerHTML;
  }

  function formatTimestamp(ts) {
    try {
      const d = new Date(ts);
      return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return ts; }
  }

  function getSectionDef(key) {
    if (!AppState.schema) return null;
    return AppState.schema.find(s => s.key === key);
  }

  // ===========================================================================
  //  Auto-fill Logic
  // ===========================================================================

  const INFRA_REF_TO_NAME = {
    located_on_infra_ref: 'located_on_name',
    connected_to_infra_ref: 'connected_to_name',
    berth_infra_ref: 'berth_name',
    tsotb_location_infra_ref: 'tsotb_location_name',
    tsotb_monitors_infra_ref: 'tsotb_monitors_object_name',
    tsotb_powered_from_infra_ref: 'tsotb_powered_from_name',
    eng_instance_location_infra_ref: 'eng_instance_location_name',
  };

  function autoFillNameFromRef(sectionKey, rowIndex, refFieldKey, refValue) {
    const nameFieldKey = INFRA_REF_TO_NAME[refFieldKey];
    if (!nameFieldKey) return;

    const infraRows = AppState.data['infrastructure'] || [];
    const idx = refValue;
    const name = idx !== null && idx !== undefined && infraRows[idx]
      ? String(infraRows[idx]['obj_name'] || '')
      : '';

    updateCellDirect(sectionKey, rowIndex, nameFieldKey, name);
  }

  function getVirtualFieldKeys() {
    const map = {};
    if (!AppState.schema) return map;
    for (const section of AppState.schema) {
      const vk = new Set();
      for (const field of section.fields) {
        if (field.virtual) vk.add(field.key);
      }
      if (vk.size > 0) map[section.key] = vk;
    }
    return map;
  }

  function getRefAutoFillMappings() {
    const map = {};
    if (!AppState.schema) return map;
    for (const section of AppState.schema) {
      const sm = {};
      for (const field of section.fields) {
        if (field.virtual && field.refAutoFill) {
          sm[field.key] = field.refAutoFill;
        }
      }
      if (Object.keys(sm).length > 0) map[section.key] = sm;
    }
    return map;
  }

  function autoFillFromVirtualRef(sectionKey, rowIndex, virtualFieldKey, refValue) {
    const mappings = getRefAutoFillMappings();
    const sectionMappings = mappings[sectionKey];
    if (!sectionMappings) return;

    const fillMap = sectionMappings[virtualFieldKey];
    if (!fillMap) return;

    const section = getSectionDef(sectionKey);
    const fieldDef = section ? section.fields.find(f => f.key === virtualFieldKey) : null;
    if (!fieldDef || !fieldDef.refSection) return;

    const refRows = AppState.data[fieldDef.refSection] || [];
    const idx = refValue;

    if (idx === null || idx === undefined || !refRows[idx]) {
      const updates = {};
      for (const targetKey of Object.keys(fillMap)) {
        const targetField = section ? section.fields.find(f => f.key === targetKey) : null;
        if (targetField && (targetField.type === 'boolean')) {
          updates[targetKey] = targetField.defaultValue !== undefined ? targetField.defaultValue : false;
        } else if (targetField && (targetField.type === 'number' || targetField.type === 'date')) {
          updates[targetKey] = targetField.defaultValue !== undefined ? targetField.defaultValue : null;
        } else {
          updates[targetKey] = targetField && targetField.defaultValue !== undefined ? targetField.defaultValue : '';
        }
      }
      for (const [k, v] of Object.entries(updates)) {
        updateCellDirect(sectionKey, rowIndex, k, v);
      }
      return;
    }

    const sourceRow = refRows[idx];
    for (const [targetKey, sourceKey] of Object.entries(fillMap)) {
      updateCellDirect(sectionKey, rowIndex, targetKey, sourceRow[sourceKey] !== undefined ? sourceRow[sourceKey] : '');
    }
  }

  // ===========================================================================
  //  Virtual field stripping
  // ===========================================================================

  function stripVirtualFields(data) {
    const virtualKeys = getVirtualFieldKeys();
    const clean = {};
    for (const [sectionKey, rows] of Object.entries(data)) {
      const svk = virtualKeys[sectionKey];
      if (!svk || svk.size === 0) { clean[sectionKey] = rows; continue; }
      clean[sectionKey] = rows.map(row => {
        const r = row;
        const stripped = {};
        for (const [k, v] of Object.entries(r)) {
          if (!svk.has(k)) stripped[k] = v;
        }
        return stripped;
      });
    }
    return clean;
  }

  function isDirty() {
    const cleanData = stripVirtualFields(AppState.data);
    return JSON.stringify(cleanData) !== JSON.stringify(AppState.initialData);
  }

  // ===========================================================================
  //  Get Empty Row
  // ===========================================================================

  function getEmptyRow(sectionKey) {
    const section = getSectionDef(sectionKey);
    if (!section) return {};
    const row = {};
    for (const field of section.fields) {
      if (field.virtual) continue;
      if (field.type === 'object' && field.nestedFields) {
        row[field.key] = Array.isArray(field.defaultValue) ? deepClone(field.defaultValue) : (field.defaultValue || {});
      } else if (field.type === 'array') {
        row[field.key] = [];
      } else if (field.type === 'boolean') {
        row[field.key] = field.defaultValue !== undefined ? field.defaultValue : false;
      } else if (field.type === 'number') {
        row[field.key] = field.defaultValue !== undefined ? field.defaultValue : null;
      } else if (field.type === 'date') {
        row[field.key] = field.defaultValue !== undefined ? field.defaultValue : null;
      } else if (field.type === 'ref') {
        row[field.key] = field.defaultValue !== undefined ? field.defaultValue : null;
      } else {
        row[field.key] = field.defaultValue !== undefined ? field.defaultValue : '';
      }
    }
    return row;
  }

  // ===========================================================================
  //  Data Mutations
  // ===========================================================================

  function updateCellDirect(sectionKey, rowIndex, fieldKey, value) {
    const rows = AppState.data[sectionKey] || [];
    if (rows[rowIndex]) {
      rows[rowIndex][fieldKey] = value;
    }
  }

  function updateCell(sectionKey, rowIndex, fieldKey, value) {
    if (!AppState.data[sectionKey]) AppState.data[sectionKey] = [];
    if (!AppState.data[sectionKey][rowIndex]) {
      AppState.data[sectionKey][rowIndex] = {};
    }
    AppState.data[sectionKey][rowIndex][fieldKey] = value;

    // Auto-fill companion name fields when infra ref changes
    if (fieldKey.endsWith('_infra_ref')) {
      autoFillNameFromRef(sectionKey, rowIndex, fieldKey, value);
    }

    // Auto-fill from virtual ref fields
    const mappings = getRefAutoFillMappings();
    if (mappings[sectionKey] && mappings[sectionKey][fieldKey]) {
      autoFillFromVirtualRef(sectionKey, rowIndex, fieldKey, value);
    }

    renderMainContent();
    renderDirtyBadge();
  }

  function addRow(sectionKey) {
    if (!AppState.data[sectionKey]) AppState.data[sectionKey] = [];
    const newRow = getEmptyRow(sectionKey);
    AppState.data[sectionKey].push(newRow);
    AppState.activeRecord[sectionKey] = AppState.data[sectionKey].length - 1;
    renderSidebar();
    renderMainContent();
  }

  function removeRow(sectionKey, rowIndex) {
    if (!AppState.data[sectionKey]) return;
    AppState.data[sectionKey].splice(rowIndex, 1);
    if ((AppState.activeRecord[sectionKey] || 0) >= AppState.data[sectionKey].length) {
      AppState.activeRecord[sectionKey] = Math.max(0, AppState.data[sectionKey].length - 1);
    }
    renderSidebar();
    renderMainContent();
  }

  function updateNestedCell(sectionKey, rowIndex, fieldKey, nestedIndex, nestedFieldKey, value) {
    const rows = AppState.data[sectionKey] || [];
    if (rows[rowIndex] && Array.isArray(rows[rowIndex][fieldKey])) {
      const arr = rows[rowIndex][fieldKey];
      if (arr[nestedIndex]) {
        arr[nestedIndex][nestedFieldKey] = value;
      }
    }
    // Don't re-render everything — just update the nested table inline
  }

  function addNestedRow(sectionKey, rowIndex, fieldKey) {
    const rows = AppState.data[sectionKey] || [];
    if (!rows[rowIndex]) return;
    const section = getSectionDef(sectionKey);
    const field = section ? section.fields.find(f => f.key === fieldKey) : null;
    if (!field || !field.nestedFields) return;
    const emptyRow = {};
    for (const nf of field.nestedFields) {
      if (nf.type === 'boolean') emptyRow[nf.key] = nf.defaultValue !== undefined ? nf.defaultValue : false;
      else if (nf.type === 'number') emptyRow[nf.key] = nf.defaultValue !== undefined ? nf.defaultValue : null;
      else if (nf.type === 'array') emptyRow[nf.key] = [];
      else emptyRow[nf.key] = nf.defaultValue !== undefined ? nf.defaultValue : '';
    }
    if (!Array.isArray(rows[rowIndex][fieldKey])) rows[rowIndex][fieldKey] = [];
    rows[rowIndex][fieldKey].push(emptyRow);
    renderMainContent();
  }

  function removeNestedRow(sectionKey, rowIndex, fieldKey, nestedIndex) {
    const rows = AppState.data[sectionKey] || [];
    if (rows[rowIndex] && Array.isArray(rows[rowIndex][fieldKey])) {
      rows[rowIndex][fieldKey].splice(nestedIndex, 1);
    }
    renderMainContent();
  }

  // ===========================================================================
  //  API Calls
  // ===========================================================================

  async function loadSchema() {
    try {
      const res = await fetch('/api/schema');
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      AppState.schema = json.sections;
      AppState.groups = json.groups;
    } catch (e) {
      console.error('Failed to load schema', e);
    }
  }

  async function loadData() {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      const normalized = {};
      for (const key of Object.keys(data)) {
        normalized[key] = Array.isArray(data[key]) ? data[key] : [];
      }
      AppState.data = normalized;
      AppState.initialData = deepClone(normalized);
    } catch (e) {
      console.error('Failed to load data', e);
    }
  }

  async function saveData() {
    if (AppState.isSaving) return;
    AppState.isSaving = true;
    renderDirtyBadge();

    try {
      const cleanData = stripVirtualFields(AppState.data);
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: cleanData, author: AppState.author }),
      });
      if (!res.ok) {
        const body = await res.json();
        showToast(body.error || 'Ошибка сохранения', 'error');
        return;
      }
      const body = await res.json();
      await loadData();
      await loadVersions();
      showToast(`Данные сохранены (версия ${body.version})`, 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Ошибка сети', 'error');
    } finally {
      AppState.isSaving = false;
      renderDirtyBadge();
      renderVersionBadge();
    }
  }

  async function loadVersions() {
    try {
      const res = await fetch('/api/versions');
      if (res.ok) {
        AppState.versions = await res.json();
      }
    } catch { /* silent */ }
  }

  async function loadVersionData(versionId) {
    AppState.isLoading = true;
    renderApp();
    try {
      const res = await fetch(`/api/versions/${versionId}`);
      if (!res.ok) throw new Error('Версия не найдена');
      const data = await res.json();
      const normalized = {};
      for (const key of Object.keys(data)) {
        normalized[key] = Array.isArray(data[key]) ? data[key] : [];
      }
      AppState.data = normalized;
      AppState.initialData = deepClone(normalized);
      AppState.isLoading = false;
      await loadVersions();
      showToast('Версия загружена', 'success');
      closeModal('versions-modal');
      renderApp();
    } catch (e) {
      AppState.isLoading = false;
      renderApp();
      showToast('Не удалось загрузить версию', 'error');
    }
  }

  async function handleExport() {
    try {
      const res = await fetch('/api/export');
      if (!res.ok) throw new Error('Ошибка экспорта');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'port_security_data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Файл экспортирован', 'success');
    } catch {
      showToast('Не удалось экспортировать данные', 'error');
    }
  }

  async function handleImport() {
    if (!AppState.selectedImportFile) return;
    const formData = new FormData();
    formData.append('file', AppState.selectedImportFile);
    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const body = await res.json();
        showToast(body.error || 'Ошибка импорта', 'error');
        return;
      }
      await loadData();
      await loadVersions();
      showToast('Данные успешно импортированы', 'success');
      closeModal('import-modal');
      resetImportState();
      renderSidebar();
      renderMainContent();
      renderVersionBadge();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Ошибка сети', 'error');
    }
  }

  async function handleReset() {
    if (!confirm('Сбросить все данные к начальному состоянию? Это действие нельзя отменить.')) return;
    AppState.isLoading = true;
    renderApp();
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (!res.ok) throw new Error('Не удалось сбросить данные');
      await loadData();
      await loadVersions();
      AppState.isLoading = false;
      showToast('Данные сброшены', 'success');
      renderApp();
    } catch (e) {
      AppState.isLoading = false;
      renderApp();
      showToast('Не удалось сбросить данные', 'error');
    }
  }

  // ===========================================================================
  //  Toast Notifications
  // ===========================================================================

  function showToast(message, type) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type || 'success'}`;
    const iconName = type === 'error' ? 'alert-circle' : 'check-circle';
    toast.innerHTML = `<i data-lucide="${iconName}" class="size-4 shrink-0 mt-0.5 ${type === 'error' ? 'text-destructive' : 'text-green-600'}"></i><span>${esc(message)}</span>`;
    container.appendChild(toast);
    lucide.createIcons({ nodes: toast.querySelectorAll('[data-lucide]') });

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 200);
    }, 3500);
  }

  // ===========================================================================
  //  Modal Management
  // ===========================================================================

  function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
    lucide.createIcons({ nodes: document.getElementById(id).querySelectorAll('[data-lucide]') });
  }

  function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
  }

  // ===========================================================================
  //  Import State
  // ===========================================================================

  function resetImportState() {
    AppState.selectedImportFile = null;
    const dropzone = document.getElementById('import-dropzone');
    dropzone.className = 'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors border-muted-foreground/25 hover:border-muted-foreground/50';
    dropzone.innerHTML = `<div class="flex flex-col items-center gap-2 text-muted-foreground"><i data-lucide="upload-cloud" class="size-8"></i><p class="text-sm">Перетащите файл сюда или нажмите для выбора</p><p class="text-xs">Только файлы .json</p></div>`;
    document.getElementById('import-preview').classList.add('hidden');
    document.getElementById('import-error').classList.add('hidden');
    document.getElementById('import-do-btn').disabled = true;
    lucide.createIcons({ nodes: dropzone.querySelectorAll('[data-lucide]') });
  }

  function handleImportFileSelect(file) {
    if (!file) return;
    if (!file.name.endsWith('.json')) {
      document.getElementById('import-error').classList.remove('hidden');
      document.getElementById('import-error-text').textContent = 'Файл должен иметь расширение .json';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      document.getElementById('import-error').classList.remove('hidden');
      document.getElementById('import-error-text').textContent = 'Файл слишком большой (максимум 10 МБ)';
      return;
    }

    AppState.selectedImportFile = file;
    document.getElementById('import-error').classList.add('hidden');
    document.getElementById('import-do-btn').disabled = false;

    const dropzone = document.getElementById('import-dropzone');
    dropzone.className = 'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors import-dropzone-has-file';
    dropzone.innerHTML = `<div class="flex flex-col items-center gap-2"><i data-lucide="file-json" class="size-8 text-green-600"></i><p class="text-sm font-medium">${esc(file.name)}</p><p class="text-xs text-muted-foreground">${(file.size / 1024).toFixed(1)} КБ</p><button class="text-xs text-primary underline" id="import-remove-file">Удалить файл</button></div>`;
    lucide.createIcons({ nodes: dropzone.querySelectorAll('[data-lucide]') });

    const removeBtn = document.getElementById('import-remove-file');
    removeBtn.addEventListener('click', (e) => { e.stopPropagation(); resetImportState(); });

    // Read preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      document.getElementById('import-preview-content').textContent = lines.slice(0, 50).join('\n');
      document.getElementById('import-preview').classList.remove('hidden');
    };
    reader.readAsText(file);
  }

  // ===========================================================================
  //  Render App Shell
  // ===========================================================================

  function renderApp() {
    const app = document.getElementById('app');
    const overlay = document.getElementById('loading-overlay');

    if (AppState.isLoading && Object.keys(AppState.data).length === 0) {
      if (!overlay) {
        app.innerHTML = `<div id="loading-overlay" class="min-h-screen flex items-center justify-center"><div class="flex flex-col items-center gap-3"><div class="spinner size-8"></div><p class="text-muted-foreground text-sm">Загрузка данных…</p></div></div>`;
      }
      return;
    }

    const latestVersion = AppState.versions.length > 0 ? AppState.versions[0].version_label : '—';
    const dirty = isDirty();

    app.innerHTML = `
      <!-- Header -->
      <header class="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div class="flex items-center gap-3 px-4 py-2.5">
          <div class="flex items-center gap-2">
            <i data-lucide="shield" class="size-5 text-foreground"></i>
            <h1 class="text-base font-semibold whitespace-nowrap">Реестр данных ОТИ</h1>
            <span id="dirty-badge" class="badge badge-primary-outline ${dirty ? '' : 'hidden'}">изменено</span>
          </div>
          <div class="separator-v h-6"></div>
          <input type="text" id="author-name" placeholder="Имя автора" value="${esc(AppState.author.name)}" class="field-input h-8 w-36 text-xs">
          <input type="text" id="author-role" placeholder="Должность автора" value="${esc(AppState.author.role)}" class="field-input h-8 w-40 text-xs">
          <div class="separator-v h-6"></div>
          <div class="flex items-center gap-1.5">
            <button class="btn btn-primary btn-sm" id="btn-save" data-tooltip="Сохранить данные">
              <i data-lucide="save" class="size-3.5"></i><span class="ml-1.5">Сохранить</span>
            </button>
            <button class="btn btn-outline btn-sm" id="btn-export" data-tooltip="Экспорт JSON">
              <i data-lucide="download" class="size-3.5"></i><span class="ml-1.5">Экспорт</span>
            </button>
            <button class="btn btn-outline btn-sm" id="btn-import" data-tooltip="Импорт JSON">
              <i data-lucide="upload" class="size-3.5"></i><span class="ml-1.5">Импорт</span>
            </button>
            <button class="btn btn-outline btn-sm" id="btn-versions" data-tooltip="История версий">
              <i data-lucide="history" class="size-3.5"></i><span class="ml-1.5">Версии</span>
            </button>
            <button class="btn btn-outline btn-sm" id="btn-reset" data-tooltip="Сбросить данные">
              <i data-lucide="rotate-ccw" class="size-3.5"></i>
            </button>
          </div>
          <div class="ml-auto">
            <span id="version-badge" class="text-xs text-muted-foreground">${esc(latestVersion)}</span>
          </div>
        </div>
      </header>

      <!-- Body -->
      <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar -->
        <aside class="w-[280px] shrink-0 border-r border-border bg-muted/30 overflow-y-auto" id="sidebar"></aside>
        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto" id="main-content"></main>
      </div>

      <!-- Footer -->
      <footer class="border-t border-border bg-card px-4 py-2 mt-auto">
        <div class="flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2025 Реестр данных ОТИ</span>
          <span>Версия: ${esc(latestVersion)}</span>
        </div>
      </footer>
    `;

    bindHeaderEvents();
    renderSidebar();
    renderMainContent();
    lucide.createIcons({ nodes: app.querySelectorAll('[data-lucide]') });
  }

  // ===========================================================================
  //  Render Dirty Badge
  // ===========================================================================

  function renderDirtyBadge() {
    const badge = document.getElementById('dirty-badge');
    if (!badge) return;
    if (isDirty()) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  function renderVersionBadge() {
    const badge = document.getElementById('version-badge');
    const footerBadge = document.querySelector('footer .ml-auto span');
    const latest = AppState.versions.length > 0 ? AppState.versions[0].version_label : '—';
    if (badge) badge.textContent = latest;
    if (footerBadge) footerBadge.textContent = 'Версия: ' + latest;
  }

  // ===========================================================================
  //  Header Event Binding
  // ===========================================================================

  function bindHeaderEvents() {
    const nameInput = document.getElementById('author-name');
    const roleInput = document.getElementById('author-role');

    nameInput.addEventListener('input', (e) => {
      AppState.author.name = e.target.value;
      localStorage.setItem('oti_author_name', e.target.value);
    });

    roleInput.addEventListener('input', (e) => {
      AppState.author.role = e.target.value;
      localStorage.setItem('oti_author_role', e.target.value);
    });

    document.getElementById('btn-save').addEventListener('click', saveData);
    document.getElementById('btn-export').addEventListener('click', handleExport);
    document.getElementById('btn-import').addEventListener('click', () => {
      resetImportState();
      openModal('import-modal');
    });
    document.getElementById('btn-versions').addEventListener('click', () => {
      renderVersionsModal();
      openModal('versions-modal');
    });
    document.getElementById('btn-reset').addEventListener('click', handleReset);
  }

  // ===========================================================================
  //  Render Sidebar
  // ===========================================================================

  function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar || !AppState.groups) return;

    let html = '<div class="py-2">';
    for (const group of AppState.groups) {
      const isCollapsed = AppState.collapsedGroups.has(group.label);
      html += '<div class="mb-1">';
      html += `<button class="collapsible-header flex w-full items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors" data-group-label="${esc(group.label)}">`;
      html += `<i data-lucide="${isCollapsed ? 'chevron-right' : 'chevron-down'}" class="size-3 shrink-0"></i>`;
      html += esc(group.label);
      html += '</button>';
      if (!isCollapsed) {
        html += '<div class="space-y-0.5">';
        for (const section of group.sections) {
          const isActive = AppState.activeSection === section.key;
          const rows = AppState.data[section.key] || [];
          const hasData = rows.length > 0;
          html += `<button class="sidebar-section-btn flex w-full items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${isActive ? 'bg-accent text-accent-foreground font-medium' : 'hover:bg-muted/50 text-foreground/80'}" data-section-key="${esc(section.key)}">`;
          html += `<i data-lucide="${esc(section.icon || 'shield')}" class="size-4 shrink-0"></i>`;
          html += `<span class="flex-1 text-left truncate">${esc(section.label)}</span>`;
          if (hasData) html += `<span class="size-2 rounded-full bg-primary shrink-0"></span>`;
          html += '</button>';
        }
        html += '</div>';
      }
      html += '</div>';
    }
    html += '</div>';
    sidebar.innerHTML = html;
    lucide.createIcons({ nodes: sidebar.querySelectorAll('[data-lucide]') });

    // Bind section click events
    sidebar.querySelectorAll('.sidebar-section-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        AppState.activeSection = btn.dataset.sectionKey;
        renderSidebar();
        renderMainContent();
      });
    });

    // Bind group toggle events
    sidebar.querySelectorAll('.collapsible-header').forEach(btn => {
      btn.addEventListener('click', () => {
        const label = btn.dataset.groupLabel;
        if (AppState.collapsedGroups.has(label)) {
          AppState.collapsedGroups.delete(label);
        } else {
          AppState.collapsedGroups.add(label);
        }
        renderSidebar();
      });
    });
  }

  // ===========================================================================
  //  Render Main Content
  // ===========================================================================

  function renderMainContent() {
    const main = document.getElementById('main-content');
    if (!main || !AppState.schema) return;

    const section = getSectionDef(AppState.activeSection);
    if (!section) {
      main.innerHTML = '<div class="flex items-center justify-center h-full text-muted-foreground">Раздел не найден</div>';
      return;
    }

    let html = '<div class="p-6 max-w-[960px]">';

    // Section header
    html += '<div class="mb-6">';
    html += '<div class="flex items-center gap-2.5 mb-1">';
    html += `<div class="flex items-center justify-center size-8 rounded-md bg-primary/10 text-primary"><i data-lucide="${esc(section.icon || 'shield')}" class="size-4"></i></div>`;
    html += '<div>';
    html += `<h2 class="text-lg font-semibold">${esc(section.label)}</h2>`;
    html += `<p class="text-xs text-muted-foreground">${esc(section.description)}</p>`;
    html += '</div></div></div>';

    // Section Table
    const rows = AppState.data[section.key] || [];
    const editableFields = section.fields.filter(f => !f.readOnly);
    const readOnlyFields = section.fields.filter(f => f.readOnly);

    if (rows.length === 0) {
      // Empty state
      html += '<div class="py-16 text-center">';
      html += '<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">';
      html += '<i data-lucide="file-text" class="size-7 text-muted-foreground"></i></div>';
      html += '<p class="text-muted-foreground text-sm mb-4">Нет данных. Добавьте запись для начала.</p>';
      html += `<button class="btn btn-outline" id="empty-add-btn"><i data-lucide="plus" class="size-4 mr-2"></i>Добавить запись</button>`;
      html += '</div>';
    } else {
      const recIdx = AppState.activeRecord[section.key] || 0;
      const clamped = Math.min(recIdx, rows.length - 1);
      if (clamped !== recIdx) AppState.activeRecord[section.key] = clamped;

      // Record tabs
      html += '<div class="flex items-center gap-2 border-b border-border pb-3">';
      html += '<div class="flex items-center gap-1 overflow-x-auto">';
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const issues = countFieldIssues(editableFields, r);
        const isActive = i === clamped;
        let cls = 'btn btn-sm shrink-0 h-8 px-3 text-xs gap-1.5 ';
        if (isActive) {
          cls += '';
        } else {
          cls += 'btn-outline';
          if (issues > 0) cls += ' border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive';
        }
        html += `<button class="btn ${cls}" data-rec-tab="${i}">Запись ${i + 1}`;
        if (issues > 0) {
          html += `<span class="badge ${isActive ? 'badge-on-primary' : 'badge-destructive'}" style="font-size:9px;padding:0 0.25rem;height:1rem;">${issues}</span>`;
        }
        html += '</button>';
      }
      html += '</div>';
      html += `<button class="btn btn-outline btn-sm shrink-0 h-8 text-xs" id="add-record-btn"><i data-lucide="plus" class="size-3.5 mr-1"></i>Добавить</button>`;
      html += '<div class="ml-auto">';
      html += `<button class="btn btn-outline btn-sm h-8 text-xs text-destructive hover:text-destructive" id="remove-record-btn"><i data-lucide="trash-2" class="size-3.5 mr-1"></i>Удалить</button>`;
      html += '</div></div>';

      // Record form
      html += '<div class="space-y-6 mt-4">';

      const row = rows[clamped];

      // Classify fields
      const virtualFields = editableFields.filter(f => f.virtual);
      const shortFields = editableFields.filter(f => !f.virtual && f.type !== 'textarea' && f.type !== 'object' && f.type !== 'array');
      const textareaFields = editableFields.filter(f => f.type === 'textarea');
      const arrayFields = editableFields.filter(f => f.type === 'array');
      const objectFields = editableFields.filter(f => f.type === 'object');

      // Virtual ref fields
      if (virtualFields.length > 0) {
        html += '<div class="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">';
        html += '<div class="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">';
        html += '<i data-lucide="link-2" class="size-3.5"></i>Ссылки на другие разделы</div>';
        for (const field of virtualFields) {
          html += renderFieldRow(field, row[field.key], section.key, clamped, true);
        }
        html += '</div>';
      }

      // Short fields in 2-column grid
      if (shortFields.length > 0) {
        html += '<div class="grid grid-cols-2 gap-x-6 gap-y-3">';
        for (let i = 0; i < shortFields.length; i += 2) {
          html += renderFieldRow(shortFields[i], row[shortFields[i].key], section.key, clamped, false);
          if (shortFields[i + 1]) {
            html += renderFieldRow(shortFields[i + 1], row[shortFields[i + 1].key], section.key, clamped, false);
          } else {
            html += '<div></div>';
          }
        }
        html += '</div>';
      }

      // Textarea fields
      if (textareaFields.length > 0) {
        html += '<div class="space-y-3">';
        for (const field of textareaFields) {
          html += renderFieldRow(field, row[field.key], section.key, clamped, true);
        }
        html += '</div>';
      }

      // Array fields
      if (arrayFields.length > 0) {
        html += '<div class="space-y-3">';
        for (const field of arrayFields) {
          html += renderFieldRow(field, row[field.key], section.key, clamped, true);
        }
        html += '</div>';
      }

      // Object fields
      if (objectFields.length > 0) {
        html += '<div class="space-y-4">';
        for (const field of objectFields) {
          html += renderFieldRow(field, row[field.key], section.key, clamped, true);
        }
        html += '</div>';
      }

      // Read-only fields (collapsed)
      if (readOnlyFields.length > 0) {
        html += renderReadOnlyBlock(readOnlyFields, row, section.key);
      }

      html += '</div>'; // end space-y-6
    }

    html += '</div>'; // end max-w container
    main.innerHTML = html;
    lucide.createIcons({ nodes: main.querySelectorAll('[data-lucide]') });
    bindMainContentEvents(section.key);
  }

  // ===========================================================================
  //  Render Field Row
  // ===========================================================================

  function renderFieldRow(field, value, sectionKey, rowIndex, fullWidth) {
    const status = getFieldStatus(field, value);
    const hasIssue = status !== 'ok';
    const isAutoFilled = field.autoFilled;
    const formatHint = getFieldFormatHint(field);

    const labelCls = isAutoFilled ? 'text-primary' : hasIssue ? 'text-destructive' : 'text-foreground/80';
    const inputCls = isAutoFilled ? 'is-auto' : hasIssue ? 'has-error' : '';

    let html = '';
    if (fullWidth) {
      html += '<div>';
    } else {
      html += '<div>';
    }

    // Label
    html += '<div class="flex items-center gap-1.5 mb-1">';
    if (hasIssue) html += '<i data-lucide="alert-circle" class="size-3.5 text-destructive shrink-0"></i>';
    html += `<label class="text-xs font-medium ${labelCls}">${esc(field.label)}</label>`;
    if (isAutoFilled) html += '<span class="badge badge-primary-outline" style="font-size:9px;padding:0 0.25rem;height:0.875rem;border-color:color-mix(in oklch, var(--primary) 30%, transparent);">авто</span>';
    if (field.hint) html += `<span class="text-muted-foreground/50 cursor-help" style="font-size:10px;line-height:1;" data-tooltip="${esc(field.hint)}">?</span>`;
    html += '</div>';

    // Input
    if (field.type === 'object' && field.nestedFields) {
      html += renderNestedFieldBlock(field, value, sectionKey, rowIndex);
    } else {
      html += '<div class="mt-0.5">';
      if (status === 'invalid' && formatHint) {
        html += `<div class="field-invalid-tooltip">`;
      }
      html += renderFieldInput(field, value, sectionKey, rowIndex, inputCls);
      if (status === 'invalid' && formatHint) {
        const msg = `Поле «${field.label}» — некорректный формат ввода. Корректный формат: ${formatHint}`;
        html += `<div class="field-invalid-tip"><i data-lucide="alert-circle" class="size-3 inline mr-1" style="vertical-align:middle;"></i>${esc(msg)}</div>`;
        html += `</div>`;
      }
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  // ===========================================================================
  //  Render Field Input
  // ===========================================================================

  function renderFieldInput(field, value, sectionKey, rowIndex, extraCls) {
    const baseCls = `field-input ${extraCls}`;
    const dataAttrs = `data-section="${esc(sectionKey)}" data-row="${rowIndex}" data-field="${esc(field.key)}"`;
    const placeholder = field.placeholder ? esc(field.placeholder) : '';

    switch (field.type) {
      case 'text':
      case 'ref': {
        if (field.type === 'ref') {
          return renderRefSelect(field, value, sectionKey, rowIndex, extraCls);
        }
        return `<input type="text" class="${baseCls}" value="${esc(value || '')}" placeholder="${placeholder}" ${dataAttrs}>`;
      }

      case 'textarea':
        return `<textarea class="field-textarea ${extraCls}" rows="3" placeholder="${placeholder}" ${dataAttrs}>${esc(value || '')}</textarea>`;

      case 'number': {
        const numVal = (value === null || value === undefined) ? '' : String(value);
        return `<input type="number" step="any" class="${baseCls}" value="${esc(numVal)}" placeholder="${placeholder}" ${dataAttrs}>`;
      }

      case 'date': {
        const dateVal = value || '';
        return `<input type="date" class="${baseCls}" value="${esc(dateVal)}" ${dataAttrs}>`;
      }

      case 'boolean': {
        const checked = !!value ? 'checked' : '';
        return `<label class="toggle-switch"><input type="checkbox" ${checked} ${dataAttrs}><span class="toggle-slider"></span></label>`;
      }

      case 'select': {
        let html = `<select class="field-select ${extraCls}" ${dataAttrs}>`;
        html += `<option value="">${field.placeholder ? esc(field.placeholder) : 'Выберите…'}</option>`;
        for (const opt of (field.options || [])) {
          html += `<option value="${esc(opt)}" ${value === opt ? 'selected' : ''}>${esc(opt)}</option>`;
        }
        html += '</select>';
        return html;
      }

      case 'array': {
        const arr = Array.isArray(value) ? value : [];
        return `<input type="text" class="${baseCls}" value="${esc(arr.join(', '))}" placeholder="через запятую" ${dataAttrs}>`;
      }

      default:
        return '<span class="text-muted-foreground text-xs">—</span>';
    }
  }

  // ===========================================================================
  //  Render Ref Select
  // ===========================================================================

  function renderRefSelect(field, value, sectionKey, rowIndex, extraCls) {
    const refSection = field.refSection;
    const refLabelField = field.refLabelField;
    const rows = AppState.data[refSection] || [];

    const options = rows.map((row, idx) => {
      const label = refLabelField ? String(row[refLabelField] || '') : `Запись ${idx + 1}`;
      return { idx, label };
    }).filter(o => o.label);

    const currentIdx = value;
    const currentLabel = currentIdx !== null && currentIdx !== undefined
      ? (options.find(o => o.idx === currentIdx) || {}).label || ''
      : '';

    const isVirtual = field.virtual;
    const cls = extraCls || '';
    const selectCls = isVirtual
      ? `field-select is-auto`
      : `field-select ${cls}`;

    const dataAttrs = `data-section="${esc(sectionKey)}" data-row="${rowIndex}" data-field="${esc(field.key)}" data-type="ref" data-ref-section="${esc(refSection || '')}" data-ref-label="${esc(refLabelField || '')}"`;

    let html = `<select class="${selectCls}" ${dataAttrs}>`;
    html += `<option value="">${field.placeholder ? esc(field.placeholder) : 'Выберите…'}</option>`;
    if (options.length === 0) {
      html += `<option value="" disabled>Нет записей в справочнике</option>`;
    }
    for (const opt of options) {
      html += `<option value="${opt.idx}" ${currentIdx === opt.idx ? 'selected' : ''}>${esc(opt.label)}</option>`;
    }
    html += '</select>';
    return html;
  }

  // ===========================================================================
  //  Render Nested Field Block (object type)
  // ===========================================================================

  function renderNestedFieldBlock(field, value, sectionKey, rowIndex) {
    const objKey = `${sectionKey}:${rowIndex}:${field.key}`;
    const isOpen = AppState.collapsedObject.has(objKey);
    const editableNestedFields = (field.nestedFields || []).filter(nf => !nf.readOnly);

    if (Array.isArray(value)) {
      const items = value;
      const count = items.length;
      const word = count === 1 ? 'запись' : count < 5 ? 'записи' : 'записей';

      let html = `<div class="collapsible-block" data-obj-key="${esc(objKey)}">`;
      html += `<button class="collapsible-header flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors" data-toggle-obj="${esc(objKey)}">`;
      html += `<i data-lucide="${isOpen ? 'chevron-down' : 'chevron-right'}" class="size-3.5"></i>`;
      html += `<span class="badge badge-secondary text-xs">${count} ${word}</span>`;
      html += '<span class="underline">развернуть</span>';
      html += '</button>';

      if (isOpen) {
        html += '<div class="collapsible-content mt-2 border rounded-lg overflow-hidden">';
        // Header
        html += '<div class="grid bg-muted/50 border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">';
        html += '<div class="flex gap-4">';
        html += '<span class="w-8 text-center">#</span>';
        for (const nf of editableNestedFields) {
          html += `<span class="min-w-[120px]">${esc(nf.label)}</span>`;
        }
        html += '<span class="w-7"></span>';
        html += '</div></div>';

        // Rows
        for (let ni = 0; ni < items.length; ni++) {
          html += '<div class="grid border-b border-border last:border-b-0 hover:bg-muted/20 px-3 py-1.5">';
          html += '<div class="flex gap-4 items-center">';
          html += `<span class="w-8 text-center text-xs text-muted-foreground">${ni + 1}</span>`;
          for (const nf of editableNestedFields) {
            html += `<div class="min-w-[120px]">${renderNestedFieldInput(nf, items[ni][nf.key], sectionKey, rowIndex, field.key, ni)}</div>`;
          }
          html += `<div class="w-7"><button class="btn btn-ghost btn-icon" style="width:1.5rem;height:1.5rem;" data-remove-nested="${ni}" data-nested-field="${esc(field.key)}"><i data-lucide="minus" class="size-3 text-muted-foreground hover:text-destructive"></i></button></div>`;
          html += '</div></div>';
        }

        // Add row
        html += '<div class="px-3 py-1.5 border-t border-border">';
        html += `<button class="btn btn-ghost btn-sm h-7 text-xs" data-add-nested="${esc(field.key)}"><i data-lucide="plus" class="size-3 mr-1"></i>Добавить</button>`;
        html += '</div>';

        html += '</div>'; // end collapsible-content
      }

      html += '</div>';
      return html;
    }

    // Single object
    if (field.nestedFields && typeof value === 'object' && value !== null) {
      let html = '<div class="grid grid-cols-2 gap-x-6 gap-y-3">';
      for (const nf of editableNestedFields) {
        html += '<div>';
        html += `<label class="text-xs font-medium text-foreground/80 block mb-1">${esc(nf.label)}</label>`;
        html += renderNestedFieldInput(nf, value[nf.key], sectionKey, rowIndex, field.key, -1);
        html += '</div>';
      }
      html += '</div>';
      return html;
    }

    return '';
  }

  function renderNestedFieldInput(nestedField, value, sectionKey, rowIndex, fieldKey, nestedIndex) {
    const v = value != null ? value : '';
    const dataAttrs = `data-section="${esc(sectionKey)}" data-row="${rowIndex}" data-field="${esc(fieldKey)}" data-nested-index="${nestedIndex}" data-nested-field="${esc(nestedField.key)}" data-type="nested"`;

    switch (nestedField.type) {
      case 'boolean': {
        const checked = !!value ? 'checked' : '';
        return `<label class="toggle-switch" style="width:2rem;height:1rem;"><input type="checkbox" ${checked} ${dataAttrs}><span class="toggle-slider" style="transform:scale(0.75);"></span></label>`;
      }
      case 'number': {
        const numVal = (v === '' || v === null) ? '' : String(v);
        return `<input type="number" step="any" value="${esc(numVal)}" class="field-input h-7 text-xs px-2" ${dataAttrs}>`;
      }
      case 'select': {
        let html = `<select class="field-select h-7 text-xs px-2" ${dataAttrs}>`;
        html += '<option value="">—</option>';
        for (const opt of (nestedField.options || [])) {
          html += `<option value="${esc(opt)}" ${v === opt ? 'selected' : ''}>${esc(opt)}</option>`;
        }
        html += '</select>';
        return html;
      }
      default:
        return `<input type="text" value="${esc(String(v))}" class="field-input h-7 text-xs px-2" ${dataAttrs}>`;
    }
  }

  // ===========================================================================
  //  Render Read-Only Block
  // ===========================================================================

  function renderReadOnlyBlock(fields, row, sectionKey) {
    const hasValues = fields.some(f => row[f.key] !== '' && row[f.key] !== null && row[f.key] !== undefined);
    if (!hasValues) return '';

    const roKey = `${sectionKey}:readonly`;
    const isOpen = AppState.collapsedReadOnly.has(roKey);

    let html = '<div>';
    html += `<button class="collapsible-header flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors" data-toggle-readonly="${esc(roKey)}">`;
    html += `<i data-lucide="${isOpen ? 'chevron-down' : 'chevron-right'}" class="size-3.5"></i>`;
    html += '<span class="font-medium">Системные теги и метаданные</span>';
    html += `<span class="badge badge-outline" style="font-size:9px;padding:0 0.25rem;height:1rem;">${fields.length} полей</span>`;
    if (hasValues && !isOpen) {
      html += `<span class="badge badge-secondary" style="font-size:9px;padding:0 0.25rem;height:1rem;background:color-mix(in oklch, var(--primary) 10%, var(--card));color:var(--primary);border:1px solid color-mix(in oklch, var(--primary) 25%, transparent);">есть данные</span>`;
    }
    html += '</button>';

    if (isOpen) {
      html += '<div class="collapsible-content mt-2 grid grid-cols-3 gap-x-6 gap-y-2 p-3 rounded-lg bg-muted/30 border border-border">';
      for (const f of fields) {
        const val = row[f.key];
        const display = val === null ? 'null' : Array.isArray(val) ? `[${val.length}]` : String(val) || '—';
        html += '<div class="flex items-center justify-between gap-2">';
        html += `<span class="text-xs text-muted-foreground truncate" title="${esc(f.label)}">${esc(f.label)}</span>`;
        html += `<span class="text-xs font-mono text-muted-foreground/70 truncate max-w-[160px]">${esc(display)}</span>`;
        html += '</div>';
      }
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  // ===========================================================================
  //  Render Versions Modal Content
  // ===========================================================================

  function renderVersionsModal() {
    const list = document.getElementById('versions-list');
    if (!list) return;

    if (AppState.versions.length === 0) {
      list.innerHTML = '<div class="py-8 text-center text-muted-foreground text-sm">Нет сохранённых версий</div>';
      return;
    }

    let html = '';
    for (const v of AppState.versions) {
      html += '<div class="version-card flex flex-col gap-2">';
      html += '<div class="flex items-center justify-between">';
      html += '<div class="flex items-center gap-2">';
      html += `<span class="font-medium text-sm">${esc(v.version_label)}</span>`;
      html += `<span class="text-xs text-muted-foreground">${formatTimestamp(v.timestamp)}</span>`;
      html += '</div>';
      html += `<button class="btn btn-outline btn-sm h-7 text-xs gap-1" data-load-version="${v.id}"><i data-lucide="rotate-ccw" class="size-3"></i>Загрузить</button>`;
      html += '</div>';
      html += '<div class="flex items-center gap-2 text-xs text-muted-foreground">';
      html += '<i data-lucide="user" class="size-3"></i>';
      html += `<span>${esc(v.author_name)}${v.author_role ? ' (' + esc(v.author_role) + ')' : ''}</span>`;
      html += '</div>';
      if (v.changed_sections && v.changed_sections.length > 0) {
        html += '<div class="flex flex-wrap gap-1">';
        for (const sec of v.changed_sections) {
          html += `<span class="badge badge-secondary text-xs font-normal">${esc(sec)}</span>`;
        }
        html += '</div>';
      }
      html += '</div>';
    }

    list.innerHTML = html;
    lucide.createIcons({ nodes: list.querySelectorAll('[data-lucide]') });

    // Bind load buttons
    list.querySelectorAll('[data-load-version]').forEach(btn => {
      btn.addEventListener('click', () => {
        loadVersionData(parseInt(btn.dataset.loadVersion));
      });
    });
  }

  // ===========================================================================
  //  Bind Main Content Events
  // ===========================================================================

  function bindMainContentEvents(sectionKey) {
    const main = document.getElementById('main-content');
    if (!main) return;

    // Empty state add button
    const emptyAddBtn = document.getElementById('empty-add-btn');
    if (emptyAddBtn) {
      emptyAddBtn.addEventListener('click', () => {
        addRow(sectionKey);
      });
    }

    // Record tabs
    main.querySelectorAll('[data-rec-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        AppState.activeRecord[sectionKey] = parseInt(btn.dataset.recTab);
        renderMainContent();
      });
    });

    // Add record button
    const addBtn = document.getElementById('add-record-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        addRow(sectionKey);
      });
    }

    // Remove record button
    const removeBtn = document.getElementById('remove-record-btn');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        const recIdx = AppState.activeRecord[sectionKey] || 0;
        removeRow(sectionKey, recIdx);
      });
    }

    // Collapsible object toggles
    main.querySelectorAll('[data-toggle-obj]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.toggleObj;
        if (AppState.collapsedObject.has(key)) {
          AppState.collapsedObject.delete(key);
        } else {
          AppState.collapsedObject.add(key);
        }
        renderMainContent();
      });
    });

    // Collapsible readonly toggles
    main.querySelectorAll('[data-toggle-readonly]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.toggleReadonly;
        if (AppState.collapsedReadOnly.has(key)) {
          AppState.collapsedReadOnly.delete(key);
        } else {
          AppState.collapsedReadOnly.add(key);
        }
        renderMainContent();
      });
    });

    // Add nested row buttons
    main.querySelectorAll('[data-add-nested]').forEach(btn => {
      btn.addEventListener('click', () => {
        const fieldKey = btn.dataset.addNested;
        const recIdx = AppState.activeRecord[sectionKey] || 0;
        addNestedRow(sectionKey, recIdx, fieldKey);
      });
    });

    // Remove nested row buttons
    main.querySelectorAll('[data-remove-nested]').forEach(btn => {
      btn.addEventListener('click', () => {
        const ni = parseInt(btn.dataset.removeNested);
        const fieldKey = btn.dataset.nestedField;
        const recIdx = AppState.activeRecord[sectionKey] || 0;
        removeNestedRow(sectionKey, recIdx, fieldKey, ni);
      });
    });

    // Input change handlers
    main.querySelectorAll('.field-input, .field-textarea, .field-select, input[type="checkbox"]').forEach(input => {
      const handler = (e) => {
        const sk = input.dataset.section;
        const ri = parseInt(input.dataset.row);
        const fk = input.dataset.field;
        const nestedType = input.dataset.type;
        if (!sk || isNaN(ri) || !fk) return;

        // Nested field input
        if (nestedType === 'nested') {
          const ni = parseInt(input.dataset.nestedIndex);
          const nfk = input.dataset.nestedField;
          let val;
          if (input.type === 'checkbox') {
            val = input.checked;
          } else if (input.type === 'number') {
            val = input.value === '' ? null : Number(input.value);
          } else {
            val = input.value;
          }
          updateNestedCell(sk, ri, fk, ni, nfk, val);
          return;
        }

        // Top-level field input
        let val;
        const field = getSectionDef(sk) ? getSectionDef(sk).fields.find(f => f.key === fk) : null;

        if (input.type === 'checkbox') {
          val = input.checked;
        } else if (input.type === 'number' && field && field.type === 'number') {
          val = input.value === '' ? null : Number(input.value);
        } else if (input.type === 'select' || (nestedType === 'ref')) {
          if (input.value === '') {
            val = input.value === '' && field && field.type === 'ref' ? null : input.value;
          } else if (field && (field.type === 'ref' || nestedType === 'ref')) {
            val = Number(input.value);
          } else {
            val = input.value;
          }
        } else if (field && field.type === 'array') {
          const items = input.value.split(',').map(s => s.trim()).filter(Boolean);
          val = items;
        } else {
          val = input.value;
        }

        updateCell(sk, ri, fk, val);
      };

      const evt = input.type === 'checkbox' ? 'change' : 'input';
      input.addEventListener(evt, handler);
    });
  }

  // ===========================================================================
  //  Import Modal Events
  // ===========================================================================

  function bindImportModalEvents() {
    const modal = document.getElementById('import-modal');
    const dropzone = document.getElementById('import-dropzone');
    const fileInput = document.getElementById('import-file-input');
    const cancelBtn = document.getElementById('import-cancel-btn');
    const doBtn = document.getElementById('import-do-btn');

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('import-dropzone-active');
    });
    dropzone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('import-dropzone-active');
    });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('import-dropzone-active');
      handleImportFileSelect(e.dataTransfer.files[0] || null);
    });

    fileInput.addEventListener('change', (e) => {
      handleImportFileSelect(e.target.files[0] || null);
      fileInput.value = '';
    });

    cancelBtn.addEventListener('click', () => {
      closeModal('import-modal');
      resetImportState();
    });

    doBtn.addEventListener('click', () => {
      handleImport();
    });
  }

  // ===========================================================================
  //  Modal backdrop close
  // ===========================================================================

  function bindModalBackdropEvents() {
    ['versions-modal', 'import-modal'].forEach(id => {
      document.getElementById(id).addEventListener('click', (e) => {
        if (e.target === document.getElementById(id)) {
          closeModal(id);
          if (id === 'import-modal') resetImportState();
        }
      });
    });
  }

  // ===========================================================================
  //  Initialization
  // ===========================================================================

  async function init() {
    // Restore author from localStorage
    AppState.author.name = localStorage.getItem('oti_author_name') || '';
    AppState.author.role = localStorage.getItem('oti_author_role') || '';

    await loadSchema();
    await loadData();
    await loadVersions();

    AppState.isLoading = false;
    renderApp();

    bindImportModalEvents();
    bindModalBackdropEvents();
  }

  // Start the application
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
