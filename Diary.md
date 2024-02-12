# Game Log
## Sunday

### 5am
- thinking the jam starts at 5pm, spend the whole day working on rewriting RxJs

### 5pm
- realize the jam started 12 hours ago, think about doors with the Super Bowl on in the bg
- game concept:

#### Door Quest, An Endless Opener
A 2.5D isometric or 3D fixed 3rd person platformer (refer to as 3D either way)
- 3D view is constructed from procedurally generated tilemaps
- each level is a room connected to another via 1 or more doors
- 3D version has a pixelation filter
- graphics style like 1980s Sierra adventure games
- player character is an anthropomorphic crystal ball
- interactions are automatic by rolling over to hitbox
- WASD control scheme manages accel/devel and hotkeys
- physics is realistic in the sense that there is friction and controls apply force only
- start screen is a room containing a book and a locked door
- opening the book pulls up ~~cheat code~~developer console
- game can be played as a text adventure via the console
- if a screen reader can be detected, autolaunch the console on load
- start of game is opening the book and proceeding through the adventure
- at some point in text adventure, player goes through a door which starts the game proper
- console parser accepts developer commands, verb-noun text adventure, and choices
- text and choice structure is defined by an Inkle file
- hitboxes in the 3D world cause corresponding action in console
- 3D pauses when console is open, resumes when closed
- if text adventure changes scene, new scene is loaded when 3D resumes
- actions from text adventure are applied to scene, as if the player moved to each hitbox
- player starts at default or location of most recent hitbox
- a special door returns the player to the start room
- start room door is then unlocked and moving through it generates a new level
- game object is to unlock start door by returning to it from inside the book
- identify https://github.com/SvenFrankson/marble-fall/tree/main as potential pilfering source

## Monday
### 11am
- identify BabylonJS/SummerFestival as a good place to start
- initialize git repo https://github.com/knutsoned/DoorQuest
