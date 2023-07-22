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
}

export interface SearchProfilesResponse {
  profiles: ProfileResponse[];
}

