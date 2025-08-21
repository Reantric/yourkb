"use client";

import React, { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import CanvasGrid from "./canvasGrid";

interface EditorProps {
  initFgColor: string;
  initBgColor: string;
  initHexString: string;
}

const Editor: React.FC<EditorProps> = ({
  initFgColor,
  initBgColor,
  initHexString,
}) => {
  const [fgColor, setFgColor] = useState(initFgColor);
  const [bgColor, setBgColor] = useState(initBgColor);
  const [showFgPicker, setShowFgPicker] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);

  // Refs for the modals
  const fgPickerRef = useRef<HTMLDivElement>(null);
  const bgPickerRef = useRef<HTMLDivElement>(null);

  // Close modal if user clicks outside of it
  const handleClickOutside = (event: MouseEvent) => {
    if (
      fgPickerRef.current &&
      !fgPickerRef.current.contains(event.target as Node)
    ) {
      setShowFgPicker(false);
    }
    if (
      bgPickerRef.current &&
      !bgPickerRef.current.contains(event.target as Node)
    ) {
      setShowBgPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        style={{ display: "flex", gap: "2rem", alignItems: "center" }}
        className="pb-6"
      >
        {/* Foreground Color Button */}
        <span style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
          <p>Pen Color</p>
          <button
            onClick={() => setShowFgPicker((prev) => !prev)}
            style={{
              backgroundColor: fgColor,
              width: "40px",
              height: "40px",
              border: "solid 0.25rem",
              borderColor: "foreground",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          ></button>
        </span>
        <span style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
          <p>Fill Color</p>
          <button
            onClick={() => setShowBgPicker((prev) => !prev)}
            style={{
              backgroundColor: bgColor,
              width: "40px",
              height: "40px",
              border: "solid 0.25rem",
              borderColor: "foreground",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          ></button>
        </span>
      </div>

      {/* Overlay */}
      {(showFgPicker || showBgPicker) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 999,
          }}
        >
          {/* Foreground Color Picker */}
          {showFgPicker && (
            <div
              ref={fgPickerRef}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "background",
                padding: "1rem",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                zIndex: 1000,
              }}
            >
              <HexColorPicker color={fgColor} onChange={setFgColor} />
              <button
                onClick={() => setShowFgPicker(false)}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: "#007BFF",
                  color: "white",
                }}
              >
                Close
              </button>
            </div>
          )}

          {/* Background Color Picker */}
          {showBgPicker && (
            <div
              ref={bgPickerRef}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "background",
                padding: "1rem",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                zIndex: 1000,
              }}
            >
              <HexColorPicker color={bgColor} onChange={setBgColor} />
              <button
                onClick={() => setShowBgPicker(false)}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: "#007BFF",
                  color: "white",
                }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}

      <CanvasGrid
        fg_color={fgColor}
        bg_color={bgColor}
        hexString={initHexString}
      />
    </>
  );
};

export default Editor;
