### Satisfactory Signs Image Builder

This typescript script converts an JPG image into Satisfactory blueprint files that can be later build in the game and create a "poster" of your image. It is using the awesome [etothepii4/satisfactory-file-parser](https://github.com/etothepii4/satisfactory-file-parser) that made it possible.

**Take this project as it is. It was my fun proof of concept side project and I am not intending to maintain it. It is quite simple so it can be easily modified.**

Example of 64x64 image built with 1m Signs:

![Preview](preview.png "Example of 64x64 image")

## How to build it

1. Prepare your image.  
   This script supports only JPG, square images that have sizes are divisible by 32 so for example 32x32, 64x64, 128x128 etx. Easiest way is to place the image in the `assets` directory.
1. Configure project.  
   Go to `src/config.ts` and edit variables inside the `Configuration` section.  
      - `imagePath`- Path to your image file. 
      - `blueprintName` - Name of the output Blueprint files.
2. Build the project `npm run build` and run it `npm start`

## How to add it to the game

1. Go to the `output` directory and copy your desired blueprint files to the [game directory](https://satisfactory.wiki.gg/wiki/Blueprint#Save_Location). The amount of the files depends on the size of your image.
2. Restart your game or server
3. The blueprints should be visible in the Undefined category in your Blueprint build menu.

## How to build it in the game

This script is splitting images in to sections that have sizes of 32x32 pixels (Which are 32x32 1m Signs in the game).

Below is the layout of the way sections are created. Each section is named as `ROW x COLUMN` started from bottom left and going to top right. So for example with 6x64 image I will place Section 1x1 first, then 1x2 on the right side of it, then 2x1 on top of the 1x1 and so on.

| | Column 1| Column 2 | Column B ...|
| --------- | ------- | ------- | ----- |
| Row A ... |   Ax1   |   Ax2   |  AxB  |
| Row 2     |   2x1   |   2x2   |  2xB  |
| Row 1     |   1x1   |   1x2   |  1xB  |

## Few tips and notes about performance:

- The Signs do not snap that well so it might be easier to build a huge wall behind and then try to align the blueprint sections with it.
- Each section costs 1024 x Reinforced Iron Plate and 5120 x Quartz Crystal. This requires a lot of inventory space and is only possible to be built in later stages of the game hen you unlock more inventory slots.
- I did not notice performance drops after the "Poster" was built but there were noticable drops while building it. 
- While you place the blueprint the hologram will cause big FPS drop but it will go back to normal as soon as you exit build mode.
- There is some limit of how many Signs are loaded at same time so after you build it or load the "Poster" for the first time you will see that the signs will be slowly loaded and their contents replaced 1 by 1. In my 64x64 image it took about 30 second before it was fully loaded for first time.