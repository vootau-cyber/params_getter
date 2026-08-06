'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileJson, AlertCircle, UploadCloud } from 'lucide-react';

export function ImportDialog() {
  const importDialogOpen = useStore((s) => s.importDialogOpen);
  const setImportDialogOpen = useStore((s) => s.setImportDialogOpen);
  const importData = useStore((s) => s.importData);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback((file: File | null) => {
    setSelectedFile(file);
    setPreview('');
    setError('');

    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setError('Файл должен иметь расширение .json');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Файл слишком большой (максимум 10 МБ)');
      return;
    }

    // Read preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      setPreview(lines.slice(0, 50).join('\n'));
    };
    reader.readAsText(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files[0] || null;
      handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    setError('');

    try {
      const result = await importData(selectedFile);
      if (result.success) {
        toast.success('Данные успешно импортированы');
        setImportDialogOpen(false);
        setSelectedFile(null);
        setPreview('');
      } else {
        setError(result.error || 'Ошибка импорта');
        toast.error(result.error || 'Ошибка импорта');
      }
    } catch {
      setError('Ошибка при импорте');
      toast.error('Ошибка при импорте');
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setImportDialogOpen(false);
      setSelectedFile(null);
      setPreview('');
      setError('');
    }
  };

  return (
    <Dialog open={importDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="size-5" />
            Импорт данных
          </DialogTitle>
          <DialogDescription>
            Загрузите файл JSON с данными для импорта. Текущие данные будут сохранены как новая версия.
          </DialogDescription>
        </DialogHeader>

        {/* Drag & Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragging
              ? 'border-primary bg-primary/5'
              : selectedFile
                ? 'border-green-500/50 bg-green-50/50'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
          />

          {selectedFile ? (
            <div className="flex flex-col items-center gap-2">
              <FileJson className="size-8 text-green-600" />
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} КБ
              </p>
              <Button
                variant="link"
                size="sm"
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFileSelect(null);
                }}
              >
                Удалить файл
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <UploadCloud className="size-8" />
              <p className="text-sm">Перетащите файл сюда или нажмите для выбора</p>
              <p className="text-xs">Только файлы .json</p>
            </div>
          )}
        </div>

        {/* Preview */}
        {preview && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Предпросмотр:</p>
            <pre className="max-h-48 overflow-auto rounded-md border bg-muted/30 p-3 text-xs font-mono leading-relaxed">
              {preview}
            </pre>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/5 p-3">
            <AlertCircle className="size-4 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => handleClose(false)}>
            Отмена
          </Button>
          <Button
            onClick={handleImport}
            disabled={!selectedFile || isImporting}
          >
            {isImporting ? 'Импорт…' : 'Импортировать'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
