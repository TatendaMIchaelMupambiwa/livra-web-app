"use server";
import supabaseConfig from "@/config/supabase-config";
import { ItemInterface } from "@/interfaces";
import { success } from "zod/v4";

export const addNewItem = async (item: Partial<ItemInterface>) => {
  try {
    const { data, error } = await supabaseConfig.from("housing").insert([item]);
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      message: "Item added successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getAllItems = async () => {
  try {
    const { data, error } = await supabaseConfig
      .from("housing")
      .select("*, categories(id,name)")
      .order("created_at", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      message: "item fetched successfully",
      data: data.map((item: any) => ({
        ...item,
        category: item.categories,
        
    }))
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getItemById = async (id: number) => {
  try {
    const { data, error }: any = await supabaseConfig
      .from("housing")
      .select("*")
      .eq("id", id);
    if (error || data.length === 0) {
      throw new Error(error.message || "Item not found");
    }
    return {
      success: true,
      message: "Items fetched successfully",
      data: data[0],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const updateItemById = async (
  id: number,
  item: Partial<ItemInterface>,
) => {
  try {
    const { data, error } = await supabaseConfig
      .from("housing")
      .update(item)
      .eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      message: "Item deleted successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const deleteItemById = async (id: number) => {
  try {
    const { data, error } = await supabaseConfig
      .from("housing")
      .delete()
      .eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      message: "Item deleted successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
