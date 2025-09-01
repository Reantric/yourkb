"use client";

import React, { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import Canvas from "./Canvas";
import { Button } from "./ui/button";

interface EditorProps {
  initFgColor: string;
  initBgColor: string;
  initHexString: string;
}

function ColorSelectorToggleButton({
  text,
  color,
  setShowPicker,
}: {
  text: string;
  color: string;
  setShowPicker: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <span style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
      <p>{text}</p>
      <button
        onClick={() => setShowPicker((prev) => !prev)}
        style={{
          backgroundColor: color,
          width: "40px",
          height: "40px",
          border: "solid 0.25rem",
          borderColor: "foreground",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      ></button>
    </span>
  );
}

function ColorSelectorPopover({
  color,
  onChange,
  onClose,
  showSelector,
  ref,
  originalColor,
}: {
  showSelector: boolean;
  color: string;
  originalColor: string;
  onChange: (color: string) => void;
  onClose: () => void;
  ref: React.RefObject<HTMLDivElement>;
}) {
  if (!showSelector) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 w-full h-full">
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background p-4 rounded shadow-lg"
        ref={ref}
      >
        <HexColorPicker color={color} onChange={onChange} />
        <div className="flex flex-row justify-end gap-2">
          <Button
            disabled={originalColor === color}
            onClick={() => onChange(originalColor)}
            className="mt-2"
          >
            Reset
          </Button>
          <Button onClick={onClose} className="mt-2">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

const Editor: React.FC<EditorProps> = ({
  initFgColor,
  initBgColor,
  initHexString,
}) => {
  // drawing state
  const [drawing, setDrawing] = useState(false);
  const [isEraser, setIsEraser] = useState(false);

  // color state
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
      <div className="flex flex-row justify-between pb-4">
        <div className="flex flex-row"></div>
        <div className="flex flex-row gap-2">
          {/* Foreground Color Button */}
          <ColorSelectorToggleButton
            text="Pen Color"
            color={fgColor}
            setShowPicker={setShowFgPicker}
          />
          <ColorSelectorToggleButton
            text="Fill Color"
            color={bgColor}
            setShowPicker={setShowBgPicker}
          />
        </div>
      </div>

      {/* Overlay */}
      <ColorSelectorPopover
        color={fgColor}
        originalColor={initFgColor}
        onChange={setFgColor}
        onClose={() => setShowFgPicker(false)}
        showSelector={showFgPicker}
        ref={fgPickerRef}
      />
      <ColorSelectorPopover
        color={bgColor}
        originalColor={initBgColor}
        onChange={setBgColor}
        onClose={() => setShowBgPicker(false)}
        showSelector={showBgPicker}
        ref={bgPickerRef}
      />

      <Canvas
        fgColor={fgColor}
        bgColor={bgColor}
        hexString={initHexString}
        drawing={drawing}
        setDrawing={setDrawing}
        isEraser={isEraser}
        setIsEraser={setIsEraser}
      />
    </>
  );
};

export default Editor;
