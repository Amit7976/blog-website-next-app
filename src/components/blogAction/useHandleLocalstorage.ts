"use client"
import { useEffect } from "react";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type Blog = {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  tags: string;
  status: string;
  imageTitle: string;
  image: string | null;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface HandleLocalstorageProps {
  hashValue: string;
  setDataLoading: (loading: boolean) => void;
  setData: React.Dispatch<React.SetStateAction<Blog>>;
  setContent: (content: string) => void;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function useHandleLocalstorage({
  hashValue,
  setDataLoading,
  setData,
  setContent,
}: HandleLocalstorageProps) {
  // SET DATA FROM LOCALSTORAGE
  useEffect(() => {
    if (typeof window !== "undefined" && hashValue) {
      const saved = localStorage.getItem(hashValue);

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      setDataLoading(true);

      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      if (saved) {
        const parsed = JSON.parse(saved);
        console.log("Parsed:", parsed);

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        setData((prev: Blog) => ({
          ...prev,
          title: parsed.title || "",
          shortDescription: parsed.shortDescription || "",
          description: parsed.description || "",
          category: parsed.category || "General",
          tags: parsed.tags || "",
          status: parsed.status || "draft",
          imageTitle: parsed.imageTitle || "",
        }));

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        
        if (typeof parsed.description === "string") {
          setContent(parsed.description);
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        setDataLoading(false);
      } else {
        setDataLoading(false);
      }
    }
  }, [hashValue]);
}
