import React, { Component } from "react";

// import { Toaster } from "react-hot-toast";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import { init } from "./constants.js";
import {
  setThemeName,
  getThemeName,
  getThemeLuminance,
  setThemeLuminance,
  isDark,
  getTheme,
  getSelectedPalette,
  getColorBackground,
} from "../rules/manager/index.js";
import { initThemeCamaleon } from "../rules/loader.jsx";
import { CursorLight } from "./Fx/index.js";
import { burnBGFluid } from "./Fx/back-texture.jsx";
import { JS2CSS } from "../../fluidCSS/JS2CSS/index.js";
import { fluidCSS } from "../../fluidCSS/index.js";
import {
  assignedPath,
} from "../router.jsx";
import { PromptDialog } from "./PromptDialog.jsx";
import { NotifierBox } from "./Notifier.jsx";

initThemeCamaleon();
init();

const themeSwitch_listener = [];

export function addThemeSwitchListener(fn) {
  themeSwitch_listener.push(fn);
}

export function removeThemeSwitchListener(fn) {
  if (typeof fn != "number") {
    fn = themeSwitch_listener.indexOf(fn);
  }
  if (fn > -1) {
    themeSwitch_listener.splice(fn, 1);
  }
}

export class Notifier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleThemeSwitch = () => {
      this.setState({ theme: getSelectedPalette() });
    };
  }

  componentDidMount() {
    addThemeSwitchListener(this.handleThemeSwitch);
  }

  componentWillUnmount() {
    removeThemeSwitchListener(this.handleThemeSwitch);
  }

  render() {
    const { children } = this.props;
    const { theme = {} } = this.state;
    const { palette } = theme;

    return (
      <ThemeProvider theme={getTheme()}>
        <CssBaseline />
        <div className="theme-provider-notifier">
          {children}
          <NotifierBox position="bottom-right" />
          {/* <ToasterPart theme={theme} palette={palette} /> */}
          <PromptDialog />
        </div>
      </ThemeProvider>
    );
  }
}

function ToasterPart({ theme, palette }) {
  return (<></>
    /* <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          borderRadius: "5px",
          background: getColorBackground(theme),
          color: (() => {
            let cursor = palette;
            if (cursor) {
              if (cursor.text) {
                cursor = cursor.text;
                if (cursor.primary) {
                  return cursor.primary;
                }
              }
            }
          })(),
          border:
            "1px solid " +
            global.nullish(
              (() => {
                let cursor = palette;
                if (cursor) {
                  if (cursor.divider) {
                    return cursor.divider;
                  }
                }
              })(),
              "gray"
            ),
          boxShadow: "5px 5px 5px 0px rgba(0, 0, 0, 0.1)",
          animation: "fadeIn 1s ease, fadeOut 0.3s ease 9.7s forwards",
        },
      }}
    /> */
  );
}

export class AppThemeProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme_name: getThemeName(),
      theme_luminance: getThemeLuminance(),
    };
  }

  syncTheme() {
    const { theme_name, theme_luminance } = this.state;
    if (theme_name !== getThemeName()) {
      setThemeName(theme_name);
    }
    if (theme_luminance !== getThemeLuminance()) {
      setThemeLuminance(theme_luminance);
    }
    themeSwitch_listener.forEach((fn) => fn(theme_name, theme_luminance));
  }

  componentDidMount() {
    this.syncTheme();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.theme_name !== this.state.theme_name ||
      prevState.theme_luminance !== this.state.theme_luminance
    ) {
      this.syncTheme();
    }
  }

  render() {
    const { children, urlShader, bgtype, h_init, h_fin, Footer, Header } =
      this.props;
    const { theme_name, theme_luminance } = this.state;

    JS2CSS.insertStyle({
      id: "app-theme",
      body: {
        background: getSelectedPalette().palette.background.default,
      },
      ...(() => {
        const retorno = {};
        const rule = [];
        for (let i = 0; i < 6; i++) {
          rule.push(`h${i + 1}`);
        }
        ["SvgIcon", "Typography"].forEach((item) => {
          rule.push(".Mui" + item + "-root");
        });
        retorno[rule.join(", ")] = {
          filter: `saturate(1.3)`,
        };
        return retorno;
      })(),
    });

    return (
      <Notifier>
        <FirstPart
          bgtype={bgtype}
          h_init={h_init}
          h_fin={h_fin}
          theme_name={theme_name}
          theme_luminance={theme_luminance}
          Header={Header}
        >
          {children}
        </FirstPart>
        <Footer
          updateThemeName={(name) => this.setState({ theme_name: name })}
        />
        <CursorLight />
      </Notifier>
    );
  }
}

function FirstPart({
  bgtype,
  h_init,
  h_fin,
  theme_name,
  theme_luminance,
  updateThemeLuminance,
  Header,
  children,
}) {
  return (
    <div className="p-relative">
      <div
        className={burnBGFluid({
          bgtype,
          theme_name,
          theme_luminance,
        }).end("expand", "back-texture", "z-index-1")}
      />
      <div className="min-h-80vh">
        <Header updateTheme={updateThemeLuminance} />
        {h_init && <div style={{ minHeight: h_init }} />}
        {children}
        {h_fin && <div style={{ minHeight: h_fin }} />}
      </div>
    </div>
  );
}
