/* FUNCTION */

function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
    var startTimeInMs = Date.now();
    (function loopSearch() {
        if (document.querySelector(selector) != null) {
            callback();
            return;
        }
        else {
            setTimeout(function () {
                if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
                    return;
                loopSearch();
            }, checkFrequencyInMs);
        }
    })();
}

function addToBacklist() {
    blackList.push(document.location.host);
    chrome.storage.sync.set({ blackList: blackList });
    isBlacklisted = true;
}

function removeToBacklist() {
    // remove of blackList
    const index = blackList.indexOf(document.location.host);
    if (index > -1) {
        blackList.splice(index, 1);
    }

    chrome.storage.sync.set({ blackList: blackList });
    isBlacklisted = false;

    // clear cookie
    goToDisableCookies();
}

function clickOnePerOne(ones, type = 'class') {
    if (type == 'class') {
        document.getElementsByClassName(ones[0].class)[ones[0].index].click();
    } else if (type == 'query') {
        document.querySelectorAll(ones[0].class)[ones[0].index].click();
    }
    let itervalClick;
    let currentIndex = 1;
    function click() {
        itervalClick = setInterval(() => {
            let exist = false;
            if (type == 'class') {
                exist = document.getElementsByClassName(ones[currentIndex].class)[ones[currentIndex].index];
            } else if (type == 'query') {
                exist = document.querySelectorAll(ones[currentIndex].class)[ones[currentIndex].index];
            }

            if (exist) {
                setTimeout(() => {
                    if (type == 'class') {
                        document.getElementsByClassName(ones[currentIndex].class)[ones[currentIndex].index].click();
                    } else if (type == 'query') {
                        document.querySelectorAll(ones[currentIndex].class)[ones[currentIndex].index].click();
                    }
                    clearInterval(itervalClick);
                    ++currentIndex;
                    if (currentIndex < ones.length) {
                        click();
                    }
                }, 50);
            }
        }, 100);
    }
    click();

    return true;
}

function uncheck(element) {
    if (element !== null && element !== undefined && element.length != 0) {
        element.checked = false;
        return true;
    } else {
        return false;
    }
}

