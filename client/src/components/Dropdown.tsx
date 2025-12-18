import React, { useRef, useState, type ReactNode } from "react";
import { useClickOutside } from "../hooks/useClickOutside";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = "left",
  className = "",
  isOpen: controlledIsOpen,
  onOpenChange,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalIsOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  useClickOutside(ref as React.RefObject<HTMLElement>, () => {
    if (isOpen) {
      handleOpenChange(false);
    }
  });

  return (
    <div ref={ref} className={`dropdown-container ${className}`}>
      <div
        className="dropdown-trigger-wrapper"
        onClick={() => handleOpenChange(!isOpen)}
      >
        {trigger}
      </div>
      {isOpen && (
        <div
          className={`dropdown-menu ${
            align === "right" ? "dropdown-align-right" : "dropdown-align-left"
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
