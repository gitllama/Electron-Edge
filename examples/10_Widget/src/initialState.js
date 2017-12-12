import Immutable from 'immutable';

export const initialState = Immutable.fromJS({
  count : 3,
  monitor : {
    interval : 10000,
    displaytime : 3000,
    enable : true,
    path : "."
  }
});

export const configState = Immutable.Map({

  shortcut :{
    global : {
    },
    main : {
    }
  },
  window :{
    width: 800,
    height: 600,
  }
});
