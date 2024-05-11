# TODOs

- General Hijinks
  - [ ] Benchmark the memory/time cost of maintaining local copies of property values when chaining many mutators, versus always doing a path lookup on the parent object.
  - [ ] Consider making `contains()` and `excludes()` synonyms for `like()` and `notLike()` when working with strings.
  - [ ] Would probably be nice to make all the functions curryable.
- Tests
  - [ ] Benchmark the time/memory cost of Propmaster vs hard-coded transforms.
  - [ ] Some kind of plugin/extension mechanism for the comparison and mutation functions. Certain expensive operations (cheerio parsing, cough cough) are a PITA to bundle.
