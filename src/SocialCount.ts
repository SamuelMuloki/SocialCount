import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dojoClass from "dojo/dom-class";
import * as dojoStyle from "dojo/dom-style";
import * as dom from "dojo/dom";

import * as FB from "fb";

import "./ui/fb.css";

class SocialCount extends WidgetBase {

    // Parameters to be configured in the modeler.
    AppId: string;
    AppSecret: string;
    AppToken: string;

    // Private variables
    private response: any;
    private options: any;
    private version: any;
    private contextObject: mendix.lib.MxObject;
    private api: any;

    postCreate() {
        domConstruct.create("div", {
            class: "widget-social-count",
            id: "facebook",
            innerHTML: `<p class="fblogo">Facebook</p>`
        }, this.domNode);
        domConstruct.create("div", {
            class: "widget-social-count",
            id: "fans",
            innerHTML: ``
        }, this.domNode);
    }

    update(object: mendix.lib.MxObject, callback?: () => void) {
        this.contextObject = object;
        this.updateRendering();
        if (callback) {
            callback();
        }
    }

    private updateRendering() {
        if (this.contextObject) {
            FB.options({ version: "v2.10" });
            const SocialCount = FB.extend(this.contextObject.get(this.AppId), this.contextObject.get(this.AppSecret));
            FB.setAccessToken(this.contextObject.get(this.AppToken));
            FB.api(this.contextObject.get(this.AppId) as string
                + "?fields=name, fan_count", function(response: any) {
                    if (!response || response.error) {
                        console.log(!response ? "error occurred" : response.error);
                        return;
                    }
                    dom.byId("fans").innerHTML = response.fan_count + " Likes";
                });
        } else {
            console.log("Context Object not set click in the data grid!!");
        }
    }
}

dojoDeclare("widget.SocialCount", [WidgetBase], function (Source: any) {
    const result: any = {};
    for (const i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
}(SocialCount));
