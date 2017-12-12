# Widget

- mainとrenderer間のstateの同期
- trayの実装

## Action, stateの管理

Widgetの場合rendererプロセスが適宜破棄されるため、非同期待ちループはmainプロセスにいる必要がある。

Notificationのみおくるか、両方に状態を持つか。そこで、こんな構造にしてみた。  

```
            ┌<-------------- ipc --------------┐
(r) -> Action(r) -> Reducer(r) -> state(r)     │
                      └> ipc ┬> Action(m) -> Reducer(m) -> state(m)
(m) -------------------------┘       └<- Saga <┘
```

- rendererで派生したActionは必ずmainに送られる
- metaでフラグが立っているもののみstateの更新をする
- mianからipc通じて送られるものにはmetaでフラグを立てる
- sagaはスルーして通常のreducerに存在するもののみipcで送る
- BrowserWindow.getAllWindows()で全windowに送信

- Actionは共通


ややこしいですね。
