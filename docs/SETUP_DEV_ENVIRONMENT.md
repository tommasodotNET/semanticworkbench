# Semantic Workbench Setup Guide

This document covers the common setup information for the Semantic Workbench.

# Codespaces

We recommend using [GitHub Codespaces for developing with the Semantic Workbench](../.devcontainer/README.md). This will provide a pre-configured environment with VS Code and no additional setup.

# Local Development

## Prerequisites

Recommended installers:

- macOS: [brew](https://brew.sh/)
- Windows: [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/)
- Linux: apt or your distribution's package manager

## Service Setup

The backend service for the Semantic Workbench is written in Python. Currently we require Python 3.11.

The core dependencies you need to install are: `python 3.11`, `poetry`, `make`.

Linux:

     sudo add-apt-repository ppa:deadsnakes/ppa
     sudo apt update
     sudo apt install python3.11 python3-pip python3-poetry python-is-python3
     pip install cffi

If you have other versions of python installed, make sure they are all registered with update-alternatives and ensure python 3.11 is active:

     sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 100
     sudo update-alternatives --config python3

macOS:

      brew install python@3.11
      brew install poetry
      brew install make

Windows:

      winget install Python.Python.3.11
      winget install ezwinports.make
      python -m pip install --user pipx
      python -m pipx ensurepath
      pipx install poetry

If you haven't already, enable long file paths on Windows.

- Run `regedit`.
- Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem`.
- Find the `LongPathsEnabled` key. If it doesn’t exist, right-click on the `FileSystem` key, select `New > DWORD (32-bit) Value`, and name it `LongPathsEnabled`.
- Double-click on `LongPathsEnabled`, set its value to `1`, and click OK.

### Configure and build the backend

- Within the [`v1/service`](../semantic-workbench/v1/service/) directory, create your virtual environment, and install the service packages:

      make

  If this fails in Windows, try running a vanilla instance of `cmd` or `powershell` and not within `Cmder` or another shell that may have modified the environment.

# Frontend Setup

The frontend for the Semantic Workbench is written in [Node 20](https://nodejs.org/en/download).

Linux ([latest instructions](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)):

      curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

macOS:

      brew install nvm

Windows:

      winget install CoreyButler.NVMforWindows

Once you have nvm installed:

```
nvm install 20 lts
nvm use 20
```

### Build the frontend

Within the [`v1/app`](../semantic-workbench/v1/app/) directory, install packages.

```
cd semantic-workbench/v1/app
make
```