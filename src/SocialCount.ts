import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dom from "dojo/dom";

import * as FB from "fb";
import "./ui/fb.css";

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
        this.facebookNode = domConstruct.create("div", {
            id: "facebook",
            innerHTML: ``
        }, this.domNode);
        this.fansNode = domConstruct.create("div", {
            class: "widget-social-count",
            id: "fans",
            innerHTML: ``
        }, this.domNode);
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
                    guids: [guid]
                },
                callback: () => {
                    console.log("Microflow executed");
                },
                error: (error) => { mx.ui.error("Error executing microflow " + microflow + " : " + error.message); }
            }, this);
        }
    }

    private updateRendering() {
        if (this.contextObject) {
            FB.options({ version: "v2.10" });
            FB.extend(this.contextObject.get(this.AppId), this.contextObject.get(this.AppSecret));
            FB.setAccessToken(this.contextObject.get(this.AppToken));
            FB.api(this.contextObject.get(this.AppId) as string
                + "?fields=name, fan_count", (response: any) => {
                    if (!response || response.error) {
                        // domConstruct.empty(this.domNode);
                        mx.ui.error(!response ? "error occurred" : response.error);
                        return;
                    }
                    this.facebookNode.innerHTML = "<div class='app'></div>";
                    this.fansNode.innerHTML = response.fan_count + "<br/><div class='widget-likes'>Likes</div>";
                });
        } else {
            // mx.ui.error("No context Object Specified, Select a context Object in the modeler");
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
