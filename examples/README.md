# Electron-Edge

Electronが流行りになりそうなならなさそうな感じなので、ディスクトップアプリを作ってみます

C#erなのでLogicはC#で作成してDLLを呼んでみますが、フレームワークとして特にメリットはないです。おとなしくformやwpfで書いた方がいいと思います。  
DLLの呼び出しにはNode.jsと.NETの接続を目的としたライブラリEdge.jsを使用します。

詳細は各projectのREADME.md

## 準備

1. Node.jpをいれます（Nodistでverを変えれるようにしておきましょう）
2. ``` cd [プロジェクトフォルダ] ```
3. ``` npm init ```
4. ``` npm install -D electron@1.7.9 ```
5. ``` npm install -D electron-edge-js@8.2.9 ```

ElectronやEdge.jsは環境インストール済みのNode.jsとは関係なく、verによってそれぞれ特定のNode.jsで駆動しています。同時に使用するためにはElectronとEdge.jsで使用されているNode.jsのverを合わせる必要があります。

そこで、Electron用のEdge.jsとしてelectron-edgeがありますが、各Electronのverにあわせてbuildされたelectron-edge-jsがあったのでそちらを使用しています。

-D(--save-dev)オプションは--saveでも。適宜。

## 01_ElectronEdge

ElectronとEdgeの基礎

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

## 07_RawViewer

Edge.jsを使用したバイナリのやり取り。

## 参考

[Electronの手習い〜Electron環境からパッケージ化まで〜](https://qiita.com/tagosaku324/items/c720499080d523bbe1d7)  
[【2017年1月版】今からでも遅くない！Electron入門](https://qiita.com/umamichi/items/6ce4f46c1458e89c4cfc)

[Github kexplo/electron-edge](https://github.com/kexplo/electron-edge)  
[[C#] Edge.js を触ってみた](https://qiita.com/t-koyama/items/c6070c89bb5bd6f15fa7)

********
2017-11-28
