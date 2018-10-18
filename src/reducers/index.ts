import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
} from '@ngrx/store';
import { environment } from '../environments/environment';

import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ThankYouModel } from '../models';
import { MainActions } from '../actions';

export interface State extends EntityState<ThankYouModel> {
  // additional entities state properties
}

export function sortBySubmitter(a: ThankYouModel, b: ThankYouModel): number {
  return a.submitter.localeCompare(b.submitter);
}

export const adapter: EntityAdapter<ThankYouModel> = createEntityAdapter<ThankYouModel>({
  sortComparer: sortBySubmitter,
});

export const initialState = adapter.getInitialState();

export function reducer(state: State = initialState, action: MainActions.Union): State {
  switch (action.type) {
    case MainActions.Types.LoadSuccess: {
      return adapter.addAll(action.thankYous, state);
    }

    case MainActions.Types.Save: {
      return adapter.addOne(action.thankYou, state);
    }

    default: {
      return state;
    }
  }
}

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

// get the selectors
const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
