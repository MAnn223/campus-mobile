import React from 'react'
import { View } from 'react-native'
import { StackNavigator, TabNavigator } from 'react-navigation'
import { MenuProvider } from 'react-native-popup-menu'
import { connect } from 'react-redux'

// VIEWS
import Home from '../views/home/Home'
import OnboardingIntro from '../views/login/OnboardingIntro'
import OnboardingLogin from '../views/login/OnboardingLogin'
import SurfReport from '../views/weather/SurfReport'
import ShuttleStop from '../views/shuttle/ShuttleStop'
import DiningDetail from '../views/dining/DiningDetail'
import DiningNutrition from '../views/dining/DiningNutrition'
import EventDetail from '../views/events/EventDetail'
import NewsDetail from '../views/news/NewsDetail'
import FeedbackView from '../views/feedback/FeedbackView'
import Preferences from '../views/preferences/Preferences'
import NearbyMapView from '../views/mapsearch/NearbyMapView'
import DataListViewAll from '../views/common/DataListViewAll'
import SpecialEventsView from '../views/specialEvents/SpecialEventsView'
import SpecialEventsDetailView from '../views/specialEvents/SpecialEventsDetailView'
import SpecialEventsFilterListView from '../views/specialEvents/SpecialEventsFilterListView'
import ShuttleRoutesListView from '../views/shuttle/ShuttleRoutesListView'
import ShuttleStopsListView from '../views/shuttle/ShuttleStopsListView'
import ShuttleSavedListView from '../views/shuttle/ShuttleSavedListView'
import FullSchedule from '../views/schedule/FullScheduleListView'

// TABS
import TabIcons from './TabIcons'

// ROUTER UTIL
import withNavigationPreventDuplicate from './withNavigationPreventDuplicate'

// MISC
import {
	COLOR_SECONDARY,
	COLOR_WHITE,
	COLOR_MGREY
} from '../styles/ColorConstants'
import css from '../styles/css'
import general from '../util/general'

const TabNav = TabNavigator(
	{
		Home: { screen: Home },
		Map: { screen: NearbyMapView },
		Feedback: { screen: FeedbackView },
		Preferences: { screen: Preferences }
	},
	{
		tabBarOptions: {
			showLabel: false,
			showIcon: true,

			pressColor: COLOR_MGREY,
			indicatorStyle: { backgroundColor: COLOR_SECONDARY },
			style: general.platformIOS() ? css.tabBarIOS : css.tabBarAndroid,
			iconStyle: { width: 26, height: 26 }
		},
		navigationOptions: ({ navigation }) => ({
			tabBarIcon: ({ focused }) => {
				const { routeName } = navigation.state
				return <TabIcons title={routeName} focused={focused} />
			},
			swipeEnabled: false
		})
	}
)

const DummyView = () => (<View />) /* Workaround for misaligned title */

const MainStack = StackNavigator(
	{
		MainTabs: { screen: TabNav },
		SurfReport: {
			screen: SurfReport,
			navigationOptions: {
				title: 'Surf Report',
				headerRight: (<DummyView />)
			}
		},
		NewsDetail: {
			screen: NewsDetail,
			navigationOptions: {
				title: 'News',
				headerRight: (<DummyView />)
			}
		},
		EventDetail: {
			screen: EventDetail,
			navigationOptions: {
				title: 'Events',
				headerRight: (<DummyView />)
			}
		},
		DiningDetail: {
			screen: DiningDetail,
			navigationOptions: {
				title: 'Dining',
				headerRight: (<DummyView />)
			}
		},
		DiningNutrition: {
			screen: DiningNutrition,
			navigationOptions: {
				title: 'Nutrition',
				headerRight: (<DummyView />)
			}
		},
		ShuttleStop: {
			screen: ShuttleStop,
			navigationOptions: {
				title: 'Shuttle',
				headerRight: (<DummyView />)
			}
		},
		ShuttleStopsListView: {
			screen: ShuttleStopsListView,
			navigationOptions: {
				title: 'Choose Stop',
				headerRight: (<DummyView />)
			}
		},
		ShuttleSavedListView: {
			screen: ShuttleSavedListView,
			navigationOptions: {
				title: 'Manage Stops',
				headerRight: (<DummyView />)
			}
		},
		ShuttleRoutesListView: {
			screen: ShuttleRoutesListView,
			navigationOptions: {
				title: 'Choose Route',
				headerRight: (<DummyView />)
			}
		},
		SpecialEventsView: { screen: SpecialEventsView },
		SpecialEventsFilters: {
			screen: SpecialEventsFilterListView,
			navigationOptions: ({ navigation }) => {
				const { params } = navigation.state
				const { title } = params
				return {
					title,
					headerRight: (<DummyView />)
				}
			}
		},
		SpecialEventsDetailView: {
			screen: SpecialEventsDetailView,
			navigationOptions: ({ navigation }) => {
				const { params } = navigation.state
				const { title } = params
				return {
					title,
					headerRight: (<DummyView />)
				}
			}
		},
		FullSchedule: {
			screen: FullSchedule,
			navigationOptions: { title: 'Full Schedule' }
		},
		DataListViewAll: {
			screen: DataListViewAll,
			navigationOptions: ({ navigation }) => {
				const { params } = navigation.state
				const { title } = params
				return {
					title,
					headerRight: (<DummyView />)
				}
			}
		}
	},
	{
		initialRouteName: 'MainTabs',
		navigationOptions: {
			headerStyle: css.nav,
			headerTitleStyle: css.navTitle,
			headerTintColor: COLOR_WHITE
		}
	}
)

const OnboardingStack = StackNavigator(
	{
		OnboardingIntro: {
			screen: OnboardingIntro,
			navigationOptions: { header: null }
		},
		OnboardingLogin: {
			screen: OnboardingLogin,
			navigationOptions: { header: null }
		},
	},
	{
		initialRouteName: 'OnboardingIntro',
		headerMode: 'none'
	}
)

MainStack.router.getStateForAction = withNavigationPreventDuplicate(MainStack.router.getStateForAction)
OnboardingStack.router.getStateForAction = withNavigationPreventDuplicate(OnboardingStack.router.getStateForAction)

const Router = ({ onBoardingViewed }) => (
	<MenuProvider>
		{
			(onBoardingViewed) ? (
				<MainStack />
			) : (
				<OnboardingStack />
			)
		}
	</MenuProvider>
)

const mapStateToProps = (state, props) => (
	{ onBoardingViewed: state.routes.onBoardingViewed }
)

export default connect(mapStateToProps)(Router)
