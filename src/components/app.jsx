import { h, Component } from 'preact';
import style from './app.less';
import { SECTION_PURPOSES, SECTION_VENDORS } from './popup/details/details';
import Popup from './popup/popup';
import Banner from './banner/banner';
import MiniButton from './minibutton/minibutton';

export default class App extends Component {
	static defaultProps = {
		theme: {}
	};

	state = {
		store: this.props.store,
		selectedDetailsPanelIndex: SECTION_PURPOSES,
		visitedPurposes: {},
	};

	onSave = () => {
		const { store, notify } = this.props;
		store.persist();
		notify('onSubmit');
		store.toggleConsentToolShowing(false);
		store.toggleMiniButtonShowing(true);
	};

	onChangeDetailsPanel = panelIndex => {
		this.props.store.toggleModalShowing(true);
		this.props.store.toggleMiniButtonShowing(false);

		this.setState({
			selectedDetailsPanelIndex: Math.max(0, panelIndex)
		});
	};

	onSelectPurpose = purposeItem => {
		const { visitedPurposes } = this.state;
		const { store } = this.props;
		const {
			selectAllVendors,
			vendorConsentData: { created }
		} = store;

		// If this is the user's first visit according to their cookie data
		// our workflow is to default all vendor consents to disallow for
		// each purpose they inspect.
		if (!created &&
			!visitedPurposes[purposeItem.id]) {
			selectAllVendors(false, purposeItem.id);
		}
		this.setState({
			visitedPurposes: {
				...visitedPurposes,
				[purposeItem.id]: true
			}
		});

		store.toggleModalShowing(true);
		store.toggleMiniButtonShowing(false);

		this.setState({
			selectedPurposeDetails: purposeItem,
			selectedDetailsPanelIndex: SECTION_VENDORS
		});
	};

	updateState = (store) => {
		this.setState({ store });
	};

	componentWillMount() {
		const { store } = this.props;
		store.subscribe(this.updateState);
	}

	render(props, state) {

		const {
			store,
			selectedDetailsPanelIndex,
			selectedPurposeDetails,
		} = state;
		const {
			theme,
		} = props;

		const {
			isModalShowing,
			isBannerShowing,
			isMiniButtonShowing,
			toggleModalShowing,
			vendorList = {},
		} = store;

		const { purposes = [], features = [] } = vendorList;

		return (
			<div class={style.gdpr}>
				<MiniButton isShowing={isMiniButtonShowing}
					onClick={toggleModalShowing}
					theme={theme}
				/>
				<Banner isShowing={isBannerShowing}
					isModalShowing={isModalShowing}
					onSave={this.onSave}
					onShowModal={toggleModalShowing}
					onSelectPurpose={this.onSelectPurpose}
					onChangeDetailsPanel={this.onChangeDetailsPanel}
					theme={theme}
					purposes={purposes}
					features={features}
					selectedPurposeDetails={selectedPurposeDetails}
				/>
				<Popup store={store}
					onSave={this.onSave}
					onChangeDetailsPanel={this.onChangeDetailsPanel}
					onSelectPurpose={this.onSelectPurpose}
					selectedDetailsPanelIndex={selectedDetailsPanelIndex}
					theme={theme}
					selectedPurposeDetails={selectedPurposeDetails}
				/>
			</div>
		);
	}
}
