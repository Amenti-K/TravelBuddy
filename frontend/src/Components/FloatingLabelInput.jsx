import { useState } from "react";
import { TextInput } from "@mantine/core";

const FloatingLabelInput = ({
  field,
  form: { errors, touched },
  label,
  placeholder,
  required,
  type,
}) => {
  const [focused, setFocused] = useState(false);
  const { name, value } = field;
  const floating = (value && value.toString().trim().length !== 0) || focused;

  return (
    <div className="relative mt-4">
      <TextInput
        {...field}
        label={label}
        placeholder={placeholder}
        required={required}
        type={type}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        autoComplete="off"
        data-floating={floating}
        labelProps={{
          className: `absolute left-3 top-2 transition-all duration-200 ${
            floating ? "text-xs -top-3" : "text-sm"
          } ${
            focused
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-gray-500 dark:text-gray-400"
          }`,
        }}
      />
      {errors[name] && touched[name] && (
        <div className="text-red-500 text-sm mt-1">{errors[name]}</div>
      )}
    </div>
  );
};

export default FloatingLabelInput;
