import React, { useRef } from "react";
import { useSlate } from "slate-react";
import { Editor } from "slate";

interface ColorPickerProps {
  format: "color" | "backgroundColor";
  icon: string;
  title: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  format,
  icon,
  title,
}) => {
  const editor = useSlate();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    Editor.addMark(editor, format, color);
  };

  return (
    <span
      className="toolbar-btn color-picker-btn"
      onMouseDown={(e) => {
        e.preventDefault();
        inputRef.current?.click();
      }}
      title={title}
    >
      <span className="material-icons toolbar-icon color-picker-icon">
        {icon}
      </span>
      <input
        ref={inputRef}
        type="color"
        onChange={handleColorChange}
        className="hidden-color-input"
      />
    </span>
  );
};
