# Dynamic Bootstrap Responsive Tabs

Dynamic Bootstrap Responsive Tabs is an extension to existing jQuery Bootstrap Responsive Tabs. This adds ability of adding new tabs on the fly.


## Demo
Open demo/index.html with your internet browser.


## Requirements
- Bootstrap: 3+
- jQuery: 1.9+
- Bootstrap Responsive Tabs

## Installation
Dynamic Bootstrap Responsive Tabs is available on [Bower](https://github.com/bower/bower):

```bower install dynamic-bootstrap-responsive-tabs```

## Usage
The JS:
```
$(".js-tabs-example").dynamicBootstrapResponsiveTabs({
    minTabWidth: "100",
    maxTabWidth: "200"
});
```

The HTML:
```
<ul class="nav nav-tabs js-tabs-example">
  <li class="active"><a href="#tab1" data-toggle="tab">Tab1</a></li>
  <li><a href="#tab2" data-toggle="tab">Tab2</a></li>
  <li><a href="#tab3" data-toggle="tab">Tab3</a></li>
  <li><a href="#tab4" data-toggle="tab">Tab4</a></li>
  <li><a href="#tab5" data-toggle="tab">Tab5</a></li>
</ul>
```

The Add method:
```
$(".js-tabs-example").dynamicBootstrapResponsiveTabs('addTab', {
    id: "foo", // will be data-id attribute
    target: "bar" // will be the target tab-content as well as id of the tab-content
});
```

## Options
A tab can have minimum and maximum width, when the screen stretches more than 480px.

```minTabWidth```: The minimum width of each tab.

```maxTabWidth```: The maximum width of each tab.


## Credits
This is heavily based and dependent on [gabrieltomescu/bootstrap-responsive-tabs](https://github.com/gabrieltomescu/bootstrap-responsive-tabs.git) awesome jQuery plugin.

## License
MIT license, see the LICENSE file for full details.
