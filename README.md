# Filen Flatpak

[Filen](https://filen.io) as Flatpak! Isn't that cool? Lowering the dependance on AppImages everyday.

It's still technically AppImage but it was repackaged as Flatpak for immutable and atomic system users out there (like me). Hugely based on [Vesktop Flathub repo](https://github.com/flathub/dev.vencord.Vesktop).

## Wayland

Filen runs natively on Wayland when launched from a Wayland session. X11 is still
available as a fallback on non-Wayland sessions through Flatpak's `fallback-x11`
socket.

## Tray icons

Tray icons work on KDE - To get a working Tray Icon on GNOME, install the [appindicator-support](https://extensions.gnome.org/extension/615/appindicator-support/) extension.
