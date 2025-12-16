import React, { useState, useRef, useEffect } from "react";

interface DropdownProps {
  icon: string;
  title: string;
  active?: boolean;
  children: React.ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = ({
  icon,
  title,
  active,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="toolbar-dropdown-container" ref={dropdownRef}>
      <span
        className={`toolbar-btn ${active ? "active" : ""} ${
          isOpen ? "open" : ""
        }`}
        onMouseDown={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        title={title}
      >
        <span className="material-icons toolbar-icon">{icon}</span>
        <span className="material-icons dropdown-arrow">arrow_drop_down</span>
      </span>
      {isOpen && (
        <div
          className="toolbar-dropdown-menu"
          onMouseDown={(e) => e.preventDefault()}
        >
          {children}
        </div>
      )}
    </div>
  );
};
