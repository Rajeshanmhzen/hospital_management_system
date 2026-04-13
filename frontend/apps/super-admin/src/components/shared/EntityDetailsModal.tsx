import { Modal } from "@mantine/core";
import type { ReactNode } from "react";

interface EntityDetailsModalProps {
    opened: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
    size?: string;
}

export function EntityDetailsModal({
    opened,
    title,
    onClose,
    children,
    size = "lg",
}: EntityDetailsModalProps) {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={title}
            centered
            size={size}
            overlayProps={{
                backgroundOpacity: 0.4,
                blur: 2,
            }}
        >
            {children}
        </Modal>
    );
}
