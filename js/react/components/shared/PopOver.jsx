import { Popover, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import PropTypes from 'prop-types';

function PopOver({ width, position, text, textSize, imageSource }) {
	const [opened, { close, open }] = useDisclosure(false);

	return (
		<Popover width={width} position={position} withArrow shadow="md" opened={opened}>
			<Popover.Target>
				<i
					className="fa fa-question-circle ms-1"
					onMouseEnter={open}
					onMouseLeave={close}
				/>
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
};

PopOver.propTypes = {
	width: PropTypes.number,
	position: PropTypes.string,
	text: PropTypes.string.isRequired,
	textSize: PropTypes.string,
	imageSource: PropTypes.string,
};

export default PopOver;
