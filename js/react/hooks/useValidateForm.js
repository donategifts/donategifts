import PropTypes from 'prop-types';
import { forwardRef, useState, useImperativeHandle } from 'react';

const useValidateForm = forwardRef(({ formFields, currFormMap }, ref) => {
	const [formData, setFormData] = useState({});
	const [formErrors, setFormErrors] = useState({});

	const validateField = (ref, fieldName, sizeFn = null, validationFn = null) => {
		const fieldValue = ref.current?.value;
		const defaultError = currFormMap[fieldName].errors?.default;
		const sizeError = currFormMap[fieldName].errors?.size;
		const validateError = currFormMap[fieldName].errors?.validate;

		console.log(`${fieldName}: ${ref}, value: ${fieldValue}`);

		if (!fieldValue || !fieldValue.length) {
			setFormErrors((prevErrors) => ({
				...prevErrors,
				[fieldName]: defaultError,
			}));
		} else if (sizeFn && sizeFn(fieldValue)) {
			setFormErrors((prevErrors) => ({
				...prevErrors,
				[fieldName]: sizeError,
			}));
		} else if (validationFn && !validationFn(fieldValue)) {
			setFormErrors((prevErrors) => ({
				...prevErrors,
				[fieldName]: validateError,
			}));
		} else {
			setFormErrors((prevErrors) => ({
				...prevErrors,
				[fieldName]: '',
			}));
			setFormData((data) => ({
				...data,
				[fieldName]: fieldValue,
			}));
		}
	};

	useImperativeHandle(ref, () => {
		formFields.forEach((field) => {
			validateField(
				ref[field.name], // Access the ref directly using the field name
				field.name,
				field.sizeFn || null,
				field.validateFn || null,
			);
		});
	});

	return {
		formData,
		formErrors,
	};
});

useValidateForm.displayName = 'useValidateForm';

useValidateForm.defaultProps = {
	formFields: [],
	currFormMap: {},
};

useValidateForm.propTypes = {
	formFields: PropTypes.array,
	currFormMap: PropTypes.object,
};

export default useValidateForm;
