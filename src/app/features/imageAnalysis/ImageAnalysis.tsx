"use client";

import { uploadImageForAnalysis } from "./api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, RotateCw, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type AnalysisResult = {
  result: {
    reasoning_content: string;
    [key: string]: unknown;
  };
};

const ImageAnalysisTab = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      alert("Please select an image first!");
      return;
    }

    setLoading(true);
    try {
      const response = await uploadImageForAnalysis(selectedImage);
      setResult(response);

      console.log("Backend response:", response);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to analyze image");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="gap-2 flex flex-col">
      <div className="flex justify-between">
        <p className="text-[#09090B] font-sans text-xl font-semibold leading-7 tracking-normal flex flex-row gap-2">
          <Sparkles />
          Image Analysis
        </p>
        <Button variant="outline" className="h-10 w-12">
          <RotateCw />
        </Button>
      </div>
      <p className="text-[#71717A] font-sans text-sm font-normal leading-5 tracking-normal">
        Upload a food photo, and AI will detect the ingredients.
      </p>
      <Input
        id="picture"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="cursor-pointer"
      />
      {previewUrl && (
        <div className="border rounded-lg p-1 w-50">
          <Image
            src={previewUrl}
            alt="Preview"
            width={200}
            height={133}
            className="max-w-full h-auto max-h-64 mx-auto rounded-[6px]"
          />
        </div>
      )}
      <div className="w-full flex justify-end">
        <Button
          onClick={handleGenerate}
          disabled={!selectedImage || loading}
          className="w-fit"
        >
          {loading ? (
            <>
              <RotateCw className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
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
        <FileText />
        Here is the summary
      </p>

      <p> {result?.result?.reasoning_content}</p>
    </div>
  );
};
export default ImageAnalysisTab;
