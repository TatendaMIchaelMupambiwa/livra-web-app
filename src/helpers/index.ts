'use server'

import supabaseConfig from "@/config/supabase-config";


export const uploadFileToSupabase = async (file: File) => {
    try {
    const filePath = `default/${file.name}-${Date.now()}`;
    const { data, error } = await supabaseConfig.storage
      .from("default")
      .upload(filePath, file);
      if(error){
        throw new Error(error.message)
    }
    const urlResponse:any = await supabaseConfig.storage
      .from("default")
      .getPublicUrl(filePath);

      if (urlResponse.error) {
        throw new Error(urlResponse.error.message);
      }
      
    return {
      success: true,
      message: "File uploaded successfully",
      data: urlResponse.data.publicUrl,
    };
  }
    
    
    catch (error: any){
      return{
        success: false,
        message: error.message 
    }
    }
  };