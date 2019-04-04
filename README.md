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
yarn install
```
4.  Run development mode
```
yarn dev
```

### Customization
Rename the `.env-sample` file to `.env` and add in values for your environment. `ROOT_URL` is the base URL of your deployed project and `GTMID` is your ID for Google Tag Manager.
