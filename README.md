# nteract next

_Iterating on the next version of nteract_

## Background

We're coming back to our roots by creating a stable desktop app of the notebook. We're going to start letting go of some of the modular toolkit that expanded while we were learning (and frankly, adapting amidst the pandemic). It's time to come back to first principles for the notebook experience.

nteract was founded on a principle that everyone should be able to `play`, `create`, and `share` with notebooks.

Know rust? Know TypeScript? Want to learn? **Come join us!**

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

## Architecture

```
+-------------------+     +-------------------+
| Tauri Main Process|     | Kernel            |
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


## Design Principles

### Acknowledge the Three Modalities

👀 ✍️ 📣

There are three main ways people experience notebooks, either as a viewer, an author, or as a publisher.

### Iterate Quickly

💡 🔜 📘 

Starting a new notebook or loading an existing one should be a single click or command.

Once in the notebook, you need to be able to write prose, code, and get results quickly. Navigating between cells and iterating on ideas (and code errors!) should feel fluid and easy.

### Simplify Design & Development

🎨 👥️ 🏗

We're building an integrated application (again). No more content refs, myths, or disparate component packages. One stable app. We'll approach this in a few ways:

* One notebook, one kernel per window
* Rely on Tailwind CSS and shadcn/ui for UI components
* Build on Tauri for performance and to join the growing Rust community

This culminates in the next item, which deserves it's own section: backend managed state.

### Manage document on the backend

📝 🖥️

The frontend needs to become a simpler view of the notebook application state rather than managing kernel lifecycles and document state. We'll have the state managed by the Rust backend. This will include both the kernel lifecycles and document operations.

### Rapid Releases

🚀 🕒

Aim to ship fast and early.




