
## renderプロセスの呼び出し時引数

### 1. module.exportの使用

index.htmlを複数用意する必要有。  
webpackの場合、module参照を有効にする必要があります。  
( libraryTarget: 'commonjs2' etc... )

[main.js]
```javascript
let window = new electron.BrowserWindow({
});
window.loadURL(url.format({
  pathname:path.join(__dirname, "index_A.html"),
  protocol: 'file:',
  slashes: true
}));
```

[index_A.html]
```html
<body>
  <div id="root">root</div>
  <script>
    require('babel-register');
    require('./index.jsx')("A");
  </script>
</body>
```

[index.jsx]
```
module.exports =(arg)=>{
  if(arg == "A"){ }
}
```

### 2. Electronから呼び出し

シンプル

[main.js]
```javascript
let window = new electron.BrowserWindow({
  webPreferences : {
    additionalArguments : ["main","a","b"]
  }
});
window.loadURL(url.format({
  pathname:path.join(__dirname, "index.html"),
  protocol: 'file:',
  slashes: true
}));
```

[index.html]
```html
<body>
  <div id="root">root</div>
  <script>
    require('babel-register');
    require('./index.jsx');
  </script>
</body>
```

[index.jsx]
```
if(process.argv[process.argv.length - 1] == "main"){

}
```
