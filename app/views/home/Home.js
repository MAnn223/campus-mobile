import React from 'react'
import { Image, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { checkGooglePlayServices } from 'react-native-google-api-availability-bridge'

import WeatherCardContainer from '../weather/WeatherCardContainer'
import ShuttleCardContainer from '../shuttle/ShuttleCardContainer'
import EventCardContainer from '../events/EventCardContainer'
import QuicklinksCardContainer from '../quicklinks/QuicklinksCardContainer'
import NewsCardContainer from '../news/NewsCardContainer'
import DiningCardContainer from '../dining/DiningCardContainer'
import SpecialEventsCardContainer from '../specialEvents/SpecialEventsCardContainer'
import FinalsCard from '../schedule/FinalsCard'
import ScheduleCardContainer from '../schedule/ScheduleCardContainer'
import { platformAndroid, gracefulFatalReset } from '../../util/general'
import css from '../../styles/css'
import logger from '../../util/logger'

const campusLogoImage = require('../../assets/images/UCSanDiegoLogo-White.png')

export class Home extends React.Component {
	static navigationOptions = {
		title: 'Home',
		headerTitle: <Image source={campusLogoImage} style={css.navCampusLogoTitle} />
	};

	constructor(props) {
		super(props)
		this.state = { updatedGoogle: true }
	}

	componentWillMount() {
		if (platformAndroid()) {
			this.updateGooglePlay()
		}
	}

	componentDidMount() {
		logger.ga('View Loaded: Home')
		this._cards = []

		if (this._scrollview) {
			this._scrollview.scrollTo({ y: this.props.lastScroll, animated: false })
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.cards !== nextProps.cards ||
			this.props.cardOrder !== nextProps.cardOrder) {
			return true
		} else {
			return false
		}
	}

	handleScroll = (event) => {
		if (this.props.updateScroll) {
			this.props.updateScroll(event.nativeEvent.contentOffset.y)
		}
	}

	_getCards = () => {
		const activeCards = []

		if (Array.isArray(this.props.cardOrder)) {
			this.props.cardOrder.forEach((card) => {
				if (this.props.cards[card].active) {
					switch (card) {
					case 'specialEvents':
						activeCards.push(<SpecialEventsCardContainer key="specialEvents" />)
						break
					case 'finals':
						activeCards.push(<FinalsCard key="finals" />)
						break
					case 'schedule':
						activeCards.push(<ScheduleCardContainer key="schedule" />)
						break
					case 'weather':
						activeCards.push(<WeatherCardContainer key="weather" />)
						break
					case 'shuttle':
						activeCards.push(<ShuttleCardContainer key="shuttle" />)
						break
					case 'dining':
						activeCards.push(<DiningCardContainer key="dining" />)
						break
					case 'events':
						activeCards.push(<EventCardContainer key="events" />)
						break
					case 'quicklinks':
						activeCards.push(<QuicklinksCardContainer key="quicklinks" />)
						break
					case 'news':
						activeCards.push(<NewsCardContainer key="news" />)
						break
					default:
						return gracefulFatalReset(new Error('Invalid card in state: ', card))
					}
				}
			})
		}
		return activeCards
	}

	updateGooglePlay = () => {
		checkGooglePlayServices((result) => {
			if (result === 'update') {
				this.setState({ updatedGoogle: false })
			}
		})
	}

	render() {
		return (
			<ScrollView
				ref={(c) => { this._scrollview = c }}
				onScroll={this.handleScroll}
				scrollEventThrottle={0}
			>
				{/* LOAD CARDS */}
				{ this._getCards() }
			</ScrollView>
		)
	}
}

function mapStateToProps(state, props) {
	return {
		cards: state.cards.cards,
		cardOrder: state.cards.cardOrder,
		lastScroll: state.home.lastScroll,
	}
}

function mapDispatchtoProps(dispatch) {
	return {
		updateScroll: (scrollY) => {
			dispatch({ type: 'UPDATE_HOME_SCROLL', scrollY })
		}
	}
}
export default connect(mapStateToProps, mapDispatchtoProps)(Home)
