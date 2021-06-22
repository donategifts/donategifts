export const getMessageChoices = (userFirstName: string, childFirstName: string): string[] => {
	if (!userFirstName || !childFirstName) {
		return [];
	}
	return [
		`${userFirstName} sends you love, ${childFirstName}`,
		'Happy Birthday to the sweetest kid in the entire world.',
		'Happy birthday to a future superstar!',
		`Happy birthday, ${childFirstName}`,
		`Merry Christmas, ${childFirstName}`,
		`Happy holidays, ${childFirstName}`,
		`${childFirstName}, you are awesome!`,
		`Lots of love and best wishes, ${childFirstName}`,
		`${childFirstName}, hope you enjoy my gift!`,
		'Merry Christmas and a Happy New Year',
		`${childFirstName}, have a happy holiday`,
		`Congratulations, ${childFirstName}`,
	];
};
