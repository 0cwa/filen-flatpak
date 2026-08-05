# Filen Flatpak

[Filen](https://filen.io) as Flatpak! Isn't that cool? Lowering the dependance on AppImages everyday.

It's still technically AppImage but it was repackaged as Flatpak for immutable and atomic system users out there (like me). Hugely based on [Vesktop Flathub repo](https://github.com/flathub/dev.vencord.Vesktop).

## Wayland

Filen runs natively on Wayland when launched from a Wayland session. X11 is still
available as a fallback on non-Wayland sessions through Flatpak's `fallback-x11`
socket.

## Tray icons

Tray icons work on KDE - To get a working Tray Icon on GNOME, install the [appindicator-support](https://extensions.gnome.org/extension/615/appindicator-support/) extension.

## Installation and automatic updates

This repository publishes a signed Flatpak repository at:

<https://0cwa.github.io/filen-flatpak/>

Add the remote and install Filen with:

```sh
flatpak remote-add --user --if-not-exists filen https://0cwa.github.io/filen-flatpak/filen.flatpakrepo
flatpak install --user filen io.filen.Filen
```

After installation, normal Flatpak updates discover new Filen releases from the
same remote:

```sh
flatpak update --user io.filen.Filen
```

The repository contains both `x86_64` and `aarch64` application refs. Flatpak
selects the matching ref for the client architecture, so the same remote and
application ID work on both supported architectures. The standalone
`filen.flatpakref` file is also available from the Pages site for clients that
support one-click Flatpak references.

## Repository publishing setup

The Pages workflow builds the two architectures natively, then a separate
trusted job imports the repository signing key, merges the unsigned build
repositories, signs the application commits and repository summary, and
deploys the result to GitHub Pages. It runs on pushes to `main` and can also be
started with `workflow_dispatch`; this lets the existing manifest updater's
`main` commit publish automatically while retaining a manual recovery path.

Before enabling it for a fork or a fresh repository:

1. Create a dedicated GPG key for this Flatpak repository and back up the
   private key securely. Existing clients trust the public key embedded in the
   `.flatpakrepo` and `.flatpakref` files; rotating it casually can make those
   clients reject future updates. Plan key rotation as a migration with the old
   key still available.
2. Add repository secrets named `FLATPAK_GPG_PRIVATE_KEY` (ASCII-armored private
   key) and `FLATPAK_GPG_KEY_ID` (the signing key ID or fingerprint).
3. Add a `GH_TOKEN` repository secret for the existing updater workflow. It must
   be able to push commits and tags so those pushes trigger the CI, release, and
   Pages workflows; pushes made with the default `github.token` do not trigger
   downstream workflows.
4. Add the repository variable `PUBLISH_FLATPAK_REPO` with the value `true` to
   enable automatic publication from `main`. Manual dispatches remain available
   for setup and recovery even when the variable is absent.
5. Optionally add the repository variable `FLATPAK_REPO_URL` when using a custom
   domain. Its value should be the Pages site root without the trailing slash;
   the workflow appends `/repo/` when generating metadata. Without it, the URL
   is derived from the repository owner and name.
6. In repository Settings → Pages, set the source to **GitHub Actions**. A
   branch/folder Pages source will not deploy this workflow's artifact.

The workflow keeps a disposable Actions cache of the final OSTree repository so
successive releases can retain history and produce deltas. A cache miss is
safe: the next run creates a valid repository from the two current architecture
builds.
