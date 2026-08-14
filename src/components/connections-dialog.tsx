'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  CheckCircle,
  XCircle,
  Loader2,
  Trash2,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { useConnectionStore } from '@/lib/store-connections';
import type {
  PGConnectionConfig,
  QdrantConfig,
  ConnectionTestResult,
} from '@/lib/types/connection';

// =============================================================================
// Test badge
// =============================================================================

function TestBadge({ result, loading }: { result: ConnectionTestResult | null; loading: boolean }) {
  if (loading) {
    return (
      <Badge variant="outline" className="text-xs gap-1 border-primary/30 text-primary">
        <Loader2 className="size-3 animate-spin" />
        тест…
      </Badge>
    );
  }
  if (!result) return null;

  if (result.ok) {
    return (
      <Badge variant="outline" className="text-xs gap-1 border-emerald-500/40 text-emerald-600 bg-emerald-50">
        <CheckCircle className="size-3" />
        {result.latency} мс
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-xs gap-1 border-destructive/40 text-destructive bg-destructive/5">
      <XCircle className="size-3" />
      ошибка
    </Badge>
  );
}

// =============================================================================
// PG Card
// =============================================================================

const EMPTY_PG: PGConnectionConfig = {
  host: '',
  port: 5432,
  database: '',
  username: '',
  password: '',
  ssl: false,
  graphName: '',
};

function PGCard({ initialConfig }: { initialConfig: PGConnectionConfig | null }) {
  const pgTestResult = useConnectionStore((s) => s.pgTestResult);
  const isTesting = useConnectionStore((s) => s.isTesting);
  const savePGConfig = useConnectionStore((s) => s.savePGConfig);
  const clearPGConfig = useConnectionStore((s) => s.clearPGConfig);
  const testConnection = useConnectionStore((s) => s.testConnection);

  const [form, setForm] = useState<PGConnectionConfig>(initialConfig ?? EMPTY_PG);

  const handleSave = async () => {
    try {
      await savePGConfig(form);
      toast.success('Конфигурация PostgreSQL сохранена');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка сохранения');
    }
  };

  const handleClear = async () => {
    await clearPGConfig();
    setForm(EMPTY_PG);
    toast.success('Конфигурация PostgreSQL очищена');
  };

  const handleTest = async () => {
    try {
      await savePGConfig(form);
    } catch {
      // ignore — test below will catch if config is bad
    }
    const result = await testConnection('postgresql');
    if (result.ok) {
      toast.success(`PostgreSQL подключено (${result.latency} мс)`);
    } else {
      toast.error(result.error || 'Ошибка подключения');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">PostgreSQL 15 + Apache AGE</CardTitle>
          <TestBadge result={pgTestResult} loading={isTesting === 'postgresql'} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Хост</Label>
            <Input
              className="h-8 text-xs"
              value={form.host}
              onChange={(e) => setForm({ ...form, host: e.target.value })}
              placeholder="localhost"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Порт</Label>
            <Input
              className="h-8 text-xs"
              type="number"
              value={form.port}
              onChange={(e) => setForm({ ...form, port: Number(e.target.value) || 5432 })}
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">База данных</Label>
          <Input
            className="h-8 text-xs"
            value={form.database}
            onChange={(e) => setForm({ ...form, database: e.target.value })}
            placeholder="my_database"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Пользователь</Label>
          <Input
            className="h-8 text-xs"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Пароль</Label>
          <Input
            className="h-8 text-xs"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">SSL</Label>
            <div className="flex items-center h-8">
              <Switch
                checked={form.ssl}
                onCheckedChange={(checked) => setForm({ ...form, ssl: checked })}
              />
              <span className="ml-2 text-xs text-muted-foreground">{form.ssl ? 'Включено' : 'Выключено'}</span>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Граф (AGE)</Label>
            <Input
              className="h-8 text-xs"
              value={form.graphName}
              onChange={(e) => setForm({ ...form, graphName: e.target.value })}
              placeholder="my_graph"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3 flex gap-2">
        <Button size="sm" className="h-8 text-xs" onClick={handleTest}>
          Тест подключения
        </Button>
        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={handleSave}>
          Сохранить
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 text-xs text-muted-foreground hover:text-destructive"
          onClick={handleClear}
        >
          <Trash2 className="size-3 mr-1" />
          Очистить
        </Button>
      </CardFooter>
    </Card>
  );
}

// =============================================================================
// Qdrant Card
// =============================================================================

const EMPTY_QDRANT: QdrantConfig = {
  url: '',
  apiKey: '',
  collection: '',
};

function QdrantCard({ initialConfig }: { initialConfig: QdrantConfig | null }) {
  const qdrantTestResult = useConnectionStore((s) => s.qdrantTestResult);
  const isTesting = useConnectionStore((s) => s.isTesting);
  const saveQdrantConfig = useConnectionStore((s) => s.saveQdrantConfig);
  const clearQdrantConfig = useConnectionStore((s) => s.clearQdrantConfig);
  const testConnection = useConnectionStore((s) => s.testConnection);

  const [form, setForm] = useState<QdrantConfig>(initialConfig ?? EMPTY_QDRANT);

  const handleSave = async () => {
    try {
      await saveQdrantConfig(form);
      toast.success('Конфигурация Qdrant сохранена');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка сохранения');
    }
  };

  const handleClear = async () => {
    await clearQdrantConfig();
    setForm(EMPTY_QDRANT);
    toast.success('Конфигурация Qdrant очищена');
  };

  const handleTest = async () => {
    try {
      await saveQdrantConfig(form);
    } catch {
      // ignore
    }
    const result = await testConnection('qdrant');
    if (result.ok) {
      toast.success(`Qdrant подключено (${result.latency} мс)`);
    } else {
      toast.error(result.error || 'Ошибка подключения');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Qdrant</CardTitle>
          <TestBadge result={qdrantTestResult} loading={isTesting === 'qdrant'} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <Label className="text-xs">URL</Label>
          <Input
            className="h-8 text-xs"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="http://localhost:6333"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">API ключ</Label>
          <Input
            className="h-8 text-xs"
            type="password"
            value={form.apiKey}
            onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Коллекция</Label>
          <Input
            className="h-8 text-xs"
            value={form.collection}
            onChange={(e) => setForm({ ...form, collection: e.target.value })}
            placeholder="my_collection"
          />
        </div>
      </CardContent>
      <CardFooter className="pt-3 flex gap-2">
        <Button size="sm" className="h-8 text-xs" onClick={handleTest}>
          Тест подключения
        </Button>
        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={handleSave}>
          Сохранить
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 text-xs text-muted-foreground hover:text-destructive"
          onClick={handleClear}
        >
          <Trash2 className="size-3 mr-1" />
          Очистить
        </Button>
      </CardFooter>
    </Card>
  );
}

// =============================================================================
// Main Dialog
// =============================================================================

export function ConnectionsDialog() {
  const dialogOpen = useConnectionStore((s) => s.dialogOpen);
  const closeDialog = useConnectionStore((s) => s.closeDialog);
  const pgConfig = useConnectionStore((s) => s.pgConfig);
  const qdrantConfig = useConnectionStore((s) => s.qdrantConfig);

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Подключение к базам данных</DialogTitle>
          <DialogDescription>
            Только чтение. Используется для автозаполнения полей.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <PGCard initialConfig={pgConfig} />
          <Separator />
          <QdrantCard initialConfig={qdrantConfig} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
