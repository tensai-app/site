#!/usr/bin/env bash
# Phone screenshots for src/assets/shots, in two steps. Needs ImageMagick 7.
#
#   scripts/frame-shot.sh clean raw.png shots-src/<name>-<dark|light>.png
#     A raw capture (1080x2400, from adb_capture_screen) with its status bar repainted clean (9:41, signal,
#     battery): no notification icon or real time from the phone ever reaches the repo. shots-src/ keeps these
#     full-size sources so the frame can change without a new capture.
#   scripts/frame-shot.sh frame shots-src/<file>.png src/assets/shots/<file>.png
#     Scales the screen to 780x1600 (edge pixels stretched sideways), cuts it with the screen mask and lays it
#     on the bezel. Both masks in scripts/frame/ come from the design's own frame (unknown-apps-light.png), so
#     real captures and design captures share the exact same corners.
#   scripts/frame-shot.sh all
#     Frames every file in shots-src/ into src/assets/shots/.
set -euo pipefail
here=$(cd "$(dirname "$0")" && pwd)
root=$(dirname "$here")

clean() {
  local in=$1 out=$2
  local font=${SHOT_FONT:-$root/../tensai/app/src/main/res/font/jetbrains_mono.ttf}
  # The status bar keeps the app's own background: sample a corner pixel, which has no icon on it.
  local bg fg
  bg=$(magick "$in" -format '%[pixel:p{5,5}]' info:)
  fg=$(magick "$in" -crop 1x1+5+5 +repage -format '%[fx:luminance<0.5?1:0]' info:)
  [ "$fg" = 1 ] && fg='#E8E6F0' || fg='#1C1A26'
  magick "$in" \
    -fill "$bg" -draw 'rectangle 0,0 1079,119' \
    -fill "$fg" -font "$font" -pointsize 38 -annotate +60+86 '9:41' \
    -draw 'rectangle 858,78 866,88 rectangle 871,70 879,88 rectangle 884,62 892,88 rectangle 897,54 905,88' \
    -fill none -stroke "$fg" -strokewidth 3 -draw 'roundrectangle 925,56 979,86 6,6' \
    -fill "$fg" -stroke none -draw 'rectangle 930,61 966,81 rectangle 981,65 985,77' \
    -strip "$out"
}

frame() {
  local in=$1 out=$2 tmp
  tmp=$(mktemp -d)
  magick -size 820x1640 xc:'#060509' "$here/frame/outer.png" -alpha off -compose CopyOpacity -composite "$tmp/bezel.png"
  magick "$in" -resize 720x1600! \
    -virtual-pixel edge -set option:distort:viewport 780x1600-30+0 -distort SRT 0 +repage \
    -background none -gravity northwest -splice 20x20 -extent 820x1640 "$tmp/screen.png"
  magick "$tmp/screen.png" "$here/frame/screen.png" -alpha off -compose CopyOpacity -composite "$tmp/cut.png"
  magick "$tmp/bezel.png" "$tmp/cut.png" -compose over -composite -depth 8 -strip "$out"
  rm -r "$tmp"
}

case ${1:-} in
  clean) clean "$2" "$3" ;;
  frame) frame "$2" "$3" ;;
  all)
    for src in "$root"/shots-src/*.png; do
      frame "$src" "$root/src/assets/shots/$(basename "$src")"
    done
    ;;
  *) echo "usage: $0 clean RAW OUT | frame SRC OUT | all" >&2; exit 2 ;;
esac
