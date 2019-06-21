import { Text, View, ScrollView, Dimensions, Button, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { connect } from 'react-redux'

import auth from '../../../util/auth'
import CourseListMockData from './CourseListMockData.json'
import { getDayOfWeek } from '../../../util/schedule'
import CourseCard from './CourseCard'

const { width, height } = Dimensions.get('window')
const CARD_WIDTH = (width - 70) / 7
const CARD_HEIGHT = 50
// const COLOR_LIST = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0',
// '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3',
// '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000']
const COLOR_LIST = ['#ffdfba', '#ffffba', '#baffc9', '#bae1ff', 'rgb(193, 224, 252)']

const MOCK_DATE = ['6/8/19', '6/10/19', '6/11/19', '6/12/19', '6/13/19', '6/14/19', '6/15/19']

class FinalCalendar extends React.Component {
	constructor(props) {
		super(props)
		this.state = { courses: CourseListMockData.data, sample: CourseListMockData.data[0], courseList: getCourseList(CourseListMockData.data) }
	}

	renderCourseCard() {
		const res = []
		Object.keys(this.state.courseList).map((item, i) => {
			this.state.courseList[item].data.map((course, index) => {
				const { color = 0, name, location, display, type, selected, x, y, height, width, status = 'enrolled' } = course
				res.push(<CourseCard
					selected={this.props.selectedCourse && this.props.selectedCourse === name}
					color={COLOR_LIST[color % COLOR_LIST.length]}
					name={name}
					location={location}
					display={display}
					type={type}
					x={x}
					y={y}
					height={height}
					width={width}
					status={status}
					onPress={() => {
						this.props.selectCourse(name, this.state.courseList[item].course)
						this.setState({ courseList: { ...this.state.courseList, [name]: { ...this.state.courseList[name], selected: !this.state.courseList[item].selected } } })
					}
					}
				/>)
				return null
			})
			return null
		})
		return res
	}

	getBottomMargin(device) {
		switch(device) {
			case 1:
				return 55
			case 2:
				return 72
			default:
				return 0
		}
	}

	render() {
		const { courses, sample } = this.state
		const days = ['Sat', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
		const hours = ['8 am', '9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 pm', '8 pm', '9 pm']
		const { device } = this.props

		const {
			cardStyle,
			daysContainerStyle,
			dayContainerStyle,
			dayTextStyle,
			timeTextStyle,
			timeRowStyle,
			timeContainerStyle
		} = styles

		let offset = 0

		switch (device) {
			case 1:
				offset = 60
				break
			case 2:
				offset = 77
				break
			case 0:
			default:
				offset = 0
				break
		}

		return (
			<View style={[cardStyle, { marginBottom: this.getBottomMargin(this.props.device) }]}>
				{ /* <Button onPress={() => auth.retrieveAccessToken().then(credentials => console.log(credentials))} title="Get Access Token" /> */}
				<View style={daysContainerStyle}>
					{days.map((day, i) => (
						<View style={dayContainerStyle} key={day}>
							<Text style={[dayTextStyle, { paddingBottom: 0 }]}>{day}</Text>
							<Text style={[dayTextStyle, { paddingTop: 0 }]}>{MOCK_DATE[i]}</Text>
						</View>
					))}
				</View>
				<ScrollView
					style={{ flex: 1 }}
					showsVerticalScrollIndicator={false}
				>

					<View style={{
						flexDirection: 'row',
						flex: 1,
						justifyContent: 'flex-start',
					}}
					>
						<View style={{
							flex: 1 / 7,
							flexDirection: 'column',
							alignItems: 'stretch',
							justifyContent: 'center'
						}}
						>
							{hours.map((hour, i) => (
								<View style={[timeRowStyle, { borderBottomWidth: i === 13 ? 1 : 0 }]} key={hour}>
									<View style={timeContainerStyle}>
										<Text style={timeTextStyle}>
											{hour}
										</Text>
									</View>
								</View>
							))}
						</View>
						{
							days.map((item, index) => (
								<View style={{
									flex: 1 / 7,
									flexDirection: 'column',
									alignItems: 'stretch',
									justifyContent: 'center'
								}}
								>
									{hours.map((hour, i) => (
										<View style={[timeRowStyle, { borderBottomWidth: i === 13 ? 1 : 0 }]} key={hour}>
											<View style={timeContainerStyle}>
												<View style={{ height: 50 }} />
											</View>
										</View>
									))}
								</View>))
						}
					</View>
					<TouchableWithoutFeedback onPress={() => this.props.selectCourse(null, null)}>
						<View
							style={{
								position: 'absolute',
								top: 0,
								bottom: 0,
								left: 0,
								right: 0,
							}}
						/>
					</TouchableWithoutFeedback>
					{
						this.renderCourseCard()
					}
				</ScrollView>
			</View>
		)
	}
}

const getCourseList = (courses) => {
	const obj = {}

	for (let i = 0; i < courses.length; i++) {
		const course = courses[i]
		const {
			subject_code,
			course_code,
			course_level,
			course_title,
			grade_option,
			section_data
		} = course

		section_data.map((item, index) => {
			const {
				section_code,
				meeting_type,
				time,
				days,
				date,
				building,
				room,
				special_mtg_code,
				section
			} = item

			let display,
				type,
				duration

			const name = subject_code + ' ' + course_code
			const location = building == undefined ? '' : building + ' ' + room

			// Handle Lectures, Dicussions, and finals
			if ( special_mtg_code === '' && meeting_type === 'Lecture' ) {
				return null
			} else if ( special_mtg_code === '' && meeting_type === 'Discussion' ) {
				return null
			} else if ( special_mtg_code !== undefined && special_mtg_code === 'FI' ) {
				display = 'Final'
				type = 'FI'
			} else {
				return null
			}

			const data = {
				display,
				type,
				name,
				location
			}

			let startTime,
				endTime

			const re = /^([0-2]?[1-9]):([0-5][0-9]) - ([0-2]?[1-9]):([0-5][0-9])$/

			const m = re.exec(time)
			if (m) {
				console.log(days, m[1], m[2], m[3], m[4])

				startTime = (Number.parseInt(m[1], 10) * 60) + Number.parseInt(m[2], 10)
				endTime = (Number.parseInt(m[3], 10) * 60) + Number.parseInt(m[4], 10)
				duration = endTime - startTime
			}
			// const x = ((getFinalIndex(days) + 1) * CARD_WIDTH) - 12.5 -- USE DAYS
			const x = ((getFinalIndex(date) + 1) * CARD_WIDTH) - 12.5
			const y = (((startTime / 60) - 8) * (CARD_HEIGHT + 1)) + 2
			const width  = CARD_WIDTH - 2
			const height = (CARD_HEIGHT / 60) * duration

			if (!obj[name]) {
				obj[name] = { selected: false, data: [], course }
			}
			obj[name].data.push({ x, y, width, height, display, type, name, location, color: i })
			return null
		})
	}
	return obj
}

const getFinalIndex = (date) => {
	let parsedArr = date.split('-')
	let parsedDate = trimZero(parsedArr[1]) + '/' + trimZero(parsedArr[2]) + '/' + parsedArr[0].substring(2, 4)
	return MOCK_DATE.indexOf(parsedDate)
}

const trimZero = (str) => {
	return str.charAt(0) === '0' ? str.charAt(1) : str
}

// const getFinalIndex = (day) => {
// 	// TODO: need to differentiate between the first Saturday and the second one
// 	let idx = -1
// 	switch (day) {
// 		case 'MO':
// 			idx = 1
// 			break
// 		case 'TU':
// 			idx = 2
// 			break
// 		case 'WE':
// 			idx = 3
// 			break
// 		case 'TH':
// 			idx = 4
// 			break
// 		case 'FR':
// 			idx = 5
// 			break
// 		case 'SA':
// 			idx = 0
// 			break
// 		default:
// 			idx = -1
// 	}
// 	return idx
// }

const styles = {
	cardStyle: {
		flex: 1,
		marginLeft: 20,
		marginRight: 20
	},
	daysContainerStyle: {
		marginLeft: 30,
		flexDirection: 'row',
	},
	dayContainerStyle: {
		flex: 1 / 7,
		justifyContent: 'center',
		alignItems: 'center'
	},
	dayTextStyle: {
		fontFamily: 'Helvetica Neue',
		textColor: 'black',
		paddingTop: 10,
		paddingBottom: 10,
		fontSize: 10
	},
	timeRowStyle: {
		flexDirection: 'row',
		borderTopWidth: 1,
		borderColor: '#B7B7B7'
	},
	timeContainerStyle: {
		width: 30,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
	},
	timeTextStyle: {
		fontFamily: 'Helvetica Neue',
		textColor: 'black',
		fontSize: 10
	}
}


function mapStateToProps(state) {
	return {
		selectedCourse: state.schedule.selectedCourse,
	}
}


const mapDispatchToProps = (dispatch, ownProps) => (
	{
		selectCourse: (selectedCourse, data) => {
			dispatch({ type: 'SELECT_COURSE', selectedCourse, data })
		},
	}
)

export default connect(mapStateToProps, mapDispatchToProps)(FinalCalendar)
