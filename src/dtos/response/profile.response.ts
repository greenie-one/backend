export interface AddProfileResponse {
  id: string;
  success: boolean;
}

export interface ProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  profilePic: string;
  descriptionTags: string[];
  greenieId: string;
  phone?: string;
  email?: string;
}

export interface SearchProfilesResponse {
  profiles: ProfileResponse[];
}
