
# Pac-Man

## Objective
Pac-Man is a classic arcade game where the player navigates Pac-Man through a maze, eating pellets and avoiding ghosts. This project is a web-based implementation of the game using JavaScript, HTML, and CSS.

## Tools
- **JavaScript**: For game logic and interactivity.
- **HTML**: For structuring the game interface.
- **CSS**: For styling the game.
- **Node.js**: 
  - Managing dependencies with `npm`.
  - Running a local development server using `http-server`.
  - Using GitHub Actions for Continuous Integration (CI) to deploy the application to GitHub Pages.

## Project Structure
   ```sql
Pac-Man/
├── .github/
│ └── workflows/
│ └── ci.yml
├── src/
│ ├── assets/
│ ├── classes/
│ │ ├── boundary.js
│ │ ├── ghost.js
│ │ └── powerPellet.js
│ ├── collisions/
│ │ └── collisions.js
│ ├── keyboard/
│ │ └── inputHandlers.js
│ ├── maze/
│ │ └── mapOrigin.js
│ ├── index.html
│ ├── index.js
│ └── styles.css
├── .gitignore
├── package.json
└── README.md
  ```
## Scripts
- `npm start`: Start the development server.
- `npm install`: Install dependencies.

## GitHub Pages
You can play the game at: [https://gadiim.github.io/Pac-Man/](https://gadiim.github.io/Pac-Man/)

## License
This project is licensed under the [MIT LICENSE](./LICENSE.txt).
MIT License
```plaintext
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
