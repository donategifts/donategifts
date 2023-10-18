import { Button, Loader } from '@mantine/core';
import PropTypes from 'prop-types';

function CustomButton(props) {
	const { loading, onClick, disabled, size, type, variant, color, fullWidth, text, loader } =
		props;

	return (
		<Button
			type={type}
			size={size}
			variant={variant}
			color={color}
			fullWidth={fullWidth}
			onClick={onClick}
			disabled={disabled}
		>
			{text}
			{loading && <Loader className="ms-2" color={loader.color} type={loader.type} />}
		</Button>
	);
}

CustomButton.propTypes = {
	loading: PropTypes.bool,
	onClick: PropTypes.func,
	disabled: PropTypes.bool,

	type: PropTypes.oneOf(['button', 'submit', 'reset']),
	size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
	variant: PropTypes.oneOf(['filled', 'light', 'outline', 'link']),
	color: PropTypes.oneOf([
		'dark',
		'red',
		'pink',
		'grape',
		'violet',
		'indigo',
		'blue',
		'cyan',
		'teal',
		'green',
		'lime',
		'yellow',
		'orange',
	]),
	fullWidth: PropTypes.bool,
	text: PropTypes.string,

	loader: PropTypes.shape({
		type: PropTypes.oneOf(['dots', 'bars', 'oval']),
		color: PropTypes.oneOf(['dark', 'light', 'gray']),
	}),
};

CustomButton.defaultProps = {
	loading: false,
	onClick: () => {},
	disabled: false,

	type: 'button',
	size: 'md',
	variant: 'filled',
	color: 'blue',
	fullWidth: false,
	text: 'Button',

	loader: {
		type: 'dots',
		color: 'dark',
	},
};

export default CustomButton;
