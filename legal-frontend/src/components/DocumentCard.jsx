import { useNavigate } from "react-router-dom";

export default function DocumentCard({ doc }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3>{doc.name}</h3>
      <button onClick={() => navigate(`/document/${doc._id}`)}>
        Open
      </button>
    </div>
  );
}