import { ActionIcon, TextInput } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minWidth?: number;
    clearable?: boolean;
}

export function SearchInput({
    value,
    onChange,
    placeholder = "Search",
    minWidth = 320,
    clearable = true,
}: SearchInputProps) {
    return (
        <TextInput
            placeholder={placeholder}
            leftSection={<IconSearch size={16} />}
            value={value}
            onChange={(event) => onChange(event.currentTarget.value)}
            rightSection={
                clearable && value ? (
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={() => onChange("")}
                        aria-label="Clear search"
                    >
                        <IconX size={14} />
                    </ActionIcon>
                ) : null
            }
            style={{ minWidth, flex: 1 }}
        />
    );
}
