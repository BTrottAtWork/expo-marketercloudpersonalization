# 

# Editing native code

You may edit the kotlin (android), or swift (ios) native code using android studio, or xcode.  The benefits of doing so are things like autocomplete and code-time feedback from linters.

1. `cd` into the `/example` folder.
2. execute `npx expo prebuild --clean`.
3. open the native IDE (open workspace file for xcode, or the android project for android studio).
4. once the project has loaded, navigate into the android dependency, or the development pod for xcode, and you should find your native files.
5. You may edit these files directly in the editor, and the updates are realized in the package files.
6. Good to go!


