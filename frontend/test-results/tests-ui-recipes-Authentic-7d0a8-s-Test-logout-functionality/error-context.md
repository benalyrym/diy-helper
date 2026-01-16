# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - heading "Login" [level=1] [ref=e4]
    - textbox "Email" [ref=e5]
    - textbox "Password" [ref=e6]
    - button "Login" [active] [ref=e7] [cursor=pointer]
  - generic:
    - img
  - generic:
    - generic:
      - generic:
        - button "Go to parent" [disabled]
        - button "Open in editor"
        - button "Close"
  - generic [ref=e8]:
    - button "Toggle Nuxt DevTools" [ref=e9] [cursor=pointer]:
      - img [ref=e10]
    - generic "Page load time" [ref=e13]:
      - generic [ref=e14]: "17"
      - generic [ref=e15]: ms
    - button "Toggle Component Inspector" [ref=e17] [cursor=pointer]:
      - img [ref=e18]
```