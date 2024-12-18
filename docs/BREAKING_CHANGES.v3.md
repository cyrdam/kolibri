# Breaking Changes for version 3

## Introduction

New major versions of KoliBri are developed with the goal of simplifying maintenance and support and promoting further development.

For more information, see the [KoliBri Maintenance and Support Strategy](https://github.com/public-ui/kolibri/blob/develop/MIGRATION.md).

## Removed Components

The following components have been removed:

- kol-button-group
- kol-indented-text
- kol-link-group
- kol-logo
- kol-table

## Changed Components

### kol-abbr

- Visually, the tooltip has been replaced by a simple label shown in parentheses after the abbreviation.
- The property `_tooltipAlign` has been removed.

## All Input Components

- The property `_alert` has been removed. It's not being handled automatically based on `_msg` and the touched state. See #6138.
- The property `_error` has been removed. Use `_msg_` instead.

## `focus`-methods

The public `focus`-methods have been removed from all components. Use `kolFocus` instead.

## Themes

### BMF-Theme (Bundesministerium der Finanzen)

- The theme has been removed.
- It will be maintained as a separate repository.
- The maintenance is done by the [DESYBRI](https://www.itzbund.de/desybri)-Team.
- We moved our last code revision to the following repository: https://github.com/public-ui/kolibri-theme-bmf-starter
