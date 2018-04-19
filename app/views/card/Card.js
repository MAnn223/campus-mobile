import React from 'react';
import { connect } from 'react-redux';
import ElevatedView from 'react-native-elevated-view';
import css from '../../styles/css';
import CardHeader from './CardHeader';
import CardMenu from './CardMenu';

const Card = ({ hideMenu, cardRefresh, id, title, header, hide, children }) => (
	<ElevatedView
		style={css.card_container}
		ref={(i) => { this._card = i; }}
		elevation={3}
	>
		{(title || header) ? (
			<CardHeader
				id={id}
				title={title}
				menu={
					<CardMenu
						hideMenu={hideMenu}
						cardRefresh={cardRefresh}
						hideCard={hide}
						id={id}
					/>
				}
				image={header}
			/>
		) : (null)}
		{children}
	</ElevatedView>
);

const mapDispatchToProps = (dispatch) => ({
	hide: (id) => {
		dispatch({ type: 'UPDATE_CARD_STATE', id, state: false });
	}
});

export default connect(null, mapDispatchToProps)(Card);
