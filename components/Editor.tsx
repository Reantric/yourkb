"use client";

import React, { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import Canvas from "./Canvas";
import { Button } from "./ui/button";
import { bitmaskToHexadecimal, hexadecimalToBitmask } from "@/lib/bits";
import { Switch } from "./ui/switch";
import {
  EraserIcon,
  PaintBucketIcon,
  PencilLineIcon,
  RedoIcon,
  SaveIcon,
  UndoIcon,
  XIcon,
} from "lucide-react";
import { Toggle } from "./ui/toggle";
import { Input } from "./ui/input";
import { useToast } from "./hooks/use-toast";
import { Toaster } from "./ui/toaster";

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
  const [latestStates, setLatestStates] = useState<BigUint64Array[]>([]);
  const [futureStates, setFutureStates] = useState<BigUint64Array[]>([]);

  const { toast } = useToast();

  const checkpointStateBeforeNewAction = () => {
    setLatestStates((prev) => [...prev, bitmask]);
    setFutureStates([]); // clear future states on new action
  };

  const undo = () => {
    if (latestStates.length === 0) {
      return;
    }
    setFutureStates((prev) => [...prev, bitmask]);
    setBitmask(latestStates[latestStates.length - 1]);
    setLatestStates((prev) => prev.slice(0, -1));
  };

  const redo = () => {
    if (futureStates.length === 0) {
      return;
    }
    setLatestStates((prev) => [...prev, bitmask]);
    setBitmask(futureStates[futureStates.length - 1]);
    setFutureStates((prev) => prev.slice(0, -1));
  };

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

  // Save handler: send hex string of current grid state
  const handleSave = async () => {
    const response = await fetch("/api/updatekb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bgColor,
        fgColor,
        value: bitmaskToHexadecimal(bitmask),
      }),
    });

    if (!response.ok) {
      toast({ title: "Failed to save changes", variant: "destructive" });
      return;
    }
    toast({ title: "Changes saved successfully!", variant: "success" });
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const ctrlOrCmd = isMac ? event.metaKey : event.ctrlKey;

      if (ctrlOrCmd && event.key === "z") {
        // Undo (Ctrl+Z or Cmd+Z)
        event.preventDefault();
        if (event.shiftKey) {
          // Redo (Ctrl+Shift+Z or Cmd+Shift+Z)
          redo();
        } else {
          undo();
        }
      } else if (ctrlOrCmd && event.key === "y") {
        // Redo (Ctrl+Y)
        event.preventDefault();
        redo();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo]);

  return (
    <>
      {/*
       * Actions header
       */}

      <div className="flex flex-row justify-between pb-2 items-center">
        <div className="flex flex-row items-center gap-2">
          <Button
            className="p-2.5"
            variant="secondary"
            disabled={latestStates.length === 0}
            onClick={undo}
          >
            <UndoIcon className="w-5 h-5" />
          </Button>
          <Button
            className="p-2.5"
            variant="secondary"
            disabled={futureStates.length === 0}
            onClick={redo}
          >
            <RedoIcon className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex flex-row items-center">
          <Button onClick={handleSave} className="p-2.5 bg-blue-500">
            <SaveIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-row justify-between pb-2 items-center">
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
              className="p-2.5"
              variant="destructive"
              onClick={() => {
                checkpointStateBeforeNewAction();
                setBitmask(new BigUint64Array(64));
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
      <Toaster />

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
        checkpointStateBeforeNewAction={checkpointStateBeforeNewAction}
      />
    </>
  );
}

export default Editor;
