## We are Professionals

* We write **reliable** code.
  * Our code performs its intended function.
  * Our code accounts for "edge" cases — realizing that if a code path exists, it will eventually execute.
  * We prefer simpler solutions because simplicity implies reliability — complexity is introduced only as needed.
* We write **maintainable** code.
  * We realize that computers execute code but humans read and curate code.
  * We care about the big picture (e.g. architecture and system design).
  * We care about details (e.g. variable names and code formatting).
* We build **well-documented** products.
  * In source code public-facing objects and functions are documented.
  * In source control repositories we write ```README``` files.
  * For customer-facing products, we build (and maintain) documentation sites (like this).

## How to Write

You may be a software engineer or a product manager, but you are also a **technical writer**. When we document our work, our goals are to:

* convey information **quickly**,
* convey information that is **needed**, and
* convey information in a way that is **easy to comprehend**.

### General Considerations

**Be concise. Be direct.** Using fewer words is generally best.

**Be comprehensive.** Make sure and cover all important topics.

**This is the 21st century** — we have been trained to search for answers and skim the results. It's painful to read an entire paragraph. We need to recognize that fact. Structure your documentation accordingly.

**Put yourself in your readers shoes.** Consider how someone — who is unfamiliar with your product — can get an running as soon as possible. Don't assume your reader knows what you know.

**Use proper grammar**. If you can write code, you can write documentation.

**Proofread. Check your spelling.** We strive for perfection, but we all make mistakes. It's advisable to have someone else read your documentation.

**Take responsibility** for correcting mistakes and omissions.

## What to Write

### Write Code Comments

Most programming languages have generally-accepted syntax for documenting objects, functions, properties, and arguments with comments. For example:

* Java has [Javadoc](https://en.wikipedia.org/wiki/Javadoc)
* JavaScript has [JSDoc](https://en.wikipedia.org/wiki/JSDoc)
* C# has [XML Comments](https://docs.microsoft.com/en-us/dotnet/csharp/codedoc)

### Write a README.md file

Add a README.md file to source control. It should include:

* a short description of the product,
* a "badge" icon from your continuous integration tool,
* for public-facing products, a link to your formal documentation site (like this one),
* for private-facing products, formal documentation isn't necessary, but please include quick-start information in the README file itself.

### Write a Formal Site

For public-facing products, write formal documentation site (using this tool).

The site should include a **Product Overview** page for non-technical audiences and a **Quick Start** page targeted at technical audiences.

Optionally, add **SDK Reference** and **API Reference** sections.
