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
  location?: string;
  address?: string;
  placeOfBirth?: string;
  college?: string;
  secondarySchool?: string;
}

export type iSocialUserData<Type> = {
  [props in keyof Type]?: Type[props];
};
