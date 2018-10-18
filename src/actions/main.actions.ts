import { Action } from '@ngrx/store';
import { ThankYouModel } from '../models';

export enum Types {
  Save = '[Thank You] Save',
  LoadSuccess = '[Thank You] Load',
}

export interface SaveAction extends Action {
  type: Types.Save;
  thankYou: ThankYouModel;
}

export function createSaveAction(thankYou: ThankYouModel): SaveAction {
  return { type: Types.Save, thankYou };
}

export interface LoadSuccessAction extends Action {
  type: Types.LoadSuccess;
  thankYous: ThankYouModel[];
}

export function createLoadSuccessAction(thankYous: ThankYouModel[]): LoadSuccessAction {
  return { type: Types.LoadSuccess, thankYous };
}

export type Union = SaveAction | LoadSuccessAction;
