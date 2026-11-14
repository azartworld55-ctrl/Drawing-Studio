# Amber — stroke-only digital painting

The live Amber artwork route now loads `drawing-engine/amber-painting.js`, replacing the earlier shape-based illustration module.

## Non-negotiable medium rule

Every visible mark in this implementation is made by brush strokes on native raster layers. The artwork module does not call Canvas fill, ellipse, arc, round-rectangle, polygon-fill, gradient-fill, or SVG APIs. It does not load a finished character image. It does not use an image-generation service.

The background is painted with broad horizontal and atmospheric brush passes. The character is developed through a loose construction sketch, overlapping hair strokes, broad clothing masses, facial strokes, costume linework, and finishing marks. Even the distant architecture and accessories are suggested with drawn marks rather than filled geometric shapes.

## Open

https://azartworld55-ctrl.github.io/Drawing-Studio/#amber

The normal studio page also has the **Нарисовать Эмбер** button. The editable project is composed of raster layers. Use the studio's project save control for the layered `.dsp` file and PNG export for the flattened image.

## Painting passes

1. Underpainting and atmospheric sky, using broad low-opacity watercolor-like strokes.
2. Distant Mondstadt, sketched from individual architectural marks.
3. Loose gesture and proportion sketch.
4. Hair mass and directional locks.
5. Body and clothing color masses, with overlapping brush passes.
6. Skin planes and facial features.
7. Costume folds, gold trims, seams and accessories.
8. Light accents and restrained Pyro particles.

## Brush engine

The artwork uses `DrawingStudioPaintWorkflow`, which prefers the repository's local MyPaint/libmypaint WASM brush engine. If the WASM engine is unavailable, the local procedural raster brush implementation is used. Both run in the browser and do not require a paid service.

## Honest limitations

This is a manually authored, stroke-based digital painting program, not a human illustrator operating a pen display. The marks are algorithmically planned and issued as brush gestures. A browser visual review is still required to judge anatomy, likeness, composition, and final polish. Do not claim the result is visually verified until it has actually been opened and inspected.
