import { StatusBar, Style } from "@capacitor/status-bar";

export const setStatusBarStyleDark = async () => {
  await StatusBar.setStyle({
    style: Style.Dark,
  });
};

export const hideStatusBar = async () => {
  await StatusBar.hide();
};

export const showStatusBar = async () => {
  await StatusBar.show();
};