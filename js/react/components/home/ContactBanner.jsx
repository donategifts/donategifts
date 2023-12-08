const ContactBanner = () => {
	return (
		<div>
			<div className="container my-5">
				<div className="heading-primary mb-3 text-center">Make a Tangible Impact</div>
				<div className="d-md-flex">
					<div className="col-md-6 pt-5 pb-4 px-3">
						<img
							className="img-fluid rounded rounded-3"
							src="/img/foster-children-back-facing-stock.jpg"
							alt="happy-kids-playing-need-school-supply-donations"
							loading="lazy"
						/>
					</div>
					<div className="col-md-6 p-3 p-md-5">
						<p>
							At this very moment, more than 500,000 children are in foster care, and
							over 4.2 million young souls are grappling with homelessness in the
							United States. For these kids, each day is marked by challenges and
							uncertainty.
						</p>
						<p>But you have the power to change that.</p>
						<p>
							Your kindness and generosity are the guiding lights that bring hope and
							positivity into the lives of these resilient kids. Your gifts are the
							key to empowerment, helping these children overcome obstacles and reach
							their full potential.
						</p>
						<p>Join us in this mission to provide school supplies and holiday gifts.</p>
						<p>You can make a tangible impact on children in need.</p>
						<div className="col-md-6 text-center text-md-start py-3">
							<a className="button-primary" href="/contact">
								Contact DonateGifts
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContactBanner;
