# Changelog

All notable changes to this project will be documented in this file.

## Guidelines

### Format

To make changes to this file, please keep the following format:

```
## [x.y.z] - yyyy-mm-dd
### Added
-

### Changed
-

### Removed
-

### Fixed
-
```

If there is nothing added please add the following text under that section:

```
No new features were added.
```

If there is nothing changed please add the following text under that section:

```
No changes were made.
```

If there is nothing removed please add the following text under that section:

```
Nothing was removed.
```

If there is nothing fixed please add the following text under that section:

```
No fixes were made.
```

### Insertion

Each time you add new changes to this file, please add them bellow this line - i.e. between the [insertion](#insterion) section and the last version added.

## [1.1.0] - 2022-04-04

### Added

- Added `errorHandler` prop for the client: this will be called now, instead of `console.error` and `throw` of the errors

### Changed

- Changed the way errors are handled: no error is consoled or thrown anymore, they are sent through the `errorHandler` prop so that the user/client can catch them and action accordingly

### Removed

- `const errorMessage = ...`
- `console.error(errorMessage);`
- `throw errorMessage;`

### Fixed

No fixes were made.

## [1.0.0] - 2022-03-28

### Added

- Initial code for Vatis Tech browser JavaScript client of Vatis Tech ASR services

### Changed

No changes were made.

### Removed

Nothing was removed.

### Fixed

No fixes were made.
