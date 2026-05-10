import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-50 selection:bg-blue-500/30">
      <Navbar isAdmin={true} onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <Sidebar isAdmin={true} isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <main className="lg:pl-64 pt-16 min-h-screen transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto h-full w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
