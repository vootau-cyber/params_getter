'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import {
  Database,
  Plus,
  Trash2,
  Settings,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  XCircle,
  Loader2,
  Table2,
  Search,
  RefreshCw,
  ArrowRight,
  Upload,
  AlertCircle,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';

import { useConnectionStore } from '@/lib/store-connections';
import { useStore } from '@/lib/store';
import type {
  SQLConnectionConfig,
  QdrantConnectionConfig,
  ConnectionTestResult,
} from '@/lib/types/connection';
import { SCHEMA_SECTIONS } from '@/lib/schema';

// =============================================================================
// Helper: test status icon
// =============================================================================

function TestStatusIcon({ result }: { result: ConnectionTestResult | undefined }) {
  if (!result) return null;
  if (result.ok) {
    return <CheckCircle className="size-3.5 text-emerald-500 shrink-0" />;
  }
  if (result.error && result.error === 'Тестирование…') {
    return <Loader2 className="size-3.5 animate-spin text-muted-foreground shrink-0" />;
  }
  return <XCircle className="size-3.5 text-destructive shrink-0" />;
}

// =============================================================================
// SQL Connection Form
// =============================================================================

interface SQLFormData {
  name: string;
  dbType: 'postgresql' | 'mysql';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
}

function emptySQLForm(): SQLFormData {
  return {
    name: '',
    dbType: 'postgresql',
    host: 'localhost',
    port: 5432,
    database: '',
    username: '',
    password: '',
    ssl: false,
  };
}

function SQLConnectionForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial?: SQLConnectionConfig;
  onSave: (data: SQLFormData) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<SQLFormData>(
    initial
      ? {
          name: initial.name,
          dbType: initial.type,
          host: initial.host,
          port: initial.port,
          database: initial.database,
          username: initial.username,
          password: initial.password,
          ssl: initial.ssl,
        }
      : emptySQLForm(),
  );

  const setField = <K extends keyof SQLFormData>(key: K, value: SQLFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Название</Label>
          <Input
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="Мой PostgreSQL"
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Тип БД</Label>
          <Select
            value={form.dbType}
            onValueChange={(v) => {
              setField('dbType', v as 'postgresql' | 'mysql');
              setField('port', v === 'mysql' ? 3306 : 5432);
            }}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="postgresql">PostgreSQL</SelectItem>
              <SelectItem value="mysql">MySQL</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-1.5">
          <Label className="text-xs">Хост</Label>
          <Input
            value={form.host}
            onChange={(e) => setField('host', e.target.value)}
            placeholder="localhost"
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Порт</Label>
          <Input
            type="number"
            value={form.port}
            onChange={(e) => setField('port', Number(e.target.value))}
            className="h-8 text-sm"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">База данных</Label>
        <Input
          value={form.database}
          onChange={(e) => setField('database', e.target.value)}
          placeholder="mydb"
          className="h-8 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Пользователь</Label>
          <Input
            value={form.username}
            onChange={(e) => setField('username', e.target.value)}
            placeholder="postgres"
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Пароль</Label>
          <Input
            type="password"
            value={form.password}
            onChange={(e) => setField('password', e.target.value)}
            placeholder="••••••"
            className="h-8 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={form.ssl}
          onCheckedChange={(v) => setField('ssl', v)}
        />
        <Label className="text-xs">SSL</Label>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Отмена
        </Button>
        <Button
          size="sm"
          onClick={() => {
            if (!form.name || !form.host || !form.database || !form.username) {
              toast.error('Заполните обязательные поля');
              return;
            }
            onSave(form);
          }}
          disabled={saving}
        >
          {saving && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
          Сохранить
        </Button>
      </div>
    </div>
  );
}

// =============================================================================
// Qdrant Connection Form
// =============================================================================

interface QdrantFormData {
  name: string;
  url: string;
  apiKey: string;
  collection: string;
}

function emptyQdrantForm(): QdrantFormData {
  return {
    name: '',
    url: 'http://localhost:6333',
    apiKey: '',
    collection: '',
  };
}

function QdrantConnectionForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial?: QdrantConnectionConfig;
  onSave: (data: QdrantFormData) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<QdrantFormData>(
    initial
      ? {
          name: initial.name,
          url: initial.url,
          apiKey: initial.apiKey,
          collection: initial.collection,
        }
      : emptyQdrantForm(),
  );

  const setField = <K extends keyof QdrantFormData>(key: K, value: QdrantFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs">Название</Label>
        <Input
          value={form.name}
          onChange={(e) => setField('name', e.target.value)}
          placeholder="Мой Qdrant"
          className="h-8 text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">URL</Label>
        <Input
          value={form.url}
          onChange={(e) => setField('url', e.target.value)}
          placeholder="http://localhost:6333"
          className="h-8 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">API-ключ</Label>
          <Input
            type="password"
            value={form.apiKey}
            onChange={(e) => setField('apiKey', e.target.value)}
            placeholder="••••••"
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Коллекция</Label>
          <Input
            value={form.collection}
            onChange={(e) => setField('collection', e.target.value)}
            placeholder="documents"
            className="h-8 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Отмена
        </Button>
        <Button
          size="sm"
          onClick={() => {
            if (!form.name || !form.url) {
              toast.error('Заполните обязательные поля');
              return;
            }
            onSave(form);
          }}
          disabled={saving}
        >
          {saving && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
          Сохранить
        </Button>
      </div>
    </div>
  );
}

// =============================================================================
// SQL Table Data Grid (inline)
// =============================================================================

