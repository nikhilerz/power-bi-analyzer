import { Link, useLocation } from 'react-router-dom';
import { LineChart, Upload, Home, Activity } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <LineChart className="h-6 w-6 text-primary-600" />
              <span className="font-bold text-xl text-slate-800 tracking-tight">Power BI Analyzer</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/') ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link 
              to="/upload" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/upload') ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <Upload className="h-4 w-4" />
              Upload
            </Link>
            <Link 
              to="/dashboard" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard') ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <Activity className="h-4 w-4" />
              Analysis
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
