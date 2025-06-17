# Hijri Date Applet for Cinnamon

A Cinnamon desktop panel applet that displays the current Hijri (Islamic) date using the [Aladhan API](https://aladhan.com/prayer-times-api). The date updates at a configurable interval and supports both Arabic and English display options.

## Features

* Displays current Hijri date on the Cinnamon panel
* Configurable:

    * Language (Arabic or English)
    * Date format (`DD-MM-YYYY`, `YYYY-MM-DD`, `Month Day, Year`)
    * Show numeric month or month name
    * Separator character (e.g., `-`, `/`, ` `)
    * Refresh interval
* Converts numbers to Arabic numerals when Arabic language is selected

## Requirements

* Cinnamon desktop environment
* Internet connection (to fetch Hijri date from Aladhan API)

## Installation

1. Clone or download this repository into your Cinnamon applet directory:

```bash
~/.local/share/cinnamon/applets/hijri@mushi/
```

2. Make sure the `metadata.json` and `applet.js` are present in the directory.
3. Right-click on the Cinnamon panel → **Add Applets to the Panel** → Add **Hijri Date Applet**.

## Settings

You can access settings via the applet's right-click menu.

* **Language:** Display date in English or Arabic
* **Date Format:** Choose between different formats
* **Month Display:** Show month as a name or number
* **Separator:** Customize the separator character
* **Refresh Interval:** Set how often the date should update (in seconds)

## API Used

[Aladhan.com - Hijri Date API](https://aladhan.com/gregorian-to-hijri)


