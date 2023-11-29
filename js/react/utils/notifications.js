import { notifications } from '@mantine/notifications';

import classes from '../styles/Notifications.module.css';

const COLOR_MAP = {
	success: 'green',
	error: 'red',
	warning: 'yellow',
	info: 'blue',
};

export const notification = ({ title = '', message, type = 'success', autoClose = 3000 }) => {
	return {
		show: () =>
			notifications.show({
				title,
				message,
				color: COLOR_MAP[type],
				autoClose,
				classNames: classes,
			}),
	};
};
