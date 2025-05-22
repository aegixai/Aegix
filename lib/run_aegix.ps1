Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd C:\Users\User\my_project; python main.py' 
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd C:\Users\User\my_project\frontend; npm run dev'
