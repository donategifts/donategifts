import { Button, Loader } from '@mantine/core';
import PropTypes from 'prop-types';

function CustomButton(props) {
	return (
		<Button
			type={props.type}
			size={props.size}
			variant={props.variant}
			color={props.color}
			fullWidth={props.fullWidth}
			onClick={props.onClick}
			disabled={props.disabled}
			className={props.additionalClass}
		>
			{props.text}
			{props.loading && (
				<Loader className="ms-2" color={props.loader.color} type={props.loader.type} />
			)}
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

	additionalClass: PropTypes.string,
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

	additionalClass: '',
};

export default CustomButton;
