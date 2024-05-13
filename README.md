# Propmaster

Ugly but functional transformation pipelines for arrays full of Javascript objects, with a specific emphasis on processing web crawler data.

## What It Does

Fold, spindle, mutilate. This section needs to be written, but the jist of it is:

- Wrap JS objects in a lightweight proxy that makes it easy to:
  1. Check, retrieve, and alter properties using dot notation paths
  2. Check and transform individual properties' data types (split a string, join an array, format a number, parse dates in many formats, etc)
  3. Populate an existing property or create a new one with a literal value, a value pulled from another property, *or* the first matching value from an entire list of properties where the data *might* live.
- Capture capture a long series of those processing steps as:
  1. Fluent, chainable JS code
  2. A text-based DSL
- Apply those pipelines to many objects at a time

## Why Not Some Other Tool?

Object validation and parsing tools (like [Zod](https://zod.dev), [Joi](https://joi.dev), [Superstruct](https://docs.superstructjs.org), etc.) are great for ensuring **untrusted user input or freshly parsed JSON** data *conforms to a specific shape*. If your data is in a bunch of different shapes and you want to normalize it, you end up writing separate parser/validators for each scenario.

Data transformation and analysis tools (like [Danfo.js(https://danfo.jsdata.org)], [Data-Forge](http://www.data-forge-js.com), [DTL](https://getdtl.org), etc.)) are great for cleaning up and summarizing **consistently-structured but mixed-quality data**. If the data lives in lots of different places (say, scattered across a bunch of different object-shapes, buried in substrings of longer text properties, etc), code written with them gets ugly — fast.

In short, neither of these approach is a great fit if you have a target data shape, but the values are scattered in *very differeent places* across lots of incoming objects. This problem comes up a lot when we crawl and analyze web sites: "the publication date" might live in HTTP response headers, fragments of the URL, OpenGraph META tags, or an arbitrary `<div>` inside the page's own markup; indeed, it usually lives in different places from one part of a given site to another. Now repeat that for author names, topics, page performance metrics, and a million other bits.

The simplest one-off approach is to write some sort of custom 'processing' function that contains a giant tangle of if/then checks, case statements, and disposable data scrubbing code. That's fine if you only need to do it once, but repeating that process for slightly different datasets, over and over, is a pain.

For us, Propmaster has simplified that work considerably.
