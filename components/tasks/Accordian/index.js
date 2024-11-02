"use client";
import { useState } from "react";

export default function Accordian() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordian = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordian">
      <div className="accordian-header" onClick={toggleAccordian}>
        <h3>Accordian Header</h3>
      </div>
      {isOpen && (
        <div className="accordian-content">
          <p>This is the accordian content.</p>
        </div>
      )}
    </div>
  );
}
