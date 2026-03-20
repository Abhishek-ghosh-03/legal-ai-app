import { useEffect, useState , useRef} from "react";
import API from "../services/api";
import UploadBox from "../components/UploadBox";
import { useNavigate, Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalDocs: 0,
    totalQueries: 0,
    totalSummaries: 0,
    growth: 0
  });
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const openUpload = params.get("upload");
  const uploadRef = useRef(null);
  useEffect(() => {
    if (openUpload && uploadRef.current) {
      uploadRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [openUpload]);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await API.get("/docs");
        setDocuments(res.data.docs || []);
      } catch {
        setDocuments([]);
      }
    };
    fetchDocs();
  }, []);

  return (
    <AppLayout>
      <div className="flex gap-6">


        <div className="w-64 bg-white rounded-xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <h1 className="text-xl font-bold text-blue-600 mb-6">
            ⚖️ Legal AI
          </h1>

          <div className="space-y-3">
            <SidebarItem active title="Dashboard" to="/dashboard" />

            <SidebarItem
              title="Documents"
              onClick={() =>
                window.open("https://github.com/", "_blank")
              }
            />

            <SidebarItem title="Analytics" to="/analytics" />
            <SidebarItem title="Settings" to="/settings" />
          </div>

          <div className="mt-6">
            <h2 className="text-sm text-gray-500 mb-2">Your Docs</h2>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {documents.slice(0, 3).map((doc) => (
                <div
                  key={doc._id}
                  onClick={() => navigate(`/document/${doc._id}`)}
                  className="p-2 bg-white rounded shadow cursor-pointer hover:bg-gray-100 text-sm"
                >
                  {doc.name}
                </div>
              ))}
            </div>
          </div>
        </div>


        <div className="flex-1">


          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <h1 className="text-xl font-semibold text-blue-600">
              Dashboard
            </h1>

            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">
                Welcome back, <span className="font-semibold">User</span>
              </p>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/");
                }}
                className="border px-4 py-2 rounded-lg hover:bg-gray-100 text-sm"
              >
                Logout
              </button>
            </div>
          </div>


          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Documents"
              value={stats.totalDocs}
              change="+12% from last month"
            />

            <StatCard
              title="Queries"
              value={stats.totalQueries}
              change="+5% from last month"
            />

            <StatCard
              title="Summaries"
              value={stats.totalSummaries}
              change="+8% from last month"
            />

            <StatCard
              title="Growth"
              value={stats.growth}
              change="Monthly usage"
            />
          </div>


          <div
            ref={uploadRef} 
            className="mb-6 bg-white p-6 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          >
            <UploadBox setDocuments={setDocuments} />
          </div>


          <div className="grid grid-cols-3 gap-6">

            <div className="col-span-2 bg-white p-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              <h2 className="font-semibold mb-4">Recent Documents</h2>

              {documents.slice(0, 3).map((doc) => (
                <div
                  key={doc._id}
                  onClick={() => navigate(`/document/${doc._id}`)}
                  className="p-2 border rounded mb-2 cursor-pointer hover:bg-gray-50"
                >
                  {doc.name}
                </div>
              ))}
            </div>

            <div className="bg-white p-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              <h2 className="font-semibold mb-4">Quick Stats</h2>

              <Stat label="Active Docs" value={documents.length} color="text-blue-600" />
              <Stat label="Avg Response" value="1.2s" color="text-green-600" />
              <Stat label="Accuracy" value="92%" color="text-purple-600" />
            </div>
          </div>


          <div className="mt-6 bg-white p-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <h2 className="font-semibold mb-4">Recent Activity</h2>

            <Activity text="Uploaded new document" tag="New" />
            <Activity text="Generated summary" tag="AI" />
            <Activity text="Asked a question" tag="Query" />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function SidebarItem({ title, active, to, onClick }) {
  if (to) {
    return (
      <Link
        to={to}
        className={`block p-2 rounded ${active ? "bg-blue-600 text-white" : "hover:bg-gray-100"
          }`}
      >
        {title}
      </Link>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`p-2 rounded cursor-pointer ${active ? "bg-blue-600 text-white" : "hover:bg-gray-100"
        }`}
    >
      {title}
    </div>
  );
}

function StatCard({ title, value, change }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex justify-between items-center">
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <h2 className="text-lg font-bold">{value}</h2>
        <p className="text-xs text-green-500">{change}</p>
      </div>
      <div className="bg-blue-500 text-white p-2 rounded">📊</div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="flex justify-between text-sm mb-2">
      <span>{label}</span>
      <span className={color}>{value}</span>
    </div>
  );
}

function Activity({ text, tag }) {
  return (
    <div className="flex justify-between bg-gray-100 p-2 rounded mb-2">
      <span>{text}</span>
      <span className="text-xs bg-blue-200 px-2 rounded">{tag}</span>
    </div>
  );
}