import React, { Component } from "react";

/**
 * Renders the Footer
 */
class Footer extends Component {
	render() {
		return (
			<footer className="footer">
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-6">
							2024 &copy; NWF by <a href="hhttps://fpt-is.com">FPT Information System</a>
						</div>
						<div className="col-md-6">
							<div className="text-md-right footer-links d-none d-sm-block">
								<a href="hhttps://fpt-is.com">
									<i className="fas fa-tools"></i> Version: 0.0.1
								</a>
								{/* <a href="hhttps://fpt-is.com">Help</a>
                                <a href="hhttps://fpt-is.com">Contact Us</a> */}
							</div>
						</div>
					</div>
				</div>
			</footer>
		);
	}
}

export default Footer;
