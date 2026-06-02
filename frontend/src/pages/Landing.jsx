import { Link } from 'react-router-dom';
import { Database, BrainCircuit, LayoutDashboard, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary-400 to-primary-800 text-white flex items-center justify-center relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <polygon fill="white" points="0,100 100,0 100,100" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Power BI Dashboard <br /> Analyzer
            </h1>
            <p className="text-lg md:text-xl text-primary-100 max-w-xl">
              Transform your datasets into actionable insights with AI-powered analysis. Get instant recommendations for DAX measures, chart visualizations, and KPI metrics.
            </p>
            
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 flex items-center gap-2 border border-white/20">
                <BrainCircuit className="h-5 w-5 text-primary-200" />
                <span className="text-sm font-medium">Smart Analytics</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 flex items-center gap-2 border border-white/20">
                <span className="font-mono font-bold text-primary-200">{'</>'}</span>
                <span className="text-sm font-medium">DAX Generation</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 flex items-center gap-2 border border-white/20">
                <LayoutDashboard className="h-5 w-5 text-primary-200" />
                <span className="text-sm font-medium">Chart Recommendations</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 flex items-center gap-2 border border-white/20">
                <ActivityIcon />
                <span className="text-sm font-medium">KPI Insights</span>
              </div>
            </div>

            <div>
              <Link to="/upload" className="inline-flex items-center gap-2 bg-primary-500 text-slate-900 font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl hover:bg-primary-400 transition-all text-lg">
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="hidden lg:block relative h-[500px]">
            {/* Animated Workflow Cards Concept */}
            <div className="absolute top-[10%] right-[10%] transform rotate-[-5deg] bg-white rounded-2xl p-6 shadow-2xl text-slate-800 w-48 text-center animate-bounce z-10" style={{animationDuration: '3s'}}>
              <Database className="h-12 w-12 mx-auto text-primary-500 mb-2" />
              <div className="font-bold">Upload Data</div>
            </div>
            
            <div className="absolute top-[40%] right-[25%] transform rotate-[2deg] bg-white rounded-2xl p-6 shadow-2xl text-slate-800 w-48 text-center animate-bounce z-20" style={{animationDuration: '3.5s', animationDelay: '0.5s'}}>
              <BrainCircuit className="h-12 w-12 mx-auto text-primary-500 mb-2" />
              <div className="font-bold">Smart Analysis</div>
            </div>

            <div className="absolute top-[70%] right-[5%] transform rotate-[-3deg] bg-white rounded-2xl p-6 shadow-2xl text-slate-800 w-48 text-center animate-bounce z-30" style={{animationDuration: '3.2s', animationDelay: '1s'}}>
              <LayoutDashboard className="h-12 w-12 mx-auto text-primary-500 mb-2" />
              <div className="font-bold">Dashboard Ready</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Helper for icon
const ActivityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-200">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);

export default Landing;
