"use client";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Camera, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { processImageSearch } from "@/actions/home";
const HomeSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isImageSearchActive, setIsImageSearchActive] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [searchImage, setSearchImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  const {
    loading:isProcessing,
    fn:processImageFn,
    data:processResult,
    error:processError
  } = useFetch(processImageSearch);

  const handleTextSubmit = async(e) => {
    e.preventDefault();
    if(!searchTerm.trim()){
      toast.error("Please enter a search term");
      return;
    }
    router.push(`cars?search=${encodeURIComponent(searchTerm)}`)
  };
  const handleImageSearch = async(e) => {
    e.preventDefault();
    if(!searchImage){
      toast.error("Please upload an image first");
      return;
    }

    await processImageFn(searchImage);
  };

  useEffect(()=>{
    if(processError){
      toast.error("Failed to analyze image"+(processError.message || "Unknown Error"))
    }
  },[processError]);

  useEffect(()=>{
    if(processResult?.success){
      const params = new URLSearchParams();
      if(processResult.data.make ) params.set("make",processResult.data.make);
      if(processResult.data.bodyType){
        params.set("bodyType",processResult.data.bodyType);
      }
      if(processResult.data.color) params.set("color",processResult.data.color);

      router.push(`/cars?${params.toString()}`);
    }
  },[processResult])

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setIsUploading(true);
      setSearchImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setIsUploading(false);
        toast.success("Image uploaded successfully");
      };
      reader.onerror = () => {
        setIsUploading(false);
        toast.error("Failed to read the image");
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png"],
      },
      maxFiles: 1,
    });
  return (
    <div>
  <form onSubmit={handleTextSubmit}>
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
      <div className="relative w-full">
        <Input
          type="text"
          placeholder="Enter make, model, or use our AI image search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 pr-12 py-5 w-full rounded-full border border-gray-300 bg-white/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition-all duration-200"
        />
        <Camera
          size={24}
          onClick={() => setIsImageSearchActive(!isImageSearchActive)}
          className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer p-1.5 rounded-full transition-colors duration-200"
          style={{
            background: isImageSearchActive ? "black" : "",
            color: isImageSearchActive ? "white" : "#6b7280", // Tailwind gray-500
          }}
        />
      </div>

      <Button
        type="submit"
        className="rounded-full px-6 h-[3rem] w-full sm:w-auto text-white bg-black hover:bg-gray-800 transition"
      >
        Search
      </Button>
    </div>
  </form>

  {isImageSearchActive && (
    <div className="mt-6">
      <form onSubmit={handleImageSearch}>
        <div className="border-2 border-dashed border-gray-300 rounded-3xl p-6 text-center transition-all">
          {imagePreview ? (
            <div className="flex flex-col items-center">
              <img
                src={imagePreview}
                alt="Car Preview"
                className="h-40 object-contain mb-4 rounded-xl"
              />
              <Button
                variant="outline"
                onClick={() => {
                  setSearchImage(null);
                  setImagePreview("");
                  toast.info("Image Removed");
                }}
              >
                Remove Image
              </Button>
            </div>
          ) : (
            <div {...getRootProps()} className="cursor-pointer">
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-500 mb-2">
                  {isDragActive && !isDragReject
                    ? "Leave the file here to upload"
                    : "Drag & Drop a car image or click to select"}
                </p>
                {isDragReject && (
                  <p className="text-red-500 mb-2">Invalid image type</p>
                )}
                <p className="text-gray-400 text-sm">
                  Supports: JPEG, JPG, PNG (max 5MB)
                </p>
              </div>
            </div>
          )}
        </div>

        {imagePreview && (
          <Button
            variant="outline"
            type="submit"
            className="w-full mt-2"
            disabled={isUploading || isProcessing}
          >
            {isUploading
              ? "Uploading..."
              : isProcessing
              ? "Analyzing Image"
              : "Search with this image"}
          </Button>
        )}
      </form>
    </div>
  )}
</div>

  );
};

export default HomeSearch;
