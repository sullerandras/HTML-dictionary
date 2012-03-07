HTML-Dictionary
===============

An experiment that is it possible to parse wiktionary.org's dump
to build an english-something dictionary. I'm interested in Thai,
so this is what you can see here.

How to run the parser
---------------------

1.  Download `enwiktionary-latest-pages-articles.xml.bz2` from here (more than 200MB): [dumps](http://dumps.wikimedia.org/enwiktionary/latest/)
2.  Uncompress it (more than 2GB)
3.  Move it to the project folder as `wiktionary-full.txt`
4.  Type `node parse_wiktionary.js`
5.  It creates the file `dict-th.js` in about 6 minutes in my machine.

