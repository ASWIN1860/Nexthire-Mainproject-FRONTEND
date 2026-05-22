/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, File, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'

import { uploadResumeApi } from '../../services/allApis';

const ResumeUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (uploadedFile) => {
    // Only accept PDF/DOCX for this mock
    if (uploadedFile.type === 'application/pdf' || uploadedFile.name.endsWith('.docx')) {
      setFile(uploadedFile);
    } else {
      alert('Please upload a PDF or DOCX file.');
    }
  };

  const removeFile = () => setFile(null);

  const handleUploadResume=async() => {
    if(!file){
      toast.warning("Please upload resume")
      return
    }
    const reqBody=new FormData()
    reqBody.append("resume",file)
    if (jobDescription) {
      reqBody.append("jobDescription", jobDescription)
    }
    if(!jobDescription){
      toast.error("Please add job description")
    }
    try{
      setIsUploading(true)
      const result=await uploadResumeApi(reqBody)
      console.log(result)
      if(result.status===200){
        navigate('/resume/result')
      }
    }
    catch(err){
      if(err.response){
        toast.error(err.response.data)
      }
      else{
        toast.error("Something went wrong!!")
      }
      }
     
    finally{
      setIsUploading(false)
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Upload Your Resume</h1>
        <p className="text-slate-400 mt-1">Upload your resume for AI-powered analysis and scoring.</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl mt-6">
        {!file ? (
          <div 
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-slate-700 bg-slate-800/20 hover:bg-slate-800/40 hover:border-slate-600'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 mx-auto bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-medium text-slate-200 mb-2">Drag & Drop your resume</h3>
            <p className="text-slate-500 mb-6">Supported formats: PDF, DOCX. Max size: 5MB</p>
            
            <label className="btn-primary cursor-pointer inline-flex">
              <span>Browse Files</span>
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.docx,application/pdf"
                onChange={handleChange}
              />
            </label>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border border-slate-700 bg-slate-800/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                  <File className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-slate-200 font-medium">{file.name}</p>
                  <p className="text-slate-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={removeFile}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                disabled={isUploading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isUploading && (
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-blue-400 font-medium flex items-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <AlertCircle className="w-4 h-4" />
                    </motion.div>
                    Analyzing with AI...
                  </span>
                  <span className="text-blue-400 font-bold">100%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2">
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: '78%' }}
                    transition={{ duration: 2 }}
                    className="h-2 rounded-full bg-blue-500 relative"
                  >
                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress_1s_linear_infinite]" />
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <div className="glass-panel p-8 rounded-3xl mt-6">
        <h3 className="text-xl font-medium text-slate-200 mb-4">Job Description</h3>
        <textarea
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors resize-none placeholder:text-slate-500"
          rows="4"
          placeholder="Paste the job description here to tailor the analysis..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={isUploading}
        ></textarea>
      </div>

      {file && !isUploading && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end"
        >
          <button 
            onClick={handleUploadResume}
            className="btn-primary px-8 py-3 text-lg flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Start Analysis
          </button>
        </motion.div>
      )}

      {/* Guidelines Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-5">
          <div className="text-emerald-400 mb-3 bg-emerald-500/10 w-10 h-10 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="text-slate-200 font-medium mb-1">ATS Friendly</h4>
          <p className="text-sm text-slate-500">Ensure your resume doesn't have complex columns or graphics.</p>
        </div>
        <div className="glass-card p-5">
          <div className="text-blue-400 mb-3 bg-blue-500/10 w-10 h-10 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="text-slate-200 font-medium mb-1">Standard Fonts</h4>
          <p className="text-sm text-slate-500">Use standard fonts like Arial or Roboto for best parsing.</p>
        </div>
        <div className="glass-card p-5">
          <div className="text-purple-400 mb-3 bg-purple-500/10 w-10 h-10 rounded-lg flex items-center justify-center">
             <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="text-slate-200 font-medium mb-1">Keywords</h4>
          <p className="text-sm text-slate-500">Include exact keywords from the job description.</p>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
