"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Conferma",
  cancelText = "Annulla",
  variant = "warning",
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  if (!shouldRender) return null;

  const variantStyles = {
    danger: {
      icon: "text-red-600",
      button: "bg-red-600 hover:bg-red-700",
      border: "border-red-200",
      bg: "bg-red-50",
    },
    warning: {
      icon: "text-yellow-600",
      button: "bg-yellow-600 hover:bg-yellow-700",
      border: "border-yellow-200",
      bg: "bg-yellow-50",
    },
    info: {
      icon: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700",
      border: "border-blue-200",
      bg: "bg-blue-50",
    },
  };

  const styles = variantStyles[variant];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 ${
          isClosing ? "animate-fade-out" : "animate-fade-in"
        }`}
        onClick={handleClose}
      >
        {/* Modal */}
        <div
          className={`relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl ${
            isClosing ? "animate-fade-out" : "animate-scale-in"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-gray-400 transition-all hover:text-gray-600 hover:rotate-90 hover:scale-110"
            aria-label="Chiudi"
          >
            <X size={24} />
          </button>

          <div className="mb-4 flex items-start gap-4">
            <div className={`rounded-full ${styles.bg} p-3 animate-bounce-in`}>
              <AlertTriangle size={24} className={`${styles.icon} animate-wiggle`} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">{title}</h3>
              <p className="mt-2 text-gray-600">{message}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-all hover:bg-gray-50 hover:scale-105 active:scale-95"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 rounded-md px-4 py-2 font-medium text-white transition-all hover:scale-105 active:scale-95 hover:shadow-lg ${styles.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

