import type { BrowserAccess } from "../services/browser-access";
import { MozURI } from "./uri";

declare module "*.ftl";

declare global {
    interface Document {
        createXULElement: (
            element: string
        ) => HTMLElement;
    }

    interface Window {
        docShell: any;
        XULBrowserWindow: any;
        windowState: number;
        STATE_MAXIMIZED: number;
        STATE_MINIMIZED: number;
        STATE_NORMAL: number;
        STATE_FULLSCREEN: number;
        content: any;
        openDialog: any;
        windowRoot: {
            ownerGlobal: Window;
        };
        windowUtils: any;
        dot: Dot;
        isChromeWindow: boolean;
        skipNextCanClose: boolean;
        Components: any;
        BROWSER_NEW_TAB_URL: string;
        arguments: any;
        isBlankPageURL: any;
        browserDOMWindow: BrowserAccess;
        gFissionBrowser: boolean;
        RTL_UI: boolean;
        isFullyOccluded: boolean;
        Cr: any;
    }

    interface HTMLElement {
        hidePopup: any;
    }

    interface HTMLBrowserElement extends HTMLElement {
        onPageHide: () => any
        resetFields: () => any
        connectedCallback: () => any
        disconnectedCallback: () => any
        autoscrollEnabled: boolean
        canGoBack: any
        canGoForward: any
        currentURI: MozURI
        documentURI: MozURI
        documentContentType: string
        loadContext: object
        autoCompletePopup: object
        dateTimePicker: object
        popupAnchor: object
        suspendMediaWhenInactive: boolean
        docShellIsActive: boolean
        renderLayers: boolean
        hasLayers: boolean
        isRemoteBrowser: boolean
        remoteType: object
        isCrashed: boolean
        messageManager: object
        webBrowserFind: object
        finder: object
        fastFind: object
        outerWindowID: number
        innerWindowID: number
        browsingContext: object
        webNavigation: object
        webProgress: any
        sessionHistory: object
        contentTitle: string
        forceEncodingDetection: () => any
        characterSet: string
        mayEnableCharacterEncodingMenu: boolean
        contentPrincipal: any
        contentPartitionedPrincipal: object
        cookieJarSettings: object
        csp: object
        contentRequestContextID: number
        referrerInfo: object
        fullZoom: number
        textZoom: number
        enterResponsiveMode: () => any
        leaveResponsiveMode: () => any
        isSyntheticDocument: boolean
        hasContentOpener: boolean
        mStrBundle: object
        audioMuted: boolean
        shouldHandleUnselectedTabHover: boolean
        securityUI: object
        userTypedValue: object
        dontPromptAndDontUnload: number
        dontPromptAndUnload: number
        _wrapURIChangeCall: () => any
        goBack: () => any
        goForward: () => any
        reload: () => any
        reloadWithFlags: () => any
        stop: () => any
        loadURI: (url: MozURI, params?: any) => any
        gotoIndex: () => any
        preserveLayers: () => any
        deprioritize: () => any
        getTabBrowser: () => any
        addProgressListener: (...params: any) => any
        removeProgressListener: () => any
        audioPlaybackStarted: () => any
        audioPlaybackStopped: () => any
        activeMediaBlockStarted: () => any
        activeMediaBlockStopped: () => any
        mute: () => any
        unmute: () => any
        resumeMedia: () => any
        unselectedTabHover: () => any
        didStartLoadSinceLastUserTyping: () => any
        construct: () => any
        destroy: () => any
        updateForStateChange: () => any
        updateWebNavigationForLocationChange: () => any
        updateForLocationChange: () => any
        purgeSessionHistory: () => any
        createAboutBlankContentViewer: () => any
        stopScroll: () => any
        _getAndMaybeCreateAutoScrollPopup: () => any
        startScroll: () => any
        cancelScroll: () => any
        handleEvent: () => any
        closeBrowser: () => any
        swapBrowsers: () => any
        swapDocShells: () => any
        getInPermitUnload: () => any
        asyncPermitUnload: () => any
        hasBeforeUnload: boolean
        permitUnload: () => any
        drawSnapshot: () => any
        dropLinks: () => any
        getContentBlockingLog: () => any
        getContentBlockingEvents: () => any
        sendMessageToActor: () => any
        enterModalState: () => any
        leaveModalState: () => any
        maybeLeaveModalState: () => any
        getDevicePermissionOrigins: () => any
        processSwitchBehavior: number
        prepareToChangeRemoteness: () => any
        afterChangeRemoteness: () => any
        beforeChangeRemoteness: () => any
        finishChangeRemoteness: () => any
        QueryInterface: () => any
        getCustomInterfaceCallback: () => any
        attributeChangedCallback: () => any
        initializeAttributeInheritance: () => any
        inheritAttribute: () => any
        getElementForAttrInheritance: () => any
        delayConnectedCallback: () => any
        isConnectedAndReady: boolean
        docShell: any
        contentWindow: object
        contentDocument: object
        browserId: number
        openWindowInfo: object
        swapFrameLoaders: () => any
        changeRemoteness: (...params: any) => any
        frameLoader: object
        doCommand: () => any
        hasMenu: () => any
        openMenu: () => any
        flex: string
        collapsed: boolean
        observes: string
        menu: string
        contextMenu: string
        tooltip: string
        width: string
        height: string
        minWidth: string
        minHeight: string
        maxWidth: string
        maxHeight: string
        screenX: number
        screenY: number
        tooltipText: string
        src: string
        controllers: object    
    }
}