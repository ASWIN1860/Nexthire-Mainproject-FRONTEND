import { NavLink ,useNavigate} from 'react-router-dom';
import { LayoutDashboard, FileText, Upload, Briefcase, Settings, LogOut, Users, FileBarChart, X, ClipboardList } from 'lucide-react';
import { cn } from '../../utils/cn';

const Sidebar = ({ isAdmin = false, isOpen, onClose }) => {

  const navigate=useNavigate()

   const handleLogout = () => {
    sessionStorage.clear()
    setIsOpen(false);
    navigate('/login');
  };

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload Resume', path: '/resume/upload', icon: Upload },
    { name: 'Latest Result', path: '/resume/result', icon: FileText },
    { name: 'Find Jobs', path: '/jobs', icon: Briefcase },
  ];

  const adminLinks = [
    { name: 'Overview', path: '/admin/dashboard', icon: FileBarChart },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Manage Jobs', path: '/admin/jobs', icon: Briefcase },
    { name: 'Applications', path: '/admin/applications', icon: ClipboardList },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-screen w-64 glass-panel border-r border-slate-800/80 flex flex-col z-50 transition-transform duration-300 ease-in-out",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              NextHire <span className="text-blue-500">{isAdmin ? 'Admin' : ''}</span>
            </span>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 font-medium",
                      isActive
                        ? "bg-blue-600/10 text-blue-500 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                    )
                  }
                >
                {({ isActive }) => (
                  <>
                    <Icon className={cn("w-5 h-5", isActive ? "text-blue-500" : "text-slate-400")} />
                    <span>{link.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
