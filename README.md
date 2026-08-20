# shotplot

A tool used to obtain spacial coordinates based on an ice hockey rink.

## What is shotplot?

This is a project based on an off-hand remark from [Alyssa Longmuir](https://twitter.com/alyssastweeting) on [Episode 24](https://soundcloud.com/user-55198424/top-shelf-episode-24-angry-little-boulders#t=42:45) of the Top Shelf podcast. She works with statistics for women's hockey and wanted a tool that would give her the ability to map shots to coordinates on the ice. This is that tool.

## Ideas and Bugs

If you have any ideas on how to improve shotplot, or notice any bugs, feel free to [submit an issue](https://github.com/andrewpucci/shotplot/issues) on GitHub and I'll try to get to it as soon as possible. Pull requests are also welcome!

## Running Locally

If you'd like to take shotplot for a spin, head over to [shotplot.app](https://www.shotplot.app/?ref=github).

Feel like playing around with the code?
1.  Clone this repo
2.  Install node
```
nvm use
```
3.  Install dependencies
```
npm install
```
4.  Run development mode
```
npm run dev
```

5.  Build production output
```
npm run prod
```

## Testing

Use two layers of automated testing:
- `Vitest` for fast unit coverage of repository-owned logic
- `Playwright` for full browser flows, rendering interactions, and pagination/export behavior
- GitHub Actions runs both layers on every pull request and on pushes to `main`

Run the Vitest unit suite:
```
npm run test:unit
```

Run the JavaScript lint and SCSS style checks:
```
npm run lint
npm run lint:styles
```

Run the Vitest suite with coverage:
```
npm run test:unit:coverage
```

Open Vitest in watch mode while developing:
```
npm run test:unit:watch
```

Run the Playwright end-to-end suite:
```
npm run test:e2e
```

Open Playwright in headed mode:
```
npm run test:e2e:headed
```

Open Playwright UI mode for interactive debugging:
```
npm run test:e2e:ui
```

Record a manual browser session and have Playwright generate test code:
```
npm run test:e2e:codegen
```

The recorder defaults to a `1920x1080` viewport. Override it when needed:
```
npm run test:e2e:codegen -- --viewport-size="1440,900"
```

### Customization
Rename the `.env-sample` file to `.env` and add in values for your environment. `ROOT_URL` is the base URL of your deployed project and `GTMID` is your ID for Google Tag Manager.
