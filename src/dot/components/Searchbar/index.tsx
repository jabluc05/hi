import React from "react";
import { dot } from "../../api";
import { Services } from "../../modules";
import { MozURI } from "../../types/uri";

interface State {
    // 0: normal
    // 1: hovered
    // 2: focused
    mouseState: 0 | 1 | 2;
    isEmpty: boolean;
}

interface Props {
    tabId: number
}

interface SearchbarPart {
    semihide: boolean;
    content: string;
}

export class Searchbar extends React.Component<Props> {
    public state: State = {
        mouseState: 0,
        isEmpty: true,
    }

    public get tab() {
        return dot.tabs.get(this.props.tabId);
    }

    // These are schemes that end in :// instead of :
    public knownLocatorSchemes = [
        "http",
        "https",
        "ws",
        "wss",
        "file",
        "ftp",
        "moz-extension",
        "chrome",
        "resource",
        "moz",
        "moz-icon",
        "moz-gio"
    ]

    public isHttp(scheme: string) {
        return scheme == "http" || scheme == "https";
    }

    public useHackyDomain(host: string) {
        const splitHost = host.split("/");
        const domain = splitHost[splitHost.length - 2];
        const tld = splitHost[splitHost.length - 1];

        return `${domain}.${tld}`;
    }

    public constructor(props: Props) {
        super(props);

        this.tab?.addEventListener(
            "location-change",
            this.onLocationChange.bind(this)
        );
    }

    public onLocationChange(
        webProgress: any,
        request: any,
        location: MozURI,
        flags: number
    ) {
        const {
            scheme,
            host,
            filePath,
            query,
            ref // aka hash
        } = location;

        let protocol: Partial<SearchbarPart> = {};
        let subdomain: Partial<SearchbarPart> = {};
        let hostname: Partial<SearchbarPart> = {};
        let path: Partial<SearchbarPart> = {};
        let queryParams: Partial<SearchbarPart> = {};
        let hash: Partial<SearchbarPart> = {};

        // Locator schemes are schemes which end with ://
        // Examples of these are http, https, moz-extension and chrome
        if (this.knownLocatorSchemes.includes(scheme)) {
            protocol.content = `${scheme}://`
            protocol.semihide = true;

            // Only http schemes should have their hosts resolved
            if (this.isHttp(scheme)) {
                // Try to resolve the base domain of the host
                try {
                    const domainName = Services.eTLD.getBaseDomainFromHost(host);

                    // The subdomain is the host without the domain name
                    // Example: example.mysite.com
                    // The domain name is "mysite.com"
                    // So to get the subdomain we just split the host at "mysite.com"
                    // Leaving us with "example." as the subdomain
                    subdomain.content = host.split(domainName)[0];
                    hostname.content = domainName;
                } catch (e) {
                    // That didn't work so let's just use our hacky domain thing
                    hostname.content = this.useHackyDomain(host);
                }

                // We do this so it is clear what is the URL
                // For example paypal-com.fakebank.com is quite misleading
                // So we decrease the opacity of "paypal-com."
                // And make sure "fakebank.com" is fully visible and readable
                subdomain.semihide = true;
                hostname.semihide = false;
            } else {
                // We're probably using a scheme like chrome:// or resource://
                // chrome://dot/content/browser.html
                //         [dot] is the host
                //            [/content/browser.html] is the path
                hostname.content = host;
            }

            // filePath excludes query and hash as we handle that later
            path.content = filePath;
            path.semihide = true;
        } else {
            protocol.content = `${scheme}:`
            protocol.semihide = false;

            hostname.content = filePath;
            hostname.semihide = false;

            // We can skip the path for non locator schemes
            // We will need to have the query and hash though
        }

        // All scheme types have query and hash
        queryParams.content = query ? `?${query}` : undefined;
        hash.content = ref ? `#${ref}` : undefined;

        queryParams.semihide = true;
        hash.semihide = true;
    }

    public render() {
        return (
            <div id={"urlbar"}>
                <div
                    id={"urlbar-background"}
                    data-hovered={this.state.mouseState == 1}
                    data-focused={this.state.mouseState == 2}
                ></div>

                <div id={"urlbar-input-container"}>
                    <div id={"identity-box"}>
                        <Identity type={
                            "search"
                        } />
                    </div>

                    <div
                        id={"urlbar-input"}
                        onMouseOver={() => setSearchBarHovered(true)}
                        onMouseLeave={() => setSearchBarHovered(false)}
                    >
                        <div
                            id={"urlbar-input-url"}
                            style={{
                                opacity: searchBarFocused
                                    ? 0
                                    : 1
                            }}
                        >
                            <span
                                className={"scheme"}
                                data-hide-protocol={
                                    searchBarMockVisible &&
                                    !searchBarHovered
                                }
                            >
                                { }
                            </span>
                            <span className={"host"}></span>
                            <span className={"domain"}></span>
                            <span className={"path"}></span>
                            <span className={"query"}></span>
                            <span className={"hash"}></span>
                        </div>
                        <input
                            id={"urlbar-input-box"}
                            placeholder={"Search using DuckDuckGo or enter address"}
                            style={{
                                opacity: searchBarFocused
                                    ? 1
                                    : 0
                            }}
                        ></input>
                    </div>

                    {/* <div id={"page-action-buttons"}>
                    <SearchbarButton
                        id={"star-button-box"}
                        icon={tabs.getTabById(tabs.selectedId)?.bookmarked
                            ? "chrome://dot/content/skin/icons/bookmark-filled.svg"
                            : "chrome://dot/content/skin/icons/actions/new-bookmark.svg"
                        }
                        command={"Browser:Bookmark"}
                        className={tabs.getTabById(tabs.selectedId)?.bookmarked ? "starred" : ""}
                    />

                    <SearchbarButton
                        id={"more-button-box"}
                        icon={"chrome://dot/content/skin/icons/more.svg"}
                    />
                </div> */}
                </div>

                {/* <div
                id="urlbar-popout"
                data-open={urlbarPopupVisible && !!searchBarValue.length}
                style={({
                    "--urlbar-popup-height": `${urlbarPopupHeight + 8}px`
                } as any)}
            >
                <div className={"urlbar-popout-container"} ref={urlbarPopupContainerRef}>
                    {suggestions?.map(suggestion => (
                        <SearchbarResult
                            {...suggestion}
                            key={suggestion.id}
                            active={false}
                        />
                    ))}
                </div>
            </div> */}
            </div>
        )
    }
}