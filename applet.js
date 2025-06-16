const Applet = imports.ui.applet;
const GLib = imports.gi.GLib;

class HijriApplet extends Applet.TextApplet {
  constructor(metadata, orientation, panelHeight, instanceId) {
    super(orientation, panelHeight, instanceId);

    this.scriptDir = metadata.path;

    this.set_applet_label("Loading...");
    this._updateDate();

    // Refresh every hour (3600000 ms)
    this._timer = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 3600, () => {
      this._updateDate();
      return true;
    });
  }

  _updateDate() {
    global.log("HijriApplet: Updating date...");
    
    let [res, out, err, status] = GLib.spawn_command_line_sync(
      "python3 " + this.scriptDir + "/main.py --format dmy"
    );

    if (res && status === 0) {
      let dateStr = out.toString().trim();
      this.set_applet_label(dateStr);
    } else {
      this.set_applet_label("Error");
    }
  }

  on_applet_removed_from_panel() {
    if (this._timer) {
      GLib.source_remove(this._timer);
      this._timer = null;
    }
  }
}

function main(metadata, orientation, panelHeight, instanceId) {
  return new HijriApplet(metadata, orientation, panelHeight, instanceId);
}
