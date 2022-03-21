import { fromJS } from 'immutable';
import { createSelector } from 'reselect';
import storage from '../../../helpers/storage';

export const FILTER_PARAMS_SET = 'Hunt/HuntApp/FILTER_PARAM_SET';
export const FILTER_TIMESPAN_SET = 'Hunt/HuntApp/FILTER_TIMESPAN_SET';
export const FILTER_DURATION_SET = 'Hunt/HuntApp/FILTER_DURATION_SET';
export const TIMESTAMP_RELOAD = 'Hunt/HuntApp/TIMESTAMP_RELOAD';

export function filterParamsSet(paramName, paramValue) {
  return {
    type: FILTER_PARAMS_SET,
    paramName,
    paramValue,
  };
}

export function filterTimeSpanSet(timeSpan) {
  return {
    type: FILTER_TIMESPAN_SET,
    timeSpan,
  };
}

export function filterDurationSet(duration) {
  return {
    type: FILTER_DURATION_SET,
    duration,
  };
}
export function reload() {
  return {
    type: TIMESTAMP_RELOAD,
  };
}

const initialState = fromJS({});

export const absolute = {
  from: {
    id: 0,
    value: 0,
    time: moment(),
    now: false,
  },
  to: {
    id: 0,
    value: 0,
    time: moment(),
    now: false,
  },
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FILTER_PARAMS_SET: {
      const param = state.setIn([action.paramName], action.paramValue);
      storage.setItem(`filterParams.${action.paramName}`, action.paramValue);
      return param;
    }

    case FILTER_TIMESPAN_SET: {
      const timespan = state
        .set('fromDate', action.timeSpan.fromDate)
        .set('toDate', action.timeSpan.toDate)
        .set('absolute', fromJS(typeof action.timeSpan.absolute !== 'undefined' ? action.timeSpan.absolute : absolute))
        .set('duration', null);
      storage.setItem('timespan', JSON.stringify(timespan.toJS()));
      return timespan;
    }

    case FILTER_DURATION_SET: {
      const timespan = state
        .set('duration', action.duration)
        .set('fromDate', Date.now() - action.duration)
        .set('toDate', Date.now())
        .set('absolute', fromJS(absolute));
      storage.setItem('timespan', JSON.stringify(timespan.toJS()));
      return timespan;
    }

    case TIMESTAMP_RELOAD: {
      if (state.get('duration')) {
        const timespan = state.set('fromDate', Math.round(Date.now() - state.get('duration'))).set('toDate', Date.now());
        storage.setItem('timespan', JSON.stringify(timespan.toJS()));
        return timespan;
      } // else absolute/relative no refresh
      return state;
    }

    default:
      return state;
  }
};

export const selectFilterParamsStore = (state) => state.get('filterParams', initialState);
export const makeSelectFilterParam = (paramName) => createSelector(selectFilterParamsStore, (globalState) => globalState.getIn([paramName]));
export const makeSelectFilterAbsolute = () => createSelector(selectFilterParamsStore, (globalState) => globalState.get('absolute').toJS());
export const makeSelectFilterParams = () => createSelector(selectFilterParamsStore, (globalState) => globalState.toJS());
