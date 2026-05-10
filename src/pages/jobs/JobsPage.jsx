import { useState } from 'react';
import { MapPin, Briefcase, DollarSign, Clock, Building, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';

const mockJobs = [
  {
    id: 1,
    company: 'TechVision Inc',
    role: 'Senior Frontend Engineer',
    location: 'Remote, US',
    type: 'Full-time',
    salary: '$130k - $160k',
    match: 94,
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
    postedAt: '2 days ago',
    logo: 'T',
    saved: false,
  },
  {
    id: 2,
    company: 'FinServe Global',
    role: 'React UI Developer',
    location: 'New York, NY',
    type: 'Hybrid',
    salary: '$110k - $140k',
    match: 88,
    skills: ['React', 'JavaScript', 'Redux', 'CSS'],
    postedAt: '5 hours ago',
    logo: 'F',
    saved: true,
  },
  {
    id: 3,
    company: 'CloudScale',
    role: 'Full Stack Engineer',
    location: 'San Francisco, CA',
    type: 'On-site',
    salary: '$140k - $180k',
    match: 75,
    skills: ['React', 'Node.js', 'AWS', 'PostgreSQL'],
    postedAt: '1 week ago',
    logo: 'C',
    saved: false,
  },
  {
    id: 4,
    company: 'StartupX',
    role: 'Frontend Web Developer',
    location: 'Remote, Global',
    type: 'Contract',
    salary: '$60 - $80 / hr',
    match: 91,
    skills: ['React', 'Tailwind', 'Framer Motion'],
    postedAt: 'Just now',
    logo: 'S',
    saved: false,
  }
];

const JobsPage = () => {
  const [jobs, setJobs] = useState(mockJobs);

  const toggleSave = (id) => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, saved: !job.saved } : job
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Recommended Jobs</h1>
          <p className="text-slate-400 mt-1">Based on your resume analysis, here are the best matches.</p>
        </div>
        
        <div className="flex gap-3">
          <select className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500">
            <option>Match Score: High to Low</option>
            <option>Date: Newest First</option>
            <option>Salary: High to Low</option>
          </select>
          <button className="btn-secondary">Filter</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
        {jobs.map((job) => (
          <div key={job.id} className="glass-card p-6 flex flex-col h-full group relative overflow-hidden">
            {/* Match Badge Background Effect */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 -z-10 rounded-full transition-colors duration-500 ${
              job.match >= 90 ? 'bg-emerald-500' : job.match >= 80 ? 'bg-blue-500' : 'bg-yellow-500'
            }`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold text-slate-200">
                  {job.logo}
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 line-clamp-1">{job.role}</h3>
                  <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                    <Building className="w-3.5 h-3.5" />
                    <span>{job.company}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => toggleSave(job.id)}
                className="text-slate-400 hover:text-blue-400 transition-colors p-1"
              >
                {job.saved ? <BookmarkCheck className="w-6 h-6 text-blue-500" /> : <Bookmark className="w-6 h-6" />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="line-clamp-1">{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span className="line-clamp-1">{job.salary}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                <Briefcase className="w-4 h-4 text-blue-500" />
                <span className="line-clamp-1">{job.type}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                <Clock className="w-4 h-4 text-purple-500" />
                <span className="line-clamp-1">{job.postedAt}</span>
              </div>
            </div>

            <div className="mb-6 flex-grow">
              <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 mt-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <svg className="w-10 h-10 transform -rotate-90">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="#1e293b" strokeWidth="4" />
                    <circle 
                      cx="20" cy="20" r="16" 
                      fill="none" 
                      stroke={job.match >= 90 ? '#10b981' : job.match >= 80 ? '#3b82f6' : '#eab308'} 
                      strokeWidth="4"
                      strokeDasharray={`${(job.match / 100) * 100} 100`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-200">
                    {job.match}%
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-400">Match Profile</span>
              </div>
              <button className="btn-primary py-2 px-4 shadow-none bg-slate-100 text-slate-900 hover:bg-white flex items-center gap-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                Apply <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsPage;
