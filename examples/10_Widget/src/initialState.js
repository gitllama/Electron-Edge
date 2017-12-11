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

const configState = Immutable.Map({
  monitor : {
    interval : 10000,
    enable : true
  },
  shortcut :{
    global : {
      "ctrl+u" : "COMMAND_MESSAGE"
    },
    main : {
    }
  },
  window :{
    width: 800,
    height: 600,
    //frame: false,
    //transparent: true
    //kiosk : true //全画面で専用端末画面みたいにできる
    //icon : path.join(__dirname, '../main.png') //Native-Image = pngで指定
  }
});

const state = Immutable.Map({
  count : 3,
  monitor : {
    interval : 10000,
    enable : true
  },
  params : Immutable.Map( {
    count : 3
  })
});