function disableCookies() {
    let cookieIsDisable = true;
    let ones = false;
    let typeOnes = 'class';

    try {
        // if else for check type of cookies and resolve it
        if (location.hostname == "www.youtube.com") { // youtube
            waitForElementToDisplay('tp-yt-paper-dialog#dialog', function () {
                let preferSettingButton = document.querySelector('tp-yt-paper-dialog#dialog [href*="consent.youtube.com"]');
                preferSettingButton.click();
            }, 1000, 5000);
        } else if (location.hostname == "stackoverflow.com") { // stackoverflow.com
            waitForElementToDisplay('.js-consent-banner', function () {
                let preferSettingButton = document.querySelector('.js-consent-banner button.js-cookie-settings');
                preferSettingButton.click();

                waitForElementToDisplay('#onetrust-pc-sdk', function () {
                    document.querySelectorAll('#onetrust-banner-sdk [type=checkbox]').forEach(element => {
                        element.checked = false;
                    });
                    document.querySelector('#onetrust-banner-sdk .save-preference-btn-handler').click();
                }, 1000, 5000);
            }, 1000, 5000);
        } else if (location.hostname == "www.facebook.com") { // facebook
            waitForElementToDisplay('[data-testid="cookie-policy-dialog"]', function () {
                let preferSettingButton = document.querySelector('[data-cookiebanner="manage_button"]');
                preferSettingButton.click();

                document.querySelectorAll('[data-testid="cookie-policy-manage-dialog"] [type="checkbox"]').forEach(element => {
                    element.checked = false;
                });
                document.querySelector('[data-testid="cookie-policy-manage-dialog-accept-button"]').click();
            }, 1000, 5000);
        } else if (location.hostname == "www.instagram.com") { // instagram
            waitForElementToDisplay('[role="presentation"]', function () {
                let preferSettingButton = document.querySelector('button.aOOlW.HoLwm');
                preferSettingButton.click();

                document.querySelectorAll('[role="presentation"] [type="checkbox"]').forEach(element => {
                    element.checked = false;
                });
                document.querySelector('[role="presentation"] .aOOlW.bIiDR').click();
            }, 1000, 5000);
        } else if (document.querySelector('.a-declarative[data-action="sp-cc"]') !== null) { // amazon
            document.getElementById('sp-cc-customize').click();
        } else if (document.querySelector('[aria-labelledby="savePrefs-announce"]') !== null) { // rest of amazon 
            document.querySelector('[aria-labelledby="savePrefs-announce"]').click();
        }
        /* after this line code is old (waitElementToDisplay did not exist) */
        else if (document.getElementsByClassName('_1OhNBA')[0] !== undefined) {
            ones = [
                {
                    class: "_1OhNBA",
                    index: 0
                },
                {
                    class: "_3u5Phj",
                    index: 1
                },
                {
                    class: "_3yd0cO",
                    index: 1
                }
            ]
            typeOnes = 'class';
        } else if (document.getElementById('Sx9Kwc') !== null) { // google
            document.getElementById('Sx9Kwc').remove();
            document.getElementsByClassName('EM1Mrb')[0].style.overflow = 'auto';
        } else if (document.getElementById('VnjCcb') !== null) { // google
            document.getElementById('VnjCcb').click();
            // document.getElementById('Sx9Kwc').remove();
            // document.getElementsByClassName('EM1Mrb')[0].style.overflow = 'auto';
        } else if (document.getElementById('axeptio_overlay') !== null) { // axeptio
            document.getElementById('axeptio_overlay').style.display = 'none';
            setTimeout(() => {
                document.getElementsByClassName('iHwVQV')[0].click();
            }, 3500);
        } else if (document.getElementById('CybotCookiebotDialog') !== null) { // cookie bot
            document.getElementById('CybotCookiebotDialogBodyLevelButtonLevelOptinDeclineAll').click();
        } else if (document.querySelector('.osano-cm-manage.osano-cm-dialog__button.osano-cm-button.osano-cm-button--type_manage') !== null) { // osano
            document.getElementsByClassName('osano-cm-window')[0].style.display = 'none';
            ones = [
                {
                    class: ".osano-cm-manage.osano-cm-dialog__button.osano-cm-button.osano-cm-button--type_manage",
                    index: 0
                },
                {
                    class: ".osano-cm-save.osano-cm-view__button.osano-cm-button",
                    index: 0
                }
            ]
            typeOnes = 'query';
        } else if (document.getElementsByClassName('cookiefirst-root') !== undefined && document.getElementsByClassName('cookiefirst-root').length != 0) { // cookiefirst
            setTimeout(() => {
                document.querySelector('[data-cf-action="reject"]').click();
                setTimeout(() => {
                    document.getElementsByClassName('cookiefirst-root')[1].style.display = 'none'
                }, 500);
            }, 500);
        } else if (document.getElementById('onetrust-consent-sdk') !== null) {
            if (document.getElementById('onetrust-reject-all-handler') !== null) {
                document.getElementById('onetrust-reject-all-handler').click();
            } else if (document.querySelector('#onetrust-consent-sdk .cookie-setting-link') !== null) {
                document.querySelector('#onetrust-consent-sdk .cookie-setting-link').click();

                // uncheck
                for (let i = 1; i < 5; i++) {
                    uncheck(document.querySelector('#ot-group-id-C000' + i));
                }

                // save
                document.querySelector('.save-preference-btn-handler').click();
            } else if (document.querySelector('.grid--cell.s-btn.s-btn__filled.js-cookie-settings') !== null) {
                document.querySelector('.grid--cell.s-btn.s-btn__filled.js-cookie-settings').click();

                // uncheck
                for (let i = 1; i < 5; i++) {
                    uncheck(document.querySelector('#ot-group-id-C000' + i));
                }

                // save
                let checkExist = setInterval(function () {
                    if (document.querySelector('[aria-hidden="false"] .s-modal--footer>.save-preference-btn-handler') != null) {
                        document.querySelector('[aria-hidden="false"] .s-modal--footer>.save-preference-btn-handler').click();
                        clearInterval(checkExist);
                    }
                }, 100);
            } else if (document.querySelector('[data-uia=cookie-disclosure-toggle-preferences]') != null) {
                document.querySelector('[data-uia=cookie-disclosure-toggle-preferences]').click();
                document.querySelector('#onetrust-consent-sdk .save-preference-btn-handler').click();
            }/* else {

                document.querySelector('.onetrust-close-btn-handler.banner-close-button.ot-close-icon').click();
            }*/
        } else if (document.getElementById('didomi-host') !== null) {
            // didomi
            if (document.getElementById('didomi-notice-disagree-button') !== null &&
                document.getElementById('unify-goto-subscribe') == null // suscribe for access
            ) {
                document.getElementById('didomi-notice-disagree-button').click();
                if (document.getElementById('close-final-popup-disagree') !== null) {
                    document.getElementById('close-final-popup-disagree').click();
                }
            } else if (document.getElementsByClassName('didomi-continue-without-agreeing')[0] !== undefined) {
                document.getElementsByClassName('didomi-continue-without-agreeing')[0].click();
            } else if (document.getElementById('unify-goto-subscribe') !== null) {
                // delete banner because website want to pay for access
                document.getElementById('didomi-host').remove();
                document.getElementsByTagName('body')[0].classList.remove('didomi-popup-open')
            }
        } else if (document.getElementById('appconsent') !== null || document.querySelectorAll('[src^="https://cdn.appconsent.io"]').length != 0) {
            if (document.querySelector('#appconsent iframe') !== null) {
                if (document.querySelector('#appconsent iframe').contentDocument.querySelector('.button__skip') !== null) {
                    document.querySelector('#appconsent iframe').contentDocument.querySelector('.button__skip').click();
                } else {
                    document.querySelector('#appconsent iframe').contentDocument.querySelector('.sc-18sn7k8-1.pfTbW').click();
                }
            }
            const style = document.createElement('style');
            style.innerHTML = /* css */ `
            .incentive-banner {
                display: none;
            }
            `;
            document.head.append(style);
        } else if (document.querySelector('.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.IIdkle a') != null) {
            // youtube
            document.querySelector('.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.VfPpkd-LgbsSe-OWXEXe-dgl2Hf.nCP5yc.AjY5Oe.DuMIQc.IIdkle a').click();
        } else if (
            document.getElementsByTagName('body')[0].hasAttribute('jscontroller') &&
            document.getElementsByTagName('body')[0].getAttribute('jscontroller') == 'pjICDe'
        ) {
            // after Youtube
            document.querySelector('[jsaction="JIbuQc:H0Ii0d"] button').click();
            document.querySelector('[jsaction="JIbuQc:tJpKGc"] button').click();
            document.querySelector('[jsaction="JIbuQc:zOqsBb"] button').click();
            document.querySelector('[jsname="j6LnYe"]').click();
        } else if (
            document.getElementsByClassName('_62m9tQ') !== undefined &&
            document.getElementsByClassName('_62m9tQ').length != 0
        ) {
            // canvas
            document.querySelector('button.YPTJew').click();
            document.querySelector('.T1Yb-g>:not(._6ChMog)').click();
            document.querySelector('._1QoxDw.Qkd66A.fFOiLQ.fP4ZCw.zKTE_w.Qkd66A.fFOiLQ.fP4ZCw.lsXp-w.ubW6qw.GnpDIA.zQlusQ.uRvRjQ').click();
        } else if (document.getElementById('snigel-cmp-framework') !== null) {
            // snigel
            document.getElementById('sn-b-custom').click();
            setTimeout(() => {
                document.getElementById('sn-b-save').click();
            }, 100);
        } else if (document.getElementsByClassName('eu-cookie-compliance-banner').length != 0) {
            //tcl
            document.querySelector('.eu-cookie-compliance-banner .ecc-show-categories').click();
            document.querySelector('.eu-cookie-compliance-banner .eu-cookie-compliance-save-preferences-button').click();
        } else if (document.getElementById('gdpr-new-container') !== null) {
            // aliexpress
            document.getElementsByClassName('btn-more')[0].click();
            document.getElementsByClassName('btn-save')[0].click();
        } else if (document.getElementById('qc-cmp2-container') !== null) {
            // quantcast : developez, grimper and other
            setTimeout(() => {
                let buttons = document.querySelectorAll('#qc-cmp2-container .qc-cmp2-summary-buttons>button[mode="secondary"]');
                if (buttons[0].innerHTML == "JE REFUSE") {
                    buttons[0].click();
                } else {
                    buttons[0].click();
                    setTimeout(() => {
                        if (document.querySelectorAll('.qc-cmp2-footer button[mode="secondary"]')[0].innerHTML == "ACCEPTER LA SÉLECTION") {
                            document.querySelectorAll('.qc-cmp2-footer button[mode="secondary"]')[0].click();
                        } else if (document.querySelectorAll('.qc-cmp2-footer button[mode="secondary"]')[1].innerHTML == "ACCEPTER LA SÉLECTION") {
                            document.querySelectorAll('.qc-cmp2-footer button[mode="secondary"]')[1].click();
                        }
                    }, 100);
                }
            }, 100);
        } else if (document.getElementById('tc-privacy-wrapper') !== null) {
            if (document.getElementById('footer_tc_privacy_button_2').innerHTML == "Tout refuser") {
                // urssaf
                document.getElementById('footer_tc_privacy_button_2').click();
            } else if (document.getElementById('footer_tc_privacy_button') !== null) {
                // le routard
                document.getElementById('footer_tc_privacy_button').click();
            } else {
                // la poste
                document.getElementById('footer_tc_privacy_button_3').click();
            }
        } else if (document.getElementById('tarteaucitronRoot') !== null) {
            document.getElementsByClassName('tarteaucitronCTAButton tarteaucitronDeny')[0].click();
        } else if (document.getElementsByClassName('hide-cookie-setting-button').length != 0) {
            document.getElementsByClassName('accept-cookies-button')[0].click();
        } else if (document.getElementById('_evidon_banner') !== null) {
            document.getElementById('_evidon-decline-button').click();
        } else if (document.getElementById('cl-consent') !== null) {
            // clickio
            document.getElementsByClassName('cl-consent__btn--outline')[0].click()
            // uncheck
            document.querySelectorAll('#cl-consent [type="checkbox"]').forEach(element => {
                element.checked = false;
            });
            // save
            document.querySelector('[data-role="b_save"]').click();
        } else if (document.getElementsByClassName('cc-individual-cookie-settings').length != 0) {
            document.getElementById('cookie-settings-selected').click();
        } else if (document.getElementsByClassName('woody-cookies-toolbox').length != 0) {
            document.getElementsByClassName('woody-cookie-button customize')[0].click();
            document.querySelectorAll('[aria-label="next cookies"]').forEach(element => {
                element.click();
            });
        } else if (document.getElementById('sd-cmp') !== null) {
            // forbe
            document.getElementsByClassName('sd-cmp-336YQ')[0].click();
        } else if (document.getElementsByClassName('cc-cookies').length != 0) {
            document.querySelector('.cc-cookies [href="#decline"]').click();
        } else if (document.getElementById('cookie-law-info-bar') != null) {
            document.querySelector('#cookie-law-info-bar .cli_settings_button').click();
            document.querySelectorAll('.cli-modal-dialog [type="checkbox"]').forEach(element => {
                element.checked = false;
            });
            document.getElementById('wt-cli-privacy-save-btn').click();
            const style = document.createElement('style');
            style.innerHTML = /* css */ `
            #cookie-law-info-again {
                display: none !important;
            }
            `;
            document.head.append(style);
        } else if (document.getElementById('idBtDisabledCookie') != null) {
            document.getElementById('idBtDisabledCookie').click();
        } else if (document.getElementById('cookie-banner') != null) {
            document.querySelector('#cookie-banner .cookie-decline').click();
        } else if (document.getElementById('cookiesBar') != null) {
            // olx.ua
            document.querySelector('#cookiesBar .cookie-close').click();
        } else if (document.querySelector('[data-testid="dismiss-cookies-banner"]') != null) {
            // olx.ua
            document.querySelector('[data-testid="dismiss-cookies-banner"]').click();
        } else if (document.getElementById('cookie-notice') !== null) {
            document.getElementById('cn-refuse-cookie').click();
        } else if (document.getElementById('ez-cookie-dialog-wrapper') !== null) {
            document.getElementById('ez-settings').click();
            document.querySelectorAll('.ez-cmp-settings input[type="checkbox"]').forEach(element => {
                uncheck(element);
            });
            document.getElementById('ez-manage-settings').click();
        } else if (document.getElementsByClassName('gdpr').length !== 0) {
            // if (document.querySelector('[data-testid="GDPR-manage"]').getAttribute('href') == "https://www.nytimes.com/privacy/cookie-policy#how-do-i-manage-trackers" &&
            // document.location.href !== "https://www.nytimes.com/privacy/cookie-policy#how-do-i-manage-trackers") {
            // window.open("https://www.nytimes.com/privacy/cookie-policy#how-do-i-manage-trackers");
            document.querySelector('[data-testid="expanded-dock-btn-selector"]').click();
            // } else if (document.location.href == "https://www.nytimes.com/privacy/cookie-policy#how-do-i-manage-trackers") {
            //     document.getElementById('opt-out-of-new-york-times-nonessential-trackers').click();
            //     window.close();
            // }
        } else {
            // no popup cookie found
            cookieIsDisable = false;
        }
    } catch (error) {
        console.error(error);
    }

    if (ones) {
        clickOnePerOne(ones, typeOnes);
    }

    // if cookie have not change return false
    if (cookieIsDisable) {
        return true;
    } else {
        return false;
    }
}

