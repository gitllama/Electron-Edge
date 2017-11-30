# RawViewer

## Edge.jsを使用したJavaScript-C#間でのオブジェクトのやり取り

画像処理を行う場合、JavaScript-C#間でデータのやり取りを行わないといけないが  
ちょっと癖がある様子。

JavaScriptでCanvasに直接描画できるImageDataオブジェクトがあります。その周辺のオブジェクトを引数戻り値として使用しできるか試してみたところ

JavaScript -> C#

|引数|結果|note|
|:--|:--|:--|
|ImageData|×||
|Uint8ClampedArray|×|ImageData内部の画像データ部

JavaScript -> C#

|引数|結果|note|
|:--|:--|:--|
|char[]|x| |
|byte[]|Uint8Array|.|
