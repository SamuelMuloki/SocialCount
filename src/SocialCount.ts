import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dojoClass from "dojo/dom-class";
import * as dojoStyle from "dojo/dom-style";
import * as dom from "dojo/dom";
// import * as FB from "fb";

// import * as facebook from "facebook-js-sdk";
// declare var FB: facebook.FacebookStatic;

class SocialCount extends WidgetBase {

    // Parameters to be configured in the modeler.
    AppId: string;
    AppSecret: string;
    AppName: string;

     FB: any;

    postCreate() {
        console.log("Your program has executed postCreate");
    }

    update(object: mendix.lib.MxObject, callback?: () => void) {
        this.updateRendering();
        if (callback) {
            callback();
        }
    }
 
    private loadScript(){
        //todo
    }

    private Fb_init() {
        FB.init({
            appId: "484256748573575",
            version: "v2.5",
            status: true,
            cookie: true,
            xfbml: true
        });
        console.log("Succesfully connected!");
    }

    private loginStatus() {
        FB.getLoginStatus((response: fb.AuthResponse) => {
            console.log(response);
            console.log(response.status);
            console.log(response.authResponse.accessToken);
        });
    }

    private displayButton() {
        domConstruct.create("input", {
            class: "form-control btn-default",
            type: "button",
            value: "Post"
        }, this.domNode).addEventListener("click", () => {
            this.Fb_init();
        });
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