function goToDisableCookies() {
    if (!disableCookies()) {
        setTimeout(() => {
            if (!disableCookies()) {
                setTimeout(() => {
                    if (!disableCookies()) {
                        setTimeout(() => {
                            if (!disableCookies()) {
                                setTimeout(() => {
                                    disableCookies();
                                }, 1000);
                            } else {
                                popupCookieIsDisable = true;
                            }
                        }, 1000);
                    } else {
                        popupCookieIsDisable = true;
                    }
                }, 1000);
            } else {
                popupCookieIsDisable = true;
            }
        }, 1000);
    } else {
        popupCookieIsDisable = true;
    }
}
/* END FUNCTION */

/* VAR */
let popupCookieIsDisable = false;
let isBlacklisted = false;
let blackList = [];
/* END VAR */

/* START */

// document.addEventListener('load', function () {
window.addEventListener('load', function () {
    // check if website is on blacklist
    chrome.storage.sync.get({ blackList: [] }, function (result) {
        blackList = result.blackList;

        if (blackList.indexOf(document.location.host) !== -1) {
            // save data for popup
            isBlacklisted = true;
            // do nothing, website is on blacklist
        } else {
            goToDisableCookies();
        }
    });
});


// Inform the background page that 
// this tab should have a page-action.
chrome.runtime.sendMessage({
    from: 'content',
    subject: 'showPageAction',
});

// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((msg, sender, response) => {
    // First, validate the message's structure.
    if ((msg.from === 'popup')) {
        var responseObj = {
            success: true
        };
        if (msg.subject === 'DOMInfo') {
            responseObj.popupCookieIsDisable = popupCookieIsDisable;

            responseObj.isBlacklisted = isBlacklisted;

        } else if (msg.subject === 'getWebsite') {
            responseObj.url = document.location.href;
        } else if (msg.subject === 'blacklist') {
            responseObj.blackList = true;
            addToBacklist();
        } else if (msg.subject === 'unblacklist') {
            responseObj.blackList = false;
            removeToBacklist();
        } else {
            responseObj = {
                success: false
            };
        }
        response(responseObj);
    }
});