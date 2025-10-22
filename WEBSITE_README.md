# Website Structure

This repository now includes a complete website with multiple pages:

## Pages

### 1. Landing Page (`/` or `/index.html`)
- **File**: `src/playground/landing.jsx`
- **Component**: `src/playground/render-landing.jsx`
- **Description**: The main homepage featuring:
  - Hero section with call-to-action buttons
  - Feature highlights
  - Navigation to editor and sample projects

### 2. Sample Projects Page (`/sample-projects.html`)
- **File**: `src/playground/sample-projects.jsx`
- **Component**: `src/playground/render-sample-projects.jsx`
- **Description**: Showcases example projects with:
  - Category filtering (Games, Animations, Music, Art, Stories)
  - Project cards with descriptions and difficulty levels
  - Direct links to open projects in the editor

### 3. Editor Page (`/editor.html`)
- **File**: `src/playground/editor.jsx`
- **Description**: The main Scratch-compatible editor interface

### 4. Other Pages
- **Player**: `/player.html` - For playing Scratch projects
- **Fullscreen**: `/fullscreen.html` - Fullscreen project view
- **Embed**: `/embed.html` - Embedded project view
- **Addons**: `/addons.html` - Addon settings
- **Credits**: `/credits.html` - Credits page

## Development

### Running the Development Server
```bash
npm start
```
The server will start on `http://localhost:8601`

### Building for Production
```bash
npm run build
```

### Project Structure
- **Entry Points**: `src/playground/` - Contains all page entry points
- **Components**: `src/playground/render-*.jsx` - Page-specific React components
- **Styles**: `src/playground/interface.css` - Contains styles for all pages
- **Configuration**: `webpack.config.js` - Webpack configuration with all entry points

## Navigation Flow

1. **Landing Page** → User arrives and sees overview
2. **Sample Projects** → User explores example projects
3. **Editor** → User creates or edits projects
4. **Player** → User views completed projects

## Features

### Landing Page Features
- Responsive design with mobile support
- Gradient backgrounds and modern styling
- Call-to-action buttons
- Feature showcase grid
- Professional footer

### Sample Projects Features
- Category-based filtering
- Project difficulty indicators
- Thumbnail previews (using emojis)
- Direct project loading
- Responsive grid layout

## Customization

### Adding New Sample Projects
Edit `src/playground/render-sample-projects.jsx` and add to the `sampleProjects` array:

```javascript
{
    id: 7,
    title: "New Project",
    description: "Description of the project",
    category: "game", // or "animation", "music", "art", "story"
    difficulty: "Beginner", // or "Intermediate", "Advanced"
    thumbnail: "🎮", // emoji for thumbnail
    projectUrl: "./editor.html?project=new-project"
}
```

### Styling
All styles are in `src/playground/interface.css`. The design uses:
- CSS Grid and Flexbox for layouts
- CSS custom properties (variables) from `src/css/colors.css`
- Responsive design with mobile breakpoints
- Modern gradients and shadows
- Smooth transitions and hover effects

### Adding New Pages
1. Create entry point in `src/playground/your-page.jsx`
2. Create component in `src/playground/render-your-page.jsx`
3. Add entry to `webpack.config.js` in the `entry` object
4. Add HtmlWebpackPlugin configuration
5. Add routing rules if needed
6. Add styles to `interface.css`