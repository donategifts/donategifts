import { IUser, UserRoles, ObjectId } from '@donategifts/common';
import { AgencyRepository } from '@donategifts/agency';
import { injectable } from 'inversify';

@injectable()
export class UserService {
	constructor(private agencyRepository: typeof AgencyRepository = AgencyRepository) {}

	public async getUserRole(id: string): Promise<UserRoles> {
		const agency = await this.agencyRepository.getAgencyByUserId(ObjectId<IUser>(id));

		if (agency) {
			return UserRoles.Agency;
		}

		return UserRoles.Donor;
	}
}
