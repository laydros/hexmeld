# Hexmeld

A turn-based puzzle game played on a hexagonal grid. Connect 6 or more balls of the same color to clear them and score points. Keep the board from filling up for as long as you can.

## How to Play

1. Click a colored ball to select it
2. Click an empty cell to move the ball there (must be a valid path)
3. Form groups of 6+ connected same-colored balls to clear them and score
4. If you don't clear a group, 3 new balls spawn (shown in the preview)
5. Game ends when the board fills completely

Score scales with group size: 6 balls = 6 points, 7 = 8 points, 8 = 11 points, etc.

## Running

Open `index.html` in any modern web browser. The game is also available online at https://laydros.github.io/hexmeld/ and can be saved to your mobile phone homescreen as a [PWA](https://en.wikipedia.org/wiki/Progressive_web_app). However, the core design principle is that the game remains fully playable by simply opening the `index.html` file in any modern web browser—no dependencies, no internet access required.

## Development

This game was developed with AI assistance.

### Generating App Icons

To generate PNG icons for iOS/Android home screen support from the SVG icon:

```bash
# Option 1: Using rsvg-convert (recommended for best quality)
rsvg-convert -w 180 -h 180 assets/hexmeld-icon.svg -o assets/hexmeld-icon-180.png
rsvg-convert -w 192 -h 192 assets/hexmeld-icon.svg -o assets/hexmeld-icon-192.png
rsvg-convert -w 512 -h 512 assets/hexmeld-icon.svg -o assets/hexmeld-icon-512.png

# Option 2: Using Inkscape
inkscape assets/hexmeld-icon.svg -w 180 -h 180 -o assets/hexmeld-icon-180.png
inkscape assets/hexmeld-icon.svg -w 192 -h 192 -o assets/hexmeld-icon-192.png
inkscape assets/hexmeld-icon.svg -w 512 -h 512 -o assets/hexmeld-icon-512.png
```

Run these commands whenever the SVG icon is updated.

## License

Licensed under the [BSD 3-Clause License](LICENSE).
