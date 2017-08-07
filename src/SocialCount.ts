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
    mfToExecute: string;

    // Private variables
    private response: any;
    private options: any;
    private version: any;
    private contextObject: mendix.lib.MxObject;
    private api: any;

    postCreate() {
        domConstruct.create("div", {
            id: "facebook",
            innerHTML: ``
        }, this.domNode);
        domConstruct.create("div", {
            class: "widget-social-count",
            id: "fans",
            innerHTML: ``
        }, this.domNode);
    }

    update(object: mendix.lib.MxObject, callback?: () => void) {
        this.contextObject = object;
        this.resetSubscription();
        this.updateRendering(callback);
        if (callback) {
            callback();
        }
    }

    uninitialise(): boolean {
        return true;
    }

    private execMf(mf: any, guid: any, callback?: any){
        if (mf && guid) {
            mx.ui.action(mf, {
                params: {
                    applyto: "selection",
                    guids: [ guid ]
                },
                callback: ((obj: mendix.lib.MxObject) => {
                    if (callback && typeof callback === "function") {
                        callback(obj);
                    }
                }),
                error: (error) => {
                    mx.ui.error("Error executing microflow " + mf + " : " + error.message);
                }
            }, this);
        }
    }

    private setupEvents() {
        if (this.mfToExecute) {
            this.execMf(this.mfToExecute, this.contextObject.getGuid());
        }
    }

    private updateRendering(callback?: any) {
        this.setupEvents();
        if (this.contextObject) {
            FB.options({ version: "v2.10" });
            const SocialCount = FB.extend(this.contextObject.get(this.AppId), this.contextObject.get(this.AppSecret));
            FB.setAccessToken(this.contextObject.get(this.AppToken));
            FB.api(this.contextObject.get(this.AppId) as string
                + "?fields=name, fan_count", (response: any) => {
                    if (!response || response.error) {
                        console.log(!response ? "error occurred" : response.error);
                        return;
                    }
                    dom.byId("facebook").innerHTML = "<div class='app'></div>";
                    dom.byId("fans").innerHTML = response.fan_count + "<br/><div class='widget-likes'>Likes</div>";
                });
        } else {
            dom.byId("facebook").innerHTML = "<div class='app hidden'></div>";
            dom.byId("fans").innerHTML = "<div class='widget-likes hidden'></div>";
            console.log("Context Object not set click in the data grid!!");
        }

        this.executeCallback(callback, "updateRendering");
    }

    resetSubscription() {
        this.unsubscribeAll();

        if (this.contextObject) {
            this.subscribe({
                guid: this.contextObject.getGuid(),
                callback: ((guid) => {
                    this.updateRendering();
                })
            });

            this.subscribe({
                guid: this.contextObject.getGuid(),
                attr: this.AppId,
                callback: ((guid, attr, attrValue)=>{
                    this.updateRendering();
                })
            });

            this.subscribe({
                guid: this.contextObject.getGuid(),
                attr: this.AppSecret,
                callback: ((guid, attr, attrValue) => {
                    this.updateRendering();
                })
            });

            this.subscribe({
                guid: this.contextObject.getGuid(),
                attr: this.AppToken,
                callback: ((guid, attr, attrValue) => {
                    this.updateRendering();
                })
            });
        }
    }

    private executeCallback(callback: any, from: any) {
        if (callback && typeof callback === "function"){
            callback();
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
