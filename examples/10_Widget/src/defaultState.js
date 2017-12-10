import Immutable from 'immutable';
//const ipcRenderer = require("electron").ipcRenderer;
//ipcRenderer.sendSync('getStore')
//ipcRenderer.sendSync('getStore')
export const initialState = Immutable.Map({
  val : "start",
  config : null
});

export const configState = Immutable.Map({
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
