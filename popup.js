function checkBlackList(value) {
    if (typeof value === 'object' && value !== null) {
        value = value.blackList;
    }
    if (value === true) {
        document.querySelector('#blacklistInput').classList.add('inBlacklist');
        document.querySelector('#blacklistInput').classList.remove('notInBlacklist');
    } else if (value === false) {
        document.querySelector('#blacklistInput').classList.add('notInBlacklist');
        document.querySelector('#blacklistInput').classList.remove('inBlacklist');
    }
}

const cookieOrNotCookie = data => {
    if (data.popupCookieIsDisable === true) {
        document.getElementById('cookieIsDisable').innerHTML = chrome.i18n.getMessage("cookiesPopupHasBeenClosed");
    } else {
        document.getElementById('cookieIsDisable').innerHTML = chrome.i18n.getMessage("noCookiesPopupWasFound");
    }

    // check blacklist
    if (data.isBlacklisted === true) {
        checkBlackList(true);
    } else {
        checkBlackList(false);
    }
};

const reportWebsite = data => {
    let width = document.getElementById('reportWebsite').offsetWidth;
    document.getElementById('reportWebsite').innerHTML = '<div class="loader"><span></span><span></span><span></span></div>';
    document.getElementById('reportWebsite').className = 'load';
    document.getElementById('reportWebsite').disabled = true;
    document.getElementById('reportWebsite').style.minWidth = width + 'px';
    // send to hugolevet.fr data.url;
    fetch('https://bazar.hugolevet.fr/disablecookies/json/reportWebsite.php?url=' + encodeURIComponent(data.url))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // update button
            if (data.success === true) {
                document.getElementById('reportWebsite').innerHTML = chrome.i18n.getMessage("sent");
                document.getElementById('reportWebsite').className = 'sent';
                document.getElementById('reportWebsite').disabled = true;
            } else {
                document.getElementById('reportWebsite').innerHTML = chrome.i18n.getMessage("errorOccured");
                document.getElementById('reportWebsite').className = 'error';
                document.getElementById('reportWebsite').disabled = false;
            }
        });
};

function localizeHtmlPage() {
    //Localize by replacing __MSG_***__ meta tags
    var objects = document.getElementsByTagName('html');
    for (var j = 0; j < objects.length; j++) {
        // change lang tag in html
        objects[j].setAttribute('lang', chrome.i18n.getMessage('@@ui_locale'));

        // change other
        var obj = objects[j];

        var valStrH = obj.innerHTML.toString();
        var valNewH = valStrH.replace(/__MSG_(@{0,2}\w+)__/g, function (match, v1) {
            return v1 ? chrome.i18n.getMessage(v1) : "";
        });

        if (valNewH != valStrH) {
            obj.innerHTML = valNewH;
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // translate HTML page
    localizeHtmlPage();

    // get DOM info
    // get if cookie popup have been disable
    // get if is blacklisted
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { from: 'popup', subject: 'DOMInfo' }, cookieOrNotCookie);
    });

    // bind report website button
    document.getElementById('reportWebsite').addEventListener('click', () => {
        if (document.getElementById('reportWebsite').disabled === false) {
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, tabs => {
                chrome.tabs.sendMessage(tabs[0].id, { from: 'popup', subject: 'getWebsite' }, reportWebsite);
            });
        }
    });

    // bind blacklist button
    document.getElementById('blacklistInput').addEventListener('click', () => {
        if (document.getElementById('blacklistInput').classList.contains('notInBlacklist')) {
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, tabs => {
                chrome.tabs.sendMessage(tabs[0].id, { from: 'popup', subject: 'blacklist' }, checkBlackList);
            });
        } else {
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, tabs => {
                chrome.tabs.sendMessage(tabs[0].id, { from: 'popup', subject: 'unblacklist' }, checkBlackList);
            });
        }
    });
});