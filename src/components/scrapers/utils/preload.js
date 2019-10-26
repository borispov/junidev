// overwrite the `languages` property to use a custom getter
Object.defineProperty(navigator, "languages", {
  get: function() {
    return ["en-US", "en"];
  };
});

// overwrite the `plugins` to have length greater than 0 
Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });

Object.defineProperty(navigator, 'webdriver', { get: () => false, });

Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
