Project Overview
----------------

**Objective**: Develop nteract v2 as a performant and stable desktop notebook application, focusing on fluid user experience and rapid prototyping.

### Key Features

*   **Fluid User Experience**: Emphasis on speed and responsiveness, particularly in creating and manipulating notebook cells.
*   **Backend-Managed State**: State management primarily handled by the Rust backend.
*   **Performance Focus**: Leverage Tauri's performance benefits to enhance application efficiency.

Lessons from nteract v1
-----------------------

*   Transition away from nteract web, content refs, myths, and bundled components.
*   Adopt a one notebook per window approach.

Strategy for nteract v2
-----------------------

*   Build an integrated application, not a modular toolkit.
*   Offload outputs to a content store for standardization and performance.
*   Emphasize a design that facilitates fluid interactions and rapid prototyping.
*   Switch to Tailwind CSS and/or shadcn/ui for UI development.

Technical Decision: Tauri vs. Electron
--------------------------------------

*   Preference for Tauri due to its performance benefits and alignment with the project's renewed focus, despite Electron's familiarity and more complete API set.

Phases of Development
---------------------

### Initial Phase: Planning and Research 

👇🏻 You are here 👇🏾

*   Define the project scope and technical requirements.
*   Research Tauri's capabilities
*   Investigate integration with Jupyter kernels.
*   Draft a detailed design document outlining the desired user experience.

#### Integration and Testing

* Continuous integration of separate backend and frontend components
* Develop end-to-end tests using a real kernel

#### Deployment and Documentation

* Ongoing preparation for frequent releases with a focus on CI/CD efficiency
* Continuous development of documentation and user guides
* Foster community involvement and establish contribution guidelines

### Phase I: Prototype

#### Backend Development (Rust)

*   Implement functions for notebook manipulation and interaction with Jupyter kernels.
*   Establish communication protocols with the frontend.
*   Create a notebook backend to keep track of the ongoing document, a running kernel, and establish handlers for document changes

#### Frontend Development

*   Design and implement the notebook viewing and editing interface using Tailwind CSS.
*   Focus on creating a immersively iterable notebook for prototyping
*   Rely on the backend to have the source of truth for the notebook state as well as kernel state, only looking to the frontend as the view layer

### Phase II: CRDT

* Integrate CRDT logic for real-time editing and synchronization with the backend.

Risk Management
---------------

*   Address challenges in adopting new technology (Tauri) and integrating it with existing systems.
*   Ensure a balance between performance focus and maintaining an intuitive and engaging user interface.