import { call, put, take, select, fork, takeEvery, takeLatest } from 'redux-saga/effects'
import actions from '../actions';

import fs from 'fs';
import * as markedex from '../logic/marked-ex.js';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export function* init(action) {
  yield put(actions.reducerChange(
    (state)=> state.withMutations(m =>
      m.set('busy', false)
      .set('config', action.payload)
    )
  ));
}

export function* fileRead(action) {
  yield put(actions.reducerChange(
    (state)=> state.withMutations(m => m.set('busy', true))
  ));

  let hoge = fs.readFileSync(action.payload).toString()

  yield put(actions.reducerChange(
    (state)=> state.withMutations(m =>
      m.set('busy', false)
      .set('text', hoge)
    )
  ));
}

export function* markdownAsync(action) {
  yield put(actions.reducerChange(
    (state)=> state.withMutations(m => m.set('busy', true))
  ));

  let contents = fs.readFileSync(action.payload)
  let dst = markedex.markdownCreate(contents.toString());

  yield put(actions.reducerChange(
    (state)=> state.withMutations(m => m.set('html', dst).set('busy', false))
  ));
}
