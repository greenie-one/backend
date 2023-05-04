interface UserAndProfile {
  email: string;
  mobileNumber: string;
  password: string;
  roles: import('@/models/users.model').UserRoles[];
  firstName: string;
  lastName: string;
}
