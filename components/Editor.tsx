"use client";

import React, { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import Canvas from "./Canvas";
import { Button } from "./ui/button";
import { hexadecimalToBitmask } from "@/lib/bits";
import { Switch } from "./ui/switch";
import {
  EraserIcon,
  PaintBucketIcon,
  PencilLineIcon,
  XIcon,
} from "lucide-react";
import { Toggle } from "./ui/toggle";
import { Input } from "./ui/input";

function ColorSelectorToggleButton({
  tooltip,
  color,
  onClick,
}: {
  tooltip?: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      title={tooltip}
      className={`w-6 h-6 border-2 rounded border-foreground cursor-pointer`}
      style={{ backgroundColor: color }}
      onClick={onClick}
    />
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
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background p-4 rounded shadow-lg items-center flex flex-col justify-center"
        ref={ref}
      >
        <HexColorPicker color={color} onChange={onChange} />
        <Input
          type="text"
          value={color}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          className="w-full mt-2"
        />
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

function Editor({
  initFgColor,
  initBgColor,
  initHexString,
}: {
  initFgColor: string;
  initBgColor: string;
  initHexString: string;
}) {
  // drawing state
  const [drawing, setDrawing] = useState(false);
  const [isSecondary, setisSecondary] = useState(false);
  const [bitmask, setBitmask] = useState<BigUint64Array>(
    hexadecimalToBitmask(initHexString),
  );
  // tool state
  const [isPen, setIsPen] = useState(true);

  // color and color selector modal state
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
      {/*
       * Actions header
       */}
      <div className="flex flex-row justify-between pb-4 items-center">
        <div className="flex flex-row items-center">
          <div className="flex flex-row gap-2 items-center">
            <Toggle
              pressed={isPen}
              onPressedChange={(newState) => {
                if (newState === false) {
                  return;
                }
                setIsPen(newState);
              }}
              className="p-2.5"
              title={isSecondary ? "Erase" : "Draw"}
            >
              {isSecondary ? (
                <EraserIcon className="w-5 h-5" />
              ) : (
                <PencilLineIcon className="w-5 h-5" />
              )}
            </Toggle>
            <Toggle
              pressed={!isPen}
              onPressedChange={(newState) => {
                if (newState === false) {
                  return;
                }
                setIsPen(!newState);
              }}
              className="p-2.5"
              title="Fill"
            >
              <PaintBucketIcon className="w-5 h-5" />
            </Toggle>
            <Button
              title="Clear Canvas"
              className="bg-inherit hover:bg-red-600"
              onClick={() => {
                setBitmask(hexadecimalToBitmask("0".repeat(4096)));
              }}
            >
              <XIcon className="w-5 h-5 text-foreground" />
            </Button>
          </div>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <div className="flex flex-row gap-2 items-center">
            <ColorSelectorToggleButton
              tooltip="This is the default color for the pen."
              color={fgColor}
              onClick={() => {
                setShowFgPicker(true);
                setisSecondary(false);
              }}
            />
            <Switch
              className="data-[state=checked]:bg-foreground data-[state=unchecked]:bg-foreground"
              checked={isSecondary}
              onCheckedChange={setisSecondary}
            />
            <ColorSelectorToggleButton
              tooltip="Clearing the canvas will set it to this color."
              color={bgColor}
              onClick={() => {
                setShowBgPicker(true);
                setisSecondary(true);
              }}
            />
          </div>
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
        isSecondary={isSecondary}
        isPen={isPen}
        bitmask={bitmask}
        setBitmask={setBitmask}
      />
    </>
  );
}

export default Editor;
