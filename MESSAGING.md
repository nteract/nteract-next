The following is a rough outline how messaging could work between the Tauri Rust backend, the frontend webview, and the kernel runtime.

## Execution messaging

Within this example we're going to assume the kernel is already alive and nothing else is queued or busy.

![Messaging](https://private-user-images.githubusercontent.com/836375/292332142-d5470afc-0962-4a19-94e5-06967cc5c982.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTEiLCJleHAiOjE3MDMyMDAwNjcsIm5iZiI6MTcwMzE5OTc2NywicGF0aCI6Ii84MzYzNzUvMjkyMzMyMTQyLWQ1NDcwYWZjLTA5NjItNGExOS05NGU1LTA2OTY3Y2M1Yzk4Mi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBSVdOSllBWDRDU1ZFSDUzQSUyRjIwMjMxMjIxJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDIzMTIyMVQyMzAyNDdaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT04MjdiOWE4NDhmZWZkZTNhZWE2YzdlZjY1ZDlkZTM1YzlkNjEyZmE3ZWI5NjYwZTQwZjUwY2M4ZmEwYzU0YzE0JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.9t2XuuaMrUagjRTMQ4RlkdKccMt03wf9DxKCckIf1B8)


1. The Notebook Frontend `invoke`s `execute_cell` by ID.
2. The Tauri Core Backend receives this message, uniquely determines which notebook to work with, and dispatches to the notebook service.
3. The Notebook service creates an `execute_request` which starts running the cell. The , indicated by "Cell running," and sends a confirmation response back to the Tauri Core Backend.
4. The Tauri Core Backend sends a Tauri IPC Response back to the Notebook Frontend as a confirmation.
5. As the cell executes and produces output, the Notebook Backend sends events about the state of the notebook application include cell state (queued, busy, etc.) as well as output back to the Tauri Core Backend.
6. The Tauri Core Backend forwards these events to the Notebook Frontend.
7. Once the cell execution is finished, the Notebook Backend sends a "Cell finished" event to the Tauri Core Backend, which then sends an event to the Notebook Frontend to update the cell state.