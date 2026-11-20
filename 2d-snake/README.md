# Snake reference game

From the parent examples directory, run `npm ci` and `npm run build:snake`. In Game Publishing, choose **Create game** and upload `2d-snake/dist/snake-reference.zip`. Publish and select **Start run** on the inspector. Use arrow keys or swipe to steer. With wrapping disabled, letting the snake hit a wall sends the final score to the Received console.

`game.js` contains the readable game module. `content.js` contains the manifest and both languages. The build writes the PNG art, minifies the browser module, and creates the upload ZIP. The reference exercises the admin test contract and is suitable for practice. A production verifier is a separate deliverable for cash competition.
