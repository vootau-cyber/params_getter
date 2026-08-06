'use client';

import React, { useState, useMemo } from 'react';
import type { SectionDef, FieldDef } from '@/lib/schema';
import { useStore } from '@/lib/store';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Plus,
  Trash2,
  Minus,
  Link2,
  ChevronDown,
  ChevronRight,
  FileText,
  Copy,
} from 'lucide-react';

// =============================================================================
// SectionTable — Vertical card-per-record layout (desktop-only)
// =============================================================================

interface SectionTableProps {
  section: SectionDef;
}

export function SectionTable({ section }: SectionTableProps) {
  const data = useStore((s) => s.data[section.key] || []);
  const addRow = useStore((s) => s.addRow);
  const removeRow = useStore((s) => s.removeRow);
  const [activeRecord, setActiveRecord] = useState(0);

  // Clamp activeRecord when data changes
  const clampedRecord = data.length > 0 ? Math.min(activeRecord, data.length - 1) : 0;

  // If activeRecord was clamped, update
  React.useEffect(() => {
    if (clampedRecord !== activeRecord) {
      setActiveRecord(clampedRecord);
    }
  }, [clampedRecord, activeRecord]);

  const editableFields = section.fields.filter((f) => !f.readOnly);
  const readOnlyFields = section.fields.filter((f) => f.readOnly);
  const row = data.length > 0 ? (data[clampedRecord] as Record<string, unknown>) : null;

  // Empty state
  if (data.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileText className="size-7 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-sm mb-4">
          Нет данных. Добавьте запись для начала.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            addRow(section.key);
            setActiveRecord(0);
          }}
        >
          <Plus className="mr-2 size-4" />
          Добавить запись
        </Button>
      </div>
    );
  }

  // Classify fields for layout
  const shortFields = editableFields.filter(
    (f) =>
      !f.virtual &&
      f.type !== 'textarea' &&
      f.type !== 'object' &&
      f.type !== 'array',
  );
  const virtualFields = editableFields.filter((f) => f.virtual);
  const textareaFields = editableFields.filter((f) => f.type === 'textarea');
  const arrayFields = editableFields.filter((f) => f.type === 'array');
  const objectFields = editableFields.filter((f) => f.type === 'object');

  // Split short fields into pairs for 2-column grid
  const fieldPairs: (FieldDef | null)[][] = [];
  for (let i = 0; i < shortFields.length; i += 2) {
    fieldPairs.push([shortFields[i], shortFields[i + 1] ?? null]);
  }

  return (
    <div className="space-y-4">
      {/* ── Record Tabs ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b pb-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          {data.map((_, idx) => (
            <Button
              key={idx}
              variant={idx === clampedRecord ? 'default' : 'outline'}
              size="sm"
              className="shrink-0 h-8 px-3 text-xs"
              onClick={() => setActiveRecord(idx)}
            >
              Запись {idx + 1}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 h-8 text-xs"
          onClick={() => {
            addRow(section.key);
            // New record is at the end, switch to it
            setTimeout(() => setActiveRecord(data.length), 0);
          }}
        >
          <Plus className="mr-1 size-3.5" />
          Добавить
        </Button>
        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs text-destructive hover:text-destructive"
            onClick={() => {
              removeRow(section.key, clampedRecord);
              if (clampedRecord >= data.length - 1 && clampedRecord > 0) {
                setActiveRecord(clampedRecord - 1);
              }
            }}
          >
            <Trash2 className="mr-1 size-3.5" />
            Удалить
          </Button>
        </div>
      </div>

      {/* ── Record Form ──────────────────────────────────────────────── */}
      {row && (
        <div className="space-y-6">
          {/* Virtual ref fields (reference selectors) */}
          {virtualFields.length > 0 && (
            <div className="rounded-lg border bg-primary/[0.02] p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                <Link2 className="size-3.5" />
                Ссылки на другие разделы
              </div>
              {virtualFields.map((field) => (
                <RecordFieldRow
                  key={field.key}
                  field={field}
                  value={row[field.key]}
                  sectionKey={section.key}
                  rowIndex={clampedRecord}
                  fullWidth
                />
              ))}
            </div>
          )}

          {/* Main 2-column field grid */}
          {fieldPairs.length > 0 && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {fieldPairs.map((pair, pairIdx) => (
                <React.Fragment key={pairIdx}>
                  <RecordFieldRow
                    field={pair[0]!}
                    value={row[pair[0]!.key]}
                    sectionKey={section.key}
                    rowIndex={clampedRecord}
                    fullWidth={false}
                  />
                  {pair[1] ? (
                    <RecordFieldRow
                      field={pair[1]}
                      value={row[pair[1].key]}
                      sectionKey={section.key}
                      rowIndex={clampedRecord}
                      fullWidth={false}
                    />
                  ) : null}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Textarea fields — full width */}
          {textareaFields.length > 0 && (
            <div className="space-y-3">
              {textareaFields.map((field) => (
                <RecordFieldRow
                  key={field.key}
                  field={field}
                  value={row[field.key]}
                  sectionKey={section.key}
                  rowIndex={clampedRecord}
                  fullWidth
                />
              ))}
            </div>
          )}

          {/* Array fields — full width */}
          {arrayFields.length > 0 && (
            <div className="space-y-3">
              {arrayFields.map((field) => (
                <RecordFieldRow
                  key={field.key}
                  field={field}
                  value={row[field.key]}
                  sectionKey={section.key}
                  rowIndex={clampedRecord}
                  fullWidth
                />
              ))}
            </div>
          )}

          {/* Object fields (nested arrays/objects) — full width */}
          {objectFields.length > 0 && (
            <div className="space-y-4">
              {objectFields.map((field) => (
                <RecordFieldRow
                  key={field.key}
                  field={field}
                  value={row[field.key]}
                  sectionKey={section.key}
                  rowIndex={clampedRecord}
                  fullWidth
                />
              ))}
            </div>
          )}

          {/* Read-only fields (qdrant tags, etc.) — collapsed */}
          {readOnlyFields.length > 0 && (
            <ReadonlyFieldsBlock fields={readOnlyFields} row={row} />
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// RecordFieldRow — a single field displayed as label + input
// =============================================================================

interface RecordFieldRowProps {
  field: FieldDef;
  value: unknown;
  sectionKey: string;
  rowIndex: number;
  fullWidth: boolean;
}

function RecordFieldRow({
  field,
  value,
  sectionKey,
  rowIndex,
  fullWidth,
}: RecordFieldRowProps) {
  const updateCell = useStore((s) => s.updateCell);
  const updateNestedCell = useStore((s) => s.updateNestedCell);
  const addNestedRow = useStore((s) => s.addNestedRow);
  const removeNestedRow = useStore((s) => s.removeNestedRow);

  const isAutoFilled = field.autoFilled;

  const labelContent = (
    <div className="flex items-center gap-1.5">
      <Label
        className={`text-xs font-medium ${isAutoFilled ? 'text-emerald-700' : 'text-foreground/80'}`}
      >
        {field.label}
      </Label>
      {isAutoFilled && (
        <Badge
          variant="outline"
          className="text-[9px] px-1 py-0 h-3.5 text-emerald-600 border-emerald-300"
        >
          авто
        </Badge>
      )}
      {field.hint && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-muted-foreground/50 cursor-help text-[10px] leading-none">?</span>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={4} className="max-w-xs">
            <p className="text-xs">{field.hint}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );

  const inputEl = (
    <FieldInput
      field={field}
      value={value}
      sectionKey={sectionKey}
      rowIndex={rowIndex}
      updateCell={updateCell}
      updateNestedCell={updateNestedCell}
      addNestedRow={addNestedRow}
      removeNestedRow={removeNestedRow}
    />
  );

  // For object fields (nested tables), render differently
  if (field.type === 'object' && field.nestedFields) {
    return (
      <div className={fullWidth ? '' : 'col-span-2'}>
        <div className="flex items-center gap-2 mb-2">{labelContent}</div>
        <NestedFieldBlock
          field={field}
          value={value}
          sectionKey={sectionKey}
          rowIndex={rowIndex}
          updateNestedCell={updateNestedCell}
          addNestedRow={addNestedRow}
          removeNestedRow={removeNestedRow}
        />
      </div>
    );
  }

  // For array fields that need more space
  if (field.type === 'array' && fullWidth) {
    return (
      <div>
        {labelContent}
        <div className="mt-1">{inputEl}</div>
      </div>
    );
  }

  // For textarea in grid, span 2 columns
  if (field.type === 'textarea') {
    return (
      <div className="col-span-2">
        {labelContent}
        <div className="mt-1">{inputEl}</div>
      </div>
    );
  }

  return (
    <div>
      {labelContent}
      <div className="mt-1">{inputEl}</div>
    </div>
  );
}

// =============================================================================
// FieldInput — renders the actual input control for a field
// =============================================================================

interface FieldInputProps {
  field: FieldDef;
  value: unknown;
  sectionKey: string;
  rowIndex: number;
  updateCell: (sectionKey: string, rowIndex: number, fieldKey: string, value: unknown) => void;
  updateNestedCell: (sectionKey: string, rowIndex: number, fieldKey: string, nestedIndex: number, nestedFieldKey: string, value: unknown) => void;
  addNestedRow: (sectionKey: string, rowIndex: number, fieldKey: string) => void;
  removeNestedRow: (sectionKey: string, rowIndex: number, fieldKey: string, nestedIndex: number) => void;
}

function FieldInput({
  field,
  value,
  sectionKey,
  rowIndex,
  updateCell,
}: FieldInputProps) {
  const isAutoFilled = field.autoFilled;
  const baseInputClass = isAutoFilled
    ? 'h-9 text-sm border-emerald-200 bg-emerald-50/50 focus-visible:ring-emerald-500/50'
    : 'h-9 text-sm focus-visible:ring-1 focus-visible:ring-ring';

  switch (field.type) {
    case 'text':
      return (
        <Input
          type="text"
          value={(value as string) || ''}
          placeholder={field.placeholder}
          className={baseInputClass}
          onChange={(e) => updateCell(sectionKey, rowIndex, field.key, e.target.value)}
        />
      );

    case 'textarea':
      return (
        <Textarea
          value={(value as string) || ''}
          placeholder={field.placeholder}
          rows={3}
          className="min-h-[80px] text-sm resize-y focus-visible:ring-1 focus-visible:ring-ring"
          onChange={(e) => updateCell(sectionKey, rowIndex, field.key, e.target.value)}
        />
      );

    case 'number':
      return (
        <Input
          type="number"
          step="any"
          value={value === null || value === undefined ? '' : String(value)}
          placeholder={field.placeholder}
          className={baseInputClass}
          onChange={(e) => {
            const v = e.target.value;
            updateCell(sectionKey, rowIndex, field.key, v === '' ? null : Number(v));
          }}
        />
      );

    case 'date':
      return (
        <Input
          type="date"
          value={(value as string) || ''}
          className={baseInputClass}
          onChange={(e) => updateCell(sectionKey, rowIndex, field.key, e.target.value || null)}
        />
      );

    case 'boolean':
      return (
        <div className="flex items-center h-9">
          <Switch
            checked={!!value}
            onCheckedChange={(checked) => updateCell(sectionKey, rowIndex, field.key, checked)}
          />
        </div>
      );

    case 'select':
      return (
        <Select
          value={(value as string) || ''}
          onValueChange={(v) => updateCell(sectionKey, rowIndex, field.key, v)}
        >
          <SelectTrigger className={isAutoFilled ? 'h-9 text-sm border-emerald-200 bg-emerald-50/50 focus:ring-emerald-500/50 w-full' : 'h-9 text-sm w-full'}>
            <SelectValue placeholder={field.placeholder || 'Выберите…'} />
          </SelectTrigger>
          <SelectContent>
            {(field.options || []).map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'array': {
      const arr = Array.isArray(value) ? (value as string[]) : [];
      return (
        <Input
          type="text"
          value={arr.join(', ')}
          placeholder="через запятую"
          className={baseInputClass}
          onChange={(e) => {
            const items = e.target.value
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean);
            updateCell(sectionKey, rowIndex, field.key, items);
          }}
        />
      );
    }

    case 'ref':
      return <RefSelect field={field} value={value} sectionKey={sectionKey} rowIndex={rowIndex} />;

    default:
      return <span className="text-muted-foreground text-xs">—</span>;
  }
}

// =============================================================================
// RefSelect — dropdown populated from another section's data
// =============================================================================

function RefSelect({
  field,
  value,
  sectionKey,
  rowIndex,
}: {
  field: FieldDef;
  value: unknown;
  sectionKey: string;
  rowIndex: number;
}) {
  const updateCell = useStore((s) => s.updateCell);
  const allData = useStore((s) => s.data);
  const refSection = field.refSection;
  const refLabelField = field.refLabelField;

  const options = useMemo(() => {
    if (!refSection) return [];
    const rows = (allData[refSection] || []) as Record<string, unknown>[];
    return rows
      .map((row, idx) => {
        const label = refLabelField
          ? String(row[refLabelField] || '')
          : `Запись ${idx + 1}`;
        return { idx, label };
      })
      .filter((o) => o.label);
  }, [allData, refSection, refLabelField]);

  const currentIdx = value as number | null;
  const currentValue =
    currentIdx !== null && currentIdx !== undefined ? String(currentIdx) : '';
  const currentLabel =
    currentIdx !== null && currentIdx !== undefined
      ? options.find((o) => o.idx === currentIdx)?.label || ''
      : '';

  const isVirtual = field.virtual;

  return (
    <Select
      value={currentValue}
      onValueChange={(v) => updateCell(sectionKey, rowIndex, field.key, Number(v))}
    >
      <SelectTrigger
        className={`h-9 text-sm w-full ${
          isVirtual
            ? 'border-primary/30 bg-primary/5 focus:ring-1 focus:ring-primary'
            : ''
        }`}
      >
        <SelectValue placeholder={field.placeholder || 'Выберите…'}>
          {currentLabel || (field.placeholder || 'Выберите…')}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.length === 0 && (
          <SelectItem value="_empty" disabled>
            Нет записей в справочнике
          </SelectItem>
        )}
        {options.map((opt) => (
          <SelectItem key={opt.idx} value={String(opt.idx)}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// =============================================================================
// NestedFieldBlock — for object fields with nested sub-fields
// =============================================================================

function NestedFieldBlock({
  field,
  value,
  sectionKey,
  rowIndex,
  updateNestedCell,
  addNestedRow,
  removeNestedRow,
}: {
  field: FieldDef;
  value: unknown;
  sectionKey: string;
  rowIndex: number;
  updateNestedCell: (sectionKey: string, rowIndex: number, fieldKey: string, nestedIndex: number, nestedFieldKey: string, value: unknown) => void;
  addNestedRow: (sectionKey: string, rowIndex: number, fieldKey: string) => void;
  removeNestedRow: (sectionKey: string, rowIndex: number, fieldKey: string, nestedIndex: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const editableNestedFields = (field.nestedFields || []).filter(
    (nf) => !nf.readOnly,
  );

  // Array of nested objects (e.g., points, scenarios, cargo lists)
  if (Array.isArray(value)) {
    const items = value as Record<string, unknown>[];
    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            {open ? (
              <ChevronDown className="size-3.5" />
            ) : (
              <ChevronRight className="size-3.5" />
            )}
            <Badge variant="secondary" className="text-xs">
              {items.length}{' '}
              {items.length === 1
                ? 'запись'
                : items.length < 5
                  ? 'записи'
                  : 'записей'}
            </Badge>
            <span className="underline">развернуть</span>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="grid bg-muted/50 border-b px-3 py-2 text-xs font-medium text-muted-foreground">
              <div className="flex gap-4">
                <span className="w-8 text-center">#</span>
                {editableNestedFields.map((nf) => (
                  <span
                    key={nf.key}
                    className="min-w-[120px]"
                  >
                    {nf.label}
                  </span>
                ))}
                <span className="w-7" />
              </div>
            </div>
            {/* Rows */}
            {items.map((item, ni) => (
              <div
                key={ni}
                className="grid border-b last:border-b-0 hover:bg-muted/20 px-3 py-1.5"
              >
                <div className="flex gap-4 items-center">
                  <span className="w-8 text-center text-xs text-muted-foreground">
                    {ni + 1}
                  </span>
                  {editableNestedFields.map((nf) => (
                    <div key={nf.key} className="min-w-[120px]">
                      <NestedFieldInput
                        nestedField={nf}
                        value={item[nf.key]}
                        onChange={(v) =>
                          updateNestedCell(
                            sectionKey,
                            rowIndex,
                            field.key,
                            ni,
                            nf.key,
                            v,
                          )
                        }
                      />
                    </div>
                  ))}
                  <div className="w-7">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 text-muted-foreground hover:text-destructive"
                      onClick={() =>
                        removeNestedRow(sectionKey, rowIndex, field.key, ni)
                      }
                    >
                      <Minus className="size-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {/* Add row */}
            <div className="px-3 py-1.5 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => addNestedRow(sectionKey, rowIndex, field.key)}
              >
                <Plus className="mr-1 size-3" />
                Добавить
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  // Single nested object (e.g., ztb_boundaries)
  if (field.nestedFields && typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>;
    return (
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {editableNestedFields.map((nf) => (
          <div key={nf.key}>
            <Label className="text-xs font-medium text-foreground/80">
              {nf.label}
            </Label>
            <div className="mt-1">
              <NestedFieldInput
                nestedField={nf}
                value={obj[nf.key]}
                onChange={(v) => {
                  const updated = { ...obj, [nf.key]: v };
                  useStore
                    .getState()
                    .updateCell(sectionKey, rowIndex, field.key, updated);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

// =============================================================================
// NestedFieldInput — input for a single nested field
// =============================================================================

function NestedFieldInput({
  nestedField,
  value,
  onChange,
}: {
  nestedField: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const v = value ?? '';

  switch (nestedField.type) {
    case 'boolean':
      return (
        <Switch
          checked={!!value}
          onCheckedChange={(checked) => onChange(checked)}
          className="scale-75"
        />
      );
    case 'number':
      return (
        <input
          type="number"
          step="any"
          value={v === '' || v === null ? '' : String(v)}
          className="w-full h-7 text-xs border rounded-md px-2 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          onChange={(e) => {
            const nv = e.target.value;
            onChange(nv === '' ? null : Number(nv));
          }}
        />
      );
    case 'select':
      return (
        <select
          value={String(v)}
          className="w-full h-7 text-xs border rounded-md px-2 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">—</option>
          {(nestedField.options || []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    default:
      return (
        <input
          type="text"
          value={String(v)}
          className="w-full h-7 text-xs border rounded-md px-2 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

// =============================================================================
// ReadonlyFieldsBlock — collapsed block for qdrant_* and other readOnly fields
// =============================================================================

function ReadonlyFieldsBlock({
  fields,
  row,
}: {
  fields: FieldDef[];
  row: Record<string, unknown>;
}) {
  const [open, setOpen] = useState(false);

  const hasValues = fields.some(
    (f) => row[f.key] !== '' && row[f.key] !== null && row[f.key] !== undefined,
  );

  // If no values and closed, show minimal indicator
  if (!hasValues && !open) {
    return null;
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
          {open ? (
            <ChevronDown className="size-3.5" />
          ) : (
            <ChevronRight className="size-3.5" />
          )}
          <span className="font-medium">Системные теги и метаданные</span>
          <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
            {fields.length} полей
          </Badge>
          {hasValues && !open && (
            <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 bg-emerald-100 text-emerald-700 border-emerald-200">
              есть данные
            </Badge>
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2 grid grid-cols-3 gap-x-6 gap-y-2 p-3 rounded-lg bg-muted/30 border">
          {fields.map((f) => (
            <div key={f.key} className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground truncate" title={f.label}>
                {f.label}
              </span>
              <span className="text-xs font-mono text-muted-foreground/70 truncate max-w-[160px]">
                {row[f.key] === null
                  ? 'null'
                  : Array.isArray(row[f.key])
                    ? `[${(row[f.key] as unknown[]).length}]`
                    : String(row[f.key]) || '—'}
              </span>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
