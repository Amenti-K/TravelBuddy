import React from "react";
import { Checkbox, Text, UnstyledButton } from "@mantine/core";
import { useUncontrolled } from "@mantine/hooks";

const InterestsCheckBox = ({
  title,
  description,
  category,
  defaultChecked,
  onChange,
}) => {
  const [checked, setChecked] = useUncontrolled({
    value: undefined,
    defaultValue: defaultChecked,
    finalValue: false,
    onChange,
  });

  const handleClick = () => {
    setChecked(!checked);
    onChange(title);
  };

  return (
    <UnstyledButton
      onClick={handleClick}
      data-checked={checked || undefined}
      className={`p-3 min-w-[100px] flex items-center justify-between rounded-md shadow-md transition-colors duration-200 ${
        checked ? "bg-blue-500 text-white" : "bg-white text-gray-800"
      } border border-gray-300`}
      style={{ padding: "10px 12px", minWidth: "100px", maxWidth: "100%" }}
    >
      {/* Icon on the left */}
      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
        {/* Icon size and stroke can be customized */}
        {/* <Icon size={30} stroke={1.5} /> */}
      </div>

      {/* Title and description */}
      <div className="flex flex-col flex-grow">
        <Text fw={500} size="sm" noWrap>
          {title}
        </Text>
        <Text c="dimmed" size="xs" lh={1}>
          {description}
        </Text>
      </div>

      {/* Checkbox on the right */}
      <Checkbox
        checked={checked}
        onChange={() => {}}
        tabIndex={-1}
        styles={{ input: { cursor: "pointer" } }}
      />
    </UnstyledButton>
  );
};

export default InterestsCheckBox;
