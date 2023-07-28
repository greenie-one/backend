export interface GetProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  profilePic: string;
  descriptionTags: string[];
  greenieId: string;
}

export type SearchProfilesResponse = GetProfileResponse[];

export type CreateProfileResponse = GetProfileResponse;
export type UpdateProfileResponse = GetProfileResponse;

export interface GetProfileRankingResponse {
  percentile: number;
  score: number
}
