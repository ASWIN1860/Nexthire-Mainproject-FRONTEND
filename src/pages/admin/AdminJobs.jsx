import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, ShieldCheck, MapPin } from 'lucide-react';

const initialJobs = [
  { id: 1, title: 'Senior React Developer', company: 'TechNova', type: 'Full-time', location: 'Remote', applicants: 142, status: 'Active' },
  { id: 2, title: 'Frontend Engineer', company: 'Stripe', type: 'Full-time', location: 'San Francisco, CA', applicants: 89, status: 'Active' },
  { id: 3, title: 'Web Developer', company: 'AgencyX', type: 'Contract', location: 'New York, NY', applicants: 34, status: 'Closed' },
];

const AdminJobs = () => {
  const [jobs] = useState(initialJobs);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Job Board Management</h1>
          <p className="text-slate-400 mt-1">Add, edit, or remove job listings from the platform.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"/>
            <input 
              type="text" 
              placeholder="Search jobs..." 
              className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="glass-card p-6 flex flex-col group relative">
            {job.status === 'Closed' && (
               <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] z-10 rounded-2xl flex items-center justify-center">
                 <span className="px-4 py-2 bg-slate-900/80 border border-slate-700 text-slate-300 font-bold rounded-lg transform -rotate-12">CLOSED</span>
               </div>
            )}
            
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold text-slate-200">
                {job.company.charAt(0)}
              </div>
              <div className="flex gap-1 z-20">
                <button className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors bg-slate-900/80">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors bg-slate-900/80">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-100 text-lg">{job.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{job.company}</p>
            </div>

            <div className="space-y-2 mt-auto text-sm text-slate-300 mb-6">
               <div className="flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-blue-400" />
                 {job.type}
               </div>
               <div className="flex items-center gap-2">
                 <MapPin className="w-4 h-4 text-emerald-400" />
                 {job.location}
               </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center text-sm">
               <span className="text-slate-400"><span className="text-blue-400 font-bold text-base">{job.applicants}</span> applicants</span>
               <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                 job.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'
               }`}>
                 {job.status}
               </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminJobs;
