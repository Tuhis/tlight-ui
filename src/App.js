import _ from "lodash";
import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { setMobileMenuOpen, toggleMobileMenu } from "./slices/uiSlice";
import { Sidebar } from "./components/presentational/Sidebar/Sidebar";
import './App.css';
import Topbar from './components/presentational/Topbar/Topbar';
import BigLinkList from './components/presentational/BigLinkList/BigLinkList';
import Breadcrumbs from './components/presentational/Breadcrumbs/Breadcrumbs';
import NodeCardGrid from './components/container/NodeCardGrid/NodeCardGrid';
import LightCardGrid from "./components/container/LightCardGrid/LightCardGrid";
import EffectCardGrid from "./components/container/EffectCardGrid/EffectCardGrid";
import { NARROW_DISPLAY_WIDTH } from "./constants/generic";
import { FullscreenMenu } from "./components/presentational/FullscreenMenu/FullscreenMenu";
import { Centerizer } from "./components/presentational/Centerizer/Centerizer";

function App() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // UI State from Redux
    const mobileMenuOpen = useSelector(state => state.ui.global.mobileMenuOpen);

    const breadcrumbPath = _.chain(location.pathname)
        .split("/")
        .compact()
        .map(e => _.startCase(_.toLower(e)))
        .value();

    const navigateTo = (path) => {
        navigate(path);
        // Auto-close menu on navigation (optional better UX)
        dispatch(setMobileMenuOpen(false));
    };

    const toggleMenu = (isOpen) => {
        // If specific bool passed, use it, otherwise toggle
        if (typeof isOpen === 'boolean') {
            dispatch(setMobileMenuOpen(isOpen));
        } else {
            dispatch(toggleMobileMenu());
        }
    };

    const sidebarLinks = [
        {
            text: "Nodes",
            onClick: () => navigateTo("/nodes"),
            testId: "nav-nodes"
        },
        {
            text: "Effects",
            onClick: () => navigateTo("/effects"),
            testId: "nav-effects"
        },
        {
            text: "Groups",
            onClick: () => navigateTo("/groups"),
            testId: "nav-groups"
        },
        {
            text: "Reset",
            onClick: () => {
                localStorage.clear();
                document.location.reload();
            },
            testId: "nav-reset"
        }
    ];

    const narrowViewport = !window.matchMedia(`(min-width: ${NARROW_DISPLAY_WIDTH}px)`).matches;

    return (
        <div className="App">

            {!narrowViewport &&
                <Sidebar>
                    <BigLinkList
                        links={sidebarLinks}
                        rotateTextsOnNarrowList />
                </Sidebar>
            }

            <div className={"content"}>
                <Topbar>
                    {narrowViewport &&
                        <Centerizer vertical>
                            <FullscreenMenu
                                open={mobileMenuOpen}
                                onToggle={toggleMenu}>
                                <BigLinkList links={sidebarLinks} />
                            </FullscreenMenu>
                        </Centerizer>
                    }
                    <Breadcrumbs path={breadcrumbPath} />
                </Topbar>

                <Routes>
                    <Route path="/nodes" element={<NodeCardGrid />} />
                    <Route path="/effects" element={<EffectCardGrid />} />
                    <Route path="/groups" element={<div>Groups - Coming Soon</div>} />
                    <Route path="/nodes/:nodeId/lights" element={<LightCardGrid />} />
                    <Route path="/" element={<Navigate to="/nodes" replace />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
