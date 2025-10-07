"use client";

import { useState, useRef } from "react";
import Button from "@/components/common/Button";
import { uploadApi, UploadType, UploadResponse } from "@/api/upload";
import { ApiError } from "@/api/shared";

const SimpleUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<
    UploadResponse | { error: string } | null
  >(null);
  const [uploadType, setUploadType] = useState<UploadType>("prompt");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      const result = await uploadApi.upload({
        file,
        type: uploadType,
        metadata: {
          title: file.name,
          isPublic: true,
        },
      });

      setUploadResult(result);
    } catch (error) {
      console.error("Upload error:", error);

      if (error instanceof ApiError) {
        setUploadResult({ error: error.message });
      } else {
        setUploadResult({ error: "Upload failed" });
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="bg-bg-col/50 backdrop-blur-sm rounded-xl border border-text-col/20 p-6 max-w-md mx-auto">
      <h3 className="text-lg font-medium text-text-col mb-4">
        Simple S3 Upload
      </h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-col">
            Upload Type
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setUploadType("prompt")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                uploadType === "prompt"
                  ? "bg-accent-col text-white"
                  : "bg-bg-col/30 text-text-col hover:bg-bg-col/50"
              }`}
            >
              Prompt
            </button>
            <button
              type="button"
              onClick={() => setUploadType("challenge")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                uploadType === "challenge"
                  ? "bg-accent-col text-white"
                  : "bg-bg-col/30 text-text-col hover:bg-bg-col/50"
              }`}
            >
              Challenge
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
        />

        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          variant="primary"
          size="lg"
          className="w-full"
        >
          {isUploading ? "Uploading..." : "Select File"}
        </Button>

        {uploadResult && (
          <div className="mt-4 p-4 bg-bg-col/30 rounded-lg">
            {"error" in uploadResult ? (
              <p className="text-red-400">Error: {uploadResult.error}</p>
            ) : (
              <div className="space-y-2">
                <p className="text-green-400">✅ Upload successful!</p>
                <p className="text-sm text-text-col/70">
                  <strong>File:</strong> {uploadResult.filename}
                </p>
                <p className="text-sm text-text-col/70">
                  <strong>Type:</strong> {uploadResult.upload_type}
                </p>
                <p className="text-sm text-text-col/70">
                  <strong>Bucket:</strong> {uploadResult.bucket_name}
                </p>
                <p className="text-sm text-text-col/70">
                  <strong>S3 Key:</strong> {uploadResult.s3_key}
                </p>
                <a
                  href={uploadResult.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-col hover:underline text-sm"
                >
                  View File →
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleUpload;
