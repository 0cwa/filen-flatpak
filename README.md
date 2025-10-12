# Filen Flatpak

[Filen](https://filen.io) as Flatpak! Isn't that cool? Lowering the dependance on AppImages everyday.

It's still technically AppImage but it was repackaged as Flatpak for immutable and atomic system users out there (like me). Hugely based on [Vesktop Flathub repo](https://github.com/flathub/dev.vencord.Vesktop).

## Wayland

Filen will run through X11 / XWayland by default, as this is the most compatible option.
Everything should work out of the box, including screen sharing and hardware acceleration.

If you wish to run it natively on Wayland instead, you can do so by removing the `--socket=x11` permission with [Flatseal](https://flathub.org/apps/com.github.tchx84.Flatseal) or by running the following command:

```sh
flatpak override --nosocket=x11 io.filen.Filen
```

## Tray icons

To get a working Tray Icon on GNOME, install the [appindicator-support](https://extensions.gnome.org/extension/615/appindicator-support/) extension.
