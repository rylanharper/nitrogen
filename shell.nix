{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
    buildInputs = with pkgs; [
        git
        nodejs_22
        nodejs_22.pkgs.pnpm
    ];

    NODE_ENV="development";
}
