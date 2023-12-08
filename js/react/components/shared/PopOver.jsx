import { Popover, Text } from '@mantine/core';
import PropTypes from 'prop-types';

function PopOver({ width, position, text, textSize, imageSource, iconStyles }) {
	return (
		<Popover width={width} position={position} withArrow shadow="md">
			<Popover.Target>
				<i className={iconStyles} />
			</Popover.Target>
			<Popover.Dropdown>
				{imageSource && (
					<img src={imageSource} alt="pop-over helper image" className="img-fluid pb-2" />
				)}
				<Text size={textSize}>{text}</Text>
			</Popover.Dropdown>
		</Popover>
	);
}

PopOver.defaultProps = {
	width: 300,
	position: 'bottom',
	textSize: 'md',
	iconStyles: 'fa fa-question-circle ms-1', //default icon is set to question mark
};

PopOver.propTypes = {
	width: PropTypes.number,
	position: PropTypes.string,
	text: PropTypes.string.isRequired,
	textSize: PropTypes.string,
	imageSource: PropTypes.string,
	iconStyles: PropTypes.string,
};

export default PopOver;
