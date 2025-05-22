import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white p-10">
      <div className="text-center space-y-6 max-w-3xl">
        <img src="/logo_resized_120.png" alt="AEGIX Logo" className="mx-auto w-28 h-28" />
        <h1 className="text-4xl font-bold text-cyan-400">Welcome to AEGIX</h1>
        <p className="text-lg text-gray-300 leading-relaxed">
          AEGIX is an AI-powered OSINT platform that autonomously gathers and analyzes public data.<br />
          It delivers real-time monitoring, risk detection, predictive analytics,<br />
          and actionable intelligence — helping organizations anticipate and mitigate risks.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-cyan-700 hover:bg-cyan-800 text-white px-6 py-2 rounded-lg transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Welcome;