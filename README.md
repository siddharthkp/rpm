# rpm
experiment: download node_modules via a remote server with faster internet

Benchmarks:

```
time npm install camelcase  4.880s
time yarn add camelcase     2.970s
time rpm install camelcase  3.226s
```
```
time npm install micro      11.575s
time yarn add micro         3.902s
time rpm install micro      8.470s
```
