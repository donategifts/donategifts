import { IDBUser, UserRoles, ObjectId } from '../common';
import AgencyRepository from '../db/repository/AgencyRepository';

export default class UserService {
  private agencyRepository: AgencyRepository;

  constructor() {
    this.agencyRepository = new AgencyRepository();
  }

  public async getUserRole(id: string): Promise<UserRoles> {
    const agency = await this.agencyRepository.getAgencyByUserId(ObjectId<IDBUser>(id));

    if (agency) {
      return UserRoles.Agency;
    }

    return UserRoles.Donor;
  }
}
