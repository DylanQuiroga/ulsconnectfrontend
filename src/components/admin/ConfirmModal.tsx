import React from "react";
import { FaTimes, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import "./css/ConfirmModal.css";

interface ConfirmModalProps {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: "danger" | "warning" | "info";
}

export default function ConfirmModal({
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    onCancel,
    variant = "warning",
}: ConfirmModalProps) {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className={`modal-content cm-modal cm-${variant}`} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="cm-header-content">
                        {variant === "danger" && <FaExclamationTriangle className="cm-icon cm-icon-danger" />}
                        {variant === "warning" && <FaExclamationTriangle className="cm-icon cm-icon-warning" />}
                        {variant === "info" && <FaInfoCircle className="cm-icon cm-icon-info" />}
                        <h2>{title}</h2>
                    </div>
                    <button className="modal-close" onClick={onCancel}>
                        <FaTimes />
                    </button>
                </div>

                <div className="cm-body">
                    <p>{message}</p>
                </div>

                <div className="modal-footer">
                    <button className="am-btn am-btn-outline" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button
                        className={`am-btn ${variant === "danger" ? "am-btn-danger" : "am-btn-primary"}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}