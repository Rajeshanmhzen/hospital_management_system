import { Button, Group, Modal, Stack, Text } from "@mantine/core";

interface ConfirmationModalProps {
    opened: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmColor?: string;
    loading?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export function ConfirmationModal({
    opened,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    confirmColor = "red",
    loading = false,
    onCancel,
    onConfirm,
}: ConfirmationModalProps) {
    return (
        <Modal
            opened={opened}
            onClose={() => {
                if (!loading) onCancel();
            }}
            title={title}
            centered
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >
            <Stack>
                <Text>{message}</Text>
                <Group justify="flex-end" mt="sm">
                    <Button variant="default" disabled={loading} onClick={onCancel}>
                        {cancelLabel}
                    </Button>
                    <Button color={confirmColor} loading={loading} onClick={onConfirm}>
                        {confirmLabel}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
