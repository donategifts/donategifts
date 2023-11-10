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
			className={props.additionalClasses}
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

	type: PropTypes.oneOf(['button', 'submit', 'reset']),
	text: PropTypes.string,

	loader: PropTypes.shape({
		type: PropTypes.oneOf(['dots', 'bars', 'oval']),
		color: PropTypes.string,
	}),

	additionalClasses: PropTypes.string,

	...Button.propTypes,
};

CustomButton.defaultProps = {
	loading: false,

	type: 'button',
	text: 'Button',

	loader: {
		type: 'dots',
		color: 'white',
	},

	additionalClasses: '',

	...Button.defaultProps,
};

export default CustomButton;
