#!/bin/bash
electron-packager . Extractor --platform=win32 --arch=x64 --version=0.36.0 --app-version=0.1 --build-version=0.1.0 --name="Extractor" --version-string.CompanyName="" --version-string.LegalCopyright="" --version-string.OriginalFilename="extractor.exe" --version-string.ProductName="Extractor" --version-string.FileDescription="A small, cross-plattform, personal assistant on your fingertips."
