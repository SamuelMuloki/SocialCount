import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dojoClass from "dojo/dom-class";
import * as dojoStyle from "dojo/dom-style";
import * as dom from "dojo/dom";

import "./ui/fb.css";

class SocialCount extends WidgetBase {

    // Parameters to be configured in the modeler.
    AppId: string;
    AppSecret: string;
    AppName: string;

    // Private variables
    private response: any;

    postCreate() {
        this.FbAsync();
        // review with mr. Edwin
        domConstruct.create("div", {
            class: "widget-social-count",
            id: "facebook",
            innerHTML: `<link rel="stylesheet" 
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <a href ="#"class="fa fa-facebook"></a>`
        }, this.domNode);
    }

    update(object: mendix.lib.MxObject, callback?: () => void) {
        this.updateRendering();
        if (callback) {
            callback();
        }
    }
    // useless code remove
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

    // Not proper, use node_modules or include the lib not via http!!
    // Review with Mr. Edwin.
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
        // To review with Mr. Edwin
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
    // Terrible!! No hard coding, Poor structure
    // to review with Mr. Edwin
    private statusChangeCallback(response: any) {
        if (response.status === "connected") {
            FB.api("/111028836222296?fields=name,new_like_count,about,posts{shares,comments}", (response: any) => {
                console.log(JSON.stringify(response.posts));
                console.log(this.AppId);
                domConstruct.place("<div class ='likes'>" +
                    (JSON.stringify(response.new_like_count) + "<br/> Likes") + "</div>", "facebook");
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
