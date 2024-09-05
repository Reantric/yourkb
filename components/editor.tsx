"use client"

import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import CanvasGrid from './canvasGrid';

interface EditorProps {
    initFgColor: string;
    initBgColor: string;
    initHexString: string;
}

const Editor: React.FC<EditorProps> = ({ initFgColor, initBgColor, initHexString }) => {
    const [fgColor, setFgColor] = useState(initFgColor);
    const [bgColor, setBgColor] = useState(initBgColor);
    return <>
        <div>
            <HexColorPicker color={fgColor} onChange={setFgColor} />
        </div>
        <div>
            <HexColorPicker color={bgColor} onChange={setBgColor} />
        </div>
        <CanvasGrid fg_color={fgColor} bg_color={bgColor} hexString={initHexString}></CanvasGrid>
    </>;
}

export default Editor;