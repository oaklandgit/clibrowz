#!/usr/bin/env bun

import meow from "meow"
import { takeScreenshot } from "./grab"
import { prepareThenRenderImage } from "./render"

const SCREENSHOT = "screenshot.png"

const cli = meow("Clibro", {
  importMeta: import.meta,
  flags: {
    width: {
      type: "number",
      shortFlag: "w",
      default: 1280,
    },
    height: {
      type: "number",
      shortFlag: "h",
      // empty for full page
    },
    scale: {
      type: "number",
      shortFlag: "s",
      default: 1,
    },
  },
})

// const patterns = {
//   url: /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g,
//   code: /^[DU]$/g,
//   label: /[0-9]/g,
// }

const urlPattern =
  /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g
const labelPattern = /[0-9]/g

const handleUserInput = (input) => {
  if (urlPattern.test(input)) {
    console.log(`Grabbing ${input}...`)
    handleUrl(input)
  } else if (input === "D") {
    console.log("Scrolling down...")
  } else if (input === "U") {
    console.log("Scrolling up...")
  } else if (labelPattern.test(input)) {
    console.log(`Loading link labeled ${input}.`)
  } else {
    console.log(`Invalid input: ${input}. Try 'bro --help' for help.`)
  }
}

const handleUrl = async (url) => {
  const pageDetails = await takeScreenshot(url, SCREENSHOT, {
    w: cli.flags.width,
    h: cli.flags.height,
    s: cli.flags.scale,
  })
  prepareThenRenderImage(pageDetails, SCREENSHOT)
}

handleUserInput(cli.input[0])
