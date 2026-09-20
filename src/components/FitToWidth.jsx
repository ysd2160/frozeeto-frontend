import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

// A4 jaisa fixed-width "page" (invoice) ko screen ki chaudai mein fit karke dikhata hai,
// taaki phone par bhi bilkul PDF jaisa dikhe. "Zoom" se 100% size par scroll karke padh sakte ho.
const FitToWidth = ({ width = 794, children }) => {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [avail, setAvail] = useState(width);
  const [height, setHeight] = useState(0);
  const [zoom, setZoom] = useState(false);

  const measure = () => {
    if (outerRef.current) setAvail(outerRef.current.clientWidth);
    if (innerRef.current) setHeight(innerRef.current.offsetHeight);
  };

  useLayoutEffect(measure);

  useEffect(() => {
    window.addEventListener("resize", measure);
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      if (outerRef.current) ro.observe(outerRef.current);
      if (innerRef.current) ro.observe(innerRef.current);
    }
    return () => {
      window.removeEventListener("resize", measure);
      ro?.disconnect();
    };
  }, []);

  const fitScale = Math.min(1, avail / width);
  const scale = zoom ? 1 : fitScale;

  return (
    <div className="space-y-2">
      <div
        ref={outerRef}
        className={`${zoom ? "overflow-x-auto" : "overflow-hidden"} rounded-xl border border-gray-200 bg-white shadow-sm`}
      >
        <div style={{ width: width * scale, height: height * scale }}>
          <div ref={innerRef} style={{ width, transform: `scale(${scale})`, transformOrigin: "top left" }}>
            {children}
          </div>
        </div>
      </div>
      {(fitScale < 0.95 || zoom) && (
        <button onClick={() => setZoom((z) => !z)} className="w-full text-sm text-primary-700 font-medium py-2">
          {zoom ? "↔ Screen ke hisaab se fit karo" : "🔍 Zoom (100%) - padhne ke liye"}
        </button>
      )}
    </div>
  );
};

export default FitToWidth;
