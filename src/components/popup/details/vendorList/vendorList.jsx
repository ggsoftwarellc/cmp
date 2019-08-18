import { h, Component } from 'preact';
import style from './vendorList.less';
import detailsStyle from '../details.less';
import ExternalLinkIcon from '../../../externallinkicon/externallinkicon';
import Label from "../../../label/label";

class LocalLabel extends Label {
	static defaultProps = {
		prefix: 'vendors'
	};
}

export default class VendorList extends Component {
	constructor(props) {
		super(props);

		this.state.activeVendor = 0;
	}

	static defaultProps = {
		vendors: [],
	};

	handleActiveVendor = (id) => {
		return () => {
			if (id == this.state.activeVendor) {
				this.setState({ activeVendor: 0 });
			} else {
				this.setState({ activeVendor: id });
			}
		}
	}

	getFeatureName = (id) => {
		return this.props.features.find(f => f.id == id).name;
	}

	getFeatureDescription = (id) => {
		return this.props.features.find(f => f.id == id).description;
	}

	getPurposeName = (id) => {
		return this.props.purposes.find(f => f.id == id).name;
	}

	getPurposeDescription = (id) => {
		return this.props.purposes.find(f => f.id == id).description;
	}

	render(props, state) {
		const {
			activeVendor
		} = state;

		const {
			vendors,
			features,
			purposes,
			onBack,
			theme,
		} = props;

		const {
			textColor,
			textLightColor,
			textLinkColor
		} = theme;

		return (
			<div class={style.vendorList}>
				<div class={style.header}>
					<div class={detailsStyle.title} style={{ color: textColor }}>
						<LocalLabel localizeKey='title'>Who is using this information?</LocalLabel>
					</div>
				</div>
				<div class={detailsStyle.description} style={{ color: textLightColor }}>
					<LocalLabel localizeKey='description'>Here is the complete list of companies who will use your information. Please view their privacy policy for more details.</LocalLabel>
				</div>
				<a onClick={onBack} style={{ color: textLinkColor }} class={style.customize}><LocalLabel localizeKey='back'>Customize how these companies use data from the previous page</LocalLabel></a>
				<table>
					{vendors.map(({ id, name, policyUrl, featureIds, purposeIds }, index) => (
						<tr class={index % 2 === 0 ? style.even : style.odd}>
							<td>
								<div class={style.company} style={{ color: textLightColor }}>
									{name}
									<a onClick={this.handleActiveVendor(id)}>More Info</a>
								</div>
								{activeVendor == id &&
									<div class={style.vendorInfo}>
										<div>
											<h3>Privacy Policy</h3>
											<ul>
												<li><a href={policyUrl} className={style.policy} style={{ color: textLinkColor }} target='_blank'>Click Here (External URL) <ExternalLinkIcon color={textLinkColor} /></a></li>
											</ul>
										</div>
										{purposeIds.length > 0 &&
											<div>
												<h3>Purposes</h3>
												<ul>
													{purposeIds.map((id, index) =>
														<li>
															<strong>{this.getPurposeName(id)}</strong>
															<span>{this.getPurposeDescription(id)}</span>
														</li>
													)}
												</ul>
											</div>
										}
										{featureIds.length > 0 &&
											<div>
												<h3>Features</h3>
												<ul>
													{featureIds.map((id, index) =>
														<li>
															<strong>{this.getFeatureName(id)}</strong>
															<span>{this.getFeatureDescription(id)}</span>
														</li>
													)}
												</ul>
											</div>
										}
									</div>
								}
							</td>
						</tr>

					))}
				</table>
			</div>
		);
	}
}
