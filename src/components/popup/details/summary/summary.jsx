import { h, Component } from 'preact';
import style from './summary.less';
import detailsStyle from '../details.less';
import Switch from '../../../switch/switch';
import Label from "../../../label/label";

class VendorsLabel extends Label {
	static defaultProps = {
		prefix: 'vendors'
	};
}
class SummaryLabel extends Label {
	static defaultProps = {
		prefix: 'summary'
	};
}
class PurposesLabel extends Label {
	static defaultProps = {
		prefix: 'purposes'
	};
}

export default class Summary extends Component {
	constructor(props) {
		super(props);

		this.state = {
			allowedPurposes: [],
		}

		this.props.purposes.map(purpose => {
			const validVendors = this.props.vendors
				.filter(({ legIntPurposeIds = [], purposeIds = [] }) => legIntPurposeIds.indexOf(purpose.id) > -1 || purposeIds.indexOf(purpose.id) > -1);

			validVendors.map(({ id, name, purposeIds, policyUrl, policyUrlDisplay }, index) => {
				if (purposeIds.indexOf(purpose.id) > -1 && this.props.selectedVendorIds.has(id) && this.state.allowedPurposes.indexOf(purpose.id) === -1) {
					this.state.allowedPurposes.push(purpose.id);
				}
			});

			return purpose;
		});
	}

	static defaultProps = {
		vendors: [],
	};

	handlePurposeItemClick = purposeItem => {
		return () => {
			this.props.onPurposeClick(purposeItem);
		};
	};

	handleToggle = index => {
		return () => {
			let stateCopy = Object.assign({}, this.state);

			this.props.purposes.map((purpose, i) => {
				if (i === index) {
					const allowed = stateCopy.allowedPurposes.indexOf(purpose.id) > -1;
					this.props.selectAllVendors(!allowed, purpose.id);

					if (allowed) {
						stateCopy.allowedPurposes.splice(stateCopy.allowedPurposes.indexOf(purpose.id), 1);
					} else if (!allowed && stateCopy.allowedPurposes.indexOf(purpose.id) === -1) {
						stateCopy.allowedPurposes.push(purpose.id);
					}
				}
			});

			this.setState(stateCopy);
		};
	};

	handleToggleAll = () => {
		let stateCopy = Object.assign({}, this.state);
		if (stateCopy.allowedPurposes.length == 0) {
			this.props.purposes.map(purpose => {
				stateCopy.allowedPurposes.push(purpose.id);
				this.props.selectAllVendors(true, purpose.id);
			});
		} else {
			this.props.purposes.map(purpose => {
				this.props.selectAllVendors(false, purpose.id);
			});
			stateCopy.allowedPurposes = [];
		}

		this.setState(stateCopy);
	};

	render(props, state) {
		const {
			allowedPurposes
		} = state;

		const {
			purposes,
			features,
			onVendorListClick,
			onPurposeListClick,
			theme,
		} = props;

		const {
			textColor,
			dividerColor,
			textLinkColor,
			primaryColor
		} = theme;

		return (
			<div class={style.summary}>
				<div class={detailsStyle.title} style={{ color: textColor }}>
					<SummaryLabel localizeKey='title'>Data collection</SummaryLabel>
				</div>
				<div class={detailsStyle.description}>
					<SummaryLabel localizeKey='description'>
						Our partners access, collect, store and use your information for the purposes and features defined below. You have the right to modify your consent at any time using this utility.
						Some companies require special action to exercise your right to object, and their entries will contain links to their privacy policy for more information.
					</SummaryLabel>
				</div>

				<span class={style.allowSwitch}>
					{allowedPurposes.length > 0 ?
						<VendorsLabel localizeKey='accept'>Allowed</VendorsLabel> :
						<VendorsLabel localizeKey='decline'>Disallowed</VendorsLabel>
					} <Switch
						color={primaryColor}
						isSelected={allowedPurposes.length > 0}
						onClick={this.handleToggleAll}
					/>
				</span>

				<div class={detailsStyle.title} style={{ color: textColor }}>
					<SummaryLabel localizeKey='titlePurposes'>Our partners' purposes</SummaryLabel>
				</div>

				<div class={style.purposeItems}>
					{purposes.map((purposeItem, index) => (
						<div class={style.purposeItem} style={{ borderColor: dividerColor }}>

							<span class={style.allowSwitch}>
								{allowedPurposes.indexOf(purposeItem.id) > -1 ?
									<VendorsLabel localizeKey='acceptAll'>Allowed</VendorsLabel> :
									<VendorsLabel localizeKey='declineAll'>Disallowed</VendorsLabel>
								} <Switch
									color={primaryColor}
									dataId={purposeItem.id}
									isSelected={allowedPurposes.indexOf(purposeItem.id) > -1}
									onClick={this.handleToggle(index)}
								/>
							</span>

							<span class={style.purposeTitle} style={{ color: textColor }}><PurposesLabel localizeKey={`purpose${purposeItem.id}.menu`}>{purposeItem.name}</PurposesLabel></span>
							<span class={style.purposeDescription}><SummaryLabel localizeKey={`purpose${purposeItem.id}.description`}>{purposeItem.description}</SummaryLabel></span>
							<a class={style.learnMore} onClick={this.handlePurposeItemClick(purposeItem)} style={{ color: textLinkColor }}>
								<SummaryLabel localizeKey='detailLink'>View all companies &amp; control individual access</SummaryLabel>
							</a>
						</div>
					))}
				</div>
				<div class={detailsStyle.title} style={{ color: textColor }}>
					<SummaryLabel localizeKey='titleFeatures'>Our partners' features</SummaryLabel>
				</div>
				<div class={style.purposeItems}>
					{features.map((featureItem, index) => (
						<div class={style.purposeItem} style={{ borderColor: dividerColor }}>
							<span class={style.purposeTitle}><SummaryLabel localizeKey={`purpose${featureItem.id}.menu`}>{featureItem.name}</SummaryLabel></span>
							<span class={style.purposeDescription}><SummaryLabel localizeKey={`purpose${featureItem.id}.description`}>{featureItem.description}</SummaryLabel></span>
						</div>
					))}
				</div>
				<div class={detailsStyle.title} style={{ color: textColor }}>
					<SummaryLabel localizeKey='who.title'>Who is using this information?</SummaryLabel>
				</div>
				<div class={detailsStyle.description}>
					<SummaryLabel localizeKey='who.description'>
						We and third party partners will use your information. You can see each company in the links above or
					</SummaryLabel>&nbsp;
					<a onClick={onVendorListClick} style={{ color: textLinkColor }}><SummaryLabel localizeKey='who.link'>see the complete list here.</SummaryLabel></a>
				</div>
				<div class={detailsStyle.title} style={{ color: textColor }}>
					<SummaryLabel localizeKey='what.title'>What information is being used?</SummaryLabel>
				</div>
				<div class={detailsStyle.description}>
					<SummaryLabel localizeKey='what.description'>
						Different companies use different information,
					</SummaryLabel>&nbsp;
					<a onClick={onPurposeListClick} style={{ color: textLinkColor }}><SummaryLabel localizeKey='what.link'>see the complete list here.</SummaryLabel></a>
				</div>
			</div>
		);
	}
}
