import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
	/** Put your mantine theme override here */
});

// eslint-disable-next-line react/prop-types
export default function MantineProviderWrapper({ children }) {
	return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
