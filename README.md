Basic example. You have to run this on localhost:3000 if you want to
try it because the `Origin` header on the request of the font needs
to match the allowed hosts on the CORS side (it doesn't have * for
allowed hosts). If you have ruby installed, just run:

```ruby
ruby -run -e httpd . -p 3000
```

And then go to [http://localhost:3000/](http://localhost:3000/) and
the fonts should load. Use a Chrome incognito window to test it --
you have to cloe all the incognito windows to reset the local cache
(so anytime you want to reset, make sure you close all the windows
or clear the cache another way).
