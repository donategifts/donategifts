import { Popover, Text } from '@mantine/core';
import PropTypes from 'prop-types';

function PopOver({ width, position, text, textSize, isBtnQuestion, isImgProvided, imgSrc }) {
	return (
		<Popover width={width} position={position} withArrow shadow="md">
			<Popover.Target>
				{isBtnQuestion && <i className="fa fa-question-circle ms-1"></i>}
			</Popover.Target>
			<Popover.Dropdown>
				{isImgProvided && (
					<img src={imgSrc} alt="pop-over helper image" className="img-fluid pb-2" />
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
	isBtnQuestion: true,
	isImgProvided: false,
};

PopOver.propTypes = {
	width: PropTypes.number,
	position: PropTypes.string,
	text: PropTypes.string.isRequired,
	textSize: PropTypes.string,
	isBtnQuestion: PropTypes.bool,
	isImgProvided: PropTypes.bool,
	imgSrc: PropTypes.string,
};

export default PopOver;
