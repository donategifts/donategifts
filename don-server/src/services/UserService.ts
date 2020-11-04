import { UserRoles } from '../interfaces/IUser';
import { getAgencyByUserId } from '../db/repository/AgencyRepository';

export default class UserService {
  public async getUserRole(id: string): Promise<UserRoles> {
    const agency = await getAgencyByUserId(id);

    if (agency) {
      return UserRoles.Agency;
    }

    return UserRoles.Donor;
  }
}
