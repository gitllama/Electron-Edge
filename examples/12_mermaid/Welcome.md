# WELCOME

- [ ] A
- [x] B
- [ ] C

```mermai
 OTT
```

```mermaid
gantt
  dateFormat YYYY-MM-DD
  title Adding GANTT diagram functionality to mermaid
  section Lot001
    A : 001_1, 2014-01-06, 2014-01-08
    B    : 001_2, 2014-01-10, 2014-01-12
    C   : 001_3, 2014-01-13, 2014-01-15
  section Lot001-01
    C   : 001_4, 2014-01-14, 2014-01-16
  section Lot001-02
    C   :               001_5, 2014-01-15, 2014-01-17
  section ★Lot002
      A : crit, 002_1, 2014-01-06, 2014-01-08
      B    : crit, 002_2, 2014-01-10, 2014-01-12
      C   : crit, 002_3, 2014-01-13, 2014-01-15
  section ★Lot002-01
      C   : crit, 002_4, 2014-01-14, 2014-01-16
  section Lot003
  section Lot003-00
      TPSCo : 003_1, 2014-01-06, 2014-01-08
      B    : 003_2, 2014-01-10, 2014-01-12
      C   : 003_3, 2014-01-13, 2014-01-15
  section Lot003-01
      C   : 003_4, 2014-01-14, 2014-01-16
  section Lot003-02
      C   : 003_5, 2014-01-15, 2014-01-17
```