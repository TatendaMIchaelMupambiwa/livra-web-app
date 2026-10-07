"use server";

import supabaseConfig from "@/config/supabase-config";
import { Icategory } from "@/interfaces";
import { success } from "zod/v4";
import { create } from "zustand";

export const createCategory = async (category: Partial<Icategory>) => {
  try {
    const { data, error } = await supabaseConfig
      .from("categories")
      .insert([category])
      .select();

    if (error) {
      throw new Error(error.message);
    }
    return {
      success: false,
      message: "Category created successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getAllCategories = async () => {
  try {
    const { data, error } = await supabaseConfig
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      message: "Categories fetched successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getCategoryById = async (id: string, category: Partial<Icategory>) => {
  try {
    const { data, error } = await supabaseConfig
      .from("categories")
      .update(category)
      .select("*")
      .eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      message: "Categories updated successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const deleteCategoryById = async (id: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("categories")
      .delete()
      .eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      message: "Categories deleted successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
