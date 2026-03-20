import { useState } from "react";
import API from "../services/api";

export default function UploadBox({ setDocuments }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await API.post("/docs/upload", formData);

    setDocuments((prev) => [
        { _id: res.data.id, name: file.name },
        ...prev,
    ]);
  };

  return (
    <div className="bg-white p-4 rounded">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}