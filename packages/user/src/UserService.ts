import { IUser, UserRoles, ObjectId } from '@donategifts/common';
import { AgencyRepository } from '@donategifts/agency';

export class UserService {
	private agencyRepository: AgencyRepository;

	constructor() {
		this.agencyRepository = new AgencyRepository();
	}

	public async getUserRole(id: string): Promise<UserRoles> {
		const agency = await this.agencyRepository.getAgencyByUserId(ObjectId<IUser>(id));

		if (agency) {
			return UserRoles.Agency;
		}

		return UserRoles.Donor;
	}
}
