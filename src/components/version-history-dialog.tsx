'use client';

import React from 'react';
import { useStore, type VersionMeta } from '@/lib/store';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RotateCcw, Clock, User } from 'lucide-react';

function formatTimestamp(ts: string): string {
  try {
    const date = new Date(ts);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return ts;
  }
}

export function VersionHistoryDialog() {
  const versionsOpen = useStore((s) => s.versionsOpen);
  const setVersionsOpen = useStore((s) => s.setVersionsOpen);
  const versions = useStore((s) => s.versions);
  const loadVersionData = useStore((s) => s.loadVersionData);
  const [loadingVersion, setLoadingVersion] = React.useState<number | null>(null);

  const handleLoad = async (version: VersionMeta) => {
    setLoadingVersion(version.id);
    try {
      await loadVersionData(version.id);
      toast.success(`Версия ${version.version_label} загружена`);
      setVersionsOpen(false);
    } catch {
      toast.error('Не удалось загрузить версию');
    } finally {
      setLoadingVersion(null);
    }
  };

  return (
    <Dialog open={versionsOpen} onOpenChange={setVersionsOpen}>
      <DialogContent className="sm:max-w-xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="size-5" />
            История версий
          </DialogTitle>
          <DialogDescription>
            Список сохранённых версий данных. Загрузка версии заменит текущие данные.
          </DialogDescription>
        </DialogHeader>

        {versions.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            Нет сохранённых версий
          </div>
        ) : (
          <ScrollArea className="max-h-[50vh] -mx-6 px-6">
            <div className="space-y-2">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="border rounded-lg p-3 flex flex-col gap-2 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{version.version_label}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(version.timestamp)}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      disabled={loadingVersion === version.id}
                      onClick={() => handleLoad(version)}
                    >
                      {loadingVersion === version.id ? (
                        <span className="animate-spin">⏳</span>
                      ) : (
                        <RotateCcw className="size-3" />
                      )}
                      Загрузить
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="size-3" />
                    <span>
                      {version.author_name}
                      {version.author_role ? ` (${version.author_role})` : ''}
                    </span>
                  </div>

                  {version.changed_sections.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {version.changed_sections.map((sec) => (
                        <Badge key={sec} variant="secondary" className="text-xs font-normal">
                          {sec}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
