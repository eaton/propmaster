# Propmaster

Ugly but functional object mutation and manipulation pipelines.

## What it's for

Imagine you have a pile of data objects full of highly variable nested properties — maybe parsed JSON files, or the results of a DOM query. I don't know your life, and I don't judge. In my case, it's parsed HEAD/META properties from a pile of web sites. The shape of the data is *roughly* predictable, but record by record it's all over the place.

Now imagine you want to map that kind-of-similar but different-in-the-details data to something more consistent. In the case of my HTML headers example, it might be "finding the creation / modification dates for each record." Without even considering date *formats*, there are literally dozens of places where that data *might* be tucked: OpenGraph meta tags, analytics tags, HTTP headers, and so on. What you need to do is check each one in turn, grab the first one that's parsable, and treat it as "The Date." Then, repeat that for a zillion other little bits like keywords and titles and author names and so on.

 In theory, that's as simple as `const myCleanData = myPileOfObjects.map(o => // magic goes here )`, but when the incoming data is highly variable, the stuff that happens inside that mapping function quickly turns into a nightmare of spaghetti code, type checks, and ugly split/replace/join chains. It's easy to accumulate a bunch of single-use-only glue code. That problem isn't a great fit for any of the high-quality data transformation tools out there, *or* any of the parsing and validation libraries. Enter Propmaster.

## How it works

## Usage

## Caveats
