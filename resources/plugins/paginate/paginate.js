$.fn.paginate = function(settings) {
    //A convenient way to refer to the top level parent function ($.fn.paginate/targeted jQuery element) while inside another function (say, this.constructor)
    var self = this;    
    //Globals
    self.book = new Array();
    self.currentPage = 1;
    self.settings = settings;
    //Constructor function
    self.constructor = function() {
		if($(self).children().length > 0){
			//Loop through all div elements
			$(self).children().each(function() {
				//Except script elements, because fuck script elements. That's why
				//But really, they ruin the pagination since they aren't visible content            
				if ($(this).is("script")) {
					return;
				}
				//If the current page doesn't exist in the book (because we moved to the next page) ...
				if (!self.book[self.currentPage]) {
					//...then create the page
					self.book[self.currentPage] = [];
				}
				else {
					//Otherwise the page exists, so let's see if we've maxed out the items per page limit...
					if ((self.book[self.currentPage].length % self.settings.itemsPerPage) == 0) {
						//..Indeed we have, so we move to the next page...
						self.currentPage++;
						self.book[self.currentPage] = [];
					}
				}
				//Hide the current element
				$(this).hide();
				//At this point we should be on the right page, so we'll add the current element into that page.
				self.book[self.currentPage].push(this);
			});
			//Finally, get the show on the road
			self.showPage(1);
			//Initialize searchBox
			if(self.settings.searchBox){
				$(self.settings.searchBox).unbind().attr("placeholder","Type at least three letters to search...").keyup(function(){
					//Search Text
					var searchText = $(this).val();
					//If we have more than 3 characters...
					if(searchText.length >= 3){
						//Clear the deck
						$(self).empty();
						//Show all pages
						$.each(self.book,function(pageNumber,pageContent){						
							for(i in pageContent){							
								for(x in pageContent){
									//Get the currentPageItem
									var currentPageItem = pageContent[x];								
									//Add the current_page_excerpt to the targeted element
									$(self).append($(currentPageItem).hide());
								}
							}
						});
						//Attribute Search Search
						var attributeSearch = $(self).find("[title*='"+ searchText +"'],[description*='"+ searchText +"']");
						//Song Search
						var contentSearch = $(self).find("div:contains('"+ searchText +"')");
						//Show the Searched results
						$.merge(attributeSearch,contentSearch).show();
						//Run callBack if it's available
						if(settings.paginationCallback){
							settings.paginationCallback(); 
						}		
					}
					
					if(searchText.length == 0){
						self.showPage(1);
					}
				});
			}		
		}
    }
    //Function used to show a particular page
    self.showPage = function(pageNumber) {
        //Clear the deck
        $(self).empty();
        //Load the page the user want's to see from the list of pages
        var pageContent = self.book[pageNumber];
        //Loop through the page content
        $.each(pageContent, function(i,currentPageItem) {
            //Show the currentPageItem
            $(currentPageItem).show();
            //Add the current_page_excerpt to the targeted element
            $(self).append(currentPageItem);
        });
        //Remove any existing .paginationContainer element
        $(self).find(".paginationContainer").remove();
        //Create the paginationContainer
        self.paginationContainer = $("<div>").attr("class","paginationContainer").css({
            "float":"left",
            "clear":"both",
            "margin":"8px",
            "display": "inline",
			"border":"solid 1px rgb(108,115,245)"
        });
        //Loop through the entire book to create the pagination elements
        for (i in self.book) {
            //Create the page number
            var pageNumberElement = $("<div>").text(i).attr({
                "pageNumber": i,
                "class": "excerptPagination"
            });
            //Style it
            $(pageNumberElement).css({
                "float":"left",
				"width":"28px",
                "padding":"4px",
                "display":"inline",
                "cursor":"pointer",
				"text-align":"center",
				"color":"rgb(255,255,255)",
                "background": "rgb(108,115,245)"
            });
            //Highlight if the current page matches the requested page number
            if (i == pageNumber) {
                $(pageNumberElement).css({
					"background":"none",
					"color":"rgb(0,0,0)"
				});
            }
            //Add the click event
            $(pageNumberElement).click(function() {
                //Go to the current page
                self.showPage($(this).attr("pageNumber"));
				//Scroll Top
				$(self).children().first().goTo();				
            });
            //Only show up to Page 10
            if (i <= 10) {
                //Add the page number
                $(self.paginationContainer).append(pageNumberElement);
            }
        }
        //If there are more than 10 pages, add a convenient little drop down
        if (self.book.length >= 10) {
            //Create the pageNumberDropdown
            var pageNumberDropdown = $("<select>").change(function() {
                self.showPage($(this).val());
            });
            //Style it
            $(pageNumberDropdown).css({
                "float": "left",
                "height": "25px",
                "padding": "0px",
                "display": "inline",
                "cursor": "pointer"
            });
            //Add the pageNumber options
            for (i = 11; i < self.book.length; i++) {
                $(pageNumberDropdown).append(
                    $("<option>").attr("value", i).text(i)
                );
            }
            
            //Only show pageNumberDropdown if it has stuff in it
            if($(pageNumberDropdown).find("option").length > 0){
                $(self.paginationContainer).append(pageNumberDropdown);
            }
        }
        //And then, when it is done, you have my permission to insert the paginationContainer on the page
        $(self.paginationContainer).insertAfter(
            $(self).children().last()
        );
        //Highlight the current page number
        $(self).find(".paginationContainer select").val(pageNumber);
        $(self).find(".excerptPagination[pageNumber='" + pageNumber + "']").css("font-weight", "bold");
        //Run callBack if it's available
        if(settings.paginationCallback){
            settings.paginationCallback(); 
        }
    }
    //Run the constructor
    self.constructor();
}