import { TextInput, Select, Textarea } from '@mantine/core';

import PopOver from '../../components/shared/PopOver.jsx';
import { FORM_INPUT_MAP, BIRTH_YEAR } from '../../utils/constants';
import MantineProviderWrapper from '../../utils/mantineProviderWrapper.jsx';

function AgencyRegister() {
	return (
		<MantineProviderWrapper>
			<div id="agency-register-page" className="py-5">
				<div className="container">
					<h1 className="heading-primary mb-4 text-center">Register Your Agency</h1>
					<form className="text-primary">
						<div className="card shadow-lg px-4 pt-1 pb-4">
							<div className="card-body">
								<div className="display-6 mt-3 mb-sm-4 mb-md-0 mb-lg-0">
									Information about child
								</div>
								<div className="row d-flex align-items-center">
									<div className="form-group col-md-6 px-3">
										<TextInput
											// ref={childFirstNameRef}
											size="md"
											name="childFirstName"
											label={FORM_INPUT_MAP.childFirstName?.label}
											// error={childFirstNameError}
											required
											// onChange={() => handleOnChange(setChildFirstNameError)}
										/>
										<TextInput
											// ref={childInterestRef}
											size="md"
											mt="md"
											name="childInterest"
											label={FORM_INPUT_MAP.childInterest?.label}
											// error={childInterestError}
											required
											placeholder={FORM_INPUT_MAP.childInterest?.placeholder}
											// onChange={() => handleOnChange(setChildInterestError)}
										/>
										<Select
											// ref={childBirthYearRef}
											size="md"
											mt="md"
											name="childBirthYear"
											label={FORM_INPUT_MAP.childBirthYear?.label}
											// error={childBirthYearError}
											aria-required
											searchable
											placeholder={FORM_INPUT_MAP.childBirthYear?.placeholder}
											data={BIRTH_YEAR}
											required
											// onChange={() => handleOnChange(setChildBirthYearError)}
										/>
									</div>
								</div>
								<div className="row px-1">
									<Textarea
										size="md"
										rows={3}
										mt="md"
										name="childStory"
										// ref={childStoryRef}
										label={FORM_INPUT_MAP.childStory.label}
										// error={childStoryError}
										placeholder={FORM_INPUT_MAP.childStory.placeholder}
										required
										// onChange={() => handleOnChange(setChildStoryError)}
									/>
								</div>
								<div className="display-6 mt-5 mb-sm-4 mb-md-0 mb-lg-0">
									Information about wish item
								</div>
								<div className="row d-flex align-items-center">
									<div className="form-group col-md-6 px-3 mb-sm-4">
										<TextInput
											// ref={wishItemNameRef}
											size="md"
											mt="md"
											name="wishItemName"
											label={FORM_INPUT_MAP.wishItemName?.label}
											// error={wishItemNameError}
											required
											// onChange={() => handleOnChange(setWishItemNameError)}
										/>
										<TextInput
											// ref={wishItemPriceRef}
											size="md"
											mt="md"
											name="wishItemPrice"
											label={FORM_INPUT_MAP.wishItemPrice?.label}
											// error={wishItemPriceError}
											required
											placeholder={FORM_INPUT_MAP.wishItemPrice?.placeholder}
											// onChange={() => handleOnChange(setWishItemPriceError)}
											leftSection={<i className="fas fa-dollar-sign"></i>}
											rightSection={
												<PopOver
													width={400}
													text={FORM_INPUT_MAP.wishItemPrice?.popOverText}
												/>
											}
										/>
										<TextInput
											// ref={wishItemInfoRef}
											size="md"
											mt="md"
											name="wishItemInfo"
											label={FORM_INPUT_MAP.wishItemInfo?.label}
											// error={wishItemInfoError}
											required
											placeholder={FORM_INPUT_MAP.wishItemInfo?.placeholder}
											// onChange={() => handleOnChange(setWishItemInfoError)}
										/>
									</div>
								</div>
								<div className="row px-1">
									<div className="col-12">
										<TextInput
											// ref={wishItemURLRef}
											size="md"
											mt="md"
											name="wishItemURL"
											label={FORM_INPUT_MAP.wishItemURL?.label}
											// error={wishItemURLError}
											required
											placeholder={FORM_INPUT_MAP.wishItemURL?.placeholder}
											// onChange={() => handleOnChange(setWishItemURLError)}
											leftSection={<i className="fas fa-link"></i>}
											rightSection={
												<PopOver
													width={400}
													position="top"
													text={FORM_INPUT_MAP.wishItemURL?.popOverText}
													isImgProvided={true}
													imgSrc="/img/amazon-helper.png"
												/>
											}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="d-flex justify-content-center mt-2">
							<button
								id="submitInput"
								className="button-accent px-5"
								type="submit"
								// onClick={handleSubmit}
							>
								<span>Submit</span>
								<div
									className="spinner-border spinner-border-sm text-white ms-1 d-none"
									role="status"
								>
									<span className="visually-hidden">Loading...</span>
								</div>
							</button>
						</div>
					</form>
				</div>
			</div>
		</MantineProviderWrapper>
	);
}

export default AgencyRegister;
