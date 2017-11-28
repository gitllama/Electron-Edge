# Electron-Edge

Electronが流行りになりそうなならなさそうな感じなので、ディスクトップアプリを作ってみます

C#erなのでLogicはC#で作成してDLLを呼んでみますが、フレームワークとして特にメリットはないです。おとなしくformやwpfで書いた方がいいと思います。  
DLLの呼び出しにはNode.jsと.NETの接続を目的としたライブラリEdge.jsを使用します。

## 01_ElectronEdge
## 02_ElectronReact
## 03_ElectronReactRedux
## 04_ElectronReactReduxImmutable

Electron-React-Redux-Immutable四点セットでのテンプレート  
containersは使ってません。

reducersはswitch使いたくないのでちょっと癖のある書き方してます。

## 05_MarkDownEditor

containers使用してますが冗長ですね...

## 06_EdgeEditor

Edge.jsのスクリプトを実行します。

Redux-Sagaでの非同期、ipcとの共存etc...
