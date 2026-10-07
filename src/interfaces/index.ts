export interface  Iuser{
    id:string,
    name:string,
    email:string,
    profile_pic: string,
    password:string,
    role: 'user'| 'admin';
    created_at: Date;
}

export interface Icategory{
    id:string,
    name:string,
    description:string,
    image: string;
    created_at: Date;   
    upadate_at: Date;
    user_id: string;
}