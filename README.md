# nteract next

_Iterating on the next version of nteract_

## Background

nteract next is a desktop application for notebooks built on:

* Rust
* Tauri
* Tokio


```
+-------------------+     +-------------------+
| Tauri Main Process|     | Kernel Sidecar    |
+-------------------+     +-------------------+
         |                       ^
         | IPC and Events        |
         v                       v
+-------------------+     +-------------------+
| State Update      |     | Jupyter Message   |
| Handler           |     | Handlers          |
+-------------------+     +-------------------+
         |                       ^
         | Events                |
         v                       v
+-------------------+     +-------------------+
| Event Bus         |<--->| Notebook Document |
+-------------------+     | Service           |
         |                       |
         | Events                |
         v                       v
+-------------------+     +-------------------+
| Web View of       |     | In-Memory State   |
| Document          |     | of Document       |
+-------------------+     +-------------------+
```

## Development

Clone the repo, cd into `nteract-next`

Install pre-reqs:

- [pnpm](https://pnpm.io/installation)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri system deps](https://tauri.app/v1/guides/getting-started/prerequisites/)
  - (Not listed on Tauri site but may also need `libsoup2.4-dev`)

Install dependencies:

```
pnpm install
```

Run the dev version

```
pnpm tauri dev
```


## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
