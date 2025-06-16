const Applet = imports.ui.applet;
const Soup = imports.gi.Soup;
const GLib = imports.gi.GLib;
const ByteArray = imports.byteArray;
const Settings = imports.ui.settings;

class HijriApplet extends Applet.TextApplet {
  constructor(metadata, orientation, panelHeight, instanceId) {
    super(orientation, panelHeight, instanceId);

    this.session = new Soup.Session();

    this.settings = new Settings.AppletSettings(
      this,
      metadata.uuid,
      instanceId
    );

    this.settings.bindProperty(
      Settings.BindingDirection.IN,
      "language",
      "language",
      this.updateDate.bind(this),
      null
    );
    this.settings.bindProperty(
      Settings.BindingDirection.IN,
      "format",
      "format",
      this.updateDate.bind(this),
      null
    );
    this.settings.bindProperty(
      Settings.BindingDirection.IN,
      "monthNames",
      "monthNames",
      this.updateDate.bind(this),
      null
    );
    this.settings.bindProperty(
      Settings.BindingDirection.IN,
      "separator",
      "separator",
      this.updateDate.bind(this) || " ",
      null
    );

    global.log(
      `HijriApplet: language=${this.language}, format=${this.format}, monthNames=${this.monthNames}, separator=${this.separator}`
    );

    this.set_applet_label("Loading...");
    this.updateDate();

    this.timer = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 3600, () => {
      this.updateDate();
      return true;
    });
  }

  async updateDate() {
    try {
      let now = new Date();
      let dateStr = `${now.getDate()}-${
        now.getMonth() + 1
      }-${now.getFullYear()}`;
      let url = `https://api.aladhan.com/v1/gToH?date=${dateStr}`;

      let message = Soup.Message.new("GET", url);

      let bytes = await new Promise((resolve, reject) => {
        this.session.send_and_read_async(
          message,
          GLib.PRIORITY_DEFAULT,
          null,
          (session, res) => {
            try {
              let result = session.send_and_read_finish(res);
              resolve(result);
            } catch (e) {
              global.logError(`Error fetching Hijri date: ${e}`);
              reject(e);
            }
          }
        );
      });

      if (message.get_status() !== Soup.Status.OK) {
        global.logError(`Failed to fetch Hijri date: ${message.get_reason()}`);
        this.set_applet_label("Error");
        return;
      }

      let text = ByteArray.toString(bytes.get_data());
      let json = JSON.parse(text);

      const hijri = json?.data?.hijri;
      if (!hijri) {
        global.logError("Invalid response structure for Hijri date");
        this.set_applet_label("Error");
        return;
      }

      const day = hijri.day;
      const year = hijri.year;
      const month = this.monthNames
        ? hijri.month[this.language] // "Rajab" or "رَجَب"
        : hijri.month.number.toString().padStart(2, "0");

      let finalDay = day;
      let finalMonth = month;
      let finalYear = year;

      if (this.language === "ar") {
        finalDay = this.convertToArabicDigits(day);
        finalMonth =
          this.monthNames && typeof month === "string"
            ? month
            : this.convertToArabicDigits(month);
        finalYear = this.convertToArabicDigits(year);
      }

      let displayDate;
      let sep = this.separator;

      switch (this.format) {
        case "YYYY-MM-DD":
          displayDate = `${finalYear}${sep}${finalMonth}${sep}${finalDay}`;
          break;
        case "Month Day, Year":
          displayDate = `${finalMonth}${sep}${finalDay}${sep}${finalYear}`;
          break;
        default:
          displayDate = `${finalDay}${sep}${finalMonth}${sep}${finalYear}`;
      }

      this.set_applet_label(displayDate);
    } catch (e) {
      global.logError(`Error updating Hijri date: ${e}`);
      this.set_applet_label("Error");
    }
  }

  on_applet_removed_from_panel() {
    if (this.timer) {
      GLib.source_remove(this.timer);
      this.timer = null;
    }
  }

  convertToArabicDigits(str) {
    const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return str.replace(/\d/g, (d) => arabicDigits[parseInt(d)]);
  }
}

function main(metadata, orientation, panelHeight, instanceId) {
  return new HijriApplet(metadata, orientation, panelHeight, instanceId);
}
