build:
    flatpak-builder --force-clean --install-deps-from=flathub --repo=repo builddir io.filen.Filen.yml

build-bundle:
    flatpak build-bundle repo filen.flatpak io.filen.Filen --runtime-repo=https://flathub.org/repo/flathub.flatpakrepo
