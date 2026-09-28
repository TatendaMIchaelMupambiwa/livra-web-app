export interface  Iuser{
    id:string,
    name:string,
    email:string,
    profile_pic: string,
    password:string,
    role: 'user'| 'admin';
    created_at: Date;
}