'use client';

import React, { useState, useMemo } from 'react';
import type { SectionDef, FieldDef } from '@/lib/schema';
import { useStore } from '@/lib/store';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Trash2, Plus, Minus } from 'lucide-react';

// =============================================================================
// SectionTable
// =============================================================================

interface SectionTableProps {
  section: SectionDef;
}

export function SectionTable({ section }: SectionTableProps) {
  const data = useStore((s) => s.data[section.key] || []);
  const updateCell = useStore((s) => s.updateCell);
  const addRow = useStore((s) => s.addRow);
  const removeRow = useStore((s) => s.removeRow);
  const updateNestedCell = useStore((s) => s.updateNestedCell);
  const addNestedRow = useStore((s) => s.addNestedRow);
  const removeNestedRow = useStore((s) => s.removeNestedRow);

  const fields = section.fields.filter((f) => !f.readOnly);

  if (data.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground text-sm">Нет данных. Добавьте строку для начала.</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => addRow(section.key)}
        >
          <Plus className="mr-1 size-4" />
          Добавить строку
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center text-xs">№</TableHead>
            {fields.map((field) => (
              <TableHead
                key={field.key}
                className="text-xs whitespace-nowrap"
              >
                {field.label}
              </TableHead>
            ))}
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell className="text-center text-xs text-muted-foreground">
                {rowIndex + 1}
              </TableCell>
              {fields.map((field) => (
                <TableCell key={field.key} className="p-1">
                  <CellRenderer
                    field={field}
                    value={(row as Record<string, unknown>)[field.key]}
                    sectionKey={section.key}
                    rowIndex={rowIndex}
                    updateCell={updateCell}
                    updateNestedCell={updateNestedCell}
                    addNestedRow={addNestedRow}
                    removeNestedRow={removeNestedRow}
                  />
                </TableCell>
              ))}
              <TableCell className="p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-destructive"
                  onClick={() => removeRow(section.key, rowIndex)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => addRow(section.key)}
        >
          <Plus className="mr-1 size-4" />
          Добавить строку
        </Button>
      </div>
    </div>
  );
}

// =============================================================================
// Cell Renderer
// =============================================================================

interface CellRendererProps {
  field: FieldDef;
  value: unknown;
  sectionKey: string;
  rowIndex: number;
  updateCell: (sectionKey: string, rowIndex: number, fieldKey: string, value: unknown) => void;
  updateNestedCell: (sectionKey: string, rowIndex: number, fieldKey: string, nestedIndex: number, nestedFieldKey: string, value: unknown) => void;
  addNestedRow: (sectionKey: string, rowIndex: number, fieldKey: string) => void;
  removeNestedRow: (sectionKey: string, rowIndex: number, fieldKey: string, nestedIndex: number) => void;
}

function CellRenderer({
  field,
  value,
  sectionKey,
  rowIndex,
  updateCell,
  updateNestedCell,
  addNestedRow,
  removeNestedRow,
}: CellRendererProps) {
  switch (field.type) {
    case 'text':
      return <TextCell field={field} value={value} sectionKey={sectionKey} rowIndex={rowIndex} updateCell={updateCell} />;
    case 'textarea':
      return <TextareaCell field={field} value={value} sectionKey={sectionKey} rowIndex={rowIndex} updateCell={updateCell} />;
    case 'number':
      return <NumberCell field={field} value={value} sectionKey={sectionKey} rowIndex={rowIndex} updateCell={updateCell} />;
    case 'date':
      return <DateCell field={field} value={value} sectionKey={sectionKey} rowIndex={rowIndex} updateCell={updateCell} />;
    case 'boolean':
      return <BooleanCell field={field} value={value} sectionKey={sectionKey} rowIndex={rowIndex} updateCell={updateCell} />;
    case 'select':
      return <SelectCell field={field} value={value} sectionKey={sectionKey} rowIndex={rowIndex} updateCell={updateCell} />;
    case 'array':
      return <ArrayCell field={field} value={value} sectionKey={sectionKey} rowIndex={rowIndex} updateCell={updateCell} />;
    case 'ref':
      return <RefCell field={field} value={value} sectionKey={sectionKey} rowIndex={rowIndex} updateCell={updateCell} />;
    case 'object':
      if (field.nestedFields) {
        if (Array.isArray(value)) {
          return (
            <NestedArrayCell
              field={field}
              value={value}
              sectionKey={sectionKey}
              rowIndex={rowIndex}
              updateNestedCell={updateNestedCell}
              addNestedRow={addNestedRow}
              removeNestedRow={removeNestedRow}
            />
          );
        }
        return (
          <NestedObjectCell
            field={field}
            value={value as Record<string, unknown>}
            sectionKey={sectionKey}
            rowIndex={rowIndex}
            updateCell={updateCell}
          />
        );
      }
      return <span className="text-muted-foreground text-xs">—</span>;
    default:
      return <span className="text-muted-foreground text-xs">—</span>;
  }
}

// =============================================================================
// Ref Cell — select dropdown populated from another section's data
// =============================================================================

