'use server'
import supabaseConfig from '@/config/supabase-config'
import { Iuser } from '@/interfaces';
import bcrypt from 'bcryptjs' 

export const registerUser = async ({name, email, password} : Partial<Iuser>) => {

    try{
        //step 1: check if user already exists
        const userExistsReponse =  await supabaseConfig.from('user_profiles').select('id').eq('email', email);

        if(userExistsReponse.data?.length) {
            throw new Error('user already exists')

        }
        //step 2: hash the password

      const hashedPassword = await bcrypt.hash(password!,10);




        //atep 3: insert the user into the database
        const user ={
            name,
            email,
            password: hashedPassword,
            role: "user",
            profile_pic: ""
        }
        const saveUserResponse = await supabaseConfig.from('user_profiles').insert([user]).select();
        if(saveUserResponse.error){
            throw new Error(saveUserResponse.error.message);
        }

        return {
            success: true,
            message: 'user registered successfully',
        }



 
    }catch(error:any){

        return{
            success: false,
            message: error.message
        }
    }


}



