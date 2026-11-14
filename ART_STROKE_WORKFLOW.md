# Stroke-first digital painting workflow

The drawing workflow must be based on brush gestures, not on assembling a character from SVG paths, Canvas bezier silhouettes, or geometric primitives.

## Core implementation

`drawing-engine/paint-workflow.js` exposes `DrawingStudioPaintWorkflow.create(layerContext, options)`. It returns:

- `stroke(points, options)` — smoothed, pressure-varied freehand brush stroke
- `wash(points, options)` — overlapping translucent raster passes for underpainting and soft color masses
- `hatch(points, options)` — grouped directional strokes for form shadows and texture
- `dry(points, options)` — fine pencil-like marks for hair strands, fabric seams and accents
- `engine` — identifies whether MyPaint/libmypaint or the local procedural raster fallback is active

The preferred brush backend is the bundled free MyPaint/libmypaint WebAssembly engine. If WASM cannot load, the same gestures are rendered by the local dependency-free raster brush engine. No remote image-generation API is used.

## Required workflow for character art

1. Thumbnail composition with loose gesture strokes; do not begin with a clean silhouette.
2. Gesture and anatomy: head tilt, shoulder line, ribcage, pelvis, limb rhythm, hand gesture. Keep a sketch layer.
3. Block in large color masses with broad translucent washes. Let brush edges remain visible.
4. Establish light and shadow as separate broad stroke passes. Check the image in grayscale.
5. Paint facial planes, eyes, nose and mouth with controlled smaller strokes; avoid emoji-like isolated shapes.
6. Paint hair as overlapping directional locks made from many tapered strokes. Vary hue, width, opacity and pressure.
7. Paint clothing with folds following tension points, seams, trim and material-specific highlights.
8. Add secondary objects and environment only after the character reads clearly.
9. Use dry-brush texture, selective line accents and edge variation; preserve lost-and-found edges.
10. Review silhouette, anatomy, value grouping, focal hierarchy and thumbnail readability before export.

## Quality rules

- Do not call a programmatic shape collage a finished digital painting.
- Do not use SVG as the final artwork medium.
- Do not hide an imported flattened picture under a claim of native painting.
- Prefer many intentional brush gestures and layered paint passes over a small number of filled bezier shapes.
- A human visual review is still required; syntax checks do not establish visual quality.
- Preserve the editable layer stack and disclose the active brush backend.

## License and cost

The workflow uses the repository's already vendored MyPaint/libmypaint WASM and its own local procedural raster fallback. Both run client-side and require no paid subscription or external generation service. Preserve upstream license notices in `vendor/mypaint/`.
