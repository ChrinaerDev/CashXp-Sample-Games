Place your own MP3 recordings here. No sounds are generated or downloaded.

- jump.mp3: one short jump cue
- collect.mp3: one short crystal collection cue
- hit.mp3: one short collision cue
- game-over.mp3: an ending cue, ideally under 1.5 seconds
- music.mp3: a seamless background loop

All files are optional. The runner loads these exact filenames through the CashXP asset API. The build includes whichever files exist. Rebuild with `npm run build:runner` from cashxp-admin after adding files; no source changes are required. The final ZIP must remain under 16 MB.

Music pauses with the game and stops on exit. Mobile browsers may wait for the first tap or keypress before allowing audio.

For your published edited runner, run `npm run build:runner-sounds` from cashxp-admin. This reads `sky-runner-reference-2` from the running backend and preserves its current images, localized content and settings. It produces `3d-runner/dist/sky-runner-reference-2-sounds-in.zip`. All five recordings are required by this command. Override CASHXP_GAME_API or CASHXP_RUNNER_ID if the backend address or original game ID changes.

Upload it as a new game, or use See through → Update ZIP on the existing game. Update ZIP preserves the target game's ID, stages the replacement, and bumps its version. Test and publish to apply it.
