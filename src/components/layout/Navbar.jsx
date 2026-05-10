import { Bell, Search, Menu } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import { useEffect, useState } from 'react';

const Navbar = ({ onMenuClick, isAdmin = false }) => {
  const [profile,setProfile]=useState("")

  useEffect(()=>{
    const DP=sessionStorage.getItem("dp")
    if(DP){
      setProfile(DP)
    }
  },[])
  return (
    <header className="h-16 lg:pl-64 glass-panel border-b border-slate-800/80 fixed top-0 w-full z-30 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-full hover:bg-slate-800/50">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse"></span>
        </button>
      <ProfileDropdown isAdmin={isAdmin} profile={profile}/>
        
      </div>
    </header>
  );
};

export default Navbar;