function RefCell({ field, value, sectionKey, rowIndex, updateCell }: BaseCellProps) {
  const allData = useStore((s) => s.data);
  const refSection = field.refSection;
  const refLabelField = field.refLabelField;

  const options = useMemo(() => {
    if (!refSection) return [];
    const rows = (allData[refSection] || []) as Record<string, unknown>[];
    return rows.map((row, idx) => {
      const label = refLabelField
        ? String(row[refLabelField] || '')
        : `Запись ${idx + 1}`;
      return { idx, label };
    }).filter((o) => o.label);
  }, [allData, refSection, refLabelField]);

  // Current value is the row index in the referenced section
  const currentIdx = value as number | null;
  const currentValue = currentIdx !== null && currentIdx !== undefined
    ? String(currentIdx)
    : '';

  // Find the label for current value
  const currentLabel = currentIdx !== null && currentIdx !== undefined
    ? options.find(o => o.idx === currentIdx)?.label || ''
    : '';

  const el = (
    <Select
      value={currentValue}
      onValueChange={(v) => updateCell(sectionKey, rowIndex, field.key, Number(v))}
    >
      <SelectTrigger className="h-8 text-sm border-0 bg-transparent focus:ring-1 focus:ring-ring w-full min-w-[140px]">
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
            <span className="truncate">{opt.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
  return tooltipWrap(field.hint, el);
}

// =============================================================================
// Field-specific cell components
// =============================================================================

interface BaseCellProps {
  field: FieldDef;
  value: unknown;
  sectionKey: string;
  rowIndex: number;
  updateCell: (sectionKey: string, rowIndex: number, fieldKey: string, value: unknown) => void;
}

function tooltipWrap(hint: string | undefined, element: React.ReactNode) {
  if (!hint) return element;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{element}</TooltipTrigger>
      <TooltipContent side="top" sideOffset={4}>
        <p className="max-w-xs">{hint}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function TextCell({ field, value, sectionKey, rowIndex, updateCell }: BaseCellProps) {
  const el = (
    <Input
      type="text"
      value={(value as string) || ''}
      placeholder={field.placeholder}
      className="h-8 text-sm border-0 bg-transparent focus-visible:ring-1 focus-visible:ring-ring"
      onChange={(e) => updateCell(sectionKey, rowIndex, field.key, e.target.value)}
    />
  );
  return tooltipWrap(field.hint, el);
}

function TextareaCell({ field, value, sectionKey, rowIndex, updateCell }: BaseCellProps) {
  const el = (
    <Textarea
      value={(value as string) || ''}
      placeholder={field.placeholder}
      rows={2}
      className="min-h-[60px] text-sm border-0 bg-transparent resize-y focus-visible:ring-1 focus-visible:ring-ring"
      onChange={(e) => updateCell(sectionKey, rowIndex, field.key, e.target.value)}
    />
  );
  return tooltipWrap(field.hint, el);
}

function NumberCell({ field, value, sectionKey, rowIndex, updateCell }: BaseCellProps) {
  const el = (
    <Input
      type="number"
      step="any"
      value={value === null || value === undefined ? '' : String(value)}
      placeholder={field.placeholder}
      className="h-8 text-sm border-0 bg-transparent focus-visible:ring-1 focus-visible:ring-ring"
      onChange={(e) => {
        const v = e.target.value;
        updateCell(sectionKey, rowIndex, field.key, v === '' ? null : Number(v));
      }}
    />
  );
  return tooltipWrap(field.hint, el);
}

function DateCell({ field, value, sectionKey, rowIndex, updateCell }: BaseCellProps) {
  const el = (
    <Input
      type="date"
      value={(value as string) || ''}
      className="h-8 text-sm border-0 bg-transparent focus-visible:ring-1 focus-visible:ring-ring"
      onChange={(e) => updateCell(sectionKey, rowIndex, field.key, e.target.value || null)}
    />
  );
  return tooltipWrap(field.hint, el);
}

function BooleanCell({ field, value, sectionKey, rowIndex, updateCell }: BaseCellProps) {
  const el = (
    <div className="flex justify-center">
      <Switch
        checked={!!value}
        onCheckedChange={(checked) => updateCell(sectionKey, rowIndex, field.key, checked)}
      />
    </div>
  );
  return tooltipWrap(field.hint, el);
}

function SelectCell({ field, value, sectionKey, rowIndex, updateCell }: BaseCellProps) {
  const options = field.options || [];
  const el = (
    <Select
      value={(value as string) || ''}
      onValueChange={(v) => updateCell(sectionKey, rowIndex, field.key, v)}
    >
      <SelectTrigger className="h-8 text-sm border-0 bg-transparent focus:ring-1 focus:ring-ring w-full">
        <SelectValue placeholder={field.placeholder || 'Выберите…'} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
  return tooltipWrap(field.hint, el);
}

function ArrayCell({ field, value, sectionKey, rowIndex, updateCell }: BaseCellProps) {
  const arr = Array.isArray(value) ? (value as string[]) : [];
  const displayValue = arr.join(', ');
  const el = (
    <Input
      type="text"
      value={displayValue}
      placeholder="через запятую"
      className="h-8 text-sm border-0 bg-transparent focus-visible:ring-1 focus-visible:ring-ring"
      onChange={(e) => {
        const v = e.target.value;
        const items = v
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        updateCell(sectionKey, rowIndex, field.key, items);
      }}
    />
  );
  return tooltipWrap(field.hint ? `${field.hint} (через запятую)` : 'Введите значения через запятую', el);
}

// =============================================================================
// Nested array cell (e.g., points in aquatories)
// =============================================================================

interface NestedArrayCellProps {
  field: FieldDef;
  value: unknown[];
  sectionKey: string;
  rowIndex: number;
  updateNestedCell: (sectionKey: string, rowIndex: number, fieldKey: string, nestedIndex: number, nestedFieldKey: string, value: unknown) => void;
  addNestedRow: (sectionKey: string, rowIndex: number, fieldKey: string) => void;
  removeNestedRow: (sectionKey: string, rowIndex: number, fieldKey: string, nestedIndex: number) => void;
}

function NestedArrayCell({
  field,
  value,
  sectionKey,
  rowIndex,
  updateNestedCell,
  addNestedRow,
  removeNestedRow,
}: NestedArrayCellProps) {
  const [open, setOpen] = useState(false);
  const editableNestedFields = (field.nestedFields || []).filter((nf) => !nf.readOnly);
  const items = value as Record<string, unknown>[];

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 p-0 px-1 w-full justify-start">
          {open ? (
            <ChevronDown className="size-3 shrink-0" />
          ) : (
            <ChevronRight className="size-3 shrink-0" />
          )}
          <Badge variant="secondary" className="text-xs">
            {items.length} {items.length === 1 ? 'запись' : items.length < 5 ? 'записи' : 'записей'}
          </Badge>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-1 border rounded-md">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="p-1 text-left font-medium text-muted-foreground w-8">#</th>
                {editableNestedFields.map((nf) => (
                  <th key={nf.key} className="p-1 text-left font-medium text-muted-foreground">
                    {nf.label}
                  </th>
                ))}
                <th className="p-1 w-7" />
              </tr>
            </thead>
            <tbody>
              {items.map((item, ni) => (
                <tr key={ni} className="border-b last:border-b-0 hover:bg-muted/20">
                  <td className="p-1 text-muted-foreground text-center">{ni + 1}</td>
                  {editableNestedFields.map((nf) => (
                    <td key={nf.key} className="p-1">
                      <NestedFieldInput
                        nestedField={nf}
                        value={item[nf.key]}
                        onChange={(v) =>
                          updateNestedCell(sectionKey, rowIndex, field.key, ni, nf.key, v)
                        }
                      />
                    </td>
                  ))}
                  <td className="p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-5 text-muted-foreground hover:text-destructive"
                      onClick={() => removeNestedRow(sectionKey, rowIndex, field.key, ni)}
                    >
                      <Minus className="size-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-1 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
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

// =============================================================================
// Nested object cell (inline fields)
// =============================================================================

interface NestedObjectCellProps {
  field: FieldDef;
  value: Record<string, unknown>;
  sectionKey: string;
  rowIndex: number;
  updateCell: (sectionKey: string, rowIndex: number, fieldKey: string, value: unknown) => void;
}

function NestedObjectCell({ field, value, sectionKey, rowIndex, updateCell }: NestedObjectCellProps) {
  const editableNestedFields = (field.nestedFields || []).filter((nf) => !nf.readOnly);
  const obj = value || {};

  return (
    <div className="space-y-1">
      {editableNestedFields.map((nf) => (
        <div key={nf.key} className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground whitespace-nowrap min-w-[80px]">
            {nf.label}
          </label>
          <input
            type={nf.type === 'number' ? 'number' : 'text'}
            step={nf.type === 'number' ? 'any' : undefined}
            value={(obj[nf.key] as string) || ''}
            placeholder={nf.placeholder}
            className="flex-1 h-7 text-xs border rounded px-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-ring"
            onChange={(e) => {
              const v = e.target.value;
              const updated = { ...obj };
              if (nf.type === 'number') {
                updated[nf.key] = v === '' ? null : Number(v);
              } else {
                updated[nf.key] = v;
              }
              updateCell(sectionKey, rowIndex, field.key, updated);
            }}
          />
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// Nested field input helper
// =============================================================================

interface NestedFieldInputProps {
  nestedField: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
}

function NestedFieldInput({ nestedField, value, onChange }: NestedFieldInputProps) {
  const v = value ?? '';

  switch (nestedField.type) {
    case 'boolean':
      return (
        <div className="flex justify-center">
          <Switch
            checked={!!value}
            onCheckedChange={(checked) => onChange(checked)}
            className="scale-75"
          />
        </div>
      );
    case 'number':
      return (
        <input
          type="number"
          step="any"
          value={v === '' || v === null ? '' : String(v)}
          className="w-full h-6 text-xs border rounded px-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-ring"
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
          className="w-full h-6 text-xs border rounded px-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-ring"
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
          className="w-full h-6 text-xs border rounded px-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-ring"
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}
