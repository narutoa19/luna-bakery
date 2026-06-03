"use client";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface Props {
  open: boolean;
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function DeleteConfirmModal({ open, productName, onConfirm, onCancel, loading }: Props) {
  return (
    <Modal open={open} onClose={onCancel}>
      <div className="text-center">
        <div className="w-12 h-12 bg-red-50 rounded-full mx-auto mb-4 flex items-center justify-center text-xl">
          🗑️
        </div>
        <h3 className="text-sm font-semibold text-wood mb-1">确认删除？</h3>
        <p className="text-xs text-wood-light mb-4">
          {productName} 将从产品列表中永久移除
        </p>
        <div className="bg-red-50 rounded-lg p-3 text-[11px] text-red-600 mb-5">
          ⚠️ 删除后无法恢复，确定要继续吗？
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>取消</Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm} disabled={loading}>
            {loading ? "删除中..." : "确认删除"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
