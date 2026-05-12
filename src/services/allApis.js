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
export const getLatestResumeApi=async(id)=>{
    const header={
        "Authorization": `Bearer ${sessionStorage.getItem('token')}`
    }
    return await commonApi(`${base_url}/latest-resume/${id}`,'GET',{},header)
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

//Get all jobs [ADMIN]
export const getAllJobsApi=async()=>{
    const header={
        "Authorization": `Bearer ${sessionStorage.getItem('token')}`
    }
    return await commonApi(`${base_url}/all-jobs`,'GET',{},header)
}

//delete jobs [ADMIN]
export const deleteJobApi=async(id)=>{
    const header={
        "Authorization": `Bearer ${sessionStorage.getItem('token')}`
    }
    return await commonApi(`${base_url}/delete-job/${id}`,'DELETE',id,header)
}

//update jobs [ADMIN]
export const updateJobApi=async(id,body)=>{
     const header={
        "Authorization": `Bearer ${sessionStorage.getItem('token')}`
    }
    return await commonApi(`${base_url}/update-job/${id}`,'PUT',body,header)
}

//get all users [ADMIN]
export const getAllUsersApi=async()=>{
    const header={
        "Authorization": `Bearer ${sessionStorage.getItem('token')}`
    }
    return await commonApi(`${base_url}/all-users`,'GET',"",header)
}

//get resume by id [ADMIN]
export const getResumeByUserIdApi=async(id)=>{
    const header={
        "Authorization": `Bearer ${sessionStorage.getItem('token')}`
    }
    return await commonApi(`${base_url}/resume/${id}`,'GET',id,header)
}

//edit user [ADMIN]
export const editUserApi=async(id,body)=>{
     const header={
        "Authorization": `Bearer ${sessionStorage.getItem('token')}`
    }
    return await commonApi(`${base_url}/edit-user/${id}`,'PUT',body,header)
}

//delete user 
export const deleteUserApi=async(id)=>{
    const header={
        "Authorization": `Bearer ${sessionStorage.getItem('token')}`
    }
    return await commonApi(`${base_url}/delete-user/${id}`,'DELETE',id,header)
}