function SQLTableDataGrid({
  tableData,
  loading,
  onLoadPage,
  tableName,
  onBack,
  onImport,
}: {
  tableData: { columns: string[]; rows: Record<string, unknown>[]; total_count: number } | null;
  loading: boolean;
  onLoadPage: (offset: number) => void;
  tableName: string;
  onBack: () => void;
  onImport: () => void;
}) {
  const [offset, setOffset] = useState(0);
  const pageSize = 50;

  const handlePrev = () => {
    const newOffset = Math.max(0, offset - pageSize);
    setOffset(newOffset);
    onLoadPage(newOffset);
  };

  const handleNext = () => {
    if (!tableData) return;
    const newOffset = offset + pageSize;
    if (newOffset < tableData.total_count) {
      setOffset(newOffset);
      onLoadPage(newOffset);
    }
  };

  return (
    <div className="space-y-3">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={onBack}>
          <ChevronRight className="size-3 rotate-180 mr-1" />
          Таблицы
        </Button>
        <ChevronRight className="size-3 text-muted-foreground" />
        <span className="font-medium">{tableName}</span>
        <Badge variant="outline" className="text-xs ml-2">
          {tableData?.total_count ?? 0} строк
        </Badge>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : tableData && tableData.columns.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground w-10">
                    #
                  </th>
                  {tableData.columns.map((col) => (
                    <th
                      key={col}
                      className="text-left px-3 py-2 font-medium text-muted-foreground whitespace-nowrap max-w-[200px] truncate"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-3 py-1.5 text-muted-foreground">{offset + idx + 1}</td>
                    {tableData.columns.map((col) => (
                      <td key={col} className="px-3 py-1.5 whitespace-nowrap max-w-[200px] truncate">
                        {row[col] !== null && row[col] !== undefined
                          ? String(row[col])
                          : '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
          Нет данных
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          disabled={offset === 0}
          onClick={handlePrev}
        >
          ← Назад
        </Button>
        <span className="text-xs text-muted-foreground">
          {offset + 1}–{Math.min(offset + pageSize, tableData?.total_count ?? 0)} из{' '}
          {tableData?.total_count ?? 0}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          disabled={!tableData || offset + pageSize >= tableData.total_count}
          onClick={handleNext}
        >
          Далее →
        </Button>
      </div>

      {/* Import button */}
      <Separator />
      <div className="flex items-center justify-end">
        <Button variant="outline" size="sm" onClick={onImport}>
          <Upload className="size-3.5 mr-1.5" />
          Импортировать в раздел
        </Button>
      </div>
    </div>
  );
}

// =============================================================================
// SQL Import Form
// =============================================================================

function SQLImportForm({
  tableName,
  columns,
  onImport,
  onCancel,
  importing,
}: {
  tableName: string;
  columns: string[];
  onImport: (sectionKey: string, mapping: Record<string, string>) => void;
  onCancel: () => void;
  importing: boolean;
}) {
  // Compute initial auto-map and best section key synchronously
  const [initialState] = useState(() => {
    const initialMapping: Record<string, string> = {};
    const sectionCounts: Record<string, number> = {};
    for (const col of columns) {
      const allFields = SCHEMA_SECTIONS.flatMap((s) => s.fields);
      const match = allFields.find(
        (f) => f.key.toLowerCase() === col.toLowerCase(),
      );
      if (match) {
        initialMapping[col] = match.key;
        for (const section of SCHEMA_SECTIONS) {
          if (section.fields.some((f) => f.key === match.key)) {
            sectionCounts[section.key] = (sectionCounts[section.key] || 0) + 1;
          }
        }
      }
    }
    const best = Object.entries(sectionCounts).sort((a, b) => b[1] - a[1])[0];
    return { mapping: initialMapping, sectionKey: best ? best[0] : '' };
  });

  const [sectionKey, setSectionKey] = useState(initialState.sectionKey);
  const [mapping, setMapping] = useState<Record<string, string>>(initialState.mapping);

  const selectedSection = useMemo(
    () => SCHEMA_SECTIONS.find((s) => s.key === sectionKey),
    [sectionKey],
  );

  const editableFields = useMemo(
    () => (selectedSection?.fields || []).filter((f) => !f.virtual && !f.readOnly),
    [selectedSection],
  );

  const handleImport = () => {
    if (!sectionKey) {
      toast.error('Выберите целевой раздел');
      return;
    }
    // Filter out unmapped columns
    const cleanMapping: Record<string, string> = {};
    for (const [col, field] of Object.entries(mapping)) {
      if (field) cleanMapping[col] = field;
    }
    if (Object.keys(cleanMapping).length === 0) {
      toast.error('Настройте хотя бы одно соответствие полей');
      return;
    }
    onImport(sectionKey, cleanMapping);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Upload className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">
          Импорт: {tableName}
        </h3>
      </div>

      {/* Target section */}
      <div className="space-y-1.5">
        <Label className="text-xs">Целевой раздел</Label>
        <Select value={sectionKey} onValueChange={setSectionKey}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="Выберите раздел…" />
          </SelectTrigger>
          <SelectContent>
            {SCHEMA_SECTIONS.map((s) => (
              <SelectItem key={s.key} value={s.key}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Field mapping */}
      {selectedSection && (
        <div className="space-y-1.5">
          <Label className="text-xs">Соответствие полей</Label>
          <div className="border rounded-md max-h-64 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="text-left px-3 py-1.5 font-medium text-muted-foreground">
                    Столбец SQL
                  </th>
                  <th className="text-left px-3 py-1.5 font-medium text-muted-foreground">
                    <ArrowRight className="size-3 inline-block mr-1" />
                    Поле раздела
                  </th>
                </tr>
              </thead>
              <tbody>
                {columns.map((col) => (
                  <tr key={col} className="border-t border-border/50">
                    <td className="px-3 py-1.5 font-mono">{col}</td>
                    <td className="px-3 py-1.5">
                      <Select
                        value={mapping[col] || ''}
                        onValueChange={(v) =>
                          setMapping((prev) => ({ ...prev, [col]: v }))
                        }
                      >
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue placeholder="— не сопоставлено —" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">— не сопоставлено —</SelectItem>
                          {editableFields.map((f) => (
                            <SelectItem key={f.key} value={f.key}>
                              {f.label} ({f.key})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Отмена
        </Button>
        <Button size="sm" onClick={handleImport} disabled={importing}>
          {importing && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
          Импортировать
        </Button>
      </div>
    </div>
  );
}

// =============================================================================
// SQL Tab Content
// =============================================================================

function SQLTabContent() {
  const sqlConnections = useConnectionStore((s) => s.sqlConnections);
  const testResults = useConnectionStore((s) => s.testResults);
  const activeSQLId = useConnectionStore((s) => s.activeSQLId);
  const sqlTables = useConnectionStore((s) => s.sqlTables);
  const sqlTablesLoading = useConnectionStore((s) => s.sqlTablesLoading);
  const activeSQLTable = useConnectionStore((s) => s.activeSQLTable);
  const sqlTableData = useConnectionStore((s) => s.sqlTableData);
  const sqlTableLoading = useConnectionStore((s) => s.sqlTableLoading);

  const setActiveSQL = useConnectionStore((s) => s.setActiveSQL);
  const addConnection = useConnectionStore((s) => s.addConnection);
  const updateConnection = useConnectionStore((s) => s.updateConnection);
  const deleteConnection = useConnectionStore((s) => s.deleteConnection);
  const testConnection = useConnectionStore((s) => s.testConnection);
  const setActiveSQLTable = useConnectionStore((s) => s.setActiveSQLTable);
  const loadSQLTableData = useConnectionStore((s) => s.loadSQLTableData);
  const importSQLData = useConnectionStore((s) => s.importSQLData);
  const loadData = useStore((s) => s.loadData);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);
  const [importing, setImporting] = useState(false);

  const activeConn = useMemo(
    () => sqlConnections.find((c) => c.id === activeSQLId),
    [sqlConnections, activeSQLId],
  );

  const handleAdd = async (data: SQLFormData) => {
    setSaving(true);
    try {
      await addConnection('sql', {
        name: data.name,
        dbType: data.dbType,
        host: data.host,
        port: data.port,
        database: data.database,
        username: data.username,
        password: data.password,
        ssl: data.ssl,
      });
      setShowForm(false);
      toast.success('Подключение создано');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (data: SQLFormData) => {
    if (!editingId) return;
    setSaving(true);
    try {
      await updateConnection(editingId, {
        name: data.name,
        dbType: data.dbType,
        host: data.host,
        port: data.port,
        database: data.database,
        username: data.username,
        password: data.password,
        ssl: data.ssl,
      });
      setEditingId(null);
      toast.success('Подключение обновлено');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить это подключение?')) return;
    try {
      await deleteConnection(id);
      toast.success('Подключение удалено');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка');
    }
  };

  const handleImport = async (sectionKey: string, mapping: Record<string, string>) => {
    if (!activeSQLId || !activeSQLTable) return;
    setImporting(true);
    try {
      const result = await importSQLData(activeSQLId, activeSQLTable, sectionKey, mapping);
      if (result.success) {
        toast.success(`Импортировано ${result.imported} записей`);
        setShowImportForm(false);
        await loadData();
      } else {
        toast.error(result.error || 'Ошибка импорта');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="flex gap-4 min-h-0">
      {/* LEFT: Connection list */}
      <div className="w-80 shrink-0 space-y-3 overflow-y-auto">
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={() => {
            setEditingId(null);
            setShowForm(true);
          }}
        >
          <Plus className="size-3.5 mr-1.5" />
          Добавить подключение
        </Button>

        {showForm && !editingId && (
          <Card>
            <CardContent className="p-3">
              <SQLConnectionForm
                onSave={handleAdd}
                onCancel={() => setShowForm(false)}
                saving={saving}
              />
            </CardContent>
          </Card>
        )}

        {sqlConnections.length === 0 && !showForm && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-sm">
            <Database className="size-8 mb-2 opacity-50" />
            <span>Нет подключений</span>
          </div>
        )}

        {sqlConnections.map((conn) => (
          <div key={conn.id}>
            {editingId === conn.id ? (
              <Card>
                <CardContent className="p-3">
                  <SQLConnectionForm
                    initial={conn}
                    onSave={handleUpdate}
                    onCancel={() => setEditingId(null)}
                    saving={saving}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card
                className={`cursor-pointer transition-colors ${
                  activeSQLId === conn.id
                    ? 'border-primary ring-1 ring-primary/20'
                    : 'hover:border-primary/30'
                }`}
                onClick={() => setActiveSQL(conn.id)}
              >
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{conn.name}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <TestStatusIcon result={testResults[conn.id]} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {conn.type === 'postgresql' ? 'PostgreSQL' : 'MySQL'}
                    </Badge>
                    <span className="text-xs text-muted-foreground truncate">
                      {conn.host}:{conn.port}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        testConnection(conn.id);
                      }}
                    >
                      <Settings className="size-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(conn.id);
                        setShowForm(false);
                      }}
                    >
                      <Settings className="size-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(conn.id);
                      }}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>

      {/* RIGHT: Browser */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {!activeSQLId && (
          <div className="flex flex-col items-center justify-center h-full py-20 text-muted-foreground text-sm">
            <Database className="size-10 mb-3 opacity-40" />
            <span>Выберите подключение слева</span>
          </div>
        )}

        {activeSQLId && !activeSQLTable && !showImportForm && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">Таблицы</h3>
              <Badge variant="outline" className="text-xs">
                {sqlTables.length}
              </Badge>
              {activeConn && (
                <span className="text-xs text-muted-foreground ml-auto truncate">
                  {activeConn.database}
                </span>
              )}
            </div>

            {sqlTablesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : sqlTables.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-sm">
                <Table2 className="size-8 mb-2 opacity-50" />
                <span>Нет таблиц</span>
              </div>
            ) : (
              <div className="border rounded-md divide-y">
                {sqlTables.map((t) => (
                  <div
                    key={t.table_name}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => setActiveSQLTable(t.table_name)}
                  >
                    <Table2 className="size-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium">{t.table_name}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {t.column_count} столбцов
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t.row_count.toLocaleString('ru-RU')} строк
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 text-[10px] px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSQLTable(t.table_name);
                          // Load data first then show import form
                          loadSQLTableData(activeSQLId, t.table_name, 50, 0).then(() => {
                            setShowImportForm(true);
                          });
                        }}
                      >
                        <Upload className="size-3 mr-1" />
                        Импортировать
                      </Button>
                      <ChevronRight className="size-3.5 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSQLId && activeSQLTable && showImportForm && sqlTableData && (
          <SQLImportForm
            tableName={activeSQLTable}
            columns={sqlTableData.columns}
            onImport={handleImport}
            onCancel={() => setShowImportForm(false)}
            importing={importing}
          />
        )}

        {activeSQLId && activeSQLTable && !showImportForm && (
          <SQLTableDataGrid
            tableData={sqlTableData}
            loading={sqlTableLoading}
            onLoadPage={(newOffset) => {
              if (activeSQLId && activeSQLTable) {
                loadSQLTableData(activeSQLId, activeSQLTable, 50, newOffset);
              }
            }}
            tableName={activeSQLTable}
            onBack={() => setActiveSQLTable(null)}
            onImport={() => setShowImportForm(true)}
          />
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Qdrant Tab Content
// =============================================================================

function QdrantTabContent() {
  const qdrantConnections = useConnectionStore((s) => s.qdrantConnections);
  const testResults = useConnectionStore((s) => s.testResults);
  const activeQdrantId = useConnectionStore((s) => s.activeQdrantId);
  const qdrantCollections = useConnectionStore((s) => s.qdrantCollections);
  const qdrantCollectionsLoading = useConnectionStore((s) => s.qdrantCollectionsLoading);
  const qdrantSearchResults = useConnectionStore((s) => s.qdrantSearchResults);
  const qdrantSearchLoading = useConnectionStore((s) => s.qdrantSearchLoading);

  const setActiveQdrant = useConnectionStore((s) => s.setActiveQdrant);
  const addConnection = useConnectionStore((s) => s.addConnection);
  const updateConnection = useConnectionStore((s) => s.updateConnection);
  const deleteConnection = useConnectionStore((s) => s.deleteConnection);
  const testConnection = useConnectionStore((s) => s.testConnection);
  const loadQdrantCollections = useConnectionStore((s) => s.loadQdrantCollections);
  const searchQdrant = useConnectionStore((s) => s.searchQdrant);
  const syncQdrantTags = useConnectionStore((s) => s.syncQdrantTags);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  // Search form state
  const [searchVector, setSearchVector] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCollection, setSearchCollection] = useState('');

  const activeConn = useMemo(
    () => qdrantConnections.find((c) => c.id === activeQdrantId),
    [qdrantConnections, activeQdrantId],
  );

  const handleAdd = async (data: QdrantFormData) => {
    setSaving(true);
    try {
      await addConnection('qdrant', {
        name: data.name,
        url: data.url,
        apiKey: data.apiKey,
        collection: data.collection,
      });
      setShowForm(false);
      toast.success('Подключение создано');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (data: QdrantFormData) => {
    if (!editingId) return;
    setSaving(true);
    try {
      await updateConnection(editingId, {
        name: data.name,
        url: data.url,
        apiKey: data.apiKey,
        collection: data.collection,
      });
      setEditingId(null);
      toast.success('Подключение обновлено');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить это подключение?')) return;
    try {
      await deleteConnection(id);
      toast.success('Подключение удалено');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка');
    }
  };

  const handleSearch = async () => {
    if (!activeQdrantId) return;

    // If text query provided, try that first
    if (searchQuery.trim()) {
      const result = await searchQdrant(activeQdrantId, {
        collection: searchCollection || undefined,
        query: searchQuery.trim(),
        limit: 10,
      });
      if (result.message) {
        toast.info(result.message);
      }
      if (result.error) {
        toast.error(result.error);
      }
      return;
    }

    // Parse vector input
    const vector = searchVector
      .split(',')
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n));
    if (vector.length === 0) {
      toast.error('Введите вектор или текстовый запрос');
      return;
    }

    const result = await searchQdrant(activeQdrantId, {
      collection: searchCollection || undefined,
      vector,
      limit: 10,
    });
    if (result.error) {
      toast.error(result.error);
    }
  };

  const handleSync = async () => {
    if (!activeQdrantId) return;
    setSyncing(true);
    setSyncResult(null);
    try {
      const result = await syncQdrantTags(activeQdrantId);
      if (result.success) {
        setSyncResult(result.message || 'Синхронизация завершена');
        toast.info(result.message || 'Синхронизация завершена');
      } else {
        toast.error(result.error || 'Ошибка');
      }
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex gap-4 min-h-0">
      {/* LEFT: Connection list */}
      <div className="w-80 shrink-0 space-y-3 overflow-y-auto">
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={() => {
            setEditingId(null);
            setShowForm(true);
          }}
        >
          <Plus className="size-3.5 mr-1.5" />
          Добавить подключение
        </Button>

        {showForm && !editingId && (
          <Card>
            <CardContent className="p-3">
              <QdrantConnectionForm
                onSave={handleAdd}
                onCancel={() => setShowForm(false)}
                saving={saving}
              />
            </CardContent>
          </Card>
        )}

        {qdrantConnections.length === 0 && !showForm && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-sm">
            <Search className="size-8 mb-2 opacity-50" />
            <span>Нет подключений</span>
          </div>
        )}

        {qdrantConnections.map((conn) => (
          <div key={conn.id}>
            {editingId === conn.id ? (
              <Card>
                <CardContent className="p-3">
                  <QdrantConnectionForm
                    initial={conn}
                    onSave={handleUpdate}
                    onCancel={() => setEditingId(null)}
                    saving={saving}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card
                className={`cursor-pointer transition-colors ${
                  activeQdrantId === conn.id
                    ? 'border-primary ring-1 ring-primary/20'
                    : 'hover:border-primary/30'
                }`}
                onClick={() => setActiveQdrant(conn.id)}
              >
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{conn.name}</span>
                    <TestStatusIcon result={testResults[conn.id]} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground truncate">{conn.url}</span>
                  </div>
                  {conn.collection && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Коллекция:</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {conn.collection}
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-center gap-1 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        testConnection(conn.id);
                      }}
                    >
                      <Settings className="size-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(conn.id);
                        setShowForm(false);
                      }}
                    >
                      <Settings className="size-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(conn.id);
                      }}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>

      {/* RIGHT: Browser */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {!activeQdrantId && (
          <div className="flex flex-col items-center justify-center h-full py-20 text-muted-foreground text-sm">
            <Search className="size-10 mb-3 opacity-40" />
            <span>Выберите подключение слева</span>
          </div>
        )}

        {activeQdrantId && (
          <div className="space-y-4">
            {/* Collections */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Коллекции</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 ml-auto"
                  onClick={() => loadQdrantCollections(activeQdrantId)}
                >
                  <RefreshCw className="size-3.5" />
                </Button>
              </div>

              {qdrantCollectionsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : qdrantCollections.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">
                  Нет коллекций
                </div>
              ) : (
                <div className="border rounded-md divide-y">
                  {qdrantCollections.map((col) => (
                    <div key={col.name} className="flex items-center gap-3 px-4 py-2.5">
                      <Database className="size-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium">{col.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {col.points_count.toLocaleString('ru-RU')} точек
                        </span>
                        <Badge
                          variant={col.status === 'green' ? 'default' : 'secondary'}
                          className="text-[10px] px-1.5 py-0"
                        >
                          {col.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Search */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Поиск</h3>

              <div className="space-y-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Коллекция</Label>
                  <Input
                    value={searchCollection}
                    onChange={(e) => setSearchCollection(e.target.value)}
                    placeholder={activeConn?.collection || 'Название коллекции'}
                    className="h-8 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Вектор (через запятую)</Label>
                  <Input
                    value={searchVector}
                    onChange={(e) => setSearchVector(e.target.value)}
                    placeholder="0.1, 0.2, 0.3, ..."
                    className="h-8 text-sm font-mono"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-x-0 top-1/2 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-background px-2 text-xs text-muted-foreground">
                      или
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Текстовый запрос</Label>
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск по тексту (требуется embedding-сервис)"
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              <Button size="sm" onClick={handleSearch} disabled={qdrantSearchLoading}>
                {qdrantSearchLoading ? (
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                ) : (
                  <Search className="size-3.5 mr-1.5" />
                )}
                Искать
              </Button>
            </div>

            {/* Search results */}
            {qdrantSearchResults.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">
                  Результаты ({qdrantSearchResults.length})
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {qdrantSearchResults.map((r) => (
                    <Card key={r.id}>
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="text-xs">
                            {r.score.toFixed(4)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">ID: {r.id}</span>
                        </div>
                        <div className="space-y-1">
                          {Object.entries(r.payload).map(([key, value]) => (
                            <div key={key} className="flex items-start gap-2 text-xs">
                              <span className="font-medium text-muted-foreground shrink-0">
                                {key}:
                              </span>
                              <span className="truncate">
                                {typeof value === 'object'
                                  ? JSON.stringify(value)
                                  : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Sync */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Синхронизация</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={syncing}
              >
                {syncing ? (
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                ) : (
                  <RefreshCw className="size-3.5 mr-1.5" />
                )}
                Синхронизировать теги
              </Button>
              {syncResult && (
                <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-md text-xs">
                  <AlertCircle className="size-3.5 shrink-0 mt-0.5 text-muted-foreground" />
                  <span className="text-muted-foreground whitespace-pre-wrap">{syncResult}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Main Exported Component
// =============================================================================

export function ConnectionsDialog() {
  const dialogOpen = useConnectionStore((s) => s.dialogOpen);
  const dialogTab = useConnectionStore((s) => s.dialogTab);
  const closeDialog = useConnectionStore((s) => s.closeDialog);
  const loadConnections = useConnectionStore((s) => s.loadConnections);

  // Load connections when dialog opens
  useEffect(() => {
    if (dialogOpen) {
      loadConnections();
    }
  }, [dialogOpen, loadConnections]);

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Database className="size-5 text-primary" />
            Базы знаний
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 pt-4">
          <Tabs value={dialogTab} onValueChange={(v) => useConnectionStore.getState().dialogTab = v as 'sql' | 'qdrant'}>
            <TabsList className="mb-4">
              <TabsTrigger value="sql" className="gap-1.5">
                <Database className="size-3.5" />
                SQL
              </TabsTrigger>
              <TabsTrigger value="qdrant" className="gap-1.5">
                <Search className="size-3.5" />
                Qdrant
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sql" className="mt-0">
              <SQLTabContent />
            </TabsContent>

            <TabsContent value="qdrant" className="mt-0">
              <QdrantTabContent />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
