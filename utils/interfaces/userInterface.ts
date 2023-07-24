export interface iUser {
  id?: number | string;
  userName?: string;
  email?: string;
  password?: string;
  schoolName?: string;
  role?: string;
  token?: string;
  verified?: boolean;
}

export type iUserData<Type> = {
  [props in keyof Type]?: Type[props];
};

export interface iRole {
  title: string;
  role: Array<string>;
  user: {};
  id: string | number;
}
export type iRoleData<Type> = {
  [props in keyof Type]?: Type[props];
};

export interface iSocialUser {
  userName?: string;
  fullName?: string;
  avatar?: string;
  profession?: string;
  password?: string;
  email?: string;
  avatarID?: string;
  verified?: boolean;
  token?: string;
  address?: string;
  placeOfBirth?: string;
  college?: string;
  secondarySchool?: string;
  church:string;
  mosque:string;
  bio?: [];
  links?: string[];
  location?: string;
  primarySchool?:string;
  post?:{}[]
  music?:string[];
}

export type iSocialUserData<Type> = {
  [props in keyof Type]?: Type[props];
};

export interface IpostData{
  user: {}
  tittle: string;
  content: string;
  mediaFile: string;
  hashtag:{}[];
} 
