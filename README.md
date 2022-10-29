# ngdl

A Music Downloader For [Newgrounds](https://newgrounds.com)

### Usage

```sh
ngdl -d <song_id> # This downloads the song with the song id and saves it on the downloads folder
ngdl -i <song_id> # This gets the info of the song with the song id
ngdl -h # This shows a help message
ngdl -v # This shows the version
```

### Examples

```sh
ngdl -d 109650
# Downloaded "Operation: Evolution" By Dimrain47 And Saved It To
# "C:\\Users\\<your_name>\\Downloads\\Operation Evolution.mp3"
```

```sh
ngdl -d 109650 -o .
# Downloaded "Operation: Evolution" By Dimrain47 And Saved It To The Current Working Directory
```

```sh
ngdl -i 109650
# Title: Operation: Evolution
# Description: Opens with HH, then reaches into techno and trance. Solo haters beware...
# URL: https://www.newgrounds.com/audio/listen/109650
# Image URL: https://img.ngfiles.com/defaults/icon-audio.png?f1578181335
```
