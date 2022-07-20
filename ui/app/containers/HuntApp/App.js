/*
Copyright(C) 2018 Stamus Networks
Written by Eric Leblond <eleblond@stamus-networks.com>

This file is part of Scirius.

Scirius is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Scirius is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Scirius.  If not, see <http://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import { ShortcutManager } from 'react-shortcuts';
import PropTypes from 'prop-types';
import axios from 'axios';
import ErrorHandler from 'ui/components/Error';
import DisplayPage from 'ui/components/DisplayPage';
import * as config from 'config/Api';
import EmitEvent from '../../helpers/EmitEvent';
import keymap from '../../Keymap';

const shortcutManager = new ShortcutManager(keymap);

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export default class HuntApp extends Component {
  constructor(props) {
    super(props);
    this.timer = null;
    let alertsListConf = localStorage.getItem('alerts_list');
    let historyConf = localStorage.getItem('history');
    let filtersListConf = localStorage.getItem('filters_list');
    let historyFilters = localStorage.getItem('history_filters');

    if (!alertsListConf) {
      alertsListConf = {
        pagination: {
          page: 1,
          perPage: 100,
          perPageOptions: [20, 50, 100],
        },
        sort: { id: 'timestamp', asc: false },
        view_type: 'list',
      };
      localStorage.setItem('alerts_list', JSON.stringify(alertsListConf));
    } else {
      alertsListConf = JSON.parse(alertsListConf);
    }

    if (!filtersListConf) {
      filtersListConf = {
        pagination: {
          page: 1,
          perPage: 20,
          perPageOptions: [20, 50, 100],
        },
        sort: { id: 'timestamp', asc: false },
        view_type: 'list',
      };
      localStorage.setItem('filters_list', JSON.stringify(filtersListConf));
    } else {
      filtersListConf = JSON.parse(filtersListConf);
    }

    if (!historyConf) {
      historyConf = {
        pagination: {
          page: 1,
          perPage: 6,
          perPageOptions: [6, 10, 15, 25, 50],
        },
        sort: { id: 'date', asc: false },
        view_type: 'list',
      };
      localStorage.setItem('history', JSON.stringify(historyConf));
    } else {
      historyConf = JSON.parse(historyConf);
    }

    if (!historyFilters) {
      historyFilters = [];
      localStorage.setItem('history_filters', JSON.stringify(historyFilters));
    } else {
      historyFilters = JSON.parse(historyFilters);
    }

    this.state = {
      alerts_list: alertsListConf,
      history: historyConf,
      historyFilters,
      filters_list: filtersListConf,
    };
    this.updateAlertListState = this.updateAlertListState.bind(this);
    this.updateHistoryListState = this.updateHistoryListState.bind(this);
    this.updateHistoryFilterState = this.updateHistoryFilterState.bind(this);
    this.updateFilterListState = this.updateFilterListState.bind(this);
  }

  getChildContext() {
    return { shortcuts: shortcutManager };
  }

  componentDidMount() {
    axios.get(config.API_URL + config.SYSTEM_SETTINGS_PATH).then(systemSettings => {
      this.setState({ systemSettings: systemSettings.data });
    });
  }

  updateAlertListState(alertsListState, fetchDataCallback) {
    this.setState({ alerts_list: alertsListState }, fetchDataCallback);
    localStorage.setItem('alerts_list', JSON.stringify(alertsListState));
  }

  updateFilterListState(filtersListState, fetchDataCallback) {
    this.setState({ filters_list: filtersListState }, fetchDataCallback);
    localStorage.setItem('filters_list', JSON.stringify(filtersListState));
  }

  updateHistoryFilterState(filters, fetchDataCallback) {
    this.setState({ historyFilters: filters }, fetchDataCallback);
    localStorage.setItem('history_filters', JSON.stringify(filters));
  }

  updateHistoryListState(historyState, fetchDataCallback) {
    this.setState({ history: historyState }, fetchDataCallback);
    localStorage.setItem('history', JSON.stringify(historyState));
  }

  adjustDashboardWidth = () => {
    setTimeout(() => {
      EmitEvent('resize');
      EmitEvent('resize');
    }, 150);
  };

  render() {
    return (
      <div className="layout-pf layout-pf-fixed faux-layout">
        <div className="container-fluid container-pf-nav-pf-vertical nav-pf-persistent-secondary">
          <div className="row row-cards-pf">
            <div className="col-xs-12 col-sm-12 col-md-12 no-col-gutter-right" id="app-content">
              <ErrorHandler>
                <DisplayPage
                  page={this.props.page}
                  systemSettings={this.state.systemSettings}
                  history_list={this.state.history}
                  historyFilters={this.state.historyFilters}
                  updateHistoryListState={this.updateHistoryListState}
                  updateHistoryFilterState={this.updateHistoryFilterState}
                  alerts_list={this.state.alerts_list}
                  updateAlertListState={this.updateAlertListState}
                  filters_list={this.state.filters_list}
                  updateFilterListState={this.updateFilterListState}
                  updateFiltersFilterState={this.updateFiltersFilterState}
                  updateHostListState={this.updateHostListState}
                  hosts_list={this.state.hosts_list}
                />
              </ErrorHandler>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

HuntApp.childContextTypes = {
  shortcuts: PropTypes.object.isRequired,
};

HuntApp.propTypes = {
  page: PropTypes.string.isRequired,
  user: PropTypes.shape({
    pk: PropTypes.any,
    timezone: PropTypes.any,
    username: PropTypes.any,
    firstName: PropTypes.any,
    lastName: PropTypes.any,
    isActive: PropTypes.any,
    email: PropTypes.any,
    dateJoined: PropTypes.any,
    permissions: PropTypes.any,
  }),
};
