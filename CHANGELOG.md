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

## [2.0.9] - 2024-01-25

### Added

- `onDownloadRecording` method function that downloads the recoreded microphone as `audio/webm`
- `getRecordingAsBlobChunks` method function that returns all the recoreded microphone chunks as an array of blob

### Changed

No changes were made.

### Removed

Nothing was removed.

### Fixed

No fixes were made.

## [1.4.0] - 2022-06-13

### Added

- Add close package when disconnecting from the ASR Service

### Changed

No changes were made.

### Removed

Nothing was removed.

### Fixed

- Solve error when receiving `429` status code

## [1.3.0] - 2022-05-03

### Added

No new features were added.

### Changed

- Right now, instead of sending one message and waiting for its full response, you can send up to `waitingAfterMessages` before waiting for full responses

### Removed

Nothing was removed.

### Fixed

No fixes were made.

## [1.2.0] - 2022-04-11

### Added

No new features were added.

### Changed

No changes were made.

### Removed

Nothing was removed.

### Fixed

- Fix error for `this.logger` when calling the `onError` function inside `ApiKeyGenerator` and `InstanceReservation`

## [1.1.1] - 2022-04-06

### Added

No new features were added.

### Changed

No changes were made.

### Removed

Nothing was removed.

### Fixed

- Fix error for `this.logger` when calling the `onError` function inside `ApiKeyGenerator` and `InstanceReservation`

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
