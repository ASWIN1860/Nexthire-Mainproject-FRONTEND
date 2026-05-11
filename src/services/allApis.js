import base_url from "./base_url";
import commonApi from "./commonApi";

//signup api request
export const signupApi=async(data)=>{
   return await commonApi(`${base_url}/signup`,'POST',data,"")
}

//signin api
export const signinApi=async(data)=>{
    return await commonApi(`${base_url}/signin`,'POST',data,"")
}

//google Signin Api
export const googleSigninApi=async(data)=>{
    return await commonApi(`${base_url}/google-login`,'POST',data,"")
}

//upload resume 
export const uploadResumeApi=async(data)=>{
    const header={
        "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
        "Content-Type":"multipart/form-data"
    }
    return await commonApi(`${base_url}/upload-resume`,'POST',data,header)
}

//getLatest ResumeData
export const getLatestResumeApi=async()=>{
    const header={
        "Authorization": `Bearer ${sessionStorage.getItem('token')}`
    }
    return await commonApi(`${base_url}/latest-resume`,'GET',{},header)
}

//get resume history
export const getResumeHistoryApi=async()=>{
    const header={
        "Authorization": `Bearer ${sessionStorage.getItem('token')}`
    }
    return await commonApi(`${base_url}/resume-history`,'GET',{},header)
}

//delete resume history
export const deleteResumeHistoryApi=async(id)=>{
     const header={
        "Authorization": `Bearer ${sessionStorage.getItem('token')}`
    }
    return await commonApi(`${base_url}/delete-resume/${id}`,'DELETE',{},header)
}

//Add skill [ADMIN]
export const addSkillsApi=async(data)=>{
    const header={
        "Authorization": `Bearer ${sessionStorage.getItem('token')}`
    }
    return await commonApi(`${base_url}/add-skill`,'POST',data,header)
}

//Add job [ADMIN]
export const addJobsApi=async(data)=>{
    const header={
        "Authorization": `Bearer ${sessionStorage.getItem('token')}`
    }
    return await commonApi(`${base_url}/add-job`,'POST',data,header)
}