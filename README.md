# ![CornerstoneCMS](http://mlrawlings.com/experiments/cornerstone/cornerstone-logo-small.png)
[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

## Getting Started
CornerstoneCMS is a lightweight and extensible cms/cmf powered by [node.js](https://nodejs.org/) and [mongodb](https://www.mongodb.org/), so make sure you have both installed.

### Install via generator
[![NPM](https://nodei.co/npm/generator-cornerstone.png?mini=true)](https://www.npmjs.com/package/cornerstone-cms)

The fastest way to get started with CornerstoneCMS is to use the [yeoman](http://yeoman.io/) generator.  We recommend this approach if you are starting a new project and just need a simple cms.  

To begin, make sure you have installed the `yo` command line utility:
```
npm install -g yo
```

...and the CornerstoneCMS generator (`generator-cornerstone`):
```
npm install -g generator-cornerstone
```

Now, run `yo cornerstone` from your command line to generate the project.  

By default, [Templates](#templates) are stored in, and automatically loaded from, the `/templates` directory and  [Collections](#collections), from `/collections`.  The `/public` directory is home to any publicly available assets such as images and stylesheets.  And the `/uploads` directory is the destination for any user uploaded images or other content.

Run your project by calling `npm start` from the command line.

### ...or Install via npm
[![NPM](https://nodei.co/npm/cornerstone-cms.png?mini=true)](https://www.npmjs.com/package/cornerstone-cms)

You can also install CornerstoneCMS from npm if you're adding it to an existing project or want to have more control over the way things are set up.

```javascript
var express = require('express');
var cornerstone = require('cornerstone-cms');
var app = express();

cornerstone.connect('mongodb://localhost/mysite');
cornerstone.loadTemplates(__dirname + '/templates');  //load all .html files in templates directory
cornerstone.loadCollections(__dirname + '/collections'); //load all .js files in collections directory
cornerstone.setUploadsDirectory(__dirname + '/uploads');

app.use(static('/public'));
app.use(cornerstone.express());
app.listen(8080);
```


## Using CornerstoneCMS

### Templates
Templating in CornerstoneCMS is built upon [marko](http://markojs.com/).  A template is a `.marko` file that contains html and custom marko tags.  It can be used (an reused) to make pages from within the cms admin. You have full access to the features of marko.  Additionally, CornerstoneCMS adds some custom tags and attributes to allow developers to make templates editable and pull in data from collections with minimal effort.

#### Editable Tags
Have an `<h2>` that needs to be editable? Simply specify that `text` is editable and add a unique `id`!
```html
<!--original-->
<h2 class="sub-heading">This is my default heading</h2>

<!--editable-->
<h2 id="heading-1" editable={ text } class="sub-heading">This is my default heading</h2>
```

Need to edit more than one property?
```html
<a id="some-link" editable={ text, href }></a>
```

Want to nest editable content?
```html
<a id="feature-link" editable={ href }>
    <h3 id="feature-header" editable={ text } />
    <img id="feature-img" editable={ src } />
    <p id="feature-description" editable={ text } />
</a>
```

Don't want the `id` attribute in the actual output? Use `_id`!
```html
<a _id="some-link" editable={ text, href }></a>
```

##### Scope
By default, editable tags are scoped to the current page which means editing the tag on one page will not change the value of the tag on another page.  By adding `scope="site"` to an editable tag, the tag will now be scoped to the site.  This means whenever the tag's value is changed, it will be changed on every page in the site.
```html
<img id="site-logo" editable={ img } scope="site" />
```

##### Options
To pass additional options to an editable type, set an options object on the property:
```html
<img id="feature-image" editable={ img:{ ratio:16/9, maxwidth:1920 } } />
```

##### Editable Tag Types

CornerstoneCMS ships with 4 built-in editable tag types: 
- `text` allows you to edit the text content of an element.  It also  allows basic formatting for the text, 
depending on the tag that it is specified on.
    - `<h1>`-`h6`: ![link]
    - `<div>`: ![bold], ![italic], ![link], ![ordered list], ![unordered list], ![blockquote]
    - `<p>`, `<span>`, (& `<a>`): ![bold], ![italic], ![link]
    - Any tag wrapped in an `<a>` will not have the ![link] option as the link destination will be handled by the `href` type should it be editable
- `src` and `background-image` allow the user to specify or upload an image
- `href` allow the user to change where a link points

These types can be added to (or replaced) either by creating your own types or installing [plugins](#plugins) created by the community.

#### Menu


#### Collection Queries
The `<collection>` tag provides a way to get data out of [collections](#collections) and onto the page.  Specify the collection name and a query will be made with the passed options, the contents of the tag will be looped over in a `forEach` fashion for every result of the query:
```html
<ul class="post-list">
    <collection(post in "Posts") filter={ isPublished:true } limit=4>
    	<li>${post.title}</li>
    </collection>
</ul>
```
##### Query Options
- `filter`: a [mongodb query object](https://docs.mongodb.org/manual/tutorial/query-documents/) (e.g. `{ isPublished:true }`) or a [named filter](#named-filters) (e.g. `"Published"`).
- `sort`: a [string or object](http://mongoosejs.com/docs/api.html#query_Query-sort) indicating sort order (e.g `{ date:-1 }`)
- `skip`: a number indicating how many records to skip before returning results
- `limit`: a number indicating the maximum records to return
- `select`: an [string or object](http://mongoosejs.com/docs/api.html#query_Query-select) indicating which fields to return (e.g. `{ title:1 }`)

#### Globals
There are certain "global" variables that all templates have access to:
- `site`: any data associated with the site
- `page`: any data associated with the page
- `qs`: the parsed querystring from the url

#### Registering a Template
To register a template and make it available for creating pages within the cms admin, it must use the `<export>` tag to export a unique `id` and a `name` to display within the cms admin:
```html
<export id="test-1" name="Test Template 1" />
```
Then, call `cornerstone.registerTemplate(require([path to template]))` or register all `.marko` files in a directory (that export a `name` and `id`) using `cornerstone.loadTemplates([path to templates directory])`.

### Collections
Collections in CornerstoneCMS are built upon [Mongoose](http://mongoosejs.com/).  Collections provide a way to manage and view custom, structured data for a site.  Some common uses for collections would include users, blog posts, and contact form submissions.  Collection data is available to view and manage from within the cms admin, and it is also available to display from templates using the [`<collection>` tag](#collection-queries).

#### Defining a Collection


```javascript
// basic collection definition
var Posts = {
    name:'Posts',
    schema: {
        title:'Text',
        date:{ type:'Date', default:() => new Date() },
        content:'FormattedText',
        author:{ type:'Reference', ref:'Authors' }, 
        published:'Boolean',
    }
});
```

##### Schema Definition
The schema defines the collection's fields, their types, defaults, constraints, etc.

###### Schema Types
- Text Types:
    - `Text` - plain text
    - `LongText` - multiline plain text
    - `FormattedText` - multiline formatted(![bold], ![italic], ![link], ![ordered list], ![unordered list], ![blockquote]) text
    - `Email`
    - `Phone`
- Date Types:
    - `Date` - a date, e.g. **2000-01-01**
    - `Time` - a time, e.g. **17:00:01.85 GMT**
    - `DateTime` - a date/time, e.g. **2000-01-01 17:00:01.85 GMT**
- Number Types:
    - `Number`
    - `Integer`
    - `Currency`
- Other Types:
    - `Image`
    - `Color`
    - `File`
    - `Boolean` - a simple true/false, yes/no, on/off value
    - `Reference` - a reference to an object in another collection
    - `Password` - uses a masked (type="password") field client-side and bcrypts the value before saving
    - `Any` - allows any data in any format. displayed as a JSON textarea.

##### Named Filters
Named filters provide a tabbed interface within the cms admin to view filtered lists.  To define a named query add the name as a key in the `filters` object on the collection definition, and a [mongodb query object](https://docs.mongodb.org/manual/tutorial/query-documents/) as the value:
```javascript
var Posts = {
    name:'Posts',
    schema: { /*...*/ },
    filters: {
        'Published':{ published:true },
        'Drafts':{ published:false }
    }
});
```
Named filters may also be used from a [`<collection>` tag](#collection-queries) instead of specifying the equivalent mongodb query. 

#### Registering a Collection
To register a collection and make it available within the cms admin and templates, call `cornerstone.registerCollection([collection definition])` or register all `.js` files in a directory using `cornerstone.loadCollections([path to collections directory])`


#### Advanced Usage of Collections

##### Mongoose

Once a collection is registered with CornerstoneCMS, you can access the underlying Mongoose model via its collection name: 
```javascript
var mongoose = require('mongoose');
var Post = mongoose.model('Posts');
```

##### API & Access Control

When a collection is created, an api endpoint is also created at `/api/${collection_name}`, however this can be configured to another path.  By default, a collection endpoint is unavailable when logged out, and full access when logged in.  This can be configured with an access function on the collection which will be passed the current user object.  The example below would make a collection read-only when logged out, full access when logged in.

```javascript
var Posts = {
    name:'Posts',
    schema: { /*...*/ },
    access: (user) => {
        if(!user) return { read:true }
        
        return { create:true, read:true, update:true, delete:true }
    }
});
```



## Extending CornerstoneCMS

### Plugins
dfdgdsgfsd


### Collection Field Types


### Editable Tag Types
By default, CornerstoneCMS comes with 4 editable types for templates: [`text`](#hi), [`src`](#hi), [`background-image`](#hi), and [`href`](#hi).  View the implementation of each of these types to understand how additional types may be implemented.

## API
```javascript
cornerstone.registerPage('Page Name', '/page/path'); 
// register a developer created page that can be accessed from the pages section 
// within the cms admin and included in the site wide menu.

cornerstone.loadTemplates(__dirname + '/templates');
cornerstone.registerTemplate('/path/to/template.html', options); 

cornerstone.loadCollections(__dirname + '/collections');
cornerstone.registerCollection(require('/path/to/collection'));

cornerstone.loadWidgets(__dirname + '/widgets');
cornerstone.registerWidget('member-list', __dirname + '/widgets/member-list.html');

cornerstone.registerPublicPath('/', __dirname + '/public');
cornerstone.registerUploadPath('/uploads', __dirname + '/uploads');
```

## License

MIT, see [LICENSE.md](http://github.com/mlrawlings/cornerstone/blob/master/LICENSE.md) for details.

[bold]:https://storage.googleapis.com/material-icons/external-assets/v2/icons/svg/ic_format_bold_black_24px.svg
[italic]:https://storage.googleapis.com/material-icons/external-assets/v2/icons/svg/ic_format_italic_black_24px.svg
[ordered list]:https://storage.googleapis.com/material-icons/external-assets/v2/icons/svg/ic_format_list_numbered_black_24px.svg
[unordered list]:https://storage.googleapis.com/material-icons/external-assets/v2/icons/svg/ic_format_list_bulleted_black_24px.svg
[blockquote]:https://storage.googleapis.com/material-icons/external-assets/v2/icons/svg/ic_format_quote_black_24px.svg
[link]:https://storage.googleapis.com/material-icons/external-assets/v2/icons/svg/ic_link_black_24px.svg

