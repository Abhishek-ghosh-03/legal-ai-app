import { useState } from "react";
import API from "../services/api";

export default function UploadBox({ setDocuments, refreshDocs, refreshStats }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("/docs/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setDocuments(prev => [res.data, ...prev]);

      refreshDocs && refreshDocs();
      refreshStats && refreshStats();

      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div>
      {/* FILE INPUT */}
      <div className="mb-3">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm"
        />

        {/* FILE NAME DISPLAY */}
        {file && (
          <p className="mt-2 text-sm text-gray-600 truncate">
            Selected: {file.name}
          </p>
        )}
      </div>

      {/* BUTTON */}
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload
      </button>
    </div>
  );
}