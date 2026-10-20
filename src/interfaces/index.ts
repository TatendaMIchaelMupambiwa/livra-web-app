export interface Iuser {
  id: string;
  name: string;
  email: string;
  profile_pic: string;
  password: string;
  role: "user" | "admin";
  created_at: Date;
}

export interface Icategory {
  id: string;
  name: string;
  description: string;
  image: string;
  created_at: Date;
  upadate_at: Date;
  user_id: string;
}

export interface ItemInterface {
  id: number;
  name: string;
  description: string;
  rent_per_day: number;
  available_quantity: number;
  total_quantity: number;
  images: string[];
  price: number;
  created_at: Date;
  update_at: Date;
  category_id: string;

  //run time data
  category: Icategory;
}
