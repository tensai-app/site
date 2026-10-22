#!/usr/bin/env bash
# Frames a raw phone capture (1080x2400, from adb_capture_screen) like the other files in src/assets/shots:
# the status bar is repainted clean (9:41, signal, battery), the screen is scaled to 780x1600 by stretching its
# edge pixels sideways, its corners are rounded and it sits in a 20px bezel (820x1640, transparent outside).
# Needs ImageMagick 7. Usage: scripts/frame-shot.sh raw.png src/assets/shots/<name>-<dark|light>.png
set -euo pipefail
in=$1
out=$2
font=${SHOT_FONT:-$(dirname "$0")/../../tensai/app/src/main/res/font/jetbrains_mono.ttf}
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

# The status bar keeps the app's own background: sample a corner pixel, which has no icon on it.
bg=$(magick "$in" -format '%[pixel:p{5,5}]' info:)
fg=$(magick "$in" -crop 1x1+5+5 +repage -format '%[fx:luminance<0.5?1:0]' info:)
[ "$fg" = 1 ] && fg='#E8E6F0' || fg='#1C1A26'

magick "$in" \
  -fill "$bg" -draw 'rectangle 0,0 1079,119' \
  -fill "$fg" -font "$font" -pointsize 38 -annotate +60+86 '9:41' \
  -draw 'rectangle 858,78 866,88 rectangle 871,70 879,88 rectangle 884,62 892,88 rectangle 897,54 905,88' \
  -fill none -stroke "$fg" -strokewidth 3 -draw 'roundrectangle 925,56 979,86 6,6' \
  -fill "$fg" -stroke none -draw 'rectangle 930,61 966,81 rectangle 981,65 985,77' \
  -resize 720x1600! \
  -virtual-pixel edge -set option:distort:viewport 780x1600-30+0 -distort SRT 0 +repage \
  "$tmp/screen.png"

magick -size 780x1600 xc:none -fill white -draw 'roundrectangle 0,0 779,1599 40,40' "$tmp/mask.png"
magick "$tmp/screen.png" "$tmp/mask.png" -alpha off -compose CopyOpacity -composite "$tmp/rounded.png"
magick -size 820x1640 xc:none -fill '#060509' -draw 'roundrectangle 0,0 819,1639 60,60' \
  "$tmp/rounded.png" -geometry +20+20 -compose over -composite -strip "$out"
