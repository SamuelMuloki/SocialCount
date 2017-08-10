import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";

import * as FB from "fb";
import "./ui/fb.css";
import { FbResponse } from "./facebook";

class SocialCount extends WidgetBase {
    // Parameters to be configured in the modeler.
    AppId: string;
    AppSecret: string;
    AppToken: string;
    microflowToExecute: string;

    // Private variables
    private contextObject: mendix.lib.MxObject;
    private facebookNode: HTMLElement;
    private fansNode: HTMLElement;

    postCreate() {
        this.facebookNode = domConstruct.create("div", {}, this.domNode);
        this.fansNode = domConstruct.create("div", {}, this.domNode);
    }

    update(object: mendix.lib.MxObject, callback?: () => void) {
        this.contextObject = object;
        this.resetSubscription();
        this.setupEvents();
        this.updateRendering();
        if (callback) {
            console.log("callback in update");
            callback();
        }
    }

    resetSubscription() {
        if (this.contextObject) {
            const Subscription = this.subscribe({
                guid: this.contextObject.getGuid(),
                callback: ((guid) => {
                    console.log("Object with guid " + guid + " changed");
                    this.updateRendering();
                })
            });
            mx.data.unsubscribe(Subscription);
        }
    }

    private setupEvents() {
        if (this.microflowToExecute) {
            this.execMicroflow(this.microflowToExecute, this.contextObject.getGuid());
        }
    }

    private execMicroflow(microflow: string, guid: string) {
        if (microflow && guid) {
            mx.ui.action(microflow, {
                params: {
                    applyto: "selection",
                    guids: [ guid ]
                },
                callback: () => {
                    console.log("Microflow executed");
                },
                error: (error) => { mx.ui.error("Error executing microflow " + microflow + " : " + error.message); }
            }, this);
        }
    }

    private updateRendering() {
        if (this.contextObject && navigator.onLine) {
            FB.setAccessToken(this.contextObject.get(this.AppToken));
            FB.api(this.contextObject.get(this.AppId) as string
                + "?fields=fan_count", (response: FbResponse) => {
                    if (!response || response.error) {
                        mx.ui.error(!response ? "error occurred" : response.error.message);
                        return;
                    }
                    this.facebookNode.innerHTML = "<div class='app'></div>";
                    this.fansNode.innerHTML = this.customNumberFormat(response.fan_count) +
                     "<br/><div class='widget-likes'>Likes</div>";
                });
        } else {
            this.facebookNode.innerHTML = `<div class="alert alert-danger">
            ${!this.contextObject ? "No context Object Specified" : "No internet connection"}</div>`;
        }
    }

    private customNumberFormat(fanCount: any) {
        if (fanCount > 1000000) {
            return Math.round(fanCount / 1000000) + "M";
        } else if (fanCount > 1000) {
            return Math.round(fanCount / 1000) + "K";
        }

        return fanCount;
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
