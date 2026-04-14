import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";

export function useDebouncedSearch(initialValue = "", delay = 450) {
    const [value, setValue] = useState(initialValue);
    const [debouncedValue] = useDebouncedValue(value, delay);

    const clear = () => setValue("");

    return {
        value,
        setValue,
        debouncedValue,
        clear,
    };
}
