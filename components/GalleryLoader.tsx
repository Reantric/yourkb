"use client";

import Link from "next/link";
import Viewer from "./Viewer";
import { useEffect, useRef, useState } from "react";
import { getMoreImages } from "@/app/actions";

interface GalleryItem {
  id: number;
  fg_color: string;
  bg_color: string;
  value: string;
}

export default function GalleryLoader({
  initialData,
}: {
  initialData: GalleryItem[];
}) {
  const [items, setItems] = useState<GalleryItem[]>(initialData);
  const [foundNoMore, setFoundNoMore] = useState(false);

  const onReachedEnd = async () => {
    const nextItems = await getMoreImages(items.length);
    if (nextItems.length === 0) {
      setFoundNoMore(true);
    } else {
      setItems((prev) => [...prev, ...nextItems]);
    }
  };

  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        if (
          window.innerHeight + window.pageYOffset >=
          document.body.offsetHeight - 50
        ) {
          onReachedEnd();
        }
      }, 200); // debounce: wait 200ms after last scroll event
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return (
    <>
      <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {initialData.map((item) => (
          <Link href={`/view/${item.id}`} key={item.id}>
            <Viewer
              id={item.id}
              fgColor={item.fg_color}
              bgColor={item.bg_color}
              hexString={item.value}
              pixelSize={4}
              imageOnly={true}
            />
          </Link>
        ))}
      </ul>
      {foundNoMore && (
        <p className="text-center text-gray-500 mt-4">
          No more images to load.
        </p>
      )}
    </>
  );
}
