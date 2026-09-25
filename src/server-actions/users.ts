"use server";
import supabaseConfig from "@/config/supabase-config";
import { Iuser } from "@/interfaces";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { success } from "zod/v4";

export const registerUser = async ({
  name,
  email,
  password,
}: Partial<Iuser>) => {
  try {
    //step 1: check if user already exists
    const userExistsReponse = await supabaseConfig
      .from("user_profiles")
      .select("id")
      .eq("email", email);

    if (userExistsReponse.data?.length) {
      throw new Error("user already exists");
    }
    //step 2: hash the password

    const hashedPassword = await bcrypt.hash(password!, 10);

    //atep 3: insert the user into the database
    const user = {
      name,
      email,
      password: hashedPassword,
      role: "user",
      profile_pic: "",
    };
    const saveUserResponse = await supabaseConfig
      .from("user_profiles")
      .insert([user])
      .select();
    if (saveUserResponse.error) {
      throw new Error(saveUserResponse.error.message);
    }

    return {
      success: true,
      message: "user registered successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const loginUser = async ({ email, password, role }: Partial<Iuser>) => {
  try {
    //step 1: check if user exists
    const userResponse = await supabaseConfig
      .from("user_profiles")
      .select("*")
      .eq("email", email);
    if (userResponse.data?.length === 0) {
      throw new Error("user does not exist");
    }

    let user = null;
    if (userResponse.data) {
      user = userResponse.data[0];
    }

    if (user.role !== role) {
      throw new Error("Your are not authorized to login as this role");
    }

    // step 2: get the user from the database
    const isPasswordValid = await bcrypt.compare(password!, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    //step 3: compare the password with the hashed password in the database
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      },
    );

    return {
      success: true,
      message: "user logged in successfully",
      data: token,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getLoggedInUser = async () => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("token")?.value;

    const decryptedToken: any = jwt.verify(
      accessToken!,
      process.env.JWT_SECRET!,
  ) as { id: string; email: string };


  const userResponse =await supabaseConfig.from("user_profiles").select("*").eq("id", decryptedToken.id);
  if(userResponse.error || userResponse.data?.length === 0){
    throw new Error ("User not found")
  }

  return{
    success: true,
    data: userResponse.data[0],
    message: 'User fetched successfully'
  }

  } catch (error: any) {
    return{
      success: false,
      message: error.message,
    }
  }
};
