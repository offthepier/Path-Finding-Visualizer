# 🎯 Pathfinding Algorithm Visualizer

## [Live Demo](https://comforting-parfait-86ac56.netlify.app)   (Works best on Safari)
![Screen Recording 2025-01-10 at 4 31 01 pm (1)](https://github.com/user-attachments/assets/de8f857f-34bb-4ec1-b9d0-4654a1a26630)

## 🌟 Features

### 🔍 Multiple Pathfinding Algorithms
- **Weighted A* Search** - Optimal pathfinding with weighted nodes
- **Dijkstra's Algorithm** - Guarantees shortest path
- **Breadth-First Search (BFS)** - Unweighted shortest path
- **Depth-First Search (DFS)** - Memory-efficient exploration
- **Greedy Best-First Search** - Fast but not optimal
- **Bidirectional Search** - Meets in the middle
- **Jump Point Search (JPS)** - Optimized for uniform-cost grids

![Screen Recording 2025-01-10 at 4 31 01 pm](https://github.com/user-attachments/assets/ca934bb5-de01-4af3-a020-49df50aba884)

### 🎮 Interactive Features
- Draw/erase walls by clicking and dragging
- Add weighted nodes for realistic scenarios
- Adjust visualization speed
- Generate random mazes
- Enable diagonal movement
- Compare multiple algorithms simultaneously


## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/pathfinding-visualizer.git

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📖 How to Use

1. **Select Algorithm**
   - Choose from the dropdown menu
   - Enable compare mode to run multiple algorithms

2. **Create Maze**
   - Click and drag to draw walls
   - Use weighted nodes mode for varied costs
   - Generate random mazes

3. **Customize Settings**
   - Adjust visualization speed
   - Toggle diagonal movement
   - Enable weighted nodes

4. **Visualize**
   - Click "Visualize" to start
   - Watch the algorithm in action
   - Compare performance metrics

   
## 🔧 Technical Details

### Stack
```typescript
interface TechStack {
  frontend: {
    framework: "React 18";
    language: "TypeScript";
    styling: "Tailwind CSS";
    buildTool: "Vite";
    icons: "Lucide React";
  };
}
```

### Performance
- Optimized rendering with React hooks
- Efficient pathfinding implementations
- Responsive design for all screen sizes
- Real-time visualization updates

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📈 Performance Metrics

| Algorithm | Average Time | Path Optimality | Memory Usage |
|-----------|--------------|----------------|--------------|
| A*        | O(n log n)   | Optimal        | Moderate     |
| Dijkstra  | O(n log n)   | Optimal        | High         |
| BFS       | O(n)         | Optimal        | High         |
| DFS       | O(n)         | Not Optimal    | Low          |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by pathfinding algorithms in computer science
- Built with modern web technologies
- Community feedback and contributions

<div align="center">
  <br />
  <p>
    <a href="https://comforting-parfait-86ac56.netlify.app">View Demo</a>
    ·
    <a href="https://github.com/yourusername/pathfinding-visualizer/issues">Report Bug</a>
    ·
    <a href="https://github.com/yourusername/pathfinding-visualizer/issues">Request Feature</a>
  </p>
</div>
