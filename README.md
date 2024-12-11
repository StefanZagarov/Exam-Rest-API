# Back-end server for the SoftUni exam project [Distortion Pit](https://github.com/StefanZagarov/exam-workshop)

## How to install
1. In the VSCode terminal write `npm i`
2. Then write `npm start`

## Note - errors
When extracting the files on Windows, it may say something about the file being invalid or too long. Skipping those files is fine. This may be caused because this API has been developed on Linux
Another problem could be that after installing the dependencies and running the program, it can give `Error: ...bcrypt_lib.node is not a valid Win32 application.`
To fix that follow those steps:
1. Delete the node_modules folder 
2. `npm install node-pre-gyp -g` 
3. `npm rebuild bcrypt --build-from-source` 
4. `npm install bcrypt` 
5. `npm i` 
6. Now it should start without errors with `npm start`
