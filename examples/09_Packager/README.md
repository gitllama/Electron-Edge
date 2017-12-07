# Packager

electronにはパッケージャーとして

- electron-packger
- electron-builder

があります

## Packager使用後のフォルダ構成

外部から設定ファイルを読み込む場合、packgerと一緒にjsonパッケージされてしまうのは思わしくありません。しかし、パッケージされることによりフォルダ構成が変化することを考慮する必要があります

electron-buildのportable構成だと其の実7Zですので、テンポラリにファイルが展開されてカオスです。各構成で

- npm start
- 7Z
- unpacked

それぞれざっくり比較してみたところ

- app.getAppPath()
  - [project]
  - [Users]\PC\AppData\Local\Temp\[hoge].tmp\app\resources\app.asar
  - [project]\dist\win-unpacked\resources\app.asar
- process.cwd()
  - [project]
  - [Users]\PC\AppData\Local\Temp\[hoge].tmp\app
  - [project]\dist\win-unpacked
- process.argv[0]
  - [project]\node_modules\electron\dist\electron.exe
  - [Users]\PC\AppData\Local\Temp\[hoge].tmp\app\electron-edge.exe
  - [project]\dist\win-unpacked\electron-edge.exe

