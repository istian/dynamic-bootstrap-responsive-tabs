(function($) {
  $.fn.dynamicBootstrapResponsiveTabs = function(options) {

    var self = $(this);

    var settings = $.extend({
      minTabWidth: "80",
      maxTabWidth: "150",
      tabContentContainer: ".tab-content"
    }, options);

    var _generateTabNavTpl = function(args) {
      var activeClass = args.is_active || '';
      return '<li role="presentation" class="' + activeClass + '" data-id="tab-nav-' + args.id + '">' +
        '<a href="#' + args.target + '" aria-controls="' + args.target + '" ' +
        'role="tab" data-toggle="tab">' + args.label + '</a></li>';

    }

    var _generateTabContentTpl = function(args) {
      return  '<div role="tabpanel" class="tab-pane" id="' + args.target + '"></div>';
    }

    var addTab = function(args) {
      var orgHtml = self.html();
      var tmp = _generateTabNavTpl(args);
        // orgHtml += _generateTabNavTpl(args);

      if ($('[data-id="tab-nav-' + args.id + '"]').length > 0) {
        return false;
      }

      self.append(tmp);
      $(settings.tabContentContainer).append(_generateTabContentTpl(args));

      _setup();

    }

    var TABS_OBJECT = $('.responsive-tabs');
    TABS_OBJECT.tabsHorizontalContainer = self;
    TABS_OBJECT.tabsVerticalContainer = TABS_OBJECT.tabsHorizontalContainer.siblings(".tabs-dropdown").find(".dropdown-menu");

    var _updateTabs = function() {

      var menuWidth = TABS_OBJECT.tabsHorizontalContainer.width();
      var $tabs = TABS_OBJECT.tabsHorizontalContainer.children('li');
      $tabs.width('100%');

      // Set min and max widths for tabs
      // On mobile devices smaller than 480px wide, remove min/max width restriction
      if (window.innerWidth < 480) {
        $tabs.each(function(i) {
          $(this)
            .css("min-width", 0)
            .css("max-width", "none");
        });
      } else {
        $tabs.each(function(i) {
          $(this)
            .css("min-width", settings.minTabWidth +
              "px")
            .css("max-width", settings.maxTabWidth +
              "px");
        });
      }

      var defaultTabWidth = $tabs.first().width();
      var numTabs = $tabs.length;

      var numVisibleHorizontalTabs = (Math.ceil(menuWidth /
        defaultTabWidth));
      var numVisibleVerticalTabs = numTabs -
        numVisibleHorizontalTabs;

      for (var i = 0; i < $tabs.length; i++) {
        var horizontalTab = $tabs.eq(i);
        var tabId = horizontalTab.attr("tab-id");
        var verticalTab = TABS_OBJECT.tabsVerticalContainer
          .find(".js-tab[tab-id=" + tabId + "]");
        var isVisible = i < numVisibleHorizontalTabs;

        horizontalTab.toggleClass('hidden', !isVisible);
        verticalTab.toggleClass('hidden', isVisible);
      }

      // Set new dynamic width for each tab based on calculation above
      var tabWidth = 100 / numVisibleHorizontalTabs;
      var tabPercent = tabWidth + "%";
      $tabs.width(tabPercent);

      // Toggle the Tabs dropdown if there are more tabs than can fit in the tabs horizontal container
      var hasVerticalTabs = (numVisibleVerticalTabs > 0)
      TABS_OBJECT.tabsVerticalContainer.toggleClass(
        "hidden", !hasVerticalTabs)
      TABS_OBJECT.tabsVerticalContainer.siblings(
        ".dropdown-toggle").find(".count").text("Tabs " +
        "(" + numVisibleVerticalTabs + ")");

      // Make 'active' tab always visible in horizontal container
      // and hidden in vertical container

      activeTab = TABS_OBJECT.tabsHorizontalContainer.find(
        ".js-tab[tab-id=" + TABS_OBJECT.activeTabId + "]"
      );
      activeTabCurrentIndex = activeTab.index();
      activeTabDefaultIndex = activeTab.attr("tab-index");
      lastVisibleHorizontalTab = TABS_OBJECT.tabsHorizontalContainer
        .find(".js-tab:visible").last();
      lastVisibleTabIndex = lastVisibleHorizontalTab.index()

      lastHiddenVerticalTab = TABS_OBJECT.tabsVerticalContainer
        .find(".js-tab.hidden").last();
      activeVerticalTab = TABS_OBJECT.tabsVerticalContainer
        .find(".js-tab[tab-index=" + activeTabCurrentIndex +
          "]");

      if (activeTabCurrentIndex >= numVisibleHorizontalTabs) {
        activeTab.insertBefore(lastVisibleHorizontalTab);
        activeTab.removeClass("hidden");
        lastVisibleHorizontalTab.addClass("hidden");

        lastHiddenVerticalTab.removeClass("hidden");
        activeVerticalTab.addClass("hidden");
      }

      if ((activeTabCurrentIndex < activeTabDefaultIndex) &&
        (activeTabCurrentIndex < lastVisibleTabIndex)) {
        activeTab.insertAfter(lastVisibleHorizontalTab);
      }
    }

    var _setup = function() {
      // Reset all tabs for calc function
      var totalWidth = 0;
      var $tabs = TABS_OBJECT.tabsHorizontalContainer.children(
        'li');

      // Stop function if there are no tabs in container
      if ($tabs.length === 0) {
        return;
      }

      // Mark each tab with a 'tab-id' for easy access
      $tabs.each(function(i) {
        tabIndex = $(this).index();
        $(this)
          .addClass("js-tab")
          .attr("tab-id", i + 1)
          .attr("tab-index", tabIndex);
      });

      // Attach a dropdown to the right of the tabs bar
      // This will be toggled if tabs can't fit in a given viewport size

      TABS_OBJECT.tabsHorizontalContainer.after(
        "<div class='nav navbar-nav navbar-right dropdown tabs-dropdown js-tabs-dropdown'> \
        <a href='#' class='dropdown-toggle' data-toggle='dropdown'><span class='count'>Tabs </span><b class='caret'></b></a> \
        <ul class='dropdown-menu' role='menu'> \
        <div class='dropdown-header visible-xs'>\
          <p class='count'>Tabs</p> \
          <button type='button' class='close' data-dismiss='dropdown'><span aria-hidden='true'>&times;</span></button> \
          <div class='divider visible-xs'></div> \
        </div> \
        </ul> \
      </div>"
      );

      // Clone each tab into the dropdown
      TABS_OBJECT.tabsVerticalContainer = TABS_OBJECT.tabsHorizontalContainer
        .siblings(".tabs-dropdown").find(".dropdown-menu");
      TABS_OBJECT.tabsVerticalContainer.empty().append($tabs.clone());

      // Update tabs
      _updateTabs();
    }

    var init = function() {
      self.each(function() {
        var me = $(this);
          me.bootstrapResponsiveTabs(settings);
      });
    }

    var publicMethods = {
      init: init,
      addTab: addTab
    }

    if (publicMethods[options]) {
      return publicMethods[ options ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if (typeof options === 'object' || ! options) {
      return publicMethods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  options + ' does not exist on jQuery.dynamicBootstrapResponsiveTabs' );
    }

  }
})(jQuery);
