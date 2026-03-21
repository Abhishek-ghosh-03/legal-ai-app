import bg from "../assets/bg.png";

export default function AppLayout({ children }) {
  return (
    <div className="overflow-x-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <div className="bg-white/60 backdrop-blur-sm min-h-screen p-4">
        {children}
      </div>
    </div>
  );
}