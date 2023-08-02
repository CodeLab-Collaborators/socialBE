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
  coverImage?: string;
  coverImageID?: string;
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
  religion: string;
  LGA: string;
  stateOfOrigin: string;
  bio?: [];
  links?: string[];
  location?: string;
  primarySchool?: string;
  post?: {}[];
  music?: string[];
  friends?: string[];
  mentor?: string[];
  mentee?: string[];
  followers?: string[];
  followings?: string[];
  workAt?: string[];
}

export type iSocialUserData<Type> = {
  [props in keyof Type]?: Type[props];
};

export interface IpostData {
  user: {};
  post: string;
  userID: string;
  mediaFile: string;
  mediaFileID: string;
  like: any;
  hashtag: {}[];
}

export interface iHash {
  user: {};
  title: string;
  userID: string;
  post: {};
}

export interface iChat {
  member: string[];
}

export interface iChatMessage {
  userID?: string;
  chatID?: string;
  message?: string;
}

export interface iWork {
  workPlace?: string;
  workLocation?: string;
  startedAt?: string;
  endsAt?: string;
  userID?: string;
  user: {};
}