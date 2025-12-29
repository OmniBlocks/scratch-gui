This is a temporary documentation file so I can yap about my process in making the code editor without making a super ultra formal docs file fromt he beggingniing..


I want the editor to work  with 3 different file systems:
- The built in project file system. This is the file system where literally everything is stored in memory (or a project file) called .omb. This means all the files are stored in that .omb file and can be opened directly.
- The local system. This is like a traditional IDE/Code editor, like VS Code. Nothing special.
- The file system API if not installed as an app yet. VS Code already does this too with the website vscode.dev


Updates...

I have successfully changed the entire blocks editor into a new directory with entirely different names. Now it's time to start dismantling it into monaco-react.

Well, it turns out webpack is freaking out at an .mjs file, since this codebase is ancient and uses React 16 and Webpack 4. 
Welp, all I can do is downgrade @monaco-editor/react from ^4.7.0 to a lower version that doesn't use .mjs yet.

Yes! It finally works! I can type in it perfectly!! YESS!!
But it looks jarring in light mode, but perfect in dark mode.

Trying to make it dynamic to the scratch-gui theme sent me down a rabbit hole of pain.

I spent an hour trying to lazily vibe code the dynamic theme switching with AI, which only let do a crap ton of hallucinations and me crashing out a few times, further proving my point that AI absolutely sucks for coding (but it's great for reviewing 😉 especially if it's a rabbit ifykyk)

I then took a 2 hour nap, woke up, and copied the logic from gui.jsx, and it was actually quite simple. The AI kept making up nonexisted prop names, calling `Theme` as a class, and even using a random `isDark()` function that, well, didn't work. It tried a bunch of `ComponentDidUpdate` shenanigans as well, and well yeah it was just trash all the way. After my nap, where my headache was gone, I looked at gui.jsx for two seconds before finding that you simply imported  `{Theme}` from `'src/lib/themes'`, and then in the Editor component for `@monaco-editor/react`, you simply pass the theme as a prop using a ternary operator, which logic i copied from `paint-editor.wrapper.jsx`, giving me this:
```javascript
theme={this.props.theme.isDark() ? 'dark' : 'light'},
```

I was overjoyed that this instantly worked exactly how I want it. Now I just need to scrap the entire scratch vm and replace it with something more IDE-y, but I guess that can wait. This is a great milestone, I will commit now. I'll work on the file explorer, like the one that shows up in the left to VS Code with the folders and whatnot.


Honestly, I feel much better now that I took that nap. The reason I used AI in the first place was because I had a strong headache, and thinking hurt more, so I couldn't look and read the code properly or try to understand it. 

