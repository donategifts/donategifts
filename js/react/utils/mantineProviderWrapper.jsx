import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
	colors: {
		indigo: [
			'#f1f2f8',
			'#e1e2ea',
			'#bfc2d5',
			'#9ca0c2',
			'#7d84b1',
			'#6a72a8',
			'#6069a4',
			'#50578f',
			'#464d81',
			'#3b4373',
		],
		orange: [
			'#ffebe6',
			'#ffd6ce',
			'#ffab9b',
			'#ff7c64',
			'#fe5637',
			'#fe3d19',
			'#ff2f09',
			'#e42100',
			'#cb1a00',
			'#b10d00',
		],
		teal: [
			'#ebfffe',
			'#d7fdfc',
			'#aafdf9',
			'#7cfdf6',
			'#60fcf4',
			'#54fdf3',
			'#4cfdf2',
			'#3fe1d8',
			'#2ec8c0',
			'#00ada6',
		],
		yellow: [
			'#fff6e1',
			'#ffeccc',
			'#ffd69b',
			'#ffc064',
			'#ffac38',
			'#ffa01b',
			'#ff9a09',
			'#e38600',
			'#ca7600',
			'#b06500',
		],
		red: [
			'#ffe8eb',
			'#ffced4',
			'#ff9ba7',
			'#ff6476',
			'#fe384d',
			'#fe1b34',
			'#ff0926',
			'#e40019',
			'#cb0015',
			'#b2000f',
		],
		gray: [
			'#eef6fe',
			'#e5e7ec',
			'#cacdd1',
			'#adb2b6',
			'#959ba0',
			'#858c92',
			'#7c858c',
			'#69727a',
			'#5b656e',
			'#495864',
		],
	},
	primaryColor: 'indigo',
});

// eslint-disable-next-line react/prop-types
export default function MantineProviderWrapper({ children }) {
	return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
