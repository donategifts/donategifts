import { TextInput, Select, Textarea } from '@mantine/core';
import PropTypes from 'prop-types';
import { useRef, useEffect, useState } from 'react';

import ImgUploader from '../components/shared/ImgUploader.jsx';
import MantineProviderWrapper from '../utils/mantineProviderWrapper.jsx';

// TODO: @sealkysmooth - add a popover for EIN, etc.
// TODO: @enubia - backend api connection and backend validation
// TODO: @enubia - test submit image local and aws
// TODO: @enubia, @stacysealky - end to end feature testing, check db and page redirect, test edge case errors

const CustomForm = ({
	fieldsets,
	formTranslations,
	handleFormData,
	handleFormDirty,
	inputSize,
	isFormSubmitted,
}) => {
	const [formData, setFormData] = useState({});
	const [fieldErrors, setFieldErrors] = useState({});
	const [fieldFunctions, setFieldFunctions] = useState({});
	const [isErrorChecked, setIsErrorChecked] = useState(false);
	const [isDataValid, setIsDataValid] = useState(false);
	const refObjects = {};

	useEffect(() => {
		const errors = {};
		const functions = {};

		// Setting fields, errors, and validation functions, as they are customizable from props
		fieldsets.forEach((fieldset) => {
			fieldset?.inputsPerRow?.forEach((row) => {
				row.forEach((col) => {
					const name = col?.name;
					setFormData((data) => ({
						...data,
						[name]: col?.defaultValue,
					}));
					errors[`${name}Error`] = '';
					if (col?.sizeFn) {
						functions[`${name}SizeFn`] = col?.sizeFn;
					}
					if (col?.validateFn) {
						functions[`${name}ValidateFn`] = col?.validateFn;
					}
				});
			});
		});
		setFieldErrors(errors);
		setFieldFunctions(functions);
	}, []);

	const formatEIN = (e) => {
		const input = e.target.value.replace(/\D/g, '');
		const length = input.length;
		let formattedEIN = '';

		if (e.inputType === 'deleteContentBackward' && length === 3) {
			formattedEIN = input;
		} else if (length > 2) {
			// Formatting as "12-3456789"
			formattedEIN = `${input.slice(0, 2)}-${input.slice(2, 9)}`;
		} else {
			// For inputs like "12" or "1" or "1-"
			formattedEIN = input;
		}
		e.target.value = formattedEIN;
	};

	const formatPhone = (e) => {
		const input = e.target.value.replace(/\D/g, '');
		const length = input.length;
		let formattedPhone = '';

		if (e.inputType === 'deleteContentBackward' && length === 4) {
			formattedPhone = input;
		} else if (length > 3) {
			// Formatting as "(123) 456-7890"
			formattedPhone = `(${input.slice(0, 3)}) ${input.slice(3, 6)}-${input.slice(6, 10)}`;
		} else {
			// For inputs like "123" or "12" or "1" or "1-"
			formattedPhone = input;
		}

		e.target.value = formattedPhone;
	};

	const handleDataError = (name, value) => {
		setFormData((data) => ({
			...data,
			[name]: value,
		}));
		setFieldErrors((prevErrors) => ({
			...prevErrors,
			[`${name}Error`]: '',
		}));
		handleFormDirty();
	};

	const handleInput = (e) => {
		const target = e.target;
		const { name, value } = target;

		handleDataError(name, value);
	};

	const handleFormatInput = (e) => {
		// refactor this later if there are more formats
		if (e.target?.name === 'agencyEIN') {
			formatEIN(e);
		} else if (e.target?.name === 'agencyPhone') {
			formatPhone(e);
		}
		handleInput(e);
	};

	const handleDropDown = (value, name) => {
		if (value) {
			handleDataError(name, value);
		}
	};

	const handleScroll = (ref) => {
		if (ref?.current) {
			window?.scrollTo({
				top: ref.offsetTop,
				left: 0,
				behavior: 'smooth',
			});
			ref.current.focus();
		}
	};

	const validateField = (ref, fieldName, sizeFn = null, validationFn = null) => {
		const fieldValue = ref?.current?.value;

		if (!fieldValue || !fieldValue.length) {
			setFieldErrors((prevErrors) => ({
				...prevErrors,
				[`${fieldName}Error`]: formTranslations[fieldName].errors?.default || '',
			}));
			handleScroll(ref);
		} else if (sizeFn && sizeFn(fieldValue)) {
			setFieldErrors((prevErrors) => ({
				...prevErrors,
				[`${fieldName}Error`]: formTranslations[fieldName].errors?.size || '',
			}));
			handleScroll(ref);
		} else if (validationFn && !validationFn(fieldValue)) {
			setFieldErrors((prevErrors) => ({
				...prevErrors,
				[`${fieldName}Error`]: formTranslations[fieldName].errors?.validate || '',
			}));
			handleScroll(ref);
		} else {
			setFieldErrors((prevErrors) => ({
				...prevErrors,
				[`${fieldName}Error`]: '',
			}));
			setFormData((data) => ({
				...data,
				[ref.current?.name]: fieldValue,
			}));
		}
	};

	const validateFormData = () => {
		const fieldNames = Object.keys(formData);

		fieldNames.forEach((name) => {
			const ref = refObjects[`${name}Ref`];
			const sizeFn = fieldFunctions[`${name}SizeFn`] || null;
			const validateFn = fieldFunctions[`${name}ValidateFn`] || null;

			if (ref && ref?.current) {
				validateField(ref, name, sizeFn, validateFn);
			}
		});
	};

	useEffect(() => {
		if (isFormSubmitted) {
			validateFormData();
			setIsErrorChecked(true);
		}
		if (isFormSubmitted && isDataValid) {
			handleFormData(formData);
		}
	}, [isFormSubmitted, isDataValid]);

	useEffect(() => {
		if (isErrorChecked) {
			setIsDataValid(Object.values(fieldErrors).every((error) => !error));
			setIsErrorChecked(false);
		}
	}, [isErrorChecked]);

	const col2 = 'col-sm-12 col-lg-6 col-md-6';
	const col3 = 'col-12 col-md-4';

	const handleImage = (name, file) => {
		if (file) {
			handleDataError(name, file);
		}
	};

	return (
		<MantineProviderWrapper>
			<form autoComplete="off">
				<div className="card-body">
					{fieldsets.map((fieldset, index) => (
						<div key={index} className="mb-5">
							<h2 className="display-6 my-3">{fieldset.header}</h2>
							{fieldset.instruction ? (
								<p className="form-text">{fieldset.instruction}</p>
							) : null}
							{fieldset?.inputsPerRow?.map((row, i) => (
								<div key={i} className="row d-flex align-items-start">
									{row.map((col, j) => {
										refObjects[`${col?.name}Ref`] = useRef();
										return (
											<div className={row.length == 3 ? col3 : col2} key={j}>
												{col.inputType == 'textInput' && (
													<TextInput
														ref={refObjects[`${col?.name}Ref`]}
														size={inputSize}
														mt={inputSize}
														label={formTranslations[col.name]?.label}
														name={col.name}
														required={col.isRequired}
														placeholder={
															formTranslations[col.name]
																?.placeholder || ''
														}
														error={fieldErrors[`${col.name}Error`]}
														onChange={handleFormatInput}
													/>
												)}
												{col.inputType == 'select' && (
													<Select
														ref={refObjects[`${col?.name}Ref`]}
														size={inputSize}
														mt={inputSize}
														label={formTranslations[col.name]?.label}
														name={col.name}
														searchable
														data={formTranslations[col.name]?.data}
														required={col.isRequired}
														placeholder={
															formTranslations[col.name]
																?.placeholder || ''
														}
														autoComplete="off"
														error={fieldErrors[`${col.name}Error`]}
														onChange={(value) =>
															handleDropDown(value, col.name)
														}
													/>
												)}
												{col.inputType == 'textArea' && (
													<Textarea
														ref={refObjects[`${col?.name}Ref`]}
														size={inputSize}
														mt={inputSize}
														label={formTranslations[col.name]?.label}
														name={col.name}
														required={col.isRequired}
														placeholder={
															formTranslations[col.name]
																?.placeholder || ''
														}
														error={fieldErrors[`${col.name}Error`]}
														onChange={handleInput}
													/>
												)}
												{col.inputType == 'image' && (
													<ImgUploader
														label={formTranslations[col.name]?.label}
														instruction={
															formTranslations[col.name].instruction
														}
														imgID={col.name}
														isRequired={col.isRequired}
														handleImage={handleImage}
													/>
												)}
											</div>
										);
									})}
								</div>
							))}
						</div>
					))}
				</div>
			</form>
		</MantineProviderWrapper>
	);
};

CustomForm.defaultProps = {
	fieldsets: [],
	inputSize: 'md',
};

CustomForm.propTypes = {
	fieldsets: PropTypes.arrayOf(
		PropTypes.shape({
			header: PropTypes.string.isRequired,
			instruction: PropTypes.string,
			inputsPerRow: PropTypes.arrayOf(
				PropTypes.arrayOf(
					PropTypes.shape({
						name: PropTypes.string.isRequired,
						inputType: PropTypes.string.isRequired,
						isRequired: PropTypes.bool,
						defaultValue: PropTypes.any,
					}),
				),
			),
		}).isRequired,
	).isRequired,
	formTranslations: PropTypes.object.isRequired,
	inputSize: PropTypes.string,
	handleFormData: PropTypes.func.isRequired,
	handleFormDirty: PropTypes.func.isRequired,
	isFormSubmitted: PropTypes.bool.isRequired,
};

export default CustomForm;
