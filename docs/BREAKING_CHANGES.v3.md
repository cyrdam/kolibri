# Breaking Changes for version 3

## Introduction

New major versions of KoliBri are developed with the goal of simplifying maintenance and support and promoting further development.

For more information, see the [KoliBri Maintenance and Support Strategy](https://github.com/public-ui/kolibri/blob/develop/MIGRATION.md).

## Components

### kol-abbr

- Visually, the tooltip has been replaced by a simple label shown in parentheses after the abbreviation.
- The property `_tooltipAlign` has been removed.

### kol-input-file

- The property `_value` has been removed as it never served a purpose. Use the `_files` property or `getValue()` instead to access the FileList.

## Themes

### BMF-Theme (Bundesministerium der Finanzen)

- The theme has been removed.
- It will be maintained as a separate repository.
- The maintenance is done by the [DESYBRI](https://www.itzbund.de/desybri)-Team.
- We moved our last code revision to the following repository: https://github.com/public-ui/kolibri-theme-bmf-starter
