import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dojoClass from "dojo/dom-class";
import * as dojoStyle from "dojo/dom-style";
import * as dom from "dojo/dom";
// import "https://connect.facebook.net/en_US/all.js";

class SocialCount extends WidgetBase {

    // Parameters to be configured in the modeler.
    AppId: string;
    AppSecret: string;
    AppName: string;

    postCreate() {
        console.log("Your program has executed postCreate");
        this.FbAsync();
        domConstruct.create("div", {
            class: "widget-social-count",
            innerHTML: `<fb:login-button scope="public_profile,email" onlogin="checkLoginState();">
                        </fb:login-button>`
        }, this.domNode);
    }

    update(object: mendix.lib.MxObject, callback?: () => void) {
        this.updateRendering();
        if (callback) {
            callback();
        }
    }

    private delay(milliseconds: number, count: number): Promise<number> {
        return new Promise<number>(resolve => {
            setTimeout(() => {
                resolve(count);
            }, milliseconds);
        });
    }

    private async FbAsync(): Promise<void> {
        this.loadScript();
        for (let i = 0; i < 5; i++) {
            const count: number = await this.delay(500, i);
            console.log(count);
        }
        this.Fb_init();
    }

    private async loadScript() {
        ((d: HTMLDocument, s: string, id: string) => {
            let js: any;
            const fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            if (fjs.parentNode) fjs.parentNode.insertBefore(js, fjs);
            })(document, "script", "facebook-jssdk");
        }

    private async Fb_init() {
        FB.init({
            appId: "159229304625007",
            cookie: true,
            version: "v2.8",
            xfbml: true
        });
        FB.getLoginStatus((response) => {
            this.statusChangeCallback(response);
        });
    }

    private statusChangeCallback(response: any) {
        if (response.status === "connected") {
            console.log("Authenticated");
            console.log(response.authResponse.accessToken);
            FB.api("/111028836222296?fields=name,new_like_count", (response: any) => {
                console.log(JSON.stringify(response));
            });
        } else {
            console.log("Not authenticated");
        }
    }

    private checkLoginState() {
        FB.getLoginStatus((response) => {
            this.statusChangeCallback(response);
        });
    }

    private updateRendering() {
        // todo
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
