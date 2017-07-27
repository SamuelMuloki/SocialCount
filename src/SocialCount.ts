import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dojoClass from "dojo/dom-class";
import * as dojoStyle from "dojo/dom-style";
import * as dom from "dojo/dom";
// import * as FB from "fb";

class SocialCount extends WidgetBase {

    // Parameters to be configured in the modeler.
    AppId: string;
    AppSecret: string;
    AppName: string;
    script: string;

    // variables
    element: HTMLDocument;
    id: string;
    fjs: any;

    postCreate() {
        console.log("Your program has executed postCreate");
        this.loadSDK(this.element, this.script, this.id);
    }

    update(object: mendix.lib.MxObject, callback?: () => void) {
        this.updateRendering();
        if (callback) {
            callback();
        }
    }

    private Fb_init() {
        FB.init({
            appId: "484256748573575",
            cookie: true,
            status: true,
            version: "v2.5",
            xfbml: true
        });
        FB.getLoginStatus((response) => {
            this.statusChangeCallback(response);
        });
    }

    private loginStatus() {
        // todo
    }

    private loadSDK(element: HTMLDocument, script: string, id: string) {
        let js: any;
        const fjs: Element = element.getElementsByTagName(script)[0];
        if (element.getElementById(id)) { return; }
        js = element.createElement(script);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        if (fjs.parentNode) {
            fjs.parentNode.insertBefore(js, fjs);
        }
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

    private displayButton() {
        domConstruct.create("div", {
            innerHTML: `<fb:login-button scope="public_profile,email" onlogin="checkLoginState();">
                        </fb:login-button>`
        }, this.domNode);
    }

    private updateRendering() {
        // todo
        this.displayButton();
        // this.loginStatus();
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
