# Amber — Drawing Studio 4.0 artwork notes

This is an original raster fan-art scene rendered by `drawing-engine/amber-art.js` into native Canvas layers. It is not an SVG and it does not load an external finished image. The code draws the scene directly into the Drawing Studio painting engine.

## Open the artwork

Open the studio with the `#amber` fragment:

https://azartworld55-ctrl.github.io/Drawing-Studio/#amber

The scene renders automatically. The **🎨 Нарисовать Эмбер** button can also be used on the normal studio page. After it appears, use **Проект .dsp** to save an editable layered project and **Экспорт PNG** to save a flattened image locally.

## Art direction

- Character: Amber, the energetic Outrider of the Knights of Favonius from Mondstadt.
- Composition: three-quarter upper-body portrait, friendly raised-hand greeting, small Baron Bunny plush as a secondary focal point.
- Mood: warm, bright, adventurous.
- Render: clean anime-inspired shapes with painterly gradients, edge variation, layered shadows, highlights, small textured brush accents and atmospheric depth.
- Palette: warm red/coral, chestnut brown, cream, amber gold, peach skin tones, and cool blue dusk in the background.
- Lighting: warm key light from upper-left, with softer cool environmental fill.
- Environment: Mondstadt-inspired skyline, distant wind-glider silhouettes, wind ribbons and restrained ember particles.

The character is drawn without a bow or combat action; the scene focuses on her friendly personality, Outrider outfit language and bunny motif.

## Drawing Studio 4.0 features used

1. **Raster layers:** background, atmosphere, character block-in, hair/headpiece/face, Baron Bunny, costume details, finishing effects, brush accents.
2. **Reference Workspace:** an original mini design sheet is generated in memory and displayed in the floating reference panel. It is not merged into the artwork.
3. **Perspective Assistant:** grid and two-point perspective guides are enabled while establishing the environment, then hidden before final presentation.
4. **Pose & Anatomy Lab:** the built-in dynamic-step pose guide is created as a separate hidden layer. It documents the construction pass but does not contaminate the final composition.
5. **Color & Lighting Lab:** analogous harmony is selected from the character's red accent, and the lighting study is set to upper-left.
6. **Grayscale preview:** toggled for a tonal pass, then returned to color.
7. **Art Review:** the technical coverage/value report is run. Manual checklist items remain unchecked because those need an actual human review.
8. **MyPaint Brush Engine:** expressive accents use the local MyPaint WASM adapter if it loads; the studio's local procedural raster brush is used as a fallback. The status line identifies which path was available.

## Layer structure

The scene is assembled as editable raster layers. The hidden pose-guide layer can be made visible from the Layers panel if you want to inspect the construction study. The reference sheet is a separate floating image and does not appear in PNG export.

## Canon notes and sources

The character identity and role are based on HoYoWiki's official Amber entry: Pyro, Mondstadt, Knights of Favonius, and the Outrider description.

- https://wiki.hoyolab.com/m/genshin/entry/14?lang=en-us
- https://genshin-impact.fandom.com/wiki/Amber/Profile
- https://genshin-impact.fandom.com/wiki/Amber/Gallery

The fan art is an original interpretation, not an official HoYoverse illustration. The source pages are references for character identity and design traits; no source artwork is embedded or traced.
