// ==UserScript==
// @name         Aquarius Chain Watchers
// @version      1.0
// @description  Displays who's currently watching the chain with easy status edit using notion database board view
// @author       You
// @match        https://www.torn.com/*
// @match        https://www.notion.so/xeidamoka/27e99a61d7934bf0a000c216f4929bfb?v=9dff1754141e45b6b06036d75935b7f4
// @homepageURL   https://https://xeidamoka.com/AquariusChainWatchers
// @homepageURL   https://github.com/XeiDaMoKa/Xei-Torn-Aquarius-Scripts/blob/Xei/AquariusChainWatchers.user.js
// @downloadURL   https://github.com/XeiDaMoKa/Xei-Torn-Aquarius-Scripts/raw/Xei/AquariusChainWatchers.user.js
// @updateURL     https://github.com/XeiDaMoKa/Xei-Torn-Aquarius-Scripts/raw/Xei/AquariusChainWatchers.user.js
// @supportURL    https://github.com/XeiDaMoKa/Xei-Torn-Aquarius-Scripts/issues
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant          GM_addStyle
// ==/UserScript==

/* global $ */

(function() {
    'use strict';

// Hides everything in notion page except board view
    function hideSidebarContainer() {
        $('.notion-sidebar-container, .notion-topbar').hide();
        $('.notion-scroller.vertical.horizontal > div:nth-child(2) > div').hide();
        $('[contenteditable="false"][data-content-editable-void="true"][style="min-height: 40px; padding-left: 96px; padding-right: 96px; flex-shrink: 0; position: sticky; z-index: 86; left: 0px;"]').hide();
        $('header > div > div').hide();
    }

// Hides everything in notion page except board view
    function modifyFrameStyles() {
        GM_addStyle('.notion-frame { ' +
                    'display: block !important; ' +
                    'width: auto !important; ' +
                    '} ' +
                    '.notion-board-view { ' +
                    'margin-left: auto !important; ' +
                    '} ' +
                    '.notion-help-button { ' +
                    'display: none !important; ' +
                    '}');
    }

// Opens floating window
    function openFloatingWindow(url, width, height) {
        const cleanUrl = url.replace(/[#?&]sepwin=[^&#]+/, '');
        const left = window.screenX + window.outerWidth * 0.98 - width; // 95% from the right
        const top = window.screenY + (window.outerHeight - height) / 5; // 1/4 from the top
        const features = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}, alwaysOnTop=yes`;
        const newWindow = window.open(cleanUrl, "_blank", features);
    }

// Adds icon svg to faction chat header
    function addEyeIconToFactionChat() {
        const factionChatHeader = $(".chat-box-header___P15jw:contains('Faction')");
        if (factionChatHeader.length > 0 && $('#chainHelperIcon').length === 0) {
            const eyeSvgHtml = `
                <svg id="chainHelperIcon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye rotating" style="cursor: pointer; margin-right: -295px;">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            `;
            factionChatHeader.find('.chat-box-header__actions___XuOq2').before(eyeSvgHtml);

// Hanldes click on icon
            $('#chainHelperIcon').on('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                openFloatingWindow("https://www.notion.so/xeidamoka/27e99a61d7934bf0a000c216f4929bfb?v=9dff1754141e45b6b06036d75935b7f4", 392, 250);
            });
        }
    }

// Observes chat to keep icon dynamic
    function observeChatChanges() {
        const chatArea = document.querySelector('body');
        if (!chatArea) return;
        const config = { childList: true, subtree: true };
        const observer = new MutationObserver(() => {
            addEyeIconToFactionChat();
            hideSidebarContainer();
        });
        observer.observe(chatArea, config);
    }

// Auto click the notion warniing that anyone can edit this board view
function clickContinueButton() {
    const continueButton = $('div[role="dialog"] div[role="button"]:contains("Continue")');
    if (continueButton.length > 0) {
        continueButton.click();
    } else {
        // Retry after 100 milliseconds
        setTimeout(clickContinueButton, 10);
    }
}

    // Call necessary functions
    observeChatChanges();
    addEyeIconToFactionChat();
    modifyFrameStyles();
    clickContinueButton();
})();
