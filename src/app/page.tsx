'use client';

import React, { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import {
  Shield,
  Save,
  Download,
  Upload,
  History,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Loader2,
  Building2,
  FileText,
  MapPin,
  Users,
  ClipboardList,
  LandPlot,
  Waves,
  Package,
  BarChart3,
  Settings,
  AlertTriangle,
  Construction,
  Lock,
  Grid3X3,
  ShieldCheck,
  FileSignature,
  Wrench,
  Fence,
  UserCheck,
  Camera,
  Thermometer,
  Cctv,
  type LucideIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import { SCHEMA_SECTIONS, getSectionGroups } from '@/lib/schema';
import type { SectionDef } from '@/lib/schema';
import { useStore } from '@/lib/store';
import { SectionTable } from '@/components/section-table';
import { VersionHistoryDialog } from '@/components/version-history-dialog';
import { ImportDialog } from '@/components/import-dialog';

// =============================================================================
// Icon resolver for sidebar items
// =============================================================================

const ICON_MAP: Record<string, LucideIcon> = {
  Building2,
  FileText,
  MapPin,
  Users,
  Shield,
  ClipboardList,
  LandPlot,
  Waves,
  Package,
  BarChart3,
  Settings,
  AlertTriangle,
  Construction,
  Lock,
  Grid3X3,
  ShieldCheck,
  FileSignature,
  Wrench,
  Fence,
  UserCheck,
  Camera,
  Thermometer,
  Cctv,
};

function SectionIcon({ iconName }: { iconName: string }) {
  const IconComp = ICON_MAP[iconName] || Shield;
  return <IconComp className="size-4" />;
}

// =============================================================================
// Sidebar Navigation
// =============================================================================

function SidebarNav() {
  const activeSection = useStore((s) => s.activeSection);
  const setActiveSection = useStore((s) => s.setActiveSection);
  const data = useStore((s) => s.data);
  const [collapsedGroups, setCollapsedGroups] = React.useState<Set<string>>(new Set());

  const groups = useMemo(() => getSectionGroups(), []);

  const toggleGroup = (groupLabel: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupLabel)) {
        next.delete(groupLabel);
      } else {
        next.add(groupLabel);
      }
      return next;
    });
  };

  return (
    <div className="py-2">
      {groups.map((group) => {
        const isCollapsed = collapsedGroups.has(group.label);
        return (
          <div key={group.label} className="mb-1">
            <button
              className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
              onClick={() => toggleGroup(group.label)}
            >
              {isCollapsed ? (
                <ChevronRight className="size-3 shrink-0" />
              ) : (
                <ChevronDown className="size-3 shrink-0" />
              )}
              {group.label}
            </button>
            {!isCollapsed && (
              <div className="space-y-0.5">
                {group.sections.map((section) => {
                  const isActive = activeSection === section.key;
                  const rows = data[section.key] || [];
                  const hasData = rows.length > 0;

                  return (
                    <button
                      key={section.key}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                        isActive
                          ? 'bg-accent text-accent-foreground font-medium'
                          : 'hover:bg-muted/50 text-foreground/80'
                      }`}
                      onClick={() => setActiveSection(section.key)}
                    >
                      <SectionIcon iconName={section.icon} />
                      <span className="flex-1 text-left truncate">
                        {section.label}
                      </span>
                      {hasData && (
                        <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// Main Page
// =============================================================================

export default function Home() {
  const loadData = useStore((s) => s.loadData);
  const loadVersions = useStore((s) => s.loadVersions);
  const saveData = useStore((s) => s.saveData);
  const resetData = useStore((s) => s.resetData);
  const activeSection = useStore((s) => s.activeSection);
  const isSaving = useStore((s) => s.isSaving);
  const isLoading = useStore((s) => s.isLoading);
  const versions = useStore((s) => s.versions);
  const setVersionsOpen = useStore((s) => s.setVersionsOpen);
  const setImportDialogOpen = useStore((s) => s.setImportDialogOpen);
  const author = useStore((s) => s.author);
  const setAuthor = useStore((s) => s.setAuthor);
  const isDirty = useStore((s) => s.isDirty);

  const activeSectionDef = useMemo(
    () => SCHEMA_SECTIONS.find((s) => s.key === activeSection),
    [activeSection]
  );

  const latestVersion =
    versions.length > 0 ? versions[0].version_label : '—';
  const dirty = isDirty();

  // Load data on mount
  useEffect(() => {
    loadData();
    loadVersions();
  }, [loadData, loadVersions]);

  const handleSave = async () => {
    const result = await saveData();
    if (result.success) {
      toast.success(`Данные сохранены (версия ${result.version})`);
    } else {
      toast.error(result.error || 'Ошибка сохранения');
    }
  };

  const handleExport = async () => {
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
      toast.success('Файл экспортирован');
    } catch {
      toast.error('Не удалось экспортировать данные');
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        'Сбросить все данные к начальному состоянию? Это действие нельзя отменить.'
      )
    ) {
      return;
    }
    await resetData();
    toast.success('Данные сброшены');
  };

  // Loading overlay
  if (isLoading && Object.keys(useStore.getState().data).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground text-sm">Загрузка данных…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="flex items-center gap-3 px-4 py-2.5">
          {/* Title */}
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-foreground" />
            <h1 className="text-base font-semibold whitespace-nowrap">
              Реестр данных ОТИ
            </h1>
            {dirty && (
              <Badge
                variant="outline"
                className="text-xs px-1.5 py-0 h-5 border-amber-500/50 text-amber-600"
              >
                изменено
              </Badge>
            )}
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Author inputs */}
          <Input
            placeholder="Имя автора"
            value={author.name}
            onChange={(e) => setAuthor({ ...author, name: e.target.value })}
            className="h-8 w-36 text-xs"
          />
          <Input
            placeholder="Должность автора"
            value={author.role}
            onChange={(e) => setAuthor({ ...author, role: e.target.value })}
            className="h-8 w-40 text-xs"
          />

          <Separator orientation="vertical" className="h-6" />

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Save className="size-3.5" />
                  )}
                  <span className="ml-1.5">Сохранить</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Сохранить данные</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="size-3.5" />
                  <span className="ml-1.5">Экспорт</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Экспорт JSON</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setImportDialogOpen(true)}
                >
                  <Upload className="size-3.5" />
                  <span className="ml-1.5">Импорт</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Импорт JSON</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVersionsOpen(true)}
                >
                  <History className="size-3.5" />
                  <span className="ml-1.5">Версии</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>История версий</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Сбросить данные</TooltipContent>
            </Tooltip>
          </div>

          {/* Version badge on the right */}
          <div className="ml-auto">
            <span className="text-xs text-muted-foreground">
              {latestVersion}
            </span>
          </div>
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[280px] shrink-0 border-r border-border bg-muted/30 overflow-y-auto">
          <ScrollArea className="h-full">
            <SidebarNav />
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {activeSectionDef ? (
            <div className="p-6 max-w-[960px]">
              {/* Section Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="flex items-center justify-center size-8 rounded-md bg-accent">
                    <SectionIcon iconName={activeSectionDef.icon} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">
                      {activeSectionDef.label}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {activeSectionDef.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Form */}
              <SectionTable section={activeSectionDef} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Раздел не найден
            </div>
          )}
        </main>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-white px-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2025 Реестр данных ОТИ</span>
          <span>Версия: {latestVersion}</span>
        </div>
      </footer>

      {/* ── Dialogs ─────────────────────────────────────────────────────── */}
      <VersionHistoryDialog />
      <ImportDialog />
    </div>
  );
}
