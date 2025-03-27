"use client";

import {
  FormControl,
  FormField as UIFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Control, Path, FieldValues } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type: "input" | "textarea" | "select";
  placeholder?: string;
  options?: Option[];
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function FormField<T extends FieldValues>({
  control,
  name,
  label,
  type,
  placeholder,
  options = [],
  onFocus,
  onBlur,
}: FormFieldProps<T>) {
  return (
    <UIFormField
      control={control as Control<FieldValues>}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-stone-600 font-medium">{label}</FormLabel>
          <FormControl>
            {type === "input" ? (
              <Input
                {...field}
                placeholder={placeholder}
                className="border-b border-stone-300 rounded-none bg-transparent focus:border-stone-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                onFocus={onFocus}
                onBlur={onBlur}
              />
            ) : type === "textarea" ? (
              <Textarea
                {...field}
                placeholder={placeholder}
                className="border-b border-stone-300 rounded-none bg-transparent focus:border-stone-600 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[100px]"
                onFocus={onFocus}
                onBlur={onBlur}
              />
            ) : (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                onOpenChange={(open) => {
                  if (open) {
                    onFocus?.();
                  } else {
                    onBlur?.();
                  }
                }}
              >
                <SelectTrigger className="border-b border-stone-300 rounded-none bg-transparent focus:border-stone-600 focus:ring-0 focus-visible:ring-offset-0">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormControl>
          <FormMessage className="text-red-500" />
        </FormItem>
      )}
    />
  );
}
