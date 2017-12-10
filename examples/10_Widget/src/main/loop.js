onst fs = require('fs');

console.log("Hello World!");

//非同期で監視
//eventは'rename'と'change'の
var watcher = fs.watch(".", function(event, filename) {
  console.log(event + ' to ' + filename)
  watcher.close();
})


console.log("a");
/*
fs.readdir(".", (err, files)=>{
  if (err) throw err;
  console.log(files)
  let fileList = files.filter((f)=>{
    //atime	アクセス時間	指定日数内にアクセスされたファイル
    //ctime	作成時間	指定日数内に属性変更されたファイル
    //mtime	修正時間（iノード管理）	指定日数内に修正、更新されたファイル

    var dt = new Date(fs.statSync(f).mtime);
    console.log(dt.toLocaleString())
    return fs.statSync(f).isFile() && /.*\.js$/.test(f);
  })
  console.log(fileList)

  //resolve(files)
});
*/



let filenamesbuf = "";
async function countUp() {
  while (flag) {
    await ((t)=>new Promise(resolve => setTimeout(resolve, t)))(5000);
    let aaa = await ((t)=>new Promise(resolve => {
      fs.readdir(t, (err, files)=>{
        if (err) throw err;
        console.log(files)
        resolve(files)
      });
    }))("C:/Users/PC/Desktop/a");

//一覧とってさいしんタイムスタンプだけ見たほうが効率的
    if(filenamesbuf != aaa){
      filenamesbuf = aaa;
      tray.displayBalloon({
        title : "test",
        content :  `${filenamesbuf}`,
      },3000);

    }
  }
  console.log('end');
}




/*
const clipboard = require('electron').clipboard; //clipboard
    var btnCopy = document.getElementById("btnCopy");
    btnCopy.onclick = function(){
        clipboard.writeText('Copy!');
    }
//SHELL
    const shell = require('electron').shell;

    shell.openExternal('https://github.com');
    shell.moveItemToTrash('./3rd.html');
//ダイアログ
    const dialog = require('electron').dialog;

    app.on('ready', function() {
    //(ry
      console.log(dialog.showOpenDialog({ properties: [ 'openFile', 'openDirectory', 'multiSelections' ]}));
    //(ry
    });

//右クリックメニュー
const remote = require('electron').remote;
      const Menu = remote.Menu;
      const MenuItem = remote.MenuItem;

      var template = [
      { label: 'Menu-1', click: function() { console.log('item 1 clicked'); } },
      { type: 'separator' },
      { label: 'Menu-2', type: 'checkbox', checked: true},
      { label: 'Menu-3', submenu:[
         {label: 'Sub-Menu-1', accelerator: 'CmdOrCtrl+M'}]}
      ];

      var menu = Menu.buildFromTemplate(template);

      menu.append(new MenuItem({ type: 'separator' }));
      menu.append(new MenuItem({ label: 'NewMenu' }));

      window.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      menu.popup(remote.getCurrentWindow());
      }, false);

*/
