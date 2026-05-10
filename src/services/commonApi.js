import axios from 'axios'

const commonApi=async(reqUrl,reqMethod,reqData,reqHeader)=>{
    const config={
        url:reqUrl,
        method:reqMethod,
        data:reqData,
        headers:reqHeader?reqHeader:{'Content-Type':'application/json'}
    }
    try{
        const res=await axios(config)
    return res
    }
    catch(err){
        console.log(err)
        return err.response
    }
}

export default commonApi