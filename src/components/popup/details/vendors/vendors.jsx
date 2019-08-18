import { h, Component } from 'preact';
import style from './vendors.less';
import detailsStyle from '../details.less';
import Switch from '../../../switch/switch';
import Label from "../../../label/label";
import ExternalLinkIcon from '../../../externallinkicon/externallinkicon'

class VendorsLabel extends Label {
	static defaultProps = {
		prefix: 'vendors'
	};
}
class PurposesLabel extends Label {
	static defaultProps = {
		prefix: 'purposes'
	};
}

export default class Vendors extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isSelectAll: true
		};

		this.state.activeVendor = 0;
	}

	static defaultProps = {
		vendors: [],
		selectedVendorIds: new Set(),
		selectVendor: () => { },
		selectAllVendors: () => { },
		selectedPurposeDetails: {}
	};

	handleToggleAll = () => {
		const { id: selectedPurposeId } = this.props.selectedPurposeDetails;
		const { isSelectAll } = this.state;
		this.props.selectAllVendors(isSelectAll, selectedPurposeId);
		this.setState({ isSelectAll: !isSelectAll });
	};

	handleSelectVendor = ({ dataId, isSelected }) => {
		this.props.selectVendor(dataId, isSelected);
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

		const { isSelectAll, activeVendor } = state;
		const {
			vendors,
			purposes,
			features,
			selectedVendorIds,
			selectedPurposeDetails,
			theme,
		} = props;

		const {
			textColor,
			textLightColor,
			textLinkColor,
			primaryColor
		} = theme;

		const {
			id: selectedPurposeId,
			name,
			description
		} = selectedPurposeDetails;

		const validVendors = vendors
			.filter(({ legIntPurposeIds = [], purposeIds = [] }) => legIntPurposeIds.indexOf(selectedPurposeId) > -1 || purposeIds.indexOf(selectedPurposeId) > -1);

		return (
			<div class={style.vendors}>
				<div class={style.header}>
					<div class={detailsStyle.title} style={{ color: textColor }}>
						<PurposesLabel localizeKey={`purpose${selectedPurposeId}.title`}>{name}</PurposesLabel>
					</div>
				</div>
				<div class={detailsStyle.description} style={{ color: textLightColor }}>
					<p><PurposesLabel localizeKey={`purpose${selectedPurposeId}.description`}>{description}</PurposesLabel></p>
					<p><PurposesLabel localizeKey='optoutdDescription'>
						Depending on the type of data they collect, use,
						and process and other factors including privacy by design, certain partners rely on your consent while others require you to opt-out.
						For information on each vendor and to exercise your choices, see below.
						Or to opt-out, visit the <a href='http://optout.networkadvertising.org/?c=1#!/' target='_blank' style={{ color: textLinkColor }}>NAI</a>
						, <a href='http://optout.aboutads.info/?c=2#!/' target='_blank' style={{ color: textLinkColor }}>DAA</a>
						, or <a href='http://youronlinechoices.eu/' target='_blank' style={{ color: textLinkColor }}>EDAA</a> sites.
					</PurposesLabel></p>
				</div>
				<a class={style.toggleAll} onClick={this.handleToggleAll} style={{ color: primaryColor }}>
					{isSelectAll ?
						<VendorsLabel localizeKey='acceptAll'>Allow All</VendorsLabel> :
						<VendorsLabel localizeKey='acceptNone'>Disallow All</VendorsLabel>
					}
				</a>
				<div class={style.vendorContent}>
					<table class={style.vendorList}>
						<tbody>
							{validVendors.map(({ id, name, purposeIds, policyUrl, policyUrlDisplay, featureIds }, index) => (
								<tr key={id} class={index % 2 === 0 ? style.even : ''}>
									<td>
										<div class={style.vendorName}>
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
									<td class={style.allowColumn}>
										{purposeIds.indexOf(selectedPurposeDetails.id) > -1 ?
											<span class={style.allowSwitch}>
												<VendorsLabel localizeKey='accept'>Allow</VendorsLabel> <Switch
													color={primaryColor}
													dataId={id}
													isSelected={selectedVendorIds.has(id)}
													onClick={this.handleSelectVendor}
												/>
											</span> :
											<VendorsLabel localizeKey='optOut'>requires opt-out</VendorsLabel>
										}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}
