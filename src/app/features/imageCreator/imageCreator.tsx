"use client";

import { createFoodImage } from "@/app/api/imageCreator";
import { Button } from "@/components/ui/button";
import { FileText, RotateCw, Sparkles } from "lucide-react";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ImageCreatorTab() {
  const [loading, setLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState("");
  const [panels, setPanels] = useState<{ caption: string; image: string }[]>(
    []
  );

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a description");
      return;
    }

    setLoading(true);
    try {
      const response = await createFoodImage(prompt);

      console.log("Generated image:", response);

      setPanels(response.result);
    } catch (error) {
      console.error(error);
      alert("Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gap-2 flex flex-col">
      <div className="flex justify-between">
        <p className="text-[#09090B] font-sans text-xl font-semibold leading-7 tracking-normal flex flex-row gap-2">
          <Sparkles />
          Comic image generator
        </p>
        <Button variant="outline" className="h-10 w-12">
          <RotateCw />
        </Button>
      </div>

      <p className="text-[#71717A] font-sans text-sm font-normal leading-5 tracking-normal">
        Right now you are a comic writer. Let your imagination come to life.
      </p>
      <textarea
        id="picture"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="cursor-pointer flex h-[124px] p-2.5 items-start self-stretch rounded-md border border-[#E4E4E7] bg-white"
      />

      <div className="w-full flex justify-end">
        <Button onClick={handleGenerate} disabled={loading} className="w-fit">
          {loading ? (
            <>
              <RotateCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Generate
            </>
          )}
        </Button>
      </div>

      <p className="text-[#09090B] font-sans text-xl font-semibold leading-7 tracking-normal flex flex-row gap-2">
        <ImageIcon />
        Result
      </p>

      <div className="comic">
        {panels.map((panel, index) => (
          <div key={index} className={`panel panel-${index}`}>
            <Image src={panel.image} alt={`Panel ${index + 1}`} />
            <p>{panel.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
