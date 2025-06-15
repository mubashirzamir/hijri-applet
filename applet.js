const Applet = imports.ui.applet;
const GLib = imports.gi.GLib;

class HijriApplet extends Applet.TextApplet {
    constructor(metadata, orientation, panelHeight, instanceId) {
        super(orientation, panelHeight, instanceId);
        this.set_applet_label("Loading...");
        this._updateDate();
        // Refresh every hour (3600000 ms)
        this._timer = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 3600, () => {
            this._updateDate();
            return true;
        });
    }

    _updateDate() {
        // Adjust path if needed
        let [res, out, err, status] = GLib.spawn_command_line_sync('python3 ' + GLib.get_current_dir() + '/hijri_date.py --format dmy');
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
