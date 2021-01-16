export interface IDonationHook {
	service: string;
	userId: string;
	wishCardId: string;
	amount: number;
	userDonation: number | null;
	agencyName: string;
}
