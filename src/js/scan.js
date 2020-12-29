// READ MANIFESTS TO READ SHIT, SO MUCH EASIER THAT WAY ACTUALLY OH MY GOD THANK GOODNESS I FOUND THAT LMAOOOOO
// STEAM MANIFESTS: steamapps\appmanifest_{APPID}.acf
// EPIC MANIFESTS: C:\ProgramData\Epic\EpicGamesLauncher\Data\Manifests\{STRING}.item
//
// Images: Hopefully findable through manifests?  Steam can probably download just via IDs
// - epic dest: C:\Program Files (x86)\Epic Games\Launcher\Portal\SysFiles



// For epic:
// Managed to resolve the issue. Within the main Subnautica game folder 
// there is a folder there is a file called .egstore where the MANIFEST file is located.
// I simply renamed this folder, restarted Epic Launcher, and it gave me the option to 
// reinstall the game. All good now!
//
// Maybe try doing this with a game or just installing a free game and trying to catch something in .egstore/ during the staging phase?

// C:\Users\Nathan\AppData\Local\EpicGamesLauncher\Saved\webcache_4147\IndexedDB\https_www.epicgames.com_0.indexeddb.leveldb