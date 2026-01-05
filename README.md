# reactive-image-colors

Extract semantic colors (accent, light, dark) from images to build reactive, image-driven UI themes.

# Table of Contents
- [Installation & Usage](#installation--usage)
- [Core Idea of Implementation](#core-idea-of-implementation)
- [extractColors function](#extractcolors-function)
- [Browser & Node Support](#browser--node-support)
- [Real-World Examples](#real-world-examples)
- [Why This Package?](#why-this-package)
- [License](#license)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)

## Installation & Usage

1. Install:

Using npm package:

```bash
        npm i reactive-image-colors
```

<br/>

OR cloning the project on local machine:

```bash
        git clone https://github.com/codex-leo/reactive-image-colors.git

        cd reactive-image-colors
        
        npm install
```

2. Usage:
    <br/>
   - Using in simple js/ts application:
```ts
        import { extractColors } from 'reactive-image-colors';

        const colors = await extractColors('path/to/image.jpg');
        console.log(colors);
```


  - This will log an object containing the accent, light, dark colors and palette extracted from the image.

  - The output will look like this:
```ts
        {
          accent: '#ff5733',
          light: '#f0e68c',
          dark: '#2f4f4f',
          palette: ['#ff5733', '#33ff57', '#3357ff', '#f0e68c', '#2f4f4f', '#8b4513'] //6 most prominent colors
        }
```

3. React Hook Usage:
    - You can also use the provided React hook to extract colors in a React component.

   - Hook `useImageColors`: 
    This hook accepts two parameters: image source (URL or HTMLImageElement) and options.
    (Refer [extractColors function](#extractcolors-function) section for available options)

    <br/>
    
```tsx
        import React from 'react';
        import { useImageColors } from 'reactive-image-colors/react';

        const MyComponent = () => {
          const { colors, loading} = useImageColors(song.cover, {
          mode: "music"
        });
          if (loading) return <div>Loading...</div>;
          if (error) return <div>Error: {error}</div>;

          return (
            <div>
              <p>Accent: {colors?.accent}</p>
              <p>Light: {colors?.light}</p>
              <p>Dark: {colors?.dark}</p>
              <p>Palette: {colors?.palette.join(', ')}</p>
            </div>
          );
        };

        export default MyComponent;
 ```
   - This hook returns an object containing:
```ts
    {
        colors: {
            accent: string
            light: string
            dark: string
            palette: string[]
        } | null
        loading: boolean
        error: Error | null
    }
 ```
   - and also have loading state to indicate if the colors are still being extracted.


## Core Idea of Implementation

This section shows how the core of package works and how it uses images to extract colors.

The main core is divided into three simple steps:

1. **Load Image Onto Canvas**: 
- Location: `src/browser/loadImage.ts` 
- Description: This function takes an image URL/HTMLImageElement and draws it onto an off-screen canvas. This allows us to access the pixel data of the image. 


2. **Sample Pixels**:
- Location: `src/core/samplePixels.ts`
- Description: This function downcales the image data to about (64x64) pixels to reduce the number of pixels to process, making color extraction more efficient.
- Skip Bad Colors: Skips pixels that are too transparent or too close to white/black.
- Optimizes: This optimization significantly speeds up the color extraction process without sacrificing much accuracy.

3. **Pick Semantic Colors**:
- Location: `src/core/pickSemanticColors.ts`
- Description: This function takes sampled pixels and analyzes their color distribution to pick out three semantic colors: accent, light, and dark and also palette.
- This function is interesting because this uses a simple yet effective math algorithm to determine the best representative colors from the sampled pixels.Avoids heavyweight clustering algorithms, keeping the library fast and lightweight.

- Algorithms: 
   - First, it converts RGB colors to HSL to better analyze color properties like lightness and saturation.
   <br/>

  ```ts
        const colors = pixels.map(rgb => {
         const hsl = rgbToHsl(rgb);
         return { rgb, hsl };
        });
  ```
   - Then, it pick accent candidates based on saturation and lightness thresholds.
   <br/>

  ```ts
         const accentCandidates = colors.filter(c =>
             c.hsl.s > 0.35 &&
             c.hsl.l > 0.25 &&
             c.hsl.l < 0.75 &&
             !isSkinTone(c.hsl.h, c.hsl.s, c.hsl.l) // Exclude skin tones
         );
   ```
   - Then, it sorts accent candidates by saturation and lightness to find the most vibrant color.
   <br/>

  ```ts
         const accent = accentCandidates
          .sort((a, b) => accentScore(b.hsl) - accentScore(a.hsl))[0];
         // accentScore is a function that gives higher scores to more saturated and mid-lightness colors, which helps in avoiding muddy colors.
  ```
    - Finally, it picks light,dark colors based on lightness thresholds.And also creates a palette of colors.
    <br/>

  ```ts
         const light = colors
         .filter(c => c.hsl.l > 0.85)
         .sort((a, b) => b.hsl.l - a.hsl.l)[0];

        const dark = colors
         .filter(c => c.hsl.l < 0.2)
         .sort((a, b) => a.hsl.l - b.hsl.l)[0];

        const palette = colors
         .sort((a, b) => b.hsl.s - a.hsl.s)
         .slice(0, 6)
         .map(c => rgbToHex(c.rgb));
  ```
    - It returns the extracted colors in hex format.

The above all three steps are combined in the main function `extractColors.ts` which wires everything together.

By following these steps, the package efficiently extracts meaningful colors from images that can be used for theming and UI design.

## extractColors function
`extractColors` is framework-agnostic and can be used in any browser-based JavaScript or TypeScript project.


The main function `extractColors` is the core of this package.

 It uses two parameters:
1. `imageSrc`: This can be either a string URL of the image or an HTMLImageElement. This is the source image from which colors will be extracted.
2. `options` (optional): An object that allows you to customize the color extraction process.
    The options object can have the following properties:
    - `mode`: A string that specifies the mode of color extraction. It can be either `"default"`(which is the default) or `"music"`. The `"music"` mode is optimized for album covers and similar images.
    (More Options are coming soon...)

## Browser & Node Support

This library is **browser-first** and relies on the HTML Canvas API to extract pixel data from images.

-  Browser environments (Vite, Next.js, CRA, Vanilla JS)
-  Node.js (without DOM / canvas polyfills) is **not supported** out of the box.

If you need server-side image processing, consider using Node-based image libraries instead.


## Real-World Examples
1. **Dynamic Theming**: Automatically adjust your app's theme colors based on user-uploaded images or profile pictures.
2. **Music Players**: Extract colors from album covers to create visually appealing music player interfaces.
3. **Photo Galleries**: Use extracted colors to create cohesive layouts and backgrounds that complement the displayed images.

and many more... where you want to create a reactive UI based on images.

## Why This Package?
1. **Simplicity**: Easy to use with minimal setup.
2. **Performance**: Optimized for speed with pixel sampling and efficient algorithms.
3. **Flexibility**: Works with both image URLs and HTMLImageElements.
4. **React Integration**: Comes with a handy React hook for seamless integration into React applications.
5. **Lightweight**: No runtime dependencies (except  the optional React peer dependency)
## License
This project is licensed under the MIT License.
Feel free to use and modify it as per the license terms.

## Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.
Please make sure to follow the existing code style and include tests for any new features or bug fixes.

## Acknowledgements

Thanks to the open-source community for inspiration and resources that helped in building this package.

