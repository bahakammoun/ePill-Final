import axios from "axios";
import React from "react";

import {translate} from "react-i18next";
import { toast } from 'react-toastify';

import User from "./../util/User";


class EmptyList extends React.Component {
	constructor(props) {
		super(props);

		this.refresh	= this.props.refresh;
		this.isAllergic = this.props.isAllergic;

	}

	render() {
		const {t} = this.props;

		return (
			<div className="col-sm-8 col-sm-offset-2 col-md-4 col-md-offset-4 col-lg-4 col-lg-offset-4">
				<p>{t('emptyList')}</p>
				{typeof this.refresh == "function" &&
				<button type="button" className="btn btn-default" onClick={this.refresh} title={t('refresh')}>
					<span className="glyphicon glyphicon-refresh"></span>
				</button>
				}
				{
					this.isAllergic  &&
					<p>You are allergic</p>
				}
			</div>
		);
	}
}

export default translate()(EmptyList);