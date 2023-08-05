import { UserRoles } from '../request/auth.dto';

export interface UpdateUserResponse {
  id: string;
  email: string;
  mobileNumber: string;
  roles: UserRoles[];
}
