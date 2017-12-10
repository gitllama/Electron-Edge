# Widget

- mainとrenderer間のstateの同期
- trayの実装

## Action, stateの管理

Notificationのみおくるか、

両方に状態を持つか

```
(r) -> Action(r) ┬-----------------┬> Reducer(r) -> state(r)
                 ├> Saga -> Action ┘
                 └-ipc--------------> Reducer(m) -> state(m)

(m) -> Action(m) ┬------------------> Reducer(m) -> state(m)
                 └-ipc--------------> Reducer(r) -> state(r)
```
