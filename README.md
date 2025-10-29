# 3D Floating Shapes - Interactive Three.js Experience

An immersive 3D interactive experience featuring floating geometric shapes with dynamic camera controls and mouse-following behavior. Built with Next.js, Three.js, and React Three Fiber.

## ✨ Features

### 🎮 Dynamic Camera System
- **Mouse-Following Camera**: Camera smoothly follows your mouse movement for natural exploration
- **Click to Focus**: Click any floating object to smoothly zoom in and focus on it
- **Return to Overview**: Click empty space to return to the center overview
- **Manual Control**: Click and drag to manually rotate the camera around the scene
- **Context-Aware Zoom**: Mouse wheel/trackpad zooming with adaptive speeds based on focus state

### 🎨 Interactive 3D Objects
- **11 Unique Floating Shapes**: Various geometric forms (spheres, cylinders, cubes) with individual animations
- **Dynamic Positioning**: Objects spread across a large 3D space for better exploration
- **Perspective Scaling**: Natural depth perception through distance-based scaling
- **Smooth Animations**: Each object has unique floating patterns, rotation speeds, and movement ranges
- **Active Shape Cycling**: Objects cycle through active states with enhanced animations

### 🎯 Enhanced User Experience
- **Responsive Design**: Optimized for different screen sizes and input methods
- **Smooth Transitions**: All camera movements and object interactions use smooth easing
- **Visual Feedback**: Hover effects and visual cues for interactive elements
- **Performance Optimized**: Efficient rendering with Three.js and React Three Fiber

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/3d-floating-shapes.git
   cd 3d-floating-shapes
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the interactive 3D scene.

## 🎮 How to Interact

### Camera Controls
- **Mouse Movement**: Move your mouse around the screen - the camera will gently follow your cursor
- **Click & Drag**: Click and drag anywhere to manually rotate the camera
- **Mouse Wheel/Trackpad**: Zoom in and out with context-aware speeds
- **Object Focus**: Click any floating shape to focus the camera on it with optimal viewing distance
- **Return to Center**: Click on empty space to return to the overview

### Navigation Tips
- Let your mouse guide the camera for natural exploration
- Click objects to get a closer, detailed view
- Use the mouse wheel for precise zoom control
- The camera automatically adjusts zoom speed based on whether you're focused on an object or exploring the overview

## 🛠️ Built With

- **[Next.js](https://nextjs.org/)** - React framework for production
- **[Three.js](https://threejs.org/)** - 3D graphics library
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)** - React renderer for Three.js
- **[React Three Drei](https://docs.pmnd.rs/drei)** - Useful helpers for React Three Fiber
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library for smooth interactions
- **[Framer Motion 3D](https://www.framer.com/motion/three-introduction/)** - 3D animations with Framer Motion

## 📁 Project Structure

```
src/
├── app/
│   ├── page.js              # Main page component
│   ├── layout.js            # App layout
│   └── globals.css          # Global styles
└── components/
    └── floatingShape/
        ├── Index.jsx        # Main 3D scene with camera controller
        ├── Model.js         # 3D objects and interaction logic
        └── style.module.scss # Component styles
```

## 🎨 Customization

### Adding New Shapes
1. Add new geometry nodes to the GLTF model
2. Update the `positions` array in `Model.js` with new coordinates
3. Add corresponding `objectSettings` for animation parameters
4. Include new `<Mesh>` components in the render method

### Adjusting Camera Behavior
- Modify mouse sensitivity in `CameraController` component
- Adjust zoom limits and speeds in the `handleWheel` function
- Change transition speeds in the `useFrame` animation loop

### Styling
- Update the canvas background in `Index.jsx`
- Modify lighting and environment in the `<Environment>` component
- Adjust object materials and colors in the GLTF model

## 🚀 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy with one click

### Deploy to Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder to [Netlify](https://netlify.com)

### Other Platforms
The project can be deployed to any platform that supports Next.js static exports.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Three.js community for the amazing 3D library
- React Three Fiber team for the excellent React integration
- Framer Motion for smooth animation capabilities
- Next.js team for the robust React framework

## 📧 Contact

If you have any questions or suggestions, feel free to reach out or open an issue on GitHub.

---

**Enjoy exploring the 3D space! 🚀✨**